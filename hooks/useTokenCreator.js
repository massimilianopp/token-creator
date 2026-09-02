"use client";

import { useState, useCallback } from "react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  createSetAuthorityInstruction,
  AuthorityType,
} from "@solana/spl-token";

import { createToken as createTokenAction } from "../lib/actions/token/createToken";

export function useTokenCreator() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [status, setStatus] = useState(null);
  const [mintAddress, setMintAddress] = useState(null);
  const [result, setResult] = useState(null);

  const createToken = useCallback(
    async (params) => {
      if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error("Wallet not connected");
      }

      try {
        setStatus("uploading");

        const tokenResult = await createTokenAction({
          connection,
          publicKey: wallet.publicKey,
          sendTransaction: wallet.sendTransaction,

          ...params,
        });

        setStatus("done");
        setMintAddress(tokenResult.mintAddress);
        setResult(tokenResult);

        return tokenResult;
      } catch (err) {
        console.error("❌ Token creation error:", err);
        setStatus("error");
        throw err;
      }
    },
    [wallet, connection]
  );

  const revokeAuthorities = useCallback(
    async ({ mintAddress, revokeMint, revokeFreeze }) => {
      if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error("Wallet not connected");
      }

      const mintPubkey = new PublicKey(mintAddress);
      const revokeInstructions = [];

      if (revokeMint) {
        revokeInstructions.push(
          createSetAuthorityInstruction(
            mintPubkey,
            wallet.publicKey,
            AuthorityType.MintTokens,
            null
          )
        );
      }

      if (revokeFreeze) {
        revokeInstructions.push(
          createSetAuthorityInstruction(
            mintPubkey,
            wallet.publicKey,
            AuthorityType.FreezeAccount,
            null
          )
        );
      }

      if (revokeInstructions.length === 0) return;

      const tx = new Transaction().add(...revokeInstructions);

      tx.feePayer = wallet.publicKey;

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      tx.recentBlockhash = blockhash;

      const sig = await wallet.sendTransaction(tx, connection);

      await connection.confirmTransaction(
        {
          signature: sig,
          blockhash,
          lastValidBlockHeight,
        },
        "confirmed"
      );

      console.log("✅ Authorities revoked");
    },
    [wallet, connection]
  );

  const reset = () => {
    setStatus(null);
    setMintAddress(null);
    setResult(null);
  };

  return {
    createToken,
    revokeAuthorities,
    status,
    mintAddress,
    result,
    reset,
  };
}