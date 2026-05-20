"use client";

import { useState, useEffect, useMemo } from "react";
import { PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";

// ── Helpers ────────────────────────────────────────────────────────────────────

function getMetadataPDA(mint) {
  const METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      METADATA_PROGRAM_ID.toBuffer(),
      new PublicKey(mint).toBuffer(),
    ],
    METADATA_PROGRAM_ID
  );
  return pda;
}

async function fetchAsset(mint) {
  const apiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
  console.log("[fetchAsset] apiKey:", apiKey ? "present" : "MISSING");
  console.log("[fetchAsset] trying mainnet for mint:", mint);
  
  if (!apiKey) {
    console.log("[fetchAsset] No API key, skipping Helius");
    return null;
  }

  const HELIUS_MAINNET = `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;
  const HELIUS_DEVNET = `https://devnet.helius-rpc.com/?api-key=${apiKey}`;
  
  // Essayer mainnet d'abord
  try {
    const res = await fetch(HELIUS_MAINNET, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0", id: 1,
        method: "getAsset",
        params: { id: mint }
      })
    });
    const data = await res.json();
    console.log("[fetchAsset] mainnet response:", data);
    if (data.result && !data.error) {
      return { data: data.result, network: "mainnet" };
    }
  } catch (e) {
    console.log("[fetchAsset] mainnet error:", e.message);
  }
  
  // Fallback devnet
  try {
    console.log("[fetchAsset] trying devnet");
    const res = await fetch(HELIUS_DEVNET, {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0", id: 1,
        method: "getAsset",
        params: { id: mint }
      })
    });
    const data = await res.json();
    console.log("[fetchAsset] devnet response:", data);
    if (data.result && !data.error) {
      return { data: data.result, network: "devnet" };
    }
  } catch (e) {
    console.log("[fetchAsset] devnet error:", e.message);
  }
  
  console.log("[fetchAsset] No result from Helius");
  return null;
}

