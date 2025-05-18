'use client';

import { v4 as uuidv4 } from 'uuid';
import { pinata } from '../../../utils/config';

/**
 * Serviço para interagir com o IPFS via Pinata
 */
export class PinataService {
  private gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL || 'https://gateway.pinata.cloud';

  /**
   * Faz upload de um objeto JSON para o IPFS
   * @param data Dados a serem armazenados
   * @param name Nome do arquivo (para metadados)
   * @returns Hash IPFS do conteúdo
   */
  async pinJSON(data: any, name: string): Promise<string> {
    try {
      const options = {
        pinataMetadata: {
          name: `flowcredit-${name}-${uuidv4().slice(0, 8)}`
        }
      };

      const result = await pinata.pinJSONToIPFS(data, options);
      return result.IpfsHash;
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
      // Converter File para ReadableStream
      const stream = file.stream();

      const options = {
        pinataMetadata: {
          name: `flowcredit-${name}-${uuidv4().slice(0, 8)}`
        }
      };

      const result = await pinata.pinFileToIPFS(stream, options);
      return result.IpfsHash;
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
      const url = `${this.gatewayUrl}/ipfs/${ipfsHash}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting JSON from IPFS:', error);
      throw error;
    }
  }
}

// Exportar uma instância do serviço para uso em toda a aplicação
export const pinataService = new PinataService();
