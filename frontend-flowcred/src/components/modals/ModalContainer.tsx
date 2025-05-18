"use client";

import { RoleSelectionModal } from '../wallet/RoleSelectionModal';
import { useModal } from '@/lib/providers/ModalContext';

/**
 * Componente que contém todos os modais da aplicação.
 * Este componente deve ser incluído no layout principal da aplicação.
 */
export function ModalContainer() {
  const { isModalOpen } = useModal();

  return (
    <>
      {/* Modal de seleção de perfil */}
      {isModalOpen('roleSelection') && <RoleSelectionModal />}
      
      {/* Adicione outros modais aqui conforme necessário */}
    </>
  );
}
