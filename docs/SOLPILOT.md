# SolPilot

**Product & Technical Vision**
**Version:** 0.1
**Status:** Draft
**Platform:** Solana
**Repository:** Token Creator

---

# 1. Vision

## 1.1 The vision

**SolPilot is a conversational financial interface for Solana.**

Users should be able to manage their crypto portfolio, understand what is happening in the market, discover relevant opportunities and execute blockchain actions simply by talking to SolPilot.

The user expresses an intention.

SolPilot understands the intention.

SolPilot prepares the appropriate action.

The user reviews and signs.

Solana executes.

The complexity of the underlying blockchain infrastructure should remain invisible whenever possible.

### Core promise

> **"I talk to my portfolio like I talk to ChatGPT."**

---

# 2. Mission

> **Make managing a Solana portfolio as simple as having a conversation.**

SolPilot is designed for intermediate crypto users who already understand the basics of crypto and own a Solana wallet, but who still have to navigate an increasingly fragmented ecosystem of protocols, applications and interfaces.

---

# 3. Target User

## Primary user

The primary user is an **intermediate Solana user**.

They:

* already own crypto;
* understand wallets and transactions;
* use Solana applications;
* hold several tokens;
* may use staking or DeFi;
* follow crypto markets;
* are comfortable with Phantom, Solflare or similar wallets;
* do not want to spend time learning the mechanics of every protocol.

They are not complete beginners.

They are also not necessarily professional traders.

---

# 4. The Problem

Managing a crypto portfolio currently requires users to interact with many disconnected interfaces.

A user may need:

* a wallet to hold assets;
* a DEX to swap;
* a staking application to stake;
* a DeFi protocol to earn yield;
* a token explorer to research assets;
* a different interface to claim rewards;
* another application to launch a token;
* multiple sources to follow market news.

The problem is not that these applications are incapable.

The problem is that **the user has to understand the infrastructure behind every action.**

The user thinks:

> "I want to reduce my exposure to JUP."

The ecosystem requires them to determine:

* what to sell;
* where to sell it;
* how much;
* through which protocol;
* how to execute the transaction;
* how to verify the result.

SolPilot should reduce this cognitive and technical burden.

---

# 5. Product Philosophy

## 5.1 Intent over interface

Users should express **what they want**, rather than learn **how to do it**.

Instead of:

> Open Jupiter → select JUP → select SOL → enter amount → configure transaction → sign

The user says:

> "Sell 20% of my JUP."

SolPilot translates the intention into an executable action.

---

## 5.2 AI assists, the user decides

SolPilot is **not an autonomous trading bot**.

The initiative always comes from the user.

SolPilot may:

* analyze;
* explain;
* recommend;
* warn;
* prepare;
* execute an explicitly requested action.

SolPilot must not independently decide to buy, sell, stake or move assets.

---

## 5.3 Protection over convenience

The system should actively protect users from mistakes without preventing legitimate actions.

Example:

> "Buying 10,000 ANSEM would represent 68% of your current portfolio. This is significantly above your usual position size. Do you still want to continue?"

The objective is not to paternalistically block the user.

The objective is to make the consequences visible.

---

## 5.4 Explain before execution

Before a financial transaction is signed, SolPilot should clearly communicate:

* what will happen;
* what asset is involved;
* quantity;
* expected output;
* estimated fees;
* relevant risks;
* destination when applicable.

The user then explicitly approves the transaction through their wallet.

---

## 5.5 Never pretend

SolPilot must distinguish between:

* an intention;
* a prepared transaction;
* a signed transaction;
* a submitted transaction;
* a confirmed transaction.

The assistant must never claim an action was completed before the blockchain confirms it.

Example:

**Before signing**

> "I've prepared the purchase of 10,000 ANSEM. Estimated cost: 2.43 SOL. Review and sign the transaction."

**After confirmation**

> "Transaction confirmed. 10,000 ANSEM were received by your wallet."

