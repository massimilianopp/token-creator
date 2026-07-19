import Link from "next/link";
import docs from "@/content/docs";
import DocHero from "@/components/docs/DocHero";
import DocSection from "@/components/docs/DocSection";

export const metadata = {
  title: "What is an SPL Token? — Token Creator",
  description: "Learn what SPL tokens are, how they work on Solana, and how to create one without writing code.",
};

export default function WhatIsSPLToken() {
  const article = docs["what-is-spl-token"];
  return (
    <main style={{ padding: "48px 24px 80px" }}>
      <Link href="/docs" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)", textDecoration: "none", marginBottom: 32 }}>← Docs</Link>

      <DocHero
        category={article.category}
        title={article.title}
        description={article.description}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        {article.sections.map((section) => (
          <DocSection
            key={section.id}
            section={section}
          />
        ))}
      </div>
    </main>
  );
}