async function fetchDexscreener(mint) {
  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${mint}`
    );
    const data = await res.json();
    const pairs = data?.pairs?.filter((p) => p.chainId === "solana") || [];
    // Prendre la paire avec le plus de liquidité
    const best = pairs.sort(
      (a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
    )[0];
    return best || null;
  } catch {
    return null;
  }
}

async function fetchOffchainMetadata(uri) {
  if (!uri) return null;

  // Normalize URI — extract CID from any IPFS format
  let cid = null;
  if (uri.startsWith("ipfs://")) {
    cid = uri.replace("ipfs://", "");
  } else if (uri.includes("/ipfs/")) {
    cid = uri.split("/ipfs/")[1];
  }

  // Try multiple gateways in order
  const urls = cid ? [
    `https://cloudflare-ipfs.com/ipfs/${cid}`,
    `https://ipfs.io/ipfs/${cid}`,
    `https://gateway.pinata.cloud/ipfs/${cid}`,
    `https://dweb.link/ipfs/${cid}`,
  ] : [uri];

  for (const url of urls) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch {
      continue;
    }
  }

  return null;
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useTokenInfo(mint) {
  const [state, setState] = useState({
    loading: true,
    error: null,
    // Métadonnées onchain
    name: null,
    symbol: null,
    image: null,
    description: null,
    links: {}, // { website, twitter, telegram, discord }
    // Supply
    supply: null,
    decimals: null,
    // Prix / marché
    price: null,
    priceChange24h: null,
    marketCap: null,
    volume24h: null,
    liquidity: null,
    pairAddress: null,
    // Holders
    topHolders: [],
    // Réseau détecté
    network: null,
  });

  const connection = useMemo(() => {
    const apiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
    const rpcUrl = apiKey 
      ? `https://mainnet.helius-rpc.com/?api-key=${apiKey}`
      : clusterApiUrl("mainnet-beta");
    
    console.log("[useTokenInfo] connection using:", apiKey ? "Helius" : "public RPC");
    return new Connection(rpcUrl, "confirmed");
  }, []);

  useEffect(() => {
    if (!mint) {
      console.log("[useTokenInfo] No mint provided");
      return;
    }
    
    async function load() {
      console.log("[useTokenInfo] load() called for:", mint);
      try {
        setState((s) => ({ ...s, loading: true, error: null }));
        console.log("[useTokenInfo] 1. Starting load for mint:", mint);

        const mintPubkey = new PublicKey(mint);

        // ── 1. Détecter le réseau ──────────────────────
        const assetResult = await fetchAsset(mint);
        console.log("[useTokenInfo] 2. fetchAsset result:", assetResult);
        let network = "mainnet"; // par défaut

        if (assetResult) {
          network = assetResult.network;
        }

        // ── 2. Métadonnées Metaplex ──────────────────────────────────────────
        let name = null, symbol = null, image = null, description = null, links = {};

        try {
          const metadataPDA = getMetadataPDA(mint);
          console.log("[useTokenInfo] 3. metadata PDA:", metadataPDA?.toBase58());
          const metadataAccount = await connection.getAccountInfo(metadataPDA);

          if (metadataAccount) {
            const [metadata] = Metadata.deserialize(metadataAccount.data);
            name = metadata.data.name.replace(/\0/g, "").trim();
            symbol = metadata.data.symbol.replace(/\0/g, "").trim();
            const uri = metadata.data.uri.replace(/\0/g, "").trim();

            if (uri) {
              const offchain = await fetchOffchainMetadata(uri);
              if (offchain) {
                image = offchain.image || null;
                description = offchain.description || null;
                // Liens sociaux standards
                links = {
                  website: offchain.external_url || offchain.website || null,
                  twitter: offchain.twitter || offchain.extensions?.twitter || null,
                  telegram: offchain.telegram || offchain.extensions?.telegram || null,
                  discord: offchain.discord || offchain.extensions?.discord || null,
                };
              }
            }
          }
        } catch (e) {
          console.warn("[useTokenInfo] metadata error:", e.message);
        }

        // ── 3. Supply + décimales ────────────────────────────────────────────
        let supply = null, decimals = null;

        try {
          const supplyInfo = await connection.getTokenSupply(mintPubkey);
          supply = supplyInfo.value.uiAmount;
          decimals = supplyInfo.value.decimals;
        } catch (e) {
          console.warn("[useTokenInfo] supply error:", e.message);
        }
        console.log("[useTokenInfo] 4. supply:", supply);

        // ── 4. Top holders ───────────────────────────────────────────────────
        let topHolders = [];

        try {
          const largest = await connection.getTokenLargestAccounts(mintPubkey);
          topHolders = largest.value.slice(0, 10).map((h) => ({
            address: h.address.toBase58(),
            amount: h.uiAmount,
            pct: supply ? ((h.uiAmount / supply) * 100).toFixed(2) : null,
          }));
        } catch (e) {
          console.warn("[useTokenInfo] holders error:", e.message);
        }
        console.log("[useTokenInfo] 5. holders count:", topHolders.length);

        // ── 5. DEXscreener ───────────────────────────────────────────────────
        let price = null, priceChange24h = null, marketCap = null;
        let volume24h = null, liquidity = null, pairAddress = null;

        const pair = await fetchDexscreener(mint);
        if (pair) {
          price = parseFloat(pair.priceUsd) || null;
          priceChange24h = pair.priceChange?.h24 || null;
          marketCap = pair.marketCap || pair.fdv || null;
          volume24h = pair.volume?.h24 || null;
          liquidity = pair.liquidity?.usd || null;
          pairAddress = pair.pairAddress || null;
        }
        console.log("[useTokenInfo] 6. dexscreener pair:", pair?.pairAddress);

        console.log("[useTokenInfo] 7. Done — setting state");
        setState({
          loading: false,
          error: null,
          name, symbol, image, description, links,
          supply, decimals,
          price, priceChange24h, marketCap, volume24h, liquidity, pairAddress,
          topHolders,
          network,
        });
      } catch (err) {
        console.error("[useTokenInfo] FATAL ERROR:", err);
        console.error("[useTokenInfo] Error stack:", err.stack);
        setState(s => ({ ...s, loading: false, error: err.message }));
      }
    }
    
    load().catch(err => {
      console.error("[useTokenInfo] Unhandled promise rejection:", err);
      setState(s => ({ ...s, loading: false, error: err.message }));
    });
    
  }, [mint]);

  return state;
}
