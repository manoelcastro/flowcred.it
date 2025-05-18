import { getWalletClient } from "@/lib/providers/walletProvider"
import { useEffect, useRef, useState } from "react"
import { Address, WalletClient } from "viem"

export function RegisterButton() {
  const [address, setAddress] = useState<Address | null>(null)
  const client = useRef<WalletClient>(null)

  async function handleClick() {
    const c = client.current
   
    const addresses = await c!.requestAddresses()
    setAddress(addresses[0])
  }

  useEffect(() => {
    client.current = getWalletClient()
  }, [])

  return (
    <button onClick={handleClick} className="bg-[#3B82F629] hover:bg-black/50 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-full transition duration-300 w-full sm:w-auto border border-[#3B82F6]/30 text-center" style={{ backdropFilter: 'blur(8px)' }}>
      {address ? 'Conectado': 'Registre-se'}
    </button>
  )
}