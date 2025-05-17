"use client";

import { AvaliadorLayout } from '@/components/avaliador/layout/avaliador-layout';
import {
  ArrowRight,
  Calendar,
  CreditCard,
  DollarSign,
  Edit,
  Filter,
  MoreVertical,
  Percent,
  Plus,
  Search,
  Tag,
  Trash2,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Interface para as ofertas de crédito
interface CreditOffer {
  id: string;
  name: string;
  description: string;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  term: {
    min: number;
    max: number;
    unit: 'dias' | 'meses' | 'anos';
  };
  requirements: string[];
  status: 'active' | 'draft' | 'expired';
  createdAt: string;
  expiresAt: string;
  stats: {
    viewCount: number;
    applicationCount: number;
    approvalRate: number;
  };
}

// Componente de Card de Oferta
function OfferCard({ offer }: { offer: CreditOffer }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const statusConfig = {
    active: {
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      text: 'Ativa'
    },
    draft: {
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      text: 'Rascunho'
    },
    expired: {
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      text: 'Expirada'
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm hover:bg-gray-800/70 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
            <CreditCard size={24} />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-white">{offer.name}</h3>
            <p className="text-sm text-gray-400 mt-1">{offer.description}</p>
          </div>
        </div>

        <div className="relative">
          <button
            className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <MoreVertical size={20} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                <Link
                  href={`/avaliador/ofertas/${offer.id}/editar`}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  onClick={() => setMenuOpen(false)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Link>
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                  onClick={() => {
                    console.log(`Excluir oferta ${offer.id}`);
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
        <div className={`px-2 py-1 rounded-full ${statusConfig[offer.status].bgColor}`}>
          <span className={`text-xs font-medium ${statusConfig[offer.status].color}`}>
            {statusConfig[offer.status].text}
          </span>
        </div>

        <div className="flex items-center text-xs text-gray-400">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Expira em {offer.expiresAt}</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gray-700/30 rounded-lg p-3">
          <div className="flex items-center text-gray-400 mb-1">
            <DollarSign className="h-3 w-3 mr-1" />
            <span className="text-xs">Valor</span>
          </div>
          <p className="text-sm font-medium text-white">
            R$ {offer.minAmount.toLocaleString('pt-BR')} - R$ {offer.maxAmount.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-3">
          <div className="flex items-center text-gray-400 mb-1">
            <Percent className="h-3 w-3 mr-1" />
            <span className="text-xs">Taxa de Juros</span>
          </div>
          <p className="text-sm font-medium text-white">{offer.interestRate}% ao mês</p>
        </div>
      </div>

      <div className="mt-4 bg-gray-700/30 rounded-lg p-3">
        <div className="flex items-center text-gray-400 mb-1">
          <Calendar className="h-3 w-3 mr-1" />
          <span className="text-xs">Prazo</span>
        </div>
        <p className="text-sm font-medium text-white">
          {offer.term.min} a {offer.term.max} {offer.term.unit}
        </p>
      </div>

      <div className="mt-4">
        <div className="flex items-center text-gray-400 mb-2">
          <Tag className="h-3 w-3 mr-1" />
          <span className="text-xs">Requisitos</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {offer.requirements.map((req, index) => (
            <span key={index} className="px-2 py-1 bg-gray-700/50 rounded-md text-xs text-gray-300">
              {req}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-sm font-medium text-white">{offer.stats.viewCount}</p>
          <p className="text-xs text-gray-400">Visualizações</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-white">{offer.stats.applicationCount}</p>
          <p className="text-xs text-gray-400">Solicitações</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-white">{offer.stats.approvalRate}%</p>
          <p className="text-xs text-gray-400">Taxa de Aprovação</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Link
          href={`/avaliador/ofertas/${offer.id}`}
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
        >
          Ver detalhes
          <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

export default function OfertasPage() {
  // Estado para filtro e busca
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'expired'>('all');

  // Dados de exemplo para ofertas
  const offers: CreditOffer[] = [
    {
      id: 'offer-1',
      name: 'Crédito Pessoal Básico',
      description: 'Oferta de crédito pessoal com condições facilitadas',
      interestRate: 1.99,
      minAmount: 1000,
      maxAmount: 10000,
      term: {
        min: 6,
        max: 24,
        unit: 'meses'
      },
      requirements: ['Score > 600', 'Renda comprovada', 'Sem restrições'],
      status: 'active',
      createdAt: '10/04/2023',
      expiresAt: '10/10/2023',
      stats: {
        viewCount: 1245,
        applicationCount: 328,
        approvalRate: 72
      }
    },
    {
      id: 'offer-2',
      name: 'Crédito Empresarial',
      description: 'Para pequenas e médias empresas com faturamento comprovado',
      interestRate: 1.5,
      minAmount: 10000,
      maxAmount: 100000,
      term: {
        min: 12,
        max: 48,
        unit: 'meses'
      },
      requirements: ['CNPJ ativo > 1 ano', 'Faturamento mínimo', 'Sem protestos'],
      status: 'active',
      createdAt: '15/03/2023',
      expiresAt: '15/09/2023',
      stats: {
        viewCount: 856,
        applicationCount: 124,
        approvalRate: 65
      }
    },
    {
      id: 'offer-3',
      name: 'Financiamento Estudantil',
      description: 'Crédito para estudantes de graduação e pós-graduação',
      interestRate: 0.99,
      minAmount: 5000,
      maxAmount: 50000,
      term: {
        min: 24,
        max: 72,
        unit: 'meses'
      },
      requirements: ['Matrícula ativa', 'Fiador', 'Idade entre 18-35 anos'],
      status: 'draft',
      createdAt: '05/05/2023',
      expiresAt: 'N/A',
      stats: {
        viewCount: 0,
        applicationCount: 0,
        approvalRate: 0
      }
    },
    {
      id: 'offer-4',
      name: 'Crédito Consignado',
      description: 'Para servidores públicos e aposentados',
      interestRate: 1.2,
      minAmount: 2000,
      maxAmount: 80000,
      term: {
        min: 12,
        max: 96,
        unit: 'meses'
      },
      requirements: ['Servidor público/Aposentado', 'Margem consignável'],
      status: 'expired',
      createdAt: '10/01/2023',
      expiresAt: '10/07/2023',
      stats: {
        viewCount: 2145,
        applicationCount: 543,
        approvalRate: 88
      }
    }
  ];

  // Filtrar ofertas
  const filteredOffers = offers.filter(offer => {
    // Filtrar por status
    if (statusFilter !== 'all' && offer.status !== statusFilter) {
      return false;
    }

    // Filtrar por busca
    if (searchQuery && !offer.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !offer.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  return (
    <AvaliadorLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Ofertas de Crédito</h1>

          <Link
            href="/avaliador/ofertas/nova"
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Oferta
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
                placeholder="Buscar ofertas..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                className="block pl-3 pr-10 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="all">Todas</option>
                <option value="active">Ativas</option>
                <option value="draft">Rascunhos</option>
                <option value="expired">Expiradas</option>
              </select>
            </div>
          </div>
        </div>

        {filteredOffers.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center backdrop-blur-sm">
            <CreditCard className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 mb-2">Nenhuma oferta encontrada</p>
            <p className="text-sm text-gray-500 mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'Tente ajustar seus filtros de busca'
                : 'Crie sua primeira oferta de crédito'}
            </p>

            {!searchQuery && statusFilter === 'all' && (
              <Link
                href="/avaliador/ofertas/nova"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Nova Oferta
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </div>
    </AvaliadorLayout>
  );
}
