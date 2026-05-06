"use client";

import dynamic from "next/dynamic";
import PoolForm from "@/components/PoolForm";

const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((m) => m.WalletMultiButton),
  { ssr: false }
);

export default function PoolPage() {
  return (
    <main className="min-h-screen px-4 py-8 max-w-lg mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ background: "linear-gradient(135deg, #22d3ee, #6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Liquidity Pool
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>Orca Whirlpool · Module 3</p>
        </div>

      </div>
      <PoolForm />
    </main>
  );
}