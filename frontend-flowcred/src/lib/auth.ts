import { LIT_NETWORK } from '@lit-protocol/constants'
import * as LitJsSdk from '@lit-protocol/lit-node-client'

const client = new LitJsSdk.LitNodeClient({
  litNetwork: LIT_NETWORK.Datil
})

await client.connect()