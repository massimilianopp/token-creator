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
    getAssociatedTokenAddress,
    getMintLen,
    TOKEN_PROGRAM_ID,
  } from "@solana/spl-token";
  
  import {
    createCreateMetadataAccountV3Instruction,
    PROGRAM_ID as METADATA_PROGRAM_ID,
  } from "@metaplex-foundation/mpl-token-metadata";
  
  const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || "";
  
  const FEE_WALLET = new PublicKey(
    "6UYpXsYihabr4LPcamqqbBKxock41AsFH12zcGPviWkY"
  );
  
  const CREATION_FEE = 0.05 * LAMPORTS_PER_SOL;
  
  function normalizeUrl(url) {
    if (!url || !url.trim()) return undefined;
  
    const value = url.trim();
  
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }
  
    return `https://${value}`;
  }
  
  async function uploadToPinata(
    imageFile,
    { name, symbol, description, website, twitter, telegram, discord }
  ) {
    const imageForm = new FormData();
  
    imageForm.append("file", imageFile);
    imageForm.append(
      "pinataMetadata",
      JSON.stringify({ name: `${symbol}-logo` })
    );
  
    const imageRes = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: imageForm,
      }
    );
  
    if (!imageRes.ok) {
      throw new Error(
        `Pinata image upload failed: ${await imageRes.text()}`
      );
    }
  
    const imageData = await imageRes.json();
  
    const imageUri = `https://gateway.pinata.cloud/ipfs/${imageData.IpfsHash}`;
  
    const metaRes = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: JSON.stringify({
          pinataContent: {
            name,
            symbol,
            description,
            image: imageUri,
  
            ...(website && {
              external_url: normalizeUrl(website),
            }),
  
            ...(twitter || telegram || discord
              ? {
                  extensions: {
                    ...(twitter && {
                      twitter: normalizeUrl(twitter),
                    }),
                    ...(telegram && {
                      telegram: normalizeUrl(telegram),
                    }),
                    ...(discord && {
                      discord: normalizeUrl(discord),
                    }),
                  },
                }
              : {}),
  
            properties: {
              files: [
                {
                  uri: imageUri,
                  type: imageFile.type,
                },
              ],
              category: "fungible",
            },
          },
  
          pinataMetadata: {
            name: `${symbol}-metadata`,
          },
        }),
      }
    );
  
    if (!metaRes.ok) {
      throw new Error(
        `Pinata metadata upload failed: ${await metaRes.text()}`
      );
    }
  
    const metaData = await metaRes.json();
  
    return `https://gateway.pinata.cloud/ipfs/${metaData.IpfsHash}`;
  }
  
  export async function createToken({
    connection,
    publicKey,
    sendTransaction,
  
    name,
    symbol,
    description,
    imageFile,
  
    totalSupply,
    decimals,
    devAllocation,
  
    revokeMint,
    revokeFreeze,
  
    website,
    twitter,
    telegram,
    discord,
  }) {
    if (!publicKey || !sendTransaction) {
      throw new Error("Wallet not connected");
    }
  
    // 1. Upload metadata
    const metadataUri = await uploadToPinata(imageFile, {
      name,
      symbol,
      description,
      website,
      twitter,
      telegram,
      discord,
    });
  
    // 2. Create mint
    const mintKeypair = Keypair.generate();
    const mintPubkey = mintKeypair.publicKey;
  
    const mintLen = getMintLen([]);
  
    const lamports =
      await connection.getMinimumBalanceForRentExemption(mintLen);
  
    const tx1 = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: mintPubkey,
        space: mintLen,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
  
      createInitializeMintInstruction(
        mintPubkey,
        decimals,
        publicKey,
        publicKey
      )
    );
  
    tx1.feePayer = publicKey;
  
    const {
      blockhash: blockhash1,
      lastValidBlockHeight: lastValidBlockHeight1,
    } =
      await connection.getLatestBlockhash();
  
    tx1.recentBlockhash = blockhash1;
  
    const sig1 = await sendTransaction(tx1, connection, {
      signers: [mintKeypair],
    });
  
    await connection.confirmTransaction(
      {
        signature: sig1,
        blockhash: blockhash1,
        lastValidBlockHeight: lastValidBlockHeight1,
      },
      "confirmed"
    );
  
    // 3. Create ATA + mint tokens
    const associatedTokenAddress = await getAssociatedTokenAddress(
      mintPubkey,
      publicKey
    );
  
    const totalSupplyRaw =
      BigInt(totalSupply) * BigInt(10 ** decimals);
  
    const tx2 = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        publicKey,
        associatedTokenAddress,
        publicKey,
        mintPubkey
      ),
  
      createMintToInstruction(
        mintPubkey,
        associatedTokenAddress,
        publicKey,
        totalSupplyRaw
      )
    );
  
    tx2.feePayer = publicKey;
  
    const {
      blockhash: blockhash2,
      lastValidBlockHeight: lastValidBlockHeight2,
    } =
      await connection.getLatestBlockhash();
  
    tx2.recentBlockhash = blockhash2;
  
    const sig2 = await sendTransaction(tx2, connection);
  
    await connection.confirmTransaction(
      {
        signature: sig2,
        blockhash: blockhash2,
        lastValidBlockHeight: lastValidBlockHeight2,
      },
      "finalized"
    );
  
    // 4. On-chain metadata
    const [metadataPDA] =
      PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          METADATA_PROGRAM_ID.toBuffer(),
          mintPubkey.toBuffer(),
        ],
        METADATA_PROGRAM_ID
      );
  
    const metadataIx =
      createCreateMetadataAccountV3Instruction(
        {
          metadata: metadataPDA,
          mint: mintPubkey,
          mintAuthority: publicKey,
          payer: publicKey,
          updateAuthority: publicKey,
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
  
    tx4.feePayer = publicKey;
  
    const {
      blockhash: blockhash4,
      lastValidBlockHeight: lastValidBlockHeight4,
    } =
      await connection.getLatestBlockhash();
  
    tx4.recentBlockhash = blockhash4;
  
    const sig4 = await sendTransaction(tx4, connection);
  
    await connection.confirmTransaction(
      {
        signature: sig4,
        blockhash: blockhash4,
        lastValidBlockHeight: lastValidBlockHeight4,
      },
      "confirmed"
    );
  
    // 5. Creation fee
    const feeTx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: FEE_WALLET,
        lamports: CREATION_FEE,
      })
    );
  
    feeTx.feePayer = publicKey;
  
    const {
      blockhash: feeBlockhash,
      lastValidBlockHeight: feeLastValidBlockHeight,
    } =
      await connection.getLatestBlockhash();
  
    feeTx.recentBlockhash = feeBlockhash;
  
    const feeSignature = await sendTransaction(
      feeTx,
      connection
    );
  
    await connection.confirmTransaction(
      {
        signature: feeSignature,
        blockhash: feeBlockhash,
        lastValidBlockHeight: feeLastValidBlockHeight,
      },
      "confirmed"
    );
  
    return {
      mintAddress: mintPubkey.toBase58(),
      metadataUri,
      associatedTokenAccount:
        associatedTokenAddress.toBase58(),
  
      totalSupply,
  
      devTokens: Math.floor(
        (totalSupply * devAllocation) / 100
      ),
  
      poolTokens: Math.floor(
        totalSupply * (1 - devAllocation / 100)
      ),
  
      revokeMint,
      revokeFreeze,
  
      transactions: {
        mint: sig1,
        distribution: sig2,
        metadata: sig4,
        fee: feeSignature,
      },
    };
  }