---

# 6. Morning Brief

The first screen of SolPilot should provide immediate context.

The experience begins with:

> **Good morning, Massimiliano. Here's what changed overnight.**

The purpose is not to provide a generic crypto news feed.

The purpose is to answer:

> **"What happened while I was away, and does any of it matter to me?"**

The brief may include:

### Portfolio

* current value;
* change since yesterday;
* major contributors to performance;
* staking/yield earned;
* significant allocation changes.

### Market events

Only events relevant to the user's portfolio or strategy.

### Risk

Examples:

* concentration increased;
* volatility increased;
* liquidity decreased;
* protocol risk changed;
* a position moved significantly.

### Opportunities

Examples:

* rewards available;
* airdrop to claim;
* staking opportunity;
* relevant presale;
* potentially attractive DeFi opportunity.

### Recommended actions

Maximum emphasis on a small number of high-value actions.

The system should prioritize relevance over volume.

---

# 7. Time Horizons

When relevant, SolPilot should explain portfolio implications across:

### Short term

Hours to days.

Examples:

* market movement;
* token-specific event;
* upcoming unlock;
* volatility;
* liquidity event.

### Medium term

Weeks to months.

Examples:

* token unlock schedule;
* protocol development;
* staking yield;
* governance decisions;
* changing portfolio concentration.

### Long term

Months to years.

Examples:

* strategic asset allocation;
* structural protocol risks;
* long-term thesis;
* portfolio diversification.

SolPilot should avoid presenting uncertain predictions as facts.

It should distinguish:

* facts;
* interpretations;
* scenarios;
* uncertainty.

---

# 8. The Chat

The chat is the **core interface of SolPilot**.

The user should be able to ask questions such as:

> "Why is my portfolio down today?"

> "What changed overnight?"

> "How much SOL do I have?"

> "What is my biggest risk?"

> "Why did ANSEM fall?"

> "Should I reduce my JUP exposure?"

> "Stake 10 SOL."

> "Buy 10,000 ANSEM."

> "Create a token called ANSEM with a supply of 1 billion."

The assistant should maintain conversational context.

---

# 9. Persistent Memory

SolPilot should eventually maintain a durable user memory.

Examples:

* investment preferences;
* risk preferences;
* typical position sizes;
* preferred assets;
* preferred strategies;
* previous decisions;
* relevant user-defined goals.

Memory must be transparent and controllable.

The user should be able to:

* see what SolPilot remembers;
* correct it;
* delete it;
* disable specific types of memory.

Memory exists to improve the quality of the assistant, not to make autonomous decisions.

---

# 10. Transaction Execution

Transaction execution is the **core superpower** of SolPilot.

The objective is:

> **Remove the technical steps between intention and result.**

Example:

### User

> Buy 10,000 ANSEM.

### SolPilot

Understands:

```text
intent: swap
input: SOL
output: ANSEM
target_amount: 10,000
```

It then:

1. identifies the appropriate execution route;
2. obtains a quote;
3. validates the requested transaction;
4. builds the transaction;
5. simulates it when possible;
6. presents the result;
7. asks the user to sign;
8. submits the signed transaction;
9. waits for confirmation;
10. verifies the resulting balance;
11. reports the result.

### Success response

> **Transaction confirmed.**
>
> 10,000 ANSEM received.
>
> Cost: X SOL
> Network fee: X SOL

---

# 11. Tool Architecture

The LLM should **not** directly control Solana.

It should interact with a controlled set of application tools.

Conceptually:

```text
User
  ↓
SolPilot
  ↓
LLM
  ↓
Intent / Tool selection
  ↓
Validated application tool
  ↓
Transaction engine
  ↓
Wallet signature
  ↓
Solana
```

Tools may include:

```text
Portfolio
├── getPortfolio()
├── getBalances()
├── getPerformance()
└── getTransactions()

Trading
├── getQuote()
└── swap()

Staking
└── stake()

Token Creator
├── createToken()
├── createVesting()
├── createPool()
└── revokeAuthority()
```

