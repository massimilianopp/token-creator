"use client";

export default function TokenChart({ pairAddress }) {
  if (!pairAddress) {
    return (
      <div className="w-full h-[500px] bg-gray-900 rounded-xl flex items-center justify-center text-gray-500 text-sm">
        Chart non disponible — aucune paire trouvée sur DEXscreener
      </div>
    );
  }

  const src = `https://dexscreener.com/solana/${pairAddress}?embed=1&theme=dark&trades=1&info=0`;

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden border border-gray-800">
      <iframe src={src} width="100%" height="100%" frameBorder="0" allow="clipboard-write" title="DEXscreener Chart" />
    </div>
  );
}