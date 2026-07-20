const article = {
  slug: "what-is-spl-token",

  category: "Beginner guide",

  title: "What is an SPL Token?",

  description:
    "Learn what SPL tokens are, how they work on Solana, and how to create one without writing code.",

  keywords: [
  "SPL Token",
  "Solana Token",
  "Create SPL Token",
  "Memecoin",
  "Token Creator",
],

  readingTime: 6,

  lastUpdated: "July 2026",

  sections: [
    {
      id: "spl-program",
      title: "SPL stands for Solana Program Library",
      paragraphs: [
        "SPL (Solana Program Library) is a collection of on-chain programs maintained by the Solana Foundation. The SPL Token program is responsible for creating and managing fungible tokens on Solana.",
        "Every token you see on Solana, including USDC, BONK, JUP and WIF, is an SPL token. They all use the same underlying program, making them compatible with wallets, DEXs and explorers."
      ]
    },

    {
      id: "erc20",
      title: "How SPL tokens differ from ERC-20 tokens",
      paragraphs: [
        "On Ethereum, each token is deployed as its own smart contract.",
        "On Solana, every token uses the same SPL Token Program. This makes token creation cheaper, faster and more secure."
      ]
    }
  ],
  faq: [
    {
      question: "Can anyone create an SPL token?",
      answer:
        "Yes. Anyone with a Solana wallet can create an SPL token. No programming knowledge is required when using Token Creator.",
    },
    {
      question: "Do I need to know how to code?",
      answer:
        "No. Token Creator lets you create and configure an SPL token through a simple interface.",
    },
    {
      question: "Can I mint more tokens later?",
      answer:
        "Yes, if you keep the Mint Authority. If you revoke it, the supply becomes permanently fixed.",
    },
  ],
  related: [
    {
      title: "What is Token2022?",
      slug: "what-is-token2022",
    },
    {
      title: "What is Mint Authority?",
      slug: "what-is-mint-authority",
    },
    {
      title: "How to Launch a Memecoin on Solana",
      slug: "how-to-launch-a-memecoin-on-solana",
    },
  ]
}

export default article;