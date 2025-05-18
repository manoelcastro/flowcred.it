'use client';

import { v4 as uuidv4 } from 'uuid';

/**
 * Implementação simplificada do agente Veramo
 *
 * Esta é uma versão simplificada que implementa apenas as funcionalidades
 * necessárias para o nosso caso de uso
 */
export const agent = {
  // Gerenciamento de DIDs
  didManagerCreate: async ({ alias }: { alias: string }) => {
    const did = `did:key:${uuidv4()}`;
    const keys = [{ kid: uuidv4(), type: 'Ed25519', publicKeyHex: uuidv4() }];

    const identifier = {
      did,
      provider: 'did:key',
      controllerKeyId: keys[0].kid,
      keys,
    };

    return identifier;
  },

  didManagerGetByAlias: async ({ alias }: { alias: string }) => {
    // Verificar se já existe um DID com este alias no localStorage
    if (typeof window !== 'undefined') {
      const storedDID = localStorage.getItem(`flowcred-did-alias-${alias}`);
      if (storedDID) {
        return JSON.parse(storedDID);
      }
    }

    // Se não existir, criar um novo
    const identifier = await agent.didManagerCreate({ alias });

    // Salvar no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(`flowcred-did-alias-${alias}`, JSON.stringify(identifier));
    }

    return identifier;
  },

  // Resolução de DIDs
  resolveDid: async ({ didUrl }: { didUrl: string }) => {
    return {
      didDocument: {
        id: didUrl,
        verificationMethod: [
          {
            id: `${didUrl}#keys-1`,
            type: 'Ed25519VerificationKey2018',
            controller: didUrl,
            publicKeyHex: uuidv4(),
          },
        ],
      },
    };
  },

  // Emissão de VCs
  createVerifiableCredential: async ({ credential, proofFormat }: any) => {
    const id = credential.id || `urn:uuid:${uuidv4()}`;
    const issuanceDate = credential.issuanceDate || new Date().toISOString();

    const vc = {
      ...credential,
      id,
      issuanceDate,
      proof: {
        type: 'Ed25519Signature2018',
        created: new Date().toISOString(),
        verificationMethod: `${credential.issuer.id}#keys-1`,
        proofPurpose: 'assertionMethod',
        jws: `eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..${uuidv4()}`,
      },
    };

    return vc;
  },

  // Verificação de VCs
  verifyCredential: async ({ credential }: any) => {
    // Simulação de verificação bem-sucedida
    return {
      verified: true,
      error: null,
    };
  },
};

/**
 * Armazenamento local para DIDs e VCs
 * Em uma implementação completa, isso seria substituído por um armazenamento persistente
 */
export class LocalStorage {
  private static dids: Map<string, any> = new Map();
  private static vcs: Map<string, any> = new Map();

  // Métodos para DIDs
  static saveDID(address: string, did: any): void {
    this.dids.set(address.toLowerCase(), did);

    // Também salvar no localStorage do navegador para persistência entre sessões
    if (typeof window !== 'undefined') {
      localStorage.setItem(`flowcred-did-${address.toLowerCase()}`, JSON.stringify(did));
    }
  }

  static getDID(address: string): any {
    // Tentar obter do Map primeiro
    const did = this.dids.get(address.toLowerCase());
    if (did) return did;

    // Se não encontrado, tentar obter do localStorage
    if (typeof window !== 'undefined') {
      const storedDID = localStorage.getItem(`flowcred-did-${address.toLowerCase()}`);
      if (storedDID) {
        const parsedDID = JSON.parse(storedDID);
        this.dids.set(address.toLowerCase(), parsedDID);
        return parsedDID;
      }
    }

    return null;
  }

  // Métodos para VCs
  static saveVC(id: string, vc: any): void {
    this.vcs.set(id, vc);

    // Também salvar no localStorage do navegador
    if (typeof window !== 'undefined') {
      localStorage.setItem(`flowcred-vc-${id}`, JSON.stringify(vc));
    }
  }

  static getVC(id: string): any {
    // Tentar obter do Map primeiro
    const vc = this.vcs.get(id);
    if (vc) return vc;

    // Se não encontrado, tentar obter do localStorage
    if (typeof window !== 'undefined') {
      const storedVC = localStorage.getItem(`flowcred-vc-${id}`);
      if (storedVC) {
        const parsedVC = JSON.parse(storedVC);
        this.vcs.set(id, parsedVC);
        return parsedVC;
      }
    }

    return null;
  }

  static getVCsBySubject(subjectDid: string): any[] {
    const result: any[] = [];

    // Verificar VCs no Map
    this.vcs.forEach((vc) => {
      if (vc.credentialSubject && vc.credentialSubject.id === subjectDid) {
        result.push(vc);
      }
    });

    // Verificar VCs no localStorage
    if (typeof window !== 'undefined') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('flowcred-vc-')) {
          try {
            const vc = JSON.parse(localStorage.getItem(key) || '{}');
            if (vc.credentialSubject && vc.credentialSubject.id === subjectDid && !result.some(r => r.id === vc.id)) {
              result.push(vc);
            }
          } catch (e) {
            console.error('Erro ao analisar VC do localStorage:', e);
          }
        }
      }
    }

    return result;
  }
}
