"use client";

import { AvaliadorLayout } from '@/components/avaliador/layout/avaliador-layout';
import {
    BarChart3,
    Calendar,
    CheckCircle,
    Clock,
    Copy,
    Edit,
    Filter,
    GitBranch,
    Plus,
    Search,
    Trash2,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Interface para os flows
interface CreditFlow {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'draft' | 'archived';
  stats: {
    usageCount: number;
    approvalRate: number;
    averageProcessingTime: string;
  };
}

// Componente de Card de Flow
function FlowCard({ flow, onEdit, onDuplicate, onDelete }: {
  flow: CreditFlow,
  onEdit: (id: string) => void,
  onDuplicate: (id: string) => void,
  onDelete: (id: string) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const statusConfig = {
    active: {
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      text: 'Ativo'
    },
    draft: {
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      text: 'Rascunho'
    },
    archived: {
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/20',
      text: 'Arquivado'
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm hover:bg-gray-800/70 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
            <GitBranch size={24} />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-white">{flow.name}</h3>
            <p className="text-sm text-gray-400 mt-1">{flow.description}</p>
          </div>
        </div>

        <div className="relative">
          <button
            className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  onClick={() => {
                    onEdit(flow.id);
                    setMenuOpen(false);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </button>
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  onClick={() => {
                    onDuplicate(flow.id);
                    setMenuOpen(false);
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicar
                </button>
                <div className="border-t border-gray-700 my-1"></div>
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                  onClick={() => {
                    onDelete(flow.id);
                    setMenuOpen(false);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className={`px-2 py-1 rounded-full ${statusConfig[flow.status].bgColor}`}>
          <span className={`text-xs font-medium ${statusConfig[flow.status].color}`}>
            {statusConfig[flow.status].text}
          </span>
        </div>

        <div className="flex items-center text-xs text-gray-400">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Atualizado em {flow.updatedAt}</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-sm font-medium text-white">{flow.stats.usageCount}</p>
          <p className="text-xs text-gray-400 flex items-center justify-center">
            <Users className="h-3 w-3 mr-1" />
            Utilizações
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-white">{flow.stats.approvalRate}%</p>
          <p className="text-xs text-gray-400 flex items-center justify-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aprovação
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-white">{flow.stats.averageProcessingTime}</p>
          <p className="text-xs text-gray-400 flex items-center justify-center">
            <Clock className="h-3 w-3 mr-1" />
            Tempo médio
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <Link
          href={`/avaliador/flows/${flow.id}/analytics`}
          className="text-xs text-purple-400 hover:text-purple-300 flex items-center"
        >
          <BarChart3 className="h-3 w-3 mr-1" />
          Ver análises
        </Link>

        <Link
          href={`/avaliador/flows/${flow.id}`}
          className="text-xs text-purple-400 hover:text-purple-300 flex items-center"
        >
          Ver detalhes
          <svg className="h-3 w-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default function FlowsPage() {
  // Estado para filtro e busca
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'archived'>('all');

  // Dados de exemplo para flows
  const flows: CreditFlow[] = [
    {
      id: 'flow-1',
      name: 'Avaliação Padrão',
      description: 'Flow padrão para avaliação de crédito pessoal',
      createdAt: '10/01/2023',
      updatedAt: '15/05/2023',
      status: 'active',
      stats: {
        usageCount: 1245,
        approvalRate: 68,
        averageProcessingTime: '2.5 min'
      }
    },
    {
      id: 'flow-2',
      name: 'Avaliação Premium',
      description: 'Flow para clientes de alta renda',
      createdAt: '15/02/2023',
      updatedAt: '10/05/2023',
      status: 'active',
      stats: {
        usageCount: 532,
        approvalRate: 85,
        averageProcessingTime: '3.2 min'
      }
    },
    {
      id: 'flow-3',
      name: 'Microcrédito',
      description: 'Flow para avaliação de microcrédito',
      createdAt: '05/03/2023',
      updatedAt: '01/05/2023',
      status: 'draft',
      stats: {
        usageCount: 0,
        approvalRate: 0,
        averageProcessingTime: 'N/A'
      }
    },
    {
      id: 'flow-4',
      name: 'Financiamento Imobiliário',
      description: 'Flow para avaliação de financiamento imobiliário',
      createdAt: '20/12/2022',
      updatedAt: '05/04/2023',
      status: 'archived',
      stats: {
        usageCount: 328,
        approvalRate: 45,
        averageProcessingTime: '8.5 min'
      }
    }
  ];

  // Filtrar flows
  const filteredFlows = flows.filter(flow => {
    // Filtrar por status
    if (statusFilter !== 'all' && flow.status !== statusFilter) {
      return false;
    }

    // Filtrar por busca
    if (searchQuery && !flow.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !flow.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Handlers para ações nos flows
  const handleEditFlow = (id: string) => {
    console.log(`Editar flow ${id}`);
    window.location.href = `/avaliador/flows/${id}/edit`;
  };

  const handleDuplicateFlow = (id: string) => {
    console.log(`Duplicar flow ${id}`);
    // Lógica para duplicar flow
  };

  const handleDeleteFlow = (id: string) => {
    console.log(`Excluir flow ${id}`);
    // Lógica para excluir flow
  };

  return (
    <AvaliadorLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Flows de Avaliação</h1>

          <Link
            href="/avaliador/flows/novo"
            className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Flow
          </Link>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar flows..."
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
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="draft">Rascunhos</option>
                <option value="archived">Arquivados</option>
              </select>
            </div>
          </div>
        </div>

        {filteredFlows.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center backdrop-blur-sm">
            <GitBranch className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 mb-2">Nenhum flow encontrado</p>
            <p className="text-sm text-gray-500 mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'Tente ajustar seus filtros de busca'
                : 'Crie seu primeiro flow de avaliação de crédito'}
            </p>

            {!searchQuery && statusFilter === 'all' && (
              <Link
                href="/avaliador/flows/novo"
                className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Novo Flow
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFlows.map((flow) => (
              <FlowCard
                key={flow.id}
                flow={flow}
                onEdit={handleEditFlow}
                onDuplicate={handleDuplicateFlow}
                onDelete={handleDeleteFlow}
              />
            ))}
          </div>
        )}
      </div>
    </AvaliadorLayout>
  );
}
