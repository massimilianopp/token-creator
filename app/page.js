"use client";
import { useEffect, useRef } from "react";
import TokenCreatorForm from "@/components/TokenCreatorForm";
import { Analytics } from "@vercel/analytics/next";
import { usePageTransition } from "@/hooks/useGSAP";

export default function Home() {
  const pageRef = useRef(null);
  const { transitionIn } = usePageTransition();

  useEffect(() => {
    if (pageRef.current) {
      transitionIn(pageRef.current);
    }
  }, [transitionIn]);

  return (
    <div className="mobile-form">
    <main ref={pageRef} style={{ padding: "32px 24px 30px" }}>
      <div style={{ marginBottom: 32 }} className="page-header">
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
          Step 01
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 6, color: "var(--text)", fontFamily: "'Syne', sans-serif" }}>
          Create token
        </h1>
        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>
          Deploy your SPL token on Solana
        </p>
      </div>
      <div className="page-content">
        <TokenCreatorForm />
      </div>
      <Analytics />
    </main>
    </div>
  );
}