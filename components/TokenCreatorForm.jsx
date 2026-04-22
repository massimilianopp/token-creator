"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTokenCreator } from "../hooks/useTokenCreator";

const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then(m => m.WalletMultiButton),
  { ssr: false }
);

const STEPS = [
  { key: "uploading", label: "Upload image → IPFS" },
  { key: "minting",   label: "Création du Mint Solana" },
  { key: "metadata",  label: "Métadonnées on-chain (Metaplex)" },
  { key: "revoking",  label: "Révocation authorities" },
  { key: "done",      label: "Token prêt ✅" },
];

export default function TokenCreatorForm() {
  const { publicKey } = useWallet();
  const { createToken, status, mintAddress, result, reset } = useTokenCreator();

  const [form, setForm] = useState({
    name: "",
    symbol: "",
    description: "",
    imageFile: null,
    totalSupply: 1_000_000_000,
    decimals: 6,
    devAllocation: 15,
    revokeMint: true,
    revokeFreeze: true,
  });

  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const devTokens = Math.floor(form.totalSupply * form.devAllocation / 100);
  const poolTokens = form.totalSupply - devTokens;

  const currentStepIndex = STEPS.findIndex(s => s.key === status);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(f => ({ ...f, imageFile: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      await createToken(form);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReset = () => {
    reset();
    setError(null);
    setForm({
      name: "",
      symbol: "",
      description: "",
      imageFile: null,
      totalSupply: 1_000_000_000,
      decimals: 6,
      devAllocation: 15,
      revokeMint: true,
      revokeFreeze: true,
    });
    setPreview(null);
  };

  const isCreating = status && status !== "done" && status !== "error";
  const canSubmit = form.name && form.symbol && form.imageFile && publicKey && !isCreating;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080c14",
      color: "#e2e8f0",
      fontFamily: "monospace",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "40px 16px",
    }}>
      <div style={{ width: "100%", maxWidth: 520 }}>

        {/* Header */}
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 6px" }}>
            🪙 Token Creator
          </h1>
          <p style={{ color: "#475569", fontSize: 13, margin: 0 }}>
            Crée ton SPL token — tu restes propriétaire de 100% de la supply
          </p>
        </div>

        {/* Wallet button */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <WalletMultiButton />
        </div>

        {!publicKey ? (
          <div style={{
            textAlign: "center", padding: 32,
            background: "#0c1422", border: "1px solid #1a2640",
            borderRadius: 12, color: "#475569",
          }}>
            Connecte ton wallet Phantom pour continuer
          </div>
        ) : status === "done" ? (
          /* ── RÉSULTAT ── */
          <div style={{
            background: "#0c1422", border: "1px solid #1a2640",
            borderRadius: 12, padding: 24, textAlign: "center",
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <h2 style={{ margin: "0 0 4px" }}>{form.name} créé !</h2>
            <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 20px" }}>
              {form.totalSupply.toLocaleString()} {form.symbol} dans ton wallet
            </p>

            <div style={{
              background: "#0a1520", borderRadius: 8,
              padding: 14, marginBottom: 16, textAlign: "left",
            }}>
              <div style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>MINT ADDRESS</div>
              <code style={{ fontSize: 12, color: "#60a5fa", wordBreak: "break-all" }}>
                {mintAddress}
              </code>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[
                { label: "Supply totale", value: form.totalSupply.toLocaleString() },
                { label: "Dev allocation", value: `${form.devAllocation}%` },
                { label: "Pool publique", value: `${100 - form.devAllocation}%` },
              ].map(s => (
                <div key={s.label} style={{
                  flex: 1, background: "#0f1724", border: "1px solid #1e2d45",
                  borderRadius: 8, padding: "10px 8px",
                }}>
                  <div style={{ fontSize: 10, color: "#475569", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 13, color: "#e2e8f0" }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <a
                href={`https://solscan.io/token/${mintAddress}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1, padding: "11px 0",
                  background: "#0f1724", border: "1px solid #1e2d45",
                  color: "#94a3b8", borderRadius: 8, cursor: "pointer",
                  textDecoration: "none", textAlign: "center", fontSize: 13,
                  display: "block",
                }}
              >
                Voir sur Solscan →
              </a>
              <button onClick={handleReset} style={{
                flex: 1, padding: "11px 0",
                background: "#3b82f6", border: "none",
                color: "#fff", borderRadius: 8, cursor: "pointer", fontSize: 13,
              }}>
                + Créer un autre
              </button>
            </div>
          </div>

        ) : isCreating ? (
          /* ── PROGRESS ── */
          <div style={{
            background: "#0c1422", border: "1px solid #1a2640",
            borderRadius: 12, padding: 24,
          }}>
            <h3 style={{ textAlign: "center", margin: "0 0 20px" }}>
              Création en cours...
            </h3>
            {STEPS.map((step, i) => (
              <div key={step.key} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 14px", borderRadius: 8, marginBottom: 6,
                background: i < currentStepIndex ? "#0d2010" :
                            i === currentStepIndex ? "#0f1f35" : "#0a1520",
                border: `1px solid ${
                  i < currentStepIndex ? "#166534" :
                  i === currentStepIndex ? "#1e3a5f" : "#131f33"
                }`,
              }}>
                <span style={{ fontSize: 16 }}>
                  {i < currentStepIndex ? "✅" :
                   i === currentStepIndex ? "⏳" : "⬜"}
                </span>
                <span style={{
                  fontSize: 13,
                  color: i < currentStepIndex ? "#4ade80" :
                         i === currentStepIndex ? "#60a5fa" : "#334155",
                }}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

        ) : (
          /* ── FORMULAIRE ── */
          <div style={{
            background: "#0c1422", border: "1px solid #1a2640",
            borderRadius: 12, padding: 24,
          }}>

            {/* Nom + Symbole */}
            <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Nom du token *</label>
                <input style={inputStyle} placeholder="Ex: SolPepe"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div style={{ width: 110 }}>
                <label style={labelStyle}>Symbole *</label>
                <input style={inputStyle} placeholder="PEPE" maxLength={8}
                  value={form.symbol}
                  onChange={e => setForm(f => ({ ...f, symbol: e.target.value.toUpperCase() }))} />
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Description</label>
              <textarea style={{ ...inputStyle, resize: "vertical" }}
                rows={2} placeholder="Décris ton token..."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>

            {/* Logo */}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Logo *</label>
              <label style={{
                display: "flex", alignItems: "center", gap: 12,
                border: "1px dashed #1e2d45", borderRadius: 8,
                padding: 14, cursor: "pointer",
              }}>
                {preview
                  ? <img src={preview} alt="logo" style={{ width: 48, height: 48, borderRadius: 6 }} />
                  : <div style={{
                      width: 48, height: 48, borderRadius: 6,
                      background: "#131f33", display: "flex",
                      alignItems: "center", justifyContent: "center", fontSize: 20,
                    }}>🪙</div>
                }
                <div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>
                    {preview ? "Logo chargé ✓" : "Clique pour uploader"}
                  </div>
                  <div style={{ fontSize: 11, color: "#334155", marginTop: 2 }}>
                    PNG, JPG — max 5MB
                  </div>
                </div>
                <input type="file" accept="image/*"
                  style={{ display: "none" }} onChange={handleImage} />
              </label>
            </div>

            {/* Supply + Decimals */}
            <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Supply totale</label>
                <input style={inputStyle} type="number"
                  value={form.totalSupply}
                  onChange={e => setForm(f => ({ ...f, totalSupply: Number(e.target.value) }))} />
              </div>
              <div style={{ width: 150 }}>
                <label style={labelStyle}>Decimals</label>
                <select style={inputStyle} value={form.decimals}
                  onChange={e => setForm(f => ({ ...f, decimals: Number(e.target.value) }))}>
                  <option value={6}>6 (USDC style)</option>
                  <option value={9}>9 (SOL style)</option>
                </select>
              </div>
            </div>

            {/* Dev allocation */}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>
                Dev allocation — {form.devAllocation}%
              </label>
              <input type="range" min={0} max={30} value={form.devAllocation}
                style={{ width: "100%", marginBottom: 8, cursor: "pointer" }}
                onChange={e => setForm(f => ({ ...f, devAllocation: Number(e.target.value) }))} />
              <div style={{ display: "flex", gap: 8 }}>
                <div style={statBoxStyle}>
                  <div style={{ fontSize: 11, color: "#3b82f6", marginBottom: 2 }}>👤 Ton wallet</div>
                  <div style={{ fontSize: 13 }}>{devTokens.toLocaleString()}</div>
                </div>
                <div style={statBoxStyle}>
                  <div style={{ fontSize: 11, color: "#a78bfa", marginBottom: 2 }}>🏊 Pool publique</div>
                  <div style={{ fontSize: 13 }}>{poolTokens.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Anti-rug */}
            <div style={{
              background: "#0a1520", border: "1px solid #1a2640",
              borderRadius: 8, padding: 14, marginBottom: 20,
            }}>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>
                🛡️ ANTI-RUG
              </div>
              {[
                {
                  key: "revokeMint",
                  label: "Révoquer Mint Authority",
                  sub: "Supply fixe définitivement",
                },
                {
                  key: "revokeFreeze",
                  label: "Révoquer Freeze Authority",
                  sub: "Wallets non bloquables",
                },
              ].map(opt => (
                <label key={opt.key} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  cursor: "pointer", marginBottom: 8,
                }}>
                  <input type="checkbox" checked={form[opt.key]}
                    onChange={e => setForm(f => ({ ...f, [opt.key]: e.target.checked }))} />
                  <div>
                    <div style={{ fontSize: 13, color: "#94a3b8" }}>{opt.label}</div>
                    <div style={{ fontSize: 11, color: "#4ade80" }}>{opt.sub}</div>
                  </div>
                </label>
              ))}
            </div>

            {/* Frais estimés */}
            <div style={{
              display: "flex", justifyContent: "space-between",
              fontSize: 12, color: "#475569", marginBottom: 14,
            }}>
              <span>Frais de transaction estimés</span>
              <span style={{ color: "#94a3b8" }}>~0.012 SOL</span>
            </div>

            {/* Erreur */}
            {error && (
              <div style={{
                background: "#1a0a0a", border: "1px solid #7f1d1d",
                borderRadius: 8, padding: 12, marginBottom: 14,
                fontSize: 12, color: "#f87171",
              }}>
                ❌ {error}
              </div>
            )}

            {/* Submit */}
            <button onClick={handleSubmit} disabled={!canSubmit} style={{
              width: "100%", padding: "14px 0",
              background: canSubmit ? "#3b82f6" : "#1a2640",
              color: canSubmit ? "#fff" : "#334155",
              border: "none", borderRadius: 10,
              fontWeight: 700, fontSize: 15, cursor: canSubmit ? "pointer" : "not-allowed",
            }}>
              🚀 Créer {form.symbol || "le token"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Styles partagés ──────────────────────────────────────
const inputStyle = {
  background: "#0f1724",
  border: "1px solid #1e2d45",
  color: "#e2e8f0",
  borderRadius: 6,
  padding: "10px 12px",
  fontFamily: "monospace",
  fontSize: 13,
  width: "100%",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  fontSize: 11,
  color: "#64748b",
  display: "block",
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: 0.5,
};

const statBoxStyle = {
  flex: 1,
  background: "#0f1724",
  border: "1px solid #1e2d45",
  borderRadius: 6,
  padding: "8px 10px",
};
