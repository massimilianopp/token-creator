"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTokenCreator } from "../hooks/useTokenCreator";
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

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  const setVal = (field) => (val) => setForm(f => ({ ...f, [field]: val }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) { setForm(f => ({ ...f, imageFile: file })); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async () => {
    setError(null);
    try { await createToken(form); } catch (err) { setError(err.message); }
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
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Card>
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

        <Button onClick={handleReset} variant="ghost">Create another token</Button>
      </div>
    );
  }

  // ── Form ──
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

      {/* Logo — prominent, like Pump.fun */}
      <Card>
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
      <Card>
        <SectionTitle>Identity</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <Input label="Name" placeholder="My Token" value={form.name} onChange={set("name")} />
            </div>
            <div style={{ width: 96 }}>
              <Input label="Symbol" placeholder="MTK" maxLength={8} value={form.symbol} onChange={e => setForm(f => ({ ...f, symbol: e.target.value.toUpperCase() }))} />
            </div>
          </div>
          <Input label="Description" placeholder="What is this token for?" value={form.description} onChange={set("description")} />
        </div>
      </Card>

      {/* Advanced — collapsed by default */}
      <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
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
              <Input label="Total supply" type="number" value={form.totalSupply} onChange={e => setVal("totalSupply")(Number(e.target.value))} />
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

      <ErrorBox message={error} />

      <Button onClick={handleSubmit} disabled={!canSubmit} loading={isCreating}>
        Create token
      </Button>

    </div>
  );
}