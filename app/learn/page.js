import { articles } from "@/content/docs";
import Link from "next/link";

export const metadata = {
  title: "Learn Solana Token Creation",
  description:
    "Learn how Solana tokens work with beginner-friendly guides covering SPL Tokens, Mint Authority, Freeze Authority and more.",
};

export default function LearnPage() {
  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "80px 24px",
      }}
    >
      <h1
        style={{
          fontSize: 42,
          marginBottom: 16,
        }}
      >
        Learn Solana Token Creation
      </h1>

      <p
        style={{
          maxWidth: 700,
          color: "var(--muted)",
          lineHeight: 1.8,
          marginBottom: 60,
        }}
      >
        Understand how Solana tokens work before launching your project.
        Learn the fundamentals, security best practices and how each authority
        affects your token.
      </p>

      <h2
        style={{
          marginBottom: 24,
        }}
      >
        Start here
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: 20,
        }}
      >
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/docs/${article.slug}`}
            style={{
              textDecoration: "none",
            }}
          >
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: 22,
                background: "var(--card)",
                height: "100%",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  letterSpacing: ".08em",
                  marginBottom: 10,
                }}
              >
                {article.category}
              </div>

              <h3
                style={{
                  color: "var(--text)",
                  marginBottom: 10,
                }}
              >
                {article.title}
              </h3>

              <p
                style={{
                  color: "var(--muted)",
                  lineHeight: 1.7,
                }}
              >
                {article.description}
              </p>

              <div
                style={{
                  marginTop: 20,
                  fontSize: 12,
                  color: "var(--muted)",
                }}
              >
                {article.readingTime} min read →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}