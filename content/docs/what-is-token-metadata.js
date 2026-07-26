const article = {

    slug: "what-is-token-metadata",
  
    category: "Beginner guide",
  
    title: "What is Token Metadata?",
  
    description:
      "Learn what Token Metadata is on Solana, what information it stores, and why wallets use it to display your token.",
  
    readingTime: 7,
  
    publishedAt: "2026-07-26",
  
    updatedAt: "2026-07-26",
  
    keywords: [
      "Token Metadata",
      "Metaplex",
      "Solana",
      "SPL Token",
      "Metadata Account"
    ],
  
    sections: [
  
      {
        id: "definition",
  
        title: "What is Token Metadata?",
  
        blocks: [
  
          {
            type: "definition",
            term: "Token Metadata",
            definition:
              "Additional information attached to an SPL Token, such as its name, symbol, logo and external links."
          },
  
          {
            type: "paragraph",
            text:
              "The Mint Account only stores technical information about a token. Human-readable information is stored separately inside a Metadata Account."
          }
  
        ]
      },
  
      {
        id: "why",
  
        title: "Why is Token Metadata important?",
  
        paragraphs: [
  
          "Without metadata, wallets would only display the token address.",
  
          "Metadata allows wallets and explorers to display a token name, symbol and logo.",
  
          "It improves readability and helps users recognize legitimate tokens."
  
        ]
      },
  
      {
        id: "contains",
  
        title: "What information does Metadata contain?",
  
        blocks: [
  
          {
            type: "comparison",
  
            headers: [
              "Field",
              "Example"
            ],
  
            rows: [
  
              ["Token name","My Token"],
  
              ["Symbol","MTK"],
  
              ["Logo","Image URI"],
  
              ["Description","Project description"],
  
              ["Website","https://..."],
  
              ["Social links","X, Telegram, Discord"]
  
            ]
  
          }
  
        ]
      },
  
      {
        id: "architecture",
  
        title: "Mint Account vs Metadata Account",
  
        blocks: [
  
          {
            type: "paragraph",
            text:
              "The Mint Account defines how the token works. The Metadata Account defines how the token is presented to users."
          },
  
          {
            type: "diagram",
            src: "/docs/token-metadata-diagram.svg",
            alt: "Mint Account connected to Metadata Account",
            caption:
              "Technical data and visual information are stored in separate accounts."
          }
  
        ]
      },
  
      {
        id: "wallets",
  
        title: "How wallets use Metadata",
  
        paragraphs: [
  
          "Wallets such as Phantom automatically read the Metadata Account when displaying tokens.",
  
          "If no metadata exists, the wallet usually displays only the token address."
  
        ]
      },
  
      {
        id: "tokencreator",
  
        title: "How Token Creator uploads Metadata",
  
        blocks: [
  
          {
            type: "paragraph",
            text:
              "When you create a token with Token Creator, your logo and metadata are uploaded to IPFS before the Metadata Account is created on-chain."
          },
  
          {
            type: "callout",
            variant: "tip",
            title: "Good practice",
            text:
              "Use a square logo with a high resolution to ensure it looks good across wallets and explorers."
          }
  
        ]
      },
  
      {
        id: "workflow",
  
        title: "Typical workflow",
  
        blocks: [
  
          {
            type: "steps",
  
            title: "Publishing metadata",
  
            items: [
  
              {
                emoji:"🖼️",
                title:"Choose a logo",
                description:"Prepare a square image."
              },
  
              {
                emoji:"☁️",
                title:"Upload to IPFS",
                description:"Store the image and metadata."
              },
  
              {
                emoji:"📄",
                title:"Create Metadata Account",
                description:"Register the metadata on-chain."
              },
  
              {
                emoji:"👛",
                title:"Viewed by wallets",
                description:"Wallets automatically display your token."
              }
  
            ]
  
          }
  
        ]
  
      }
  
    ],
  
    faq:[
  
      {
        question:"Does Token Metadata store the token supply?",
        answer:"No. The token supply is stored in the Mint Account."
      },
  
      {
        question:"Can I add a logo after creating my token?",
        answer:"Yes, as long as the metadata remains updateable."
      },
  
      {
        question:"Where is the logo stored?",
        answer:"Usually on IPFS, with its URI referenced by the Metadata Account."
      },
  
      {
        question:"Which wallets use Token Metadata?",
        answer:"Most Solana wallets and explorers automatically read it."
      }
  
    ],
  
    related:[
  
      "what-is-spl-token",
  
      "what-is-token-account",
  
      "what-is-mint-authority"
  
    ]
  
  };
  
  export default article;