import Link from "next/link";

export const metadata = {
  title: "What is an SPL Token? — Token Creator",
  description: "Learn what SPL tokens are, how they work on Solana, and how to create one without writing code.",
};

export default function WhatIsSPLToken() {
  return (
    <main style={{ padding: "48px 24px 80px" }}>
      <Link href="/docs" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)", textDecoration: "none", marginBottom: 32 }}>← Docs</Link>

      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8, fontFamily: "'Geist Mono', monospace" }}>Beginner guide</p>
        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 12 }}>What is an SPL Token?</h1>
        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.65 }}>SPL tokens are the standard for fungible assets on Solana — from stablecoins to memecoins to community tokens.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {[
          {
            title: "SPL stands for Solana Program Library",
            body: `SPL (Solana Program Library) is a collection of on-chain programs maintained by the Solana Foundation. The SPL Token program is the smart contract responsible for creating and managing fungible tokens on Solana.\n\nEvery token you see on Solana — USDC, Bonk, JUP, WIF — is an SPL token. They all share the same underlying program, which makes them universally compatible with wallets, DEXs, and explorers.`,
          },
          {
            title: "How SPL tokens differ from ERC-20 tokens",
            body: `On Ethereum, each token is its own smart contract deployed on-chain. This means every token has unique code, which introduces risk and high deployment costs.\n\nOn Solana, all tokens use the same SPL Token program. There is no custom code per token — just a mint account with configuration parameters. This makes SPL tokens cheaper to create, faster to transfer, and safer by default.\n\nCreating an SPL token on Solana costs less than $0.01 in network fees, compared to hundreds of dollars on Ethereum.`,
          },
          {
            title: "The mint account",
            body: `Every SPL token is identified by a mint address — a unique public key on Solana that stores the token's configuration: total supply, number of decimals, mint authority, and freeze authority.\n\nThis mint address is the permanent identifier of your token. It is what you share with your community, list on DEXs, and use to verify your token on explorers like Solscan.`,
          },
          {
            title: "Token accounts and Associated Token Accounts",
            body: `On Solana, each wallet needs a separate token account for every SPL token it holds.\n\nThe standard way to create these is through Associated Token Accounts (ATAs) — derived deterministically from the wallet address and the mint address. When you send tokens to someone for the first time, the ATA is usually created automatically.\n\nThis design makes Solana tokens more efficient for bulk transfers, which is why airdrops to thousands of wallets cost almost nothing.`,
          },
          {
            title: "Supply and decimals",
            body: `When you create an SPL token, you define two key parameters:\n\nTotal supply — the number of tokens minted at creation. You can mint more later if you keep the mint authority active, or fix the supply forever by revoking it.\n\nDecimals — the number of decimal places. USDC uses 6 decimals, SOL uses 9. For community tokens, 6 decimals is the most common choice.`,
          },
          {
            title: "Metadata: name, symbol, and logo",
            body: `The SPL Token program itself does not store names or logos. Token metadata is handled by the Metaplex Token Metadata program.\n\nWhen you create a token with Token Creator, we automatically create a metadata account linked to your mint. Your logo is uploaded to IPFS for permanent decentralized storage, and the metadata URI is written on-chain so any wallet or explorer can display your token correctly.`,
          },
        ].map(s => (
          <div key={s.title} style={{ display: "flex", flexDirection: "column", gap: 10, padding: "20px", borderRadius: 8, background: "var(--card)", border: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}>{s.title}</h2>
            {s.body.split("\n\n").map((p, i) => <p key={i} style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.75 }}>{p}</p>)}
          </div>
        ))}

        <div style={{ padding: "24px", borderRadius: 8, background: "var(--card)", border: "1px solid var(--border)", textAlign: "center" }}>
          <p style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 8 }}>Ready to create your SPL token?</p>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>Token Creator handles everything — no coding required.</p>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--text)", color: "var(--bg)", borderRadius: 8, padding: "11px 24px", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>Create your token →</Link>
        </div>
      </div>
    </main>
  );
}