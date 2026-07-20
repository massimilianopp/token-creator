import Link from "next/link";
import docs from "@/content/docs";

export default function RelatedArticles({ slugs }) {

  if (!slugs || slugs.length === 0) {
    return null;
  }

  const articles = slugs
    .map(slug => docs[slug])
    .filter(Boolean);

  return (
    <div
      style={{
        marginTop: 64,
      }}
    >
      <h2
        style={{
          fontSize: 22,
          fontWeight: 600,
          marginBottom: 24,
          color: "var(--text)",
        }}
      >
        Continue reading
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {articles.map(article => (

          <Link
            key={article.slug}
            href={`/docs/${article.slug}`}
            style={{
              display: "block",
              padding: 20,
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--card)",
              textDecoration: "none",
            }}
          >
            <p
              style={{
                fontWeight: 600,
                marginBottom: 8,
                color: "var(--text)",
              }}
            >
              {article.title}
            </p>

            <p
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: "var(--muted)",
              }}
            >
              {article.description}
            </p>

          </Link>

        ))}
      </div>

    </div>
  );
}