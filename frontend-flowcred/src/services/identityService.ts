'use client';

import { anvilChain } from '@/lib/anvil-chain';
import FlowCredIdentityABI from '@/lib/contracts/abis/FlowCredIdentity.json';
import { IDENTITY_CONTRACT_ADDRESS } from '@/lib/contracts/addresses';
import { pinataSDKService } from '@/lib/ipfs/pinataSDKService';
import { v4 as uuidv4 } from 'uuid';
import { Address, createPublicClient, createWalletClient, custom, http } from 'viem';
import { didService } from './didService';

export type UserRole = 'tomador' | 'avaliador' | 'both';

export interface UserProfile {
  address: string;
  name: string;
  email: string;
  role: UserRole;
  did?: string;
  createdAt?: number;
  updatedAt?: number;
}

// Mapeamento de roles para enum do contrato
const roleToEnum = {
  'tomador': 1,
  'avaliador': 2,
  'both': 3
};

// Mapeamento de enum do contrato para roles
const enumToRole = {
  1: 'tomador',
  2: 'avaliador',
  3: 'both'
} as const;

/**
 * Serviço para gerenciar identidade de usuários
 */
export class IdentityService {
  /**
   * Gera um DID para um usuário usando Veramo
   * @param address Endereço da carteira do usuário
   * @returns DID gerado
   */
  async generateDID(address: string): Promise<string> {
    try {
      // Usar o serviço de DIDs para criar um DID com Veramo
      const didInfo = await didService.createDID(address);
      return didInfo.did;
    } catch (error) {
      console.error('Error generating DID with Veramo:', error);
      // Fallback para o método simples se o Veramo falhar
      return `did:flowcred:${address.toLowerCase()}:${uuidv4()}`;
    }
  }

