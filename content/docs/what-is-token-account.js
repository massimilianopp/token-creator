const article = {
    slug: "what-is-token-account",
  
    category: "Beginner guide",
  
    title: "What is a Token Account?",
  
    description:
      "Learn what a Token Account is on Solana, why every wallet needs one, and how it differs from the Mint Account.",
  
    readingTime: 7,
  
    publishedAt: "2026-07-25",
  
    updatedAt: "2026-07-25",
  
    keywords: [
      "Token Account",
      "Solana",
      "SPL Token",
      "Mint Account",
      "Associated Token Account"
    ],
  
    sections: [
  
      {
        id: "what-is",
  
        title: "What is a Token Account?",
  
        blocks: [
  
          {
            type: "definition",
            term: "Token Account",
            definition:
              "A Token Account stores the balance of a specific SPL Token owned by a wallet."
          },
  
          {
            type: "paragraph",
            text:
              "Unlike the Mint Account, which defines the token itself, a Token Account represents ownership of that token by a particular wallet."
          },
  
          {
            type: "paragraph",
            text:
              "Every wallet that holds an SPL Token has its own Token Account for that token."
          }
  
        ]
      },
  
      {
        id: "why",
  
        title: "Why are Token Accounts needed?",
  
        paragraphs: [
  
          "The Mint Account only stores information about the token, such as its total supply, decimals and authorities.",
  
          "Individual balances are stored separately inside Token Accounts.",
  
          "This design allows millions of wallets to own the same token without modifying the Mint Account itself."
  
        ]
      },
  
      {
        id: "comparison",
  
        title: "Mint Account vs Token Account",
  
        blocks: [
  
          {
            type: "comparison",
  
            headers: [
              "Feature",
              "Mint Account",
              "Token Account"
            ],
  
            rows: [
  
              [
                "Stores token information",
                "✅",
                "❌"
              ],
  
              [
                "Stores wallet balance",
                "❌",
                "✅"
              ],
  
              [
                "One per token",
                "✅",
                "❌"
              ],
  
              [
                "Owned by a wallet",
                "❌",
                "✅"
              ]
  
            ]
  
          }
  
        ]
  
      },
  
      {
        id: "view",
  
        title: "How to view a Token Account",
  
        blocks: [
  
          {
            type: "paragraph",
            text:
              "Blockchain explorers such as Solscan display every Token Account associated with a wallet."
          },
  
          {
            type: "image",
            src: "/docs/token-account-solscan.png",
            alt: "Token Account displayed on Solscan",
            caption: "Example of a Token Account on Solscan."
          }
  
        ]
  
      },
  
      {
        id: "token-creator",
  
        title: "How Token Creator uses Token Accounts",
  
        paragraphs: [
  
          "When you mint tokens using Token Creator, the initial supply is deposited into your wallet's Token Account.",
  
          "Future transfers simply move tokens from one Token Account to another."
  
        ]
  
      },
  
      {
        id: "workflow",
  
        title: "Typical lifecycle",
  
        blocks: [
  
          {
            type: "steps",
  
            title: "How tokens move",
  
            items: [
  
              {
                emoji: "🪙",
                title: "Create an SPL Token",
                description:
                  "A Mint Account is created."
              },
  
              {
                emoji: "👛",
                title: "Create a Token Account",
                description:
                  "The wallet receives an account for this token."
              },
  
              {
                emoji: "⚡",
                title: "Mint tokens",
                description:
                  "The balance appears inside the Token Account."
              },
  
              {
                emoji: "↔️",
                title: "Transfer tokens",
                description:
                  "Balances move between Token Accounts."
              }
  
            ]
  
          }
  
        ]
  
      }
  
    ],
  
    faq: [
  
      {
        question: "What is a Token Account?",
        answer:
          "A Token Account stores the balance of an SPL Token for a specific wallet."
      },
  
      {
        question: "Is a Token Account the same as a wallet?",
        answer:
          "No. A wallet can own many Token Accounts, one for each SPL Token."
      },
  
      {
        question: "Can two wallets share the same Token Account?",
        answer:
          "No. Each Token Account belongs to a specific owner."
      },
  
      {
        question: "How do I find my Token Account?",
        answer:
          "You can view Token Accounts using Solscan or another Solana explorer."
      }
  
    ],
  
    related: [
      "what-is-spl-token",
      "what-is-mint-authority",
      "what-is-freeze-authority"
    ]
  
  };
  
  export default article;