"use client";
import VestingForm from "@/components/VestingForm";

export default function VestingPage() {
  return (
    <main style={{ padding: "32px 24px 0" }}>
      <div style={{ marginBottom: 32 }} className="animate-fadeInUp">
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }} className="animate-fadeIn stagger-1">
          Step 02 · Optional
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 6, color: "var(--text)", fontFamily: "'Syne', sans-serif" }} className="animate-fadeIn stagger-2">
          Vesting
        </h1>
        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }} className="animate-fadeIn stagger-3">
          Lock your dev allocation via Streamflow
        </p>
      </div>
      <div className="animate-fadeInUp stagger-4">
        <VestingForm />
      </div>
    </main>
  );
}