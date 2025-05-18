'use client';

import { anvilChain } from '@/lib/anvil-chain';
import FlowCredVCRegistryABI from '@/lib/contracts/abis/FlowCredVCRegistry.json';
import { VC_REGISTRY_CONTRACT_ADDRESS } from '@/lib/contracts/addresses';
import { pinataSDKService } from '@/lib/ipfs/pinataSDKService';
import { agent, LocalStorage } from '@/lib/veramo/setup';
import { v4 as uuidv4 } from 'uuid';
import { Address, createPublicClient, createWalletClient, custom, http } from 'viem';
import { UserRole } from './identityService';

// Interface para Credencial Verificável
export interface VerifiableCredential {
  id: string;
  type: string[];
  issuer: {
    id: string;
  };
  issuanceDate: string;
  credentialSubject: {
    id: string;
    [key: string]: any;
  };
  proof?: any;
}

/**
 * Serviço para gerenciar Credenciais Verificáveis
 */
export class VCService {
  /**
   * Emite uma Credencial Verificável de papel (role)
   * @param subjectDid DID do sujeito da credencial
   * @param role Papel do usuário
   * @param address Endereço da carteira do usuário
   * @returns Hash IPFS da credencial e ID da credencial
   */
  async issueRoleCredential(
    subjectDid: string,
    role: UserRole,
    address: string
  ): Promise<{ ipfsHash: string; credentialId: string }> {
    try {
      // Criar ID único para a credencial
      const credentialId = `urn:uuid:${uuidv4()}`;

      // Criar credencial usando Veramo
      const credential = await agent.createVerifiableCredential({
        credential: {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential', 'FlowCredRoleCredential'],
          issuer: {
            id: (await agent.didManagerGetByAlias({ alias: 'flowcred-issuer' }))?.did ||
                (await agent.didManagerCreate({ alias: 'flowcred-issuer' })).did
          },
          issuanceDate: new Date().toISOString(),
          id: credentialId,
          credentialSubject: {
            id: subjectDid,
            role,
            address,
            issuedAt: Date.now()
          }
        },
        proofFormat: 'jwt'
      });

      // Salvar a credencial no armazenamento local
      LocalStorage.saveVC(credentialId, credential);

      // Armazenar VC no IPFS
      const ipfsHash = await pinataSDKService.pinJSON(
        credential,
        `vc-role-${address.slice(0, 8)}`
      );

      // Registrar referência no contrato
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
            address: VC_REGISTRY_CONTRACT_ADDRESS as Address,
            abi: FlowCredVCRegistryABI,
            functionName: 'registerVC',
            args: [credentialId, ipfsHash, subjectDid, 'RoleCredential'],
            account: await walletClient.getAddresses().then(addresses => addresses[0])
          });
        } catch (error) {
          console.error('Erro ao mudar de rede ou registrar VC:', error);
          throw error;
        }

        return { ipfsHash, credentialId };
      } else {
        throw new Error('Ethereum provider not found');
      }
    } catch (error) {
      console.error('Error issuing role credential:', error);
      throw error;
    }
  }

  /**
   * Verifica se uma Credencial Verificável é válida
   * @param vcId ID da credencial
   * @returns true se a credencial é válida
   */
  async verifyCredential(vcId: string): Promise<boolean> {
    try {
      // Verificar primeiro no contrato
      if (typeof window !== 'undefined') {
        const publicClient = createPublicClient({
          chain: anvilChain,
          transport: http('http://localhost:8545')
        });

        const isValidOnChain = await publicClient.readContract({
          address: VC_REGISTRY_CONTRACT_ADDRESS as Address,
          abi: FlowCredVCRegistryABI,
          functionName: 'isVCValid',
          args: [vcId]
        }) as boolean;

        if (!isValidOnChain) {
          return false;
        }
      }

      // Verificar a credencial usando Veramo
      const credential = LocalStorage.getVC(vcId);
      if (!credential) {
        return false;
      }

      // Verificar a prova criptográfica da credencial
      const verificationResult = await agent.verifyCredential({
        credential
      });

      return verificationResult.verified;
    } catch (error) {
      console.error('Error verifying credential:', error);
      return false;
    }
  }

  /**
   * Obtém todas as Credenciais Verificáveis de um usuário
   * @param did DID do usuário
   * @returns Array de credenciais
   */
  async getUserCredentials(did: string): Promise<VerifiableCredential[]> {
    try {
      // Verificar primeiro no armazenamento local do Veramo
      const localCredentials = LocalStorage.getVCsBySubject(did);

      // Verificar também no contrato/IPFS
      if (typeof window !== 'undefined') {
        const publicClient = createPublicClient({
          chain: anvilChain,
          transport: http('http://localhost:8545')
        });

        // Obter IDs de VCs do usuário
        const vcIds = await publicClient.readContract({
          address: VC_REGISTRY_CONTRACT_ADDRESS as Address,
          abi: FlowCredVCRegistryABI,
          functionName: 'getUserVCs',
          args: [did]
        }) as string[];

        if (vcIds && vcIds.length > 0) {
          // Obter detalhes de cada VC
          const credentials: VerifiableCredential[] = [...localCredentials];
          const localCredentialIds = localCredentials.map(c => c.id);

          for (const id of vcIds) {
            // Pular se já temos esta credencial localmente
            if (localCredentialIds.includes(id)) continue;

            const vcDetails = await publicClient.readContract({
              address: VC_REGISTRY_CONTRACT_ADDRESS as Address,
              abi: FlowCredVCRegistryABI,
              functionName: 'getVCDetails',
              args: [id]
            }) as [string, string, string, string, number, boolean];

            const [, ipfsHash, , , , isRevoked] = vcDetails;

            // Pular VCs revogadas
            if (isRevoked) continue;

            // Obter dados completos do IPFS
            const credential = await pinataSDKService.getJSON(ipfsHash);

            // Salvar no armazenamento local para futuras consultas
            LocalStorage.saveVC(id, credential);

            credentials.push(credential);
          }

          return credentials;
        }
      }

      return localCredentials;
    } catch (error) {
      console.error('Error getting user credentials:', error);
      return [];
    }
  }

  /**
   * Obtém as Credenciais Verificáveis de papel de um usuário
   * @param did DID do usuário
   * @returns Array de credenciais de papel
   */
  async getUserRoleCredentials(did: string): Promise<VerifiableCredential[]> {
    try {
      const credentials = await this.getUserCredentials(did);

      // Filtrar apenas credenciais de papel
      return credentials.filter(vc =>
        vc.type.includes('FlowCredRoleCredential')
      );
    } catch (error) {
      console.error('Error getting user role credentials:', error);
      return [];
    }
  }
}

// Exportar uma instância do serviço para uso em toda a aplicação
export const vcService = new VCService()