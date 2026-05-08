"use client";

import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import BottomNav from "@/components/BottomNav";
import { NetworkProvider, useNetwork } from "@/components/NetworkContext";

function WalletConnectionProvider({ children }) {
  const { getCurrentEndpoint, currentNetwork } = useNetwork();
  const endpoint = getCurrentEndpoint();
  
  const wallets = useMemo(() => [
    new PhantomWalletAdapter({
      network: currentNetwork === "devnet" ? "devnet" : "mainnet-beta"
    }),
    new SolflareWalletAdapter({
      network: currentNetwork === "devnet" ? "devnet" : "mainnet-beta"
    }),
  ], [currentNetwork]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
          <BottomNav />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default function Providers({ children }) {
  return (
    <NetworkProvider>
      <WalletConnectionProvider>
        {children}
      </WalletConnectionProvider>
    </NetworkProvider>
  );
}