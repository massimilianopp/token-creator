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
          
            cost: "~0.05 SOL + network fees",
          
            requirements: [
              "Phantom wallet",
              "Some SOL",
              "Token name",
              "Token symbol",
              "Logo (optional)"
            ]
          }
  
        ]
      },
  
      {
        id: "step1",
  
        title: "1. Choose a name and symbol",
  
        paragraphs: [
  
          "Every token has a name and a ticker symbol.",
  
          "Choose something unique and easy to recognize."
  
        ]
  
      },
  
      {
        id: "step2",
  
        title: "2. Upload your logo",
  
        paragraphs: [
  
          "A logo helps wallets and explorers identify your token.",
  
          "Token Creator uploads the logo to IPFS and automatically links it to the Metadata Account."
  
        ]
  
      },
  
      {
        id: "step3",
  
        title: "3. Set the token supply",
  
        paragraphs: [
  
          "Choose how many tokens will exist initially.",
  
          "If you revoke the Mint Authority later, this initial supply becomes permanent."
  
        ]
  
      },
  
      {
        id: "step4",
  
        title: "4. Configure Mint Authority",
  
        blocks: [
  
          {
            type:"callout",
  
            variant:"info",
  
            title:"Important",
  
            text:"Keeping Mint Authority allows future token minting. Revoking it creates a fixed supply."
  
          }
  
        ]
  
      },
  
      {
        id: "step5",
  
        title: "5. Configure Freeze Authority",
  
        paragraphs:[
  
          "Freeze Authority allows token accounts to be frozen.",
  
          "Many community tokens revoke it to increase decentralization."
  
        ]
  
      },
  
      {
        id:"step6",
  
        title:"6. Create your token",
  
        paragraphs:[
  
          "Review your settings carefully.",
  
          "Approve the transaction in your wallet.",
  
          "Your token will immediately exist on-chain."
  
        ]
  
      },
  
      {
        id:"step7",
  
        title:"7. Verify your token",
  
        paragraphs:[
  
          "Once the transaction is confirmed, verify your token on Solscan.",
  
          "Check the token supply, metadata and authorities."
  
        ]
  
      },
  
      {
        id:"workflow",
  
        title:"Overview",
  
        blocks:[
  
          {
  
            type:"steps",
  
            title:"Token creation",
  
            items:[
  
              {
  
                emoji:"📝",
  
                title:"Choose name",
  
                description:"Select the name and symbol."
  
              },
  
              {
  
                emoji:"🖼️",
  
                title:"Upload logo",
  
                description:"Store metadata on IPFS."
  
              },
  
              {
  
                emoji:"⚙️",
  
                title:"Configure authorities",
  
                description:"Choose Mint and Freeze settings."
  
              },
  
              {
  
                emoji:"🚀",
  
                title:"Create token",
  
                description:"Sign the transaction."
  
              },
  
              {
  
                emoji:"🔍",
  
                title:"Verify",
  
                description:"Inspect the token on Solscan."
  
              }
  
            ]
  
          }
  
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