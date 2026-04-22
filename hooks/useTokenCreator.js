"use client";
import { useState, useCallback } from "react";
import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  PublicKey,  
  sendAndConfirmTransaction,
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
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

// Metaplex UMI
import {
  createCreateMetadataAccountV3Instruction,
  PROGRAM_ID as METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";

const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || "";
const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT || "https://api.devnet.solana.com";

// ── Upload image + JSON sur IPFS via Pinata ───────────────
async function uploadToPinata(imageFile, { name, symbol, description }) {
  // 1. Upload image
  const imageForm = new FormData();
  imageForm.append("file", imageFile);
  imageForm.append("pinataMetadata", JSON.stringify({ name: `${symbol}-logo` }));

  const imageRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: { Authorization: `Bearer ${PINATA_JWT}` },
    body: imageForm,
  });

  if (!imageRes.ok) {
    const err = await imageRes.text();
    throw new Error(`Pinata image upload failed: ${err}`);
  }

  const imageData = await imageRes.json();
  const imageUri = `https://gateway.pinata.cloud/ipfs/${imageData.IpfsHash}`;

  // 2. Upload metadata JSON
  const metaRes = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PINATA_JWT}`,
    },
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

  if (!metaRes.ok) {
    const err = await metaRes.text();
    throw new Error(`Pinata metadata upload failed: ${err}`);
  }

  const metaData = await metaRes.json();
  return `https://gateway.pinata.cloud/ipfs/${metaData.IpfsHash}`;
}

// ── Hook principal ────────────────────────────────────────
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
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error("Wallet non connecté");
    }

    try {
      // ── ÉTAPE 1 : Upload IPFS ──────────────────────────
      setStatus("uploading");
      const metadataUri = await uploadToPinata(imageFile, { name, symbol, description });
      console.log("✅ Métadonnées uploadées :", metadataUri);

      // ── ÉTAPE 2 : Créer le Mint ────────────────────────
      setStatus("minting");

      // On génère un keypair local juste pour l'adresse du mint
      // Le wallet signe et paie — le mintKeypair signe aussi (co-signer)
      const mintKeypair = Keypair.generate();
      const mintPubkey = mintKeypair.publicKey;
      const mintLen = getMintLen([]);
      const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

      const tx1 = new Transaction().add(
        // Créer le compte du mint
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: mintPubkey,
          space: mintLen,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
        // Initialiser le mint
        createInitializeMintInstruction(
          mintPubkey,
          decimals,
          wallet.publicKey,  // mint authority = wallet utilisateur
          wallet.publicKey,  // freeze authority = wallet utilisateur
        )
      );

      tx1.feePayer = wallet.publicKey;
      tx1.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      // Le mintKeypair co-signe (il crée son propre compte)
      tx1.partialSign(mintKeypair);
      // Le wallet utilisateur signe
      const signedTx1 = await wallet.signTransaction(tx1);
      const sig1 = await connection.sendRawTransaction(signedTx1.serialize());
      await connection.confirmTransaction(sig1, "confirmed"); // ← ajouter
      console.log("✅ Mint créé :", mintPubkey.toBase58());

      // ── ÉTAPE 3 : Créer le token account + minter ─────
      const associatedTokenAddress = await getAssociatedTokenAddress(
        mintPubkey,
        wallet.publicKey
      );

      const totalSupplyRaw = BigInt(totalSupply) * BigInt(10 ** decimals);

      const tx2 = new Transaction().add(
        // Créer le Associated Token Account du wallet
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,        // payer
          associatedTokenAddress,  // token account à créer
          wallet.publicKey,        // owner
          mintPubkey,
        ),
        // Minter 100% de la supply vers le wallet
        createMintToInstruction(
          mintPubkey,
          associatedTokenAddress,
          wallet.publicKey,  // mint authority
          totalSupplyRaw,
        )
      );

      tx2.feePayer = wallet.publicKey;
      tx2.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      const signedTx2 = await wallet.signTransaction(tx2);
      const sig2 = await connection.sendRawTransaction(signedTx2.serialize());
      await connection.confirmTransaction(sig2, "confirmed"); // ← ajouter
      console.log(`✅ ${totalSupply} tokens mintés`);

// ── ÉTAPE 4 : Métadonnées on-chain ────────────────────────
setStatus("metadata");

const [metadataPDA] = PublicKey.findProgramAddressSync(
  [
    Buffer.from("metadata"),
    METADATA_PROGRAM_ID.toBuffer(),
    mintPubkey.toBuffer(),
  ],
  METADATA_PROGRAM_ID
);

const metadataIx = createCreateMetadataAccountV3Instruction(
  {
    metadata: metadataPDA,
    mint: mintPubkey,
    mintAuthority: wallet.publicKey,
    payer: wallet.publicKey,
    updateAuthority: wallet.publicKey,
  },
  {
    createMetadataAccountArgsV3: {
      data: {
        name,
        symbol,
        uri: metadataUri,
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null,
      },
      isMutable: true,
      collectionDetails: null,
    },
  }
);

const tx4 = new Transaction().add(metadataIx);
tx4.feePayer = wallet.publicKey;
tx4.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
const signedTx4 = await wallet.signTransaction(tx4);
const sig4 = await connection.sendRawTransaction(signedTx4.serialize());
await connection.confirmTransaction(sig4, "confirmed");
console.log("✅ Métadonnées on-chain créées");

      // ── ÉTAPE 5 : Révoquer les authorities ────────────
      setStatus("revoking");

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

      if (revokeInstructions.length > 0) {
        const tx3 = new Transaction().add(...revokeInstructions);
        tx3.feePayer = wallet.publicKey;
        tx3.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        const signedTx3 = await wallet.signTransaction(tx3);
        const sig3 = await connection.sendRawTransaction(signedTx3.serialize());
        await connection.confirmTransaction(sig3, "confirmed"); // ← ajouter
        console.log("✅ Authorities révoquées");
      }

      // ── RÉSULTAT ──────────────────────────────────────
      const tokenResult = {
        mintAddress: mintPubkey.toBase58(),
        metadataUri,
        associatedTokenAccount: associatedTokenAddress.toBase58(),
        totalSupply,
        devTokens: Math.floor(totalSupply * devAllocation / 100),
        poolTokens: Math.floor(totalSupply * (1 - devAllocation / 100)),
      };

      setMintAddress(mintPubkey.toBase58());
      setResult(tokenResult);
      setStatus("done");
      return tokenResult;

    } catch (err) {
      console.error("❌ Erreur création token :", err);
      setStatus("error");
      throw err;
    }
  }, [wallet, connection]);

  const reset = () => {
    setStatus(null);
    setMintAddress(null);
    setResult(null);
  };

  return { createToken, status, mintAddress, result, reset };
}
