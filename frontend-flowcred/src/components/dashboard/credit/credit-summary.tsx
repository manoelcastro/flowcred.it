"use client";

import React from 'react';
import { DollarSign, TrendingUp, Building, Percent } from 'lucide-react';

interface CreditSummaryProps {
  totalAvailableCredit: string;
  totalInstitutions: number;
  averageInterestRate: string;
  creditScore: string;
  creditScoreTrend?: {
    value: number;
    isPositive: boolean;
  };
}

export function CreditSummary({
  totalAvailableCredit,
  totalInstitutions,
  averageInterestRate,
  creditScore,
  creditScoreTrend
}: CreditSummaryProps) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
      <h2 className="text-lg font-semibold text-white mb-6">Resumo de Crédito</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
              <DollarSign className="h-5 w-5" />
            </div>
            <h3 className="ml-3 text-sm font-medium text-white">Crédito Total Disponível</h3>
          </div>
          <p className="text-2xl font-semibold text-white">{totalAvailableCredit}</p>
          <p className="mt-1 text-xs text-gray-400">Somando todas as instituições</p>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="ml-3 text-sm font-medium text-white">Score de Crédito</h3>
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-white">{creditScore}</p>
            
            {creditScoreTrend && (
              <span className={`ml-2 flex items-center text-sm ${
                creditScoreTrend.isPositive ? 'text-green-400' : 'text-red-400'
              }`}>
                {creditScoreTrend.isPositive ? '+' : '-'}{creditScoreTrend.value}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-400">Baseado na última avaliação</p>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Building className="h-5 w-5" />
            </div>
            <h3 className="ml-3 text-sm font-medium text-white">Instituições</h3>
          </div>
          <p className="text-2xl font-semibold text-white">{totalInstitutions}</p>
          <p className="mt-1 text-xs text-gray-400">Com relacionamento ativo</p>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="h-10 w-10 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400">
              <Percent className="h-5 w-5" />
            </div>
            <h3 className="ml-3 text-sm font-medium text-white">Taxa Média</h3>
          </div>
          <p className="text-2xl font-semibold text-white">{averageInterestRate}</p>
          <p className="mt-1 text-xs text-gray-400">Média das ofertas disponíveis</p>
        </div>
      </div>
    </div>
  );
}
