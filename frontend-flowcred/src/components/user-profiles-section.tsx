"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export function UserProfilesSection() {
  const [activeTab, setActiveTab] = useState<'borrower' | 'evaluator'>('borrower');

  const profiles = {
    borrower: {
      title: "Tomador de Crédito",
      description: "Tenha controle total sobre seus dados financeiros e compartilhe apenas o necessário para obter crédito.",
      features: [
        "Armazene documentos sob custódia própria (wallet)",
        "Conecte dados de diversas fontes (open finance, birôs, documentos fiscais)",
        "Gere VC/VP e provas ZK com base nos dados coletados",
        "Autorize, via consentimento granular, o compartilhamento seletivo de informações"
      ],
      image: "https://images.unsplash.com/photo-1560472355-536de3962603?q=80&w=2070&auto=format&fit=crop"
    },
    evaluator: {
      title: "Avaliador de Crédito",
      description: "Receba apenas as informações relevantes para sua análise, com garantia de autenticidade e verificação.",
      features: [
        "Defina quais métricas e provas deseja receber",
        "Construa flows de avaliação (no-code) baseados em blocos",
        "Receba e processe apenas as métricas e provas autorizadas",
        "Simule jornadas com base em critérios configuráveis (ex: valor de crédito)"
      ],
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop"
    }
  };

  const activeProfile = profiles[activeTab];

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Para Quem é o flowCred.it?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Nossa plataforma atende a diferentes perfis de usuários, oferecendo soluções específicas para cada necessidade.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-gray-800 rounded-full">
            <button
              onClick={() => setActiveTab('borrower')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === 'borrower'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Tomador de Crédito
            </button>
            <button
              onClick={() => setActiveTab('evaluator')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === 'evaluator'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Avaliador de Crédito
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl font-bold text-white mb-4">{activeProfile.title}</h3>
            <p className="text-gray-400 mb-6">{activeProfile.description}</p>
            
            <ul className="space-y-3 mb-8">
              {activeProfile.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link href="/cadastro" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-150">
              Começar Agora
            </Link>
          </div>
          
          <div className="order-1 md:order-2">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-lg opacity-20 blur-xl transform -rotate-6"></div>
              <img 
                src={activeProfile.image} 
                alt={activeProfile.title} 
                className="relative rounded-lg shadow-xl w-full h-auto object-cover"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
