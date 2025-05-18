"use client";

import { useModal } from '@/lib/providers/ModalContext';
import { UserRole, useWallet } from '@/lib/providers/WalletContext';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export function RoleSelectionModal() {
  const { address, setUserProfile } = useWallet();
  const { isModalOpen, closeModal } = useModal();
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    role: false,
    name: false,
    email: false
  });

  // Resetar o formulário quando o modal é fechado
  useEffect(() => {
    if (!isModalOpen('roleSelection')) {
      setSelectedRole(null);
      setName('');
      setEmail('');
      setErrors({
        role: false,
        name: false,
        email: false
      });
    }
  }, [isModalOpen]);

  // Lidar com tecla ESC para fechar o modal
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal('roleSelection');
    }
  }, [closeModal]);

  // Lidar com clique fora do modal para fechá-lo
  const handleOutsideClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('modal-overlay')) {
      closeModal('roleSelection');
    }
  }, [closeModal]);

  // Adicionar event listeners quando o modal está aberto
  useEffect(() => {
    if (isModalOpen('roleSelection')) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isModalOpen, handleKeyDown, handleOutsideClick]);

  // Se o modal não estiver aberto, não renderizar nada
  if (!isModalOpen('roleSelection')) return null;

  // Validar o formulário
  const validateForm = () => {
    const newErrors = {
      role: !selectedRole,
      name: !name.trim(),
      email: !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  // Lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!address) return;

    setIsSubmitting(true);

    try {
      // Importar serviços
      const { identityService } = await import('@/services/identityService');
      const { vcService } = await import('@/services/vcService');

      // Criar perfil do usuário
      const userProfile = {
        address,
        name,
        email,
        role: selectedRole
      };

      // Registrar usuário no contrato e IPFS
      const ipfsHash = await identityService.registerUser(userProfile);

      // Obter o perfil completo com DID
      const registeredProfile = await identityService.getUserProfile(address);

      if (registeredProfile && registeredProfile.did) {
        // Emitir VC de papel
        await vcService.issueRoleCredential(
          registeredProfile.did,
          selectedRole,
          address
        );
      }

      // Atualizar contexto
      setUserProfile(registeredProfile || userProfile);

      // Redirecionar com base no perfil selecionado
      if (selectedRole === 'avaliador') {
        router.push('/avaliador');
      } else {
        router.push('/dashboard');
      }

      closeModal('roleSelection');
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      // Mostrar mensagem de erro ao usuário
      alert(`Erro ao registrar usuário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 modal-overlay">
      <div
        className="relative w-full max-w-md p-6 mx-4 my-4 sm:my-8 bg-gray-900 border border-gray-700 rounded-xl shadow-xl max-h-[90vh] overflow-y-auto transform translate-y-[-5%]"
        onClick={(e) => e.stopPropagation()} // Prevenir que cliques dentro do modal o fechem
      >
        <button
          onClick={() => closeModal('roleSelection')}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800 transition-colors"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-white mb-6">Bem-vindo ao flowCred.it</h2>
        <p className="text-gray-300 mb-6">
          Selecione como você deseja utilizar a plataforma e complete seu perfil.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Selecione seu perfil
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                className={`p-4 rounded-lg border ${
                  selectedRole === 'tomador'
                    ? 'border-blue-500 bg-blue-500/20 text-white'
                    : 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700'
                } transition-colors flex flex-col items-center justify-center`}
                onClick={() => setSelectedRole('tomador')}
              >
                <svg
                  className="w-8 h-8 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">Tomador de Crédito</span>
              </button>

              <button
                type="button"
                className={`p-4 rounded-lg border ${
                  selectedRole === 'avaliador'
                    ? 'border-purple-500 bg-purple-500/20 text-white'
                    : 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700'
                } transition-colors flex flex-col items-center justify-center`}
                onClick={() => setSelectedRole('avaliador')}
              >
                <svg
                  className="w-8 h-8 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="font-medium">Avaliador de Crédito</span>
              </button>
            </div>
            {errors.role && (
              <p className="mt-1 text-sm text-red-400">Por favor, selecione um perfil</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nome completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 bg-gray-800 border ${
                errors.name ? 'border-red-500' : 'border-gray-700'
              } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Digite seu nome completo"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">Nome é obrigatório</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 bg-gray-800 border ${
                errors.email ? 'border-red-500' : 'border-gray-700'
              } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Digite seu e-mail"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">E-mail válido é obrigatório</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processando...' : 'Continuar'}
          </button>
        </form>
      </div>
    </div>
  );
}
