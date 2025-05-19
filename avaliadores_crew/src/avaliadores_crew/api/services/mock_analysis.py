"""
Serviço de análise de documentos simplificado para testes.
"""
import os
import json
from datetime import datetime
from typing import Dict, Any

from avaliadores_crew.api.models.db_models import TipoDocumento

class MockAnalysisService:
    """Serviço de análise de documentos simplificado para testes."""
    
    @staticmethod
    def analyze_document(caminho_arquivo: str, tipo_documento: TipoDocumento) -> Dict[str, Any]:
        """
        Realiza uma análise simplificada do documento para testes.
        
        Args:
            caminho_arquivo: Caminho para o arquivo
            tipo_documento: Tipo de documento
            
        Returns:
            Dict[str, Any]: Resultado da análise
        """
        print(f"[MOCK_ANALYSIS] Iniciando análise simulada do documento: {caminho_arquivo}")
        
        # Verificar se o arquivo existe
        if not os.path.exists(caminho_arquivo):
            print(f"[MOCK_ANALYSIS] ERRO: Arquivo não encontrado: {caminho_arquivo}")
            return {"error": f"Arquivo não encontrado: {caminho_arquivo}"}
            
        print(f"[MOCK_ANALYSIS] Arquivo encontrado: {caminho_arquivo}")
        
        # Ler o conteúdo do arquivo
        try:
            with open(caminho_arquivo, 'r', encoding='utf-8') as f:
                content = f.read()
                print(f"[MOCK_ANALYSIS] Conteúdo do arquivo: {content[:100]}...")
        except Exception as e:
            print(f"[MOCK_ANALYSIS] Erro ao ler o arquivo: {str(e)}")
            return {"error": f"Erro ao ler o arquivo: {str(e)}"}
        
        # Gerar um resultado simulado com base no tipo de documento
        if tipo_documento == TipoDocumento.CONTRATO_SOCIAL:
            result = {
                "razao_social": "Empresa Teste Ltda",
                "nome_fantasia": "Teste",
                "cnpj": "12.345.678/0001-90",
                "tipo_societario": "LTDA",
                "data_constituicao": datetime.now().strftime("%Y-%m-%d"),
                "prazo_duracao": "Indeterminado",
                "socios": [
                    {
                        "nome_completo": "Sócio Teste",
                        "nacionalidade": "Brasileira",
                        "estado_civil": "Solteiro",
                        "profissao": "Empresário",
                        "endereco": "Rua Teste, 123",
                        "cpf": "123.456.789-00",
                        "percentual_participacao": 100.0,
                        "quantidade_quotas": 100,
                        "valor_quotas": 100000.0
                    }
                ],
                "capital_social": {
                    "valor_total": 100000.0,
                    "valor_integralizado": 100000.0,
                    "valor_a_integralizar": 0.0,
                    "quantidade_total_quotas": 100,
                    "valor_nominal_quota": 1000.0,
                    "forma_integralizacao": "Dinheiro"
                },
                "objeto_social": {
                    "descricao_completa": "Desenvolvimento de software",
                    "cnae_principal": "62.01-5-01",
                    "cnae_secundarios": ["62.02-3-00"]
                },
                "governanca": {
                    "administradores": [
                        {
                            "nome_completo": "Sócio Teste",
                            "cargo": "Administrador",
                            "poderes": "Todos os poderes",
                            "e_socio": True
                        }
                    ]
                },
                "cessao_transferencia": {
                    "regras_cessao": "Mediante autorização dos demais sócios",
                    "direito_preferencia": True
                },
                "localizacao": {
                    "endereco_sede": "Rua Teste, 123",
                    "foro_eleicao": "São Paulo"
                },
                "distribuicao_lucros": {
                    "regras_distribuicao": "Proporcional à participação"
                },
                "observacoes_adicionais": "Documento de teste",
                "pontos_atencao": ["Este é um documento de teste"],
                "data_analise": datetime.now().strftime("%Y-%m-%d")
            }
        elif tipo_documento == TipoDocumento.BALANCO_PATRIMONIAL:
            result = {
                "empresa": "Empresa Teste Ltda",
                "cnpj": "12.345.678/0001-90",
                "data_referencia": datetime.now().strftime("%Y-%m-%d"),
                "periodo_apuracao": "Anual",
                "total_ativo": 1000000.0,
                "total_passivo_pl": 1000000.0
            }
        elif tipo_documento == TipoDocumento.DRE:
            result = {
                "empresa": "Empresa Teste Ltda",
                "cnpj": "12.345.678/0001-90",
                "data_referencia": datetime.now().strftime("%Y-%m-%d"),
                "periodo_apuracao": "Anual",
                "receita_bruta": 500000.0,
                "resultado_liquido": 100000.0
            }
        else:
            result = {
                "error": f"Tipo de documento não suportado: {tipo_documento}"
            }
            
        print(f"[MOCK_ANALYSIS] Análise concluída com sucesso")
        return result
