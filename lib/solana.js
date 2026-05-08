import { Connection, clusterApiUrl } from "@solana/web3.js";

export function createConnection(network = "devnet") {
  const endpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT || clusterApiUrl(network);
  return new Connection(endpoint, "confirmed");
}

