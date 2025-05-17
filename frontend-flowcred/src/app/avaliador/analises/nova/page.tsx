"use client";

import { AvaliadorLayout } from '@/components/avaliador/layout/avaliador-layout';
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Check,
  ChevronDown,
  GitBranch,
  LineChart,
  PieChart,
  Plus,
  Users,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Componente de seleção de tipo de análise
function AnalysisTypeSelector({ 
  selectedType, 
  onSelect 
}: { 
  selectedType: string; 
  onSelect: (type: string) => void 
}) {
  const types = [
    { id: 'flow', label: 'Flow', icon: GitBranch, color: 'border-purple-500 text-purple-400' },
    { id: 'offer', label: 'Oferta', icon: BarChart3, color: 'border-blue-500 text-blue-400' },
    { id: 'client', label: 'Cliente', icon: Users, color: 'border-green-500 text-green-400' },
    { id: 'general', label: 'Geral', icon: PieChart, color: 'border-orange-500 text-orange-400' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {types.map((type) => {
        const TypeIcon = type.icon;
        const isSelected = selectedType === type.id;
        
        return (
          <button
            key={type.id}
            className={`p-4 border-2 rounded-xl flex flex-col items-center justify-center transition-colors ${
              isSelected 
                ? `${type.color} bg-gray-800` 
                : 'border-gray-700 hover:border-gray-600 text-gray-400'
            }`}
            onClick={() => onSelect(type.id)}
          >
            <TypeIcon size={24} className="mb-2" />
            <span className="text-sm font-medium">{type.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Componente de seleção de período
function PeriodSelector({ 
  selectedPeriod, 
  onSelect 
}: { 
  selectedPeriod: string; 
  onSelect: (period: string) => void 
}) {
  const periods = [
    { id: '7d', label: 'Últimos 7 dias' },
    { id: '30d', label: 'Últimos 30 dias' },
    { id: '90d', label: 'Últimos 90 dias' },
    { id: 'ytd', label: 'Ano até agora' },
    { id: 'custom', label: 'Personalizado' }
  ];

  const [showCustom, setShowCustom] = useState(selectedPeriod === 'custom');

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        {periods.map((period) => {
          const isSelected = selectedPeriod === period.id;
          
          return (
            <button
              key={period.id}
              className={`p-2 border rounded-lg text-sm font-medium transition-colors ${
                isSelected 
                  ? 'border-purple-500 text-purple-400 bg-gray-800' 
                  : 'border-gray-700 hover:border-gray-600 text-gray-400'
              }`}
              onClick={() => {
                onSelect(period.id);
                if (period.id === 'custom') {
                  setShowCustom(true);
                } else {
                  setShowCustom(false);
                }
              }}
            >
              {period.label}
            </button>
          );
        })}
      </div>

      {showCustom && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Data Inicial</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Data Final</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Componente de seleção de métricas
function MetricsSelector({ 
  selectedMetrics, 
  onToggle 
}: { 
  selectedMetrics: string[]; 
  onToggle: (metric: string) => void 
}) {
  const metrics = [
    { id: 'usage_count', label: 'Utilizações' },
    { id: 'approval_rate', label: 'Taxa de Aprovação' },
    { id: 'rejection_rate', label: 'Taxa de Rejeição' },
    { id: 'avg_time', label: 'Tempo Médio de Processamento' },
    { id: 'avg_amount', label: 'Valor Médio' },
    { id: 'total_volume', label: 'Volume Total' },
    { id: 'conversion_rate', label: 'Taxa de Conversão' },
    { id: 'client_count', label: 'Número de Clientes' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const isSelected = selectedMetrics.includes(metric.id);
        
        return (
          <button
            key={metric.id}
            className={`p-3 border rounded-lg flex items-center justify-between transition-colors ${
              isSelected 
                ? 'border-purple-500 text-white bg-gray-800' 
                : 'border-gray-700 hover:border-gray-600 text-gray-400'
            }`}
            onClick={() => onToggle(metric.id)}
          >
            <span className="text-sm font-medium">{metric.label}</span>
            <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
              isSelected ? 'bg-purple-500' : 'bg-gray-700'
            }`}>
              {isSelected ? <Check size={12} /> : <Plus size={12} />}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// Componente de seleção de visualizações
function VisualizationsSelector({ 
  selectedVisualizations, 
  onToggle 
}: { 
  selectedVisualizations: string[]; 
  onToggle: (visualization: string) => void 
}) {
  const visualizations = [
    { id: 'line_chart', label: 'Gráfico de Linha', icon: LineChart },
    { id: 'bar_chart', label: 'Gráfico de Barras', icon: BarChart3 },
    { id: 'pie_chart', label: 'Gráfico de Pizza', icon: PieChart },
    { id: 'data_table', label: 'Tabela de Dados', icon: Calendar }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {visualizations.map((viz) => {
        const VizIcon = viz.icon;
        const isSelected = selectedVisualizations.includes(viz.id);
        
        return (
          <button
            key={viz.id}
            className={`p-4 border rounded-xl flex flex-col items-center justify-center transition-colors ${
              isSelected 
                ? 'border-purple-500 text-white bg-gray-800' 
                : 'border-gray-700 hover:border-gray-600 text-gray-400'
            }`}
            onClick={() => onToggle(viz.id)}
          >
            <VizIcon size={24} className="mb-2" />
            <span className="text-sm font-medium">{viz.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function NovaAnalisePage() {
  // Estados para os diferentes campos do formulário
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [analysisType, setAnalysisType] = useState('flow');
  const [period, setPeriod] = useState('30d');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['usage_count', 'approval_rate', 'avg_time']);
  const [selectedVisualizations, setSelectedVisualizations] = useState<string[]>(['line_chart', 'data_table']);
  
  // Função para alternar métricas selecionadas
  const toggleMetric = (metricId: string) => {
    if (selectedMetrics.includes(metricId)) {
      setSelectedMetrics(selectedMetrics.filter(id => id !== metricId));
    } else {
      setSelectedMetrics([...selectedMetrics, metricId]);
    }
  };
  
  // Função para alternar visualizações selecionadas
  const toggleVisualization = (vizId: string) => {
    if (selectedVisualizations.includes(vizId)) {
      setSelectedVisualizations(selectedVisualizations.filter(id => id !== vizId));
    } else {
      setSelectedVisualizations([...selectedVisualizations, vizId]);
    }
  };
  
  // Função para criar a análise
  const createAnalysis = () => {
    console.log({
      title,
      description,
      type: analysisType,
      period,
      metrics: selectedMetrics,
      visualizations: selectedVisualizations
    });
    
    // Redirecionar para a página de análises
    window.location.href = '/avaliador/analises';
  };

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
          
          <h1 className="text-2xl font-bold text-white">Nova Análise</h1>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white mb-4">Informações Básicas</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Título da Análise</label>
                <input
                  type="text"
                  placeholder="Ex: Desempenho do Flow de Avaliação Padrão"
                  className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Descrição</label>
                <textarea
                  placeholder="Descreva o objetivo desta análise..."
                  className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white h-24"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white mb-4">Tipo de Análise</h2>
            <AnalysisTypeSelector selectedType={analysisType} onSelect={setAnalysisType} />
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white mb-4">Período</h2>
            <PeriodSelector selectedPeriod={period} onSelect={setPeriod} />
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white mb-4">Métricas</h2>
            <p className="text-sm text-gray-400 mb-4">Selecione as métricas que deseja incluir na análise</p>
            <MetricsSelector selectedMetrics={selectedMetrics} onToggle={toggleMetric} />
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white mb-4">Visualizações</h2>
            <p className="text-sm text-gray-400 mb-4">Selecione os tipos de visualização para sua análise</p>
            <VisualizationsSelector selectedVisualizations={selectedVisualizations} onToggle={toggleVisualization} />
          </div>
          
          <div className="flex justify-end space-x-4">
            <Link
              href="/avaliador/analises"
              className="px-4 py-2 border border-gray-700 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </Link>
            
            <button
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
              onClick={createAnalysis}
              disabled={!title || selectedMetrics.length === 0 || selectedVisualizations.length === 0}
            >
              Criar Análise
            </button>
          </div>
        </div>
      </div>
    </AvaliadorLayout>
  );
}
