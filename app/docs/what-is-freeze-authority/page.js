import Link from "next/link";

export const metadata = {
  title: "What is Freeze Authority? — Token Creator",
  description: "Freeze authority allows blocking token accounts. Learn what it is and why revoking it builds community trust.",
};

export default function WhatIsFreezeAuthority() {
  return (
    <main style={{ padding: "48px 24px 80px" }}>
      <Link href="/docs" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)", textDecoration: "none", marginBottom: 32 }}>← Docs</Link>

      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8, fontFamily: "'Geist Mono', monospace" }}>Beginner guide</p>
        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 12 }}>What is Freeze Authority?</h1>
        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.65 }}>Freeze authority gives the token creator the power to lock individual token accounts, preventing transfers. Understanding it is essential for building community trust.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {[
          {
            title: "What freeze authority does",
            body: `When you create a Solana token, you automatically receive the freeze authority. This gives you the ability to freeze any token account that holds your token — preventing the account owner from sending, receiving, or trading their tokens.\n\nIn regulated financial contexts, this can be a legitimate compliance tool. In crypto, it is generally seen as a major red flag for community tokens, because it means the token creator can effectively lock anyone out of their funds.`,
          },
          {
            title: "Why revoking freeze authority matters",
            body: `Revoking the freeze authority permanently removes the ability to freeze token accounts. Once revoked, no one — not even the original creator — can ever block a holder's wallet.\n\nThis is a strong and verifiable signal of decentralization. It tells your community: "Your tokens are truly yours. We cannot touch them." This is especially important for community tokens where holders need to trust that they have full control over their assets.`,
          },
          {
            title: "Freeze authority vs blacklists",
            body: `Freeze authority is different from token blacklists used by some stablecoins. USDC, for example, can blacklist specific addresses to comply with regulatory requirements — this is a feature, not a bug, for a regulated stablecoin.\n\nFor community tokens and memecoins, there is no legitimate reason to keep freeze authority. Revoking it signals that your project respects holders' property rights.`,
          },
          {
            title: "How to verify freeze authority on Solscan",
            body: `On solscan.io, search for a token's mint address and look for the "Freeze Authority" field. If it shows "null" or "disabled", the authority has been revoked. If it shows a wallet address, that wallet can freeze any holder's account at any time.\n\nToken Creator lets you revoke both mint and freeze authority in a single transaction, immediately after your token is created and your vesting is set up.`,
          },
        ].map(s => (
          <div key={s.title} style={{ display: "flex", flexDirection: "column", gap: 10, padding: "20px", borderRadius: 8, background: "var(--card)", border: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}>{s.title}</h2>
            {s.body.split("\n\n").map((p, i) => <p key={i} style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.75 }}>{p}</p>)}
          </div>
        ))}

        <div style={{ padding: "24px", borderRadius: 8, background: "var(--card)", border: "1px solid var(--border)", textAlign: "center" }}>
          <p style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 8 }}>Launch a trustworthy token</p>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>Revoke freeze authority in one click with Token Creator.</p>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--text)", color: "var(--bg)", borderRadius: 8, padding: "11px 24px", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>Create your token →</Link>
        </div>
      </div>
    </main>
  );
}