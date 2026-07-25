const article = {
    slug: "what-is-freeze-authority",
  
    category: "Beginner guide",
  
    title: "What is Freeze Authority?",
  
    description:
      "Learn what Freeze Authority is on Solana, when it should be revoked, and why investors pay close attention to it.",
  
    readingTime: 6,
  
    publishedAt: "2026-07-25",
  
    updatedAt: "2026-07-25",
  
    keywords: [
      "Freeze Authority",
      "Solana",
      "SPL Token",
      "Revoke Freeze Authority",
      "Token Creator"
    ],
  
    sections: [
  
      {
        id: "what-is",
  
        title: "What is Freeze Authority?",
  
        blocks: [
  
          {
            type: "definition",
            term: "Freeze Authority",
            definition:
              "The permission that allows a wallet to freeze and unfreeze token accounts belonging to an SPL Token."
          },
  
          {
            type: "paragraph",
            text:
              "Freeze Authority gives a wallet the ability to freeze token accounts. When an account is frozen, it cannot send, receive or transfer tokens until it is unfrozen."
          },
  
          {
            type: "paragraph",
            text:
              "When creating an SPL Token, the creator may assign a Freeze Authority. The authority can later be revoked permanently if it is no longer needed."
          }
  
        ]
      },
  
      {
        id: "why",
  
        title: "Why does Freeze Authority matter?",
  
        paragraphs: [
  
          "Freeze Authority is another permission that experienced investors usually verify before buying a token.",
  
          "If the Freeze Authority is still active, the authority holder can freeze any token account. Although this can be useful for regulated projects, it also introduces a level of centralization.",
  
          "Many community tokens and memecoins revoke Freeze Authority to reassure holders that no account can ever be frozen."
  
        ]
      },
  
      {
        id: "revoke",
  
        title: "What happens when you revoke Freeze Authority?",
  
        blocks: [
  
          {
            type: "paragraph",
            text:
              "Revoking Freeze Authority permanently removes the ability to freeze token accounts."
          },
  
          {
            type: "paragraph",
            text:
              "After revocation, every holder can freely transfer their tokens without the risk of their account being frozen by the token creator."
          }
  
        ]
      },
  
      {
        id: "should",
  
        title: "Should you revoke Freeze Authority?",
  
        blocks: [
  
          {
            type: "paragraph",
            text:
              "The answer depends on your project."
          },
  
          {
            type: "callout",
            variant: "tip",
            title: "Best practice",
            text:
              "For most memecoins, community tokens and fair launches, revoking Freeze Authority is considered best practice because it guarantees that token accounts cannot be frozen in the future."
          },
  
          {
            type: "paragraph",
            text:
              "Projects operating under regulatory requirements may choose to keep Freeze Authority active."
          }
  
        ]
      },
  
      {
        id: "verify",
  
        title: "How to verify Freeze Authority",
  
        blocks: [
  
          {
            type: "paragraph",
            text:
              "Anyone can verify whether a token still has an active Freeze Authority using Solscan or another Solana explorer."
          },
  
          {
            type: "image",
            src: "/docs/freeze-authority-solscan.png",
            alt: "Freeze Authority field on Solscan",
            caption:
              "The Freeze Authority field displayed on Solscan."
          },
  
          {
            type: "paragraph",
            text:
              "If the Freeze Authority is set to null, no wallet can freeze token accounts."
          }
  
        ]
      },
  
      {
        id: "token-creator",
  
        title: "Manage Freeze Authority with Token Creator",
  
        paragraphs: [
  
          "Token Creator allows you to revoke Freeze Authority directly from your wallet.",
  
          "The transaction is executed on-chain and can be verified by anyone."
  
        ]
      },
  
      {
        id: "workflow",
  
        title: "Typical workflow",
  
        blocks: [
  
          {
            type: "steps",
  
            title: "Recommended launch process",
  
            items: [
  
              {
                emoji: "🪙",
                title: "Create your token",
                description:
                  "Deploy your SPL Token.",
                badge: "~30 sec"
              },
  
              {
                emoji: "⚡",
                title: "Mint the initial supply",
                description:
                  "Create the initial token supply."
              },
  
              {
                emoji: "🧊",
                title: "Revoke Freeze Authority",
                description:
                  "Prevent any future account freezing.",
                badge: "Recommended"
              },
  
              {
                emoji: "🔍",
                title: "Verify on Solscan",
                description:
                  "Confirm that Freeze Authority is null."
              }
  
            ]
  
          },
  
          {
            type: "see-also",
  
            title: "Continue learning",
  
            links: [
  
              {
                label: "What is SPL Token?",
                href: "/docs/what-is-spl-token"
              },
  
              {
                label: "What is Mint Authority?",
                href: "/docs/what-is-mint-authority"
              },
  
              {
                label: "How to Launch a Memecoin",
                href: "/docs/how-to-launch-a-memecoin-on-solana"
              }
  
            ]
  
          }
  
        ]
      }
  
    ],
  
    faq: [
  
      {
        question: "What is Freeze Authority?",
        answer:
          "Freeze Authority is the permission that allows a wallet to freeze and unfreeze token accounts."
      },
  
      {
        question: "Should I revoke Freeze Authority?",
        answer:
          "For most community tokens and memecoins, yes. Revoking Freeze Authority removes the possibility of freezing token accounts."
      },
  
      {
        question: "Can Freeze Authority be restored?",
        answer:
          "No. Once revoked, Freeze Authority cannot be restored."
      },
  
      {
        question: "How can I verify Freeze Authority?",
        answer:
          "You can verify it using Solscan or another Solana blockchain explorer."
      }
  
    ],
  
    related: [
  
      "what-is-spl-token",
  
      "what-is-mint-authority",
  
      "how-to-launch-a-memecoin-on-solana"
  
    ]
  
  };
  
  export default article;