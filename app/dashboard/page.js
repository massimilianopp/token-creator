"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useDashboard } from "@/hooks/useDashboard";

function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/explore?mint=${query.trim()}`);
  };

  return (
    <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, marginBottom: 32 }}>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search any Solana token by mint address..."
        style={{
          flex: 1,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "10px 14px",
          fontSize: 13,
          color: "var(--text)",
          outline: "none",
          fontFamily: "'Geist', sans-serif",
        }}
        onFocus={e => e.target.style.borderColor = "var(--border-focus)"}
        onBlur={e => e.target.style.borderColor = "var(--border)"}
      />
      <button
        type="submit"
        disabled={!query.trim()}
        style={{
          padding: "10px 16px",
          borderRadius: 8,
          background: query.trim() ? "var(--text)" : "var(--surface)",
          border: "1px solid var(--border)",
          color: query.trim() ? "var(--bg)" : "var(--muted)",
          fontSize: 13,
          fontWeight: 500,
          cursor: query.trim() ? "pointer" : "not-allowed",
          fontFamily: "'Geist', sans-serif",
          transition: "all 0.15s",
          whiteSpace: "nowrap",
        }}
      >
        Explore →
      </button>
    </form>
  );
}

function TokenCard({ token, featured }) {
  const solscanUrl = `https://solscan.io/token/${token.mint}`;

  if (!featured) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 8, background: "var(--card)", border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {token.image ? (
            <img src={token.image} alt={token.symbol} style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border)" }} />
          ) : (
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--surface)", border: "1px solid var(--border)" }} />
          )}
          <div>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{token.symbol || token.mint.slice(0, 8) + "..."}</span>
            <p style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'Geist Mono', monospace" }}>{token.balance?.toLocaleString()}</p>
          </div>
        </div>
        <a href={solscanUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "var(--dim)", textDecoration: "none" }}>↗</a>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", borderRadius: 10, background: "var(--card)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {token.image ? (
          <img src={token.image} alt={token.name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border)" }} />
        ) : (
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--surface)", border: "1px solid var(--border)" }} />
        )}
        <div>
          <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{token.name}</p>
          <p style={{ fontSize: 12, color: "var(--muted)", fontFamily: "'Geist Mono', monospace" }}>${token.symbol}</p>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 10, fontFamily: "'Geist Mono', monospace", padding: "3px 8px", borderRadius: 4, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}>
          Token Creator
        </div>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 12px", fontFamily: "'Geist Mono', monospace", fontSize: 11, color: "var(--muted)", wordBreak: "break-all" }}>
        {token.mint}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <Link href={`/vesting?mint=${token.mint}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 8, background: "var(--surface)", border: "1px solid var(--border)", fontSize: 13, fontWeight: 500, color: "var(--text)", textDecoration: "none" }}>
          🔒 Vest
        </Link>
        <Link href={`/pool?mint=${token.mint}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 8, background: "var(--surface)", border: "1px solid var(--border)", fontSize: 13, fontWeight: 500, color: "var(--text)", textDecoration: "none" }}>
          💧 Pool
        </Link>
        <Link href={`/revoke?mint=${token.mint}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 8, background: "var(--surface)", border: "1px solid var(--border)", fontSize: 13, fontWeight: 500, color: "var(--red)", textDecoration: "none" }}>
          🔓 Revoke
        </Link>
        <Link href={`/token/${token.mint}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 8, background: "var(--surface)", border: "1px solid var(--border)", fontSize: 13, fontWeight: 500, color: "var(--muted)", textDecoration: "none" }}>
          ↗ View
        </Link>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { publicKey } = useWallet();
  const { loading, tokenCreatorTokens, otherTokens } = useDashboard();

  if (!publicKey) {
    return (
      <main style={{ padding: "48px 24px 80px", textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "var(--muted)" }}>Connect your wallet to see your tokens.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "32px 24px 80px" }}>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8, fontFamily: "'Geist Mono', monospace" }}>
          Dashboard
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 6 }}>
          Your tokens
        </h1>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
          {publicKey.toBase58().slice(0, 8)}...{publicKey.toBase58().slice(-8)}
        </p>
      </div>

      {/* Search bar */}
      <SearchBar />

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: 80, borderRadius: 8, background: "var(--surface)", border: "1px solid var(--border)" }} />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

          {tokenCreatorTokens.length > 0 && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "'Geist Mono', monospace", marginBottom: 12 }}>
                Created with Token Creator
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {tokenCreatorTokens.map(t => <TokenCard key={t.mint} token={t} featured={true} />)}
              </div>
            </div>
          )}

          {otherTokens.length > 0 && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "'Geist Mono', monospace", marginBottom: 12 }}>
                Other tokens
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {otherTokens.map(t => <TokenCard key={t.mint} token={t} featured={false} />)}
              </div>
            </div>
          )}

          {tokenCreatorTokens.length === 0 && otherTokens.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 20 }}>No tokens found in this wallet.</p>
              <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--text)", color: "var(--bg)", borderRadius: 8, padding: "11px 24px", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
                Create your first token →
              </Link>
            </div>
          )}

        </div>
      )}
    </main>
  );
}