"use client";

import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface Metric {
  id: string;
  name: string;
  status: 'verified' | 'pending' | 'missing';
  category: string;
}

interface MetricsProgressProps {
  metrics: Metric[];
}

export function MetricsProgress({ metrics }: MetricsProgressProps) {
  // Agrupar métricas por categoria
  const metricsByCategory = metrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, Metric[]>);

  // Calcular estatísticas
  const totalMetrics = metrics.length;
  const verifiedMetrics = metrics.filter(m => m.status === 'verified').length;
  // Estas variáveis estão disponíveis para uso futuro
  // const pendingMetrics = metrics.filter(m => m.status === 'pending').length;
  // const missingMetrics = metrics.filter(m => m.status === 'missing').length;

  const percentVerified = Math.round((verifiedMetrics / totalMetrics) * 100);

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-white">Progresso de Métricas</h2>
        <span className="text-sm text-gray-400">
          {verifiedMetrics} de {totalMetrics} métricas verificadas
        </span>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Progresso geral</span>
          <span className="text-sm font-medium text-white">{percentVerified}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-blue-500 h-2.5 rounded-full"
            style={{ width: `${percentVerified}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(metricsByCategory).map(([category, categoryMetrics]) => {
          const categoryVerified = categoryMetrics.filter(m => m.status === 'verified').length;
          // Variável disponível para uso futuro
          // const categoryPercent = Math.round((categoryVerified / categoryMetrics.length) * 100);

          return (
            <div key={category}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white">{category}</span>
                <span className="text-xs text-gray-400">
                  {categoryVerified} de {categoryMetrics.length} verificadas
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {categoryMetrics.map((metric) => (
                  <div
                    key={metric.id}
                    className="flex items-center p-2 rounded-md bg-gray-700/50 border border-gray-700"
                  >
                    {metric.status === 'verified' && (
                      <CheckCircle2 className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                    )}
                    {metric.status === 'pending' && (
                      <Clock className="h-4 w-4 text-yellow-400 mr-2 flex-shrink-0" />
                    )}
                    {metric.status === 'missing' && (
                      <AlertCircle className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${
                      metric.status === 'verified'
                        ? 'text-white'
                        : metric.status === 'pending'
                          ? 'text-gray-300'
                          : 'text-gray-400'
                    }`}>
                      {metric.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
