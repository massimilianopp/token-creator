import { notFound } from "next/navigation";

import docs from "@/content/docs";

import Link from "next/link";

import DocHero from "@/components/docs/DocHero";

import DocSection from "@/components/docs/DocSection";

import TableOfContents from "@/components/docs/TableOfContents";

import FAQ from "@/components/docs/FAQ";

import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {

  const { slug } = await params;

  const article = docs[slug];

  if (!article) {
    return {};
  }

  return {
    title: `${article.title} | Token Creator`,
    description: article.description,
    keywords: article.keywords,
  };
}

export default async function DocPage({ params }) {

    const { slug } = await params;
  
    const article = docs[slug];
  
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

      <FAQ items={article.faq} />

    </main>
  );
}