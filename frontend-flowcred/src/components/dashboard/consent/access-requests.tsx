"use client";

import React from 'react';
import { CheckCircle, XCircle, Clock, Building, Shield } from 'lucide-react';
import Link from 'next/link';

interface AccessRequest {
  id: string;
  company: {
    name: string;
    logo?: string;
  };
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedMetrics: string[];
}

interface AccessRequestsProps {
  requests: AccessRequest[];
}

export function AccessRequests({ requests }: AccessRequestsProps) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm">
      <div className="p-6 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Solicitações de Acesso</h2>
          <Link 
            href="/dashboard/consentimentos" 
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Ver todas
          </Link>
        </div>
      </div>
      
      <div className="divide-y divide-gray-700">
        {requests.length === 0 ? (
          <div className="p-6 text-center">
            <Shield className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">Nenhuma solicitação de acesso pendente</p>
          </div>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="p-4 hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {request.company.logo ? (
                    <img 
                      src={request.company.logo} 
                      alt={request.company.name} 
                      className="h-10 w-10 rounded-full bg-gray-700 p-2"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">{request.company.name}</p>
                    <p className="text-xs text-gray-400">Solicitado em {request.requestedAt}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  {request.status === 'pending' && (
                    <div className="flex items-center text-yellow-400">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-xs">Pendente</span>
                    </div>
                  )}
                  {request.status === 'approved' && (
                    <div className="flex items-center text-green-400">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-xs">Aprovado</span>
                    </div>
                  )}
                  {request.status === 'rejected' && (
                    <div className="flex items-center text-red-400">
                      <XCircle className="h-4 w-4 mr-1" />
                      <span className="text-xs">Rejeitado</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-xs text-gray-400 mb-2">Métricas solicitadas:</p>
                <div className="flex flex-wrap gap-2">
                  {request.requestedMetrics.map((metric, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-700 text-gray-300"
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
              
              {request.status === 'pending' && (
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors">
                    Aprovar
                  </button>
                  <button className="flex-1 py-1 px-3 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md transition-colors">
                    Rejeitar
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
