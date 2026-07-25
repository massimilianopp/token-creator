import Link from "next/link";

export default function SeeAlso({ title = "Continue learning", links }) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: 20,
        background: "var(--card)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <span
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--muted)",
          fontWeight: 600,
          fontFamily: "'Geist Mono', monospace",
        }}
      >
        {title}
      </span>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              color: "var(--text)",
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            → {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}