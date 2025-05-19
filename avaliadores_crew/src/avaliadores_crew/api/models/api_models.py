"""
Modelos Pydantic para a API.
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

# Enums
class StatusSolicitacaoEnum(str, Enum):
    """Enum para os status possíveis de uma solicitação."""
    PENDENTE = "pendente"
    EM_PROCESSAMENTO = "em_processamento"
    CONCLUIDO = "concluido"
    ERRO = "erro"

class TipoDocumentoEnum(str, Enum):
    """Enum para os tipos de documentos suportados."""
    CONTRATO_SOCIAL = "contrato_social"
    BALANCO_PATRIMONIAL = "balanco_patrimonial"
    DRE = "dre"

# Modelos de Solicitação
class SolicitacaoBase(BaseModel):
    """Modelo base para solicitações."""
    tipo_documento: TipoDocumentoEnum = Field(..., description="Tipo de documento a ser analisado")

class SolicitacaoCreate(SolicitacaoBase):
    """Modelo para criação de solicitações."""
    pass

class SolicitacaoResponse(SolicitacaoBase):
    """Modelo para resposta de solicitações."""
    uuid: str = Field(..., description="Identificador único da solicitação")
    nome_arquivo: str = Field(..., description="Nome do arquivo enviado")
    status: StatusSolicitacaoEnum = Field(..., description="Status atual da solicitação")
    data_solicitacao: datetime = Field(..., description="Data e hora da solicitação")
    data_inicio_processamento: Optional[datetime] = Field(None, description="Data e hora do início do processamento")
    data_conclusao: Optional[datetime] = Field(None, description="Data e hora da conclusão")
    erro: Optional[str] = Field(None, description="Mensagem de erro, se houver")

    class Config:
        from_attributes = True

class SolicitacaoStatusUpdate(BaseModel):
    """Modelo para atualização de status de solicitações."""
    status: StatusSolicitacaoEnum = Field(..., description="Novo status da solicitação")
    erro: Optional[str] = Field(None, description="Mensagem de erro, se houver")

# Modelos de Resultado
class ResultadoAnaliseBase(BaseModel):
    """Modelo base para resultados de análise."""
    solicitacao_id: int = Field(..., description="ID da solicitação relacionada")
    caminho_resultado: str = Field(..., description="Caminho para o arquivo JSON com o resultado")

class ResultadoAnaliseCreate(ResultadoAnaliseBase):
    """Modelo para criação de resultados de análise."""
    pass

class ResultadoAnaliseResponse(ResultadoAnaliseBase):
    """Modelo para resposta de resultados de análise."""
    id: int = Field(..., description="ID do resultado")
    data_criacao: datetime = Field(..., description="Data e hora da criação do resultado")
    resultado: Dict[str, Any] = Field(..., description="Conteúdo do resultado da análise")

    class Config:
        from_attributes = True

# Modelos para respostas da API
class APIResponse(BaseModel):
    """Modelo base para respostas da API."""
    success: bool = Field(..., description="Indica se a operação foi bem-sucedida")
    message: str = Field(..., description="Mensagem descritiva")

class SolicitacaoListResponse(APIResponse):
    """Modelo para resposta de listagem de solicitações."""
    data: List[SolicitacaoResponse] = Field(..., description="Lista de solicitações")

class SolicitacaoDetailResponse(APIResponse):
    """Modelo para resposta de detalhes de uma solicitação."""
    data: SolicitacaoResponse = Field(..., description="Detalhes da solicitação")

class ResultadoAnaliseDetailResponse(APIResponse):
    """Modelo para resposta de detalhes de um resultado de análise."""
    data: ResultadoAnaliseResponse = Field(..., description="Detalhes do resultado da análise")