The initial toolset should remain intentionally small.

---

# 12. Token Creator Integration

Token Creator is not a separate application from an architectural perspective.

It is the first major set of native SolPilot tools.

The existing Token Creator interface should continue to work independently.

The same underlying capabilities should eventually be accessible through SolPilot.

Example:

> "Create a token called ANSEM with a supply of 1 billion."

SolPilot should be able to translate this request into the existing Token Creator functionality.

The architecture should therefore separate:

**business capability**

from

**user interface**.

Conceptually:

```text
Token Creator UI ───────┐
                        │
                        ▼
                   createToken()
                        ▲
                        │
SolPilot ───────────────┘
```

The same principle will eventually apply to:

* vesting;
* liquidity pools;
* authority management;
* swaps;
* staking;
* other Solana actions.

---

# 13. Transaction Safety Model

SolPilot must never give the LLM unrestricted transaction-building capabilities.

Every executable operation should pass through controlled application logic.

A transaction should follow:

```text
Intent
  ↓
Parameter extraction
  ↓
Validation
  ↓
Tool execution
  ↓
Transaction construction
  ↓
Simulation
  ↓
Human review
  ↓
Wallet signature
  ↓
Submission
  ↓
Confirmation
  ↓
Result verification
```

The LLM is responsible for understanding language.

The application is responsible for enforcing rules.

The wallet is responsible for authorization.

The blockchain is responsible for final execution.

---

# 14. Solana First

SolPilot will initially support **Solana only**.

Reasons:

* high transaction throughput;
* low transaction costs;
* strong DeFi ecosystem;
* large memecoin ecosystem;
* rapidly evolving applications;
* clear initial target market;
* ability to specialize deeply rather than provide shallow multi-chain support.

Multi-chain support is not part of the initial product.

---

# 15. Wallet Support

Initial wallet support should focus on established Solana wallets.

The current application already has wallet infrastructure that can support wallets such as:

* Phantom;
* Solflare;
* Backpack.

The existing wallet architecture should be reused wherever possible.

SolPilot should not require custody of user funds.

The user's wallet remains the authorization layer.

---

# 16. Notifications

Notifications should be **highly selective**.

The objective is not to maximize notification engagement.

The objective is to interrupt the user only when something genuinely deserves attention.

Potential categories:

### Critical

Security incident, major protocol risk, compromised position.

### Important

Large portfolio movement, significant portfolio risk change, important governance event.

### Opportunity

Claimable reward, relevant airdrop, meaningful yield opportunity.

The system should avoid:

* generic market spam;
* excessive price alerts;
* irrelevant news;
* engagement-driven notifications.

---

# 17. Product Trust

Trust is a core product feature.

SolPilot must:

* disclose uncertainty;
* explain recommendations;
* show transaction details;
* distinguish facts from opinions;
* avoid hidden incentives;
* avoid misleading execution status;
* make wallet authorization explicit;
* make important risks visible.

The product should never optimize for transaction volume at the expense of user trust.

---

# 18. Business Model

The primary business model will be **subscription-based**.

The initial model can be:

### Free

* wallet connection;
* basic portfolio overview;
* morning brief;
* limited AI usage;
* basic portfolio questions.

### Premium

Potentially includes:

* advanced portfolio analysis;
* deeper AI conversations;
* transaction execution;
* personalized memory;
* intelligent notifications;
* advanced recommendations;
* advanced portfolio insights.

Pricing will be determined after validating willingness to pay.

The business model should avoid incentives that encourage unnecessary trading.

Transaction fees or protocol commissions may be considered later, but they must not compromise the product's trust model.

---

# 19. Product Principles That Must Not Change

