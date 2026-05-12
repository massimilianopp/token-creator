"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useGSAP, DURATIONS, EASE_CONFIGS } from "@/hooks/useGSAP";
import NetworkToggle from "@/components/NetworkToggle";

const WalletButton = dynamic(
  () => import("@/components/WalletButton"),
  { ssr: false }
);

export default function Header() {
  const pathname = usePathname();
  const headerRef = useRef(null);
  const { gsap } = useGSAP();

  useEffect(() => {
    if (headerRef.current) {
      try {
        // Animation d'entrée du header
        gsap.fromTo(
          headerRef.current,
          {
            y: -48,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: DURATIONS.normal,
            ease: EASE_CONFIGS.smooth,
            delay: 0.1,
          }
        );
      } catch (e) {
        // Si GSAP échoue, le header reste visible
      }
    }
  }, [gsap]);

  if (pathname.startsWith("/token/")) return null;

  return (
    <header
      ref={headerRef}
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 99999,
        background: "rgba(8,8,8,0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
        height: 52,
        opacity: 1,
      }}
    >
      <div style={{
        maxWidth: 480,
        margin: "0 auto",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        background: "rgba(10,10,10,0.95)",
        borderLeft: "1px solid var(--border)",
        borderRight: "1px solid var(--border)",
      }}>
        {/* Logo/Title */}
        <h1 style={{
          fontSize: 14,
          fontWeight: 600,
          color: "white",
          fontFamily: "'Inter', sans-serif",
          margin: 0,
        }}>
          Token Creator
        </h1>

        {/* Controls */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 8, 
          flexShrink: 0,
        }}>
          <NetworkToggle />
          <WalletButton />
        </div>
      </div>
    </header>
  );
}