export function Card({ children, className = "" }) {
  return (
    <div className={className} style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: 16,
      padding: "20px",
    }}>
      {children}
    </div>
  );
}

export function SectionTitle({ children }) {
  return (
    <p style={{
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "var(--gold)",
      marginBottom: 16,
    }}>
      {children}
    </p>
  );
}

export function Input({ label, hint, ...props }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", letterSpacing: "0.08em" }}>
          {label}
        </span>
      )}
      <input
        {...props}
        style={{
          width: "100%",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "12px 14px",
          fontSize: 14,
          color: "var(--text)",
          outline: "none",
          fontFamily: "'Syne', sans-serif",
          transition: "border-color 0.2s",
        }}
        onFocus={e => e.target.style.borderColor = "var(--gold)"}
        onBlur={e => e.target.style.borderColor = "var(--border)"}
      />
      {hint && (
        <span style={{ fontSize: 11, color: "var(--dim)" }}>{hint}</span>
      )}
    </label>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", letterSpacing: "0.08em" }}>
          {label}
        </span>
      )}
      <select
        {...props}
        style={{
          width: "100%",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "12px 14px",
          fontSize: 14,
          color: "var(--text)",
          outline: "none",
          fontFamily: "'Syne', sans-serif",
        }}
      >
        {children}
      </select>
    </label>
  );
}

export function Button({ children, loading, disabled, onClick, variant = "primary" }) {
  const isPrimary = variant === "primary";
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      style={{
        width: "100%",
        padding: "16px 24px",
        borderRadius: 12,
        fontSize: 15,
        fontWeight: 700,
        fontFamily: "'Syne', sans-serif",
        letterSpacing: "0.02em",
        cursor: loading || disabled ? "not-allowed" : "pointer",
        opacity: loading || disabled ? 0.4 : 1,
        transition: "all 0.2s",
        border: isPrimary ? "none" : "1px solid var(--border-bright)",
        background: isPrimary
          ? "linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)"
          : "transparent",
        color: isPrimary ? "#000000" : "var(--muted)",
        boxShadow: isPrimary && !disabled ? "0 0 30px var(--gold-glow)" : "none",
      }}
      onMouseEnter={e => {
        if (!loading && !disabled) {
          if (isPrimary) e.currentTarget.style.transform = "translateY(-1px)";
          else { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        if (!isPrimary) { e.currentTarget.style.borderColor = "var(--border-bright)"; e.currentTarget.style.color = "var(--muted)"; }
      }}
    >
      {loading ? "Processing..." : children}
    </button>
  );
}

export function LogConsole({ logs }) {
  if (!logs?.length) return null;
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      padding: "16px",
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 12,
      display: "flex",
      flexDirection: "column",
      gap: 6,
    }}>
      {logs.map((l, i) => (
        <div key={i} style={{ display: "flex", gap: 8 }}>
          <span style={{ color: "var(--gold)" }}>▶</span>
          <span style={{ color: "var(--muted)" }}>{l}</span>
        </div>
      ))}
    </div>
  );
}

export function ResultBox({ children }) {
  return (
    <div style={{
      background: "rgba(16,185,129,0.04)",
      border: "1px solid rgba(16,185,129,0.15)",
      borderRadius: 12,
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}>
      {children}
    </div>
  );
}

export function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div style={{
      background: "rgba(239,68,68,0.04)",
      border: "1px solid rgba(239,68,68,0.2)",
      borderRadius: 12,
      padding: 14,
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 12,
      color: "var(--red)",
    }}>
      {message}
    </div>
  );
}