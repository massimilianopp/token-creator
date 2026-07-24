const article = {
  slug: "what-is-spl-token",

  category: "Beginner guide",

  title: "What is an SPL Token? A Beginner's Guide to Solana Tokens",

  description:
    "Learn what an SPL Token is, how it works, what information it contains, and how it differs from Ethereum's ERC-20 standard.",

  keywords: [
  "SPL Token",
  "Solana Token",
  "Create SPL Token",
  "Memecoin",
  "Token Creator",
],



  readingTime: 6,

  publishedAt: "2026-07-20",

  updatedAt: "2026-07-20",

  sections: [
    {
      id: "what-is",
    
      title: "What is an SPL Token?",
    
      blocks: [
    
        {
          type: "paragraph",
          text: "An SPL Token is a fungible digital asset created using Solana's SPL Token Program. It defines the standard that wallets, exchanges, and decentralized applications use to interact with tokens on the Solana blockchain."
        },
    
        {
          type: "callout",
          variant: "tip",
          title: "Key takeaway",
          text: "An SPL Token is Solana's standard for fungible tokens. Every token is defined by a single Mint account, while users own their balances through Token Accounts controlled by their wallets."
        },
    
        {
          type: "paragraph",
          text: "Most tokens on Solana, including memecoins, governance tokens, utility tokens, and many stablecoins, are SPL Tokens."
        }
    
      ]
    },

    {
      id: "how-it-works",
    
      title: "How does an SPL Token work?",
    
      blocks: [
    
        {
          type: "paragraph",
          text: "Every SPL Token is represented by a unique Mint account stored on the Solana blockchain."
        },
    
        {
          type: "paragraph",
          text: "The Mint account stores the token's configuration, including the total supply, decimals, Mint Authority and Freeze Authority."
        },
    
        {
          type: "image",
          src: "/illustrations/spl-architecture.svg",
          alt: "How an SPL Token works",
          caption: "One Mint account defines the token while Token Accounts store balances."
        },
    
        {
          type: "paragraph",
          text: "When users receive tokens, they do not receive the Mint account itself. Each wallet owns one or more Token Accounts that hold balances for a specific SPL Token."
        }
    
      ]
    },
    {
      id: "mint-information",
    
      title: "What information is stored in the Mint account?",
    
      blocks: [
    
        {
          type: "paragraph",
          text: "Every SPL Token is defined by a Mint account. This account stores the core properties of the token and is shared by every wallet that owns it."
        },
    
        {
          type: "comparison",
    
          headers: [
            "Field",
            "Description"
          ],
    
          rows: [
            ["Token name", "The human-readable name of the token"],
            ["Symbol", "The ticker displayed by wallets and exchanges"],
            ["Decimals", "The number of decimal places supported"],
            ["Total supply", "The total number of minted tokens"],
            ["Mint Authority", "Controls whether new tokens can be minted"],
            ["Freeze Authority", "Can freeze token accounts if enabled"]
          ]
        },
    
        {
          type: "paragraph",
          text: "All of this information is stored on-chain and can be verified by anyone using blockchain explorers such as Solscan."
        }
    
      ]
    },
    {
      id: "where-are-tokens-stored",
    
      title: "Where are SPL Tokens stored?",
    
      blocks: [
    
        {
          type: "paragraph",
          text: "A common misconception is that SPL Tokens are stored directly inside a wallet. In reality, wallets do not store tokens."
        },
    
        {
          type: "callout",
          variant: "info",
          title: "Important",
          text: "A wallet only controls Token Accounts. Each Token Account stores the balance of one SPL Token on the blockchain."
        },
    
        {
          type: "paragraph",
          text: "For example, if you own SOL, USDC and a memecoin, your wallet controls multiple Token Accounts. Each account stores the balance of a different token."
        },
    
        {
          type: "paragraph",
          text: "This architecture allows one wallet to hold thousands of different SPL Tokens while keeping every balance independent."
        },
    
        {
          type: "image",
          src: "/docs/token-account.png",
          alt: "Example of a Token Account on Solscan",
          caption: "A Token Account stores the balance of one SPL Token and is owned by a wallet address."
        },
    
        {
          type: "paragraph",
          text: "Blockchain explorers such as Solscan allow anyone to inspect Token Accounts and verify balances directly on-chain."
        }
    
      ]
    },
    {
      id: "spl-vs-erc20",
    
      title: "SPL Token vs ERC-20",
    
      blocks: [
    
        {
          type: "paragraph",
          text: "SPL Tokens and ERC-20 tokens serve the same purpose: they define fungible tokens on their respective blockchains. However, they are built for different ecosystems and follow different technical standards."
        },
    
        {
          type: "comparison",
    
          headers: [
            "SPL Token",
            "ERC-20"
          ],
    
          rows: [
            ["Runs on Solana", "Runs on Ethereum"],
            ["Managed by the SPL Token Program", "Managed by ERC-20 smart contracts"],
            ["Very low transaction fees", "Fees depend on Ethereum network congestion"],
            ["Fast transaction finality", "Speed depends on the Ethereum network or Layer 2"],
            ["Uses Token Accounts", "Balances are managed by the ERC-20 contract"]
          ]
        },
    
        {
          type: "paragraph",
          text: "If you're familiar with Ethereum, you can think of SPL Tokens as Solana's equivalent of ERC-20 tokens. They solve the same problem but are implemented differently."
        }
    
      ]
    },
    {
      id: "common-misconceptions",
    
      title: "Common misconceptions",
    
      blocks: [
    
        {
          type: "paragraph",
          text: "Many beginners confuse how SPL Tokens work because the architecture is different from what they expect. Here are some of the most common misconceptions."
        },
    
        {
          type: "callout",
          variant: "warning",
          title: "Misconception #1",
          text: "SPL Tokens are stored inside my wallet."
        },
    
        {
          type: "paragraph",
          text: "Wallets do not store tokens directly. They control Token Accounts, which store token balances on the blockchain."
        },
    
        {
          type: "callout",
          variant: "warning",
          title: "Misconception #2",
          text: "Every SPL Token has its own smart contract."
        },
    
        {
          type: "paragraph",
          text: "Unlike Ethereum, most fungible tokens on Solana use the same SPL Token Program. Creating a new token usually does not require deploying a custom smart contract."
        },
    
        {
          type: "callout",
          variant: "warning",
          title: "Misconception #3",
          text: "Revoking Mint Authority deletes the token."
        },
    
        {
          type: "paragraph",
          text: "Revoking Mint Authority only prevents new tokens from being minted. Existing tokens continue to exist and can still be transferred normally."
        },
    
        {
          type: "callout",
          variant: "warning",
          title: "Misconception #4",
          text: "Every wallet can only have one Token Account."
        },
    
        {
          type: "paragraph",
          text: "A single wallet can control thousands of Token Accounts. Each Token Account holds the balance of one SPL Token."
        }
    
      ]
    },

  ],

  faq: [
    {
      question: "What is an SPL Token?",
      answer:
        "An SPL Token is the standard used to create fungible tokens on the Solana blockchain. It defines how wallets, exchanges and decentralized applications interact with tokens."
    },
  
    {
      question: "Are memecoins SPL Tokens?",
      answer:
        "Yes. Most memecoins launched on Solana are SPL Tokens created using the SPL Token Program."
    },
  
    {
      question: "What is the difference between a Mint account and a Token Account?",
      answer:
        "The Mint account defines the token itself, while Token Accounts store the balance owned by individual wallets."
    },
  
    {
      question: "Can I create an SPL Token without coding?",
      answer:
        "Yes. Platforms like Token Creator allow you to create an SPL Token directly from your wallet without writing any code."
    },
  
    {
      question: "Can an SPL Token have a fixed supply?",
      answer:
        "Yes. Once the initial supply has been minted, revoking the Mint Authority permanently prevents new tokens from being created."
    },
  
    {
      question: "Is an SPL Token the same as an ERC-20 token?",
      answer:
        "No. SPL Tokens run on Solana, while ERC-20 tokens run on Ethereum. They serve similar purposes but follow different technical standards."
    },
  
    {
      question: "Where can I verify an SPL Token?",
      answer:
        "You can verify an SPL Token using blockchain explorers such as Solscan or Solana Explorer. Information like the supply, decimals and authorities is publicly available on-chain."
    },
  
    {
      question: "What is the difference between SPL Token and Token2022?",
      answer:
        "Token2022 is an extension of the SPL Token standard that adds optional features such as transfer fees, metadata and confidential transfers while remaining compatible with the Solana ecosystem."
    }
  ]
};

export default article;