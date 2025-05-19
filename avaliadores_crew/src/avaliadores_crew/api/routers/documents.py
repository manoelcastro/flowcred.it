"""
Rotas para análise de documentos.
"""
import os
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session

from avaliadores_crew.api.database import get_db
from avaliadores_crew.api.models.db_models import Solicitacao, ResultadoAnalise, TipoDocumento
from avaliadores_crew.api.models.api_models import (
    SolicitacaoResponse, SolicitacaoDetailResponse, ResultadoAnaliseDetailResponse,
    SolicitacaoListResponse, APIResponse, TipoDocumentoEnum
)
from avaliadores_crew.api.services.document_analysis import DocumentAnalysisService
from avaliadores_crew.api.tasks import analyze_document_task

router = APIRouter()

@router.post("/upload", response_model=SolicitacaoDetailResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    tipo_documento: TipoDocumentoEnum = Form(...),
    db: Session = Depends(get_db)
):
    """
    Endpoint para upload de documentos para análise.

    Args:
        file: Arquivo a ser analisado
        tipo_documento: Tipo de documento
        db: Sessão do banco de dados

    Returns:
        SolicitacaoDetailResponse: Detalhes da solicitação criada
    """
    # Verificar extensão do arquivo
    valid_extensions = [".pdf", ".docx", ".doc", ".txt"]
    file_ext = os.path.splitext(file.filename)[1].lower()

    if file_ext not in valid_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Formato de arquivo não suportado. Use um dos seguintes: {', '.join(valid_extensions)}"
        )

    try:
        # Salvar arquivo
        file_path = DocumentAnalysisService.save_uploaded_file(
            file=file,
            tipo_documento=TipoDocumento(tipo_documento.value)
        )

        # Criar solicitação
        solicitacao = DocumentAnalysisService.create_solicitacao(
            db=db,
            tipo_documento=TipoDocumento(tipo_documento.value),
            nome_arquivo=file.filename,
            caminho_arquivo=file_path
        )

        # Iniciar tarefa de análise
        print(f"Enviando solicitação {solicitacao.id} para processamento assíncrono")
        task = analyze_document_task.delay(solicitacao_id=solicitacao.id)
        print(f"Tarefa iniciada com ID: {task.id}")

        return SolicitacaoDetailResponse(
            success=True,
            message="Documento enviado com sucesso. A análise foi iniciada.",
            data=SolicitacaoResponse.model_validate(solicitacao)
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao processar o documento: {str(e)}"
        )

@router.get("/solicitacoes", response_model=SolicitacaoListResponse)
async def list_solicitacoes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Lista todas as solicitações.

    Args:
        skip: Número de registros para pular
        limit: Número máximo de registros para retornar
        db: Sessão do banco de dados

    Returns:
        SolicitacaoListResponse: Lista de solicitações
    """
    solicitacoes = db.query(Solicitacao).offset(skip).limit(limit).all()

    return SolicitacaoListResponse(
        success=True,
        message=f"Foram encontradas {len(solicitacoes)} solicitações",
        data=[SolicitacaoResponse.model_validate(s) for s in solicitacoes]
    )

@router.get("/solicitacoes/{uuid}", response_model=SolicitacaoDetailResponse)
async def get_solicitacao(
    uuid: str,
    db: Session = Depends(get_db)
):
    """
    Obtém detalhes de uma solicitação.

    Args:
        uuid: UUID da solicitação
        db: Sessão do banco de dados

    Returns:
        SolicitacaoDetailResponse: Detalhes da solicitação
    """
    solicitacao = db.query(Solicitacao).filter(Solicitacao.uuid == uuid).first()

    if not solicitacao:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Solicitação com UUID {uuid} não encontrada"
        )

    return SolicitacaoDetailResponse(
        success=True,
        message="Solicitação encontrada",
        data=SolicitacaoResponse.model_validate(solicitacao)
    )

@router.get("/resultados/{uuid}", response_model=ResultadoAnaliseDetailResponse)
async def get_resultado(
    uuid: str,
    db: Session = Depends(get_db)
):
    """
    Obtém o resultado da análise de uma solicitação.

    Args:
        uuid: UUID da solicitação
        db: Sessão do banco de dados

    Returns:
        ResultadoAnaliseDetailResponse: Resultado da análise
    """
    solicitacao = db.query(Solicitacao).filter(Solicitacao.uuid == uuid).first()

    if not solicitacao:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Solicitação com UUID {uuid} não encontrada"
        )

    resultado = db.query(ResultadoAnalise).filter(ResultadoAnalise.solicitacao_id == solicitacao.id).first()

    if not resultado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resultado não encontrado para a solicitação {uuid}"
        )

    # Obter conteúdo do resultado
    resultado_data = DocumentAnalysisService.get_analysis_result(db=db, solicitacao_id=solicitacao.id)

    # Adicionar o conteúdo ao objeto de resposta
    resultado_response = {
        "id": resultado.id,
        "solicitacao_id": resultado.solicitacao_id,
        "caminho_resultado": resultado.caminho_resultado,
        "data_criacao": resultado.data_criacao,
        "resultado": resultado_data
    }

    return ResultadoAnaliseDetailResponse(
        success=True,
        message="Resultado encontrado",
        data=resultado_response
    )
