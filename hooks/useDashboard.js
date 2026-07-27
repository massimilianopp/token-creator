"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
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

export function useDashboard() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(true);
  const [tokenCreatorTokens, setTokenCreatorTokens] = useState([]);
  const [otherTokens, setOtherTokens] = useState([]);

  const load = useCallback(async () => {
    if (!publicKey) return;
    setLoading(true);

    try {
      // 1. Tous les token accounts du wallet
      // Utiliser le RPC public pour getParsedTokenAccountsByOwner
        const publicConnection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

        const accounts = await publicConnection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") }
        );

      const mints = accounts.value
        .filter(a => a.account.data.parsed.info.tokenAmount.uiAmount > 0)
        .map(a => ({
          mint: a.account.data.parsed.info.mint,
          balance: a.account.data.parsed.info.tokenAmount.uiAmount,
          decimals: a.account.data.parsed.info.tokenAmount.decimals,
        }));

      if (!mints.length) { setLoading(false); return; }

      // 2. Fetch métadonnées Metaplex pour chaque mint en parallèle
      const results = await Promise.all(mints.map(async (m) => {
        try {
          const pda = getMetadataPDA(m.mint);
          const account = await connection.getAccountInfo(pda);
          if (!account) return { ...m, name: null, symbol: null, image: null, uri: null, isTokenCreator: false };

          const [meta] = Metadata.deserialize(account.data);
          const name = meta.data.name.replace(/\0/g, "").trim();
          const symbol = meta.data.symbol.replace(/\0/g, "").trim();
          const uri = meta.data.uri.replace(/\0/g, "").trim();

          // Fetch image depuis IPFS
          const offchain = await fetchOffchainMeta(uri);
          const image = offchain?.image || null;

          // Token Creator = URI pointe vers IPFS/Pinata
          const isTokenCreator = uri.includes("pinata") || uri.includes("ipfs");

          return { ...m, name, symbol, image, uri, isTokenCreator };
        } catch {
          return { ...m, name: null, symbol: null, image: null, uri: null, isTokenCreator: false };
        }
      }));

      const tc = results.filter(t => t.isTokenCreator && t.name);
      const other = results.filter(t => !t.isTokenCreator && t.symbol);

      setTokenCreatorTokens(tc);
      setOtherTokens(other);
    } catch (err) {
      console.error("[useDashboard]", err);
    }

    setLoading(false);
  }, [publicKey, connection]);

  useEffect(() => { load(); }, [load]);

  return { loading, tokenCreatorTokens, otherTokens, reload: load };
}