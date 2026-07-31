const article = {

    slug: "how-to-verify-your-solana-token-after-launch.js",
  
    category: "Tutorials",
  
    title: "How to Verify your Solana Token after Launch",
  
    description:
      "Learn how to verify your Solana token, including its metadata, supply, authorities and liquidity.",
  
    readingTime: 8,
  
    publishedAt: "2026-07-30",
  
    updatedAt: "2026-07-30",
  
    keywords: [
      "Solscan",
      "Verify Solana Token",
      "SPL Token",
      "Token Creator",
      "Solana Explorer"
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
  
            cost: "Free",
  
            requirements: [
              "A Solana token",
              "Token address"
            ]
          }
  
        ]
      },
  
      {
        id: "what-is",
  
        title: "What is Solscan?",
  
        blocks: [
  
          {
            type: "paragraph",
  
            text:
              "Solscan is a blockchain explorer for Solana. It allows anyone to inspect transactions, token information and wallet activity directly from the blockchain."
          },
  
          {
            type: "paragraph",
  
            text:
              "Unlike information displayed inside an application, data shown on Solscan comes directly from on-chain accounts. This makes it an independent way to verify that your token was created correctly."
          }
  
  
        ]
      },
  
      {
        id: "step1",
  
        title: "1. Open your token on Solscan",
  
        blocks: [
  
          {
            type: "paragraph",
  
            text:
              "After creating your token with Token Creator, open its Solscan page using the token address or the built-in shortcut."
  
          },
  
          {
            type: "image",
  
            src: "/docs/token-solscan-button.png",
  
            alt: "Open token on Solscan",
  
            caption:
              "Open your token directly from Token Creator."
  
          }
  
        ]
      },
  
      {
        id: "step2",
  
        title: "2. Verify the token identity",
  
        blocks: [
  
          {
            type: "paragraph",
  
            text:
              "Confirm that the token name, symbol and logo match the information you entered during creation."
  
          },
  
          {
            type: "image",
  
            src: "/docs/solscan-metadata.png",
  
            alt: "Token metadata on Solscan",
  
            caption:
              "Verify that your token identity is displayed correctly."
  
          },
  
          {
            type: "callout",
  
            variant: "tip",
  
            title: "Didn't upload a logo?",
  
            text:
              "Wallets and explorers can still display your token, but users will usually see a generic placeholder image."
  
          }
  
        ]
      },
  
      {
        id: "step3",
  
        title: "3. Verify the supply",
  
        blocks: [
  
          {
            type: "paragraph",
  
            text:
              "Check that the total supply and decimals match the values chosen during token creation."
  
          },
  
          {
            type: "callout",
  
            variant: "info",
  
            title: "Remember",
  
            text:
              "The displayed supply depends on both the total number of tokens and the number of decimals."
  
          }
  
        ]
      },
  
      {
        id: "step4",
  
        title: "4. Verify the authorities",
  
        blocks: [
  
          {
            type: "paragraph",
  
            text:
              "Inspect the Mint Authority and Freeze Authority fields. If you revoked them after creating the token, Solscan should indicate that no authority exists."
  
          },
  
          {
            type: "image",
  
            src: "/docs/revoke-solscan.png",
  
            alt: "Authorities on Solscan",
  
            caption:
              "Verify whether the Mint Authority and Freeze Authority are still active."
  
          }
  
        ]
      },
  
      {
        id: "step5",
  
        title: "5. Verify the metadata",
  
        blocks: [
  
          {
            type: "paragraph",
  
            text:
              "Check that the metadata account has been created correctly. This is where wallets retrieve the token name, symbol, logo and description."
  
          },
  
          {
            type: "callout",
  
            variant: "tip",
  
            title: "Learn more",
  
            text:
              "See 'What is Token Metadata?' to understand how metadata is stored on Solana."
  
          }
  
        ]
      },
  
      {
        id: "step6",
      
        title: "6. Verify your liquidity pool on Orca",
      
        blocks: [
      
          {
            type: "paragraph",
      
            text:
              "If you've created a liquidity pool, open its Orca page and verify that the trading pair, initial price and available liquidity match your expectations."
          },
      
          {
            type: "image",
      
            src: "/docs/orca-pool.png",
      
            alt: "Liquidity pool on Orca",
      
            caption:
              "Verify that your liquidity pool has been created successfully and that your token is available for trading on Orca."
          },
      
          {
            type: "comparison",
      
            headers: [
              "Check",
              "Why it matters"
            ],
      
            rows: [
      
              [
                "Trading pair",
                "Confirms the pool uses the correct token pair (for example TOKEN / SOL)."
              ],
      
              [
                "Current price",
                "Verify that the market opened close to your intended starting price."
              ],
      
              [
                "Available liquidity",
                "Ensures enough liquidity was deposited for trading."
              ],
      
              [
                "Trading status",
                "Confirms that users can buy and sell your token."
              ]
      
            ]
      
          },
      
          {
            type: "callout",
      
            variant: "tip",
      
            title: "Price moved after launch?",
      
            text:
              "The market price can change immediately after the pool is created as traders begin buying and selling. Small movements are normal, while large differences may indicate that the initial price was not well calibrated."
          }
      
        ]
      },

      {
        id: "step7",
      
        title: "7. Verify your vesting contract on Streamflow",
      
        blocks: [
      
          {
            type: "paragraph",
      
            text:
              "If you've created a vesting contract, open it on Streamflow and verify that the recipient, locked amount and vesting schedule match your configuration."
          },
      
          {
            type: "image",
      
            src: "/docs/streamflow-verification.png",
      
            alt: "Verify vesting contract on Streamflow",
      
            caption:
              "Review the recipient, locked tokens and unlock schedule directly on Streamflow."
          },
      
          {
            type: "comparison",
      
            headers: [
              "Check",
              "Why it matters"
            ],
      
            rows: [
      
              [
                "Recipient",
                "Ensures the correct wallet will receive the vested tokens."
              ],
      
              [
                "Locked amount",
                "Confirms that the expected number of tokens has been locked."
              ],
      
              [
                "Cliff",
                "Verifies that no tokens unlock before the intended date."
              ],
      
              [
                "Unlock schedule",
                "Confirms that tokens will be released according to the planned vesting timeline."
              ]
      
            ]
      
          },
      
          {
            type: "callout",
      
            variant: "tip",
      
            title: "Transparency",
      
            text:
              "Sharing your public Streamflow vesting link allows investors and community members to independently verify your token lockup."
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
                "Wrong token address",
                "You verify a different token."
              ],
  
              [
                "Authorities still active",
                "The supply or token accounts can still be modified."
              ],
  
              [
                "Missing metadata",
                "Wallets may only display the token address."
              ],
  
              [
                "Incorrect supply",
                "The token was created with different parameters."
              ]
  
            ]
  
          }
  
        ]
      }
  
    ],
  
    faq: [
  
      {
        question: "Why can't I find my token on Solscan?",
  
        answer:
          "Make sure you're searching using the token mint address and wait for the creation transaction to be confirmed."
      },
  
      {
        question: "Why doesn't my logo appear?",
  
        answer:
          "It may take a short time for wallets and explorers to refresh metadata."
      },
  
      {
        question: "Can I trust the information on Solscan?",
  
        answer:
          "Solscan reads information directly from the Solana blockchain, making it an independent way to verify your token."
      },
  
      {
        question: "Do I need Solscan to use my token?",
  
        answer:
          "No. Solscan is only an explorer used to inspect on-chain information."
      }
  
    ],
  
    related: [
  
      "how-to-create-a-solana-token",
  
      "what-is-token-metadata",
  
      "how-to-revoke-token-authorities",
  
      "how-to-create-a-liquidity-pool"
  
    ]
  
  };
  
  export default article;