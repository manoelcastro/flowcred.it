'use client';

import { agent, LocalStorage } from '@/lib/veramo/setup';
import { IDIDManager } from '@veramo/core';
import { v4 as uuidv4 } from 'uuid';

/**
 * Serviço para gerenciar DIDs usando Veramo
 */
export class DIDService {
  /**
   * Cria um novo DID para um usuário
   * @param address Endereço da carteira do usuário
   * @returns Objeto contendo o DID e suas informações
   */
  async createDID(address: string): Promise<{ did: string; didDoc: any }> {
    try {
      // Verificar se já existe um DID para este endereço
      const existingDID = LocalStorage.getDID(address);
      if (existingDID) {
        return existingDID;
      }

      // Criar um novo DID usando o método did:key
      const identifier = await agent.didManagerCreate({
        provider: 'did:key',
        alias: `flowcred-${address.toLowerCase()}-${uuidv4().slice(0, 8)}`,
      });

      // Resolver o DID para obter o documento completo
      const didDoc = await agent.resolveDid({ didUrl: identifier.did });

      // Salvar o DID no armazenamento local
      const didInfo = {
        did: identifier.did,
        didDoc: didDoc.didDocument,
        keys: identifier.keys,
        provider: identifier.provider,
        controllerKeyId: identifier.controllerKeyId,
      };

      LocalStorage.saveDID(address, didInfo);

      return didInfo;
    } catch (error) {
      console.error('Erro ao criar DID:', error);
      throw error;
    }
  }

  /**
   * Obtém o DID de um usuário
   * @param address Endereço da carteira do usuário
   * @returns DID do usuário ou null se não encontrado
   */
  async getDID(address: string): Promise<string | null> {
    try {
      const didInfo = LocalStorage.getDID(address);
      return didInfo ? didInfo.did : null;
    } catch (error) {
      console.error('Erro ao obter DID:', error);
      return null;
    }
  }

  /**
   * Resolve um DID para obter seu documento
   * @param did DID a ser resolvido
   * @returns Documento DID ou null se não for possível resolver
   */
  async resolveDID(did: string): Promise<any | null> {
    try {
      const result = await agent.resolveDid({ didUrl: did });
      return result.didDocument;
    } catch (error) {
      console.error('Erro ao resolver DID:', error);
      return null;
    }
  }

  /**
   * Verifica se um DID é válido
   * @param did DID a ser verificado
   * @returns true se o DID for válido
   */
  async isValidDID(did: string): Promise<boolean> {
    try {
      const result = await agent.resolveDid({ didUrl: did });
      return !!result.didDocument;
    } catch (error) {
      console.error('Erro ao verificar DID:', error);
      return false;
    }
  }

  /**
   * Importa um DID existente
   * @param didInfo Informações do DID
   * @param address Endereço da carteira do usuário
   * @returns DID importado
   */
  async importDID(didInfo: any, address: string): Promise<string> {
    try {
      // Importar o DID para o agente Veramo
      await agent.didManagerImport(didInfo);
      
      // Salvar no armazenamento local
      LocalStorage.saveDID(address, didInfo);
      
      return didInfo.did;
    } catch (error) {
      console.error('Erro ao importar DID:', error);
      throw error;
    }
  }
}

// Exportar uma instância do serviço para uso em toda a aplicação
export const didService = new DIDService();
