"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey, Connection } from "@solana/web3.js";

const METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

function getMetadataPDA(mint) {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"), METADATA_PROGRAM_ID.toBuffer(), new PublicKey(mint).toBuffer()],
    METADATA_PROGRAM_ID
  );
  return pda;
}

async function fetchOffchainMeta(uri) {
  if (!uri) return null;
  let cid = null;
  if (uri.startsWith("ipfs://")) cid = uri.replace("ipfs://", "");
  else if (uri.includes("/ipfs/")) cid = uri.split("/ipfs/")[1];
  const urls = cid ? [
    `https://cloudflare-ipfs.com/ipfs/${cid}`,
    `https://ipfs.io/ipfs/${cid}`,
    `https://gateway.pinata.cloud/ipfs/${cid}`,
  ] : [uri];
  for (const url of urls) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) return await res.json();
    } catch { continue; }
  }
  return null;
}

async function processInBatches(mints, rpcConnection, batchSize = 3, delay = 500) {
  const results = [];
  for (let i = 0; i < mints.length; i += batchSize) {
    const batch = mints.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(async (m) => {
      try {
        const pda = getMetadataPDA(m.mint);
        const account = await rpcConnection.getAccountInfo(pda);
        if (!account) return { ...m, name: null, symbol: null, image: null, uri: null, isTokenCreator: false };

        const [meta] = Metadata.deserialize(account.data);
        const name = meta.data.name.replace(/\0/g, "").trim();
        const symbol = meta.data.symbol.replace(/\0/g, "").trim();
        const uri = meta.data.uri.replace(/\0/g, "").trim();

        const offchain = await fetchOffchainMeta(uri);
        const image = offchain?.image || null;
        const isTokenCreator = uri.includes("pinata") || uri.includes("ipfs");

        return { ...m, name, symbol, image, uri, isTokenCreator };
      } catch {
        return { ...m, name: null, symbol: null, image: null, uri: null, isTokenCreator: false };
      }
    }));
    results.push(...batchResults);
    if (i + batchSize < mints.length) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return results;
}

export function useDashboard() {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(true);
  const [tokenCreatorTokens, setTokenCreatorTokens] = useState([]);
  const [otherTokens, setOtherTokens] = useState([]);

  const load = useCallback(async () => {
    if (!publicKey) return;
    setLoading(true);

    const rpcEndpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT;

    try {
      // 1. Récupérer tous les token accounts
      const res = await fetch(rpcEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0", id: 1,
          method: "getTokenAccountsByOwner",
          params: [
            publicKey.toBase58(),
            { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
            { encoding: "jsonParsed" }
          ]
        })
      });
      const data = await res.json();
      const accounts = data.result?.value || [];

      const mints = accounts
        .filter(a => a.account.data.parsed.info.tokenAmount.uiAmount > 0)
        .map(a => ({
          mint: a.account.data.parsed.info.mint,
          balance: a.account.data.parsed.info.tokenAmount.uiAmount,
          decimals: a.account.data.parsed.info.tokenAmount.decimals,
        }));

      if (!mints.length) { setLoading(false); return; }

      // 2. Fetch métadonnées par batch
      const rpcConnection = new Connection(rpcEndpoint, "confirmed");
      const results = await processInBatches(mints, rpcConnection);

      const tc = results.filter(t => t.isTokenCreator && t.name);
      const other = results.filter(t => !t.isTokenCreator && t.symbol);

      setTokenCreatorTokens(tc);
      setOtherTokens(other);
    } catch (err) {
      console.error("[useDashboard]", err);
    }

    setLoading(false);
  }, [publicKey]);

  useEffect(() => { load(); }, [load]);

  return { loading, tokenCreatorTokens, otherTokens, reload: load };
}