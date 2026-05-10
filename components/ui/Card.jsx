"use client";

import { useRef, useEffect } from "react";
import { useGSAP, DURATIONS, EASE_CONFIGS } from "@/hooks/useGSAP";

export function Card({ children, className = "", interactive = false, animated = true }) {
  const cardRef = useRef(null);
  const { scaleIn, gsap } = useGSAP();

  useEffect(() => {
    if (cardRef.current && animated) {
      scaleIn(cardRef.current, {
        delay: Math.random() * 0.1,
        duration: 0.4,
      });
    }
  }, [scaleIn, animated]);

  const handleMouseEnter = (e) => {
    if (!interactive) return;
    
    gsap.to(e.currentTarget, {
      y: -1,
      borderColor: "var(--border-strong)",
      boxShadow: "var(--shadow-md)",
      duration: 0.15,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = (e) => {
    if (!interactive) return;
    
    gsap.to(e.currentTarget, {
      y: 0,
      borderColor: "var(--border)",
      boxShadow: "none",
      duration: 0.15,
      ease: "power2.out",
    });
  };

  return (
    <div 
      ref={cardRef}
      className={className} 
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "20px",
        cursor: interactive ? "pointer" : "default",
        opacity: animated ? 0 : 1,
        transition: "all 0.15s ease",
        willChange: interactive ? "transform, box-shadow" : "auto",
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
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      gap: 16, 
      marginBottom: 20 
    }}>
      <p style={{
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--text-3)",
        margin: 0,
        fontFamily: "'Inter', sans-serif",
        flexShrink: 0,
      }}>
        {children}
      </p>
      <div style={{ 
        height: 1, 
        background: "var(--border)", 
        flex: 1 
      }} />
    </div>
  );
}

