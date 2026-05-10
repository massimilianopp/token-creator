"use client";

function fmt(n, prefix = "") {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${prefix}${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${prefix}${(n / 1_000).toFixed(2)}K`;
  return `${prefix}${n.toFixed(2)}`;
}

function StatCard({ label, value }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px" }}>
      <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{value ?? "—"}</div>
    </div>
  );
}

function SocialLink({ href, label }) {
  if (!href) return null;
  const url = href.startsWith("http") ? href : `https://${href}`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, padding: "5px 12px", borderRadius: 6, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)", textDecoration: "none", transition: "all 0.15s" }}>
      {label}
    </a>
  );
}

export default function TokenMeta({ name, symbol, image, description, links, supply, decimals, price, priceChange24h, marketCap, volume24h, liquidity, topHolders }) {
  const priceUp = priceChange24h != null && priceChange24h >= 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {image && (
          <img src={image} alt={name} style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border)" }} />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)" }}>{name ?? "—"}</h1>
            <span style={{ fontSize: 13, color: "var(--muted)", fontFamily: "'Geist Mono', monospace" }}>{symbol}</span>
          </div>
          {description && (
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, marginBottom: 8 }}>{description}</p>
          )}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <SocialLink href={links?.website} label="Website" />
            <SocialLink href={links?.twitter} label="Twitter" />
            <SocialLink href={links?.telegram} label="Telegram" />
            <SocialLink href={links?.discord} label="Discord" />
          </div>
        </div>
      </div>

      {/* Price */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <span style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Geist Mono', monospace", color: "var(--text)" }}>
          {price != null ? `$${price.toFixed(6)}` : "—"}
        </span>
        {priceChange24h != null && (
          <span style={{ fontSize: 13, fontWeight: 500, color: priceUp ? "var(--green)" : "var(--red)" }}>
            {priceUp ? "+" : ""}{priceChange24h.toFixed(2)}%
          </span>
        )}
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <StatCard label="Market cap" value={fmt(marketCap, "$")} />
        <StatCard label="Volume 24h" value={fmt(volume24h, "$")} />
        <StatCard label="Liquidity" value={fmt(liquidity, "$")} />
        <StatCard label="Supply" value={fmt(supply)} />
      </div>

      {/* Top holders */}
      {topHolders?.length > 0 && (
        <div>
          <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 12, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>Top Holders</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {topHolders.map((h, i) => (
              <div key={h.address} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", borderRadius: 8, background: "var(--surface)", border: "1px solid var(--border)" }}>
                <span style={{ fontSize: 11, color: "var(--dim)", fontFamily: "'Geist Mono', monospace", width: 16 }}>{i + 1}</span>
                <span style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", color: "var(--muted)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.address.slice(0, 4)}...{h.address.slice(-4)}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", flexShrink: 0 }}>{h.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}