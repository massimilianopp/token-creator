"use client";

import { useState, useEffect, useMemo } from "react";
import { PublicKey } from "@solana/web3.js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";

// ── Helpers ────────────────────────────────────────────────────────────────────

const HELIUS_MAINNET = `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`;
const HELIUS_DEVNET = `https://devnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`;

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
    if (data.result && !data.error) {
      return { data: data.result, network: "mainnet" };
    }
  } catch {}
  
  // Fallback devnet
  try {
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
    if (data.result && !data.error) {
      return { data: data.result, network: "devnet" };
    }
  } catch {}
  
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
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(uri, { signal: controller.signal });
    clearTimeout(timeout);
    return await res.json();
  } catch {
    return null;
  }
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

  useEffect(() => {
    if (!mint) return;

    async function load() {
      setState((s) => ({ ...s, loading: true, error: null }));

      try {
        const mintPubkey = new PublicKey(mint);

        // ── 1. Détecter le réseau et créer la connexion ──────────────────────
        const assetResult = await fetchAsset(mint);
        let network = "mainnet"; // par défaut
        let connection;

        if (assetResult) {
          network = assetResult.network;
        }

        const { Connection } = require("@solana/web3.js");
        const rpc = network === "mainnet" ? HELIUS_MAINNET : HELIUS_DEVNET;
        connection = new Connection(rpc, "confirmed");

        // ── 2. Métadonnées Metaplex ──────────────────────────────────────────
        let name = null, symbol = null, image = null, description = null, links = {};

        try {
          const metadataPDA = getMetadataPDA(mint);
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
        console.error("[useTokenInfo]", err);
        setState((s) => ({
          ...s,
          loading: false,
          error: err.message || "Erreur inconnue",
        }));
      }
    }

    load();
  }, [mint]);

  return state;
}
