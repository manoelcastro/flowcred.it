interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    isTalisman?: boolean;
    isWalletConnect?: boolean;
    request: (request: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
    selectedAddress?: string;
    chainId?: string;
    networkVersion?: string;
    _metamask?: {
      isUnlocked: () => Promise<boolean>;
    };
  };
}
