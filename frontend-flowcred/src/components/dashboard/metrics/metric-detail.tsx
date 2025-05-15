"use client";

import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  Shield, 
  Link2,
  Info,
  Lock
} from 'lucide-react';

interface MetricSource {
  type: 'document' | 'integration' | 'manual';
  name: string;
  date: string;
}

interface MetricAccess {
  company: string;
  accessGrantedAt: string;
  lastAccessed?: string;
}

interface MetricDetailProps {
  id: string;
  name: string;
  value: string | number;
  status: 'verified' | 'pending' | 'missing';
  category: string;
  description?: string;
  source?: MetricSource;
  accessedBy?: MetricAccess[];
  proofAvailable?: boolean;
}

export function MetricDetail({
  id,
  name,
  value,
  status,
  category,
  description,
  source,
  accessedBy,
  proofAvailable
}: MetricDetailProps) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center">
            {status === 'verified' && (
              <CheckCircle2 className="h-5 w-5 text-green-400 mr-2" />
            )}
            {status === 'pending' && (
              <Clock className="h-5 w-5 text-yellow-400 mr-2" />
            )}
            {status === 'missing' && (
              <AlertCircle className="h-5 w-5 text-gray-400 mr-2" />
            )}
            <h2 className="text-xl font-semibold text-white">{name}</h2>
          </div>
          <div className="mt-1 text-sm text-gray-400">
            Categoria: {category}
          </div>
        </div>
        
        {proofAvailable && (
          <div className="flex items-center px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
            <Lock className="h-3 w-3 mr-1" />
            Prova ZK Disponível
          </div>
        )}
      </div>
      
      {description && (
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Info className="h-4 w-4 text-blue-400 mr-2" />
            <h3 className="text-sm font-medium text-white">Descrição</h3>
          </div>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <h3 className="text-sm font-medium text-white">Valor</h3>
        </div>
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <p className="text-2xl font-semibold text-white">{value}</p>
        </div>
      </div>
      
      {source && (
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <h3 className="text-sm font-medium text-white">Fonte</h3>
          </div>
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center">
              {source.type === 'document' && (
                <FileText className="h-5 w-5 text-blue-400 mr-2" />
              )}
              {source.type === 'integration' && (
                <Link2 className="h-5 w-5 text-orange-400 mr-2" />
              )}
              {source.type === 'manual' && (
                <Info className="h-5 w-5 text-purple-400 mr-2" />
              )}
              <div>
                <p className="text-sm text-white">{source.name}</p>
                <p className="text-xs text-gray-400">Adicionado em {source.date}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {accessedBy && accessedBy.length > 0 && (
        <div>
          <div className="flex items-center mb-2">
            <Shield className="h-4 w-4 text-blue-400 mr-2" />
            <h3 className="text-sm font-medium text-white">Acessado por</h3>
          </div>
          <div className="space-y-2">
            {accessedBy.map((access, index) => (
              <div key={index} className="bg-gray-900/50 border border-gray-700 rounded-lg p-3">
                <p className="text-sm text-white">{access.company}</p>
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-400">Acesso concedido em {access.accessGrantedAt}</p>
                  {access.lastAccessed && (
                    <p className="text-xs text-gray-400">Último acesso em {access.lastAccessed}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
