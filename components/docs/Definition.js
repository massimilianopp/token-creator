export default function Definition({ term, definition }) {
    return (
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: 18,
          background: "var(--card)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--muted)",
            fontWeight: 600,
          }}
        >
          📖 Definition
        </span>
  
        <strong
          style={{
            fontSize: 16,
            color: "var(--text)",
          }}
        >
          {term}
        </strong>
  
        <p
          style={{
            margin: 0,
            color: "var(--muted)",
            lineHeight: 1.7,
            fontSize: 14,
          }}
        >
          {definition}
        </p>
      </div>
    );
  }