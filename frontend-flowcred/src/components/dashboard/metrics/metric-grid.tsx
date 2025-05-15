"use client";

import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Lock,
  Search
} from 'lucide-react';
import Link from 'next/link';

interface Metric {
  id: string;
  name: string;
  value?: string | number;
  status: 'verified' | 'pending' | 'missing';
  category: string;
  proofAvailable?: boolean;
}

interface MetricGridProps {
  metrics: Metric[];
  filter?: string;
  onFilterChange?: (filter: string) => void;
}

export function MetricGrid({ metrics, filter = '', onFilterChange }: MetricGridProps) {
  // Agrupar métricas por categoria
  const metricsByCategory = metrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, Metric[]>);
  
  // Filtrar métricas se houver um filtro
  const filteredCategories = Object.keys(metricsByCategory).filter(category => {
    if (!filter) return true;
    
    // Verificar se a categoria contém o filtro
    if (category.toLowerCase().includes(filter.toLowerCase())) return true;
    
    // Verificar se alguma métrica na categoria contém o filtro
    return metricsByCategory[category].some(metric => 
      metric.name.toLowerCase().includes(filter.toLowerCase())
    );
  });
  
  return (
    <div>
      {onFilterChange && (
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar métricas..."
              className="pl-10 pr-4 py-2 w-full bg-gray-800 border border-gray-700 rounded-md text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={filter}
              onChange={(e) => onFilterChange(e.target.value)}
            />
          </div>
        </div>
      )}
      
      {filteredCategories.length === 0 ? (
        <div className="p-12 text-center">
          <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400 mb-2">Nenhuma métrica encontrada</p>
          <p className="text-sm text-gray-500">
            Adicione documentos ou conecte integrações para gerar métricas
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredCategories.map((category) => (
            <div key={category}>
              <h3 className="text-lg font-medium text-white mb-4">{category}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {metricsByCategory[category]
                  .filter(metric => {
                    if (!filter) return true;
                    return metric.name.toLowerCase().includes(filter.toLowerCase());
                  })
                  .map((metric) => (
                    <Link 
                      key={metric.id} 
                      href={`/dashboard/metricas/${metric.id}`}
                      className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:bg-gray-700/30 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          {metric.status === 'verified' && (
                            <CheckCircle2 className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
                          )}
                          {metric.status === 'pending' && (
                            <Clock className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" />
                          )}
                          {metric.status === 'missing' && (
                            <AlertCircle className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                          )}
                          <h4 className="text-sm font-medium text-white">{metric.name}</h4>
                        </div>
                        
                        {metric.proofAvailable && (
                          <div className="flex items-center px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                            <Lock className="h-3 w-3 mr-1" />
                            ZK
                          </div>
                        )}
                      </div>
                      
                      {metric.value && metric.status === 'verified' && (
                        <div className="mt-3 ml-7">
                          <p className="text-xl font-semibold text-white">{metric.value}</p>
                        </div>
                      )}
                      
                      {metric.status === 'pending' && (
                        <div className="mt-3 ml-7">
                          <p className="text-sm text-yellow-400">Em processamento</p>
                        </div>
                      )}
                      
                      {metric.status === 'missing' && (
                        <div className="mt-3 ml-7">
                          <p className="text-sm text-gray-400">Não disponível</p>
                        </div>
                      )}
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
