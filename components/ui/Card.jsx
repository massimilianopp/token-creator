export function Card({ children, className = "", interactive = false }) {
  return (
    <div className={`${className} animate-fadeInUp`} style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      padding: 24,
      transition: "all 0.2s ease",
      transform: "translateY(0)",
      cursor: interactive ? "pointer" : "default",
    }}
    onMouseEnter={interactive ? (e) => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
      e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
    } : undefined}
    onMouseLeave={interactive ? (e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.borderColor = "var(--border)";
      e.currentTarget.style.boxShadow = "none";
    } : undefined}>
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
          transition: "all 0.2s ease",
        }}
        onFocus={e => { 
          if (!error) {
            e.target.style.borderColor = "var(--border-focus)";
            e.target.style.transform = "scale(1.01)";
            e.target.style.background = "var(--card)";
          }
        }}
        onBlur={e => { 
          if (!error) {
            e.target.style.borderColor = "var(--border)";
            e.target.style.transform = "scale(1)";
            e.target.style.background = "var(--surface)";
          }
        }}
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
      className={loading ? "animate-pulse" : ""}
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
        transition: "all 0.2s ease",
        transform: "translateY(0)",
        border: isPrimary ? "none" : isDanger ? "1px solid var(--red-border)" : "1px solid var(--border)",
        background: isPrimary ? "var(--accent)" : isDanger ? "var(--red-dim)" : "transparent",
        color: isPrimary ? "#000000" : isDanger ? "var(--red)" : "var(--muted)",
      }}
      onMouseEnter={e => {
        if (loading || disabled) return;
        e.currentTarget.style.transform = "translateY(-1px)";
        if (isPrimary) {
          e.currentTarget.style.background = "#e5e5e5";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,255,255,0.15)";
        } else if (isDanger) {
          e.currentTarget.style.borderColor = "var(--red)";
          e.currentTarget.style.background = "rgba(239,68,68,0.1)";
        } else {
          e.currentTarget.style.borderColor = "var(--dim)";
          e.currentTarget.style.color = "var(--text)";
          e.currentTarget.style.background = "var(--surface)";
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        if (isPrimary) e.currentTarget.style.background = "var(--accent)";
        else if (isDanger) {
          e.currentTarget.style.borderColor = "var(--red-border)";
          e.currentTarget.style.background = "var(--red-dim)";
        } else {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.color = "var(--muted)";
          e.currentTarget.style.background = "transparent";
        }
      }}
      onMouseDown={e => {
        if (loading || disabled) return;
        e.currentTarget.style.transform = "translateY(0) scale(0.98)";
      }}
      onMouseUp={e => {
        if (loading || disabled) return;
        e.currentTarget.style.transform = "translateY(-1px) scale(1)";
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
    default: { 
      background: "rgba(22,22,22,0.8)", 
      color: "var(--muted)", 
      border: "1px solid var(--border)",
      backdropFilter: "blur(8px)" 
    },
    success: { 
      background: "rgba(34,197,94,0.15)", 
      color: "var(--green)", 
      border: "1px solid var(--green-border)",
      backdropFilter: "blur(8px)"
    },
    warning: { 
      background: "rgba(245,158,11,0.1)", 
      color: "var(--amber)", 
      border: "1px solid rgba(245,158,11,0.2)",
      backdropFilter: "blur(8px)"
    },
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