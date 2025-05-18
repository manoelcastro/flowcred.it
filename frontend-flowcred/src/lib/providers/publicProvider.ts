import { createPublicClient, http, PublicClient } from 'viem';
import { anvil } from 'viem/chains';

let client: PublicClient;

export function getPublicClient() {
  if (!client) {
    client = createPublicClient({
      chain: anvil,
      transport: http()
    })
  }

  return client
}
