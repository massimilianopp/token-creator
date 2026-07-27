import splToken from "./what-is-spl-token";
import mintAuthority from "./what-is-mint-authority";
import freezeAuthority from "./what-is-freeze-authority";
import tokenAccount from "./what-is-token-account";
import associatedTokenAccount from "./what-is-associated-token-account";
import tokenMetadata from "./what-is-token-metadata";
import solanaToken from "./how-to-create-a-solana-token";
import memecoin from "./how-to-launch-a-memecoin-on-solana";

export const articles = [
  splToken,
  mintAuthority,
  freezeAuthority,
  tokenAccount,
  associatedTokenAccount,
  tokenMetadata,
  solanaToken,
  memecoin,
];

const docs = Object.fromEntries(
  articles.map((article) => [article.slug, article])
);

export default docs;

