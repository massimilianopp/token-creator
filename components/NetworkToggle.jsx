"use client";

import { useNetwork } from "./NetworkContext";

export default function NetworkToggle() {
  const { currentNetwork, switchNetwork, isDevnet, networks } = useNetwork();

  return (
    <div className="flex items-center gap-3">
      {isDevnet() && (
        <div className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs font-medium">
          DEVNET
        </div>
      )}
      
      <div className="flex items-center bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => switchNetwork("mainnet")}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
            currentNetwork === "mainnet"
              ? "bg-blue-500 text-white shadow-lg"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Mainnet
        </button>
        <button
          onClick={() => switchNetwork("devnet")}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
            currentNetwork === "devnet"
              ? "bg-orange-500 text-white shadow-lg"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Devnet
        </button>
      </div>
    </div>
  );
}