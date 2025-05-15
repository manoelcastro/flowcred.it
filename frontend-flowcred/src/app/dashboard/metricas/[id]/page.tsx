"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/layout/dashboard-layout';
import { MetricDetail } from '@/components/dashboard/metrics/metric-detail';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function MetricaDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const metricId = params.id as string;
  
  // Dados de exemplo para métricas
  const metricsData = {
    'credit-score': {
      id: 'credit-score',
      name: 'Score de Crédito',
      value: '780',
      status: 'verified' as const,
      category: 'Financeiro',
      description: 'Pontuação que representa a probabilidade de pagamento de dívidas, baseada em histórico financeiro, utilização de crédito e outros fatores.',
      source: {
        type: 'integration' as const,
        name: 'Serasa Experian',
        date: '10/05/2023',
      },
      accessedBy: [
        {
          company: 'Banco XYZ',
          accessGrantedAt: '15/05/2023',
          lastAccessed: '16/05/2023',
        }
      ],
      proofAvailable: true,
    },
    'liquidity-ratio': {
      id: 'liquidity-ratio',
      name: 'Índice de Liquidez',
      value: '1.8',
      status: 'verified' as const,
      category: 'Financeiro',
      description: 'Medida da capacidade de uma empresa pagar suas obrigações de curto prazo. Um valor acima de 1 indica boa saúde financeira.',
      source: {
        type: 'document' as const,
        name: 'Balanço Patrimonial 2023.pdf',
        date: '15/04/2023',
      },
      proofAvailable: true,
    },
    'debt-equity-ratio': {
      id: 'debt-equity-ratio',
      name: 'Relação Dívida/Patrimônio',
      value: '0.4',
      status: 'verified' as const,
      category: 'Financeiro',
      description: 'Medida do grau de alavancagem financeira. Representa a proporção de financiamento por dívida comparada ao financiamento por patrimônio.',
      source: {
        type: 'document' as const,
        name: 'Balanço Patrimonial 2023.pdf',
        date: '15/04/2023',
      },
      proofAvailable: true,
    },
    'identity-verification': {
      id: 'identity-verification',
      name: 'Verificação de Identidade',
      value: 'Verificado',
      status: 'verified' as const,
      category: 'Pessoal',
      description: 'Confirmação da identidade do usuário através de documentos oficiais e verificação biométrica.',
      source: {
        type: 'document' as const,
        name: 'Documento de Identidade.jpg',
        date: '05/04/2023',
      },
      accessedBy: [
        {
          company: 'Banco XYZ',
          accessGrantedAt: '15/05/2023',
          lastAccessed: '16/05/2023',
        },
        {
          company: 'Financeira ABC',
          accessGrantedAt: '01/05/2023',
        }
      ],
      proofAvailable: true,
    },
    'bank-account-verification': {
      id: 'bank-account-verification',
      name: 'Verificação de Conta Bancária',
      value: 'Verificado',
      status: 'verified' as const,
      category: 'Bancário',
      description: 'Confirmação da titularidade e existência de conta bancária através de integração com Open Finance.',
      source: {
        type: 'integration' as const,
        name: 'Open Finance',
        date: '10/05/2023',
      },
      proofAvailable: true,
    },
    'average-balance': {
      id: 'average-balance',
      name: 'Saldo Médio',
      value: 'R$ 15.000,00',
      status: 'verified' as const,
      category: 'Bancário',
      description: 'Média do saldo em conta nos últimos 3 meses, calculada a partir dos dados bancários.',
      source: {
        type: 'integration' as const,
        name: 'Open Finance',
        date: '10/05/2023',
      },
      proofAvailable: true,
    },
  };
  
  const metric = metricsData[metricId as keyof typeof metricsData];
  
  if (!metric) {
    return (
      <DashboardLayout>
        <div className="py-6">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-400" />
            </button>
            <h1 className="text-2xl font-bold text-white">Métrica não encontrada</h1>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm text-center">
            <p className="text-gray-400 mb-4">A métrica que você está procurando não foi encontrada.</p>
            <Link 
              href="/dashboard/metricas" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Voltar para Métricas
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-400" />
            </button>
            <h1 className="text-2xl font-bold text-white">Detalhes da Métrica</h1>
          </div>
          
          <div className="flex space-x-3">
            <button className="flex items-center px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </button>
            
            <button className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </button>
          </div>
        </div>
        
        <MetricDetail {...metric} />
        
        {metric.proofAvailable && (
          <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white mb-4">Prova de Conhecimento Zero Disponível</h2>
            <p className="text-sm text-gray-300 mb-4">
              Esta métrica possui uma prova de conhecimento zero (ZKP) que permite comprovar a veracidade da informação sem revelar os dados originais.
            </p>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
              Gerar Prova ZK
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
