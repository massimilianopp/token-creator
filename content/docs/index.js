import splToken from "./what-is-spl-token";
import mintAuthority from "./what-is-mint-authority";
import freezeAuthority from "./what-is-freeze-authority";

export const articles = [
  splToken,
  mintAuthority,
  freezeAuthority,
];

const docs = Object.fromEntries(
  articles.map((article) => [article.slug, article])
);

export default docs;

