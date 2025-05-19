"""
Serviço para análise de documentos.
"""
import os
import json
import shutil
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from avaliadores_crew.crew import AvaliadoresCrew
from avaliadores_crew.api.services.mock_analysis import MockAnalysisService
from avaliadores_crew.api.config import settings
from avaliadores_crew.api.models.db_models import Solicitacao, ResultadoAnalise, StatusSolicitacao, TipoDocumento

class DocumentAnalysisService:
    """Serviço para análise de documentos."""

    @staticmethod
    def save_uploaded_file(file, tipo_documento: TipoDocumento) -> str:
        """
        Salva o arquivo enviado no diretório de documentos.

        Args:
            file: Arquivo enviado pelo usuário
            tipo_documento: Tipo de documento

        Returns:
            str: Caminho para o arquivo salvo
        """
        # Criar diretório de documentos se não existir
        os.makedirs(settings.DOCUMENTS_FOLDER, exist_ok=True)

        # Gerar nome de arquivo único
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        file_path = os.path.join(settings.DOCUMENTS_FOLDER, filename)

        # Salvar arquivo
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return file_path

    @staticmethod
    def create_solicitacao(db: Session, tipo_documento: TipoDocumento, nome_arquivo: str, caminho_arquivo: str) -> Solicitacao:
        """
        Cria uma nova solicitação no banco de dados.

        Args:
            db: Sessão do banco de dados
            tipo_documento: Tipo de documento
            nome_arquivo: Nome do arquivo
            caminho_arquivo: Caminho para o arquivo

        Returns:
            Solicitacao: Objeto da solicitação criada
        """
        solicitacao = Solicitacao(
            tipo_documento=tipo_documento,
            nome_arquivo=nome_arquivo,
            caminho_arquivo=caminho_arquivo,
            status=StatusSolicitacao.PENDENTE
        )
        db.add(solicitacao)
        db.commit()
        db.refresh(solicitacao)
        return solicitacao

    @staticmethod
    def update_solicitacao_status(db: Session, solicitacao_id: int, status: StatusSolicitacao,
                                 task_id: Optional[str] = None, erro: Optional[str] = None) -> Solicitacao:
        """
        Atualiza o status de uma solicitação.

        Args:
            db: Sessão do banco de dados
            solicitacao_id: ID da solicitação
            status: Novo status
            task_id: ID da tarefa no Celery (opcional)
            erro: Mensagem de erro (opcional)

        Returns:
            Solicitacao: Objeto da solicitação atualizada
        """
        solicitacao = db.query(Solicitacao).filter(Solicitacao.id == solicitacao_id).first()
        if not solicitacao:
            return None

        solicitacao.status = status

        if status == StatusSolicitacao.EM_PROCESSAMENTO:
            solicitacao.data_inicio_processamento = datetime.utcnow()
            if task_id:
                solicitacao.task_id = task_id

        elif status == StatusSolicitacao.CONCLUIDO or status == StatusSolicitacao.ERRO:
            solicitacao.data_conclusao = datetime.utcnow()
            if erro:
                solicitacao.erro = erro

        db.commit()
        db.refresh(solicitacao)
        return solicitacao

    @staticmethod
    def save_analysis_result(db: Session, solicitacao_id: int, resultado: Dict[str, Any]) -> ResultadoAnalise:
        """
        Salva o resultado da análise.

        Args:
            db: Sessão do banco de dados
            solicitacao_id: ID da solicitação
            resultado: Resultado da análise

        Returns:
            ResultadoAnalise: Objeto do resultado da análise
        """
        # Obter a solicitação
        solicitacao = db.query(Solicitacao).filter(Solicitacao.id == solicitacao_id).first()
        if not solicitacao:
            return None

        # Criar diretório de resultados se não existir
        results_dir = os.path.join(settings.DOCUMENTS_FOLDER, "resultados")
        os.makedirs(results_dir, exist_ok=True)

        # Salvar resultado em arquivo JSON
        result_filename = f"resultado_{solicitacao.uuid}.json"
        result_path = os.path.join(results_dir, result_filename)

        with open(result_path, "w", encoding="utf-8") as f:
            json.dump(resultado, f, ensure_ascii=False, indent=4)

        # Criar registro de resultado
        resultado_analise = ResultadoAnalise(
            solicitacao_id=solicitacao_id,
            caminho_resultado=result_path
        )

        db.add(resultado_analise)
        db.commit()
        db.refresh(resultado_analise)

        # Atualizar status da solicitação
        DocumentAnalysisService.update_solicitacao_status(
            db=db,
            solicitacao_id=solicitacao_id,
            status=StatusSolicitacao.CONCLUIDO
        )

        return resultado_analise

    @staticmethod
    def get_analysis_result(db: Session, solicitacao_id: int) -> Dict[str, Any]:
        """
        Obtém o resultado da análise.

        Args:
            db: Sessão do banco de dados
            solicitacao_id: ID da solicitação

        Returns:
            Dict[str, Any]: Resultado da análise
        """
        resultado = db.query(ResultadoAnalise).filter(ResultadoAnalise.solicitacao_id == solicitacao_id).first()
        if not resultado:
            return None

        # Ler resultado do arquivo JSON
        with open(resultado.caminho_resultado, "r", encoding="utf-8") as f:
            return json.load(f)

    @staticmethod
    def analyze_document(caminho_arquivo: str, tipo_documento: TipoDocumento) -> Dict[str, Any]:
        """
        Realiza a análise do documento usando o AvaliadoresCrew.

        Args:
            caminho_arquivo: Caminho para o arquivo
            tipo_documento: Tipo de documento

        Returns:
            Dict[str, Any]: Resultado da análise
        """
        # Mapear tipo de documento para o formato esperado pelo AvaliadoresCrew
        tipo_doc_map = {
            TipoDocumento.CONTRATO_SOCIAL: "Contrato Social",
            TipoDocumento.BALANCO_PATRIMONIAL: "Balanço Patrimonial",
            TipoDocumento.DRE: "Demonstração de Resultado do Exercício"
        }

        # Preparar inputs para o AvaliadoresCrew
        inputs = {
            'document_type': tipo_doc_map[tipo_documento],
            'documents_folder': os.path.dirname(caminho_arquivo),
            'document_path': caminho_arquivo
        }

        # Executar análise
        try:
            print(f"[DOCUMENT_ANALYSIS] Iniciando análise. Inputs: {inputs}")

            # Verificar se o arquivo existe
            if not os.path.exists(caminho_arquivo):
                print(f"[DOCUMENT_ANALYSIS] ERRO: Arquivo não encontrado: {caminho_arquivo}")
                return {"error": f"Arquivo não encontrado: {caminho_arquivo}"}

            print(f"[DOCUMENT_ANALYSIS] Arquivo encontrado: {caminho_arquivo}")

            # Usar o serviço de análise simulado para testes
            print(f"[DOCUMENT_ANALYSIS] Chamando MockAnalysisService.analyze_document()")
            result = MockAnalysisService.analyze_document(
                caminho_arquivo=caminho_arquivo,
                tipo_documento=tipo_documento
            )

            print(f"[DOCUMENT_ANALYSIS] Análise concluída. Tipo do resultado: {type(result)}")
            return result

        except Exception as e:
            # Em caso de erro, retornar um dicionário com a mensagem de erro
            print(f"[DOCUMENT_ANALYSIS] ERRO na análise: {str(e)}")
            import traceback
            print(f"[DOCUMENT_ANALYSIS] Traceback: {traceback.format_exc()}")
            return {"error": str(e)}
