import Link from "next/link";

export const metadata = {
  title: "Documentation — Token Creator",
  description: "Learn how to create a Solana token, set up vesting, and add liquidity using Token Creator. Step-by-step documentation for non-developers.",
};

const SECTIONS = [
  {
    id: "token-creation",
    title: "Creating a token on Solana",
    subsections: [
      {
        title: "What is a Solana token?",
        content: `A Solana token is a digital asset that lives on the Solana blockchain. Unlike Ethereum, which uses the ERC-20 standard, Solana tokens follow the SPL (Solana Program Library) standard. Every token has a unique address on the blockchain called a mint address — this is the permanent identifier of your token, similar to a contract address on Ethereum.

Solana tokens can represent anything: community points, governance rights, rewards, in-game currency, or tradeable assets. Once created, a token exists permanently on the blockchain and can be sent to any Solana wallet.`,
      },
      {
        title: "Token supply and decimals",
        content: `When you create a token, you define two key parameters: the total supply and the number of decimals.

The total supply is the maximum number of tokens that will ever exist — unless you keep the mint authority active, which allows minting more tokens in the future. A common choice for community tokens is 1,000,000,000 (one billion tokens), which gives enough room for airdrops, rewards, and liquidity without the numbers looking too large.

Decimals define the smallest unit of your token. With 6 decimals (like USDC), the smallest unit is 0.000001 of a token. With 9 decimals (like SOL), it's 0.000000001. For most community tokens, 6 decimals is the standard choice.`,
      },
      {
        title: "Token metadata and IPFS",
        content: `Every token on Solana can have on-chain metadata: a name, a symbol, a logo, and a description. This metadata is what wallets and explorers like Solscan use to display your token correctly.

Token Creator uploads your logo and metadata to IPFS (InterPlanetary File System) via Pinata before creating the token. IPFS is a decentralized storage network — your logo is not stored on a central server that can go offline, but distributed across thousands of nodes worldwide. The result is a permanent, censorship-resistant URL that looks like: ipfs://QmXxx...

The metadata JSON follows the Metaplex standard, which is the most widely supported token metadata format on Solana. This ensures your token displays correctly on Phantom, Solflare, Solscan, DEXscreener, and any other Solana-compatible application.`,
      },
      {
        title: "Mint authority and freeze authority",
        content: `When you create a token, your wallet automatically becomes the mint authority and the freeze authority.

The mint authority is the right to create more tokens. If you keep it, you can mint additional supply at any time. If you revoke it, the supply is fixed forever — no one, including you, can ever create more tokens. This is a strong trust signal for your community.

The freeze authority is the right to freeze individual token accounts, preventing transfers. Revoking it means no one can ever block a holder's wallet. Again, this is a transparency signal that your community can verify on-chain.

Token Creator lets you revoke both authorities after completing the vesting setup — because Streamflow requires an active mint authority to lock tokens. The recommended order is: create token → set up vesting → revoke authorities.`,
      },
      {
        title: "How Token Creator creates your token",
        content: `Token Creator sends four sequential transactions to the Solana blockchain:

1. Upload — your logo and metadata JSON are uploaded to IPFS via Pinata. This happens off-chain before any transaction is signed.

2. Mint creation — a new SPL token mint account is created on-chain. This establishes the permanent address of your token.

3. Token account + minting — an Associated Token Account (ATA) is created in your wallet, and the full token supply is minted directly into it. You receive 100% of the supply.

4. Metadata — the on-chain metadata account is created using the Metaplex Token Metadata program. This links your token's mint address to its name, symbol, and IPFS URI.

Each transaction requires your signature in Phantom or Solflare. Token Creator never has access to your private keys.`,
      },
    ],
  },
  {
    id: "vesting",
    title: "Token vesting with Streamflow",
    subsections: [
      {
        title: "What is token vesting?",
        content: `Token vesting is a mechanism that locks a portion of tokens and releases them gradually over time according to a predefined schedule. It is widely used in crypto projects to align incentives between founders, teams, and communities.

Without vesting, nothing stops a token creator from selling all their tokens immediately after launch — a practice commonly known as a "rug pull." Vesting solves this by making the creator's tokens inaccessible for a defined period, and releasing them slowly afterward. The entire schedule is enforced on-chain and is publicly verifiable by anyone.`,
      },
      {
        title: "Cliff period",
        content: `A cliff is an initial period during which no tokens are released at all. For example, a 3-month cliff means that for the first 3 months after the vesting starts, the recipient cannot access any tokens. After the cliff, tokens either unlock all at once (cliff release) or begin unlocking linearly.

Cliff periods are common for team and founder allocations. They prevent early exits and signal a long-term commitment to the project. A typical setup for a community token might be a 3-month cliff followed by 12 months of linear vesting.`,
      },
      {
        title: "Linear vesting",
        content: `With linear vesting and no cliff, tokens unlock progressively every month from the start date. If you lock 150,000,000 tokens over 12 months, approximately 12,500,000 tokens become claimable each month.

This gradual release creates predictable, transparent unlock events that your community can track in real time on your public token page. It reduces sell pressure compared to a lump-sum release and demonstrates a commitment to the long-term health of the project.`,
      },
      {
        title: "How Token Creator creates a vesting contract",
        content: `Token Creator uses Streamflow, one of the most widely used vesting protocols on Solana, to create on-chain vesting contracts.

When you set up vesting, you specify: the token address (your mint address from step 1), the amount to lock, the start date, the cliff duration, the total vesting duration, and the recipient wallet — which can be your own wallet or another address.

Streamflow creates an escrow account on-chain that holds the tokens. The recipient can claim unlocked tokens at any time through the Streamflow interface at app.streamflow.finance. The schedule is enforced by the smart contract — no one, including you, can change it after creation.

Token Creator charges a 0.05 SOL service fee after the stream is successfully created.`,
      },
      {
        title: "Why vesting matters for community trust",
        content: `Your community can verify your vesting contract directly on your public token page at /token/[mint]. They can see the total amount locked, how much has been unlocked so far, and the full schedule going forward.

This level of transparency is a significant trust signal. It proves you are not planning to dump your tokens, and it aligns your financial incentives with the long-term success of the project. Many investors and community members specifically look for vesting schedules before engaging with a new token.`,
      },
    ],
  },
  {
    id: "liquidity",
    title: "Adding liquidity on Orca Whirlpool",
    subsections: [
      {
        title: "What is a liquidity pool?",
        content: `A liquidity pool is a smart contract that holds two assets and allows anyone to trade between them automatically. Instead of needing a buyer and a seller to match at the same time (like a traditional order book), a liquidity pool enables instant swaps at any time.

When you add liquidity to a pool, you deposit two assets — for example, your token and SOL — and receive a liquidity position in return. This position earns a share of the trading fees generated by the pool every time someone swaps.`,
      },
      {
        title: "Why Orca Whirlpool?",
        content: `Token Creator uses Orca Whirlpool, which is the leading concentrated liquidity AMM (Automated Market Maker) on Solana. Orca is one of the most trusted and widely used DEXs on Solana, with deep integration across wallets, aggregators, and analytics platforms like DEXscreener and Birdeye.

Whirlpool uses a concentrated liquidity model inspired by Uniswap v3. This means liquidity providers can concentrate their capital within specific price ranges, making capital more efficient. Token Creator uses a full-range position by default, which behaves similarly to a traditional AMM like Uniswap v2 — simpler and more suitable for new tokens without established price history.`,
      },
      {
        title: "Setting an initial price",
        content: `When you create a new pool, you set the initial price of your token in terms of the paired asset (SOL or USDC). This is simply the ratio between the two amounts you deposit.

For example, if you deposit 850,000,000 tokens and 0.5 SOL, the initial price is 0.5 / 850,000,000 ≈ 0.000000000588 SOL per token. This price is determined by you at pool creation — the market will then adjust it based on supply and demand.

Choose your initial price carefully. It defines your token's starting market capitalization and affects how the pool rebalances as trading happens.`,
      },
      {
        title: "How the price moves after pool creation",
        content: `Once your pool is live, the price is determined entirely by trading activity. Token Creator has no control over it.

When someone buys your token, they send SOL into the pool and receive tokens. The pool now has more SOL and fewer tokens, so the price of the token increases. When someone sells, the opposite happens — they send tokens in and receive SOL, which decreases the price.

This automatic price discovery is enforced by the smart contract. The price formula ensures that the product of the two reserves remains constant (with some adjustments for concentrated liquidity). There is no central authority setting the price — it is purely driven by market forces.`,
      },
      {
        title: "Your liquidity position NFT",
        content: `When you add liquidity to an Orca Whirlpool, you receive a position NFT in your wallet. This NFT represents your ownership of the liquidity you deposited. It is fully transferable and can be sold or given to another wallet.

To withdraw your liquidity, you burn this NFT through the Orca interface at orca.so. You receive back the current amounts of the two assets in the pool — which may differ from what you deposited, depending on how the price has moved (this difference is called impermanent loss).

As long as you hold the position NFT, you accumulate trading fees proportional to your share of the pool. These fees are paid in the two assets of the pool and can be claimed separately at any time.`,
      },
      {
        title: "What Token Creator does automatically",
        content: `Creating a Whirlpool position involves several technical steps that Token Creator handles for you:

1. Pool initialization — if no pool exists for your token pair and tick spacing, Token Creator creates it.

2. Tick array initialization — Whirlpool organizes liquidity into price ranges called ticks. Token Creator initializes the required tick arrays for your full-range position.

3. WSOL wrapping — if you are providing SOL liquidity, Token Creator automatically wraps your SOL into WSOL (Wrapped SOL), which is the SPL token representation of SOL required by the protocol.

4. Position opening and liquidity deposit — Token Creator builds and submits the final transaction that opens your position and deposits your tokens and SOL into the pool.

Token Creator charges a 0.1% fee on the token side of your deposit. SOL and USDC are not affected.`,
      },
    ],
  },
];

