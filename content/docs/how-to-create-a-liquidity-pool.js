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
  
            cost: "~0.25 SOL + 0.1% service fee",
  
            requirements: [
              "A Solana token",
              "Some SOL",
              "A connected wallet"
            ]
          }
  
        ]
      },
  
      {
        id: "understanding",
      
        title: "Understanding liquidity pools",
      
        blocks: [
      
          {
            type: "paragraph",
            text:
              "A liquidity pool contains two assets that traders can exchange without relying on a traditional order book. For most new Solana tokens, this pair consists of your token and SOL."
          },
      
          {
            type: "paragraph",
            text:
              "Token Creator creates an Orca Whirlpool, one of the most widely used decentralized exchanges (DEXs) on Solana. Orca uses concentrated liquidity to make trading more capital efficient."
          },
      
          {
            type: "diagram",
            src: "/docs/initial-price-diagram.svg",
            caption:
              "A liquidity pool contains both your token and SOL."
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
          },

          {
            type:"paragraph",
          
            text:
            "Without a liquidity pool, your token exists on-chain but most users cannot easily buy or sell it through wallets and decentralized exchanges."
          }
  
        ]
      },

      {
        id:"initial-price",
      
        title:"Understanding the initial price",
      
        blocks:[
      
          {
            type:"paragraph",
      
            text:
            "When launching a brand-new token, you are defining its first market price."
          },
      
          {
            type:"paragraph",
      
            text:
            "The Initial Price, Token Amount and SOL Amount all describe the same relationship. Changing one value automatically updates the others because they represent the ratio between the two assets deposited into the pool."
          },
      
          {
            type:"comparison",
      
            headers:[
              "Tokens",
              "SOL",
              "Initial Price"
            ],
      
            rows:[
      
              [
                "1,000,000",
                "10",
                "0.00001 SOL"
              ],
      
              [
                "1,000,000",
                "50",
                "0.00005 SOL"
              ],
      
              [
                "10,000,000",
                "50",
                "0.000005 SOL"
              ]
      
            ]
          },
      
          {
            type:"image",
      
            src:"/docs/create-liquidity-pool.png",
      
            alt:"Liquidity pool settings",
      
            caption:
            "Choose the trading pair, initial price and liquidity directly from Token Creator."
          },
      
          {
            type:"callout",
      
            variant:"info",
      
            title:"How Token Creator works",
      
            text:
            "You can edit the Initial Price, Token Amount or SOL Amount. These values stay synchronized because they all represent the same price ratio."
          }
      
        ]
      },

      {
        id:"liquidity-size",
      
        title:"How much liquidity should you add?",
      
        blocks:[
      
          {
            type:"paragraph",
      
            text:
            "There is no universal amount of liquidity. The right choice depends on your project, budget and launch strategy."
          },
      
          {
            type:"comparison",
      
            headers:[
              "Liquidity",
              "Advantages",
              "Trade-offs"
            ],
      
            rows:[
      
              [
                "Small",
                "Lower capital required",
                "Higher price volatility"
              ],
      
              [
                "Medium",
                "Balanced launch",
                "Requires more capital"
              ],
      
              [
                "Large",
                "Lower slippage",
                "Higher initial investment"
              ]
      
            ]
      
          },

          {
            type:"paragraph",
          
            text:
            "Adding too little liquidity increases slippage, meaning even small trades can move the market price significantly."
          },
      
          {
            type:"callout",
      
            variant:"tip",
      
            title:"Remember",
      
            text:
            "More liquidity generally creates a better trading experience because large trades have less impact on the market price."
      
          }

          
      
        ]
      },

      {
        id:"pricing",
      
        title:"Avoid pricing mistakes",
      
        blocks:[
      
            {
                type:"paragraph",
              
                text:
                "If this is the first liquidity pool for your token, you are free to choose its starting price."
              },
      
              {
                type:"paragraph",
              
                text:
                "If your token is already trading elsewhere, try to use a similar starting price. Otherwise arbitrage traders may quickly buy or sell against your pool until prices converge."
              },
      
          {
            type:"callout",
      
            variant:"warning",
      
            title:"Important",
      
            text:
            "Large price differences between liquidity pools are usually corrected very quickly by arbitrage trading."
      
          }
      
        ]
      },
  
      
  
      {
        id:"create",
      
        title:"Create your liquidity pool",
      
        blocks:[
      
          {
            type:"paragraph",
      
            text:
            "Token Creator guides you through the entire process. Select the trading pair, choose the initial price and specify how many tokens and how much SOL you want to deposit."
          },
      
          {
            type:"steps",
      
            title:"Configuration",
      
            items:[
      
              {
                emoji:"💱",
      
                title:"Choose the trading pair",
      
                description:"Currently SOL is supported."
              },
      
              {
                emoji:"🏷️",
      
                title:"Set the initial price",
      
                description:"Define the first market price of your token."
              },
      
              {
                emoji:"🪙",
      
                title:"Choose your liquidity",
      
                description:"Enter the amount of tokens and SOL to deposit."
              },
      
              {
                emoji:"✅",
      
                title:"Confirm",
      
                description:"Approve the transaction to create the Orca Whirlpool."
              }
      
            ]
      
          }
      

      
        ]
      },

      {
        id:"fees",
      
        title:"Understanding pool creation fees",
      
        blocks:[
      
          {
            type:"paragraph",
      
            text:
            "Creating a liquidity pool is more expensive than creating a token because several on-chain accounts must be initialized for the Orca Whirlpool."
          },
      
          {
            type:"paragraph",
      
            text:
            "Before you sign the transaction, Token Creator displays an estimate of the Orca protocol costs together with the service fee."
          },
      
          {
            type:"comparison",
      
            headers:[
              "Fee",
              "Purpose"
            ],
      
            rows:[
      
              [
                "Orca protocol fees",
      
                "Create the Whirlpool and required on-chain accounts."
              ],
      
              [
                "0.1% service fee",
      
                "Token Creator service."
              ]
      
            ]
      
          },
      
          {
            type:"callout",
      
            variant:"info",
      
            title:"One-time cost",
      
            text:
            "Pool creation fees are paid only when the liquidity pool is created. Normal trading afterwards does not require paying these setup costs again."
          }
      
        ]
      },
  
      
  
      {
        id: "verify",
  
        title: "Verify your liquidity",
  
        paragraphs:[

            "Once the transaction is confirmed, your token becomes tradable through the newly created Orca Whirlpool.",
            
            "You can verify the pool on Solscan or by opening your token inside supported wallets and decentralized exchanges."
            
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
"Double-check the initial price, deposited liquidity and trading pair before creating the pool. These choices determine how your token enters the market."
  
          }
  
        ]
      },
      {
        id:"next",
      
        title:"What's next?",
      
        blocks:[
      
          {
            type:"paragraph",
      
            text:
            "Your token is now tradable. You can continue by locking team allocations with a vesting contract or sharing your token page with your community."
          },
      
          {
            type:"see-also",
      
            title:"Continue learning",
      
            links:[
      
              {
                label:"How to Create a Vesting Contract",
      
                href:"/docs/how-to-create-a-vesting-contract"
              },
      
              {
                label:"How to Launch a Memecoin",
      
                href:"/docs/how-to-launch-a-memecoin-on-solana"
              },
      
              {
                label:"How to Create a Solana Token",
      
                href:"/docs/how-to-create-a-solana-token"
              }
      
            ]
      
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