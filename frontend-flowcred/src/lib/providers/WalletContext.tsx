"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Chain, createWalletClient, custom, WalletClient } from 'viem';
import { mainnet, optimism, polygon } from 'viem/chains';
import { useModal } from './ModalContext';

// Tipos de roles disponíveis
export type UserRole = 'avaliador' | 'tomador' | 'both' | null;

// Importar a chain Anvil
import { anvilChain } from '../anvil-chain';

// Cadeias suportadas pela aplicação
const supportedChains: Chain[] = [anvilChain, mainnet, polygon, optimism];

// Interface para o perfil do usuário
interface UserProfile {
  address: string;
  name: string;
  email: string;
  role: UserRole;
  chainId?: number;
}

// Interface para o contexto da carteira
interface WalletContextType {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  walletClient: WalletClient | null;
  userProfile: UserProfile | null;
  error: string | null;
  chain: Chain | null;
  connectWallet: () => Promise<string | undefined>;
  disconnectWallet: () => void;
  setUserProfile: (profile: UserProfile) => void;
  switchChain: (chainId: number) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { openModal } = useModal();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [address, setAddress] = useState<string | null>(null);
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chain, setChain] = useState<Chain | null>(null);

  // Verificar conexão existente ao montar o componente
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Verificar se ethereum está disponível
        if (typeof window !== 'undefined' && window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });

          if (accounts && accounts.length > 0) {
            // Obter a chain atual
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            const currentChain = supportedChains.find(c => c.id === parseInt(chainId, 16)) || mainnet;

            const client = createWalletClient({
              chain: currentChain,
              transport: custom(window.ethereum)
            });

            setWalletClient(client);
            setAddress(accounts[0]);
            setIsConnected(true);
            setChain(currentChain);

            // Carregar perfil do usuário do localStorage se existir
            const savedProfile = localStorage.getItem(`flowcred-profile-${accounts[0]}`);
            if (savedProfile) {
              setUserProfile(JSON.parse(savedProfile));
            }
          }
        }
      } catch (err) {
        console.error("Erro ao verificar conexão da carteira:", err);
        setError("Falha ao verificar conexão da carteira");
      }
    };

    checkConnection();
  }, []);

  // Escutar mudanças de conta
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // Usuário desconectou
          disconnectWallet();
        } else if (accounts[0] !== address) {
          // Conta mudou
          setAddress(accounts[0]);

          // Carregar perfil para a nova conta se existir
          const savedProfile = localStorage.getItem(`flowcred-profile-${accounts[0]}`);
          if (savedProfile) {
            setUserProfile(JSON.parse(savedProfile));
          } else {
            setUserProfile(null);
            // Abrir modal de seleção de perfil para a nova conta
            openModal('roleSelection');
          }
        }
      };

      // Escutar mudanças de chain
      const handleChainChanged = (chainId: string) => {
        const newChainId = parseInt(chainId, 16);
        const newChain = supportedChains.find(c => c.id === newChainId) || mainnet;

        setChain(newChain);

        // Atualizar o cliente da carteira com a nova chain
        if (window.ethereum) {
          const client = createWalletClient({
            chain: newChain,
            transport: custom(window.ethereum)
          });

          setWalletClient(client);
        }
      };

      if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

        return () => {
          if (window.ethereum) {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('chainChanged', handleChainChanged);
          }
        };
      }
    }
  }, [address, openModal]);

  // Função para conectar carteira
  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });

        if (accounts && accounts.length > 0) {
          // Obter a chain atual
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          const currentChain = supportedChains.find(c => c.id === parseInt(chainId, 16)) || mainnet;

          const client = createWalletClient({
            chain: currentChain,
            transport: custom(window.ethereum)
          });

          setWalletClient(client);
          setAddress(accounts[0]);
          setIsConnected(true);
          setChain(currentChain);

          // Carregar perfil do usuário se existir
          const savedProfile = localStorage.getItem(`flowcred-profile-${accounts[0]}`);
          if (savedProfile) {
            setUserProfile(JSON.parse(savedProfile));
          } else {
            // Abrir modal de seleção de perfil
            openModal('roleSelection');
          }

          return accounts[0];
        }
      } else {
        throw new Error("Nenhuma carteira Ethereum encontrada. Por favor, instale uma extensão de carteira.");
      }
    } catch (err: any) {
      console.error("Erro ao conectar carteira:", err);
      setError(err.message || "Falha ao conectar carteira");
    } finally {
      setIsConnecting(false);
    }
  };

  // Função para desconectar carteira
  const disconnectWallet = () => {
    setWalletClient(null);
    setAddress(null);
    setIsConnected(false);
    setUserProfile(null);
    setChain(null);
  };

  // Função para atualizar perfil do usuário
  const updateUserProfile = async (profile: UserProfile) => {
    try {
      // Importar serviço de identidade
      const { identityService } = await import('@/services/identityService');
      const { vcService } = await import('@/services/vcService');

      // Verificar se o usuário já está registrado
      const existingProfile = await identityService.getUserProfile(profile.address);

      // Garantir que o papel não seja null
      if (!profile.role) {
        throw new Error('Role cannot be null');
      }

      // Converter para o tipo esperado pelo serviço
      const serviceProfile = {
        ...profile,
        role: profile.role as 'tomador' | 'avaliador' | 'both'
      };

      if (existingProfile) {
        // Atualizar perfil existente
        await identityService.updateUserProfile(serviceProfile);

        // Se o papel mudou, emitir nova VC
        if (existingProfile.role !== profile.role && existingProfile.did && profile.role) {
          await vcService.issueRoleCredential(
            existingProfile.did,
            profile.role as 'tomador' | 'avaliador' | 'both',
            profile.address
          );
        }
      } else {
        // Registrar novo usuário
        await identityService.registerUser(serviceProfile);
      }

      // Obter perfil atualizado
      const updatedProfile = await identityService.getUserProfile(profile.address);

      // Atualizar estado
      if (updatedProfile) {
        setUserProfile(updatedProfile as UserProfile);
      } else {
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil do usuário:', error);

      // Fallback: salvar apenas no localStorage
      setUserProfile(profile);

      if (profile.address) {
        localStorage.setItem(`flowcred-profile-${profile.address}`, JSON.stringify(profile));
      }
    }
  };

  // Função para trocar de chain
  const switchChain = async (chainId: number) => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
      }
    } catch (error: any) {
      // Se a chain não está adicionada na carteira
      if (error.code === 4902) {
        const targetChain = supportedChains.find(c => c.id === chainId);

        if (targetChain && window.ethereum) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: `0x${chainId.toString(16)}`,
                  chainName: targetChain.name,
                  nativeCurrency: targetChain.nativeCurrency,
                  rpcUrls: [targetChain.rpcUrls.default.http[0]],
                  blockExplorerUrls: [targetChain.blockExplorers?.default.url],
                },
              ],
            });
          } catch (addError) {
            console.error("Erro ao adicionar chain:", addError);
            setError("Falha ao adicionar chain");
          }
        }
      } else {
        console.error("Erro ao trocar de chain:", error);
        setError("Falha ao trocar de chain");
      }
    }
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        isConnecting,
        address,
        walletClient,
        userProfile,
        error,
        chain,
        connectWallet,
        disconnectWallet,
        setUserProfile: updateUserProfile,
        switchChain
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

// Hook para usar o contexto da carteira
export function useWallet() {
  const context = useContext(WalletContext);

  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }

  return context;
}
