"use client";
import { useState, useCallback } from "react";
import {
  Keypair,
  SystemProgram,
  Transaction,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  createSetAuthorityInstruction,
  getAssociatedTokenAddress,
  getMintLen,
  AuthorityType,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  createCreateMetadataAccountV3Instruction,
  PROGRAM_ID as METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";

const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || "";
const FEE_WALLET = new PublicKey("6UYpXsYihabr4LPcamqqbBKxock41AsFH12zcGPviWkY");
const CREATION_FEE = 0.05 * LAMPORTS_PER_SOL;

async function uploadToPinata(imageFile, { name, symbol, description }) {
  const imageForm = new FormData();
  imageForm.append("file", imageFile);
  imageForm.append("pinataMetadata", JSON.stringify({ name: `${symbol}-logo` }));

  const imageRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: { Authorization: `Bearer ${PINATA_JWT}` },
    body: imageForm,
  });
  if (!imageRes.ok) throw new Error(`Pinata image upload failed: ${await imageRes.text()}`);
  const imageData = await imageRes.json();
  const imageUri = `https://gateway.pinata.cloud/ipfs/${imageData.IpfsHash}`;

  const metaRes = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${PINATA_JWT}` },
    body: JSON.stringify({
      pinataContent: {
        name, symbol, description,
        image: imageUri,
        properties: {
          files: [{ uri: imageUri, type: imageFile.type }],
          category: "fungible",
        },
      },
      pinataMetadata: { name: `${symbol}-metadata` },
    }),
  });
  if (!metaRes.ok) throw new Error(`Pinata metadata upload failed: ${await metaRes.text()}`);
  const metaData = await metaRes.json();
  return `https://gateway.pinata.cloud/ipfs/${metaData.IpfsHash}`;
}

