"use client";

import { useEffect, useRef } from "react";
import { useNetwork } from "./NetworkContext";
import { useGSAP, DURATIONS, EASE_CONFIGS } from "@/hooks/useGSAP";

export default function NetworkToggle() {
  const { currentNetwork, switchNetwork, isDevnet } = useNetwork();
  const toggleRef = useRef(null);
  const indicatorRef = useRef(null);
  const { gsap } = useGSAP();

  useEffect(() => {
    if (toggleRef.current && indicatorRef.current) {
      // Animation du switch
      gsap.to(indicatorRef.current, {
        x: currentNetwork === "mainnet" ? 0 : 28,
        duration: DURATIONS.fast,
        ease: EASE_CONFIGS.smooth,
      });
    }
  }, [currentNetwork, gsap]);

  const handleNetworkSwitch = (network) => {
    if (toggleRef.current) {
      // Micro animation de feedback
      gsap.to(toggleRef.current, {
        scale: 0.98,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      });
    }
    switchNetwork(network);
  };

  return (
    <>
      {/* Indicateur Devnet fixe en haut */}
      {isDevnet() && (
        <div
          style={{
            position: "fixed",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100000,
            background: "rgba(251, 146, 60, 0.15)",
            border: "1px solid rgba(251, 146, 60, 0.3)",
            borderRadius: 6,
            padding: "4px 8px",
            fontSize: 10,
            fontFamily: "'Geist Mono', monospace",
            fontWeight: 600,
            color: "#fb923c",
            letterSpacing: "0.05em",
            backdropFilter: "blur(8px)",
          }}
        >
          ⚡ DEVNET
        </div>
      )}

      {/* Toggle compact pour la nav */}
      <div
        ref={toggleRef}
        style={{
          position: "relative",
          display: "flex",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 6,
          padding: 2,
          width: 58,
          height: 26,
          cursor: "pointer",
        }}
        onClick={() => handleNetworkSwitch(currentNetwork === "mainnet" ? "devnet" : "mainnet")}
      >
        {/* Indicateur mobile */}
        <div
          ref={indicatorRef}
          style={{
            position: "absolute",
            top: 2,
            left: 2,
            width: 26,
            height: 20,
            background: currentNetwork === "devnet" ? "#fb923c" : "#3b82f6",
            borderRadius: 4,
            transition: "background-color 0.2s",
          }}
        />
        
        {/* Labels */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 26,
            height: 20,
            fontSize: 9,
            fontFamily: "'Geist Mono', monospace",
            fontWeight: 600,
            color: currentNetwork === "mainnet" ? "white" : "var(--muted)",
            zIndex: 1,
            letterSpacing: "-0.02em",
          }}
        >
          M
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 26,
            height: 20,
            fontSize: 9,
            fontFamily: "'Geist Mono', monospace",
            fontWeight: 600,
            color: currentNetwork === "devnet" ? "white" : "var(--muted)",
            zIndex: 1,
            letterSpacing: "-0.02em",
          }}
        >
          D
        </div>
      </div>
    </>
  );
}