"use client";

import React, { useState } from 'react';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Calendar, 
  Clock,
  MoreHorizontal,
  XCircle,
  RefreshCw
} from 'lucide-react';

interface ConsentedCompany {
  id: string;
  name: string;
  logo?: string;
  accessGrantedAt: string;
  expiresAt: string;
  accessedMetrics: {
    category: string;
    count: number;
    lastAccessed?: string;
  }[];
}

interface ConsentManagementProps {
  companies: ConsentedCompany[];
  onRevoke: (id: string) => void;
}

export function ConsentManagement({ companies, onRevoke }: ConsentManagementProps) {
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  const toggleExpand = (id: string) => {
    setExpandedCompany(expandedCompany === id ? null : id);
  };
  
  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === id ? null : id);
  };
  
  const handleRevoke = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onRevoke(id);
    setActiveMenu(null);
  };
  
  const calculateDaysRemaining = (expiresAt: string) => {
    const today = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-blue-400 mr-2" />
          <h2 className="text-lg font-semibold text-white">Gerenciamento de Consentimentos</h2>
        </div>
      </div>
      
      {companies.length === 0 ? (
        <div className="p-12 text-center">
          <Shield className="h-12 w-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400 mb-2">Nenhum consentimento ativo</p>
          <p className="text-sm text-gray-500">
            Você não concedeu acesso às suas informações para nenhuma empresa
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-700">
          {companies.map((company) => {
            const isExpanded = expandedCompany === company.id;
            const daysRemaining = calculateDaysRemaining(company.expiresAt);
            
            return (
              <div key={company.id}>
                <div 
                  className="p-4 hover:bg-gray-700/30 transition-colors cursor-pointer"
                  onClick={() => toggleExpand(company.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {company.logo ? (
                        <img 
                          src={company.logo} 
                          alt={company.name} 
                          className="h-10 w-10 rounded-full bg-white p-1"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-400 font-medium">
                            {company.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white">{company.name}</p>
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Concedido em {company.accessGrantedAt}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`text-xs px-2 py-1 rounded-full mr-3 ${
                        daysRemaining > 30 
                          ? 'bg-green-500/20 text-green-400' 
                          : daysRemaining > 7
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                      }`}>
                        {daysRemaining} dias restantes
                      </div>
                      
                      <button
                        className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-700"
                        onClick={(e) => toggleMenu(company.id, e)}
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                      
                      {activeMenu === company.id && (
                        <div className="absolute mt-1 right-6 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1">
                            <button
                              className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Renovar Acesso
                            </button>
                            <button
                              className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                              onClick={(e) => handleRevoke(company.id, e)}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Revogar Acesso
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 ml-13">
                    <div className="flex items-center text-xs text-gray-400">
                      <Eye className="h-3 w-3 mr-1" />
                      <span>
                        Acesso a {company.accessedMetrics.reduce((acc, m) => acc + m.count, 0)} métricas em {company.accessedMetrics.length} categorias
                      </span>
                    </div>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="bg-gray-800/80 p-4 pl-16">
                    <h4 className="text-sm font-medium text-white mb-3">Métricas com acesso concedido:</h4>
                    <div className="space-y-3">
                      {company.accessedMetrics.map((metric, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-300">{metric.category}</p>
                            <div className="flex items-center text-xs text-gray-400 mt-1">
                              <span>{metric.count} métricas</span>
                              {metric.lastAccessed && (
                                <>
                                  <span className="mx-1">•</span>
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>Último acesso em {metric.lastAccessed}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                            Detalhes
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <button
                        className="flex items-center px-3 py-1 text-xs text-red-400 hover:text-red-300 border border-red-400/30 rounded-md transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRevoke(company.id);
                        }}
                      >
                        <EyeOff className="mr-1 h-3 w-3" />
                        Revogar Acesso
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
