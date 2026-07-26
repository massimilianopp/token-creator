const article = {
    slug: "what-is-associated-token-account",
  
    category: "Beginner guide",
  
    title: "What is an Associated Token Account?",
  
    description:
      "Learn what an Associated Token Account (ATA) is, why every wallet has one for each token, and how it simplifies token transfers on Solana.",
  
    readingTime: 7,
  
    publishedAt: "2026-07-26",
  
    updatedAt: "2026-07-26",
  
    keywords: [
      "Associated Token Account",
      "ATA",
      "Solana",
      "Token Account",
      "SPL Token"
    ],
  
    sections: [
  
      {
        id: "definition",
  
        title: "What is an Associated Token Account?",
  
        blocks: [
  
          {
            type: "definition",
            term: "Associated Token Account (ATA)",
            definition:
              "The standard Token Account automatically derived for a wallet and a specific SPL Token."
          },
  
          {
            type: "paragraph",
            text:
              "Every wallet can own one standard Token Account for each SPL Token. This account is called the Associated Token Account, or ATA."
          },
  
          {
            type: "paragraph",
            text:
              "Because its address is deterministic, anyone can calculate it from the wallet address and the token mint."
          }
  
        ]
  
      },
  
      {
        id: "why",
  
        title: "Why are Associated Token Accounts useful?",
  
        paragraphs: [
  
          "Without a standard account, wallets could own multiple Token Accounts for the same token, making transfers more complicated.",
  
          "The ATA standard ensures there is a predictable destination for receiving tokens.",
  
          "Most wallets and applications automatically use the Associated Token Account."
  
        ]
  
      },
  
      {
        id: "comparison",
  
        title: "Token Account vs Associated Token Account",
  
        blocks: [
  
          {
            type: "comparison",
  
            headers: [
              "Feature",
              "Token Account",
              "Associated Token Account"
            ],
  
            rows: [
  
              ["Stores token balance", "✅", "✅"],
  
              ["Standard account", "❌", "✅"],
  
              ["Deterministic address", "❌", "✅"],
  
              ["Automatically used by wallets", "❌", "✅"]
  
            ]
  
          }
  
        ]
  
      },
  
      {
        id: "creation",
  
        title: "Who creates the ATA?",
  
        blocks: [
  
          {
            type: "paragraph",
            text:
              "If a wallet does not already have an Associated Token Account, the sender or the application can create it before transferring tokens."
          },
  
          {
            type: "callout",
            variant: "tip",
            title: "Good to know",
            text:
              "Creating an ATA requires a small amount of SOL to pay for the account on the blockchain."
          }
  
        ]
  
      },
  
      {
        id: "solscan",
  
        title: "How to view an ATA",
  
        blocks: [
  
          {
            type: "paragraph",
            text:
              "Blockchain explorers such as Solscan display the Associated Token Account for each wallet."
          },
  
          {
            type: "image",
            src: "/docs/ata.png",
            alt: "Associated Token Account diagram",
            caption:
              "Each wallet owns one Associated Token Account for each SPL Token."
          }
  
        ]
  
      },
  
      {
        id: "tokencreator",
  
        title: "How Token Creator uses ATAs",
  
        paragraphs: [
  
          "Token Creator automatically sends newly minted tokens to your wallet's Associated Token Account.",
  
          "Most users never need to create an ATA manually because compatible wallets and applications handle it automatically."
  
        ]
  
      },
  
      {
        id: "workflow",
  
        title: "Typical workflow",
  
        blocks: [
  
          {
            type: "steps",
  
            title: "Receiving a token",
  
            items: [
  
              {
                emoji: "👛",
                title: "Open your wallet",
                description:
                  "Your wallet has a public address."
              },
  
              {
                emoji: "🧾",
                title: "Create the ATA",
                description:
                  "If necessary, the ATA is created automatically."
              },
  
              {
                emoji: "🪙",
                title: "Receive tokens",
                description:
                  "Your balance appears in the ATA."
              },
  
              {
                emoji: "↔️",
                title: "Transfer tokens",
                description:
                  "Future transfers use the same ATA."
              }
  
            ]
  
          }
  
        ]
  
      }
  
    ],
  
    faq: [
  
      {
        question: "What is an Associated Token Account?",
        answer:
          "It is the standard Token Account associated with one wallet and one SPL Token."
      },
  
      {
        question: "Can I have multiple ATAs for the same token?",
        answer:
          "The ATA standard defines one canonical account, although additional Token Accounts can also exist."
      },
  
      {
        question: "Who pays for creating an ATA?",
        answer:
          "The account creator pays a small amount of SOL to create the account on-chain."
      },
  
      {
        question: "Do wallets create ATAs automatically?",
        answer:
          "Most modern Solana wallets and applications do."
      }
  
    ],
  
    related: [
  
      "what-is-token-account",
  
      "what-is-spl-token",
  
      "what-is-mint-authority"
  
    ]
  
  };
  
  export default article;