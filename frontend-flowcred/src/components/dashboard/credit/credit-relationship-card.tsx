"use client";

import React, { useState } from 'react';
import { 
  Building, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  DollarSign, 
  Percent, 
  Clock,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';

interface CreditOffer {
  id: string;
  type: string;
  amount: string;
  interestRate: string;
  term: string;
  status: 'available' | 'pending' | 'expired';
  expiresAt?: string;
}

interface CreditRelationship {
  id: string;
  institution: {
    name: string;
    logo?: string;
  };
  relationshipSince: string;
  lastEvaluation: string;
  creditScore?: string;
  totalAvailableCredit: string;
  offers: CreditOffer[];
}

interface CreditRelationshipCardProps {
  relationship: CreditRelationship;
}

export function CreditRelationshipCard({ relationship }: CreditRelationshipCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  const availableOffers = relationship.offers.filter(offer => offer.status === 'available').length;
  
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm">
      <div 
        className="p-4 hover:bg-gray-700/30 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {relationship.institution.logo ? (
              <img 
                src={relationship.institution.logo} 
                alt={relationship.institution.name} 
                className="h-12 w-12 rounded-lg bg-white p-2"
              />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-gray-700 flex items-center justify-center">
                <Building className="h-6 w-6 text-gray-400" />
              </div>
            )}
            
            <div className="ml-4">
              <h3 className="text-lg font-medium text-white">{relationship.institution.name}</h3>
              <div className="flex items-center text-xs text-gray-400 mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Relacionamento desde {relationship.relationshipSince}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="text-right mr-4">
              <p className="text-sm text-gray-400">Crédito Disponível</p>
              <p className="text-xl font-semibold text-white">{relationship.totalAvailableCredit}</p>
            </div>
            
            {expanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center px-3 py-1 bg-gray-700/50 rounded-full text-xs">
            <Clock className="h-3 w-3 mr-1 text-blue-400" />
            <span>Última avaliação: {relationship.lastEvaluation}</span>
          </div>
          
          {relationship.creditScore && (
            <div className="flex items-center px-3 py-1 bg-gray-700/50 rounded-full text-xs">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-400" />
              <span>Score: {relationship.creditScore}</span>
            </div>
          )}
          
          {availableOffers > 0 && (
            <div className="flex items-center px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
              <DollarSign className="h-3 w-3 mr-1" />
              <span>{availableOffers} {availableOffers === 1 ? 'oferta disponível' : 'ofertas disponíveis'}</span>
            </div>
          )}
        </div>
      </div>
      
      {expanded && (
        <div className="border-t border-gray-700 p-4">
          <h4 className="text-sm font-medium text-white mb-3">Ofertas de Crédito</h4>
          
          {relationship.offers.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhuma oferta de crédito disponível no momento.</p>
          ) : (
            <div className="space-y-4">
              {relationship.offers.map((offer) => (
                <div 
                  key={offer.id} 
                  className={`p-4 rounded-lg border ${
                    offer.status === 'available' 
                      ? 'border-green-500/30 bg-green-500/10' 
                      : offer.status === 'pending'
                        ? 'border-yellow-500/30 bg-yellow-500/10'
                        : 'border-gray-700 bg-gray-800/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-sm font-medium text-white">{offer.type}</h5>
                      <div className="mt-2 grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-400">Valor</p>
                          <p className="text-sm font-medium text-white">{offer.amount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Taxa de Juros</p>
                          <p className="text-sm font-medium text-white">{offer.interestRate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Prazo</p>
                          <p className="text-sm font-medium text-white">{offer.term}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {offer.status === 'available' && (
                        <span className="text-xs text-green-400 flex items-center">
                          <DollarSign className="h-3 w-3 mr-1" />
                          Disponível
                        </span>
                      )}
                      {offer.status === 'pending' && (
                        <span className="text-xs text-yellow-400 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Em análise
                        </span>
                      )}
                      {offer.status === 'expired' && (
                        <span className="text-xs text-gray-400 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Expirada
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {offer.status === 'available' && (
                    <div className="mt-4 flex justify-end">
                      <button className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Ver Detalhes
                      </button>
                    </div>
                  )}
                  
                  {offer.status === 'available' && offer.expiresAt && (
                    <div className="mt-2 text-right">
                      <p className="text-xs text-gray-400">Válida até {offer.expiresAt}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <button className="flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md transition-colors">
              <Building className="h-4 w-4 mr-2" />
              Ver Perfil Completo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
