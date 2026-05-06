"use client";

import dynamic from "next/dynamic";
import VestingForm from "@/components/VestingForm";

const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((m) => m.WalletMultiButton),
  { ssr: false }
);

export default function VestingPage() {
  return (
    <main className="min-h-screen px-4 py-8 max-w-lg mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Vesting
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>Streamflow · Module 2</p>
        </div>

      </div>
      <VestingForm />
    </main>
  );
}