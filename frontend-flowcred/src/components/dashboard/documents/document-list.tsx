"use client";

import React, { useState } from 'react';
import { 
  FileText, 
  FileSpreadsheet, 
  FileImage, 
  File, 
  MoreVertical,
  Download,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  status: 'verified' | 'processing' | 'error';
  metricsGenerated: number;
}

interface DocumentListProps {
  documents: Document[];
  onDelete?: (id: string) => void;
}

export function DocumentList({ documents, onDelete }: DocumentListProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  const toggleMenu = (id: string) => {
    setActiveMenu(activeMenu === id ? null : id);
  };
  
  const getFileIcon = (type: string) => {
    if (type.includes('spreadsheet') || type.includes('excel') || type.includes('xlsx')) {
      return <FileSpreadsheet className="h-8 w-8 text-green-400" />;
    } else if (type.includes('image') || type.includes('jpg') || type.includes('png')) {
      return <FileImage className="h-8 w-8 text-blue-400" />;
    } else if (type.includes('pdf') || type.includes('document') || type.includes('docx')) {
      return <FileText className="h-8 w-8 text-red-400" />;
    } else {
      return <File className="h-8 w-8 text-gray-400" />;
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm">
      <div className="p-6 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Seus Documentos</h2>
          <Link 
            href="/dashboard/documentos" 
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Ver todos
          </Link>
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
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getFileIcon(doc.type)}
                  
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">{doc.name}</p>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <span>{formatFileSize(doc.size)}</span>
                      <span className="mx-2">•</span>
                      <span>{doc.uploadedAt}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    {doc.status === 'verified' && (
                      <div className="flex items-center text-green-400">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        <span className="text-xs">Verificado</span>
                      </div>
                    )}
                    {doc.status === 'processing' && (
                      <div className="flex items-center text-yellow-400">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-xs">Processando</span>
                      </div>
                    )}
                    {doc.status === 'error' && (
                      <div className="flex items-center text-red-400">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span className="text-xs">Erro</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="relative">
                    <button
                      className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-700"
                      onClick={() => toggleMenu(doc.id)}
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    
                    {activeMenu === doc.id && (
                      <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1">
                          <button
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </button>
                          <button
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </button>
                          {onDelete && (
                            <button
                              className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                              onClick={() => {
                                onDelete(doc.id);
                                setActiveMenu(null);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {doc.status === 'verified' && doc.metricsGenerated > 0 && (
                <div className="mt-3 ml-11">
                  <div className="flex items-center">
                    <span className="text-xs text-blue-400">{doc.metricsGenerated} métricas geradas</span>
                    <Link 
                      href={`/dashboard/metricas?document=${doc.id}`}
                      className="ml-2 text-xs text-gray-400 hover:text-gray-300"
                    >
                      Ver detalhes
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
