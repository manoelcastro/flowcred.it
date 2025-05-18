"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipos de modais disponíveis na aplicação
export type ModalType = 'roleSelection' | 'walletConnect' | 'consentManagement' | 'documentUpload';

interface ModalContextType {
  // Estado atual dos modais
  openModals: Record<ModalType, boolean>;
  // Função para abrir um modal específico
  openModal: (modalType: ModalType) => void;
  // Função para fechar um modal específico
  closeModal: (modalType: ModalType) => void;
  // Função para fechar todos os modais
  closeAllModals: () => void;
  // Função para verificar se um modal está aberto
  isModalOpen: (modalType: ModalType) => boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  // Estado para controlar quais modais estão abertos
  const [openModals, setOpenModals] = useState<Record<ModalType, boolean>>({
    roleSelection: false,
    walletConnect: false,
    consentManagement: false,
    documentUpload: false
  });

  // Função para abrir um modal específico
  const openModal = (modalType: ModalType) => {
    setOpenModals(prev => ({
      ...prev,
      [modalType]: true
    }));
  };

  // Função para fechar um modal específico
  const closeModal = (modalType: ModalType) => {
    setOpenModals(prev => ({
      ...prev,
      [modalType]: false
    }));
  };

  // Função para fechar todos os modais
  const closeAllModals = () => {
    const resetModals = Object.keys(openModals).reduce((acc, key) => {
      acc[key as ModalType] = false;
      return acc;
    }, {} as Record<ModalType, boolean>);
    
    setOpenModals(resetModals);
  };

  // Função para verificar se um modal está aberto
  const isModalOpen = (modalType: ModalType): boolean => {
    return openModals[modalType];
  };

  return (
    <ModalContext.Provider
      value={{
        openModals,
        openModal,
        closeModal,
        closeAllModals,
        isModalOpen
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

// Hook para usar o contexto de modais
export function useModal() {
  const context = useContext(ModalContext);
  
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  
  return context;
}
