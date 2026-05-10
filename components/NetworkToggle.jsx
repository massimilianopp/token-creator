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
        x: currentNetwork === "mainnet" ? 0 : 36,
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
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 6,
        padding: 2,
        width: 76,
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
          width: 34,
          height: 20,
          background: currentNetwork === "mainnet" ? "white" : "rgba(255,255,255,0.2)",
          borderRadius: 4,
          transition: "all 0.2s ease",
          boxShadow: currentNetwork === "mainnet" ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
        }}
      />
      
      {/* Labels */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 34,
          height: 20,
          fontSize: 9,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          color: currentNetwork === "mainnet" ? "black" : "rgba(255,255,255,0.7)",
          zIndex: 1,
          letterSpacing: "0.02em",
        }}
      >
        MAIN
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 34,
          height: 20,
          fontSize: 9,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          color: currentNetwork === "devnet" ? "white" : "rgba(255,255,255,0.7)",
          zIndex: 1,
          letterSpacing: "0.02em",
        }}
      >
        DEV
      </div>
    </div>
  );
}