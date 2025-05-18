"use client";

import { useModal } from '@/lib/providers/ModalContext';
import { useWallet } from '@/lib/providers/WalletContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
    const checkAuth = async () => {
      try {
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

        // Importar serviço de identidade
        const { identityService } = await import('@/services/identityService');

        // Se está conectado mas não tem perfil, verificar no contrato
        if (isConnected && !userProfile && address) {
          // Verificar se o usuário está registrado no contrato
          const contractProfile = await identityService.getUserProfile(address);

          if (contractProfile) {
            // Se estiver registrado no contrato, atualizar o contexto
            setUserProfile(contractProfile as any);
          } else {
            // Se não estiver registrado, abrir modal de seleção de perfil
            setAuthorized(false);
            openModal('roleSelection');
            return;
          }
        }

        // Se requiredRole é especificado, verificar se o usuário tem o papel correto
        if (requiredRole && userProfile?.role !== requiredRole) {
          setAuthorized(false);

          // Verificar papel no contrato
          if (address) {
            const isTomador = requiredRole === 'tomador' ?
              await identityService.isTomador(address) :
              false;

            const isAvaliador = requiredRole === 'avaliador' ?
              await identityService.isAvaliador(address) :
              false;

            // Se o papel no contrato corresponder ao requiredRole, atualizar o contexto
            if ((requiredRole === 'tomador' && isTomador) ||
                (requiredRole === 'avaliador' && isAvaliador)) {
              // Obter perfil atualizado
              const updatedProfile = await identityService.getUserProfile(address);
              if (updatedProfile) {
                setUserProfile(updatedProfile as any);
                setAuthorized(true);
                return;
              }
            }
          }

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
        if (pathname.startsWith('/avaliador') && userProfile?.role !== 'avaliador' && userProfile?.role !== 'both') {
          // Verificar no contrato
          if (address && await identityService.isAvaliador(address)) {
            // Se for avaliador no contrato, atualizar o contexto
            const updatedProfile = await identityService.getUserProfile(address);
            if (updatedProfile) {
              setUserProfile(updatedProfile as any);
              setAuthorized(true);
              return;
            }
          }

          setAuthorized(false);
          router.push('/dashboard');
          return;
        }

        if (pathname.startsWith('/dashboard') && userProfile?.role !== 'tomador' && userProfile?.role !== 'both') {
          // Verificar no contrato
          if (address && await identityService.isTomador(address)) {
            // Se for tomador no contrato, atualizar o contexto
            const updatedProfile = await identityService.getUserProfile(address);
            if (updatedProfile) {
              setUserProfile(updatedProfile as any);
              setAuthorized(true);
              return;
            }
          }

          setAuthorized(false);
          router.push('/avaliador');
          return;
        }

        // Se passou por todas as verificações, está autorizado
        setAuthorized(true);
      } catch (error) {
        console.error('Erro ao verificar autorização:', error);
        // Em caso de erro, permitir acesso (fallback seguro)
        setAuthorized(true);
      }
    };

    // Verificar autorização quando a rota muda
    checkAuth();
  }, [isConnected, userProfile, pathname, router, openModal, requiredRole, address]);

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
