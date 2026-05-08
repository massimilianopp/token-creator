"use client";
import { useEffect, useRef } from "react";
import PoolForm from "@/components/PoolForm";
import { usePageTransition } from "@/hooks/useGSAP";

export default function PoolPage() {
  const pageRef = useRef(null);
  const { transitionIn } = usePageTransition();

  useEffect(() => {
    if (pageRef.current) {
      transitionIn(pageRef.current);
    }
  }, [transitionIn]);

  return (
    <main ref={pageRef} style={{ padding: "32px 24px 0" }}>
      <div style={{ marginBottom: 32 }} className="page-header">
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
          Step 03 · Optional
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 6, color: "var(--text)", fontFamily: "'Syne', sans-serif" }}>
          Liquidity Pool
        </h1>
        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>
          Create an Orca Whirlpool position
        </p>
      </div>
      <div className="page-content">
        <PoolForm />
      </div>
    </main>
  );
}