"use client";

import { useState, useRef, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTokenCreator } from "../hooks/useTokenCreator";
import { useScrollAnimation, useProgressAnimation } from "../hooks/useScrollAnimation";
import { useGSAP, DURATIONS, EASE_CONFIGS } from "../hooks/useGSAP";
import { useFeedbackAnimations, useTransactionFeedback } from "../hooks/useFeedbackAnimations";
import { Card, SectionTitle, Input, Button, ErrorBox, Badge, Divider } from "@/components/ui/Card";

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
    devAllocation: 15, revokeMint: false, revokeFreeze: false,
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [revoked, setRevoked] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const devTokens = Math.floor(form.totalSupply * form.devAllocation / 100);
  const poolTokens = form.totalSupply - devTokens;
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
    if (status === "done" && successRef.current) {
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
  }, [status, showSuccessFeedback, showToastNotification, gsap]);

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
    reset(); setError(null); setPreview(null); setRevoked(false); setShowAdvanced(false);
    setForm({ name: "", symbol: "", description: "", imageFile: null, totalSupply: 1_000_000_000, decimals: 6, devAllocation: 15, revokeMint: false, revokeFreeze: false });
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
            {[
              { label: "Supply", value: (form.totalSupply / 1e9).toFixed(0) + "B" },
              { label: "Dev", value: form.devAllocation + "%" },
              { label: "Pool", value: (100 - form.devAllocation) + "%" },
            ].map(s => (
              <div key={s.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{s.value}</div>
              </div>
            ))}
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
      </div>
    );
  }

  // ── Form ──
  return (
    <div ref={formRef} style={{ display: "flex", flexDirection: "column", gap: 8, paddingBottom: "40vh" }}>

      {/* Logo — prominent, like Pump.fun */}
      <Card className="form-section" interactive animated={false}>
        <label style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, cursor: "pointer", padding: "8px 0" }}>
          {preview ? (
            <img src={preview} alt="logo" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border)" }} />
          ) : (
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--dim)" }}>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
            </div>
          )}
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 13, color: preview ? "var(--text)" : "var(--muted)", fontWeight: 500 }}>
              {preview ? "Logo uploaded" : "Upload logo"}
            </p>
            <p style={{ fontSize: 11, color: "var(--dim)", marginTop: 2 }}>PNG, JPG — max 5MB</p>
          </div>
          <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImage} />
        </label>
      </Card>

      {/* Identity */}
      <Card className="form-section" animated={false}>
        <SectionTitle>Identity</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <Input label="Name" placeholder="My Token" value={form.name} onChange={set("name")} onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300)} />
            </div>
            <div style={{ width: 96 }}>
              <Input label="Symbol" placeholder="MTK" maxLength={8} value={form.symbol} onChange={e => setForm(f => ({ ...f, symbol: e.target.value.toUpperCase() }))} onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300)} />
            </div>
          </div>
          <Input label="Description" placeholder="What is this token for?" value={form.description} onChange={set("description")} onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300)} />
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
              <Input label="Total supply" type="number" value={form.totalSupply} onChange={e => setVal("totalSupply")(Number(e.target.value))} onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300)} />
              <div style={{ width: 140, display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)" }}>Decimals</span>
                <select value={form.decimals} onChange={e => setVal("decimals")(Number(e.target.value))} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", fontSize: 14, color: "var(--text)", outline: "none", fontFamily: "'Geist', sans-serif" }}>
                  <option value={6}>6 — USDC</option>
                  <option value={9}>9 — SOL</option>
                </select>
              </div>
            </div>

            {/* Dev allocation */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "var(--muted)", fontWeight: 500 }}>Dev allocation</span>
                <span style={{ color: "var(--text)", fontWeight: 600 }}>{form.devAllocation}%</span>
              </div>
              <input type="range" min={0} max={30} value={form.devAllocation} style={{ width: "100%", accentColor: "var(--text)", cursor: "pointer" }} onChange={e => setVal("devAllocation")(Number(e.target.value))} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px" }}>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Your wallet</div>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Geist Mono', monospace" }}>{devTokens.toLocaleString()}</div>
                </div>
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px" }}>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Public pool</div>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Geist Mono', monospace" }}>{poolTokens.toLocaleString()}</div>
                </div>
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
          Create token
        </Button>
      </div>

    </div>
  );
}