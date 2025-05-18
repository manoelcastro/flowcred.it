import { createWalletClient, custom, WalletClient } from 'viem';
import { mainnet } from 'viem/chains';


let client: WalletClient;

export function getWalletClient() {
  if (!client) {
    client = createWalletClient({
      chain: mainnet,
      transport: custom(window.talismanEth!)
    })
  }

  return client
}