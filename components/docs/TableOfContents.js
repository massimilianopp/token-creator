import Link from "next/link";

export default function TableOfContents({ sections }) {
  return (
    <div
      style={{
        marginBottom: 40,
        padding: 20,
        border: "1px solid var(--border)",
        borderRadius: 8,
        background: "var(--card)",
      }}
    >
     <p
        style={{
            fontWeight: 600,
            marginBottom: 14,
            color: "var(--text)",
        }}
        >
        On this page
        </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {sections.map((section) => (
          <Link
            key={section.id}
            href={`#${section.id}`}
            style={{
              color: "var(--muted)",
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            {section.title}
          </Link>
        ))}
      </div>
    </div>
  );
}