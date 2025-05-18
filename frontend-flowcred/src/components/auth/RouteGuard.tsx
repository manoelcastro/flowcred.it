"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useWallet } from '@/lib/providers/WalletContext';
import { useModal } from '@/lib/providers/ModalContext';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: 'avaliador' | 'tomador' | null;
}

export function RouteGuard({ children, requiredRole }: RouteGuardProps) {
  const { isConnected, userProfile } = useWallet();
  const { openModal } = useModal();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Função para verificar se o usuário está autorizado
    const checkAuth = () => {
      // Rotas públicas que não requerem autenticação
      const publicPaths = ['/', '/login', '/register'];
      const isPublicPath = publicPaths.includes(pathname);

      // Se é uma rota pública, permitir acesso
      if (isPublicPath) {
        setAuthorized(true);
        return;
      }

      // Se não está conectado, redirecionar para a página inicial
      if (!isConnected) {
        setAuthorized(false);
        router.push('/');
        return;
      }

      // Se está conectado mas não tem perfil, abrir modal de seleção de perfil
      if (isConnected && !userProfile) {
        setAuthorized(false);
        openModal('roleSelection');
        return;
      }

      // Se requiredRole é especificado, verificar se o usuário tem o papel correto
      if (requiredRole && userProfile?.role !== requiredRole) {
        setAuthorized(false);
        
        // Redirecionar para o dashboard correto com base no papel do usuário
        if (userProfile?.role === 'avaliador') {
          router.push('/avaliador');
        } else if (userProfile?.role === 'tomador') {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
        return;
      }

      // Verificar rotas específicas de cada papel
      if (pathname.startsWith('/avaliador') && userProfile?.role !== 'avaliador') {
        setAuthorized(false);
        router.push('/dashboard');
        return;
      }

      if (pathname.startsWith('/dashboard') && userProfile?.role !== 'tomador') {
        setAuthorized(false);
        router.push('/avaliador');
        return;
      }

      // Se passou por todas as verificações, está autorizado
      setAuthorized(true);
    };

    // Verificar autorização quando a rota muda
    checkAuth();
  }, [isConnected, userProfile, pathname, router, openModal, requiredRole]);

  // Enquanto verifica autorização, pode mostrar um indicador de carregamento
  if (!authorized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se autorizado, renderizar os filhos
  return <>{children}</>;
}
