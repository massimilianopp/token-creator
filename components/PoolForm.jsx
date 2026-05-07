"use client";

import { useState } from "react";
import { useWhirlpool } from "@/hooks/useWhirlpool";
import { Card, SectionTitle, Input, Button, LogConsole, ErrorBox, Badge, Divider } from "@/components/ui/Card";

export default function PoolForm() {
  const { createPool, status, logs, result, error } = useWhirlpool();
  const [form, setForm] = useState({
    tokenMint: "", tokenDecimals: "9", pairedWith: "SOL",
    initialPrice: "", amountToken: "", amountPaired: "",
  });

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));
  const isLoading = status === "loading";

  const handleCreate = () => createPool({
    tokenMint: form.tokenMint,
    tokenDecimals: parseInt(form.tokenDecimals),
    pairedWith: form.pairedWith,
    initialPrice: parseFloat(form.initialPrice),
    amountToken: parseFloat(form.amountToken),
    amountPaired: parseFloat(form.amountPaired),
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

      {/* Mint */}
      <Card>
        <SectionTitle>Token</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Input label="Mint address" placeholder="Your token address..." value={form.tokenMint} onChange={set("tokenMint")} disabled={isLoading} />
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 100 }}>
              <Input label="Decimals" type="number" min="0" max="9" value={form.tokenDecimals} onChange={set("tokenDecimals")} disabled={isLoading} />
            </div>

            {/* Pair selector — big buttons */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)" }}>Pair</span>
              <div style={{ display: "flex", gap: 6 }}>
                {["SOL", "USDC"].map(pair => (
                  <button key={pair} onClick={() => setForm(f => ({ ...f, pairedWith: pair }))} disabled={isLoading} style={{
                    flex: 1, padding: "10px 0", borderRadius: 8, fontSize: 13, fontWeight: 500,
                    fontFamily: "'Geist', sans-serif", cursor: isLoading ? "not-allowed" : "pointer",
                    transition: "all 0.15s",
                    background: form.pairedWith === pair ? "var(--text)" : "var(--surface)",
                    border: form.pairedWith === pair ? "1px solid var(--text)" : "1px solid var(--border)",
                    color: form.pairedWith === pair ? "var(--bg)" : "var(--muted)",
                  }}>
                    {pair}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Price & amounts */}
      <Card>
        <SectionTitle>Liquidity</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Input label="Initial price" hint="Ignored if pool already exists" type="number" step="any" placeholder="Ex: 0.001" value={form.initialPrice} onChange={set("initialPrice")} disabled={isLoading} />
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <Input label="Token amount" type="number" step="any" placeholder="Ex: 1000" value={form.amountToken} onChange={set("amountToken")} disabled={isLoading} />
            </div>
            <div style={{ flex: 1 }}>
              <Input label={`${form.pairedWith} amount`} type="number" step="any" placeholder={form.pairedWith === "SOL" ? "Ex: 0.5" : "Ex: 10"} value={form.amountPaired} onChange={set("amountPaired")} disabled={isLoading} />
            </div>
          </div>
        </div>
      </Card>

      {/* Loading state */}
      {isLoading && (
        <div style={{ padding: "12px 16px", borderRadius: 8, background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--text)" }} />
          <span style={{ fontSize: 13, color: "var(--muted)" }}>Creating pool...</span>
        </div>
      )}

      <LogConsole logs={logs} />
      <ErrorBox message={error} />

      {/* Result */}
      {status === "success" && result && (() => {
        const poolUrl = `https://solscan.io/account/${result.poolAddress}?cluster=devnet`;
        const txUrl = `https://solscan.io/tx/${result.txSignature}?cluster=devnet`;
        return (
          <Card>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>Pool created</h3>
              <Badge variant="success">Live</Badge>
            </div>
            <Divider />
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
              {[
                { label: "Pool address", value: result.poolAddress, href: poolUrl },
                { label: "Position NFT", value: result.positionMint, href: null },
                { label: "Transaction", value: result.txSignature, href: txUrl },
              ].map(({ label, value, href }) => (
                <div key={label}>
                  <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</p>
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontFamily: "'Geist Mono', monospace", color: "var(--text)", wordBreak: "break-all", textDecoration: "none", borderBottom: "1px solid var(--border)" }}>
                      {value}
                    </a>
                  ) : (
                    <span style={{ fontSize: 12, fontFamily: "'Geist Mono', monospace", color: "var(--muted)", wordBreak: "break-all" }}>
                      {value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        );
      })()}

      <Button onClick={handleCreate} loading={isLoading} disabled={!form.tokenMint || !form.initialPrice}>
        Create pool
      </Button>

    </div>
  );
}