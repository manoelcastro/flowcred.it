// Endereços dos contratos implantados
// Estes endereços devem ser atualizados após o deploy dos contratos

// Endereço do contrato FlowCredIdentity
export const IDENTITY_CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

// Endereço do contrato FlowCredVCRegistry
export const VC_REGISTRY_CONTRACT_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

// Função para obter o endereço do contrato com base na rede
export function getContractAddress(contractName: 'identity' | 'vcRegistry', chainId: number): string {
  // Mapeamento de endereços por rede
  const addresses: Record<number, Record<string, string>> = {
    // Ethereum Mainnet
    1: {
      identity: '0x0000000000000000000000000000000000000000',
      vcRegistry: '0x0000000000000000000000000000000000000000'
    },
    // Goerli Testnet
    5: {
      identity: '0x0000000000000000000000000000000000000000',
      vcRegistry: '0x0000000000000000000000000000000000000000'
    },
    // Sepolia Testnet
    11155111: {
      identity: '0x0000000000000000000000000000000000000000',
      vcRegistry: '0x0000000000000000000000000000000000000000'
    },
    // Localhost/Anvil
    31337: {
      identity: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      vcRegistry: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
    }
  };

  // Retornar o endereço para a rede especificada ou o endereço padrão
  return addresses[chainId]?.[contractName] ||
    (contractName === 'identity' ? IDENTITY_CONTRACT_ADDRESS : VC_REGISTRY_CONTRACT_ADDRESS);
}
