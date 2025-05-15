"use client";

import React, { useState } from 'react';
import { Link2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  logo: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  metricsAvailable?: number;
}

interface IntegrationCardsProps {
  integrations: Integration[];
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
}

export function IntegrationCards({ integrations, onConnect, onDisconnect }: IntegrationCardsProps) {
  const [connecting, setConnecting] = useState<string | null>(null);
  
  const handleConnect = async (id: string) => {
    setConnecting(id);
    
    // Simulação de conexão
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onConnect(id);
    setConnecting(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {integrations.map((integration) => (
        <div 
          key={integration.id}
          className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm transition-all hover:border-gray-600"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img 
                  src={integration.logo} 
                  alt={integration.name} 
                  className="h-10 w-10 rounded-md bg-white p-1"
                />
                <h3 className="ml-3 text-lg font-medium text-white">{integration.name}</h3>
              </div>
              
              {integration.status === 'connected' && (
                <div className="flex items-center text-green-400 text-xs">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Conectado
                </div>
              )}
              {integration.status === 'error' && (
                <div className="flex items-center text-red-400 text-xs">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Erro
                </div>
              )}
            </div>
            
            <p className="text-sm text-gray-400 mb-4">{integration.description}</p>
            
            {integration.status === 'connected' && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Última sincronização:</span>
                  <span>{integration.lastSync}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Métricas disponíveis:</span>
                  <span className="text-blue-400">{integration.metricsAvailable}</span>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              {integration.status === 'connected' ? (
                <>
                  <button
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    onClick={() => onDisconnect(integration.id)}
                  >
                    Desconectar
                  </button>
                  <button className="flex items-center text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    <span>Detalhes</span>
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </button>
                </>
              ) : (
                <button
                  className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    connecting === integration.id
                      ? 'bg-blue-600/50 text-white cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  onClick={() => handleConnect(integration.id)}
                  disabled={connecting === integration.id}
                >
                  {connecting === integration.id ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Conectando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Link2 className="mr-2 h-4 w-4" />
                      Conectar
                    </div>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
