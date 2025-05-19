"""
Tarefas assíncronas para processamento de documentos.
"""
import logging
from celery import Task
from sqlalchemy.orm import Session

from avaliadores_crew.api.celery_app import celery_app
from avaliadores_crew.api.database import SessionLocal
from avaliadores_crew.api.services.document_analysis import DocumentAnalysisService
from avaliadores_crew.api.models.db_models import StatusSolicitacao, Solicitacao

logger = logging.getLogger(__name__)

class DatabaseTask(Task):
    """Tarefa base com suporte a banco de dados."""

    _db = None

    @property
    def db(self) -> Session:
        """
        Obtém uma sessão do banco de dados.

        Returns:
            Session: Sessão do banco de dados
        """
        if self._db is None:
            self._db = SessionLocal()
        return self._db

    def after_return(self, *args, **kwargs):
        """
        Método chamado após a execução da tarefa.
        Fecha a sessão do banco de dados.
        """
        if self._db is not None:
            self._db.close()
            self._db = None

    def on_failure(self, exc, task_id, args, kwargs, einfo):
        """
        Método chamado quando a tarefa falha.
        Atualiza o status da solicitação para erro.

        Args:
            exc: Exceção que causou a falha
            task_id: ID da tarefa
            args: Argumentos da tarefa
            kwargs: Argumentos nomeados da tarefa
            einfo: Informações sobre o erro
        """
        solicitacao_id = args[0] if args else kwargs.get('solicitacao_id')
        if solicitacao_id:
            try:
                DocumentAnalysisService.update_solicitacao_status(
                    db=self.db,
                    solicitacao_id=solicitacao_id,
                    status=StatusSolicitacao.ERRO,
                    erro=str(exc)
                )
            except Exception as e:
                logger.error(f"Erro ao atualizar status da solicitação {solicitacao_id}: {e}")

        super().on_failure(exc, task_id, args, kwargs, einfo)

@celery_app.task(bind=True, base=DatabaseTask)
def analyze_document_task(self, solicitacao_id: int):
    """
    Tarefa para análise de documentos.

    Args:
        solicitacao_id: ID da solicitação
    """
    print(f"[CELERY] Iniciando análise do documento para solicitação {solicitacao_id}")
    logger.info(f"Iniciando análise do documento para solicitação {solicitacao_id}")

    try:
        # Obter a solicitação
        print(f"[CELERY] Buscando solicitação {solicitacao_id} no banco de dados")
        solicitacao = self.db.query(Solicitacao).filter(Solicitacao.id == solicitacao_id).first()
        if not solicitacao:
            print(f"[CELERY] Solicitação {solicitacao_id} não encontrada")
            raise ValueError(f"Solicitação {solicitacao_id} não encontrada")

        print(f"[CELERY] Solicitação {solicitacao_id} encontrada: {solicitacao.uuid}")

        # Atualizar status para em processamento
        print(f"[CELERY] Atualizando status da solicitação {solicitacao_id} para EM_PROCESSAMENTO")
        DocumentAnalysisService.update_solicitacao_status(
            db=self.db,
            solicitacao_id=solicitacao_id,
            status=StatusSolicitacao.EM_PROCESSAMENTO,
            task_id=self.request.id
        )
        print(f"[CELERY] Status atualizado com sucesso")

        # Realizar análise
        print(f"[CELERY] Iniciando análise do documento: {solicitacao.caminho_arquivo}")
        resultado = DocumentAnalysisService.analyze_document(
            caminho_arquivo=solicitacao.caminho_arquivo,
            tipo_documento=solicitacao.tipo_documento
        )
        print(f"[CELERY] Análise concluída, resultado obtido: {type(resultado)}")

        # Salvar resultado
        print(f"[CELERY] Salvando resultado da análise para solicitação {solicitacao_id}")
        DocumentAnalysisService.save_analysis_result(
            db=self.db,
            solicitacao_id=solicitacao_id,
            resultado=resultado
        )
        print(f"[CELERY] Resultado salvo com sucesso")

        logger.info(f"Análise concluída com sucesso para solicitação {solicitacao_id}")
        print(f"[CELERY] Tarefa finalizada com sucesso para solicitação {solicitacao_id}")
        return {"status": "success", "solicitacao_id": solicitacao_id}

    except Exception as e:
        print(f"[CELERY] ERRO na análise do documento para solicitação {solicitacao_id}: {e}")
        logger.error(f"Erro na análise do documento para solicitação {solicitacao_id}: {e}")

        # Atualizar status para erro
        print(f"[CELERY] Atualizando status da solicitação {solicitacao_id} para ERRO")
        try:
            DocumentAnalysisService.update_solicitacao_status(
                db=self.db,
                solicitacao_id=solicitacao_id,
                status=StatusSolicitacao.ERRO,
                erro=str(e)
            )
            print(f"[CELERY] Status atualizado para ERRO")
        except Exception as update_error:
            print(f"[CELERY] Erro ao atualizar status para ERRO: {update_error}")
            logger.error(f"Erro ao atualizar status para ERRO: {update_error}")

        raise
