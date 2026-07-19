import { notFound } from "next/navigation";

import docs from "@/content/docs";

import Link from "next/link";

import DocHero from "@/components/docs/DocHero";

import DocSection from "@/components/docs/DocSection";

import TableOfContents from "@/components/docs/TableOfContents";

export default function DocPage({ params }) {

  const article = docs[params.slug];

  if (!article) {
    notFound();
  }

  return (
    <main style={{ padding: "48px 24px 80px" }}>

      <Link
        href="/docs"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          color: "var(--muted)",
          textDecoration: "none",
          marginBottom: 32,
        }}
      >
        ← Docs
      </Link>

      <DocHero
        category={article.category}
        title={article.title}
        description={article.description}
        readingTime={article.readingTime}
        lastUpdated={article.lastUpdated}
      />

      <TableOfContents sections={article.sections} />

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