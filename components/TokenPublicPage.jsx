"use client";

import { useTokenInfo } from "@/hooks/useTokenInfo";
import { useVestingInfo } from "@/hooks/useVestingInfo";
import TokenChart from "@/components/TokenChart";
import TokenMeta from "@/components/TokenMeta";
import TokenVestingInfo from "@/components/TokenVestingInfo";

export default function TokenPublicPage({ mint }) {
  const token = useTokenInfo(mint);
  const vesting = useVestingInfo(mint);

  if (token.loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400 text-sm animate-pulse">
          Loading token...
        </div>
      </div>
    );
  }

  if (token.error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-red-400 text-sm">
          Error: {token.error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-8">

        {/* External links */}
        <div className="flex gap-3 text-xs">
          {(() => {
            const solscanUrl = `https://solscan.io/token/${mint}`;
            const dexscreenerUrl = token.pairAddress
              ? `https://dexscreener.com/solana/${token.pairAddress}`
              : `https://dexscreener.com/solana/${mint}`;
            return (
              <>
                <a href={solscanUrl} target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-full transition">
                  Solscan ↗
                </a>
                <a href={dexscreenerUrl} target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-full transition">
                  DEXscreener ↗
                </a>
                <span className="font-mono text-gray-600 text-xs self-center truncate max-w-[200px]">
                  {mint}
                </span>
              </>
            );
          })()}
        </div>

        {/* Metadata + stats */}
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

        {/* DEXscreener Chart */}
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
            Chart
          </h2>
          <TokenChart pairAddress={token.pairAddress} />
        </div>

        {/* Vesting */}
        <TokenVestingInfo
          streams={vesting.streams}
          totalLocked={vesting.totalLocked}
          totalUnlocked={vesting.totalUnlocked}
          loading={vesting.loading}
        />

      </div>
    </div>
  );
}