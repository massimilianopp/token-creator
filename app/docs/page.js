import Link from "next/link";

export const metadata = {
  title: "Documentation — Token Creator",
  description: "Guides, tutorials, comparisons and security tips for launching a Solana token. No coding required.",
};

const SECTIONS = [
  {
    title: "Beginner guides",
    pages: [
      { href: "/docs/what-is-spl-token", label: "What is an SPL Token?", desc: "The standard behind every Solana token." },
    ],
  },
  {
    title: "Tutorials",
    pages: [
    ],
  },
  {
    title: "Comparisons",
    pages: [

    ],
  },
  {
    title: "Security",
    pages: [

    ],
  },
];

export default function DocsIndexPage() {
  return (
    <main style={{ padding: "48px 24px 80px" }}>
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8, fontFamily: "'Geist Mono', monospace" }}>
          Documentation
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 12 }}>
          Learn how to launch a token
        </h1>
        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.65 }}>
          Guides, tutorials, comparisons and security tips — no coding required.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        {SECTIONS.map(section => (
          <div key={section.title}>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "'Geist Mono', monospace", marginBottom: 12 }}>
              {section.title}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {section.pages.map(page => (
                <Link key={page.href} href={page.href} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 16px", borderRadius: 8, background: "var(--card)",
                  border: "1px solid var(--border)", textDecoration: "none", gap: 12,
                }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>{page.label}</p>
                    <p style={{ fontSize: 12, color: "var(--muted)" }}>{page.desc}</p>
                  </div>
                  <span style={{ color: "var(--dim)", fontSize: 16, flexShrink: 0 }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}