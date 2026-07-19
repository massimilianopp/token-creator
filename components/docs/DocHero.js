export default function DocHero({ category, title, description }) {
    return (
      <div style={{ marginBottom: 40 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: 8,
            fontFamily: "'Geist Mono', monospace",
          }}
        >
          {category}
        </p>
  
        <h1
          style={{
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "var(--text)",
            marginBottom: 12,
          }}
        >
          {title}
        </h1>
  
        <p
          style={{
            fontSize: 14,
            color: "var(--muted)",
            lineHeight: 1.65,
          }}
        >
          {description}
        </p>
      </div>
    );
  }