import Link from "next/link";
import article from "@/content/docs/what-is-spl-token";

export const metadata = {
  title: "What is an SPL Token? — Token Creator",
  description: "Learn what SPL tokens are, how they work on Solana, and how to create one without writing code.",
};

export default function WhatIsSPLToken() {
  return (
    <main style={{ padding: "48px 24px 80px" }}>
      <Link href="/docs" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)", textDecoration: "none", marginBottom: 32 }}>← Docs</Link>

      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8, fontFamily: "'Geist Mono', monospace" }}>{article.category}</p>
        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 12 }}>{article.title}</h1>
        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.65 }}>{article.description}</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {article.sections.map((section) => (
          <div key={section.id} style={{ display: "flex", flexDirection: "column", gap: 10, padding: "20px", borderRadius: 8, background: "var(--card)", border: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}>{section.title}</h2>
            {section.paragraphs.map((paragraph, i) => <p key={i} style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.75 }}>{paragraph}</p>)}
          </div>
        ))}

        <div style={{ padding: "24px", borderRadius: 8, background: "var(--card)", border: "1px solid var(--border)", textAlign: "center" }}>
          <p style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 8 }}>Ready to create your SPL token?</p>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>Token Creator handles everything — no coding required.</p>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--text)", color: "var(--bg)", borderRadius: 8, padding: "11px 24px", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>Create your token →</Link>
        </div>
      </div>
    </main>
  );
}