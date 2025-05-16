"use client";

import { AvaliadorLayout } from '@/components/avaliador/layout/avaliador-layout';
import {
    ArrowRight,
    BarChart3,
    Calendar,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Clock,
    Filter,
    RefreshCw,
    Search,
    Users,
    Wallet,
    XCircle
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Interface para os clientes
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'approved' | 'rejected' | 'pending' | 'scheduled';
  creditScore: number;
  lastEvaluation: string;
  nextEvaluation?: string;
  totalCredit?: string;
  metrics: {
    name: string;
    value: string | number;
    status: 'good' | 'warning' | 'bad';
  }[];
  consentExpiresAt?: string;
}

// Componente de Card de Cliente
function ClientCard({ client }: { client: Client }) {
  const [expanded, setExpanded] = useState(false);

  const statusConfig = {
    approved: {
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      text: 'Aprovado'
    },
    rejected: {
      icon: XCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      text: 'Rejeitado'
    },
    pending: {
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      text: 'Pendente'
    },
    scheduled: {
      icon: Calendar,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      text: 'Agendado'
    }
  };

  const StatusIcon = statusConfig[client.status].icon;

  // Função para determinar a cor do score de crédito
  const getCreditScoreColor = (score: number) => {
    if (score >= 700) return 'text-green-400';
    if (score >= 500) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm">
      <div
        className="p-4 hover:bg-gray-700/30 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-gray-600 to-gray-500 flex items-center justify-center text-white font-bold">
              {client.name.charAt(0)}
            </div>

            <div className="ml-3">
              <h3 className="text-lg font-medium text-white">{client.name}</h3>
              <p className="text-sm text-gray-400">{client.email}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className={`px-2 py-1 rounded-full mr-3 ${statusConfig[client.status].bgColor}`}>
              <span className={`text-xs font-medium ${statusConfig[client.status].color} flex items-center`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig[client.status].text}
              </span>
            </div>

            {expanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-700 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-700/30 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <BarChart3 className="h-4 w-4 text-blue-400 mr-2" />
                <h4 className="text-sm font-medium text-white">Score de Crédito</h4>
              </div>
              <p className={`text-xl font-bold ${getCreditScoreColor(client.creditScore)}`}>
                {client.creditScore}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Última avaliação: {client.lastEvaluation}
              </p>
            </div>

            {client.totalCredit && (
              <div className="bg-gray-700/30 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <Wallet className="h-4 w-4 text-green-400 mr-2" />
                  <h4 className="text-sm font-medium text-white">Crédito Total</h4>
                </div>
                <p className="text-xl font-bold text-white">
                  {client.totalCredit}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Crédito aprovado
                </p>
              </div>
            )}

            {client.nextEvaluation && (
              <div className="bg-gray-700/30 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <Calendar className="h-4 w-4 text-purple-400 mr-2" />
                  <h4 className="text-sm font-medium text-white">Próxima Avaliação</h4>
                </div>
                <p className="text-xl font-bold text-white">
                  {client.nextEvaluation}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {client.consentExpiresAt && `Consentimento válido até ${client.consentExpiresAt}`}
                </p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-white mb-3">Métricas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {client.metrics.map((metric, index) => (
                <div key={index} className="bg-gray-700/30 rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-300">{metric.name}</p>
                    <p className="text-xs text-gray-400">Valor: {metric.value}</p>
                  </div>
                  <div className={`h-2 w-2 rounded-full ${
                    metric.status === 'good' ? 'bg-green-400' :
                    metric.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            {client.status === 'rejected' && (
              <button className="flex items-center px-3 py-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-400 text-sm rounded-md transition-colors">
                <RefreshCw className="h-4 w-4 mr-2" />
                Agendar Reavaliação
              </button>
            )}

            {client.status === 'pending' && (
              <button className="flex items-center px-3 py-2 bg-green-600/30 hover:bg-green-600/50 text-green-400 text-sm rounded-md transition-colors">
                <CheckCircle className="h-4 w-4 mr-2" />
                Avaliar Agora
              </button>
            )}

            {client.status === 'scheduled' && (
              <button className="flex items-center px-3 py-2 bg-purple-600/30 hover:bg-purple-600/50 text-purple-400 text-sm rounded-md transition-colors">
                <Calendar className="h-4 w-4 mr-2" />
                Alterar Agendamento
              </button>
            )}

            <Link
              href={`/avaliador/clientes/${client.id}`}
              className="flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md transition-colors"
            >
              Ver Detalhes
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClientsPage() {
  // Estado para filtro e busca
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Dados de exemplo para clientes
  const clients: Client[] = [
    {
      id: 'client-1',
      name: 'João da Silva',
      email: 'joao.silva@email.com',
      phone: '(11) 98765-4321',
      status: 'approved',
      creditScore: 780,
      lastEvaluation: '15/05/2023',
      totalCredit: 'R$ 50.000,00',
      metrics: [
        { name: 'Renda Mensal', value: 'R$ 8.500,00', status: 'good' },
        { name: 'Índice de Liquidez', value: 2.3, status: 'good' },
        { name: 'Relação Dívida/Renda', value: '28%', status: 'good' },
        { name: 'Histórico de Pagamentos', value: 'Excelente', status: 'good' }
      ],
      consentExpiresAt: '15/11/2023'
    },
    {
      id: 'client-2',
      name: 'Maria Oliveira',
      email: 'maria.oliveira@email.com',
      phone: '(11) 98765-1234',
      status: 'pending',
      creditScore: 720,
      lastEvaluation: 'N/A',
      metrics: [
        { name: 'Renda Mensal', value: 'R$ 6.200,00', status: 'good' },
        { name: 'Índice de Liquidez', value: 1.8, status: 'warning' },
        { name: 'Relação Dívida/Renda', value: '35%', status: 'warning' },
        { name: 'Histórico de Pagamentos', value: 'Bom', status: 'good' }
      ],
      consentExpiresAt: '10/11/2023'
    },
    {
      id: 'client-3',
      name: 'Carlos Pereira',
      email: 'carlos.pereira@email.com',
      phone: '(11) 91234-5678',
      status: 'rejected',
      creditScore: 480,
      lastEvaluation: '10/05/2023',
      metrics: [
        { name: 'Renda Mensal', value: 'R$ 3.800,00', status: 'warning' },
        { name: 'Índice de Liquidez', value: 0.9, status: 'bad' },
        { name: 'Relação Dívida/Renda', value: '62%', status: 'bad' },
        { name: 'Histórico de Pagamentos', value: 'Regular', status: 'warning' }
      ],
      consentExpiresAt: '10/08/2023'
    },
    {
      id: 'client-4',
      name: 'Ana Santos',
      email: 'ana.santos@email.com',
      phone: '(11) 99876-5432',
      status: 'scheduled',
      creditScore: 650,
      lastEvaluation: '01/04/2023',
      nextEvaluation: '15/06/2023',
      metrics: [
        { name: 'Renda Mensal', value: 'R$ 5.500,00', status: 'good' },
        { name: 'Índice de Liquidez', value: 1.5, status: 'warning' },
        { name: 'Relação Dívida/Renda', value: '40%', status: 'warning' },
        { name: 'Histórico de Pagamentos', value: 'Regular', status: 'warning' }
      ],
      consentExpiresAt: '01/10/2023'
    }
  ];

  // Filtrar clientes
  const filteredClients = clients.filter(client => {
    // Filtrar por status
    if (statusFilter !== 'all' && client.status !== statusFilter) {
      return false;
    }

    // Filtrar por busca
    if (searchQuery && !client.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !client.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  return (
    <AvaliadorLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar clientes por nome ou email..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-400">Status:</span>
              </div>

              <select
                className="block pl-3 pr-10 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="approved">Aprovados</option>
                <option value="rejected">Rejeitados</option>
                <option value="pending">Pendentes</option>
                <option value="scheduled">Agendados</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <h3 className="text-lg font-medium text-white">Aprovados</h3>
            </div>
            <p className="text-3xl font-bold text-white">
              {clients.filter(c => c.status === 'approved').length}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Clientes com crédito aprovado
            </p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-yellow-400 mr-2" />
              <h3 className="text-lg font-medium text-white">Pendentes</h3>
            </div>
            <p className="text-3xl font-bold text-white">
              {clients.filter(c => c.status === 'pending').length}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Clientes aguardando avaliação
            </p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-blue-400 mr-2" />
              <h3 className="text-lg font-medium text-white">Agendados</h3>
            </div>
            <p className="text-3xl font-bold text-white">
              {clients.filter(c => c.status === 'scheduled').length}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Clientes com reavaliação agendada
            </p>
          </div>
        </div>

        {filteredClients.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center backdrop-blur-sm">
            <Users className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 mb-2">Nenhum cliente encontrado</p>
            <p className="text-sm text-gray-500">
              Tente ajustar seus filtros de busca
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredClients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        )}
      </div>
    </AvaliadorLayout>
  );
}
