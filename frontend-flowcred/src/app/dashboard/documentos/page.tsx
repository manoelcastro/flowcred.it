"use client";

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/layout/dashboard-layout';
import { DocumentUpload } from '@/components/dashboard/documents/document-upload';
import { DocumentList } from '@/components/dashboard/documents/document-list';
import { FileText, Filter, Plus } from 'lucide-react';

export default function DocumentosPage() {
  const [showUpload, setShowUpload] = useState(false);
  
  // Dados de exemplo para documentos
  const documents = [
    {
      id: '1',
      name: 'Balanço Patrimonial 2023.pdf',
      type: 'application/pdf',
      size: 2500000,
      uploadedAt: '15/04/2023',
      status: 'verified' as const,
      metricsGenerated: 3,
    },
    {
      id: '2',
      name: 'Demonstração de Resultados.xlsx',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: 1800000,
      uploadedAt: '15/04/2023',
      status: 'verified' as const,
      metricsGenerated: 2,
    },
    {
      id: '3',
      name: 'Comprovante de Residência.jpg',
      type: 'image/jpeg',
      size: 950000,
      uploadedAt: '10/04/2023',
      status: 'verified' as const,
      metricsGenerated: 1,
    },
    {
      id: '4',
      name: 'Contrato Social.pdf',
      type: 'application/pdf',
      size: 3200000,
      uploadedAt: '05/04/2023',
      status: 'verified' as const,
      metricsGenerated: 2,
    },
    {
      id: '5',
      name: 'Declaração de Imposto de Renda.pdf',
      type: 'application/pdf',
      size: 4100000,
      uploadedAt: '01/04/2023',
      status: 'processing' as const,
      metricsGenerated: 0,
    },
    {
      id: '6',
      name: 'Extrato Bancário.pdf',
      type: 'application/pdf',
      size: 1200000,
      uploadedAt: '25/03/2023',
      status: 'error' as const,
      metricsGenerated: 0,
    }
  ];
  
  const handleDelete = (id: string) => {
    // Lógica para excluir documento
    console.log(`Excluindo documento ${id}`);
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Documentos</h1>
          
          <div className="flex space-x-3">
            <button className="flex items-center px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </button>
            
            <button 
              className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              onClick={() => setShowUpload(!showUpload)}
            >
              <Plus className="h-4 w-4 mr-2" />
              {showUpload ? 'Cancelar' : 'Adicionar Documento'}
            </button>
          </div>
        </div>
        
        {showUpload && (
          <div className="mb-8">
            <DocumentUpload />
          </div>
        )}
        
        <div className="mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-blue-400 mr-2" />
                <h2 className="text-lg font-semibold text-white">Todos os Documentos</h2>
              </div>
            </div>
            
            {documents.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400 mb-2">Nenhum documento encontrado</p>
                <p className="text-sm text-gray-500">
                  Faça upload de documentos para gerar métricas e provas
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-4 hover:bg-gray-700/30 transition-colors">
                    <DocumentList documents={[doc]} onDelete={handleDelete} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-white mb-4">Documentos Recomendados</h2>
          <p className="text-sm text-gray-400 mb-6">
            Adicione estes documentos para melhorar seu perfil de crédito e desbloquear mais métricas.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-blue-500 hover:bg-blue-500/5 transition-colors">
              <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <h3 className="text-sm font-medium text-white mb-1">Comprovante de Renda</h3>
              <p className="text-xs text-gray-400">
                Holerite, declaração de IR ou contrato de trabalho
              </p>
            </div>
            
            <div className="border border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-blue-500 hover:bg-blue-500/5 transition-colors">
              <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <h3 className="text-sm font-medium text-white mb-1">Fluxo de Caixa</h3>
              <p className="text-xs text-gray-400">
                Demonstrativo de entradas e saídas financeiras
              </p>
            </div>
            
            <div className="border border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-blue-500 hover:bg-blue-500/5 transition-colors">
              <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <h3 className="text-sm font-medium text-white mb-1">Certidão Negativa</h3>
              <p className="text-xs text-gray-400">
                Certidão negativa de débitos fiscais
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
