import Link from "next/link";

export const metadata = {
  title: "What is Mint Authority? — Token Creator",
  description: "Mint authority controls the supply of a Solana token. Learn what it is, why it matters, and when to revoke it.",
};

export default function WhatIsMintAuthority() {
  return (
    <main style={{ padding: "48px 24px 80px" }}>
      <Link href="/docs" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)", textDecoration: "none", marginBottom: 32 }}>← Docs</Link>

      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8, fontFamily: "'Geist Mono', monospace" }}>Beginner guide</p>
        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 12 }}>What is Mint Authority?</h1>
        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.65 }}>Mint authority is the right to create new tokens. Revoking it is often the strongest trust signal you can give your community.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {[
          {
            title: "What mint authority does",
            body: `When you create a Solana token, your wallet becomes the mint authority by default. This means you — and only you — can mint additional tokens at any time.\n\nIf you mint 1,000,000,000 tokens today but keep the mint authority, nothing stops you from minting another 10,000,000,000 tomorrow. This is a massive red flag for any community or investor, because it means the supply is not actually fixed.`,
          },
          {
            title: "Why revoking mint authority matters",
            body: `Revoking the mint authority permanently removes the ability to create new tokens. Once revoked, the supply is fixed forever — no one, not even the original creator, can mint more tokens.\n\nThis is a one-way action that cannot be undone. It is verifiable on-chain by anyone using a block explorer like Solscan. Savvy community members routinely check this before investing in a new token.`,
          },
          {
            title: "When to revoke mint authority",
            body: `Token Creator recommends revoking mint authority after completing your vesting setup. This is because Streamflow requires an active mint authority to create a vesting contract.\n\nThe recommended order is:\n1. Create your token\n2. Set up vesting for your team allocation\n3. Revoke mint authority\n4. Add liquidity\n\nOnce the mint authority is revoked, your token supply is permanently fixed.`,
          },
          {
            title: "How to check mint authority on Solscan",
            body: `To verify whether a token has revoked its mint authority, go to solscan.io, search for the token's mint address, and look for the "Mint Authority" field under the token details.\n\nIf it shows "null" or "disabled", the mint authority has been revoked and the supply is fixed. If it shows a wallet address, that wallet can still mint new tokens at any time.`,
          },
        ].map(s => (
          <div key={s.title} style={{ display: "flex", flexDirection: "column", gap: 10, padding: "20px", borderRadius: 8, background: "var(--card)", border: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}>{s.title}</h2>
            {s.body.split("\n\n").map((p, i) => <p key={i} style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.75 }}>{p}</p>)}
          </div>
        ))}

        <div style={{ padding: "24px", borderRadius: 8, background: "var(--card)", border: "1px solid var(--border)", textAlign: "center" }}>
          <p style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 8 }}>Create a token with fixed supply</p>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>Token Creator lets you revoke mint authority in one click after setup.</p>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--text)", color: "var(--bg)", borderRadius: 8, padding: "11px 24px", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>Create your token →</Link>
        </div>
      </div>
    </main>
  );
}