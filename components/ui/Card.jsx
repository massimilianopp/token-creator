"use client";

import { useRef, useEffect } from "react";
import { useGSAP, DURATIONS, EASE_CONFIGS } from "@/hooks/useGSAP";

export function Card({ children, className = "", interactive = false, animated = true }) {
  const cardRef = useRef(null);
  const { scaleIn, gsap } = useGSAP();

  useEffect(() => {
    if (cardRef.current && animated) {
      scaleIn(cardRef.current, {
        delay: Math.random() * 0.2, // Stagger aléatoire léger
      });
    }
  }, [scaleIn, animated]);

  const handleMouseEnter = (e) => {
    if (!interactive) return;
    
    gsap.to(e.currentTarget, {
      y: -2,
      borderColor: "rgba(255,255,255,0.15)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      duration: DURATIONS.quick,
      ease: EASE_CONFIGS.smooth,
    });
  };

  const handleMouseLeave = (e) => {
    if (!interactive) return;
    
    gsap.to(e.currentTarget, {
      y: 0,
      borderColor: "var(--border)",
      boxShadow: "none",
      duration: DURATIONS.quick,
      ease: EASE_CONFIGS.smooth,
    });
  };

  return (
    <div 
      ref={cardRef}
      className={className} 
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 24,
        cursor: interactive ? "pointer" : "default",
        opacity: animated ? 0 : 1,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ children }) {
  return (
    <p style={{
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--muted)",
      marginBottom: 20,
    }}>
      {children}
    </p>
  );
}

export function Input({ label, hint, error, ...props }) {
  const inputRef = useRef(null);
  const { gsap } = useGSAP();

  const handleFocus = (e) => {
    if (error) return;
    
    gsap.to(e.target, {
      borderColor: "var(--border-focus)",
      scale: 1.01,
      backgroundColor: "var(--card)",
      duration: DURATIONS.quick,
      ease: EASE_CONFIGS.smooth,
    });
  };

  const handleBlur = (e) => {
    if (error) return;
    
    gsap.to(e.target, {
      borderColor: "var(--border)",
      scale: 1,
      backgroundColor: "var(--surface)",
      duration: DURATIONS.quick,
      ease: EASE_CONFIGS.smooth,
    });
  };

  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)" }}>
          {label}
        </span>
      )}
      <input
        ref={inputRef}
        {...props}
        style={{
          width: "100%",
          background: "var(--surface)",
          border: `1px solid ${error ? "var(--red)" : "var(--border)"}`,
          borderRadius: 8,
          padding: "10px 14px",
          fontSize: 14,
          color: "var(--text)",
          outline: "none",
          fontFamily: "'Geist', sans-serif",
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {hint && <span style={{ fontSize: 12, color: "var(--dim)" }}>{hint}</span>}
      {error && <span style={{ fontSize: 12, color: "var(--red)" }}>{error}</span>}
    </label>
  );
}

