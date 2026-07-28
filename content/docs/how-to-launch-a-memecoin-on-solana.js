const article = {

    slug: "how-to-launch-a-memecoin-on-solana",
  
    category: "Tutorials",
  
    title: "How to Launch a Memecoin on Solana",
  
    description:
      "Learn how to launch a memecoin on Solana, from creating the token to adding liquidity and verifying everything on-chain.",
  
    readingTime: 10,
  
    publishedAt: "2026-07-27",
  
    updatedAt: "2026-07-27",
  
    keywords: [
      "Launch Memecoin",
      "Create Memecoin",
      "Solana Memecoin",
      "Liquidity Pool",
      "Token Creator"
    ],
  
    sections: [
  
      {
        id: "before",
  
        title: "Before you start",
  
        blocks: [
  
          {
            type: "tutorial-info",
  
            time: "10 minutes",
  
            difficulty: "Beginner",
  
            cost: "0.05 SOL + network fees",
  
            requirements: [
              "Phantom wallet",
              "Some SOL",
              "Token name",
              "Token logo",
              "Initial liquidity"
            ]
          }
  
        ]
      },
  
      {
        id: "identity",
  
        title: "1. Create your token",
  
        blocks: [
  
          {
            type: "paragraph",
            text:
              "Start by creating your SPL Token. Choose a name, symbol, description and upload a logo. This information becomes your token's on-chain metadata."
          },
  
          {
            type: "image",
            src: "/docs/create-token-identity.png",
            alt: "Create a memecoin",
            caption:
              "Configure your token identity before creating the token."
          }
  
        ]
      },
  
      {
        id: "supply",
  
        title: "2. Review supply and fees",
  
        blocks: [
  
          {
            type: "paragraph",
            text:
              "Choose the initial supply and decimals. Before signing the transaction, Token Creator displays all fees so you know exactly what you are paying."
          },
  
          {
            type: "image",
            src: "/docs/create-token-supply-fees.png",
            alt: "Supply and fees",
            caption:
              "Review the token supply and transaction costs."
          }
  
        ]
      },
  
      {
        id: "secure",
  
        title: "3. Secure your token",
  
        blocks: [
  
          {
            type: "paragraph",
            text:
              "After creating the token, revoke the Mint Authority if you want a permanently fixed supply. Many projects also revoke the Freeze Authority to increase transparency."
          },
  
          {
            type: "callout",
            variant: "tip",
            title: "Best practice",
            text:
              "Most community memecoins revoke both Mint Authority and Freeze Authority after launch."
          }
  
        ]
      },
  
      {
        id: "liquidity",
  
        title: "4. Create your liquidity pool",
  
        blocks: [
  
          {
            type: "paragraph",
            text:
              "A token cannot be traded until liquidity is available. Deposit your token and SOL into a liquidity pool to establish the initial market price."
          },
          
          {
            type: "diagram",
            src: "/docs/memecoin-launch-flow.svg",
            caption: "From token creation to public trading."
          },
          
          {
            type: "image",
            src: "/docs/create-liquidity-pool.png",
            alt: "Create liquidity pool",
            caption:
              "Create the initial liquidity pool directly from Token Creator."
          },

          {
            type: "see-also",
          
            title: "Need help choosing your pool settings?",
          
            links: [
              {
                label: "How to Create a Liquidity Pool",
                href: "/docs/how-to-create-a-liquidity-pool"
              }
            ]
          }
  
        ]
      },
  
      {
        id: "verify",
  
        title: "5. Verify everything",
  
        blocks: [
  
          {
            type: "paragraph",
            text:
              "Before announcing your launch, verify your token on Solscan and confirm that the metadata, supply, authorities and liquidity are correct."
          },
  
          {
            type: "callout",
            variant: "info",
            title: "Launch checklist",
            text:
              "Metadata uploaded ✓ Supply verified ✓ Authorities configured ✓ Liquidity added ✓"
          }
  
        ]
      }
  
    ],
  
    faq: [
  
      {
        question: "How much SOL do I need to launch a memecoin?",
        answer:
          "You need enough SOL to create the token, pay the network fees and provide your initial liquidity."
      },
  
      {
        question: "Should I revoke Mint Authority?",
        answer:
          "Most fixed-supply memecoins revoke Mint Authority after launch so no additional tokens can ever be minted."
      },
  
      {
        question: "Why do I need a liquidity pool?",
        answer:
          "Without liquidity, other users cannot buy or sell your token on decentralized exchanges."
      },
  
      {
        question: "Can I launch a memecoin without coding?",
        answer:
          "Yes. Token Creator lets you create the token and liquidity pool directly from your browser."
      }
  
    ],
  
    related: [
  
      "how-to-create-a-solana-token",
  
      "what-is-mint-authority",
  
      "what-is-freeze-authority",
  
      "what-is-token-metadata"
  
    ]
  
  };
  
  export default article;