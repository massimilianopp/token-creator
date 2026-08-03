"use client";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";
import TokenCreatorForm from "@/components/TokenCreatorForm";

const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then(m => m.WalletMultiButton),
  { ssr: false }
);

export default function Home() {
  const { connected } = useWallet();

  if (!connected) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 400, margin: "0 auto", width: "100%" }}>
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "'Geist Mono', monospace", marginBottom: 16 }}>
              Token Creator
            </p>
            <h1 style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16, color: "var(--text)" }}>
              Create a Solana token.
            </h1>
            <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.65 }}>
              One flow for SPL and Token-2022 creation, vesting, liquidity, and a public token page — instead of stitching together three or four separate tools.
            </p>
          </div>

          {/* Positioning block */}
          <div style={{ marginBottom: 32, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 8, lineHeight: 1.5 }}>
              Built for community launches, not speculation.
            </p>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              Token, vesting, and liquidity that work together — verify every step on Solscan, no badges required.
            </p>
          </div>

          {/* CTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <WalletMultiButton style={{
              width: "100%",
              justifyContent: "center",
              background: "var(--text)",
              color: "var(--bg)",
              border: "none",
              borderRadius: 8,
              padding: "13px 24px",
              fontSize: 14,
              fontWeight: 500,
              fontFamily: "'Geist', sans-serif",
              minHeight: 48,
              cursor: "pointer",
            }} />

            {/* Trust signals */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "16px", borderRadius: 8, background: "var(--surface)", border: "1px solid var(--border)" }}>
              {[
                "Connecting your wallet only shares your public address.",
                "No transaction. No signature.",
                "No funds can move until you explicitly approve a transaction.",
              ].map((text, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ color: "var(--green)", fontSize: 13, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: "32px 24px 0" }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
          Step 01
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 6, color: "var(--text)" }}>
          Create token
        </h1>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
          Deploy your SPL token on Solana
        </p>
      </div>
      <TokenCreatorForm />
    </main>
  );
}