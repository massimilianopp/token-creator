import splToken from "./what-is-spl-token";
import mintAuthority from "./what-is-mint-authority";

export const articles = [
  splToken,
  mintAuthority,
];

const docs = Object.fromEntries(
  articles.map((article) => [article.slug, article])
);

export default docs;

