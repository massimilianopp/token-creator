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
        x: currentNetwork === "mainnet" ? 0 : 38,
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
    <div
      ref={toggleRef}
      style={{
        position: "relative",
        display: "flex",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: 2,
        width: 80,
        height: 28,
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
          width: 36,
          height: 22,
          background: currentNetwork === "devnet" ? "#fb923c" : "#3b82f6",
          borderRadius: 6,
          transition: "background-color 0.2s",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      />
      
      {/* Labels */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 22,
          fontSize: 10,
          fontFamily: "'Geist Mono', monospace",
          fontWeight: 600,
          color: currentNetwork === "mainnet" ? "white" : "var(--muted)",
          zIndex: 1,
          letterSpacing: "-0.02em",
        }}
      >
        MAIN
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 22,
          fontSize: 10,
          fontFamily: "'Geist Mono', monospace",
          fontWeight: 600,
          color: currentNetwork === "devnet" ? "white" : "var(--muted)",
          zIndex: 1,
          letterSpacing: "-0.02em",
        }}
      >
        DEV
      </div>
    </div>
  );
}