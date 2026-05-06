export function Card({ children, className = "" }) {
  return (
    <div className={`card-border rounded-2xl p-5 ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#6366f1" }}>
      {children}
    </p>
  );
}

export function Input({ label, hint, ...props }) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className="text-xs font-semibold" style={{ color: "#64748b" }}>{label}</span>}
      <input
        {...props}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all font-mono"
        style={{
          background: "#0d0d14",
          border: "1px solid #1e1e30",
          color: "#f1f5f9",
        }}
        onFocus={e => e.target.style.borderColor = "#6366f1"}
        onBlur={e => e.target.style.borderColor = "#1e1e30"}
      />
      {hint && <span className="text-xs" style={{ color: "#334155" }}>{hint}</span>}
    </label>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className="text-xs font-semibold" style={{ color: "#64748b" }}>{label}</span>}
      <select
        {...props}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
        style={{
          background: "#0d0d14",
          border: "1px solid #1e1e30",
          color: "#f1f5f9",
        }}
      >
        {children}
      </select>
    </label>
  );
}

export function Button({ children, loading, disabled, onClick, variant = "primary" }) {
  const styles = {
    primary: { background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none" },
    ghost: { background: "transparent", color: "#6366f1", border: "1px solid #6366f1" },
  };

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="w-full rounded-xl px-4 py-3 text-sm font-bold transition-all"
      style={{
        ...styles[variant],
        opacity: loading || disabled ? 0.5 : 1,
        cursor: loading || disabled ? "not-allowed" : "pointer",
        boxShadow: variant === "primary" && !disabled ? "0 0 20px rgba(99,102,241,0.3)" : "none",
      }}
    >
      {loading ? "En cours..." : children}
    </button>
  );
}

export function LogConsole({ logs }) {
  if (!logs?.length) return null;
  return (
    <div className="rounded-xl p-4 font-mono text-xs flex flex-col gap-1.5" style={{ background: "#050508", border: "1px solid #1e1e30" }}>
      {logs.map((l, i) => (
        <div key={i} className="flex gap-2">
          <span style={{ color: "#6366f1" }}>▶</span>
          <span style={{ color: "#94a3b8" }}>{l}</span>
        </div>
      ))}
    </div>
  );
}

export function ResultBox({ children }) {
  return (
    <div className="rounded-xl p-4 flex flex-col gap-3" style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)" }}>
      {children}
    </div>
  );
}

export function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-xl p-4 font-mono text-xs" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>
      {message}
    </div>
  );
}