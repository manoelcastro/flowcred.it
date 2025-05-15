"use client";

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/layout/dashboard-layout';
import { IntegrationCards } from '@/components/dashboard/integrations/integration-cards';
import { Link2, Search } from 'lucide-react';

export default function IntegracoesPage() {
  // Dados de exemplo para integrações
  const integrations = [
    {
      id: 'open-finance',
      name: 'Open Finance',
      description: 'Conecte suas contas bancárias e histórico financeiro via Open Finance.',
      logo: 'https://via.placeholder.com/40',
      status: 'connected' as const,
      lastSync: '10/05/2023',
      metricsAvailable: 8,
    },
    {
      id: 'serasa',
      name: 'Serasa',
      description: 'Importe seu score e histórico de crédito do Serasa Experian.',
      logo: 'https://via.placeholder.com/40',
      status: 'connected' as const,
      lastSync: '05/05/2023',
      metricsAvailable: 5,
    },
    {
      id: 'boa-vista',
      name: 'Boa Vista',
      description: 'Conecte-se ao SCPC e importe seu histórico de crédito.',
      logo: 'https://via.placeholder.com/40',
      status: 'disconnected' as const,
    },
    {
      id: 'receita-federal',
      name: 'Receita Federal',
      description: 'Importe dados fiscais e certidões diretamente da Receita Federal.',
      logo: 'https://via.placeholder.com/40',
      status: 'disconnected' as const,
    },
    {
      id: 'spc-brasil',
      name: 'SPC Brasil',
      description: 'Acesse seu histórico de crédito e score do SPC Brasil.',
      logo: 'https://via.placeholder.com/40',
      status: 'error' as const,
    },
    {
      id: 'belvo',
      name: 'Belvo',
      description: 'Conecte-se a diversas instituições financeiras via API Belvo.',
      logo: 'https://via.placeholder.com/40',
      status: 'disconnected' as const,
    },
  ];
  
  const handleConnect = (id: string) => {
    console.log(`Conectando à integração ${id}`);
  };
  
  const handleDisconnect = (id: string) => {
    console.log(`Desconectando da integração ${id}`);
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Integrações</h1>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar integração..."
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
          </div>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm mb-8">
          <div className="flex items-center mb-4">
            <Link2 className="h-5 w-5 text-blue-400 mr-2" />
            <h2 className="text-lg font-semibold text-white">Conecte suas fontes de dados</h2>
          </div>
          <p className="text-sm text-gray-400 mb-2">
            Conecte-se a diversas fontes de dados para enriquecer seu perfil de crédito e gerar mais métricas verificáveis.
          </p>
          <p className="text-sm text-gray-400">
            Todas as conexões são seguras e você mantém controle total sobre quais dados são compartilhados.
          </p>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Integrações Financeiras</h2>
          <IntegrationCards 
            integrations={integrations.filter(i => 
              i.id === 'open-finance' || i.id === 'belvo'
            )} 
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Birôs de Crédito</h2>
          <IntegrationCards 
            integrations={integrations.filter(i => 
              i.id === 'serasa' || i.id === 'boa-vista' || i.id === 'spc-brasil'
            )} 
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Órgãos Governamentais</h2>
          <IntegrationCards 
            integrations={integrations.filter(i => 
              i.id === 'receita-federal'
            )} 
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
