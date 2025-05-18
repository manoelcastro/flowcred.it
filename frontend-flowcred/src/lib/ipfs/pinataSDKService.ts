'use client';

import { v4 as uuidv4 } from 'uuid';
import { PinataSDK } from 'pinata';

/**
 * Serviço para interagir com o IPFS via Pinata SDK
 */
export class PinataSDKService {
  private pinata: PinataSDK;
  
  constructor() {
    // Inicializar o SDK do Pinata
    this.pinata = new PinataSDK({
      pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT || '',
      pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL || 'gateway.pinata.cloud'
    });
  }

  /**
   * Faz upload de um objeto JSON para o IPFS
   * @param data Dados a serem armazenados
   * @param name Nome do arquivo (para metadados)
   * @returns Hash IPFS do conteúdo
   */
  async pinJSON(data: any, name: string): Promise<string> {
    try {
      // Converter o objeto JSON para um arquivo
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const file = new File([blob], `${name}-${uuidv4().slice(0, 8)}.json`, { type: 'application/json' });
      
      // Fazer upload do arquivo
      const result = await this.pinata.upload.public.file(file);
      
      return result.cid;
    } catch (error) {
      console.error('Error pinning JSON to IPFS:', error);
      throw error;
    }
  }

  /**
   * Faz upload de um arquivo para o IPFS
   * @param file Arquivo a ser armazenado
   * @param name Nome do arquivo (para metadados)
   * @returns Hash IPFS do conteúdo
   */
  async pinFile(file: File, name: string): Promise<string> {
    try {
      // Fazer upload do arquivo
      const result = await this.pinata.upload.public.file(file);
      
      return result.cid;
    } catch (error) {
      console.error('Error pinning file to IPFS:', error);
      throw error;
    }
  }

  /**
   * Recupera dados do IPFS
   * @param ipfsHash Hash IPFS do conteúdo
   * @returns Dados armazenados
   */
  async getJSON(ipfsHash: string): Promise<any> {
    try {
      // Obter o conteúdo do arquivo
      const data = await this.pinata.gateways.public.get(ipfsHash);
      
      // Se for um objeto JSON, retornar diretamente
      if (typeof data === 'object') {
        return data;
      }
      
      // Se for uma string, tentar fazer parse como JSON
      if (typeof data === 'string') {
        return JSON.parse(data);
      }
      
      throw new Error('Unexpected data format');
    } catch (error) {
      console.error('Error getting JSON from IPFS:', error);
      throw error;
    }
  }
  
  /**
   * Testa a autenticação com o Pinata
   * @returns true se a autenticação for bem-sucedida
   */
  async testAuthentication(): Promise<boolean> {
    try {
      await this.pinata.testAuthentication();
      return true;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  }
}

// Exportar uma instância do serviço para uso em toda a aplicação
export const pinataSDKService = new PinataSDKService();
