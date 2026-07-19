import Link from "next/link";

export const metadata = {
  title: "Documentation — Token Creator",
  description: "Guides, tutorials, comparisons and security tips for launching a Solana token. No coding required.",
};

const SECTIONS = [
  {
    title: "Beginner guides",
    pages: [
      { href: "/docs/what-is-spl-token", label: "What is an SPL Token?", desc: "The standard behind every Solana token." },
      { href: "/docs/what-is-token2022", label: "What is Token-2022?", desc: "The next generation token standard on Solana." },
      { href: "/docs/what-is-memecoin", label: "What is a memecoin?", desc: "Origins, mechanics, and how to launch one." },
      { href: "/docs/what-is-mint-authority", label: "What is Mint Authority?", desc: "Control over token supply and why you should revoke it." },
      { href: "/docs/what-is-freeze-authority", label: "What is Freeze Authority?", desc: "What it is, why it matters, and when to remove it." },
    ],
  },
  {
    title: "Tutorials",
    pages: [
      { href: "/docs/create-a-token", label: "How to create a token on Solana", desc: "Step-by-step from name to mint address." },
      { href: "/docs/launch-a-memecoin", label: "How to launch a memecoin", desc: "The full checklist for a successful launch." },
      { href: "/docs/add-liquidity", label: "How to add liquidity on Solana", desc: "Make your token tradeable on Orca." },
      { href: "/docs/lock-liquidity", label: "How to lock liquidity", desc: "Prove to your community you won't rug." },
      { href: "/docs/verify-your-token", label: "How to verify your token", desc: "Get listed and recognized on explorers." },
      { href: "/docs/burn-tokens", label: "How to burn tokens on Solana", desc: "Reduce supply and signal commitment." },
    ],
  },
  {
    title: "Comparisons",
    pages: [
      { href: "/docs/token2022-vs-spl", label: "Token-2022 vs SPL Token", desc: "Which standard should you use?" },
      { href: "/docs/orca-vs-raydium", label: "Orca vs Raydium", desc: "The two main DEXs on Solana compared." },
      { href: "/docs/pump-fun-vs-token-creator", label: "Pump.fun vs Token Creator", desc: "Two different approaches to token launching." },
      { href: "/docs/best-solana-token-creator", label: "Best Solana token creator in 2025", desc: "Tools compared side by side." },
    ],
  },
  {
    title: "Security",
    pages: [
      { href: "/docs/common-token-launch-mistakes", label: "Common token launch mistakes", desc: "What to avoid before, during, and after launch." },
      { href: "/docs/how-to-avoid-rug-pulls", label: "How to avoid rug pulls", desc: "Red flags and protective measures for holders." },
      { href: "/docs/how-to-secure-your-token-launch", label: "How to secure your token launch", desc: "Best practices for a trustworthy launch." },
    ],
  },
];

export default function DocsIndexPage() {
  return (
    <main style={{ padding: "48px 24px 80px" }}>
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8, fontFamily: "'Geist Mono', monospace" }}>
          Documentation
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 12 }}>
          Learn how to launch a token
        </h1>
        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.65 }}>
          Guides, tutorials, comparisons and security tips — no coding required.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        {SECTIONS.map(section => (
          <div key={section.title}>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "'Geist Mono', monospace", marginBottom: 12 }}>
              {section.title}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {section.pages.map(page => (
                <Link key={page.href} href={page.href} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 16px", borderRadius: 8, background: "var(--card)",
                  border: "1px solid var(--border)", textDecoration: "none", gap: 12,
                }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>{page.label}</p>
                    <p style={{ fontSize: 12, color: "var(--muted)" }}>{page.desc}</p>
                  </div>
                  <span style={{ color: "var(--dim)", fontSize: 16, flexShrink: 0 }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}