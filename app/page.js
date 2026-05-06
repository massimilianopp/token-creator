"use client";

import dynamic from "next/dynamic";
import TokenCreatorForm from "@/components/TokenCreatorForm";



export default function Home() {
  return (
    <main className="min-h-screen px-4 py-8 max-w-lg mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ background: "linear-gradient(135deg, #6366f1, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Token Creator
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>Solana devnet · Module 1</p>
        </div>

      </div>
      <TokenCreatorForm />
    </main>
  );
}