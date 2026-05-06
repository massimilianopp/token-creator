"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

const NAV_ITEMS = [
  { href: "/", label: "Token", emoji: "🪙" },
  { href: "/vesting", label: "Vesting", emoji: "🔒" },
  { href: "/pool", label: "Pool", emoji: "💧" },
];

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/token/")) return null;

  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 99999,
      background: "#02020a",
      borderTop: "1px solid #1e1e30",
      height: 64,
    }}>
      <div style={{
        maxWidth: 520,
        margin: "0 auto",
        height: "100%",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 8,
        background: "#0d0d14",
        borderLeft: "1px solid #1e1e30",
        borderRight: "1px solid #1e1e30",
      }}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                padding: "6px 4px",
                borderRadius: 10,
                background: isActive ? "rgba(99,102,241,0.2)" : "transparent",
                border: isActive ? "1px solid #6366f1" : "1px solid transparent",
                textDecoration: "none",
                color: isActive ? "#6366f1" : "#64748b",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              <span style={{ fontSize: 18 }}>{item.emoji}</span>
              {item.label}
            </Link>
          );
        })}
        <div style={{ flexShrink: 0 }}>
          <WalletMultiButton />
        </div>
      </div>
    </nav>
  );
}