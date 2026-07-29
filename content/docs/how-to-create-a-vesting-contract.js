const article = {

    slug: "how-to-create-a-vesting-contract",
  
    category: "Tutorials",
  
    title: "How to Create a Vesting Contract on Solana",
  
    description:
      "Learn how to lock tokens with a vesting contract, choose the right parameters and distribute tokens securely using Streamflow.",
  
    readingTime: 10,
  
    publishedAt: "2026-07-29",
  
    updatedAt: "2026-07-29",
  
    keywords: [
      "Vesting Contract",
      "Streamflow",
      "Token Vesting",
      "Solana",
      "Token Creator"
    ],
  
    sections: [

        {
            id: "before",
          
            title: "Before you start",
          
            blocks: [
          
              {
                type: "tutorial-info",
          
                time: "5 minutes",
          
                difficulty: "Beginner",
          
                cost: "0.05 SOL + Streamflow fees",
          
                requirements: [
                  "An SPL Token",
                  "Tokens to lock",
                  "Recipient wallet",
                  "Connected wallet"
                ]
              }
          
            ]
          },

          {
            id: "what-is",
          
            title: "What is a vesting contract?",
          
            blocks: [
          
              {
                type: "paragraph",
          
                text:
                  "A vesting contract locks tokens and releases them gradually over time according to a predefined schedule."
              },
          
              {
                type: "paragraph",
          
                text:
                  "Instead of sending all tokens immediately, projects can distribute them progressively to founders, team members, advisors or investors."
              }
          
            ]
          },

          {
            id: "why",
          
            title: "Why use vesting?",
          
            blocks: [
          
              {
                type: "comparison",
          
                headers: [
                  "Allocation",
                  "Typical use"
                ],
          
                rows: [
          
                  [
                    "Founders",
                    "Long-term commitment"
                  ],
          
                  [
                    "Team",
                    "Employee incentives"
                  ],
          
                  [
                    "Advisors",
                    "Gradual compensation"
                  ],
          
                  [
                    "Investors",
                    "Controlled token distribution"
                  ]
          
                ]
          
              },
          
              {
                type: "callout",
          
                variant: "tip",
          
                title: "Why investors like vesting",
          
                text:
                  "A vesting schedule demonstrates that large token holders cannot immediately sell their entire allocation."
          
              }
          
            ]
          },

          {
            id: "parameters",
          
            title: "Choosing the right vesting parameters",
          
            blocks: [
          
              {
                type: "comparison",
          
                headers: [
                  "Project",
                  "Suggested vesting"
                ],
          
                rows: [
          
                  [
                    "Memecoin",
                    "12–24 months"
                  ],
          
                  [
                    "Utility token",
                    "24–48 months"
                  ],
          
                  [
                    "DAO Treasury",
                    "Custom"
                  ],
          
                  [
                    "Advisor allocation",
                    "6–12 months"
                  ]
          
                ]
          
              },
          
              {
                type: "callout",
          
                variant: "info",
          
                title: "Recommendation",
          
                text:
                  "These examples reflect common industry practices. Every project has different goals, so your vesting schedule should match your tokenomics."
          
              }
          
            ]
          }


  
    ],
  
    faq: [
  
    ],
  
    related: [
      "how-to-create-a-solana-token",
      "how-to-create-a-liquidity-pool",
      "how-to-launch-a-memecoin-on-solana"
    ]
  
  };
  
  export default article;