export default function DocsPage() {
  return (
    <main style={{ padding: "48px 24px 80px" }}>
      <Link href="/help" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)", textDecoration: "none", marginBottom: 32 }}>
        ← Help
      </Link>

      <div style={{ marginBottom: 48 }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8, fontFamily: "'Geist Mono', monospace" }}>
          Documentation
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 12 }}>
          How Token Creator works
        </h1>
        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.65, maxWidth: 520 }}>
          A complete guide to creating a Solana token, setting up vesting, and adding liquidity — no coding required.
        </p>
      </div>

      {/* Table of contents */}
      <div style={{ padding: "16px 20px", borderRadius: 8, background: "var(--surface)", border: "1px solid var(--border)", marginBottom: 48 }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "'Geist Mono', monospace", marginBottom: 12 }}>
          Contents
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {SECTIONS.map((section, i) => (
            <a key={section.id} href={`#${section.id}`} style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: "'Geist Mono', monospace", color: "var(--dim)", fontSize: 11 }}>0{i + 1}</span>
              {section.title}
            </a>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
        {SECTIONS.map((section, i) => (
          <div key={section.id} id={section.id}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 32, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", color: "var(--dim)" }}>0{i + 1}</span>
              <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text)" }}>
                {section.title}
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {section.subsections.map(sub => (
                <div key={sub.title} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}>
                    {sub.title}
                  </h3>
                  {sub.content.split("\n\n").map((paragraph, j) => (
                    <p key={j} style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.75 }}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ marginTop: 64, padding: "24px", borderRadius: 8, background: "var(--card)", border: "1px solid var(--border)", textAlign: "center" }}>
        <p style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 8 }}>
          Ready to launch your token?
        </p>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
          Connect your wallet and follow the four steps. No code required.
        </p>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--text)", color: "var(--bg)", borderRadius: 8, padding: "11px 24px", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
          Create your token →
        </Link>
      </div>

    </main>
  );
}