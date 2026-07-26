import splToken from "./what-is-spl-token";
import mintAuthority from "./what-is-mint-authority";
import freezeAuthority from "./what-is-freeze-authority";
import tokenAccount from "./what-is-token-account";
import associatedTokenAccount from "./what-is-associated-token-account";

export const articles = [
  splToken,
  mintAuthority,
  freezeAuthority,
  tokenAccount,
  associatedTokenAccount,
];

const docs = Object.fromEntries(
  articles.map((article) => [article.slug, article])
);

export default docs;

