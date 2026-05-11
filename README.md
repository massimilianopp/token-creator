# Token Creator

**Live app → [app.token-creator.space](https://app.token-creator.space)**  
**Landing page → [token-creator.space](https://token-creator.space)**

---

## What is Token Creator?

Token Creator is a no-code web app that lets anyone launch a complete token on Solana in under 10 minutes — without writing a single line of code.

It covers the full token launch pipeline in four steps: create, vest, add liquidity, and share. The app is live on Solana mainnet and handles all the on-chain complexity under the hood, from IPFS metadata storage to concentrated liquidity pool initialization.

---

## Who is it for?

Community builders, creators, and project founders who want to reward members, run airdrops, or launch a token — but don't have the technical background to deploy programs or navigate a terminal. Token Creator makes the full Solana token stack accessible to non-developers.

---

## Features

### Module 1 — Token Creation
- SPL token creation with configurable supply and decimals
- On-chain metadata via **Metaplex** (`createCreateMetadataAccountV3Instruction`)
- Logo and metadata JSON pinned to **IPFS via Pinata**
- Configurable dev allocation with slider
- Optional revocation of mint authority (fixed supply forever) and freeze authority (wallets cannot be frozen)
- Service fee collected after successful creation

### Module 2 — Vesting
- Dev allocation locking via **Streamflow** (`createUnchecked`)
- Configurable cliff period (0–12 months) and total vesting duration (1–36 months)
- Linear unlock schedule, fully on-chain and publicly verifiable
- Send to own wallet or custom recipient address
- Service fee collected after successful stream creation

### Module 3 — Liquidity Pool
- Concentrated liquidity pool creation on **Orca Whirlpool**
- Token / SOL and Token / USDC pairs supported
- Full-range position (equivalent to Uniswap v2 behavior)
- Automatic tick array initialization, WSOL wrapping, and ATA creation
- Position represented as a Whirlpool NFT owned by the user
- 0.1% service fee on deposited tokens

### Module 4 — Public Token Page
- Shareable page at `/token/[mint]` for every token
- Live price, 24h change, market cap, volume, and liquidity via **DEXscreener API**
- Embedded DEXscreener price chart
- Top holders from on-chain data (`getTokenLargestAccounts`)
- Vesting contract status via **Streamflow SDK**
- Token metadata and social links from on-chain Metaplex metadata + IPFS JSON

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16, App Router, Turbopack |
| Network | Solana Mainnet |
| Token standard | SPL Token (`@solana/spl-token`) |
| Metadata | Metaplex Token Metadata v2 (`@metaplex-foundation/mpl-token-metadata@2`) |
| Vesting | Streamflow v11 (`@streamflow/stream`) |
| Liquidity | Orca Whirlpool (`@orca-so/whirlpools-sdk@0.20`) |
| Storage | IPFS via Pinata |
| Wallet | Phantom, Solflare (`@solana/wallet-adapter`) |
| RPC | Helius |
| Market data | DEXscreener API |

---

## Architecture

```
app/
  page.js                  → Module 1 — Token creation
  vesting/page.js          → Module 2 — Vesting
  pool/page.js             → Module 3 — Liquidity pool
  token/[mint]/page.js     → Module 4 — Public token page
  landing/                 → Marketing page

components/
  TokenCreatorForm.jsx
  VestingForm.jsx
  PoolForm.jsx
  TokenPublicPage.jsx
  TokenMeta.jsx
  TokenChart.jsx
  TokenVestingInfo.jsx
  BottomNav.jsx
  ui/Card.jsx              → Shared design system

hooks/
  useTokenCreator.js
  useVesting.js
  useWhirlpool.js
  useTokenInfo.js
  useVestingInfo.js

lib/
  whirlpool.js             → Orca client, tick utilities, mint ordering
```

---

## Key Technical Decisions

**Whirlpool integration** — `WhirlpoolContext.withProvider` requires the fetcher as the second argument (not third) in v0.20. Pool initialization uses `Decimal` (not `sqrtPriceX64`). Tick arrays for lower, current, and upper ticks are initialized manually before opening a position. Instructions are built manually (`openPositionIx` + `increaseLiquidityIx`) to pass tick arrays explicitly.

**Streamflow vesting** — `createUnchecked` is used instead of `create` to bypass Metaplex metadata validation issues on mainnet with tokens that have revoked mint authority. `solanaParams` is kept minimal (`{ sender, isNative: false }`) — extra fields like `senderTokens` or `metadataPubKeys` are silently ignored by v11.

**Fee collection** — service fees are collected in a separate transaction *after* the main operation succeeds, not before, to avoid insufficient funds errors during the primary transaction.

**Next.js + Turbopack** — all wallet adapter components use `dynamic import` with `{ ssr: false }`. Template literals in JSX attributes are extracted into variables to avoid Turbopack parsing errors.

---

## Getting Started

```bash
git clone https://github.com/your-username/token-creator
cd token-creator
npm install
```

Create a `.env.local` file:

```
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt
NEXT_PUBLIC_RPC_ENDPOINT=https://mainnet.helius-rpc.com/?api-key=your_key
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Branches

| Branch | Description |
|---|---|
| `main` | Production — Solana mainnet |
| `devnet` | Testing — Solana devnet |
| `v2` | New design system (Geist, black & white) |

---

## License

MIT
