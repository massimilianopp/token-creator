"use client";

import { useState, useRef, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTokenCreator } from "../hooks/useTokenCreator";
import { useScrollAnimation, useProgressAnimation } from "../hooks/useScrollAnimation";
import { useGSAP, DURATIONS, EASE_CONFIGS } from "../hooks/useGSAP";
import { useFeedbackAnimations, useTransactionFeedback } from "../hooks/useFeedbackAnimations";
import { Card, SectionTitle, Input, Button, ErrorBox, Badge, Divider } from "@/components/ui/Card";
import FeedbackModal from "./FeedbackModal";

const STEPS = [
  { key: "uploading", label: "Uploading to IPFS" },
  { key: "minting",   label: "Creating mint" },
  { key: "metadata",  label: "Writing metadata" },
  { key: "done",      label: "Token ready" },
];

export default function TokenCreatorForm() {
  const { publicKey } = useWallet();
  const { createToken, revokeAuthorities, status, mintAddress, reset } = useTokenCreator();
  const { animateOnScroll } = useScrollAnimation();
  const { pulseElement } = useProgressAnimation();
  const { gsap, staggerUp } = useGSAP();
  const { showSuccessFeedback, showErrorFeedback, showToastNotification } = useFeedbackAnimations();
  const { animateTransactionStep } = useTransactionFeedback();

  // Refs for animations
  const formRef = useRef(null);
  const stepsRef = useRef(null);
  const successRef = useRef(null);
  const actionsRef = useRef(null);

  const [form, setForm] = useState({
    name: "", symbol: "", description: "", imageFile: null,
    totalSupply: 1_000_000_000, decimals: 6,
    revokeMint: false, revokeFreeze: false,
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [revoked, setRevoked] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentStepIndex = STEPS.findIndex(s => s.key === status);
  const isCreating = status && status !== "done" && status !== "error";
  const canSubmit = form.name && form.symbol && form.imageFile && publicKey && !isCreating;

  // Scroll-triggered animations for the form
  useEffect(() => {
    if (formRef.current && !isCreating) {
      const inputs = formRef.current.querySelectorAll('input, button, .form-section');
      staggerUp(inputs, { stagger: 0.05 });
    }
  }, [staggerUp, isCreating]);

  // Creation steps animation
  useEffect(() => {
    if (stepsRef.current && isCreating) {
      const steps = stepsRef.current.children;
      staggerUp(steps, { stagger: 0.1, delay: 0.2 });
    }
  }, [staggerUp, isCreating]);

  // Success animation
  useEffect(() => {
    if (status === "done" && successRef.current && mintAddress) {
      // Store mint address in localStorage for auto-filling
      localStorage.setItem("lastCreatedMint", mintAddress);
      
      showSuccessFeedback(successRef.current, {
        message: "Token created successfully!",
        showConfetti: true,
      });
      showToastNotification(null, {
        message: "Token created successfully!",
        type: "success",
      });
      
      // Animate the appearance of post-creation actions with a delay
      setTimeout(() => {
        if (actionsRef.current) {
          gsap.fromTo(actionsRef.current, 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
          );
          
          // Animate buttons individually
          const buttons = actionsRef.current.querySelectorAll('a');
          gsap.fromTo(buttons,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, delay: 0.2, ease: "power2.out" }
          );
        }
      }, 800);
    }
  }, [status, showSuccessFeedback, showToastNotification, gsap, mintAddress]);

  // Show feedback modal when token creation is done
  useEffect(() => {
    if (status === "done") {
      setShowFeedback(true);
    }
  }, [status]);

  // Transaction steps animations
  useEffect(() => {
    if (stepsRef.current && status) {
      const steps = stepsRef.current.children;
      Array.from(steps).forEach((step, index) => {
        const stepData = STEPS[index];
        let stepStatus = "pending";
        
        if (index < currentStepIndex) {
          stepStatus = "success";
        } else if (index === currentStepIndex) {
          stepStatus = "processing";
        }
        
        // Add classes for CSS selector
        const indicator = step.querySelector('div');
        const text = step.querySelector('span');
        if (indicator) indicator.className = 'step-indicator';
        if (text) text.className = 'step-text';
        
        animateTransactionStep(step, stepStatus);
      });
    }
  }, [status, currentStepIndex, animateTransactionStep]);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  const setVal = (field) => (val) => setForm(f => ({ ...f, [field]: val }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) { setForm(f => ({ ...f, imageFile: file })); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async () => {
    setError(null);
    try { 
      await createToken(form); 
      // Success animation will be handled by the useEffect hook that detects status === "done"
    } catch (err) { 
      setError(err.message);
      // Error animation on the form
      if (formRef.current) {
        showErrorFeedback(formRef.current);
      }
      showToastNotification(null, {
        message: "Failed to create token",
        type: "error",
      });
    }
  };

  const handleRevoke = async () => {
    setRevoking(true);
    try {
      await revokeAuthorities({ mintAddress, revokeMint: form.revokeMint, revokeFreeze: form.revokeFreeze });
      setRevoked(true);
    } catch (e) { setError(e.message); }
    setRevoking(false);
  };

  const handleReset = () => {
    reset(); setError(null); setPreview(null); setRevoked(false); setShowAdvanced(false); setCopyFeedback(false);
    setForm({ name: "", symbol: "", description: "", imageFile: null, totalSupply: 1_000_000_000, decimals: 6, revokeMint: false, revokeFreeze: false });
  };

  const handleCopyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSocialShare = (platform, url, name, symbol) => {
    const text = `I just launched ${name} (${symbol}) on Token Creator 🚀`;
    let shareUrl = '';
    
    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    } else if (platform === 'telegram') {
      shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  // ── Not connected ──
  if (!publicKey) {
    return (
      <div style={{ padding: "48px 0", textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "var(--muted)" }}>Connect your wallet to continue</p>
      </div>
    );
  }

  // ── Creating ──
  if (isCreating) {
    return (
      <Card>
        <div ref={stepsRef} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {STEPS.map((step, i) => {
            const isDone = i < currentStepIndex;
            const isCurrent = i === currentStepIndex;
            return (
              <div key={step.key} style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                borderRadius: 8,
                background: isDone ? "var(--green-dim)" : isCurrent ? "var(--surface)" : "transparent",
                border: isDone ? "1px solid var(--green-border)" : isCurrent ? "1px solid var(--border)" : "1px solid transparent",
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                  background: isDone ? "var(--green)" : isCurrent ? "var(--text)" : "var(--dim)",
                }} />
                <span style={{
                  fontSize: 13,
                  color: isDone ? "var(--green)" : isCurrent ? "var(--text)" : "var(--dim)",
                }}>
                  {step.label}
                </span>
                {isCurrent && (
                  <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--muted)" }}>
                    processing...
                  </span>
                )}
                {isDone && (
                  <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--green)" }}>done</span>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    );
  }

  // ── Done ──
  if (status === "done") {
    const solscanUrl = `https://solscan.io/token/${mintAddress}`;
    const publicUrl = `/token/${mintAddress}`;
    const tokenUrl = `https://app.token-creator.space/token/${mintAddress}`;
    return (
      <div ref={successRef} style={{ display: "flex", flexDirection: "column", gap: 12, opacity: 0 }}>
        <Card animated={false}>
          {/* Token header */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            {preview && (
              <img src={preview} alt="logo" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border)" }} />
            )}
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{form.name}</h2>
              <span style={{ fontSize: 12, fontFamily: "'Geist Mono', monospace", color: "var(--muted)" }}>${form.symbol}</span>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <Badge variant="success">Created</Badge>
            </div>
          </div>

          <Divider />

          {/* Mint address */}
          <div style={{ margin: "20px 0" }}>
            <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>Mint address</p>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", fontFamily: "'Geist Mono', monospace", fontSize: 12, color: "var(--text)", wordBreak: "break-all" }}>
              {mintAddress}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8, marginBottom: 20 }}>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Supply</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{(form.totalSupply / 1e9).toFixed(0)}B</div>
            </div>
          </div>

          <Divider />

          {/* Links */}
          <div style={{ display: "flex", gap: 8, marginTop: 20, marginBottom: form.revokeMint || form.revokeFreeze ? 16 : 0 }}>
            <a href={solscanUrl} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: "center", fontSize: 13, padding: "10px 0", borderRadius: 8, textDecoration: "none", background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}>
              Solscan ↗
            </a>
            <a href={publicUrl} style={{ flex: 1, textAlign: "center", fontSize: 13, padding: "10px 0", borderRadius: 8, textDecoration: "none", background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 500 }}>
              Public page ↗
            </a>
          </div>

          {/* Revoke */}
          {!revoked && (form.revokeMint || form.revokeFreeze) && (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ fontSize: 12, color: "var(--muted)", padding: "10px 12px", borderRadius: 8, background: "var(--surface)", border: "1px solid var(--border)" }}>
                Complete vesting setup before revoking authorities.
              </p>
              <Button variant="danger" onClick={handleRevoke} loading={revoking}>
                Revoke authorities
              </Button>
            </div>
          )}

          {revoked && (
            <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: "var(--green-dim)", border: "1px solid var(--green-border)", fontSize: 13, color: "var(--green)", textAlign: "center" }}>
              Authorities revoked — fully decentralized
            </div>
          )}

          <Divider />

          {/* Shareable Link Section */}
          <div style={{ marginTop: 20 }}>
            <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>Share your token</p>
            
            {/* URL Field with Copy Button */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <div style={{
                flex: 1,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "10px 12px",
                fontSize: 12,
                fontFamily: "'Geist Mono', monospace",
                color: "var(--text)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}>
                {tokenUrl}
              </div>
              <button
                onClick={() => handleCopyLink(tokenUrl)}
                style={{
                  padding: "10px 16px",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  fontSize: 12,
                  fontWeight: 500,
                  color: copyFeedback ? "var(--green)" : "var(--text)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "'Geist', sans-serif",
                  whiteSpace: "nowrap"
                }}
                onMouseEnter={(e) => {
                  if (!copyFeedback) {
                    e.target.style.background = "var(--surface-2)";
                    e.target.style.borderColor = "var(--border-strong)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!copyFeedback) {
                    e.target.style.background = "var(--surface)";
                    e.target.style.borderColor = "var(--border)";
                  }
                }}
              >
                {copyFeedback ? "Copied!" : "Copy link"}
              </button>
            </div>

            {/* Social Share Buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => handleSocialShare('twitter', tokenUrl, form.name, form.symbol)}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "8px 12px",
                  background: "transparent",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--muted)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "'Geist', sans-serif"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "var(--surface)";
                  e.target.style.borderColor = "var(--border-strong)";
                  e.target.style.color = "var(--text)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.borderColor = "var(--border)";
                  e.target.style.color = "var(--muted)";
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Share on Twitter
              </button>
              
              <button
                onClick={() => handleSocialShare('telegram', tokenUrl, form.name, form.symbol)}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "8px 12px",
                  background: "transparent",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--muted)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "'Geist', sans-serif"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "var(--surface)";
                  e.target.style.borderColor = "var(--border-strong)";
                  e.target.style.color = "var(--text)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.borderColor = "var(--border)";
                  e.target.style.color = "var(--muted)";
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Share on Telegram
              </button>
            </div>
          </div>
        </Card>

        {/* Post-creation actions */}
        <Card ref={actionsRef} animated={false} style={{ opacity: 0 }}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 4 }}>
              What would you like to do now?
            </p>
            <p style={{ fontSize: 12, color: "var(--muted)" }}>
              Secure your allocation or add liquidity
            </p>
          </div>
          
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <a 
              href={`/vesting?mint=${mintAddress}`}
              style={{ 
                flex: 1, 
                display: "flex", 
                alignItems: "center", 
                gap: 12,
                padding: "12px 16px", 
                textDecoration: "none", 
                background: "transparent", 
                border: "1px solid var(--border)", 
                borderRadius: 8,
                fontWeight: 500,
                fontSize: 14,
                color: "var(--muted)",
                fontFamily: "'Geist', sans-serif",
                transition: "all 0.2s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--dim)";
                e.currentTarget.style.color = "var(--text)";
                e.currentTarget.style.backgroundColor = "var(--surface)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--muted)";
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
                <circle cx="12" cy="16" r="1"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Lock allocation
            </a>

            <a 
              href={`/pool?mint=${mintAddress}`}
              style={{ 
                flex: 1, 
                display: "flex", 
                alignItems: "center", 
                gap: 12,
                padding: "12px 16px", 
                textDecoration: "none", 
                background: "transparent", 
                border: "1px solid var(--border)", 
                borderRadius: 8,
                fontWeight: 500,
                fontSize: 14,
                color: "var(--muted)",
                fontFamily: "'Geist', sans-serif",
                transition: "all 0.2s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--dim)";
                e.currentTarget.style.color = "var(--text)";
                e.currentTarget.style.backgroundColor = "var(--surface)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--muted)";
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M2 12h20"/>
              </svg>
              Add liquidity
            </a>
          </div>
        </Card>

        <Button onClick={handleReset} variant="ghost">Create another token</Button>
        {showFeedback && <FeedbackModal step="token" onClose={() => setShowFeedback(false)} />}
      </div>
    );
  }

  // Progress calculation
  const progress = (() => {
    let filled = 0;
    let total = 3; // name, symbol, imageFile
    
    if (form.name.trim()) filled++;
    if (form.symbol.trim()) filled++;
    if (form.imageFile) filled++;
    
    return (filled / total) * 100;
  })();

  // ── Form ──
  return (
    <div ref={formRef} style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: "100px" }}>
      
      {/* Progress bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          width: "100%",
          height: 2,
          background: "rgba(255,255,255,0.1)",
          borderRadius: 1,
          overflow: "hidden",
        }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            background: "white",
            borderRadius: 1,
            transition: "width 0.3s ease",
          }} />
        </div>
      </div>
      {/* Image Upload */}
      <div 
        className="form-section" 
        style={{
          border: `1px dashed var(--border)`,
          borderRadius: "var(--radius-lg)",
          padding: "24px",
          height: 160,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          cursor: "pointer",
          transition: "all 0.2s ease",
          background: "transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--border-strong)";
          e.currentTarget.style.boxShadow = "0 0 20px rgba(255,255,255,0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, cursor: "pointer", width: "100%" }}>
          {preview ? (
            <img src={preview} alt="logo" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border)" }} />
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: "var(--text-3)" }}>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
            </svg>
          )}
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 14, color: preview ? "white" : "var(--text-2)", fontWeight: 500, marginBottom: 4 }}>
              {preview ? "Logo uploaded" : "Drop your logo here"}
            </p>
            <p style={{ fontSize: 13, color: "var(--text-3)" }}>
              {preview ? "Click to change" : "or click to browse"}
            </p>
          </div>
          <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImage} />
        </label>
      </div>

      {/* Identity */}
      <Card className="form-section" animated={false}>
        <SectionTitle>Identity</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <Input label="Name" placeholder="My Token" value={form.name} onChange={set("name")} onFocus={(e) => {
     setTimeout(() => {
       e.target.scrollIntoView({ 
         behavior: 'smooth', 
         block: 'center',
         inline: 'nearest'
       });
     }, 400);
   }} />
            </div>
            <div style={{ width: 96 }}>
              <Input label="Symbol" placeholder="MTK" maxLength={8} value={form.symbol} onChange={e => setForm(f => ({ ...f, symbol: e.target.value.toUpperCase() }))} onFocus={(e) => {
     setTimeout(() => {
       e.target.scrollIntoView({ 
         behavior: 'smooth', 
         block: 'center',
         inline: 'nearest'
       });
     }, 400);
   }} />
            </div>
          </div>
          <Input label="Description" placeholder="What is this token for?" value={form.description} onChange={set("description")} onFocus={(e) => {
     setTimeout(() => {
       e.target.scrollIntoView({ 
         behavior: 'smooth', 
         block: 'center',
         inline: 'nearest'
       });
     }, 400);
   }} />
        </div>
      </Card>

      {/* Advanced — collapsed by default */}
      <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }} className="form-section">
        <button onClick={() => setShowAdvanced(v => !v)} style={{
          width: "100%", padding: "14px 20px", background: "var(--card)", border: "none",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer", fontFamily: "'Geist', sans-serif",
        }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)" }}>Advanced settings</span>
          <span style={{ fontSize: 11, color: "var(--dim)", transform: showAdvanced ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
        </button>

        {showAdvanced && (
          <div style={{ padding: "0 20px 20px", background: "var(--card)", display: "flex", flexDirection: "column", gap: 16, borderTop: "1px solid var(--border)" }}>
            <div style={{ height: 16 }} />

            {/* Supply + decimals */}
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <Input label="Total supply" type="number" value={form.totalSupply} onChange={e => setVal("totalSupply")(Number(e.target.value))} onFocus={(e) => {
     setTimeout(() => {
       e.target.scrollIntoView({ 
         behavior: 'smooth', 
         block: 'center',
         inline: 'nearest'
       });
     }, 400);
   }} />
                <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 6 }}>All tokens will be minted directly to your wallet.</div>
              </div>
              <div style={{ width: 140, display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)" }}>Decimals</span>
                <select value={form.decimals} onChange={e => setVal("decimals")(Number(e.target.value))} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", fontSize: 14, color: "var(--text)", outline: "none", fontFamily: "'Geist', sans-serif" }}>
                  <option value={6}>6 — USDC</option>
                  <option value={9}>9 — SOL</option>
                </select>
              </div>
            </div>


            {/* Anti-rug */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Anti-rug</span>
              {[
                { key: "revokeMint", label: "Revoke Mint Authority", sub: "Fixed supply forever" },
                { key: "revokeFreeze", label: "Revoke Freeze Authority", sub: "Wallets cannot be frozen" },
              ].map(opt => (
                <label key={opt.key} style={{
                  display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
                  padding: "12px 14px", borderRadius: 8,
                  background: form[opt.key] ? "var(--green-dim)" : "var(--surface)",
                  border: form[opt.key] ? "1px solid var(--green-border)" : "1px solid var(--border)",
                }}>
                  <input type="checkbox" checked={form[opt.key]} style={{ width: 15, height: 15, accentColor: "var(--green)", cursor: "pointer" }} onChange={e => setForm(f => ({ ...f, [opt.key]: e.target.checked }))} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{opt.label}</div>
                    <div style={{ fontSize: 11, color: "var(--green)", marginTop: 2 }}>{opt.sub}</div>
                  </div>
                </label>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--dim)", paddingTop: 8, borderTop: "1px solid var(--border)" }}>
              <span>Estimated fees</span>
              <span>~0.062 SOL</span>
            </div>
          </div>
        )}
      </div>

      {error && <div className="animate-scaleIn"><ErrorBox message={error} /></div>}

      <div className="animate-fadeInUp stagger-4">
        <Button onClick={handleSubmit} disabled={!canSubmit} loading={isCreating}>
          Create Token — 0.05 SOL
        </Button>
      </div>

    </div>
  );
}