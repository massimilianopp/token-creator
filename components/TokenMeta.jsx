"use client";

function StatCard({ label, value }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 flex flex-col gap-1">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-white">{value ?? "—"}</span>
    </div>
  );
}

function SocialLink({ href, label }) {
  if (!href) return null;
  const url = href.startsWith("http") ? href : `https://${href}`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-full transition">
      {label}
    </a>
  );
}

function fmt(n, prefix = "") {
  if (n == null) return null;
  if (n >= 1_000_000) return `${prefix}${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${prefix}${(n / 1_000).toFixed(2)}K`;
  return `${prefix}${n.toFixed(2)}`;
}

export default function TokenMeta({
  name, symbol, image, description, links,
  supply, decimals,
  price, priceChange24h, marketCap, volume24h, liquidity,
  topHolders,
}) {
  const priceChangeColor =
    priceChange24h == null
      ? "text-gray-400"
      : priceChange24h >= 0
      ? "text-green-400"
      : "text-red-400";

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        {image && (
          <img src={image} alt={name} className="w-16 h-16 rounded-full object-cover border border-gray-700" />
        )}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-white">
            {name ?? "—"}{" "}
            <span className="text-gray-400 text-lg font-normal">{symbol ?? ""}</span>
          </h1>
          {description && (
            <p className="text-sm text-gray-400 max-w-xl">{description}</p>
          )}
          <div className="flex gap-2 mt-1 flex-wrap">
            <SocialLink href={links?.website} label="🌐 Website" />
            <SocialLink href={links?.twitter} label="🐦 Twitter" />
            <SocialLink href={links?.telegram} label="✈️ Telegram" />
            <SocialLink href={links?.discord} label="💬 Discord" />
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-4">
        <span className="text-3xl font-bold text-white">
          {price != null ? `$${price.toFixed(6)}` : "Price unavailable"}
        </span>
        {priceChange24h != null && (
          <span className={`text-sm font-semibold ${priceChangeColor}`}>
            {priceChange24h >= 0 ? "▲" : "▼"} {Math.abs(priceChange24h).toFixed(2)}% (24h)
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Market Cap" value={fmt(marketCap, "$")} />
        <StatCard label="Volume 24h" value={fmt(volume24h, "$")} />
        <StatCard label="Liquidity" value={fmt(liquidity, "$")} />
        <StatCard label="Supply" value={fmt(supply)} />
        <StatCard label="Decimals" value={decimals} />
      </div>

      {/* Top Holders */}
      {topHolders?.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
            Top Holders
          </h2>
          <div className="flex flex-col gap-1">
            {topHolders.map((h, i) => (
              <div key={h.address} className="flex items-center justify-between text-xs bg-gray-900 rounded-lg px-3 py-2">
                <span className="text-gray-500 w-5">{i + 1}</span>
                <span className="font-mono text-gray-300 flex-1 mx-2 truncate">{h.address}</span>
                <span className="text-white font-semibold">{h.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}