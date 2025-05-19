"""
Modelos do banco de dados para a API.
"""
from sqlalchemy import Column, Integer, String, DateTime, Text, Enum, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
import uuid

from avaliadores_crew.api.database import Base

def generate_uuid():
    """Gera um UUID único para identificar solicitações."""
    return str(uuid.uuid4())

class StatusSolicitacao(str, enum.Enum):
    """Enum para os status possíveis de uma solicitação."""
    PENDENTE = "pendente"
    EM_PROCESSAMENTO = "em_processamento"
    CONCLUIDO = "concluido"
    ERRO = "erro"

class TipoDocumento(str, enum.Enum):
    """Enum para os tipos de documentos suportados."""
    CONTRATO_SOCIAL = "contrato_social"
    BALANCO_PATRIMONIAL = "balanco_patrimonial"
    DRE = "dre"

class Solicitacao(Base):
    """Modelo para armazenar solicitações de análise de documentos."""
    __tablename__ = "solicitacoes"

    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String(36), unique=True, index=True, default=generate_uuid)
    tipo_documento = Column(Enum(TipoDocumento), nullable=False)
    nome_arquivo = Column(String(255), nullable=False)
    caminho_arquivo = Column(String(255), nullable=False)
    status = Column(Enum(StatusSolicitacao), default=StatusSolicitacao.PENDENTE, nullable=False)
    data_solicitacao = Column(DateTime, default=datetime.utcnow, nullable=False)
    data_inicio_processamento = Column(DateTime, nullable=True)
    data_conclusao = Column(DateTime, nullable=True)
    task_id = Column(String(255), nullable=True)  # ID da tarefa no Celery
    erro = Column(Text, nullable=True)
    
    # Relacionamento com o resultado
    resultado = relationship("ResultadoAnalise", back_populates="solicitacao", uselist=False)

class ResultadoAnalise(Base):
    """Modelo para armazenar os resultados da análise de documentos."""
    __tablename__ = "resultados_analise"

    id = Column(Integer, primary_key=True, index=True)
    solicitacao_id = Column(Integer, ForeignKey("solicitacoes.id"), unique=True, nullable=False)
    caminho_resultado = Column(String(255), nullable=False)  # Caminho para o arquivo JSON com o resultado
    data_criacao = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relacionamento com a solicitação
    solicitacao = relationship("Solicitacao", back_populates="resultado")
