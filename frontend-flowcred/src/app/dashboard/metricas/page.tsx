"use client";

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/layout/dashboard-layout';
import { MetricGrid } from '@/components/dashboard/metrics/metric-grid';
import { BarChart3, Filter, Download } from 'lucide-react';

export default function MetricasPage() {
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending' | 'missing'>('all');
  
  // Dados de exemplo para métricas
  const metrics = [
    {
      id: 'credit-score',
      name: 'Score de Crédito',
      value: '780',
      status: 'verified' as const,
      category: 'Financeiro',
      proofAvailable: true,
    },
    {
      id: 'liquidity-ratio',
      name: 'Índice de Liquidez',
      value: '1.8',
      status: 'verified' as const,
      category: 'Financeiro',
      proofAvailable: true,
    },
    {
      id: 'debt-equity-ratio',
      name: 'Relação Dívida/Patrimônio',
      value: '0.4',
      status: 'verified' as const,
      category: 'Financeiro',
      proofAvailable: true,
    },
    {
      id: 'annual-revenue',
      name: 'Receita Anual',
      status: 'pending' as const,
      category: 'Financeiro',
    },
    {
      id: 'profit-margin',
      name: 'Margem de Lucro',
      status: 'missing' as const,
      category: 'Financeiro',
    },
    {
      id: 'identity-verification',
      name: 'Verificação de Identidade',
      value: 'Verificado',
      status: 'verified' as const,
      category: 'Pessoal',
      proofAvailable: true,
    },
    {
      id: 'address-verification',
      name: 'Comprovante de Endereço',
      value: 'Verificado',
      status: 'verified' as const,
      category: 'Pessoal',
      proofAvailable: false,
    },
    {
      id: 'employment-status',
      name: 'Vínculo Empregatício',
      status: 'missing' as const,
      category: 'Pessoal',
    },
    {
      id: 'tax-compliance',
      name: 'Regularidade Fiscal',
      status: 'pending' as const,
      category: 'Fiscal',
    },
    {
      id: 'tax-returns',
      name: 'Declaração de Imposto',
      status: 'missing' as const,
      category: 'Fiscal',
    },
    {
      id: 'bank-account-verification',
      name: 'Verificação de Conta Bancária',
      value: 'Verificado',
      status: 'verified' as const,
      category: 'Bancário',
      proofAvailable: true,
    },
    {
      id: 'average-balance',
      name: 'Saldo Médio',
      value: 'R$ 15.000,00',
      status: 'verified' as const,
      category: 'Bancário',
      proofAvailable: true,
    },
    {
      id: 'transaction-history',
      name: 'Histórico de Transações',
      status: 'pending' as const,
      category: 'Bancário',
    },
  ];
  
  // Filtrar métricas por status
  const filteredMetrics = metrics.filter(metric => {
    if (statusFilter === 'all') return true;
    return metric.status === statusFilter;
  });
  
  // Estatísticas
  const totalMetrics = metrics.length;
  const verifiedMetrics = metrics.filter(m => m.status === 'verified').length;
  const pendingMetrics = metrics.filter(m => m.status === 'pending').length;
  const missingMetrics = metrics.filter(m => m.status === 'missing').length;
  const proofAvailableMetrics = metrics.filter(m => m.proofAvailable).length;

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Métricas</h1>
          
          <div className="flex space-x-3">
            <button className="flex items-center px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </button>
            
            <button className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Exportar Relatório
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm mb-8">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-5 w-5 text-blue-400 mr-2" />
            <h2 className="text-lg font-semibold text-white">Suas Métricas</h2>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Aqui você encontra todas as métricas geradas a partir dos seus documentos e integrações. Estas métricas podem ser compartilhadas de forma segura com instituições financeiras.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Total de Métricas</p>
              <p className="text-2xl font-semibold text-white">{totalMetrics}</p>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Métricas Verificadas</p>
              <p className="text-2xl font-semibold text-green-400">{verifiedMetrics}</p>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Em Processamento</p>
              <p className="text-2xl font-semibold text-yellow-400">{pendingMetrics}</p>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Provas ZK Disponíveis</p>
              <p className="text-2xl font-semibold text-blue-400">{proofAvailableMetrics}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setStatusFilter('all')}
            >
              Todas ({totalMetrics})
            </button>
            
            <button
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                statusFilter === 'verified'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setStatusFilter('verified')}
            >
              Verificadas ({verifiedMetrics})
            </button>
            
            <button
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setStatusFilter('pending')}
            >
              Em Processamento ({pendingMetrics})
            </button>
            
            <button
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                statusFilter === 'missing'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setStatusFilter('missing')}
            >
              Não Disponíveis ({missingMetrics})
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
          <MetricGrid 
            metrics={filteredMetrics}
            filter={filter}
            onFilterChange={setFilter}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
