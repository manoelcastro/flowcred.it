"use client";

import { useModal } from '@/lib/providers/ModalContext';
import { useWallet } from '@/lib/providers/WalletContext';
import { ChevronDown, ExternalLink, LogOut, Wallet } from 'lucide-react';
import { useState } from 'react';

export function WalletConnectButton() {
  const { isConnected, isConnecting, address, userProfile, connectWallet, disconnectWallet, error, chain, switchChain } = useWallet();
  const { openModal } = useModal();
  const [showDropdown, setShowDropdown] = useState(false);

  // Importar a chain Anvil
  const anvilChain = {
    id: 31337,
    name: 'Anvil',
  };

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Erro ao conectar carteira:', error);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Se não estiver conectado, mostrar botão de conexão
  if (!isConnected) {
    return (
      <>
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-full transition-colors disabled:opacity-70"
        >
          <Wallet size={18} />
          {isConnecting ? 'Conectando...' : 'Conectar Carteira'}
        </button>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </>
    );
  }

  // Se conectado mas sem perfil, mostrar botão para abrir modal de seleção de perfil
  if (isConnected && !userProfile) {
    return (
      <>
        <button
          onClick={() => openModal('roleSelection')}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-full transition-colors"
        >
          <Wallet size={18} />
          {formatAddress(address || '')}
        </button>
      </>
    );
  }

  // Se conectado com perfil, mostrar informações do usuário e dropdown
  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-full transition-colors border border-gray-700"
      >
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            {userProfile?.name.charAt(0)}
          </div>
          <span className="hidden sm:inline">{userProfile?.name.split(' ')[0]}</span>
          <span className="text-gray-400 text-sm">{formatAddress(address || '')}</span>
        </div>
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
          <div className="p-3 border-b border-gray-700">
            <p className="text-sm font-medium text-white">{userProfile?.name}</p>
            <p className="text-xs text-gray-400">{userProfile?.email}</p>
            <div className="mt-2 flex items-center">
              <span className="text-xs text-gray-400 mr-1">Rede:</span>
              <span className="text-xs font-medium text-green-400 flex items-center">
                {chain?.name || 'Ethereum'}
                <div className="w-2 h-2 rounded-full bg-green-500 ml-1.5"></div>
              </span>
            </div>
          </div>
          <div className="p-2">
            <div className="px-3 py-2 text-sm text-gray-300">
              <span className="font-medium">Perfil:</span>{' '}
              <span className={userProfile?.role === 'avaliador' ? 'text-purple-400' : 'text-blue-400'}>
                {userProfile?.role === 'avaliador' ? 'Avaliador de Crédito' : 'Tomador de Crédito'}
              </span>
            </div>
            <a
              href={`${chain?.blockExplorers?.default.url}/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
            >
              <ExternalLink size={16} />
              Ver no Explorador
            </a>

            {/* Botão para mudar para a rede Anvil */}
            {chain && chain.id !== anvilChain.id && (
              <button
                onClick={async () => {
                  try {
                    await switchChain(anvilChain.id);
                    setShowDropdown(false);
                  } catch (error) {
                    console.error('Erro ao mudar para Anvil:', error);
                  }
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-400 hover:bg-gray-700 rounded-md transition-colors"
              >
                <ExternalLink size={16} />
                Mudar para Anvil
              </button>
            )}

            <button
              onClick={() => {
                disconnectWallet();
                setShowDropdown(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md transition-colors"
            >
              <LogOut size={16} />
              Desconectar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
