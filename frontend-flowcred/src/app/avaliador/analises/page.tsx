"use client";

import { AvaliadorLayout } from '@/components/avaliador/layout/avaliador-layout';
import {
  ArrowRight,
  BarChart3,
  Calendar,
  ChevronDown,
  Clock,
  Download,
  Filter,
  GitBranch,
  LineChart,
  PieChart,
  Search,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Interface para os dados de análise
interface AnalysisData {
  id: string;
  title: string;
  description: string;
  type: 'flow' | 'offer' | 'client' | 'general';
  period: string;
  createdAt: string;
  metrics: {
    key: string;
    label: string;
    value: string | number;
    change?: {
      value: number;
      isPositive: boolean;
    };
  }[];
  chartData?: any; // Simplificado para este exemplo
}

// Componente de Card de Análise
function AnalysisCard({ analysis }: { analysis: AnalysisData }) {
  const [expanded, setExpanded] = useState(false);

  const typeConfig = {
    flow: {
      icon: GitBranch,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      label: 'Flow'
    },
    offer: {
      icon: BarChart3,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      label: 'Oferta'
    },
    client: {
      icon: Users,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      label: 'Cliente'
    },
    general: {
      icon: PieChart,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      label: 'Geral'
    }
  };

  const TypeIcon = typeConfig[analysis.type].icon;

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm hover:bg-gray-800/70 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className={`h-12 w-12 rounded-lg ${typeConfig[analysis.type].bgColor} flex items-center justify-center ${typeConfig[analysis.type].color}`}>
            <TypeIcon size={24} />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-white">{analysis.title}</h3>
            <p className="text-sm text-gray-400 mt-1">{analysis.description}</p>
          </div>
        </div>

        <div className={`px-2 py-1 rounded-full ${typeConfig[analysis.type].bgColor}`}>
          <span className={`text-xs font-medium ${typeConfig[analysis.type].color}`}>
            {typeConfig[analysis.type].label}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center text-xs text-gray-400">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Período: {analysis.period}</span>
        </div>

        <div className="flex items-center text-xs text-gray-400">
          <Clock className="h-3 w-3 mr-1" />
          <span>Gerado em {analysis.createdAt}</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {analysis.metrics.slice(0, expanded ? analysis.metrics.length : 3).map((metric, index) => (
          <div key={index} className="bg-gray-700/30 rounded-lg p-3">
            <p className="text-sm font-medium text-white">{metric.value}</p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">{metric.label}</p>
              {metric.change && (
                <span className={`text-xs ${metric.change.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {metric.change.isPositive ? '+' : '-'}{metric.change.value}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {analysis.metrics.length > 3 && (
        <button
          className="mt-4 text-xs text-purple-400 hover:text-purple-300 flex items-center mx-auto"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Mostrar menos' : 'Mostrar mais'}
          <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      )}

      <div className="mt-6 flex justify-between">
        <button
          className="text-xs text-purple-400 hover:text-purple-300 flex items-center"
          onClick={() => console.log(`Download análise ${analysis.id}`)}
        >
          <Download className="h-3 w-3 mr-1" />
          Exportar
        </button>

        <Link
          href={`/avaliador/analises/${analysis.id}`}
          className="text-xs text-purple-400 hover:text-purple-300 flex items-center"
        >
          Ver detalhes
          <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

export default function AnalisesPage() {
  // Estado para filtro e busca
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'flow' | 'offer' | 'client' | 'general'>('all');

  // Dados de exemplo para análises
  const analyses: AnalysisData[] = [
    {
      id: 'analysis-1',
      title: 'Desempenho do Flow "Avaliação Padrão"',
      description: 'Análise de aprovações, rejeições e tempo médio de processamento',
      type: 'flow',
      period: 'Últimos 30 dias',
      createdAt: '15/05/2023',
      metrics: [
        { key: 'usage_count', label: 'Utilizações', value: 1245, change: { value: 12, isPositive: true } },
        { key: 'approval_rate', label: 'Taxa de Aprovação', value: '68%', change: { value: 5, isPositive: true } },
        { key: 'avg_time', label: 'Tempo Médio', value: '2.5 min', change: { value: 10, isPositive: false } },
        { key: 'rejection_rate', label: 'Taxa de Rejeição', value: '32%', change: { value: 5, isPositive: false } },
        { key: 'avg_amount', label: 'Valor Médio', value: 'R$ 15.000', change: { value: 8, isPositive: true } }
      ]
    },
    {
      id: 'analysis-2',
      title: 'Performance da Oferta "Crédito Empresarial"',
      description: 'Análise de conversão e métricas de desempenho',
      type: 'offer',
      period: 'Últimos 60 dias',
      createdAt: '10/05/2023',
      metrics: [
        { key: 'view_count', label: 'Visualizações', value: 856 },
        { key: 'application_count', label: 'Solicitações', value: 124, change: { value: 15, isPositive: true } },
        { key: 'conversion_rate', label: 'Taxa de Conversão', value: '14.5%', change: { value: 3, isPositive: true } },
        { key: 'avg_amount', label: 'Valor Médio', value: 'R$ 45.000', change: { value: 12, isPositive: true } }
      ]
    },
    {
      id: 'analysis-3',
      title: 'Segmentação de Clientes',
      description: 'Análise demográfica e comportamental dos clientes',
      type: 'client',
      period: 'Q2 2023',
      createdAt: '01/05/2023',
      metrics: [
        { key: 'total_clients', label: 'Total de Clientes', value: 3256, change: { value: 8, isPositive: true } },
        { key: 'active_clients', label: 'Clientes Ativos', value: 2145, change: { value: 5, isPositive: true } },
        { key: 'avg_score', label: 'Score Médio', value: 720, change: { value: 2, isPositive: true } },
        { key: 'repeat_rate', label: 'Taxa de Retorno', value: '35%', change: { value: 7, isPositive: true } }
      ]
    },
    {
      id: 'analysis-4',
      title: 'Visão Geral de Desempenho',
      description: 'Métricas gerais de desempenho da plataforma',
      type: 'general',
      period: 'Ano de 2023',
      createdAt: '05/04/2023',
      metrics: [
        { key: 'total_volume', label: 'Volume Total', value: 'R$ 4.5M', change: { value: 15, isPositive: true } },
        { key: 'avg_approval', label: 'Aprovação Média', value: '65%', change: { value: 3, isPositive: true } },
        { key: 'avg_processing', label: 'Tempo Médio', value: '3.2 min', change: { value: 8, isPositive: false } },
        { key: 'active_flows', label: 'Flows Ativos', value: 12, change: { value: 20, isPositive: true } },
        { key: 'active_offers', label: 'Ofertas Ativas', value: 8, change: { value: 33, isPositive: true } }
      ]
    }
  ];

  // Filtrar análises
  const filteredAnalyses = analyses.filter(analysis => {
    // Filtrar por tipo
    if (typeFilter !== 'all' && analysis.type !== typeFilter) {
      return false;
    }

    // Filtrar por busca
    if (searchQuery && !analysis.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !analysis.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  return (
    <AvaliadorLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Análises</h1>

          <Link
            href="/avaliador/analises/nova"
            className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
          >
            <LineChart className="h-4 w-4 mr-2" />
            Nova Análise
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
                placeholder="Buscar análises..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-400">Tipo:</span>
              </div>

              <select
                className="block pl-3 pr-10 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
              >
                <option value="all">Todos</option>
                <option value="flow">Flows</option>
                <option value="offer">Ofertas</option>
                <option value="client">Clientes</option>
                <option value="general">Geral</option>
              </select>
            </div>
          </div>
        </div>

        {filteredAnalyses.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center backdrop-blur-sm">
            <BarChart3 className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 mb-2">Nenhuma análise encontrada</p>
            <p className="text-sm text-gray-500 mb-6">
              {searchQuery || typeFilter !== 'all'
                ? 'Tente ajustar seus filtros de busca'
                : 'Crie sua primeira análise'}
            </p>

            {!searchQuery && typeFilter === 'all' && (
              <Link
                href="/avaliador/analises/nova"
                className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
              >
                <LineChart className="h-4 w-4 mr-2" />
                Criar Nova Análise
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAnalyses.map((analysis) => (
              <AnalysisCard key={analysis.id} analysis={analysis} />
            ))}
          </div>
        )}
      </div>
    </AvaliadorLayout>
  );
}
