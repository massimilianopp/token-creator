"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { clusterApiUrl } from "@solana/web3.js";

const NetworkContext = createContext();

export const NETWORKS = {
  mainnet: {
    name: "Mainnet",
    value: "mainnet-beta",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_MAINNET_ENDPOINT || clusterApiUrl("mainnet-beta"),
  },
  devnet: {
    name: "Devnet", 
    value: "devnet",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_DEVNET_ENDPOINT || clusterApiUrl("devnet"),
  },
};

export function NetworkProvider({ children }) {
  const [currentNetwork, setCurrentNetwork] = useState("mainnet");

  useEffect(() => {
    const saved = localStorage.getItem("solana-network");
    if (saved && NETWORKS[saved]) {
      setCurrentNetwork(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-network", currentNetwork);
  }, [currentNetwork]);

  const switchNetwork = (network) => {
    if (NETWORKS[network]) {
      setCurrentNetwork(network);
      localStorage.setItem("solana-network", network);
    }
  };

  const getCurrentEndpoint = () => NETWORKS[currentNetwork].rpcUrl;
  const isDevnet = () => currentNetwork === "devnet";

  const value = {
    currentNetwork,
    switchNetwork,
    getCurrentEndpoint,
    isDevnet,
    networks: NETWORKS,
  };

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
}

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error("useNetwork must be used within NetworkProvider");
  }
  return context;
};
