"use client";

import { DashboardLayout } from '@/components/dashboard/layout/dashboard-layout';
import {
    AlertTriangle,
    ArrowRight,
    BarChart3,
    CheckCircle,
    Clock,
    FileText,
    GitBranch,
    Plus,
    Users,
    Wallet
} from 'lucide-react';
import Link from 'next/link';

// Componente de Card Métrica
interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

function MetricCard({ title, value, description, icon, trend, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    purple: 'bg-purple-500/20 text-purple-400',
    orange: 'bg-orange-500/20 text-orange-400',
    red: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center">
        <div className={`h-12 w-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-white">{value}</h3>
          <p className="text-sm text-gray-400">{title}</p>
        </div>
        {trend && (
          <div className="ml-auto">
            <div className={`flex items-center ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              <span className="text-sm font-medium">{trend.isPositive ? '+' : '-'}{trend.value}%</span>
              <svg
                className={`h-4 w-4 ml-1 ${!trend.isPositive && 'transform rotate-180'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
            <p className="text-xs text-gray-500">vs. mês anterior</p>
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-gray-500">{description}</p>
    </div>
  );
}

// Componente de Solicitação de Crédito
interface CreditRequestProps {
  id: string;
  client: {
    name: string;
    avatar?: string;
  };
  requestedAt: string;
  amount: string;
  status: 'pending' | 'approved' | 'rejected';
}

function CreditRequest({ id, client, requestedAt, amount, status }: CreditRequestProps) {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      text: 'Pendente'
    },
    approved: {
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      text: 'Aprovado'
    },
    rejected: {
      icon: AlertTriangle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      text: 'Rejeitado'
    }
  };

  const StatusIcon = statusConfig[status].icon;

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-gray-600 to-gray-500 flex items-center justify-center text-white font-bold">
            {client.name.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{client.name}</p>
            <p className="text-xs text-gray-400">Solicitado em {requestedAt}</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="mr-4">
            <p className="text-sm font-medium text-white">{amount}</p>
            <p className="text-xs text-gray-400">Valor solicitado</p>
          </div>
          <div className={`flex items-center px-2 py-1 rounded-full ${statusConfig[status].bgColor}`}>
            <StatusIcon className={`h-3 w-3 mr-1 ${statusConfig[status].color}`} />
            <span className={`text-xs font-medium ${statusConfig[status].color}`}>{statusConfig[status].text}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Link
          href={`/avaliador/solicitacoes/${id}`}
          className="text-xs text-purple-400 hover:text-purple-300 flex items-center"
        >
          Ver detalhes
          <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

export default function AvaliadorDashboardPage() {
  // Dados de exemplo para métricas
  const metrics = [
    {
      title: "Solicitações Pendentes",
      value: "24",
      description: "Solicitações aguardando avaliação",
      icon: <Clock size={24} />,
      color: "orange" as const,
      trend: { value: 12, isPositive: false }
    },
    {
      title: "Taxa de Aprovação",
      value: "68%",
      description: "Média dos últimos 30 dias",
      icon: <CheckCircle size={24} />,
      color: "green" as const,
      trend: { value: 5, isPositive: true }
    },
    {
      title: "Clientes Ativos",
      value: "1.256",
      description: "Total de clientes com crédito ativo",
      icon: <Users size={24} />,
      color: "blue" as const,
      trend: { value: 8, isPositive: true }
    },
    {
      title: "Crédito Concedido",
      value: "R$ 4.5M",
      description: "Total no mês atual",
      icon: <Wallet size={24} />,
      color: "purple" as const,
      trend: { value: 15, isPositive: true }
    }
  ];

  // Dados de exemplo para solicitações recentes
  const recentRequests = [
    {
      id: "req-001",
      client: { name: "João da Silva" },
      requestedAt: "15/05/2023",
      amount: "R$ 25.000,00",
      status: "pending" as const
    },
    {
      id: "req-002",
      client: { name: "Maria Oliveira" },
      requestedAt: "14/05/2023",
      amount: "R$ 50.000,00",
      status: "approved" as const
    },
    {
      id: "req-003",
      client: { name: "Carlos Pereira" },
      requestedAt: "13/05/2023",
      amount: "R$ 15.000,00",
      status: "rejected" as const
    }
  ];

  return (
    <DashboardLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold text-white mb-6">Visão Geral</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              description={metric.description}
              icon={metric.icon}
              trend={metric.trend}
              color={metric.color}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-white">Solicitações Recentes</h2>
              <Link
                href="/avaliador/solicitacoes"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Ver todas
              </Link>
            </div>
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <CreditRequest
                  key={request.id}
                  id={request.id}
                  client={request.client}
                  requestedAt={request.requestedAt}
                  amount={request.amount}
                  status={request.status}
                />
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white mb-6">Ações Rápidas</h2>
            <div className="space-y-4">
              <Link href="/avaliador/flows/novo" className="flex items-center p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
                <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <GitBranch size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">Criar Novo Flow</p>
                  <p className="text-xs text-gray-400">Desenhe um novo fluxo de avaliação</p>
                </div>
                <Plus className="ml-auto h-5 w-5 text-gray-400" />
              </Link>

              <Link href="/avaliador/parametros/novo" className="flex items-center p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
                <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <FileText size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">Definir Parâmetros</p>
                  <p className="text-xs text-gray-400">Configure novos parâmetros de avaliação</p>
                </div>
                <Plus className="ml-auto h-5 w-5 text-gray-400" />
              </Link>

              <Link href="/avaliador/analises" className="flex items-center p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
                <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                  <BarChart3 size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">Ver Análises</p>
                  <p className="text-xs text-gray-400">Analise o desempenho dos seus flows</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-white mb-6">Atividade Recente</h2>
          <div className="space-y-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <GitBranch size={16} />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-white">Flow &quot;Avaliação Premium&quot; foi atualizado</p>
                <p className="text-xs text-gray-400 mt-1">Há 2 horas por Ana Cardoso</p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                  <CheckCircle size={16} />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-white">Solicitação de Maria Oliveira foi aprovada</p>
                <p className="text-xs text-gray-400 mt-1">Há 5 horas por Carlos Santos</p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <FileText size={16} />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-white">Novo parâmetro &quot;Histórico de Pagamentos&quot; adicionado</p>
                <p className="text-xs text-gray-400 mt-1">Há 1 dia por Ana Cardoso</p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                  <AlertTriangle size={16} />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-white">Alerta de risco para cliente Carlos Pereira</p>
                <p className="text-xs text-gray-400 mt-1">Há 2 dias pelo sistema</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
