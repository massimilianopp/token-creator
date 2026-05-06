"use client";

import { useState, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Keypair } from "@solana/web3.js";
import {
  PDAUtil,
  increaseLiquidityQuoteByInputTokenWithParams,
  NO_TOKEN_EXTENSION_CONTEXT,
} from "@orca-so/whirlpools-sdk";
import { Percentage, TransactionBuilder } from "@orca-so/common-sdk";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import Decimal from "decimal.js";
import BN from "bn.js";

import {
  createWhirlpoolClient,
  getFullRangeTicks,
  orderMints,
  TICK_SPACING,
  WSOL_MINT,
  USDC_MINT,
  WHIRLPOOLS_CONFIG_MAINNET,
  ORCA_WHIRLPOOL_PROGRAM_ID,
} from "@/lib/whirlpool";

const FEE_WALLET = new PublicKey("6UYpXsYihabr4LPcamqqbBKxock41AsFH12zcGPviWkY");
const POOL_FEE_PCT = 0.001; // 0.1%

export function useWhirlpool() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [status, setStatus] = useState("idle");
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const log = (msg) => setLogs((prev) => [...prev, msg]);

  const createPool = useCallback(
    async ({
      tokenMint,
      tokenDecimals,
      pairedWith,
      initialPrice,
      amountToken,
      amountPaired,
    }) => {
      if (!wallet.publicKey) throw new Error("Wallet not connected");
      const ownerPubkey = wallet.publicKey;

      setStatus("loading");
      setLogs([]);
      setError(null);
      setResult(null);

      try {
        // 1. Orca Client
        log("Initializing Orca client...");
        const { client, stableWallet } = createWhirlpoolClient(connection, wallet);

        // 2. Resolve mints
        const userMint = new PublicKey(tokenMint);
        const pairedMint = pairedWith === "SOL" ? WSOL_MINT : USDC_MINT;
        const pairedDecimals = pairedWith === "SOL" ? 9 : 6;

        // 3. Mandatory order mintA < mintB
        const { mintA, mintB, inverted } = orderMints(userMint, pairedMint);
        const decimalsA = inverted ? pairedDecimals : tokenDecimals;
        const decimalsB = inverted ? tokenDecimals : pairedDecimals;

        log(`Mint order: ${inverted ? "inverted" : "nominal"}`);

        // 4. Pool PDA Address
        const poolPDA = PDAUtil.getWhirlpool(
          ORCA_WHIRLPOOL_PROGRAM_ID,
          WHIRLPOOLS_CONFIG_MAINNET,
          mintA,
          mintB,
          TICK_SPACING
        );
        log(`Pool address: ${poolPDA.publicKey.toBase58()}`);

        // 5. Check pool existence
        log("Checking pool...");
        const poolAccountInfo = await connection.getAccountInfo(poolPDA.publicKey);

        let pool;
        if (poolAccountInfo !== null) {
          log("Existing pool found ✓");
          pool = await client.getPool(poolPDA.publicKey);
        } else {
          log("Pool not found, initializing...");

          const priceForSdk = inverted
            ? new Decimal(1).div(new Decimal(initialPrice))
            : new Decimal(initialPrice);

          const { poolKey, tx: initTx } = await client.createPool(
            WHIRLPOOLS_CONFIG_MAINNET,
            mintA,
            mintB,
            TICK_SPACING,
            priceForSdk,
            ownerPubkey
          );

          const initSig = await initTx.buildAndExecute();
          log(`Pool initialized ✓ — tx: ${initSig}`);
          pool = await client.getPool(poolKey);
        }

        // 6. Full range ticks
        const { tickLower, tickUpper } = getFullRangeTicks(TICK_SPACING);

        // 7. Calculate liquidity quote
        const inputAmount = inverted
          ? new BN(Math.floor(amountPaired * 10 ** pairedDecimals))
          : new BN(Math.floor(amountToken * 10 ** tokenDecimals));

        const poolData = pool.getData();

        const quote = increaseLiquidityQuoteByInputTokenWithParams({
          inputTokenMint: mintA,
          inputTokenAmount: inputAmount,
          tokenMintA: poolData.tokenMintA,
          tokenMintB: poolData.tokenMintB,
          sqrtPrice: poolData.sqrtPrice,
          tickCurrentIndex: poolData.tickCurrentIndex,
          tickLowerIndex: tickLower,
          tickUpperIndex: tickUpper,
          tokenExtensionCtx: NO_TOKEN_EXTENSION_CONTEXT,
          slippageTolerance: Percentage.fromFraction(1, 100),
        });

        log("Quote calculated ✓");

        // 7b. Initialize tick arrays
        log("Initializing tick arrays...");
        const { TickUtil, WhirlpoolIx } = await import("@orca-so/whirlpools-sdk");

        const currentTick = poolData.tickCurrentIndex;
        const startLower = TickUtil.getStartTickIndex(tickLower, TICK_SPACING);
        const startUpper = TickUtil.getStartTickIndex(tickUpper, TICK_SPACING);
        const startCurrent = TickUtil.getStartTickIndex(currentTick, TICK_SPACING);

        const startIndexes = [...new Set([startLower, startCurrent, startUpper])];

        for (const startIndex of startIndexes) {
          const tickArrayPDA = PDAUtil.getTickArray(
            ORCA_WHIRLPOOL_PROGRAM_ID,
            poolPDA.publicKey,
            startIndex
          );
          const tickArrayAccount = await connection.getAccountInfo(tickArrayPDA.publicKey, "confirmed");

          if (tickArrayAccount === null) {
            log(`Initializing tick array ${startIndex}...`);
            const initIx = WhirlpoolIx.initTickArrayIx(client.getContext().program, {
              startTick: startIndex,
              tickArrayPda: tickArrayPDA,
              whirlpool: poolPDA.publicKey,
              funder: ownerPubkey,
            });
            const tb = new TransactionBuilder(connection, stableWallet);
            tb.addInstruction(initIx);
            const sig = await tb.buildAndExecute();
            await connection.confirmTransaction(sig, "confirmed");
            log(`Tick array ${startIndex} confirmed ✓ — tx: ${sig}`);
          } else {
            log(`Tick array ${startIndex} exists ✓`);
          }
        }

        // 8. Open position
        log("Opening full range position...");

        const positionMintKeypair = Keypair.generate();
        const positionPDA = PDAUtil.getPosition(
          ORCA_WHIRLPOOL_PROGRAM_ID,
          positionMintKeypair.publicKey
        );

        const positionTokenAccount = getAssociatedTokenAddressSync(
          positionMintKeypair.publicKey,
          ownerPubkey
        );
        const tokenOwnerAccountA = getAssociatedTokenAddressSync(
          poolData.tokenMintA,
          ownerPubkey
        );
        const tokenOwnerAccountB = getAssociatedTokenAddressSync(
          poolData.tokenMintB,
          ownerPubkey
        );

        const tickArrayLowerPDA = PDAUtil.getTickArray(ORCA_WHIRLPOOL_PROGRAM_ID, poolPDA.publicKey, startLower);
        const tickArrayUpperPDA = PDAUtil.getTickArray(ORCA_WHIRLPOOL_PROGRAM_ID, poolPDA.publicKey, startUpper);

        const {
          createAssociatedTokenAccountIdempotentInstruction,
          createSyncNativeInstruction,
          createTransferInstruction,
          getAccount,
          NATIVE_MINT,
        } = await import("@solana/spl-token");
        const { SystemProgram } = await import("@solana/web3.js");

        // Missing ATAs
        const ataInstructions = [];
        for (const [mint, ata] of [
          [poolData.tokenMintA, tokenOwnerAccountA],
          [poolData.tokenMintB, tokenOwnerAccountB],
        ]) {
          try {
            await getAccount(connection, ata);
          } catch {
            ataInstructions.push(
              createAssociatedTokenAccountIdempotentInstruction(ownerPubkey, ata, ownerPubkey, mint)
            );
          }

          if (mint.equals(NATIVE_MINT)) {
            const wsolAmount = quote.tokenMaxA;
            ataInstructions.push({
              instructions: [
                SystemProgram.transfer({
                  fromPubkey: ownerPubkey,
                  toPubkey: ata,
                  lamports: BigInt(wsolAmount.toString()),
                }),
                createSyncNativeInstruction(ata),
              ],
              cleanupInstructions: [],
              signers: [],
            });
          }
        }

        const openPositionIx = WhirlpoolIx.openPositionIx(client.getContext().program, {
          funder: ownerPubkey,
          owner: ownerPubkey,
          positionPda: positionPDA,
          positionMintAddress: positionMintKeypair.publicKey,
          positionTokenAccount,
          whirlpool: poolPDA.publicKey,
          tickLowerIndex: tickLower,
          tickUpperIndex: tickUpper,
        });

        const increaseLiqIx = WhirlpoolIx.increaseLiquidityIx(client.getContext().program, {
          liquidityAmount: quote.liquidityAmount,
          tokenMaxA: quote.tokenMaxA,
          tokenMaxB: quote.tokenMaxB,
          whirlpool: poolPDA.publicKey,
          positionAuthority: ownerPubkey,
          position: positionPDA.publicKey,
          positionTokenAccount,
          tokenOwnerAccountA,
          tokenOwnerAccountB,
          tokenVaultA: poolData.tokenVaultA,
          tokenVaultB: poolData.tokenVaultB,
          tickArrayLower: tickArrayLowerPDA.publicKey,
          tickArrayUpper: tickArrayUpperPDA.publicKey,
        });

        // Construction of final tx
        const txBuilder = new TransactionBuilder(connection, stableWallet);
        
        // ATAs + position + liquidity
        for (const ix of ataInstructions) {
          if (ix.instructions) {
            txBuilder.addInstruction(ix);
          } else {
            txBuilder.addInstruction({ instructions: [ix], cleanupInstructions: [], signers: [] });
          }
        }
        
        // 0.5% fee on tokenA
        const feeAmountRaw = Math.floor(inputAmount.toNumber() * POOL_FEE_PCT);
        if (feeAmountRaw > 0) {
          const feeWalletATA = getAssociatedTokenAddressSync(poolData.tokenMintA, FEE_WALLET);
          txBuilder.addInstruction({
            instructions: [
              createAssociatedTokenAccountIdempotentInstruction(ownerPubkey, feeWalletATA, FEE_WALLET, poolData.tokenMintA),
              createTransferInstruction(tokenOwnerAccountA, feeWalletATA, ownerPubkey, feeAmountRaw),
            ],
            cleanupInstructions: [],
            signers: [],
          });
          log(`Pool fee: ${feeAmountRaw} raw units → service wallet`);
        }

        
        txBuilder.addInstruction(openPositionIx);
        txBuilder.addInstruction(increaseLiqIx);
        txBuilder.addSigner(positionMintKeypair);

        const positionSig = await txBuilder.buildAndExecute();
        log(`Position opened ✓ — tx: ${positionSig}`);

        const positionMint = positionMintKeypair.publicKey.toBase58();
        log(`Position NFT mint: ${positionMint}`);

        setResult({
          poolAddress: poolPDA.publicKey.toBase58(),
          positionMint,
          txSignature: positionSig,
        });
        setStatus("success");
      } catch (err) {
        console.error(err);
        setError(err.message || "Unknown error");
        setStatus("error");
      }
    },
    [connection, wallet]
  );

  return { createPool, status, logs, result, error };
}