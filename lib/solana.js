import { Connection, clusterApiUrl } from "@solana/web3.js";

export const NETWORK = "devnet"; // à changer en "mainnet-beta" pour la prod

export const connection = new Connection(
  process.env.NEXT_PUBLIC_RPC_ENDPOINT || clusterApiUrl(NETWORK),
  "confirmed"
);
