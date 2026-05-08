"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useGSAP, DURATIONS, EASE_CONFIGS } from "@/hooks/useGSAP";

const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

const NAV_ITEMS = [
  { href: "/", label: "Token", number: "01" },
  { href: "/vesting", label: "Vesting", number: "02" },
  { href: "/pool", label: "Pool", number: "03" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const navRef = useRef(null);
  const { gsap } = useGSAP();

  useEffect(() => {
    if (navRef.current) {
      // Animation d'entrée de la navigation
      gsap.fromTo(
        navRef.current,
        {
          y: 80,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: DURATIONS.normal,
          ease: EASE_CONFIGS.smooth,
          delay: 0.2,
        }
      );
    }
  }, [gsap]);

  if (pathname.startsWith("/token/")) return null;

  return (
    <nav
      ref={navRef}
      style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        zIndex: 99999,
        background: "rgba(10,10,10,0.95)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border)",
        height: 60,
      }}
    >
      <div style={{
        maxWidth: 480,
        margin: "0 auto",
        height: "100%",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 4,
        background: "rgba(10,10,10,0.95)",
        borderLeft: "1px solid var(--border)",
        borderRight: "1px solid var(--border)",
      }}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              padding: "6px 4px",
              borderRadius: 8,
              textDecoration: "none",
              background: isActive ? "var(--surface)" : "transparent",
              border: isActive ? "1px solid var(--border)" : "1px solid transparent",
              transition: "all 0.15s",
            }}>
              <span style={{
                fontSize: 9,
                fontFamily: "'Geist Mono', monospace",
                fontWeight: 500,
                color: isActive ? "var(--muted)" : "var(--dim)",
                letterSpacing: "0.06em",
              }}>
                {item.number}
              </span>
              <span style={{
                fontSize: 12,
                fontWeight: 500,
                color: isActive ? "var(--text)" : "var(--muted)",
                fontFamily: "'Geist', sans-serif",
              }}>
                {item.label}
              </span>
            </Link>
          );
        })}

        <div style={{ flexShrink: 0, marginLeft: 4 }}>
          <WalletMultiButton />
        </div>
      </div>
    </nav>
  );
}