export function Input({ label, hint, error, ...props }) {
  const inputRef = useRef(null);
  const { gsap } = useGSAP();

  const handleFocus = (e) => {
    if (error) return;
    
    gsap.to(e.target, {
      borderColor: "var(--border-strong)",
      boxShadow: "0 0 0 3px rgba(255,255,255,0.06)",
      duration: 0.1,
      ease: "power2.out",
    });
  };

  const handleBlur = (e) => {
    if (error) return;
    
    gsap.to(e.target, {
      borderColor: "var(--border)",
      boxShadow: "none",
      duration: 0.15,
      ease: "power2.out",
    });
  };

  return (
    <label style={{ 
      display: "flex", 
      flexDirection: "column", 
      gap: "var(--space-2)",
    }}>
      {label && (
        <span style={{ 
          fontSize: 11, 
          fontWeight: 500, 
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--text-3)",
          fontFamily: "'Inter', sans-serif",
        }}>
          {label}
        </span>
      )}
      <input
        ref={inputRef}
        {...props}
        style={{
          width: "100%",
          height: 44,
          background: "var(--surface)",
          border: `1px solid ${error ? "var(--red)" : "var(--border)"}`,
          borderRadius: "var(--radius-md)",
          padding: "0 16px",
          fontSize: 14,
          color: "var(--text)",
          outline: "none",
          fontFamily: "'Inter', sans-serif",
          transition: "border-color 0.15s ease",
          willChange: "box-shadow",
          "::placeholder": {
            color: "var(--text-3)",
          },
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {hint && (
        <span style={{ 
          fontSize: "var(--text-xs)", 
          color: "var(--text-3)",
          fontFamily: "'Inter', sans-serif",
        }}>
          {hint}
        </span>
      )}
      {error && (
        <span style={{ 
          fontSize: "var(--text-xs)", 
          color: "var(--red)",
          fontFamily: "'Inter', sans-serif",
        }}>
          {error}
        </span>
      )}
    </label>
  );
}

export function Button({ children, loading, disabled, onClick, variant = "primary", size = "md" }) {
  const buttonRef = useRef(null);
  const { buttonPress, gsap, spin } = useGSAP();
  
  const isPrimary = variant === "primary";
  const isGhost = variant === "ghost";
  const isDanger = variant === "danger";

  const padding = size === "sm" ? "var(--space-2) var(--space-4)" : "var(--space-3) var(--space-6)";
  const fontSize = size === "sm" ? "var(--text-sm)" : "var(--text-base)";
  const height = "44px";

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
      duration: 0.1,
      ease: "power2.out",
    };

    if (isPrimary) {
      animations.opacity = 0.9;
      animations.scale = 0.99;
    } else if (isDanger) {
      animations.opacity = 0.9;
      animations.scale = 0.99;
    } else {
      animations.backgroundColor = "var(--surface-2)";
      animations.color = "var(--text)";
    }

    gsap.to(e.currentTarget, animations);
  };

  const handleMouseLeave = (e) => {
    if (loading || disabled) return;
    
    const animations = {
      duration: 0.15,
      ease: "power2.out",
    };

    if (isPrimary) {
      animations.opacity = 1;
      animations.scale = 1;
    } else if (isDanger) {
      animations.opacity = 1;
      animations.scale = 1;
    } else {
      animations.backgroundColor = "transparent";
      animations.color = "var(--text-2)";
    }

    gsap.to(e.currentTarget, animations);
  };

  const handleClick = (e) => {
    if (loading || disabled || !onClick) return;
    
    // Micro-interaction tactile
    gsap.to(e.currentTarget, {
      scale: 0.97,
      duration: 0.06,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
    });
    
    onClick(e);
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={loading || disabled}
      style={{
        width: "100%",
        height: 52,
        padding,
        borderRadius: "var(--radius-md)",
        fontSize: 15,
        fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
        letterSpacing: "0.01em",
        cursor: loading || disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        border: isPrimary ? "none" : isDanger ? "1px solid var(--red)" : "1px solid var(--border)",
        background: isPrimary ? "white" : isDanger ? "var(--red)" : "transparent",
        color: isPrimary ? "black" : isDanger ? "white" : "var(--text-2)",
        transition: "all 0.1s ease",
        willChange: "transform, opacity",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {loading ? (
        <span style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          gap: "var(--space-2)",
        }}>
          <span className="loading-spinner" style={{ 
            width: 12, 
            height: 12, 
            border: "2px solid white", 
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
      borderRadius: "var(--radius-md)",
      padding: "var(--space-4)",
      fontFamily: "'Geist Mono', monospace",
      fontSize: "var(--text-xs)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-1)",
      overflow: "hidden",
    }}>
      {logs.map((l, i) => (
        <div key={i} style={{ 
          display: "flex", 
          gap: "var(--space-3)", 
          color: "var(--text-2)", 
          overflow: "hidden",
        }}>
          <span style={{ 
            color: "var(--text-3)", 
            userSelect: "none", 
            flexShrink: 0,
          }}>›</span>
          <span style={{ 
            wordBreak: "break-all", 
            overflow: "hidden",
          }}>{l}</span>
        </div>
      ))}
    </div>
  );
}

export function ResultBox({ children }) {
  return (
    <div style={{
      background: "rgba(22,163,74,0.08)",
      border: "1px solid rgba(22,163,74,0.2)",
      borderRadius: "var(--radius-md)",
      padding: "var(--space-4)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3)",
    }}>
      {children}
    </div>
  );
}

export function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div style={{
      background: "rgba(220,38,38,0.08)",
      border: "1px solid rgba(220,38,38,0.2)",
      borderRadius: "var(--radius-md)",
      padding: "var(--space-3)",
      fontSize: "var(--text-sm)",
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
      background: "var(--surface-2)", 
      color: "var(--text-2)", 
      border: "1px solid var(--border)",
    },
    success: { 
      background: "rgba(22,163,74,0.1)", 
      color: "var(--green)", 
      border: "1px solid rgba(22,163,74,0.2)",
    },
    warning: { 
      background: "rgba(245,158,11,0.1)", 
      color: "#f59e0b", 
      border: "1px solid rgba(245,158,11,0.2)",
    },
  };
  
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "var(--space-1) var(--space-2)",
      borderRadius: "var(--radius-sm)",
      fontSize: "var(--text-xs)",
      fontWeight: 500,
      letterSpacing: "0.04em",
      fontFamily: "'Inter', sans-serif",
      ...styles[variant],
    }}>
      {children}
    </span>
  );
}

export function Divider() {
  return (
    <div style={{ 
      height: 1, 
      background: "var(--border)", 
      margin: "var(--space-1) 0",
    }} />
  );
}