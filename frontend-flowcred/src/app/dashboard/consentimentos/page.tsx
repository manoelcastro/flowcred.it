"use client";

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/layout/dashboard-layout';
import { ConsentManagement } from '@/components/dashboard/consent/consent-management';
import { AccessRequests } from '@/components/dashboard/consent/access-requests';
import { Shield, Bell, Filter } from 'lucide-react';

export default function ConsentimentosPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'requests'>('active');
  
  // Dados de exemplo para empresas com consentimento
  const consentedCompanies = [
    {
      id: '1',
      name: 'Banco XYZ',
      logo: 'https://via.placeholder.com/40',
      accessGrantedAt: '05/05/2023',
      expiresAt: '05/08/2023',
      accessedMetrics: [
        {
          category: 'Financeiro',
          count: 3,
          lastAccessed: '10/05/2023',
        },
        {
          category: 'Pessoal',
          count: 2,
          lastAccessed: '07/05/2023',
        },
      ],
    },
    {
      id: '2',
      name: 'Financeira ABC',
      logo: 'https://via.placeholder.com/40',
      accessGrantedAt: '01/04/2023',
      expiresAt: '01/07/2023',
      accessedMetrics: [
        {
          category: 'Financeiro',
          count: 2,
          lastAccessed: '15/04/2023',
        },
      ],
    },
    {
      id: '3',
      name: 'Cooperativa de Crédito',
      accessGrantedAt: '15/03/2023',
      expiresAt: '15/06/2023',
      accessedMetrics: [
        {
          category: 'Financeiro',
          count: 4,
          lastAccessed: '20/04/2023',
        },
        {
          category: 'Fiscal',
          count: 1,
          lastAccessed: '20/04/2023',
        },
        {
          category: 'Pessoal',
          count: 2,
          lastAccessed: '20/04/2023',
        },
      ],
    },
  ];
  
  // Dados de exemplo para solicitações de acesso
  const accessRequests = [
    {
      id: '1',
      company: {
        name: 'Banco XYZ',
        logo: 'https://via.placeholder.com/40',
      },
      requestedAt: '10/05/2023',
      status: 'pending' as const,
      requestedMetrics: ['Score de Crédito', 'Índice de Liquidez', 'Verificação de Identidade'],
    },
    {
      id: '2',
      company: {
        name: 'Financeira ABC',
        logo: 'https://via.placeholder.com/40',
      },
      requestedAt: '05/05/2023',
      status: 'approved' as const,
      requestedMetrics: ['Score de Crédito', 'Comprovante de Endereço'],
    },
    {
      id: '3',
      company: {
        name: 'Fintech DEF',
        logo: 'https://via.placeholder.com/40',
      },
      requestedAt: '01/05/2023',
      status: 'rejected' as const,
      requestedMetrics: ['Score de Crédito', 'Histórico Bancário', 'Declaração de IR'],
    },
    {
      id: '4',
      company: {
        name: 'Banco Regional',
        logo: 'https://via.placeholder.com/40',
      },
      requestedAt: '28/04/2023',
      status: 'pending' as const,
      requestedMetrics: ['Score de Crédito', 'Comprovante de Renda'],
    },
  ];
  
  const handleRevokeConsent = (id: string) => {
    console.log(`Revogando consentimento para ${id}`);
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Consentimentos</h1>
          
          <div className="flex space-x-3">
            <button className="flex items-center px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm mb-8">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-blue-400 mr-2" />
            <h2 className="text-lg font-semibold text-white">Controle de Acesso aos Seus Dados</h2>
          </div>
          <p className="text-sm text-gray-400 mb-2">
            Gerencie quais empresas têm acesso às suas informações e métricas. Você pode revogar o acesso a qualquer momento.
          </p>
          <p className="text-sm text-gray-400">
            Todas as solicitações de acesso precisam da sua aprovação explícita antes que qualquer dado seja compartilhado.
          </p>
        </div>
        
        <div className="mb-6">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'active'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                }`}
                onClick={() => setActiveTab('active')}
              >
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Consentimentos Ativos
                </div>
              </button>
              
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'requests'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                }`}
                onClick={() => setActiveTab('requests')}
              >
                <div className="flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  Solicitações
                  {accessRequests.filter(r => r.status === 'pending').length > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
                      {accessRequests.filter(r => r.status === 'pending').length}
                    </span>
                  )}
                </div>
              </button>
            </nav>
          </div>
        </div>
        
        {activeTab === 'active' ? (
          <ConsentManagement 
            companies={consentedCompanies} 
            onRevoke={handleRevokeConsent} 
          />
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">Solicitações Pendentes</h2>
              </div>
              <div className="divide-y divide-gray-700">
                {accessRequests.filter(r => r.status === 'pending').length === 0 ? (
                  <div className="p-6 text-center">
                    <Bell className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400">Nenhuma solicitação pendente</p>
                  </div>
                ) : (
                  accessRequests
                    .filter(r => r.status === 'pending')
                    .map(request => (
                      <div key={request.id} className="p-4">
                        <AccessRequests requests={[request]} />
                      </div>
                    ))
                )}
              </div>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">Histórico de Solicitações</h2>
              </div>
              <div className="divide-y divide-gray-700">
                {accessRequests.filter(r => r.status !== 'pending').length === 0 ? (
                  <div className="p-6 text-center">
                    <Bell className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400">Nenhuma solicitação no histórico</p>
                  </div>
                ) : (
                  accessRequests
                    .filter(r => r.status !== 'pending')
                    .map(request => (
                      <div key={request.id} className="p-4">
                        <AccessRequests requests={[request]} />
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
