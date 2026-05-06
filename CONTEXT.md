# Token Creator — Contexte projet

## Stack
Next.js 16, App Router, Turbopack
Solana devnet, @solana/spl-token, @metaplex-foundation/mpl-token-metadata@2
@streamflow/stream v11, Pinata IPFS

## Structure
app/layout.js         — providers wallet (Phantom + Solflare)
app/page.js           — Module 1 token creator
app/vesting/page.js   — Module 2 vesting
components/TokenCreatorForm.jsx
components/VestingForm.jsx
hooks/useTokenCreator.js
hooks/useVesting.js

## Ce qui fonctionne
- Création SPL token avec métadonnées Metaplex (mpl-token-metadata@2, createCreateMetadataAccountV3Instruction)
- Vesting Streamflow via createUnchecked (bypass validation métadonnées)
- Wallet adapter : dynamic import WalletMultiButton (ssr:false) obligatoire

## Bugs résolus importants
- spl-token : ne pas passer wallet comme Keypair, construire tx manuellement
- Metaplex : utiliser createCreateMetadataAccountV3Instruction pas createFungible
- Streamflow : utiliser createUnchecked pas create (erreur Custom 97)
- Next.js : "use client" obligatoire sur tous les hooks et composants

## À faire
- Module 3 : Pool Orca Whirlpool (liquidité publique)
- Module 4 : Page publique token (chart, vesting info, DEXscreener)
