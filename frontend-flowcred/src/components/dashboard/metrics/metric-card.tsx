"use client";

import React from 'react';
import { ArrowUpRight, ArrowDownRight, HelpCircle } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export function MetricCard({
  title,
  value,
  description,
  icon,
  trend,
  color = 'blue',
}: MetricCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/20',
    },
    green: {
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      border: 'border-green-500/20',
    },
    purple: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/20',
    },
    orange: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      border: 'border-orange-500/20',
    },
    red: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/20',
    },
  };

  const selectedColor = colorClasses[color];

  return (
    <div className={`rounded-xl border ${selectedColor.border} bg-gray-800/50 p-6 backdrop-blur-sm`}>
      <div className="flex justify-between items-start">
        <div className={`rounded-lg ${selectedColor.bg} p-3`}>
          <div className={selectedColor.text}>{icon}</div>
        </div>
        
        <button className="text-gray-400 hover:text-gray-300">
          <HelpCircle size={16} />
        </button>
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <div className="mt-2 flex items-baseline">
          <p className="text-2xl font-semibold text-white">{value}</p>
          
          {trend && (
            <span className={`ml-2 flex items-center text-sm ${
              trend.isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              {trend.isPositive ? (
                <ArrowUpRight className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4" />
              )}
              {trend.value}%
            </span>
          )}
        </div>
        
        {description && (
          <p className="mt-1 text-xs text-gray-400">{description}</p>
        )}
      </div>
    </div>
  );
}
