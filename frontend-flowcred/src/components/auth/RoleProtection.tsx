"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/lib/providers/WalletContext';
import { useModal } from '@/lib/providers/ModalContext';

interface RoleProtectionProps {
  children: React.ReactNode;
  requiredRole: 'avaliador' | 'tomador';
}

export function RoleProtection({ children, requiredRole }: RoleProtectionProps) {
  const { isConnected, userProfile } = useWallet();
  const { openModal } = useModal();
  const router = useRouter();

  useEffect(() => {
    // Se não está conectado, redirecionar para a página inicial
    if (!isConnected) {
      router.push('/');
      return;
    }

    // Se está conectado mas não tem perfil, abrir modal de seleção de perfil
    if (isConnected && !userProfile) {
      openModal('roleSelection');
      return;
    }

    // Se o usuário tem um papel diferente do requerido, redirecionar para o dashboard correto
    if (userProfile && userProfile.role !== requiredRole) {
      if (userProfile.role === 'avaliador') {
        router.push('/avaliador');
      } else if (userProfile.role === 'tomador') {
        router.push('/dashboard');
      }
    }
  }, [isConnected, userProfile, requiredRole, router, openModal]);

  // Se o usuário tem o papel correto, renderizar os filhos
  if (isConnected && userProfile && userProfile.role === requiredRole) {
    return <>{children}</>;
  }

  // Enquanto verifica, mostrar um indicador de carregamento
  return (
    <div className="flex items-center justify-center h-screen bg-gray-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
