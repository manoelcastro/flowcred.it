"use client";

import { CreditFlowSimulator } from '@/components/dashboard/credit/credit-flow-simulator';
import { CreditFlowViewer } from '@/components/dashboard/credit/credit-flow-viewer';
import { CreditRelationshipCard } from '@/components/dashboard/credit/credit-relationship-card';
import { CreditSummary } from '@/components/dashboard/credit/credit-summary';
import { DashboardLayout } from '@/components/dashboard/layout/dashboard-layout';
import { Building, Filter, Plus, Search, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CredoresPage() {
  const [filter, setFilter] = useState('');
  const [showSimulator, setShowSimulator] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState<{id: string, name: string, institution: string} | null>(null);
  
  // Dados de exemplo para flows de avaliação
  const creditFlows = [
    {
      id: 'flow1',
      name: 'Flow de Avaliação Padrão',
      description: 'Fluxo de avaliação padrão para empréstimos pessoais e financiamentos.',
      institution: {
        name: 'Banco XYZ',
        logo: 'https://via.placeholder.com/40',
      },
      successRate: 75,
      requiredDocuments: [
        'Comprovante de Identidade',
        'Comprovante de Residência',
        'Comprovante de Renda'
      ],
      requiredMetrics: [
        'Score de Crédito',
        'Índice de Liquidez',
        'Histórico Bancário'
      ],
      nodes: [
        {
          id: 'node1',
          type: 'document',
          label: 'Verificação de Documentos',
          description: 'Verificar documentos básicos',
          position: { x: 50, y: 50 },
          status: 'pass'
        },
        {
          id: 'node2',
          type: 'metric',
          label: 'Score de Crédito',
          requiredValue: 700,
          comparisonOperator: '>=',
          position: { x: 250, y: 50 },
          status: 'pass'
        },
        {
          id: 'node3',
          type: 'metric',
          label: 'Índice de Liquidez',
          requiredValue: 1.5,
          comparisonOperator: '>=',
          position: { x: 250, y: 150 },
          status: 'pass'
        },
        {
          id: 'node4',
          type: 'integration',
          label: 'Verificação Bancária',
          description: 'Via Open Finance',
          position: { x: 450, y: 100 },
          status: 'pass'
        },
        {
          id: 'node5',
          type: 'condition',
          label: 'Análise de Risco',
          description: 'Avaliação final de risco',
          position: { x: 650, y: 100 },
          status: 'pass'
        }
      ],
      edges: [
        { source: 'node1', target: 'node2' },
        { source: 'node1', target: 'node3' },
        { source: 'node2', target: 'node4' },
        { source: 'node3', target: 'node4' },
        { source: 'node4', target: 'node5' }
      ]
    },
    {
      id: 'flow2',
      name: 'Flow de Crédito Pessoal',
      description: 'Fluxo de avaliação específico para crédito pessoal com taxas reduzidas.',
      institution: {
        name: 'Financeira ABC',
        logo: 'https://via.placeholder.com/40',
      },
      successRate: 60,
      requiredDocuments: [
        'Comprovante de Identidade',
        'Comprovante de Residência',
        'Comprovante de Renda',
        'Declaração de IR'
      ],
      requiredMetrics: [
        'Score de Crédito',
        'Histórico de Crédito',
        'Relação Dívida/Renda'
      ],
      nodes: [
        {
          id: 'node1',
          type: 'document',
          label: 'Verificação de Documentos',
          description: 'Verificar documentos básicos',
          position: { x: 50, y: 100 },
          status: 'pass'
        },
        {
          id: 'node2',
          type: 'metric',
          label: 'Score de Crédito',
          requiredValue: 720,
          comparisonOperator: '>=',
          position: { x: 250, y: 50 },
          status: 'pass'
        },
        {
          id: 'node3',
          type: 'metric',
          label: 'Relação Dívida/Renda',
          requiredValue: 0.4,
          comparisonOperator: '<=',
          position: { x: 250, y: 150 },
          status: 'unknown'
        },
        {
          id: 'node4',
          type: 'condition',
          label: 'Análise de Perfil',
          description: 'Avaliação de perfil de risco',
          position: { x: 450, y: 100 },
          status: 'unknown'
        }
      ],
      edges: [
        { source: 'node1', target: 'node2' },
        { source: 'node1', target: 'node3' },
        { source: 'node2', target: 'node4' },
        { source: 'node3', target: 'node4' }
      ]
    }
  ];

  // Dados de exemplo para relacionamentos de crédito
  const creditRelationships = [
    {
      id: '1',
      institution: {
        name: 'Banco XYZ',
        logo: 'https://via.placeholder.com/40',
      },
      relationshipSince: '10/01/2022',
      lastEvaluation: '15/05/2023',
      creditScore: '780',
      totalAvailableCredit: 'R$ 50.000,00',
      offers: [
        {
          id: '101',
          type: 'Empréstimo Pessoal',
          amount: 'R$ 30.000,00',
          interestRate: '1,99% a.m.',
          term: '36 meses',
          status: 'available' as const,
          expiresAt: '30/06/2023',
        },
        {
          id: '102',
          type: 'Financiamento de Veículo',
          amount: 'R$ 50.000,00',
          interestRate: '1,45% a.m.',
          term: '60 meses',
          status: 'available' as const,
          expiresAt: '15/07/2023',
        },
      ],
    },
    {
      id: '2',
      institution: {
        name: 'Financeira ABC',
        logo: 'https://via.placeholder.com/40',
      },
      relationshipSince: '05/03/2022',
      lastEvaluation: '10/05/2023',
      creditScore: '765',
      totalAvailableCredit: 'R$ 25.000,00',
      offers: [
        {
          id: '201',
          type: 'Crédito Pessoal',
          amount: 'R$ 15.000,00',
          interestRate: '2,29% a.m.',
          term: '24 meses',
          status: 'available' as const,
          expiresAt: '20/06/2023',
        },
        {
          id: '202',
          type: 'Cartão de Crédito',
          amount: 'R$ 10.000,00',
          interestRate: '3,99% a.m.',
          term: 'N/A',
          status: 'pending' as const,
        },
      ],
    },
    {
      id: '3',
      institution: {
        name: 'Cooperativa de Crédito',
        logo: 'https://via.placeholder.com/40',
      },
      relationshipSince: '15/06/2022',
      lastEvaluation: '01/05/2023',
      creditScore: '790',
      totalAvailableCredit: 'R$ 35.000,00',
      offers: [
        {
          id: '301',
          type: 'Empréstimo com Garantia',
          amount: 'R$ 35.000,00',
          interestRate: '1,29% a.m.',
          term: '48 meses',
          status: 'available' as const,
          expiresAt: '15/06/2023',
        },
        {
          id: '302',
          type: 'Crédito Consignado',
          amount: 'R$ 20.000,00',
          interestRate: '1,15% a.m.',
          term: '60 meses',
          status: 'expired' as const,
        },
      ],
    },
    {
      id: '4',
      institution: {
        name: 'Fintech DEF',
        logo: 'https://via.placeholder.com/40',
      },
      relationshipSince: '20/09/2022',
      lastEvaluation: '05/05/2023',
      totalAvailableCredit: 'R$ 15.000,00',
      offers: [
        {
          id: '401',
          type: 'Empréstimo Digital',
          amount: 'R$ 15.000,00',
          interestRate: '2,49% a.m.',
          term: '24 meses',
          status: 'available' as const,
          expiresAt: '05/07/2023',
        },
      ],
    },
  ];
  
  // Calcular o total de crédito disponível
  const totalAvailableCredit = creditRelationships.reduce(
    (total, relationship) => {
      const value = parseFloat(relationship.totalAvailableCredit.replace('R$ ', '').replace('.', '').replace(',', '.'));
      return total + value;
    },
    0
  );
  
  // Calcular a taxa média de juros
  const availableOffers = creditRelationships.flatMap(r => 
    r.offers.filter(o => o.status === 'available')
  );
  
  const averageInterestRate = availableOffers.length > 0
    ? availableOffers.reduce((sum, offer) => {
        const rate = parseFloat(offer.interestRate.replace('% a.m.', '').replace(',', '.'));
        return sum + rate;
      }, 0) / availableOffers.length
    : 0;
  
  // Filtrar relacionamentos
  const filteredRelationships = creditRelationships.filter(relationship => {
    if (!filter) return true;
    return relationship.institution.name.toLowerCase().includes(filter.toLowerCase());
  });
  
  // Filtrar flows
  const filteredFlows = creditFlows.filter(flow => {
    if (!filter) return true;
    return flow.institution.name.toLowerCase().includes(filter.toLowerCase());
  });
  
  const handleSimulateFlow = (flowId: string, flowName: string, institutionName: string) => {
    setSelectedFlow({
      id: flowId,
      name: flowName,
      institution: institutionName
    });
    setShowSimulator(true);
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Relacionamento com Credores</h1>
          
          <div className="flex space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar instituição..."
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-64"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            
            <button className="flex items-center px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </button>
            
            <button className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Instituição
            </button>
          </div>
        </div>
        
        <div className="mb-8">
          <CreditSummary 
            totalAvailableCredit={`R$ ${totalAvailableCredit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            totalInstitutions={creditRelationships.length}
            averageInterestRate={`${averageInterestRate.toFixed(2).replace('.', ',')}% a.m.`}
            creditScore="780"
            creditScoreTrend={{ value: 15, isPositive: true }}
          />
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm mb-8">
          <div className="flex items-center mb-4">
            <Building className="h-5 w-5 text-blue-400 mr-2" />
            <h2 className="text-lg font-semibold text-white">Suas Instituições Financeiras</h2>
          </div>
          <p className="text-sm text-gray-400 mb-2">
            Aqui você encontra todas as instituições financeiras que já avaliaram seu perfil de crédito e as ofertas disponíveis para você.
          </p>
          <p className="text-sm text-gray-400">
            Todas as instituições listadas abaixo tiveram acesso apenas às métricas que você autorizou explicitamente.
          </p>
        </div>
        
        {filteredRelationships.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center backdrop-blur-sm">
            <Building className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 mb-2">Nenhuma instituição encontrada</p>
            <p className="text-sm text-gray-500">
              Adicione instituições financeiras para visualizar suas ofertas de crédito
            </p>
          </div>
        ) : (
          <div className="space-y-6 mb-10">
            {filteredRelationships.map((relationship) => (
              <CreditRelationshipCard 
                key={relationship.id} 
                relationship={relationship} 
              />
            ))}
          </div>
        )}
        
        <div className="mb-6 flex items-center">
          <Zap className="h-5 w-5 text-purple-400 mr-2" />
          <h2 className="text-lg font-semibold text-white">Flows de Avaliação</h2>
        </div>
        
        <p className="text-sm text-gray-400 mb-6">
          Aqui você pode visualizar e simular os flows de avaliação utilizados pelas instituições financeiras para determinar sua elegibilidade para crédito.
        </p>
        
        {filteredFlows.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center backdrop-blur-sm">
            <Zap className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 mb-2">Nenhum flow de avaliação encontrado</p>
            <p className="text-sm text-gray-500">
              Não há flows de avaliação disponíveis para as instituições filtradas
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredFlows.map((flow) => (
              <CreditFlowViewer 
                key={flow.id} 
                flow={flow}
                onSimulate={() => handleSimulateFlow(flow.id, flow.name, flow.institution.name)}
              />
            ))}
          </div>
        )}
        
        {showSimulator && selectedFlow && (
          <CreditFlowSimulator 
            flowId={selectedFlow.id}
            flowName={selectedFlow.name}
            institutionName={selectedFlow.institution}
            onClose={() => setShowSimulator(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
