from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field
from datetime import date
from enum import Enum

from avaliadores_crew.models.document_output import ContratoSocialOutput
from avaliadores_crew.models.financial_output import BalancoPatrimonialOutput, DREOutput


class TipoDocumento(str, Enum):
    """Enum para os tipos de documentos suportados."""
    CONTRATO_SOCIAL = "Contrato Social"
    BALANCO_PATRIMONIAL = "Balanço Patrimonial"
    DRE = "Demonstração de Resultado do Exercício"


class NivelRisco(str, Enum):
    """Enum para os níveis de risco."""
    BAIXO = "Baixo"
    MEDIO = "Médio"
    ALTO = "Alto"
    CRITICO = "Crítico"


class Risco(BaseModel):
    """Modelo para representar um risco identificado."""
    categoria: str = Field(..., description="Categoria do risco (Jurídico, Financeiro, Operacional, Reputacional)")
    descricao: str = Field(..., description="Descrição detalhada do risco")
    nivel: NivelRisco = Field(..., description="Nível do risco")
    probabilidade: float = Field(..., description="Probabilidade de ocorrência (0-1)")
    impacto_financeiro: Optional[float] = Field(None, description="Estimativa de impacto financeiro em R$")
    horizonte_temporal: str = Field(..., description="Horizonte temporal (Curto, Médio, Longo prazo)")
    mitigacao: str = Field(..., description="Estratégia recomendada para mitigação")


class Recomendacao(BaseModel):
    """Modelo para representar uma recomendação."""
    categoria: str = Field(..., description="Categoria da recomendação")
    descricao: str = Field(..., description="Descrição detalhada da recomendação")
    prioridade: int = Field(..., description="Prioridade (1-5, sendo 1 a mais alta)")
    impacto_esperado: str = Field(..., description="Impacto esperado da implementação")
    prazo_sugerido: Optional[str] = Field(None, description="Prazo sugerido para implementação")


class AnaliseDocumentoOutput(BaseModel):
    """Modelo completo para output da análise de documentos empresariais."""
    empresa: str = Field(..., description="Razão social da empresa analisada")
    cnpj: str = Field(..., description="CNPJ da empresa analisada")
    tipo_documento: TipoDocumento = Field(..., description="Tipo de documento analisado")
    data_documento: date = Field(..., description="Data do documento analisado")
    data_analise: date = Field(..., description="Data em que a análise foi realizada")
    
    # Resultado da análise específica do documento
    resultado_analise: Union[ContratoSocialOutput, BalancoPatrimonialOutput, DREOutput] = Field(
        ..., description="Resultado detalhado da análise do documento"
    )
    
    # Avaliação de riscos
    riscos_identificados: List[Risco] = Field(..., description="Lista de riscos identificados")
    nivel_risco_geral: NivelRisco = Field(..., description="Nível de risco geral da análise")
    
    # Recomendações
    recomendacoes: List[Recomendacao] = Field(..., description="Lista de recomendações")
    
    # Conclusão
    conclusao: str = Field(..., description="Conclusão geral da análise")
    pontos_positivos: List[str] = Field(default=[], description="Pontos positivos identificados")
    pontos_atencao: List[str] = Field(default=[], description="Pontos de atenção identificados")
    
    # Metadados da análise
    analista_responsavel: str = Field(..., description="Nome ou identificador do analista responsável")
    tempo_analise: float = Field(..., description="Tempo total de análise em minutos")
    confiabilidade: float = Field(..., description="Nível de confiabilidade da análise (0-1)")
    
    def to_markdown(self) -> str:
        """Converte a análise para formato markdown."""
        # Implementação da conversão para markdown
        # Esta é uma função placeholder que seria implementada com a lógica real
        return f"# Análise de {self.tipo_documento} - {self.empresa}\n\n..."
