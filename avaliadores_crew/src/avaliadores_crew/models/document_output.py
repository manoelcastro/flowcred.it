from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import date


class Socio(BaseModel):
    """Modelo para informações cadastrais dos sócios."""
    nome_completo: str = Field(..., description="Nome completo do sócio")
    nacionalidade: str = Field(..., description="Nacionalidade do sócio")
    estado_civil: str = Field(..., description="Estado civil do sócio")
    profissao: str = Field(..., description="Profissão do sócio")
    endereco: str = Field(..., description="Endereço completo do sócio")
    cpf: str = Field(..., description="CPF do sócio (formato: XXX.XXX.XXX-XX)")
    percentual_participacao: float = Field(..., description="Percentual de participação no capital social (0-100)")
    regime_bens: Optional[str] = Field(None, description="Regime de bens do sócio, se casado")
    quantidade_quotas: int = Field(..., description="Quantidade de quotas ou ações possuídas pelo sócio")
    valor_quotas: float = Field(..., description="Valor total das quotas ou ações do sócio em R$")


class CapitalSocial(BaseModel):
    """Modelo para informações sobre capital social e composição patrimonial."""
    valor_total: float = Field(..., description="Valor total do capital social em R$")
    valor_integralizado: float = Field(..., description="Valor do capital social já integralizado em R$")
    valor_a_integralizar: float = Field(..., description="Valor do capital social ainda a ser integralizado em R$")
    data_integralizacao: Optional[date] = Field(None, description="Data limite para integralização do capital pendente")
    quantidade_total_quotas: int = Field(..., description="Quantidade total de quotas ou ações")
    valor_nominal_quota: float = Field(..., description="Valor nominal de cada quota ou ação em R$")
    forma_integralizacao: Optional[str] = Field(None, description="Forma de integralização do capital (dinheiro, bens, etc)")


class ObjetoSocial(BaseModel):
    """Modelo para informações sobre objeto social e ramo de atuação."""
    descricao_completa: str = Field(..., description="Descrição completa das atividades permitidas (objeto social)")
    cnae_principal: str = Field(..., description="Código CNAE principal da empresa")
    cnae_secundarios: List[str] = Field(default=[], description="Códigos CNAE secundários da empresa")
    restricoes_atividades: Optional[str] = Field(None, description="Eventuais restrições às atividades")
    condicoes_novas_atividades: Optional[str] = Field(None, description="Prazos e condições para inclusão de novas atividades")


class Administrador(BaseModel):
    """Modelo para informações sobre administradores."""
    nome_completo: str = Field(..., description="Nome completo do administrador")
    cargo: str = Field(..., description="Cargo do administrador (diretor, gerente, sócio-gestor, etc)")
    poderes: str = Field(..., description="Descrição dos poderes conferidos ao administrador")
    restricoes: Optional[str] = Field(None, description="Restrições aos poderes do administrador")
    prazo_mandato: Optional[str] = Field(None, description="Prazo do mandato, se aplicável")
    e_socio: bool = Field(..., description="Indica se o administrador também é sócio")


class Governanca(BaseModel):
    """Modelo para informações sobre governança e poderes de administração."""
    administradores: List[Administrador] = Field(..., description="Lista de administradores da empresa")
    limites_alcada: Optional[str] = Field(None, description="Limites de alçada para operações financeiras")
    regras_aprovacao: Optional[str] = Field(None, description="Regras para aprovação de operações em assembleia")
    quorum_deliberacoes: Optional[str] = Field(None, description="Quórum necessário para deliberações societárias")
    regras_reunioes: Optional[str] = Field(None, description="Regras para convocação e realização de reuniões/assembleias")