export function useTokenCreator() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [status, setStatus] = useState(null);
  const [mintAddress, setMintAddress] = useState(null);
  const [result, setResult] = useState(null);

  const createToken = useCallback(async ({
    name, symbol, description, imageFile,
    totalSupply, decimals, devAllocation,
    revokeMint, revokeFreeze,
  }) => {
    if (!wallet.publicKey || !wallet.signTransaction) throw new Error("Wallet not connected");

    try {
      // 1. IPFS Upload
      setStatus("uploading");
      const metadataUri = await uploadToPinata(imageFile, { name, symbol, description });
      console.log("✅ Metadata uploaded:", metadataUri);

      // 2. Create Mint
      setStatus("minting");
      const mintKeypair = Keypair.generate();
      const mintPubkey = mintKeypair.publicKey;
      const mintLen = getMintLen([]);
      const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

      const tx1 = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: mintPubkey,
          space: mintLen,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(mintPubkey, decimals, wallet.publicKey, wallet.publicKey)
      );
      tx1.feePayer = wallet.publicKey;
      const { blockhash: blockhash1, lastValidBlockHeight: lvh1 } = await connection.getLatestBlockhash();
      tx1.recentBlockhash = blockhash1;
      const sig1 = await wallet.sendTransaction(tx1, connection, { signers: [mintKeypair] });
      await connection.confirmTransaction({ signature: sig1, blockhash: blockhash1, lastValidBlockHeight: lvh1 }, "confirmed");
      console.log("✅ Mint created:", mintPubkey.toBase58());

      // 3. Create ATA + Mint tokens
      const associatedTokenAddress = await getAssociatedTokenAddress(mintPubkey, wallet.publicKey);
      const totalSupplyRaw = BigInt(totalSupply) * BigInt(10 ** decimals);

      const tx2 = new Transaction().add(
        createAssociatedTokenAccountInstruction(wallet.publicKey, associatedTokenAddress, wallet.publicKey, mintPubkey),
        createMintToInstruction(mintPubkey, associatedTokenAddress, wallet.publicKey, totalSupplyRaw)
      );
      tx2.feePayer = wallet.publicKey;
      const { blockhash: blockhash2, lastValidBlockHeight: lastValidBlockHeight2 } = await connection.getLatestBlockhash();
      tx2.recentBlockhash = blockhash2;
      const sig2 = await wallet.sendTransaction(tx2, connection);
      await connection.confirmTransaction({ signature: sig2, blockhash: blockhash2, lastValidBlockHeight: lastValidBlockHeight2 }, "finalized");
      console.log(`✅ ${totalSupply} tokens minted`);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 4. On-chain Metadata
      setStatus("metadata");
      const [metadataPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("metadata"), METADATA_PROGRAM_ID.toBuffer(), mintPubkey.toBuffer()],
        METADATA_PROGRAM_ID
      );
      const metadataIx = createCreateMetadataAccountV3Instruction(
        { metadata: metadataPDA, mint: mintPubkey, mintAuthority: wallet.publicKey, payer: wallet.publicKey, updateAuthority: wallet.publicKey },
        { createMetadataAccountArgsV3: { data: { name, symbol, uri: metadataUri, sellerFeeBasisPoints: 0, creators: null, collection: null, uses: null }, isMutable: true, collectionDetails: null } }
      );
      const tx4 = new Transaction().add(metadataIx);
      tx4.feePayer = wallet.publicKey;
      const { blockhash: blockhash4, lastValidBlockHeight: lastValidBlockHeight4 } = await connection.getLatestBlockhash();
      tx4.recentBlockhash = blockhash4;
      const sig4 = await wallet.sendTransaction(tx4, connection);
      await connection.confirmTransaction({ signature: sig4, blockhash: blockhash4, lastValidBlockHeight: lastValidBlockHeight4 }, "confirmed");
      console.log("✅ On-chain metadata created");

      // 5. Fee — prélevé APRÈS succès complet
      const feeTx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: FEE_WALLET,
          lamports: CREATION_FEE,
        })
      );
      feeTx.feePayer = wallet.publicKey;
      const { blockhash: feeBlockhash, lastValidBlockHeight: feeLastValidBlockHeight } = await connection.getLatestBlockhash();
      feeTx.recentBlockhash = feeBlockhash;
      await wallet.sendTransaction(feeTx, connection);
      console.log("✅ Fee collected");

      // 6. Result
      setStatus("done");
      const tokenResult = {
        mintAddress: mintPubkey.toBase58(),
        metadataUri,
        associatedTokenAccount: associatedTokenAddress.toBase58(),
        totalSupply,
        devTokens: Math.floor(totalSupply * devAllocation / 100),
        poolTokens: Math.floor(totalSupply * (1 - devAllocation / 100)),
        revokeMint,
        revokeFreeze,
      };
      setMintAddress(mintPubkey.toBase58());
      setResult(tokenResult);
      return tokenResult;

    } catch (err) {
      console.error("❌ Token creation error:", err);
      setStatus("error");
      throw err;
    }
  }, [wallet, connection]);

  const revokeAuthorities = useCallback(async ({ mintAddress, revokeMint, revokeFreeze }) => {
    if (!wallet.publicKey || !wallet.signTransaction) throw new Error("Wallet not connected");

    const mintPubkey = new PublicKey(mintAddress);
    const revokeInstructions = [];

    if (revokeMint) {
      revokeInstructions.push(
        createSetAuthorityInstruction(mintPubkey, wallet.publicKey, AuthorityType.MintTokens, null)
      );
    }
    if (revokeFreeze) {
      revokeInstructions.push(
        createSetAuthorityInstruction(mintPubkey, wallet.publicKey, AuthorityType.FreezeAccount, null)
      );
    }
    if (revokeInstructions.length === 0) return;

    const tx = new Transaction().add(...revokeInstructions);
    tx.feePayer = wallet.publicKey;
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    const sig = await wallet.sendTransaction(tx, connection);
    await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, "confirmed");
    console.log("✅ Authorities revoked");
  }, [wallet, connection]);

  const reset = () => {
    setStatus(null);
    setMintAddress(null);
    setResult(null);
  };

  return { createToken, revokeAuthorities, status, mintAddress, result, reset };
}