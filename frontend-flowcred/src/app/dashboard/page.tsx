"use client";

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/layout/dashboard-layout';
import { MetricCard } from '@/components/dashboard/metrics/metric-card';
import { MetricsProgress } from '@/components/dashboard/metrics/metrics-progress';
import { AccessRequests } from '@/components/dashboard/consent/access-requests';
import { DocumentList } from '@/components/dashboard/documents/document-list';
import { 
  BarChart3, 
  FileText, 
  Shield, 
  Link2,
  Building,
  Wallet
} from 'lucide-react';

export default function DashboardPage() {
  // Dados de exemplo para métricas
  const metrics = [
    {
      id: 'score',
      name: 'Score de Crédito',
      status: 'verified' as const,
      category: 'Financeiro'
    },
    {
      id: 'liquidity',
      name: 'Índice de Liquidez',
      status: 'verified' as const,
      category: 'Financeiro'
    },
    {
      id: 'debt-ratio',
      name: 'Relação Dívida/Patrimônio',
      status: 'verified' as const,
      category: 'Financeiro'
    },
    {
      id: 'revenue',
      name: 'Receita Anual',
      status: 'pending' as const,
      category: 'Financeiro'
    },
    {
      id: 'identity',
      name: 'Verificação de Identidade',
      status: 'verified' as const,
      category: 'Pessoal'
    },
    {
      id: 'address',
      name: 'Comprovante de Endereço',
      status: 'verified' as const,
      category: 'Pessoal'
    },
    {
      id: 'employment',
      name: 'Vínculo Empregatício',
      status: 'missing' as const,
      category: 'Pessoal'
    },
    {
      id: 'tax-compliance',
      name: 'Regularidade Fiscal',
      status: 'pending' as const,
      category: 'Fiscal'
    },
    {
      id: 'tax-returns',
      name: 'Declaração de Imposto',
      status: 'missing' as const,
      category: 'Fiscal'
    }
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
    }
  ];

  // Dados de exemplo para documentos
  const documents = [
    {
      id: '1',
      name: 'Balanço Patrimonial 2023.pdf',
      type: 'application/pdf',
      size: 2500000,
      uploadedAt: '15/04/2023',
      status: 'verified' as const,
      metricsGenerated: 3,
    },
    {
      id: '2',
      name: 'Demonstração de Resultados.xlsx',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: 1800000,
      uploadedAt: '15/04/2023',
      status: 'verified' as const,
      metricsGenerated: 2,
    },
    {
      id: '3',
      name: 'Comprovante de Residência.jpg',
      type: 'image/jpeg',
      size: 950000,
      uploadedAt: '10/04/2023',
      status: 'verified' as const,
      metricsGenerated: 1,
    }
  ];

  return (
    <DashboardLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold text-white mb-6">Visão Geral</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Score de Crédito"
            value="780"
            description="Baseado em 8 métricas verificadas"
            icon={<BarChart3 size={24} />}
            trend={{ value: 5, isPositive: true }}
            color="blue"
          />
          
          <MetricCard
            title="Documentos Verificados"
            value="8"
            description="De um total de 10 documentos"
            icon={<FileText size={24} />}
            color="green"
          />
          
          <MetricCard
            title="Consentimentos Ativos"
            value="3"
            description="Empresas com acesso aos seus dados"
            icon={<Shield size={24} />}
            color="purple"
          />
          
          <MetricCard
            title="Integrações Conectadas"
            value="2"
            description="De 5 integrações disponíveis"
            icon={<Link2 size={24} />}
            color="orange"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <MetricsProgress metrics={metrics} />
          </div>
          
          <div>
            <AccessRequests requests={accessRequests} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DocumentList documents={documents} />
          
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white mb-6">Atividade Recente</h2>
            
            <div className="space-y-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Building size={16} />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-white">Banco XYZ solicitou acesso às suas métricas</p>
                  <p className="text-xs text-gray-400 mt-1">Há 5 minutos</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    <FileText size={16} />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-white">Documento "Balanço Patrimonial 2023.pdf" verificado</p>
                  <p className="text-xs text-gray-400 mt-1">Há 2 horas</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <Wallet size={16} />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-white">Integração com Open Finance conectada</p>
                  <p className="text-xs text-gray-400 mt-1">Há 1 dia</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">
                    <Shield size={16} />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-white">Consentimento para Financeira ABC aprovado</p>
                  <p className="text-xs text-gray-400 mt-1">Há 2 dias</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
