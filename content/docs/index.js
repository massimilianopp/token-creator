import splToken from "./what-is-spl-token";

export const articles = [
  splToken,
];

const docs = Object.fromEntries(
  articles.map((article) => [article.slug, article])
);

export default docs;