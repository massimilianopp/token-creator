import Link from "next/link";
export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>Last updated: May 2026</p>
        </div>
  
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
  
          {[
            {
              title: "1. Who we are",
              content: "Token Creator is an independent, non-custodial software tool operated by Token Creator, based in France. For any questions, contact us at admin@token-creator.space.",
            },
            {
              title: "2. Non-custodial service",
              content: "Token Creator does not custody user funds, private keys, or tokens at any point. All transactions are signed directly by the user's own wallet (Phantom, Solflare) and executed on-chain. Token Creator has no ability to access, freeze, or move user assets.",
            },
            {
              title: "3. No financial advice",
              content: "Token Creator does not provide financial, investment, or legal advice. Creating a token, adding liquidity, or setting up a vesting schedule does not constitute an investment product or a guarantee of value or return. Cryptocurrency assets are volatile and can lose all value. Users are solely responsible for their decisions and for complying with the laws applicable in their jurisdiction.",
            },
            {
              title: "4. User responsibilities",
              content: "By using Token Creator, you confirm that you are of legal age in your jurisdiction, that your use of the service complies with applicable laws, and that you understand the risks associated with blockchain transactions and cryptocurrency assets.",
            },
            {
              title: "5. Fees",
              content: "Token Creator charges service fees for certain actions: 0.05 SOL for token creation, 0.05 SOL for vesting contract creation, and 0.1% of tokens deposited for liquidity pool creation. The public token page is free. Fees are collected on-chain and are non-refundable once a transaction is confirmed.",
            },
            {
              title: "6. Limitation of liability",
              content: "Token Creator is provided as-is. We are not liable for any loss of funds, failed transactions, smart contract bugs in third-party protocols (Streamflow, Orca), or any other damages arising from the use of this service.",
            },
            {
              title: "7. Changes to these terms",
              content: "We may update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.",
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