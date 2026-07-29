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
          },

          {
            id: "settings",
          
            title: "Understanding each vesting parameter",
          
            blocks: [
          
              {
                type: "paragraph",
          
                text:
                  "Every vesting contract is defined by a few simple parameters. Understanding what each one does will help you create a schedule that matches your project's goals."
              },
          
              {
                type: "comparison",
          
                headers: [
                  "Parameter",
                  "Purpose"
                ],
          
                rows: [
          
                  [
                    "Recipient",
                    "Wallet that will receive the tokens."
                  ],
          
                  [
                    "Start Date",
                    "When the vesting schedule begins."
                  ],
          
                  [
                    "Cliff",
                    "Period during which no tokens can be claimed."
                  ],
          
                  [
                    "End Date",
                    "When all locked tokens have been released."
                  ],
          
                  [
                    "Unlock Frequency",
                    "How often recipients can claim tokens."
                  ]
          
                ]
          
              }
          
            ]
          },

          {
            id: "recommendations",
          
            title: "Recommended vesting schedules",
          
            blocks: [
          
              {
                type: "comparison",
          
                headers: [
                  "Allocation",
                  "Cliff",
                  "Duration",
                  "Unlock"
                ],
          
                rows: [
          
                  [
                    "Founders",
                    "12 months",
                    "36 months",
                    "Monthly"
                  ],
          
                  [
                    "Core Team",
                    "6 months",
                    "24 months",
                    "Monthly"
                  ],
          
                  [
                    "Advisors",
                    "3 months",
                    "12 months",
                    "Monthly"
                  ],
          
                  [
                    "Marketing",
                    "None",
                    "6 months",
                    "Weekly"
                  ],
          
                  [
                    "Community Rewards",
                    "None",
                    "12 months",
                    "Weekly"
                  ]
          
                ]
          
              },
          
              {
                type: "callout",
          
                variant: "tip",
          
                title: "Good to know",
          
                text:
                  "These schedules are examples inspired by common practices across crypto projects. Adapt them to your own tokenomics."
          
              }
          
            ]
          },

          {
            id: "create",
          
            title: "Create the vesting contract",
          
            blocks: [
          
              {
                type: "paragraph",
          
                text:
                  "Token Creator guides you through each parameter before creating the Streamflow vesting contract."
              },
          
              {
                type: "image",
          
                src: "/docs/create-vesting-contract.png",
          
                alt: "Create vesting contract",
          
                caption:
                  "Configure the recipient, amount, dates and unlock schedule before creating the vesting contract."
              }
          
            ]
          },

          {
            id: "mistakes",
          
            title: "Common mistakes",
          
            blocks: [
          
              {
                type: "callout",
          
                variant: "warning",
          
                title: "Double-check before signing",
          
                text:
                  "Always verify the recipient wallet, token amount and dates. Once the vesting contract is created, these parameters cannot easily be changed."
          
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