"use client";

import Link from "next/link";

const SECTIONS = [
  {
    title: "Get in touch",
    items: [
      {
        label: "Contact support",
        desc: "Having an issue? Send us an email and we'll get back to you.",
        href: "mailto:admin@token-creator.space",
        external: false,
        tag: "admin@token-creator.space",
      },
    ],
  },
  {
    title: "Learn",
    items: [
      {
        label: "Video tutorial",
        desc: "Watch a step-by-step walkthrough of how to launch a token with Token Creator.",
        href: "https://www.youtube.com/watch?v=iDuHLiVYkg0",
        external: true,
        tag: "YouTube",
      },
      {
        label: "Documentation",
        desc: "Complete guide to token creation, vesting, and liquidity pools.",
        href: "/docs",
        external: false,
        tag: "Guide",
      },
    ],
  },
  {
    title: "Pricing",
    items: [
      {
        label: "Token creation",
        desc: "Create your SPL token with metadata and logo uploaded to IPFS.",
        tag: "0.05 SOL",
      },
      {
        label: "Vesting contract",
        desc: "Lock your allocation via Streamflow. Charged after success only.",
        tag: "0.05 SOL",
      },
      {
        label: "Liquidity pool",
        desc: "Open an Orca Whirlpool position. Fee on tokens deposited only.",
        tag: "0.1%",
      },
      {
        label: "Public token page",
        desc: "A shareable page with live price, chart, and vesting status.",
        tag: "Free",
        tagColor: "var(--green)",
      },
    ],
  },
  {
    title: "Legal",
    items: [
      {
        label: "Terms of service",
        desc: "Read our terms of service.",
        href: "/terms",
        external: false,
        tag: "Terms",
      },
      {
        label: "Privacy policy",
        desc: "Read our privacy policy.",
        href: "/privacy",
        external: false,
        tag: "Privacy",
      },
    ],
  },
];

export default function HelpPage() {
  return (
    <main style={{ padding: "32px 24px 80px" }}>
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8, fontFamily: "'Geist Mono', monospace" }}>
          Help center
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 6 }}>
          How can we help?
        </h1>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
          Resources, pricing, and support for Token Creator.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {SECTIONS.map(section => (
          <div key={section.title}>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "'Geist Mono', monospace", marginBottom: 12 }}>
              {section.title}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {section.items.map((item, i) => {
                const inner = (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "14px 16px",
                    borderRadius: 8,
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    cursor: item.href ? "pointer" : "default",
                    textDecoration: "none",
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={e => { if (item.href) e.currentTarget.style.borderColor = "var(--dim)"; }}
                  onMouseLeave={e => { if (item.href) e.currentTarget.style.borderColor = "var(--border)"; }}
                  >
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 3 }}>
                        {item.label}
                      </p>
                      <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>
                        {item.desc}
                      </p>
                    </div>
                    <span style={{
                      fontSize: 11,
                      fontFamily: "'Geist Mono', monospace",
                      color: item.tagColor || "var(--muted)",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      padding: "3px 8px",
                      borderRadius: 4,
                      flexShrink: 0,
                      whiteSpace: "nowrap",
                    }}>
                      {item.tag}
                    </span>
                  </div>
                );

                if (!item.href) return <div key={i}>{inner}</div>;
                if (item.external) return (
                  <a key={i} href={item.href} target="_blank" rel="noopener noreferrer">
                    {inner}
                  </a>
                );
                return <Link key={i} href={item.href}>{inner}</Link>;
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}