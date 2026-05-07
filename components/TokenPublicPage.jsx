"use client";

import { useTokenInfo } from "@/hooks/useTokenInfo";
import { useVestingInfo } from "@/hooks/useVestingInfo";
import TokenChart from "@/components/TokenChart";
import TokenMeta from "@/components/TokenMeta";
import TokenVestingInfo from "@/components/TokenVestingInfo";

function Section({ title, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)" }}>{title}</p>
      {children}
    </div>
  );
}

export default function TokenPublicPage({ mint }) {
  const token = useTokenInfo(mint);
  const vesting = useVestingInfo(mint);

  if (token.loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: 13, color: "var(--muted)" }}>Loading...</p>
      </div>
    );
  }

  if (token.error) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: 13, color: "var(--red)" }}>Error: {token.error}</p>
      </div>
    );
  }

  const solscanUrl = `https://solscan.io/token/${mint}?cluster=devnet`;
  const dexscreenerUrl = token.pairAddress
    ? `https://dexscreener.com/solana/${token.pairAddress}?cluster=devnet`
    : `https://dexscreener.com/solana/${mint}?cluster=devnet`;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px 80px", display: "flex", flexDirection: "column", gap: 40 }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 6 }}>
            <a href={solscanUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, padding: "5px 12px", borderRadius: 6, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)", textDecoration: "none" }}>
              Solscan ↗
            </a>
            <a href={dexscreenerUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, padding: "5px 12px", borderRadius: 6, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)", textDecoration: "none" }}>
              DEXscreener ↗
            </a>
          </div>
          <span style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", color: "var(--dim)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {mint}
          </span>
        </div>

        {/* Meta */}
        <TokenMeta
          name={token.name}
          symbol={token.symbol}
          image={token.image}
          description={token.description}
          links={token.links}
          supply={token.supply}
          decimals={token.decimals}
          price={token.price}
          priceChange24h={token.priceChange24h}
          marketCap={token.marketCap}
          volume24h={token.volume24h}
          liquidity={token.liquidity}
          topHolders={token.topHolders}
        />

        {/* Chart */}
        <Section title="Chart">
          <TokenChart pairAddress={token.pairAddress} />
        </Section>

        {/* Vesting */}
        <Section title="Vesting">
          <TokenVestingInfo
            streams={vesting.streams}
            totalLocked={vesting.totalLocked}
            totalUnlocked={vesting.totalUnlocked}
            loading={vesting.loading}
          />
        </Section>

      </div>
    </div>
  );
}