"use client";
import PoolForm from "@/components/PoolForm";

export default function PoolPage() {
  return (
    <main style={{ padding: "32px 24px 0" }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
          Step 03 · Optional
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 6, color: "var(--text)" }}>
          Liquidity Pool
        </h1>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
          Create an Orca Whirlpool position
        </p>
      </div>
      <PoolForm />
    </main>
  );
}