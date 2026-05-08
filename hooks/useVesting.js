"use client";
import { useState, useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { BN } from "bn.js";
import { SolanaStreamClient, ICluster, getBN } from "@streamflow/stream";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { useNetwork } from "@/components/NetworkContext";

const FEE_WALLET = new PublicKey("6UYpXsYihabr4LPcamqqbBKxock41AsFH12zcGPviWkY");
const VESTING_FEE_LAMPORTS = 0.05 * 1_000_000_000;

export function useVesting() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { getCurrentEndpoint, isDevnet } = useNetwork();
  const [status, setStatus] = useState(null);
  const [streamId, setStreamId] = useState(null);

  const createVesting = useCallback(async ({
    mintAddress,
    amount,
    decimals,
    startDate,
    cliffMonths,
    vestingMonths,
    recipientAddress,
    name,
  }) => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error("Wallet not connected");
    }

    try {
      setStatus("creating");

      const client = new SolanaStreamClient(
        getCurrentEndpoint(), 
        isDevnet() ? ICluster.Devnet : ICluster.Mainnet
      );

      const now = Math.floor(Date.now() / 1000);
      const startTimestamp = Math.max(
        Math.floor(startDate.getTime() / 1000),
        now + 60
      );

      const periodSeconds = 30 * 24 * 3600;
      const totalAmount = getBN(amount, decimals);
      let cliffTimestamp, cliffAmount, amountPerPeriod;

      if (cliffMonths === 0) {
        cliffTimestamp = startTimestamp;
        cliffAmount = new BN(0);
        amountPerPeriod = totalAmount.div(new BN(vestingMonths));
      } else {
        cliffTimestamp = startTimestamp + cliffMonths * periodSeconds;
        const dust = new BN(1);
        if (totalAmount.gt(dust)) {
          cliffAmount = totalAmount.sub(dust);
          amountPerPeriod = dust;
        } else {
          cliffAmount = totalAmount;
          amountPerPeriod = new BN(0);
        }
      }

      const streamParams = {
        recipient: recipientAddress,
        tokenId: mintAddress,
        start: startTimestamp,
        amount: totalAmount,
        period: periodSeconds,
        cliff: cliffTimestamp,
        cliffAmount,
        amountPerPeriod,
        name: name || "Dev Allocation",
        canTopup: false,
        cancelableBySender: true,
        cancelableByRecipient: false,
        transferableBySender: false,
        transferableByRecipient: true,
        automaticWithdrawal: false,
        withdrawalFrequency: 0,
        partner: "6UYpXsYihabr4LPcamqqbBKxock41AsFH12zcGPviWkY",
      };

      const solanaParams = {
        sender: wallet,
        isNative: false,
      };

      // Verifications
      const senderATA = getAssociatedTokenAddressSync(
        new PublicKey(mintAddress),
        wallet.publicKey
      );
      const tokenAccountInfo = await connection.getTokenAccountBalance(senderATA);
      console.log("[vesting] Token balance:", tokenAccountInfo.value.uiAmount);

      if (tokenAccountInfo.value.uiAmount < amount) {
        throw new Error(`Insufficient balance: ${tokenAccountInfo.value.uiAmount} tokens available, ${amount} required`);
      }

      const solBalance = await connection.getBalance(wallet.publicKey);
      console.log("[vesting] SOL balance:", solBalance / 1e9);

      if (solBalance < 0.1 * 1e9) {
        console.warn("⚠️ Low SOL balance — risk of failure");
      }

      // 1. Stream Streamflow first
      let finalTx;
      try {
        const { tx } = await client.create(streamParams, solanaParams);
        finalTx = tx;
        console.log("✅ Stream created (create):", finalTx);
      } catch (firstError) {
        console.warn("Attempting with createUnchecked...");
        const { tx } = await client.createUnchecked(streamParams, solanaParams);
        finalTx = tx;
        console.log("✅ Stream created (createUnchecked):", finalTx);
      }

      // 2. 0.05 SOL Fee — charged AFTER successful vesting creation
      const feeTx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: FEE_WALLET,
          lamports: VESTING_FEE_LAMPORTS,
        })
      );
      feeTx.feePayer = wallet.publicKey;
      feeTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      const signedFeeTx = await wallet.signTransaction(feeTx);
      await connection.sendRawTransaction(signedFeeTx.serialize());
      console.log("✅ Vesting fee charged");

      setStreamId(finalTx);
      setStatus("done");

      return { streamId: finalTx, startDate, cliffMonths, vestingMonths, amount, recipientAddress };

    } catch (err) {
      console.error("❌ Vesting error:", err);
      setStatus("error");
      throw err;
    }
  }, [wallet, connection, getCurrentEndpoint, isDevnet]);

  const reset = () => {
    setStatus(null);
    setStreamId(null);
  };

  return { createVesting, status, streamId, reset };
}