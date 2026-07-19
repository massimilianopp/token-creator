import Link from "next/link";

export const metadata = {
  title: "What is a Memecoin? — Token Creator",
  description: "Learn what memecoins are, how they work on Solana, and how to launch your own memecoin without coding.",
};

export default function WhatIsMemecoin() {
  return (
    <main style={{ padding: "48px 24px 80px" }}>
      <Link href="/docs" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)", textDecoration: "none", marginBottom: 32 }}>← Docs</Link>

      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8, fontFamily: "'Geist Mono', monospace" }}>Beginner guide</p>
        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 12 }}>What is a memecoin?</h1>
        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.65 }}>Memecoins are community-driven tokens inspired by internet culture. Their value comes entirely from community momentum and sentiment.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {[
          {
            title: "Origins: from Dogecoin to Solana",
            body: `The first memecoin was Dogecoin, created in 2013 as a joke based on the Doge meme. Despite having no serious use case, it built a massive community and eventually reached a market cap of tens of billions of dollars.\n\nThis proved a fundamental truth about crypto: community is value. A token backed by millions of engaged holders can outperform tokens backed by complex technology with no users.`,
          },
          {
            title: "Why Solana became the home of memecoins",
            body: `Solana is the dominant chain for memecoins because of its cost and speed. Launching a token costs less than $1. Sending tokens to thousands of holders costs almost nothing. Trades settle in under a second.\n\nThis low friction enabled an explosion of memecoin activity on Solana, with projects like BONK, WIF, POPCAT, and BOME reaching hundreds of millions in market cap within weeks of launching.`,
          },
          {
            title: "What makes a memecoin succeed?",
            body: `Successful memecoins share a few common traits:\n\nA memorable name and ticker — short, punchy, easy to type and share.\n\nStrong visual identity — a logo that works as a meme, a profile picture, or a sticker.\n\nCommunity-first launch — early holders who are genuinely enthusiastic and not just speculating.\n\nTransparency — vested team tokens, revoked mint authority, visible on-chain data. The crypto community is extremely good at spotting red flags.\n\nNarrative — a story that resonates, something people want to be part of.`,
          },
          {
            title: "The risks of memecoins",
            body: `Memecoins are high-risk assets. Most lose the vast majority of their value within weeks or months of launch. The market is highly competitive — thousands of new tokens launch every day on Solana.\n\nBuyers should be aware that memecoin prices can fall to zero quickly. Token Creator does not provide financial advice — this documentation is for educational purposes only.`,
          },
          {
            title: "How to launch a memecoin with Token Creator",
            body: `Token Creator provides everything you need to launch a credible memecoin on Solana:\n\n1. Create your token — name, symbol, logo, supply. All uploaded to IPFS.\n2. Set up vesting — lock your allocation to show commitment.\n3. Add liquidity — make your token tradeable on Orca.\n4. Share your token page — a public URL with live price, chart, and holder data.\n\nThe entire process takes under 10 minutes and costs less than 0.15 SOL.`,
          },
        ].map(s => (
          <div key={s.title} style={{ display: "flex", flexDirection: "column", gap: 10, padding: "20px", borderRadius: 8, background: "var(--card)", border: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}>{s.title}</h2>
            {s.body.split("\n\n").map((p, i) => <p key={i} style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.75 }}>{p}</p>)}
          </div>
        ))}

        <div style={{ padding: "24px", borderRadius: 8, background: "var(--card)", border: "1px solid var(--border)", textAlign: "center" }}>
          <p style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 8 }}>Launch your memecoin on Solana</p>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>No code. No developer. Under 10 minutes.</p>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--text)", color: "var(--bg)", borderRadius: 8, padding: "11px 24px", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>Launch your memecoin →</Link>
        </div>
      </div>
    </main>
  );
}