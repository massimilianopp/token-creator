const article = {

    slug: "how-to-revoke-token-authorities",
  
    category: "Tutorials",
  
    title: "How to Revoke Mint Authority and Freeze Authority",
  
    description:
      "Learn when and why to revoke your token authorities, how to do it with Token Creator and how to verify the result on-chain.",
  
    readingTime: 8,
  
    publishedAt: "2026-07-29",
  
    updatedAt: "2026-07-29",
  
    keywords: [
      "Revoke Mint Authority",
      "Revoke Freeze Authority",
      "Token Creator",
      "Solana Token",
      "Mint Authority"
    ],


    sections: [

        {
            id: "before",
          
            title: "Before you start",
          
            blocks: [
          
              {
                type: "tutorial-info",
          
                time: "2 minutes",
          
                difficulty: "Beginner",
          
                cost: "Network fees only",
          
                requirements: [
                  "A Solana token",
                  "Mint Authority or Freeze Authority",
                  "Connected wallet"
                ]
              }
          
            ]
          },

          {
            id: "what-is",
          
            title: "What does revoking an authority mean?",
          
            blocks: [
          
              {
                type: "paragraph",
          
                text:
                  "Revoking an authority permanently removes a specific permission from your token. Once revoked, no wallet can perform that action anymore."
              },
          
              {
                type: "diagram",
          
                src: "/docs/revoke-authority-diagram.svg",
          
                alt: "Before and after revoking an authority",
          
                caption:
                  "After an authority is revoked, no wallet controls that permission anymore."
              }
          
            ]
          },

          {
            id: "mint",
          
            title: "Should you revoke Mint Authority?",
          
            blocks: [
          
              {
                type: "paragraph",
          
                text:
                  "If you want a fixed supply token, revoking the Mint Authority prevents anyone from creating additional tokens in the future."
              },
          
              {
                type: "callout",
          
                variant: "tip",
          
                title: "Recommended for most memecoins",
          
                text:
                  "Most community tokens revoke the Mint Authority to prove that the supply can never increase."
              }
          
            ]
          },

          {
            id: "freeze",
          
            title: "Should you revoke Freeze Authority?",
          
            blocks: [
          
              {
                type: "paragraph",
          
                text:
                  "Revoking the Freeze Authority ensures that no wallet can freeze token accounts. This increases decentralization and reassures holders."
              },
          
              {
                type: "callout",
          
                variant: "tip",
          
                title: "Common practice",
          
                text:
                  "Many community projects revoke the Freeze Authority after launch."
              }
          
            ]
          },

          {
            id: "keep",
          
            title: "When should you keep an authority?",
          
            blocks: [
          
              {
                type: "comparison",
          
                headers: [
                  "Situation",
                  "Recommendation"
                ],
          
                rows: [
          
                  [
                    "Fixed supply memecoin",
                    "Revoke both authorities"
                  ],
          
                  [
                    "Stablecoin",
                    "Keep Mint Authority"
                  ],
          
                  [
                    "Token with compliance rules",
                    "Keep Freeze Authority"
                  ],
          
                  [
                    "Token still in development",
                    "Consider keeping both temporarily"
                  ]
          
                ]
          
              }
          
            ]
          },

          {
            id: "revoke",
          
            title: "Revoke an authority in Token Creator",
          
            blocks: [
          
              {
                type: "paragraph",
          
                text:
                  "Open your token, choose the authority you want to revoke and confirm the transaction. The change is immediately recorded on-chain."
              },
          
              {
                type: "image",
          
                src: "/docs/revoke-authority.png",
          
                alt: "Revoke authority in Token Creator",
          
                caption:
                  "Token Creator lets you revoke authorities with a single transaction."
              }
          
            ]
          },

          {
            id: "verify",
          
            title: "Verify the revocation",
          
            blocks: [
          
              {
                type: "paragraph",
          
                text:
                  "After the transaction is confirmed, verify your token on Solscan. The authority field should now indicate that no authority exists."
              },
          
              {
                type: "image",
          
                src: "/docs/revoke-solscan.png",
          
                alt: "Authority revoked on Solscan",
          
                caption:
                  "Solscan shows when an authority has been permanently revoked."
              }
          
            ]
          },

          {
            id: "mistakes",
          
            title: "Common mistakes",
          
            blocks: [
          
              {
                type: "comparison",
          
                headers: [
                  "Mistake",
                  "Consequence"
                ],
          
                rows: [
          
                  [
                    "Revoking too early",
                    "You can no longer mint or freeze tokens."
                  ],
          
                  [
                    "Keeping authorities forever",
                    "Some investors may see this as a risk."
                  ]
          
                ]
          
              },
          
              {
                type: "callout",
          
                variant: "warning",
          
                title: "Permanent action",
          
                text:
                  "Revoking an authority cannot be undone. Make sure you no longer need that permission before signing the transaction."
              }
          
            ]
          }

        

    ],

    faq: [

        {
          question:"Can I restore a revoked authority?",
      
          answer:"No. Revoking an authority is permanent."
        },
      
        {
          question:"Should every token revoke Mint Authority?",
      
          answer:"No. It depends on whether your project requires a fixed or flexible supply."
        },
      
        {
          question:"Should every token revoke Freeze Authority?",
      
          answer:"Not necessarily. Some regulated or permissioned projects intentionally keep the Freeze Authority."
        },
      
        {
          question:"Can I revoke only one authority?",
      
          answer:"Yes. Mint Authority and Freeze Authority are independent."
        }
      
      ],

      related: [

        "what-is-mint-authority",
      
        "what-is-freeze-authority",
      
        "how-to-create-a-solana-token",
      
        "how-to-launch-a-memecoin-on-solana"
      
      ]

};

export default article;