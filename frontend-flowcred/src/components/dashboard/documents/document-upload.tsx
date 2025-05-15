"use client";

import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Check, AlertCircle } from 'lucide-react';

export function DocumentUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };
  
  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList);
    setFiles(prev => [...prev, ...newFiles]);
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleUpload = () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    // Simulação de upload
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadStatus('success');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };
  
  const resetUpload = () => {
    setFiles([]);
    setUploadStatus('idle');
    setUploadProgress(0);
  };
  
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
      <h2 className="text-lg font-semibold text-white mb-4">Upload de Documentos</h2>
      
      {uploadStatus === 'idle' && (
        <>
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              dragActive 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-gray-600 hover:border-gray-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleChange}
            />
            
            <div className="flex flex-col items-center justify-center py-4">
              <Upload className="h-10 w-10 text-gray-400 mb-3" />
              <p className="text-sm text-gray-300 mb-1">
                <span className="font-medium">Clique para fazer upload</span> ou arraste e solte
              </p>
              <p className="text-xs text-gray-400">
                PDF, DOCX, XLSX, JPG, PNG (max. 10MB)
              </p>
            </div>
          </div>
          
          {files.length > 0 && (
            <div className="mt-4">
              <div className="text-sm text-gray-300 mb-2">
                {files.length} {files.length === 1 ? 'arquivo selecionado' : 'arquivos selecionados'}
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {files.map((file, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-700/50 rounded-md"
                  >
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-white truncate max-w-xs">{file.name}</p>
                        <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    
                    <button 
                      className="text-gray-400 hover:text-gray-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  onClick={handleUpload}
                >
                  Fazer Upload
                </button>
              </div>
            </div>
          )}
        </>
      )}
      
      {uploading && (
        <div className="py-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Enviando documentos...</span>
            <span className="text-sm text-gray-300">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {uploadStatus === 'success' && (
        <div className="py-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-4">
            <Check className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Upload Concluído!</h3>
          <p className="text-gray-400 mb-6">
            Seus documentos foram enviados com sucesso e estão sendo processados para gerar métricas.
          </p>
          <button
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
            onClick={resetUpload}
          >
            Fazer Novo Upload
          </button>
        </div>
      )}
      
      {uploadStatus === 'error' && (
        <div className="py-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 text-red-400 mb-4">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Erro no Upload</h3>
          <p className="text-gray-400 mb-6">
            Ocorreu um erro ao enviar seus documentos. Por favor, tente novamente.
          </p>
          <button
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
            onClick={resetUpload}
          >
            Tentar Novamente
          </button>
        </div>
      )}
    </div>
  );
}