export function Button({ children, loading, disabled, onClick, variant = "primary", size = "md" }) {
  const buttonRef = useRef(null);
  const { buttonPress, gsap, spin } = useGSAP();
  
  const isPrimary = variant === "primary";
  const isGhost = variant === "ghost";
  const isDanger = variant === "danger";

  const padding = size === "sm" ? "8px 16px" : "12px 20px";
  const fontSize = size === "sm" ? 13 : 14;

  useEffect(() => {
    if (loading && buttonRef.current) {
      const spinner = buttonRef.current.querySelector('.loading-spinner');
      if (spinner) {
        spin(spinner);
      }
    }
  }, [loading, spin]);

  const handleMouseEnter = (e) => {
    if (loading || disabled) return;
    
    const animations = {
      y: -1,
      duration: DURATIONS.quick,
      ease: EASE_CONFIGS.smooth,
    };

    if (isPrimary) {
      animations.backgroundColor = "#e5e5e5";
      animations.boxShadow = "0 4px 20px rgba(255,255,255,0.15)";
    } else if (isDanger) {
      animations.borderColor = "var(--red)";
      animations.backgroundColor = "rgba(239,68,68,0.1)";
    } else {
      animations.borderColor = "var(--dim)";
      animations.color = "var(--text)";
      animations.backgroundColor = "var(--surface)";
    }

    gsap.to(e.currentTarget, animations);
  };

  const handleMouseLeave = (e) => {
    if (loading || disabled) return;
    
    const animations = {
      y: 0,
      boxShadow: "none",
      duration: DURATIONS.quick,
      ease: EASE_CONFIGS.smooth,
    };

    if (isPrimary) {
      animations.backgroundColor = "var(--accent)";
    } else if (isDanger) {
      animations.borderColor = "var(--red-border)";
      animations.backgroundColor = "var(--red-dim)";
    } else {
      animations.borderColor = "var(--border)";
      animations.color = "var(--muted)";
      animations.backgroundColor = "transparent";
    }

    gsap.to(e.currentTarget, animations);
  };

  const handleClick = (e) => {
    if (loading || disabled || !onClick) return;
    buttonPress(e.currentTarget);
    onClick(e);
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={loading || disabled}
      style={{
        width: "100%",
        padding,
        borderRadius: 8,
        fontSize,
        fontWeight: 500,
        fontFamily: "'Geist', sans-serif",
        letterSpacing: "0.01em",
        cursor: loading || disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        border: isPrimary ? "none" : isDanger ? "1px solid var(--red-border)" : "1px solid var(--border)",
        background: isPrimary ? "var(--accent)" : isDanger ? "var(--red-dim)" : "transparent",
        color: isPrimary ? "#000000" : isDanger ? "var(--red)" : "var(--muted)",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {loading ? (
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span className="loading-spinner" style={{ 
            width: 12, 
            height: 12, 
            border: "2px solid currentColor", 
            borderTop: "2px solid transparent", 
            borderRadius: "50%",
          }} />
          Processing...
        </span>
      ) : children}
    </button>
  );
}

export function LogConsole({ logs }) {
  if (!logs?.length) return null;
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 8,
      padding: 16,
      fontFamily: "'Geist Mono', monospace",
      fontSize: 12,
      display: "flex",
      flexDirection: "column",
      gap: 4,
      overflow: "hidden",
    }}>
      {logs.map((l, i) => (
        <div key={i} style={{ display: "flex", gap: 10, color: "var(--muted)", overflow: "hidden" }}>
          <span style={{ color: "var(--dim)", userSelect: "none", flexShrink: 0 }}>›</span>
          <span style={{ wordBreak: "break-all", overflow: "hidden" }}>{l}</span>
        </div>
      ))}
    </div>
  );
}

export function ResultBox({ children }) {
  return (
    <div style={{
      background: "var(--green-dim)",
      border: "1px solid var(--green-border)",
      borderRadius: 8,
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}>
      {children}
    </div>
  );
}

export function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div style={{
      background: "var(--red-dim)",
      border: "1px solid var(--red-border)",
      borderRadius: 8,
      padding: 12,
      fontSize: 13,
      color: "var(--red)",
      fontFamily: "'Geist Mono', monospace",
    }}>
      {message}
    </div>
  );
}

export function Badge({ children, variant = "default" }) {
  const styles = {
    default: { 
      background: "rgba(22,22,22,0.8)", 
      color: "var(--muted)", 
      border: "1px solid var(--border)",
      backdropFilter: "blur(8px)" 
    },
    success: { 
      background: "rgba(34,197,94,0.15)", 
      color: "var(--green)", 
      border: "1px solid var(--green-border)",
      backdropFilter: "blur(8px)"
    },
    warning: { 
      background: "rgba(245,158,11,0.1)", 
      color: "var(--amber)", 
      border: "1px solid rgba(245,158,11,0.2)",
      backdropFilter: "blur(8px)"
    },
  };
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "3px 8px",
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: "0.04em",
      ...styles[variant],
    }}>
      {children}
    </span>
  );
}

export function Divider() {
  return <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />;
}