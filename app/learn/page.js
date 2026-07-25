import { articles } from "@/content/docs";
import Link from "next/link";
import LearningPath from "@/components/learn/LearningPath";

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

      <h2
  style={{
    marginTop: 80,
    marginBottom: 30,
  }}
>
  Recommended learning path
</h2>

<LearningPath />

   <div
  style={{
    marginTop: 90,
    padding: 40,
    borderRadius: 12,
    background: "var(--card)",
    border: "1px solid var(--border)",
    textAlign: "center",
  }}
>
  <h2
    style={{
      margin: 0,
    }}
  >
    Ready to create your token?
  </h2>

  <p
    style={{
      color: "var(--muted)",
      maxWidth: 600,
      margin: "20px auto 0",
      lineHeight: 1.8,
    }}
  >
    Once you understand the fundamentals, you can create your SPL Token directly on-chain.
  </p>

  <Link
    href="/"
    style={{
      display: "inline-block",
      marginTop: 28,
      padding: "12px 22px",
      borderRadius: 8,
      background: "var(--primary)",
      color: "#fff",
      textDecoration: "none",
      fontWeight: 600,
    }}
  >
    Open Token Creator
  </Link>
</div>

  
    </main>
  );
}