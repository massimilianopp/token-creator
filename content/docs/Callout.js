export default function Callout({
    variant = "note",
    title,
    text,
  }) {
  
    const variants = {
      note: {
        icon: "ℹ️",
        border: "#3b82f6",
      },
  
      tip: {
        icon: "💡",
        border: "#22c55e",
      },
  
      warning: {
        icon: "⚠️",
        border: "#f59e0b",
      },
    };
  
    const current = variants[variant] || variants.note;
  
    return (
      <div
        style={{
          borderLeft: `4px solid ${current.border}`,
          padding: "16px",
          borderRadius: 8,
          background: "var(--card)",
        }}
      >
        <p
          style={{
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          {current.icon} {title}
        </p>
  
        <p
          style={{
            color: "var(--muted)",
            lineHeight: 1.7,
          }}
        >
          {text}
        </p>
      </div>
    );
  }