"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTokenCreator } from "../hooks/useTokenCreator";
import { Card, SectionTitle, Input, Button, ErrorBox } from "@/components/ui/Card";

const STEPS = [
  { key: "uploading", label: "Uploading image → IPFS", emoji: "📤" },
  { key: "minting",   label: "Creating Solana Mint", emoji: "🔨" },
  { key: "metadata",  label: "Metaplex metadata", emoji: "📝" },
  { key: "done",      label: "Token ready", emoji: "✅" },
];

export default function TokenCreatorForm() {
  const { publicKey } = useWallet();
  const { createToken, revokeAuthorities, status, mintAddress, result, reset } = useTokenCreator();

  const [form, setForm] = useState({
    name: "", symbol: "", description: "", imageFile: null,
    totalSupply: 1_000_000_000, decimals: 6,
    devAllocation: 15, revokeMint: false, revokeFreeze: false,
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [revoked, setRevoked] = useState(false);
  const [revoking, setRevoking] = useState(false);

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
    reset(); setError(null); setPreview(null); setRevoked(false);
    setForm({ name: "", symbol: "", description: "", imageFile: null, totalSupply: 1_000_000_000, decimals: 6, devAllocation: 15, revokeMint: false, revokeFreeze: false });
  };

  if (!publicKey) {
    return (
      <Card>
        <div className="flex flex-col items-center gap-3 py-8">
          <span className="text-4xl">👻</span>
          <p className="text-sm" style={{ color: "#64748b" }}>Connect your wallet to continue</p>
        </div>
      </Card>
    );
  }

  if (status === "done") {
    const solscanUrl = `https://solscan.io/token/${mintAddress}`;
    const publicUrl = `/token/${mintAddress}`;
    return (
      <div className="flex flex-col gap-4">
        <Card>
          <div className="flex flex-col items-center gap-2 pb-4 mb-4" style={{ borderBottom: "1px solid #1e1e30" }}>
            {preview && (
              <img 
                src={preview} 
                alt="logo" 
                className="rounded-full" 
                style={{ 
                  width: "64px", 
                  height: "64px", 
                  objectFit: "cover", // Assure que l'image ne s'écrase pas
                  aspectRatio: "1/1",  // Force le carré
                  border: "2px solid #6366f1" 
                }} 
              />
            )}
            <h2 className="text-xl font-extrabold">{form.name}</h2>
            <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold" style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}>${form.symbol}</span>
          </div>

          <SectionTitle>Mint address</SectionTitle>
          <div className="font-mono text-xs break-all rounded-xl px-4 py-3 mb-4" style={{ background: "#0d0d14", color: "#6366f1", border: "1px solid #1e1e30" }}>
            {mintAddress}
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: "Supply", value: (form.totalSupply / 1e9).toFixed(0) + "B" },
              { label: "Dev", value: form.devAllocation + "%" },
              { label: "Pool", value: (100 - form.devAllocation) + "%" },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "#0d0d14", border: "1px solid #1e1e30" }}>
                <div className="text-xs mb-1" style={{ color: "#64748b" }}>{s.label}</div>
                <div className="text-sm font-bold">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-3">
            <a href={solscanUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-xs py-3 rounded-xl font-semibold transition-all" style={{ background: "#0d0d14", border: "1px solid #1e1e30", color: "#94a3b8" }}>
              Solscan ↗
            </a>
            <a href={publicUrl} className="flex-1 text-center text-xs py-3 rounded-xl font-semibold transition-all" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", color: "#6366f1" }}>
              Public page ↗
            </a>
          </div>

          {!revoked && (form.revokeMint || form.revokeFreeze) && (
            <div className="flex flex-col gap-2">
              <div className="rounded-xl px-4 py-3 text-xs" style={{ background: "rgba(234,179,8,0.05)", border: "1px solid rgba(234,179,8,0.2)", color: "#ca8a04" }}>
                ⚠️ Set up vesting before revoking — Streamflow requires an active mint authority.
              </div>
              <button
                onClick={handleRevoke}
                disabled={revoking}
                className="w-full text-center text-xs py-3 rounded-xl font-semibold transition-all"
                style={{
                  background: revoking ? "#0d0d14" : "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: revoking ? "#64748b" : "#ef4444",
                  cursor: revoking ? "not-allowed" : "pointer",
                }}
              >
                {revoking ? "Revoking..." : "🔒 Revoke authorities"}
              </button>
            </div>
          )}

          {revoked && (
            <div className="text-center text-xs py-2 rounded-xl" style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981" }}>
              ✓ Authorities revoked — fully decentralized token
            </div>
          )}
        </Card>

        <Button onClick={handleReset} variant="ghost">+ Create another token</Button>
      </div>
    );
  }

  if (isCreating) {
    return (
      <Card>
        <SectionTitle>Creating token...</SectionTitle>
        <div className="flex flex-col gap-2">
          {STEPS.map((step, i) => {
            const isDone = i < currentStepIndex;
            const isCurrent = i === currentStepIndex;
            return (
              <div key={step.key} className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all" style={{
                background: isDone ? "rgba(16,185,129,0.05)" : isCurrent ? "rgba(99,102,241,0.08)" : "#0d0d14",
                border: isDone ? "1px solid rgba(16,185,129,0.2)" : isCurrent ? "1px solid rgba(99,102,241,0.3)" : "1px solid #1e1e30",
              }}>
                <span className="text-base">{isDone ? "✅" : isCurrent ? "⏳" : step.emoji}</span>
                <span className="text-sm font-medium" style={{ color: isDone ? "#10b981" : isCurrent ? "#6366f1" : "#334155" }}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <SectionTitle>Token identity</SectionTitle>
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input label="Name *" placeholder="Ex: SolPepe" value={form.name} onChange={set("name")} />
            </div>
            <div style={{ width: 110 }}>
              <Input label="Symbol *" placeholder="PEPE" maxLength={8} value={form.symbol} onChange={e => setForm(f => ({ ...f, symbol: e.target.value.toUpperCase() }))} />
            </div>
          </div>
          <Input label="Description" placeholder="Describe your token..." value={form.description} onChange={set("description")} />
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold" style={{ color: "#64748b" }}>Logo *</span>
            <label className="flex items-center gap-4 rounded-xl px-4 py-4 cursor-pointer transition-all" style={{ border: "1px dashed #2d2d4a", background: "#0d0d14" }}>
              {preview
                ? <img 
                    src={preview} 
                    alt="logo" 
                    className="rounded-full" 
                    style={{ 
                      width: "48px", 
                      height: "48px", 
                      objectFit: "cover", 
                      aspectRatio: "1/1",
                      border: "2px solid #6366f1" 
                    }} 
                  />
                : <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ background: "#12121c", border: "1px solid #1e1e30" }}>🪙</div>
              }
              <div>
                <div className="text-sm font-semibold" style={{ color: preview ? "#6366f1" : "#64748b" }}>
                  {preview ? "Logo uploaded ✓" : "Click to upload"}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#334155" }}>PNG, JPG — max 5MB</div>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle>Tokenomics</SectionTitle>
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <Input label="Total supply" type="number" value={form.totalSupply} onChange={e => setVal("totalSupply")(Number(e.target.value))} />
            <div className="flex flex-col gap-1.5" style={{ width: 160 }}>
              <span className="text-xs font-semibold" style={{ color: "#64748b" }}>Decimals</span>
              <select className="rounded-xl px-4 py-3 text-sm outline-none" style={{ background: "#0d0d14", border: "1px solid #1e1e30", color: "#f1f5f9" }} value={form.decimals} onChange={e => setVal("decimals")(Number(e.target.value))}>
                <option value={6}>6 — USDC style</option>
                <option value={9}>9 — SOL style</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span style={{ color: "#64748b" }}>Dev allocation</span>
              <span style={{ color: "#6366f1" }} className="font-bold">{form.devAllocation}%</span>
            </div>
            <input type="range" min={0} max={30} value={form.devAllocation} className="w-full cursor-pointer" style={{ accentColor: "#6366f1" }} onChange={e => setVal("devAllocation")(Number(e.target.value))} />
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl p-3" style={{ background: "#0d0d14", border: "1px solid #1e1e30" }}>
                <div className="text-xs mb-1" style={{ color: "#6366f1" }}>👤 Your wallet</div>
                <div className="text-sm font-bold font-mono">{devTokens.toLocaleString()}</div>
              </div>
              <div className="rounded-xl p-3" style={{ background: "#0d0d14", border: "1px solid #1e1e30" }}>
                <div className="text-xs mb-1" style={{ color: "#8b5cf6" }}>🏊 Public pool</div>
                <div className="text-sm font-bold font-mono">{poolTokens.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle>🛡️ Anti-rug</SectionTitle>
        <div className="flex flex-col gap-3">
          {[
            { key: "revokeMint", label: "Revoke Mint Authority", sub: "Fixed supply forever" },
            { key: "revokeFreeze", label: "Revoke Freeze Authority", sub: "Wallets cannot be frozen" },
          ].map(opt => (
            <label key={opt.key} className="flex items-center gap-3 cursor-pointer rounded-xl px-4 py-3 transition-all" style={{ background: form[opt.key] ? "rgba(16,185,129,0.05)" : "#0d0d14", border: form[opt.key] ? "1px solid rgba(16,185,129,0.2)" : "1px solid #1e1e30" }}>
              <input type="checkbox" checked={form[opt.key]} className="w-4 h-4 cursor-pointer" style={{ accentColor: "#10b981" }} onChange={e => setForm(f => ({ ...f, [opt.key]: e.target.checked }))} />
              <div>
                <div className="text-sm font-medium">{opt.label}</div>
                <div className="text-xs mt-0.5" style={{ color: "#10b981" }}>{opt.sub}</div>
              </div>
            </label>
          ))}
        </div>
        <div className="flex justify-between text-xs mt-4 pt-4" style={{ borderTop: "1px solid #1e1e30", color: "#64748b" }}>
          <span>Estimated fees</span>
          <span style={{ color: "#94a3b8" }}>~0.012 SOL</span>
        </div>
      </Card>

      <ErrorBox message={error} />

      <Button onClick={handleSubmit} disabled={!canSubmit} loading={isCreating}>
        🚀 Create {form.symbol || "token"}
      </Button>
    </div>
  );
}