1. **The user remains in control.**
2. **The AI never autonomously manages the portfolio.**
3. **The AI never has unrestricted access to funds.**
4. **Financial actions require explicit authorization.**
5. **Important transactions are explained before signing.**
6. **The system never claims success before confirmation.**
7. **User protection comes before transaction volume.**
8. **Information must be relevant, not exhaustive.**
9. **The blockchain should disappear behind the experience.**
10. **SolPilot should optimize for long-term trust.**

---

# 20. Initial Product Architecture

The existing Token Creator repository remains the foundation.

We do not create a separate SolPilot repository for V1.

Conceptually:

```text
Token Creator Repository
│
├── Existing application
│   ├── Token creation
│   ├── Vesting
│   ├── Pools
│   ├── Explore
│   ├── Dashboard
│   └── Wallet infrastructure
│
└── SolPilot
    ├── Chat
    ├── Portfolio intelligence
    ├── AI layer
    ├── Tool layer
    ├── Transaction engine
    └── Memory
```

The architecture should progressively extract reusable business actions from existing React hooks.

Existing UI and new SolPilot UI should eventually call the same underlying application capabilities.

---

# 21. Development Strategy

We will build SolPilot incrementally.

## Phase 0: Architecture

* document existing architecture;
* identify reusable functionality;
* identify technical debt;
* establish domain boundaries;
* establish transaction safety model.

## Phase 1: SolPilot shell

* new SolPilot route;
* initial layout;
* chat interface;
* wallet context;
* basic navigation.

## Phase 2: Portfolio intelligence

* wallet balances;
* token metadata;
* token prices;
* portfolio valuation;
* performance;
* transaction history.

## Phase 3: AI

* connect LLM;
* system prompt;
* portfolio context;
* conversational memory;
* tool calling.

## Phase 4: First executable tool

**Swap.**

The first end-to-end flow should be:

> "Buy 10,000 ANSEM."

→ understand
→ quote
→ build
→ simulate
→ review
→ sign
→ confirm
→ verify
→ report.

## Phase 5: Native Token Creator tools

* create token;
* create vesting;
* create liquidity pool;
* revoke authorities.

## Phase 6: Morning Brief

* overnight portfolio changes;
* relevant news;
* portfolio impact;
* risk;
* recommendations.

## Phase 7: Advanced intelligence

* staking;
* yield;
* rewards;
* airdrops;
* portfolio optimization;
* advanced notifications;
* persistent personalization.

---

# 22. What We Will Not Build Initially

To avoid product dilution, V1 will not attempt to build:

* autonomous trading;
* multi-chain support;
* a social network;
* a generic crypto news platform;
* an NFT marketplace;
* a complex trading terminal;
* dozens of DeFi integrations;
* an independent custodial wallet;
* a proprietary blockchain.

The initial objective is simple:

> **Build the best conversational interface for managing a Solana portfolio.**

---

# 23. North Star

The ultimate test of SolPilot is not:

> "How many features does the application have?"

It is:

> **"How many useful things can a user accomplish simply by talking to SolPilot?"**

The product succeeds when users stop thinking about which application they need to open.

They simply tell SolPilot what they want.

---

# 24. Long-Term Vision

SolPilot begins as a conversational Solana portfolio assistant.

It can eventually become the conversational interface for the broader Solana ecosystem.

The long-term architecture may include:

```text
                    SOLPILOT
                       │
                 Conversation
                       │
              Intent / Reasoning
                       │
        ┌──────────────┼──────────────┐
        │              │              │
    Portfolio       Trading         DeFi
        │              │              │
        ├──────── Token Creator ──────┤
        │              │              │
     Staking       Lending       Payments
        │              │              │
        └──────────────┼──────────────┘
                       │
                     Solana
```

The interface remains simple.

The capabilities underneath become increasingly powerful.

The user does not need to learn the infrastructure.

They simply communicate their intent.

---

# 25. Product Tagline

> **SolPilot**
>
> **Talk to your portfolio.**
>
> *Intent becomes action.*
