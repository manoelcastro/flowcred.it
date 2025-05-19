from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import date


class ContaContabil(BaseModel):
    """Modelo para representar uma conta contábil."""
    codigo: str = Field(..., description="Código da conta contábil")
    descricao: str = Field(..., description="Descrição da conta contábil")
    valor: float = Field(..., description="Valor da conta em R$")
    percentual_grupo: Optional[float] = Field(None, description="Percentual em relação ao grupo (0-100)")
    percentual_total: Optional[float] = Field(None, description="Percentual em relação ao total (0-100)")


class GrupoContas(BaseModel):
    """Modelo para representar um grupo de contas contábeis."""
    nome: str = Field(..., description="Nome do grupo de contas")
    contas: List[ContaContabil] = Field(..., description="Lista de contas contábeis do grupo")
    valor_total: float = Field(..., description="Valor total do grupo em R$")
    percentual_total: float = Field(..., description="Percentual em relação ao total (0-100)")


class IndicadorFinanceiro(BaseModel):
    """Modelo para representar um indicador financeiro."""
    nome: str = Field(..., description="Nome do indicador")
    valor: float = Field(..., description="Valor calculado do indicador")
    formula: str = Field(..., description="Fórmula utilizada para cálculo")
    interpretacao: str = Field(..., description="Interpretação do resultado")
    benchmark_setorial: Optional[float] = Field(None, description="Valor médio do setor para comparação")
    avaliacao: str = Field(..., description="Avaliação qualitativa (Ótimo, Bom, Regular, Ruim, Crítico)")


class BalancoPatrimonialOutput(BaseModel):
    """Modelo completo para output da análise de Balanço Patrimonial."""
    empresa: str = Field(..., description="Razão social da empresa")
    cnpj: str = Field(..., description="CNPJ da empresa")
    data_referencia: date = Field(..., description="Data de referência do balanço")
    periodo_apuracao: str = Field(..., description="Período de apuração (Anual, Trimestral, etc)")
    
    # Ativo
    ativo_circulante: GrupoContas = Field(..., description="Grupo de contas do Ativo Circulante")
    ativo_nao_circulante: GrupoContas = Field(..., description="Grupo de contas do Ativo Não Circulante")
    total_ativo: float = Field(..., description="Total do Ativo em R$")
    
    # Passivo
    passivo_circulante: GrupoContas = Field(..., description="Grupo de contas do Passivo Circulante")
    passivo_nao_circulante: GrupoContas = Field(..., description="Grupo de contas do Passivo Não Circulante")
    patrimonio_liquido: GrupoContas = Field(..., description="Grupo de contas do Patrimônio Líquido")
    total_passivo_pl: float = Field(..., description="Total do Passivo e Patrimônio Líquido em R$")
    
    # Indicadores calculados
    indicadores_liquidez: List[IndicadorFinanceiro] = Field(..., description="Indicadores de liquidez")
    indicadores_endividamento: List[IndicadorFinanceiro] = Field(..., description="Indicadores de endividamento")
    indicadores_estrutura: List[IndicadorFinanceiro] = Field(..., description="Indicadores de estrutura de capital")
    
    # Análise
    consistencia_contabil: bool = Field(..., description="Indica se o balanço está contabilmente consistente")
    inconsistencias: List[str] = Field(default=[], description="Lista de inconsistências identificadas")
    passivos_ocultos_potenciais: List[str] = Field(default=[], description="Potenciais passivos ocultos identificados")
    pontos_atencao: List[str] = Field(default=[], description="Pontos de atenção identificados na análise")
    observacoes: Optional[str] = Field(None, description="Observações adicionais sobre o balanço")
    data_analise: date = Field(..., description="Data em que a análise foi realizada")


class DREOutput(BaseModel):
    """Modelo completo para output da análise de Demonstração de Resultado do Exercício."""
    empresa: str = Field(..., description="Razão social da empresa")
    cnpj: str = Field(..., description="CNPJ da empresa")
    data_referencia: date = Field(..., description="Data de referência da DRE")
    periodo_apuracao: str = Field(..., description="Período de apuração (Anual, Trimestral, etc)")
    
    # Contas de resultado
    receita_bruta: ContaContabil = Field(..., description="Receita Bruta")
    deducoes_receita: ContaContabil = Field(..., description="Deduções da Receita")
    receita_liquida: ContaContabil = Field(..., description="Receita Líquida")
    custo_vendas: ContaContabil = Field(..., description="Custo dos Produtos/Serviços Vendidos")
    lucro_bruto: ContaContabil = Field(..., description="Lucro Bruto")
    despesas_operacionais: GrupoContas = Field(..., description="Despesas Operacionais")
    resultado_operacional: ContaContabil = Field(..., description="Resultado Operacional")
    resultado_financeiro: ContaContabil = Field(..., description="Resultado Financeiro")
    outras_receitas_despesas: Optional[ContaContabil] = Field(None, description="Outras Receitas e Despesas")
    resultado_antes_ir_csll: ContaContabil = Field(..., description="Resultado antes do IR e CSLL")
    provisao_ir_csll: ContaContabil = Field(..., description="Provisão para IR e CSLL")
    resultado_liquido: ContaContabil = Field(..., description="Resultado Líquido do Exercício")
    
    # Indicadores calculados
    indicadores_rentabilidade: List[IndicadorFinanceiro] = Field(..., description="Indicadores de rentabilidade")
    indicadores_eficiencia: List[IndicadorFinanceiro] = Field(..., description="Indicadores de eficiência operacional")
    indicadores_crescimento: Optional[List[IndicadorFinanceiro]] = Field(None, description="Indicadores de crescimento (requer períodos anteriores)")
    
    # Análise
    consistencia_contabil: bool = Field(..., description="Indica se a DRE está contabilmente consistente")
    inconsistencias: List[str] = Field(default=[], description="Lista de inconsistências identificadas")
    sazonalidade: Optional[str] = Field(None, description="Análise de sazonalidade, se aplicável")
    tendencias: List[str] = Field(default=[], description="Tendências identificadas")
    pontos_atencao: List[str] = Field(default=[], description="Pontos de atenção identificados na análise")
    observacoes: Optional[str] = Field(None, description="Observações adicionais sobre a DRE")
    data_analise: date = Field(..., description="Data em que a análise foi realizada")
