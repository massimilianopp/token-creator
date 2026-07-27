const article = {

    slug: "how-to-create-a-solana-token",
  
    category: "Tutorial",
  
    title: "How to Create a Solana Token",
  
    description:
      "Learn how to create your own SPL Token on Solana in just a few minutes, from choosing a name to verifying it on-chain.",
  
    readingTime: 8,
  
    publishedAt: "2026-07-26",
  
    updatedAt: "2026-07-26",
  
    keywords: [
      "Create Solana Token",
      "Create SPL Token",
      "Token Creator",
      "Solana Token Guide",
      "How to Create a Token"
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
      
            cost: "0.05 SOL + network fees",
      
            requirements: [
              "Phantom wallet",
              "Some SOL",
              "Token name",
              "Token symbol",
              "Logo"
            ]
          }
      
        ]
      },
  
      {
        id: "step1",
      
        title: "1. Configure your token",
      
        blocks: [
      
          {
            type: "paragraph",
            text:
              "Start by choosing how your token will appear across the Solana ecosystem. Enter a name, choose a symbol, write a short description and upload a logo."
          },
      
          {
            type: "image",
            src: "/docs/create-token-identity.png",
            alt: "Configure token identity in Token Creator",
            caption:
              "Enter the token name, symbol, description and upload a logo before creating your token."
          },
      
          {
            type: "callout",
            variant: "tip",
            title: "Best practice",
            text:
              "Use a square logo (512×512 pixels or larger) and a short symbol so your token displays correctly across wallets and explorers."
          }
      
        ]
      },
  
      {
        id: "step2",
      
        title: "2. Review supply and fees",
      
        blocks: [
      
          {
            type: "paragraph",
            text:
              "Choose the initial token supply and the number of decimals. Before signing the transaction, Token Creator displays a complete breakdown of the transaction costs."
          },
      
          {
            type: "image",
            src: "/docs/create-token-supply-fees.png",
            alt: "Supply and fee breakdown",
            caption:
              "Review the supply, decimals and transaction costs before creating your token."
          },
      
          {
            type: "comparison",
      
            headers: [
              "Fee",
              "Purpose"
            ],
      
            rows: [
      
              [
                "Token Creator fee",
                "Covers the token creation service."
              ],
      
              [
                "Account creation",
                "Creates the required on-chain accounts."
              ],
      
              [
                "Network fee",
                "Paid to the Solana blockchain."
              ]
      
            ]
      
          }
      
        ]
      },
  
      {
        id: "step3",
      
        title: "3. Create your token",
      
        paragraphs: [
      
          "Review the information carefully before approving the transaction in your wallet.",
      
          "Once confirmed, your SPL Token is immediately created on-chain."
      
        ]
      },
  
      {
        id: "step4",
      
        title: "4. Secure your token",
      
        blocks: [
      
          {
            type: "paragraph",
            text:
              "After creating your token, you can revoke the Mint Authority and Freeze Authority. This is optional but recommended for most fixed-supply community tokens."
          },
      
          {
            type: "callout",
            variant: "tip",
            title: "Best practice",
            text:
              "Revoking both authorities increases transparency because no wallet can mint additional tokens or freeze token accounts."
          }
      
        ]
      },
  
  
      {
        id:"step5",
  
        title:"5. Verify your token",
  
        paragraphs:[
  
          "Once the transaction is confirmed, verify your token on Solscan.",
  
          "Check the token supply, metadata and authorities."
  
        ]
  
      },
  
  
      {
        id:"mistakes",
  
        title:"Common mistakes",
  
        blocks:[
  
          {
  
            type:"callout",
  
            variant:"warning",
  
            title:"Avoid these mistakes",
  
            text:"Double-check the token supply, decimals and authorities before signing. Some settings cannot be changed later."
  
          }
  
        ]
  
      }
  
    ],
  
    faq:[
  
      {
  
        question:"How much does it cost to create a Solana token?",
  
        answer:"You need a small amount of SOL to pay the network fee and account creation costs."
  
      },
  
      {
  
        question:"Can I change the token name later?",
  
        answer:"Yes, if the Metadata Account remains updateable."
  
      },
  
      {
  
        question:"Should I revoke Mint Authority?",
  
        answer:"Most fixed-supply tokens do."
  
      },
  
      {
  
        question:"Can I create a token without coding?",
  
        answer:"Yes. Token Creator lets you create an SPL Token directly from your browser."
  
      }
  
    ],
  
    related:[
  
      "what-is-spl-token",
  
      "what-is-token-metadata",
  
      "what-is-mint-authority",
  
      "what-is-freeze-authority"
  
    ]
  
  };
  
  export default article;