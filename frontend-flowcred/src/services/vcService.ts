import FlowCredVCRegistryABI from '@/lib/contracts/abis/FlowCredVCRegistry.json';
import { VC_REGISTRY_CONTRACT_ADDRESS } from '@/lib/contracts/addresses';
import { pinataService } from '@/lib/ipfs/pinataService';
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
   * @returns Hash IPFS da credencial
   */
  async issueRoleCredential(
    subjectDid: string,
    role: UserRole,
    address: string
  ): Promise<string> {
    try {
      // Criar ID único para a credencial
      const credentialId = `urn:uuid:${uuidv4()}`;

      // Criar credencial
      const credential: VerifiableCredential = {
        id: credentialId,
        type: ['VerifiableCredential', 'FlowCredRoleCredential'],
        issuer: {
          id: 'did:flowcred:issuer'
        },
        issuanceDate: new Date().toISOString(),
        credentialSubject: {
          id: subjectDid,
          role,
          address,
          issuedAt: Date.now()
        }
      };

      // Armazenar VC no IPFS
      const ipfsHash = await pinataService.pinJSON(
        credential,
        `vc-role-${address.slice(0, 8)}`
      );

      // Registrar referência no contrato
      if (typeof window !== 'undefined' && window.ethereum) {
        const walletClient = createWalletClient({
          chain: anvilChain,
          transport: custom(window.ethereum)
        });

        const { request } = await walletClient.writeContract({
          address: VC_REGISTRY_CONTRACT_ADDRESS as Address,
          abi: FlowCredVCRegistryABI,
          functionName: 'registerVC',
          args: [credentialId, ipfsHash, subjectDid, 'RoleCredential']
        });

        const hash = await walletClient.writeContract(request);

        return ipfsHash;
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
      if (typeof window !== 'undefined') {
        const publicClient = createPublicClient({
          chain: anvilChain,
          transport: http('http://localhost:8545')
        });

        return await publicClient.readContract({
          address: VC_REGISTRY_CONTRACT_ADDRESS as Address,
          abi: FlowCredVCRegistryABI,
          functionName: 'isVCValid',
          args: [vcId]
        });
      }

      return false;
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
        });

        if (!vcIds || (vcIds as string[]).length === 0) {
          return [];
        }

        // Obter detalhes de cada VC
        const credentials: VerifiableCredential[] = [];

        for (const id of vcIds as string[]) {
          const [, ipfsHash, , , , isRevoked] = await publicClient.readContract({
            address: VC_REGISTRY_CONTRACT_ADDRESS as Address,
            abi: FlowCredVCRegistryABI,
            functionName: 'getVCDetails',
            args: [id]
          });

          // Pular VCs revogadas
          if (isRevoked) continue;

          // Obter dados completos do IPFS
          const credential = await pinataService.getJSON(ipfsHash as string);
          credentials.push(credential);
        }

        return credentials;
      }

      return [];
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
export const vcService = new VCService();
