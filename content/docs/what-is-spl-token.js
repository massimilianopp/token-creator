const article = {
  slug: "what-is-spl-token",

  category: "Beginner guide",

  title: "What is an SPL Token?",

  description:
    "Learn what SPL tokens are, how they work on Solana, and how to create one without writing code.",

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
  ]
}

export default article;