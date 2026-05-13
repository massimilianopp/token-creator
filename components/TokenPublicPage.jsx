"use client";

import { useState } from "react";
import Link from "next/link";
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

function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      style={{
        fontSize: 12,
        padding: "5px 12px",
        borderRadius: 6,
        background: copied ? "var(--green)" : "var(--surface)",
        border: `1px solid ${copied ? "var(--green)" : "var(--border)"}`,
        color: copied ? "white" : "var(--muted)",
        textDecoration: "none",
        cursor: "pointer",
        transition: "all 0.15s"
      }}
    >
      {copied ? "Copied!" : "Share"}
    </button>
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

  const solscanUrl = `https://solscan.io/token/${mint}`;
  const dexscreenerUrl = token.pairAddress
    ? `https://dexscreener.com/solana/${token.pairAddress}`
    : `https://dexscreener.com/solana/${mint}`;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px 80px", display: "flex", flexDirection: "column", gap: 40 }}>

        {/* Back to Explore button */}
        <Link href="/explore" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          color: "var(--text-3)",
          textDecoration: "none",
          marginBottom: 16,
        }}>
          ← Explore
        </Link>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 6 }}>
            <a href={solscanUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, padding: "5px 12px", borderRadius: 6, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)", textDecoration: "none" }}>
              Solscan ↗
            </a>
            <a href={dexscreenerUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, padding: "5px 12px", borderRadius: 6, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)", textDecoration: "none" }}>
              DEXscreener ↗
            </a>
            <ShareButton />
          </div>
          <span style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", color: "var(--dim)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {mint}
          </span>
        </div>

        {/* Jupiter Trade Button */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <a
            href={`https://jup.ag/swap/SOL-${mint}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 24px",
              background: "linear-gradient(135deg, #00D4AA 0%, #00A3FF 100%)",
              border: "none",
              borderRadius: 12,
              color: "white",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.15s",
              boxShadow: "0 2px 8px rgba(0, 212, 170, 0.3)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = "0 4px 12px rgba(0, 212, 170, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(0, 212, 170, 0.3)";
            }}
          >
            Trade on Jupiter →
          </a>
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