"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGSAP, DURATIONS, EASE_CONFIGS } from "@/hooks/useGSAP";

const NAV_ITEMS = [
  { href: "/", label: "Token", number: "01" },
  { href: "/vesting", label: "Vesting", number: "02" },
  { href: "/pool", label: "Pool", number: "03" },
  { href: "/explore", label: "Explore", number: "04" },
  { href: "/help", label: "Help", number: "?" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const navRef = useRef(null);
  const { gsap } = useGSAP();

  useEffect(() => {
    if (navRef.current) {
      try {
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

        // Animation spring sur changement d'onglet
        const links = navRef.current.querySelectorAll('a');
        links.forEach((link, index) => {
          link.addEventListener('click', () => {
            gsap.to(link, {
              scale: 0.95,
              duration: 0.1,
              yoyo: true,
              repeat: 1,
              ease: "back.out(1.7)",
            });
          });
        });
      } catch (e) {
        // Si GSAP échoue, la nav reste visible
      }
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
        background: "rgba(8,8,8,0.9)",
        backdropFilter: "blur(24px)",
        borderTop: "1px solid var(--border)",
        height: 56,
        opacity: 1,
      }}
    >
      <div style={{
        maxWidth: 480,
        margin: "0 auto",
        height: "100%",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 8,
        background: "rgba(10,10,10,0.95)",
        borderLeft: "1px solid var(--border)",
        borderRight: "1px solid var(--border)",
      }}>
        {NAV_ITEMS.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              padding: "6px 8px",
              textDecoration: "none",
              background: "transparent",
              position: "relative",
              transition: "all 0.2s ease",
            }}>
              <span style={{
                fontSize: 12,
                fontWeight: 500,
                color: isActive ? "white" : "#585858",
                fontFamily: "'Inter', sans-serif",
              }}>
                {item.label}
              </span>
              {isActive && (
                <div style={{
                  position: "absolute",
                  bottom: -1,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 20,
                  height: 2,
                  background: "white",
                  borderRadius: "1px 1px 0 0",
                }}/>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}