"use client";

import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { BackpackWalletAdapter } from "@solana/wallet-adapter-backpack";
import BottomNav from "@/components/BottomNav";
import { NetworkProvider, useNetwork } from "@/components/NetworkContext";
import { useKeyboardScroll } from "@/hooks/useKeyboardScroll";

function WalletConnectionProvider({ children }) {
  const { getCurrentEndpoint, currentNetwork } = useNetwork();
  const endpoint = getCurrentEndpoint();
  
  const wallets = useMemo(() => [
    // Phantom Connect (embedded wallet with email/social login) - prioritized first
    new PhantomWalletAdapter({
      network: currentNetwork === "devnet" ? "devnet" : "mainnet-beta",
      // Enable Phantom Connect embedded wallet features
      config: {
        // Allow embedded wallets with email/social login
        embedded: true,
        // Support for social providers
        providers: ["google", "apple", "injected"],
        // Enable all standard features
        features: {
          connect: true,
          signTransaction: true,
          signAllTransactions: true,
          signMessage: true,
          signIn: true,
          // Phantom Connect specific features
          embedded: true,
          socialLogin: true
        }
      }
    }),
    new SolflareWalletAdapter({
      network: currentNetwork === "devnet" ? "devnet" : "mainnet-beta"
    }),
    new BackpackWalletAdapter({
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
  useKeyboardScroll();
  
  return (
    <NetworkProvider>
      <WalletConnectionProvider>
        {children}
      </WalletConnectionProvider>
    </NetworkProvider>
  );
}