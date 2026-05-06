"use client";

export default function TokenChart({ pairAddress }) {
  if (!pairAddress) {
    return (
      <div style={{ width: "100%", height: 400, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: 13, color: "var(--dim)" }}>No trading pair found on DEXscreener</p>
      </div>
    );
  }

  const src = `https://dexscreener.com/solana/${pairAddress}?embed=1&theme=dark&trades=1&info=0`;

  return (
    <div style={{ width: "100%", height: 400, borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
      <iframe src={src} width="100%" height="100%" frameBorder="0" allow="clipboard-write" title="DEXscreener Chart" />
    </div>
  );
}