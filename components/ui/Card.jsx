export function Card({ children, className = "" }) {
  return (
    <div className={className} style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      padding: 24,
    }}>
      {children}
    </div>
  );
}

export function SectionTitle({ children }) {
  return (
    <p style={{
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--muted)",
      marginBottom: 20,
    }}>
      {children}
    </p>
  );
}

export function Input({ label, hint, error, ...props }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)" }}>
          {label}
        </span>
      )}
      <input
        {...props}
        style={{
          width: "100%",
          background: "var(--surface)",
          border: `1px solid ${error ? "var(--red)" : "var(--border)"}`,
          borderRadius: 8,
          padding: "10px 14px",
          fontSize: 14,
          color: "var(--text)",
          outline: "none",
          fontFamily: "'Geist', sans-serif",
          transition: "border-color 0.15s",
        }}
        onFocus={e => { if (!error) e.target.style.borderColor = "var(--border-focus)"; }}
        onBlur={e => { if (!error) e.target.style.borderColor = "var(--border)"; }}
      />
      {hint && <span style={{ fontSize: 12, color: "var(--dim)" }}>{hint}</span>}
      {error && <span style={{ fontSize: 12, color: "var(--red)" }}>{error}</span>}
    </label>
  );
}

export function Button({ children, loading, disabled, onClick, variant = "primary", size = "md" }) {
  const isPrimary = variant === "primary";
  const isGhost = variant === "ghost";
  const isDanger = variant === "danger";

  const padding = size === "sm" ? "8px 16px" : "12px 20px";
  const fontSize = size === "sm" ? 13 : 14;

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      style={{
        width: "100%",
        padding,
        borderRadius: 8,
        fontSize,
        fontWeight: 500,
        fontFamily: "'Geist', sans-serif",
        letterSpacing: "0.01em",
        cursor: loading || disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "all 0.15s",
        border: isPrimary ? "none" : isDanger ? "1px solid var(--red-border)" : "1px solid var(--border)",
        background: isPrimary ? "var(--accent)" : isDanger ? "var(--red-dim)" : "transparent",
        color: isPrimary ? "#000000" : isDanger ? "var(--red)" : "var(--muted)",
      }}
      onMouseEnter={e => {
        if (loading || disabled) return;
        if (isPrimary) e.currentTarget.style.background = "#e5e5e5";
        else if (isDanger) e.currentTarget.style.borderColor = "var(--red)";
        else { e.currentTarget.style.borderColor = "var(--dim)"; e.currentTarget.style.color = "var(--text)"; }
      }}
      onMouseLeave={e => {
        if (isPrimary) e.currentTarget.style.background = "var(--accent)";
        else if (isDanger) e.currentTarget.style.borderColor = "var(--red-border)";
        else { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }
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
      borderRadius: 8,
      padding: 16,
      fontFamily: "'Geist Mono', monospace",
      fontSize: 12,
      display: "flex",
      flexDirection: "column",
      gap: 4,
      overflow: "hidden",
    }}>
      {logs.map((l, i) => (
        <div key={i} style={{ display: "flex", gap: 10, color: "var(--muted)", overflow: "hidden" }}>
          <span style={{ color: "var(--dim)", userSelect: "none", flexShrink: 0 }}>›</span>
          <span style={{ wordBreak: "break-all", overflow: "hidden" }}>{l}</span>
        </div>
      ))}
    </div>
  );
}

export function ResultBox({ children }) {
  return (
    <div style={{
      background: "var(--green-dim)",
      border: "1px solid var(--green-border)",
      borderRadius: 8,
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
      background: "var(--red-dim)",
      border: "1px solid var(--red-border)",
      borderRadius: 8,
      padding: 12,
      fontSize: 13,
      color: "var(--red)",
      fontFamily: "'Geist Mono', monospace",
    }}>
      {message}
    </div>
  );
}

export function Badge({ children, variant = "default" }) {
  const styles = {
    default: { background: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" },
    success: { background: "var(--green-dim)", color: "var(--green)", border: "1px solid var(--green-border)" },
    warning: { background: "rgba(245,158,11,0.06)", color: "var(--amber)", border: "1px solid rgba(245,158,11,0.2)" },
  };
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "3px 8px",
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: "0.04em",
      ...styles[variant],
    }}>
      {children}
    </span>
  );
}

export function Divider() {
  return <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />;
}