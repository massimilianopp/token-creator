import {
  WhirlpoolContext,
  buildWhirlpoolClient,
  WhirlpoolAccountFetcher,
  DEFAULT_WHIRLPOOL_RETENTION_POLICY,
  ORCA_WHIRLPOOL_PROGRAM_ID,
  PriceMath,
  TickUtil,
  MIN_TICK_INDEX,
  MAX_TICK_INDEX,
} from "@orca-so/whirlpools-sdk";
import { SimpleAccountFetcher } from "@orca-so/common-sdk";
import { AnchorProvider } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import Decimal from "decimal.js";

// ── Constantes devnet ──────────────────────────────────────────────────────────

export const TICK_SPACING = 64;

export const WSOL_MINT = new PublicKey(
  "So11111111111111111111111111111111111111112"
);

export const USDC_MINT = new PublicKey(
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
);

export const WHIRLPOOLS_CONFIG_DEVNET = new PublicKey(
  "FcrweFY1G9HJAHG5inkGB6pKg1HZ6x9UC2WioAfWrGkR"
);
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes

// ── Client Orca ────────────────────────────────────────────────────────────────

export function createWhirlpoolClient(connection, wallet) {
  const stableWallet = {
    publicKey: wallet.publicKey,
    signTransaction: (tx) => wallet.signTransaction(tx),
    signAllTransactions: (txs) => wallet.signAllTransactions(txs),
  };

  const provider = new AnchorProvider(connection, stableWallet, { commitment: "confirmed" });
  const fetcher = new WhirlpoolAccountFetcher(
    connection,
    new SimpleAccountFetcher(connection, DEFAULT_WHIRLPOOL_RETENTION_POLICY)
  );
  const ctx = WhirlpoolContext.withProvider(provider, fetcher, ORCA_WHIRLPOOL_PROGRAM_ID);
  const client = buildWhirlpoolClient(ctx);

  return { client, stableWallet }; // ← retourne les deux
}

// ── Ticks full range ───────────────────────────────────────────────────────────

export function getFullRangeTicks(tickSpacing = TICK_SPACING) {
  // Taille d'un tick array : 88 ticks
  const TICK_ARRAY_SIZE = 88;
  const tickArrayRange = TICK_ARRAY_SIZE * tickSpacing; // 88 * 64 = 5632

  // On utilise directement les start indexes de tick arrays valides
  // comme tickLower/tickUpper — ils sont toujours multiples de tickSpacing
  // et leurs tick arrays existent forcément dans les bornes
  const tickLower = Math.ceil(MIN_TICK_INDEX / tickArrayRange) * tickArrayRange;  // -439296
  const tickUpper = Math.floor(MAX_TICK_INDEX / tickArrayRange) * tickArrayRange; // 439296

  console.log("[getFullRangeTicks] tickLower:", tickLower, "tickUpper:", tickUpper);

  return { tickLower, tickUpper };
}

// ── Prix → sqrtPrice ───────────────────────────────────────────────────────────

export function priceToSqrtPriceX64(price, decimalsA, decimalsB, tickSpacing = TICK_SPACING) {
  const sqrtPrice = PriceMath.priceToSqrtPriceX64(
    new Decimal(price.toString()),
    decimalsA,
    decimalsB
  );

  const rawTick = PriceMath.sqrtPriceX64ToTickIndex(sqrtPrice);

  const alignedTick =
    rawTick >= 0
      ? Math.floor(rawTick / tickSpacing) * tickSpacing
      : Math.ceil(rawTick / tickSpacing) * tickSpacing;

  return PriceMath.tickIndexToSqrtPriceX64(alignedTick);
}

// ── Ordre des mints ────────────────────────────────────────────────────────────

export function orderMints(mintX, mintY) {
  const a = mintX.toBuffer();
  const b = mintY.toBuffer();
  const inverted = Buffer.compare(a, b) > 0;
  return {
    mintA: inverted ? mintY : mintX,
    mintB: inverted ? mintX : mintY,
    inverted,
  };
}

export { ORCA_WHIRLPOOL_PROGRAM_ID } from "@orca-so/whirlpools-sdk";