  /**
   * Registra um novo usuário
   * @param profile Perfil do usuário
   * @returns Hash IPFS do perfil
   */
  async registerUser(profile: UserProfile): Promise<string> {
    try {
      // Gerar DID com Veramo se não fornecido
      const did = profile.did || await this.generateDID(profile.address);

      // Adicionar timestamps
      const now = Date.now();
      const profileWithTimestamps = {
        ...profile,
        did,
        createdAt: now,
        updatedAt: now
      };

      // 1. Armazenar perfil no IPFS
      const ipfsHash = await pinataSDKService.pinJSON(
        profileWithTimestamps,
        `user-${profile.address.slice(0, 8)}`
      );

      // 2. Registrar no contrato
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          // Verificar a chain atual
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          const currentChainId = parseInt(chainId, 16);

          // Se não estiver na Anvil, solicitar a mudança
          if (currentChainId !== anvilChain.id) {
            try {
              // Tentar mudar para a rede Anvil
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${anvilChain.id.toString(16)}` }],
              });
            } catch (switchError: any) {
              // Se a rede não estiver adicionada na carteira
              if (switchError.code === 4902) {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: `0x${anvilChain.id.toString(16)}`,
                      chainName: anvilChain.name,
                      nativeCurrency: anvilChain.nativeCurrency,
                      rpcUrls: [anvilChain.rpcUrls.default.http[0]],
                    },
                  ],
                });
              } else {
                throw switchError;
              }
            }
          }

          // Criar cliente com a chain correta
          const walletClient = createWalletClient({
            chain: anvilChain,
            transport: custom(window.ethereum)
          });

          await walletClient.writeContract({
            address: IDENTITY_CONTRACT_ADDRESS as Address,
            abi: FlowCredIdentityABI,
            functionName: 'registerUser',
            args: [did, ipfsHash, roleToEnum[profile.role]],
            account: await walletClient.getAddresses().then(addresses => addresses[0])
          });
        } catch (error) {
          console.error('Erro ao mudar de rede ou registrar usuário:', error);
          throw error;
        }

        // Salvar no localStorage para acesso rápido
        localStorage.setItem(`flowcred-profile-${profile.address}`, JSON.stringify({
          ...profileWithTimestamps,
          ipfsHash
        }));

        return ipfsHash;
      } else {
        throw new Error('Ethereum provider not found');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  /**
   * Atualiza o perfil de um usuário existente
   * @param profile Perfil atualizado do usuário
   * @returns Hash IPFS do perfil atualizado
   */
  async updateUserProfile(profile: UserProfile): Promise<string> {
    try {
      // Adicionar timestamp de atualização
      const profileWithTimestamp = {
        ...profile,
        updatedAt: Date.now()
      };

      // 1. Armazenar perfil atualizado no IPFS
      const ipfsHash = await pinataSDKService.pinJSON(
        profileWithTimestamp,
        `user-${profile.address.slice(0, 8)}-update`
      );

      // 2. Atualizar no contrato
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          // Verificar a chain atual
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          const currentChainId = parseInt(chainId, 16);

          // Se não estiver na Anvil, solicitar a mudança
          if (currentChainId !== anvilChain.id) {
            try {
              // Tentar mudar para a rede Anvil
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${anvilChain.id.toString(16)}` }],
              });
            } catch (switchError: any) {
              // Se a rede não estiver adicionada na carteira
              if (switchError.code === 4902) {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: `0x${anvilChain.id.toString(16)}`,
                      chainName: anvilChain.name,
                      nativeCurrency: anvilChain.nativeCurrency,
                      rpcUrls: [anvilChain.rpcUrls.default.http[0]],
                    },
                  ],
                });
              } else {
                throw switchError;
              }
            }
          }

          // Criar cliente com a chain correta
          const walletClient = createWalletClient({
            chain: anvilChain,
            transport: custom(window.ethereum)
          });

          await walletClient.writeContract({
            address: IDENTITY_CONTRACT_ADDRESS as Address,
            abi: FlowCredIdentityABI,
            functionName: 'updateProfile',
            args: [ipfsHash, roleToEnum[profile.role]],
            account: await walletClient.getAddresses().then(addresses => addresses[0])
          });
        } catch (error) {
          console.error('Erro ao mudar de rede ou atualizar perfil:', error);
          throw error;
        }

        // Atualizar no localStorage
        localStorage.setItem(`flowcred-profile-${profile.address}`, JSON.stringify({
          ...profileWithTimestamp,
          ipfsHash
        }));

        return ipfsHash;
      } else {
        throw new Error('Ethereum provider not found');
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Obtém o perfil de um usuário
   * @param address Endereço da carteira do usuário
   * @returns Perfil do usuário ou null se não encontrado
   */
  async getUserProfile(address: string): Promise<UserProfile | null> {
    try {
      // Tentar obter do localStorage primeiro (cache)
      const cachedProfile = localStorage.getItem(`flowcred-profile-${address}`);
      if (cachedProfile) {
        return JSON.parse(cachedProfile);
      }

      // Se não estiver no cache, obter do contrato
      if (typeof window !== 'undefined') {
        const publicClient = createPublicClient({
          chain: anvilChain,
          transport: http('http://localhost:8545')
        });

        const [did, ipfsHash, role, registeredAt, updatedAt, isActive] = (await publicClient.readContract({
          address: IDENTITY_CONTRACT_ADDRESS as Address,
          abi: FlowCredIdentityABI,
          functionName: 'getUserProfile',
          args: [address as Address]
        })) as [string, string, number, string, string, boolean];

        // Se o usuário não estiver registrado ou estiver inativo
        if (!did || !isActive) {
          return null;
        }

        // Obter dados completos do IPFS
        const profileData = await pinataSDKService.getJSON(ipfsHash);

        // Criar objeto de perfil
        const profile: UserProfile = {
          address,
          name: profileData.name,
          email: profileData.email,
          role: enumToRole[role as 1 | 2 | 3],
          did,
          createdAt: Number(registeredAt),
          updatedAt: Number(updatedAt)
        };

        // Salvar no localStorage para acesso rápido
        localStorage.setItem(`flowcred-profile-${address}`, JSON.stringify({
          ...profile,
          ipfsHash
        }));

        return profile;
      }

      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Verifica se um usuário tem o papel de tomador
   * @param address Endereço da carteira do usuário
   * @returns true se o usuário tem o papel de tomador
   */
  async isTomador(address: string): Promise<boolean> {
    try {
      if (typeof window !== 'undefined') {
        const publicClient = createPublicClient({
          chain: anvilChain,
          transport: http('http://localhost:8545')
        });

        const result = await publicClient.readContract({
          address: IDENTITY_CONTRACT_ADDRESS as Address,
          abi: FlowCredIdentityABI,
          functionName: 'isTomador',
          args: [address as Address]
        });

        return Boolean(result);
      }

      return false;
    } catch (error) {
      console.error('Error checking if user is tomador:', error);
      return false;
    }
  }

  /**
   * Verifica se um usuário tem o papel de avaliador
   * @param address Endereço da carteira do usuário
   * @returns true se o usuário tem o papel de avaliador
   */
  async isAvaliador(address: string): Promise<boolean> {
    try {
      if (typeof window !== 'undefined') {
        const publicClient = createPublicClient({
          chain: anvilChain,
          transport: http('http://localhost:8545')
        });

        const result = await publicClient.readContract({
          address: IDENTITY_CONTRACT_ADDRESS as Address,
          abi: FlowCredIdentityABI,
          functionName: 'isAvaliador',
          args: [address as Address]
        });

        return Boolean(result);
      }

      return false;
    } catch (error) {
      console.error('Error checking if user is avaliador:', error);
      return false;
    }
  }
}

// Exportar uma instância do serviço para uso em toda a aplicação
export const identityService = new IdentityService()