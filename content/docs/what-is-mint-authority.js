const article = {
  slug: "what-is-mint-authority",

  category: "Beginner guide",

  title: "What is Mint Authority?",

  description:
    "Learn what mint authority is on Solana, why it matters for your token, and when you should revoke it.",


  readingTime: 6,

  publishedAt: "2026-07-20",
    
  updatedAt: "2026-07-20",

  keywords: [
    "Mint Authority",
    "Solana",
    "SPL Token",
    "Revoke Mint Authority",
    "Token Creator"
  ],

  sections: [
    {
      id: "what-is",
    
      title: "What is Mint Authority?",
    
      blocks: [
    
        {
          type: "definition",
          term: "Mint Authority",
          definition:
            "The permission that allows a wallet to mint additional tokens for an SPL Token."
        },
    
        {
          type: "paragraph",
          text: "Mint authority is the permission that allows a wallet to create new tokens for an SPL token mint. Whoever controls the mint authority can increase the token supply at any time."
        },
    
        {
          type: "paragraph",
          text: "When you create a token on Solana, your wallet is usually assigned as the initial mint authority. This gives you complete control over the supply until you decide to revoke that permission."
        }
    
      ]
    },

    {
      id: "why-important",
      title: "Why Mint Authority matters",
      paragraphs: [
        "Mint Authority is one of the first things experienced crypto investors check before buying a token.",
      
        "Imagine a token with a supply of 1,000,000 tokens. If the creator still controls the Mint Authority, they could mint another 10,000,000 tokens at any time. Existing holders would immediately own a much smaller percentage of the total supply.",
      
        "For this reason, many legitimate projects revoke their Mint Authority after minting the initial supply. A fixed supply provides stronger guarantees and improves transparency."
      ]
    },

    {
      id: "revoke",
    
      title: "What happens when you revoke Mint Authority?",
    
      blocks: [
    
        {
          type: "paragraph",
          text: "Revoking the mint authority permanently removes the ability to mint new tokens."
        },
    
        {
          type: "image",
          src: "/docs/mint-authority-diagram.svg",
          alt: "Comparison between an active and revoked Mint Authority",
          caption: "With an active Mint Authority, new tokens can be created. Once revoked, the supply becomes permanently fixed."
        },
    
        {
          type: "paragraph",
          text: "Once revoked, the total supply becomes fixed forever. No wallet, including the creator, can create additional tokens."
        },
    
        {
          type: "paragraph",
          text: "With Token Creator, you can revoke Mint Authority immediately after minting your initial supply, directly from your wallet."
        }
    
      ]
    }

    {
      id: "should-you",
    
      title: "Should you revoke Mint Authority?",
    
      blocks: [
    
        {
          type: "paragraph",
          text: "It depends on your project."
        },
    
        {
          type: "callout",
          variant: "tip",
          title: "Best practice",
          text: "If you are launching a memecoin or a fixed-supply community token, revoking the mint authority after minting the initial supply is generally considered best practice."
        },
    
        {
          type: "paragraph",
          text: "If your token will require future emissions, staking rewards or ecosystem incentives, you may decide to keep the mint authority active until those tokens have been distributed."
        }
    
      ]
    },

    {
      id: "verify",
      title: "How to verify Mint Authority",
      blocks: [

        {
          type: "paragraph",
          text: "Anyone can verify whether a token still has an active Mint Authority using blockchain explorers such as Solscan."
        },
    
        {
          type: "image",
          src: "/docs/mint-authority-solscan.png",
          alt: "Mint Authority field on Solscan",
          caption: "The Mint Authority field displayed on Solscan."
        },
    
        {
          type: "paragraph",
          text: "If the Mint Authority is set to null, no wallet can mint additional tokens."
        }
    
      ]
    },

    {
      id: "token-creator",
      title: "Manage Mint Authority with Token Creator",
      paragraphs: [
        "Token Creator allows you to revoke your mint authority with a few clicks directly from your wallet.",
        "The transaction is executed on-chain and remains permanently verifiable by anyone."
      ]
    },
    
    {
      id: "how-to",
    
      title: "Typical workflow",
    
      blocks: [
    
        {
          type: "steps",
        
          title: "Launch process",
        
          items: [
            {
              emoji: "🪙",
              title: "Create your token",
              description: "Choose the token name, symbol and initial supply.",
              badge: "~30 sec"
            },
            {
              emoji: "⚡",
              title: "Mint the supply",
              description: "Generate the initial supply on-chain."
            },
            {
              emoji: "🔒",
              title: "Revoke Mint Authority",
              description: "Prevent any future token minting.",
              badge: "Recommended"
            },
            {
              emoji: "🔍",
              title: "Verify on Solscan",
              description: "Confirm that the authority has been revoked."
            }
          ]
        },
        {
          type: "see-also",
        
          title: "Continue learning",
        
          links: [
            {
              label: "What is SPL token?",
              href: "/docs/what-is-spl-token"
            },
            {
              label: "What is Freeze Authority?",
              href: "/docs/what-is-freeze-authority"
            },
            {
              label: "How to Launch a Memecoin",
              href: "/docs/how-to-launch-a-memecoin-on-solana"
            }
          ]
        }
    
      ]
    },

    
  ],

  faq: [
    {
      question: "What is Mint Authority on Solana?",
      answer: "Mint authority is the permission that allows a wallet to create new tokens for an SPL token."
    },
    {
      question: "Can Mint Authority be restored?",
      answer: "No. Once the mint authority has been revoked, it cannot be restored. The token supply becomes permanently fixed."
    },
    {
      question: "Should I revoke Mint Authority for a memecoin?",
      answer: "In most cases, yes. A fixed supply increases transparency and is generally preferred by investors."
    },
    {
      question: "How can I verify if Mint Authority has been revoked?",
      answer: "You can check the token's mint authority on Solscan or another Solana explorer. The information is stored directly on-chain."
    }
  ],

  related: [
    "what-is-spl-token",
    "what-is-freeze-authority",
    "how-to-launch-a-memecoin-on-solana"
  ]
};

export default article;