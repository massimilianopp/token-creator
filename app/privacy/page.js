import Link from "next/link";
export default function PrivacyPage() {
    return (
      <main style={{ padding: "32px 24px 80px" }}>
        <div style={{ marginBottom: 40 }}>
        <Link href="/help" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)", textDecoration: "none", marginBottom: 24 }}>
          ← Help
        </Link>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8, fontFamily: "'Geist Mono', monospace" }}>
            Legal
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 6 }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>Last updated: May 2026</p>
        </div>
  
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
  
          {[
            {
              title: "1. Who we are",
              content: "Token Creator is operated by Token Creator, based in France. Contact: admin@token-creator.space.",
            },
            {
              title: "2. What data we collect",
              content: "We collect minimal data strictly necessary to operate the service. This may include referral tracking via cookies for our affiliate program. We do not collect names, email addresses, or any personal information unless you contact us directly.",
            },
            {
              title: "3. Blockchain data",
              content: "When you use Token Creator, your wallet's public address is used to sign and submit transactions on the Solana blockchain. All on-chain data (token creation, transfers, liquidity positions) is public by nature of the blockchain and is not controlled by Token Creator.",
            },
            {
              title: "4. Third-party services",
              content: "Token Creator integrates with third-party services including Pinata (IPFS storage), Helius (Solana RPC), Streamflow (vesting), Orca (liquidity), and DEXscreener (market data). Each of these services has its own privacy policy. We recommend reviewing them independently.",
            },
            {
              title: "5. Data sharing",
              content: "We do not sell personal data to third parties. Data may be shared with third-party services only to the extent necessary to operate the service (e.g. uploading token metadata to IPFS via Pinata).",
            },
            {
              title: "6. Cookies",
              content: "We may use cookies for referral tracking and analytics purposes. You can disable cookies in your browser settings at any time.",
            },
            {
              title: "7. Your rights",
              content: "Under applicable law (including GDPR for EU residents), you have the right to access, correct, or request deletion of any personal data we hold about you. To exercise these rights, contact us at admin@token-creator.space.",
            },
            {
              title: "8. Changes to this policy",
              content: "We may update this privacy policy at any time. Continued use of the service after changes constitutes acceptance of the updated policy.",
            },
          ].map(section => (
            <div key={section.title} style={{ display: "flex", flexDirection: "column", gap: 10, padding: "20px", borderRadius: 8, background: "var(--card)", border: "1px solid var(--border)" }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{section.title}</h2>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>{section.content}</p>
            </div>
          ))}
  
          <div style={{ padding: "14px 16px", borderRadius: 8, background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>
              Questions? Contact us at{" "}
              <a href="mailto:admin@token-creator.space" style={{ color: "var(--text)", textDecoration: "none", borderBottom: "1px solid var(--border)" }}>
                admin@token-creator.space
              </a>
            </p>
          </div>
  
        </div>
      </main>
    );
  }