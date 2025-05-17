"use client";

import { AvaliadorLayout } from '@/components/avaliador/layout/avaliador-layout';
import {
    ArrowLeft,
    BarChart3,
    Calendar,
    ChevronDown,
    Clock,
    Download,
    GitBranch,
    PieChart,
    Share2,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Componente para exibir métricas
function MetricCard({ label, value, change }: {
  label: string;
  value: string | number;
  change?: { value: number; isPositive: boolean }
}) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm">
      <p className="text-lg font-semibold text-white">{value}</p>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{label}</p>
        {change && (
          <span className={`text-sm ${change.isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {change.isPositive ? '+' : '-'}{change.value}%
          </span>
        )}
      </div>
    </div>
  );
}

// Componente para exibir gráficos (simplificado)
function ChartSection({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 mb-4">{description}</p>

      {/* Placeholder para o gráfico */}
      <div className="h-64 bg-gray-700/30 rounded-lg flex items-center justify-center">
        <BarChart3 className="h-12 w-12 text-gray-500" />
        <p className="text-gray-400 ml-2">Visualização do gráfico</p>
      </div>
    </div>
  );
}

// Componente para exibir tabelas de dados (simplificado)
function DataTable({ title, headers, rows }: {
  title: string;
  headers: string[];
  rows: (string | number)[][]
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <button
          className="text-xs text-purple-400 hover:text-purple-300 flex items-center"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Mostrar menos' : 'Mostrar mais'}
          <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {rows.slice(0, expanded ? rows.length : 5).map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-700/30">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-3 text-sm text-gray-300"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!expanded && rows.length > 5 && (
        <div className="text-center mt-4 text-sm text-gray-400">
          Mostrando 5 de {rows.length} registros
        </div>
      )}
    </div>
  );
}

export default function AnaliseDetalhesPage({ params }: any) {
  // Dados de exemplo para a análise
  const analysis = {
    id: params.id,
    title: 'Desempenho do Flow "Avaliação Padrão"',
    description: 'Análise detalhada de aprovações, rejeições e tempo médio de processamento',
    type: 'flow',
    period: 'Últimos 30 dias',
    createdAt: '15/05/2023',
    metrics: [
      { key: 'usage_count', label: 'Utilizações', value: 1245, change: { value: 12, isPositive: true } },
      { key: 'approval_rate', label: 'Taxa de Aprovação', value: '68%', change: { value: 5, isPositive: true } },
      { key: 'avg_time', label: 'Tempo Médio', value: '2.5 min', change: { value: 10, isPositive: false } },
      { key: 'rejection_rate', label: 'Taxa de Rejeição', value: '32%', change: { value: 5, isPositive: false } },
      { key: 'avg_amount', label: 'Valor Médio', value: 'R$ 15.000', change: { value: 8, isPositive: true } },
      { key: 'total_volume', label: 'Volume Total', value: 'R$ 18.6M', change: { value: 15, isPositive: true } }
    ],
    charts: [
      { title: 'Aprovações vs. Rejeições', description: 'Distribuição de aprovações e rejeições ao longo do tempo' },
      { title: 'Tempo Médio de Processamento', description: 'Evolução do tempo médio de processamento' },
      { title: 'Distribuição por Valor', description: 'Distribuição das solicitações por faixa de valor' }
    ],
    tables: [
      {
        title: 'Histórico de Solicitações',
        headers: ['ID', 'Cliente', 'Data', 'Valor', 'Status', 'Tempo'],
        rows: [
          ['SOL-001', 'João da Silva', '15/05/2023', 'R$ 25.000', 'Aprovado', '2.1 min'],
          ['SOL-002', 'Maria Oliveira', '14/05/2023', 'R$ 50.000', 'Aprovado', '3.5 min'],
          ['SOL-003', 'Carlos Pereira', '13/05/2023', 'R$ 15.000', 'Rejeitado', '1.8 min'],
          ['SOL-004', 'Ana Santos', '12/05/2023', 'R$ 30.000', 'Aprovado', '2.7 min'],
          ['SOL-005', 'Pedro Costa', '11/05/2023', 'R$ 10.000', 'Rejeitado', '1.5 min'],
          ['SOL-006', 'Lucia Ferreira', '10/05/2023', 'R$ 20.000', 'Aprovado', '2.3 min'],
          ['SOL-007', 'Roberto Alves', '09/05/2023', 'R$ 35.000', 'Aprovado', '2.9 min'],
          ['SOL-008', 'Juliana Lima', '08/05/2023', 'R$ 18.000', 'Rejeitado', '2.0 min'],
          ['SOL-009', 'Fernando Gomes', '07/05/2023', 'R$ 22.000', 'Aprovado', '2.4 min'],
          ['SOL-010', 'Camila Souza', '06/05/2023', 'R$ 40.000', 'Aprovado', '3.2 min']
        ]
      }
    ]
  };

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

  const TypeIcon = typeConfig[analysis.type as keyof typeof typeConfig].icon;

  return (
    <AvaliadorLayout>
      <div className="py-6">
        <div className="flex items-center mb-6">
          <Link
            href="/avaliador/analises"
            className="mr-4 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <ArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-white">{analysis.title}</h1>
            <p className="text-gray-400">{analysis.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-full ${typeConfig[analysis.type as keyof typeof typeConfig].bgColor}`}>
              <span className={`text-sm font-medium flex items-center ${typeConfig[analysis.type as keyof typeof typeConfig].color}`}>
                <TypeIcon className="mr-1 h-4 w-4" />
                {typeConfig[analysis.type as keyof typeof typeConfig].label}
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-400">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Período: {analysis.period}</span>
            </div>

            <div className="flex items-center text-sm text-gray-400">
              <Clock className="h-4 w-4 mr-1" />
              <span>Gerado em {analysis.createdAt}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="flex items-center px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors">
              <Download className="h-4 w-4 mr-1" />
              Exportar
            </button>
            <button className="flex items-center px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors">
              <Share2 className="h-4 w-4 mr-1" />
              Compartilhar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {analysis.metrics.map((metric, index) => (
            <MetricCard
              key={index}
              label={metric.label}
              value={metric.value}
              change={metric.change}
            />
          ))}
        </div>

        <div className="space-y-8">
          {analysis.charts.map((chart, index) => (
            <ChartSection
              key={index}
              title={chart.title}
              description={chart.description}
            />
          ))}

          {analysis.tables.map((table, index) => (
            <DataTable
              key={index}
              title={table.title}
              headers={table.headers}
              rows={table.rows}
            />
          ))}
        </div>
      </div>
    </AvaliadorLayout>
  );
}
