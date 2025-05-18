import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Chaves de API do Pinata (devem ser definidas como variáveis de ambiente)
const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

/**
 * Serviço para interagir com o IPFS via Pinata
 */
export class PinataService {
  private baseURL = 'https://api.pinata.cloud';
  private headers = {
    'Authorization': `Bearer ${PINATA_JWT}`
  };

  /**
   * Faz upload de um objeto JSON para o IPFS
   * @param data Dados a serem armazenados
   * @param name Nome do arquivo (para metadados)
   * @returns Hash IPFS do conteúdo
   */
  async pinJSON(data: any, name: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseURL}/pinning/pinJSONToIPFS`,
        {
          pinataContent: data,
          pinataMetadata: {
            name: `flowcredit-${name}-${uuidv4().slice(0, 8)}`
          }
        },
        { headers: this.headers }
      );

      return response.data.IpfsHash;
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
      const formData = new FormData();
      formData.append('file', file);
      
      const metadata = JSON.stringify({
        name: `flowcredit-${name}-${uuidv4().slice(0, 8)}`
      });
      formData.append('pinataMetadata', metadata);

      const response = await axios.post(
        `${this.baseURL}/pinning/pinFileToIPFS`,
        formData,
        {
          headers: {
            ...this.headers,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return response.data.IpfsHash;
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
      const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
      return response.data;
    } catch (error) {
      console.error('Error getting JSON from IPFS:', error);
      throw error;
    }
  }
}

// Exportar uma instância do serviço para uso em toda a aplicação
export const pinataService = new PinataService();
