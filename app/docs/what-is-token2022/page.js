import Link from "next/link";

export const metadata = {
  title: "What is Token-2022? — Token Creator",
  description: "Token-2022 is the next generation token standard on Solana with advanced features like transfer fees, interest-bearing tokens, and more.",
};

export default function WhatIsToken2022() {
  return (
    <main style={{ padding: "48px 24px 80px" }}>
      <Link href="/docs" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)", textDecoration: "none", marginBottom: 32 }}>← Docs</Link>

      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8, fontFamily: "'Geist Mono', monospace" }}>Beginner guide</p>
        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 12 }}>What is Token-2022?</h1>
        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.65 }}>Token-2022 is the next generation token standard on Solana, offering advanced features not available in the original SPL Token program.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {[
          {
            title: "A more powerful token standard",
            body: `Token-2022 (also called Token Extensions) is a new version of the SPL Token program deployed on Solana. It is backward-compatible with the original SPL Token standard, meaning existing wallets and DEXs can still interact with Token-2022 tokens.\n\nThe key difference is that Token-2022 introduces optional extensions — additional features that token creators can activate at mint creation time. These extensions open up entirely new use cases that were previously impossible on Solana.`,
          },
          {
            title: "Transfer fees",
            body: `One of the most popular Token-2022 extensions is transfer fees. With this feature enabled, a percentage of every token transfer is automatically withheld and sent to a designated wallet.\n\nThis allows projects to monetize token activity — every swap, every airdrop, every peer-to-peer transfer generates revenue for the protocol. Transfer fees are enforced at the program level, meaning they cannot be bypassed.`,
          },
          {
            title: "Interest-bearing tokens",
            body: `Token-2022 supports interest-bearing tokens — tokens whose displayed balance grows over time at a configurable rate, without requiring additional transactions.\n\nThis is useful for yield-bearing stablecoins, savings products, or any token that needs to represent an accruing value.`,
          },
          {
            title: "Non-transferable tokens",
            body: `Token-2022 includes a non-transferable extension, which prevents tokens from being sent to another wallet. This is useful for soul-bound tokens — credentials, achievements, or identity tokens that should stay with their original recipient.`,
          },
          {
            title: "Confidential transfers",
            body: `For privacy-sensitive use cases, Token-2022 supports confidential transfers using zero-knowledge proofs. Transfer amounts are hidden from public view while still being verifiable on-chain.`,
          },
          {
            title: "Should you use Token-2022 or classic SPL?",
            body: `For most community tokens, memecoins, and simple reward tokens, the classic SPL Token standard is the right choice. It has broader wallet support, better DEX compatibility, and no additional complexity.\n\nToken-2022 is worth considering if you need transfer fees, non-transferable credentials, or advanced DeFi features. Token Creator supports both standards — you can choose when creating your token.`,
          },
        ].map(s => (
          <div key={s.title} style={{ display: "flex", flexDirection: "column", gap: 10, padding: "20px", borderRadius: 8, background: "var(--card)", border: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}>{s.title}</h2>
            {s.body.split("\n\n").map((p, i) => <p key={i} style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.75 }}>{p}</p>)}
          </div>
        ))}

        <div style={{ padding: "24px", borderRadius: 8, background: "var(--card)", border: "1px solid var(--border)", textAlign: "center" }}>
          <p style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 8 }}>Create your token — SPL or Token-2022</p>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>Token Creator supports both standards. No coding required.</p>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--text)", color: "var(--bg)", borderRadius: 8, padding: "11px 24px", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>Create your token →</Link>
        </div>
      </div>
    </main>
  );
}