"use client";
import { useRouter } from "next/navigation";

export default function BackButton({
  fallbackHref,
  label,
}: {
  fallbackHref: string;
  label: string;
}) {
  const router = useRouter();

  const handleBack = () => {
    const cameFromSameOrigin =
      typeof document !== "undefined" &&
      document.referrer &&
      (() => {
        try {
          return new URL(document.referrer).origin === window.location.origin;
        } catch {
          return false;
        }
      })();

    if (cameFromSameOrigin && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      onClick={handleBack}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        fontSize: 13,
        color: "var(--muted)",
        fontFamily: "'Geist', sans-serif",
      }}
    >
      ← {label}
    </button>
  );
}