const article = {

    slug: "how-to-create-a-liquidity-pool",
  
    category: "Tutorials",
  
    title: "How to Create a Liquidity Pool on Solana",
  
    description:
      "Learn how to create a liquidity pool on Solana, set your token's initial price and make it tradable on decentralized exchanges.",
  
    readingTime: 9,
  
    publishedAt: "2026-07-28",
  
    updatedAt: "2026-07-28",
  
    keywords: [
      "Liquidity Pool",
      "Solana Liquidity",
      "Create Liquidity Pool",
      "AMM",
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
  
            difficulty: "Intermediate",
  
            cost: "0.1% + network fees",
  
            requirements: [
              "A Solana token",
              "Some SOL",
              "A connected wallet"
            ]
          }
  
        ]
      },
  
      {
        id: "what",
  
        title: "What is a liquidity pool?",
  
        blocks: [
  
          {
            type: "paragraph",
            text:
              "A liquidity pool contains two assets that traders can exchange without relying on a traditional order book. For most new Solana tokens, the pool consists of your token and SOL."
          },
  
          {
            type: "diagram",
            src: "/docs/liquidity-pool-diagram.svg",
            caption:
              "A liquidity pool holds both your token and SOL."
          }
  
        ]
      },
  
      {
        id: "why",
  
        title: "Why do you need a liquidity pool?",
  
        blocks: [
  
          {
            type: "paragraph",
            text:
              "Creating a token does not automatically make it tradable. Until liquidity is added, other users cannot easily buy or sell your token on decentralized exchanges."
          },
  
          {
            type: "callout",
            variant: "info",
            title: "Important",
            text:
              "Without liquidity, your token exists on-chain but cannot be traded efficiently."
          }
  
        ]
      },
  
      {
        id: "create",
  
        title: "Create your liquidity pool",
  
        blocks: [
  
          {
            type: "paragraph",
            text:
              "Choose the token, the amount of tokens to deposit and the amount of SOL you want to pair with it. Together, these deposits determine your token's initial market price."
          },
  
          {
            type: "image",
            src: "/docs/create-liquidity-pool.png",
            alt: "Create liquidity pool in Token Creator",
            caption:
              "Configure your initial liquidity directly from Token Creator."
          }
  
        ]
      },
  
      {
        id: "price",
  
        title: "How is the initial price determined?",
  
        blocks: [
  
          {
            type: "paragraph",
            text:
              "The initial price depends on the ratio between the amount of tokens and the amount of SOL deposited into the pool. Adding more SOL relative to your token increases the starting price."
          },
  
          {
            type: "callout",
            variant: "tip",
            title: "Remember",
            text:
              "The market price will change immediately once people start trading."
          }
  
        ]
      },
  
      {
        id: "verify",
  
        title: "Verify your liquidity",
  
        paragraphs: [
  
          "After creating the pool, verify that your token is tradable on supported decentralized exchanges.",
  
          "You can also confirm that the liquidity pool was successfully created using Solscan."
  
        ]
      },
  
      {
        id: "mistakes",
  
        title: "Common mistakes",
  
        blocks: [
  
          {
            type: "callout",
  
            variant: "warning",
  
            title: "Avoid these mistakes",
  
            text:
              "Double-check the amount of tokens and SOL before creating the pool. Your initial deposits determine the starting market price."
  
          }
  
        ]
      }
  
    ],
  
    faq: [
  
      {
        question: "Why can't people trade my token?",
  
        answer:
          "Your token needs liquidity before it can be traded efficiently on decentralized exchanges."
  
      },
  
      {
        question: "Can I change the initial price later?",
  
        answer:
          "The market price changes naturally through trading, but your initial deposits determine the starting price."
  
      },
  
      {
        question: "Why do I need SOL?",
  
        answer:
          "Most new Solana liquidity pools pair the token with SOL, allowing traders to exchange between the two assets."
  
      },
  
      {
        question: "Can I create a liquidity pool without coding?",
  
        answer:
          "Yes. Token Creator lets you create a liquidity pool directly from your browser."
  
      }
  
    ],
  
    related: [
  
      "how-to-create-a-solana-token",
  
      "how-to-launch-a-memecoin-on-solana",
  
      "what-is-token-metadata",
  
      "what-is-mint-authority"
  
    ]
  
  };
  
  export default article;