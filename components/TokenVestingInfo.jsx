"use client";

function ProgressBar({ pct }) {
  return (
    <div style={{ width: "100%", height: 3, background: "var(--border)", borderRadius: 2 }}>
      <div style={{ width: `${pct}%`, height: "100%", background: "var(--text)", borderRadius: 2, transition: "width 0.3s" }} />
    </div>
  );
}

function StreamCard({ stream }) {
  const statusLabel = stream.canceledAt ? "Canceled" : stream.isCompleted ? "Completed" : stream.isActive ? "Active" : "Pending";
  const statusColor = stream.isCompleted ? "var(--green)" : stream.isActive ? "var(--text)" : "var(--dim)";

  const formatDate = (d) => d ? d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  const fmt = (n) => n != null ? n.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "—";

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 14, fontWeight: 500 }}>{stream.name}</span>
        <span style={{ fontSize: 11, fontWeight: 500, color: statusColor, fontFamily: "'Geist Mono', monospace" }}>{statusLabel}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {[
          { label: "Recipient", value: stream.recipient, mono: true, truncate: true },
          { label: "Start", value: formatDate(stream.start) },
          { label: "End", value: formatDate(stream.end) },
        ].map(row => (
          <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
            <span style={{ color: "var(--muted)" }}>{row.label}</span>
            <span style={{ color: "var(--text)", fontFamily: row.mono ? "'Geist Mono', monospace" : "inherit", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <ProgressBar pct={stream.progressPct} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
        {[
          { label: "Total", value: fmt(stream.depositedAmount), color: "var(--text)" },
          { label: "Unlocked", value: fmt(stream.withdrawnAmount), color: "var(--green)" },
          { label: "Remaining", value: fmt(stream.remainingAmount), color: "var(--muted)" },
        ].map(s => (
          <div key={s.label} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px" }}>
            <div style={{ fontSize: 10, color: "var(--dim)", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: s.color, fontFamily: "'Geist Mono', monospace" }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TokenVestingInfo({ streams, totalLocked, totalUnlocked, loading }) {
  const fmt = (n) => n != null ? n.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "—";

  if (loading) {
    return <p style={{ fontSize: 13, color: "var(--dim)" }}>Loading vesting data...</p>;
  }

  if (!streams || streams.length === 0) {
    return <p style={{ fontSize: 13, color: "var(--dim)" }}>No vesting contracts for this token.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Global stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>Total locked</div>
          <div style={{ fontSize: 16, fontWeight: 600, fontFamily: "'Geist Mono', monospace" }}>{fmt(totalLocked)}</div>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>Total unlocked</div>
          <div style={{ fontSize: 16, fontWeight: 600, fontFamily: "'Geist Mono', monospace", color: "var(--green)" }}>{fmt(totalUnlocked)}</div>
        </div>
      </div>

      {/* Streams */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {streams.map(stream => <StreamCard key={stream.id} stream={stream} />)}
      </div>
    </div>
  );
}