class CessaoTransferencia(BaseModel):
    """Modelo para informações sobre cessão e transferência de quotas."""
    regras_cessao: str = Field(..., description="Regras para cessão ou transferência de quotas")
    direito_preferencia: bool = Field(..., description="Existência de direito de preferência para sócios atuais")
    prazo_preferencia: Optional[int] = Field(None, description="Prazo em dias para exercício do direito de preferência")
    restricoes_transferencia: Optional[str] = Field(None, description="Restrições específicas à transferência de quotas")
    clausula_tag_along: bool = Field(default=False, description="Existência de cláusula de tag along (direito de venda conjunta)")
    clausula_drag_along: bool = Field(default=False, description="Existência de cláusula de drag along (obrigação de venda conjunta)")


class LocalizacaoJuridica(BaseModel):
    """Modelo para informações sobre localização jurídica e foro."""
    endereco_sede: str = Field(..., description="Endereço completo da sede da empresa")
    enderecos_filiais: List[str] = Field(default=[], description="Endereços completos das filiais, se houver")
    foro_eleicao: str = Field(..., description="Foro de eleição para solução de conflitos")
    clausula_arbitragem: bool = Field(default=False, description="Existência de cláusula de arbitragem")
    camara_arbitral: Optional[str] = Field(None, description="Câmara arbitral designada, se aplicável")


class AlteracaoContratual(BaseModel):
    """Modelo para informações sobre alterações contratuais."""
    data: date = Field(..., description="Data da alteração contratual")
    numero_alteracao: Optional[str] = Field(None, description="Número da alteração contratual")
    teor: str = Field(..., description="Descrição do teor da alteração")
    motivo: str = Field(..., description="Motivo da alteração (ex.: aumento de capital, saída de sócio)")
    registro_junta: Optional[str] = Field(None, description="Número do registro na Junta Comercial")


class DistribuicaoLucros(BaseModel):
    """Modelo para informações sobre distribuição de lucros, reservas e garantias."""
    regras_distribuicao: str = Field(..., description="Regras para distribuição de lucros entre os sócios")
    percentual_distribuicao: Optional[float] = Field(None, description="Percentual mínimo de distribuição de lucros")
    periodicidade: Optional[str] = Field(None, description="Periodicidade da distribuição de lucros")
    constituicao_reservas: Optional[str] = Field(None, description="Regras para constituição de reservas")
    garantias_socios: Optional[str] = Field(None, description="Garantias dadas pelos sócios")
    garantias_empresa: Optional[str] = Field(None, description="Garantias dadas pela empresa")


class ContratoSocialOutput(BaseModel):
    """Modelo completo para output da análise de Contrato Social."""
    razao_social: str = Field(..., description="Razão social completa da empresa")
    nome_fantasia: Optional[str] = Field(None, description="Nome fantasia da empresa, se houver")
    cnpj: str = Field(..., description="CNPJ da empresa (formato: XX.XXX.XXX/XXXX-XX)")
    tipo_societario: str = Field(..., description="Tipo societário (LTDA, S.A., EIRELI, etc)")
    data_constituicao: date = Field(..., description="Data de constituição da empresa")
    prazo_duracao: Optional[str] = Field(None, description="Prazo de duração da empresa (determinado ou indeterminado)")
    
    socios: List[Socio] = Field(..., description="Lista de sócios da empresa")
    capital_social: CapitalSocial = Field(..., description="Informações sobre capital social")
    objeto_social: ObjetoSocial = Field(..., description="Informações sobre objeto social")
    governanca: Governanca = Field(..., description="Informações sobre governança e administração")
    cessao_transferencia: CessaoTransferencia = Field(..., description="Informações sobre cessão e transferência de quotas")
    localizacao: LocalizacaoJuridica = Field(..., description="Informações sobre localização jurídica")
    historico_alteracoes: List[AlteracaoContratual] = Field(default=[], description="Histórico de alterações contratuais")
    distribuicao_lucros: DistribuicaoLucros = Field(..., description="Informações sobre distribuição de lucros")
    
    observacoes_adicionais: Optional[str] = Field(None, description="Observações adicionais relevantes")
    pontos_atencao: List[str] = Field(default=[], description="Pontos de atenção identificados na análise")
    data_analise: date = Field(..., description="Data em que a análise foi realizada")
