import Link from "next/link";

export default function DocCTA() {
  return (
    <div
      style={{
        marginTop: 64,
        padding: 32,
        borderRadius: 12,
        border: "1px solid var(--border)",
        background: "var(--card)",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontSize: 22,
          fontWeight: 600,
          color: "var(--text)",
          marginBottom: 10,
        }}
      >
        Ready to launch your own token?
      </p>

      <p
        style={{
          fontSize: 15,
          lineHeight: 1.7,
          color: "var(--muted)",
          maxWidth: 560,
          margin: "0 auto 24px",
        }}
      >
        Create an SPL token directly on Solana in less than a minute.
        No coding. No custody. Everything happens on-chain from your wallet.
      </p>

      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 24px",
          borderRadius: 8,
          background: "var(--text)",
          color: "var(--bg)",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Create your token →
      </Link>
    </div>
  );
}