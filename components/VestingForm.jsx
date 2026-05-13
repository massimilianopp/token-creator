"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useVesting } from "../hooks/useVesting";
import { Card, SectionTitle, Input, Button, ErrorBox, Badge, Divider } from "@/components/ui/Card";

export default function VestingForm({ mintAddress, decimals, devTokens, symbol }) {
  const { publicKey } = useWallet();
  const { createVesting, status, streamId, reset } = useVesting();
  const router = useRouter();

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    mintAddress: mintAddress || "",
    amount: devTokens || 150_000_000,
    decimals: decimals || 6,
    symbol: symbol || "",
    startDate: today,
    cliffMonths: 3,
    vestingMonths: 12,
    recipient: "",
    name: "",
    useOwnWallet: true,
  });

  const [error, setError] = useState(null);
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  // Auto-fill mint address from localStorage on component mount
  useEffect(() => {
    if (!form.mintAddress) {
      const lastMint = localStorage.getItem("lastCreatedMint");
      if (lastMint) {
        setForm(f => ({ ...f, mintAddress: lastMint }));
        setIsAutoFilled(true);
      }
    }
  }, [form.mintAddress]);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  const setVal = (field) => (val) => setForm(f => ({ ...f, [field]: val }));

  const clearAutoFill = () => {
    setForm(f => ({ ...f, mintAddress: "" }));
    localStorage.removeItem("lastCreatedMint");
    setIsAutoFilled(false);
  };

  const handleAddLiquidity = () => {
    // Store mint address for auto-fill in pool page
    localStorage.setItem("lastCreatedMint", form.mintAddress);
    router.push("/pool");
  };

  const isCreating = status === "creating";
  const canSubmit = form.mintAddress && form.amount && publicKey && !isCreating;

  const endDate = new Date(
    new Date(form.startDate).getTime() + form.vestingMonths * 30 * 24 * 3600 * 1000
  ).toISOString().split("T")[0];

  const monthlyUnlock = form.cliffMonths === 0
    ? Math.floor(form.amount / form.vestingMonths)
    : form.amount;

  const handleSubmit = async () => {
    setError(null);
    try {
      const recipient = form.useOwnWallet ? publicKey.toBase58() : form.recipient;
      await createVesting({
        mintAddress: form.mintAddress,
        amount: form.amount,
        decimals: form.decimals,
        startDate: new Date(form.startDate),
        cliffMonths: form.cliffMonths,
        vestingMonths: form.vestingMonths,
        recipientAddress: recipient,
        name: form.name || `Dev Allocation - ${form.symbol || form.mintAddress.slice(0, 8)}`,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // ── Not connected ──
  if (!publicKey) {
    return (
      <div style={{ padding: "48px 0", textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "var(--muted)" }}>Connect your wallet to continue</p>
      </div>
    );
  }

  // ── Done ──
  if (status === "done") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Stream active</h2>
              <p style={{ fontSize: 13, color: "var(--muted)" }}>{form.amount.toLocaleString()} tokens locked</p>
            </div>
            <Badge variant="success">Live</Badge>
          </div>

          <Divider />

          <div style={{ margin: "20px 0" }}>
            <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>Stream ID</p>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", fontFamily: "'Geist Mono', monospace", fontSize: 12, color: "var(--text)", wordBreak: "break-all" }}>
              {streamId}
            </div>
          </div>

          <a href="https://app.streamflow.finance/" target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", fontSize: 13, padding: "10px 0", borderRadius: 8, textDecoration: "none", background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}>
            View on Streamflow ↗
          </a>
        </Card>

        <div style={{ display: "flex", gap: 8 }}>
          <Button onClick={reset} variant="ghost" style={{ flex: 1 }}>Create another stream</Button>
          <Button onClick={handleAddLiquidity} variant="ghost" style={{ flex: 1 }}>Add Liquidity →</Button>
        </div>
      </div>
    );
  }

  // ── Form ──
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingBottom: "100px" }}>

      {/* Token */}
      <Card>
        <SectionTitle>Token</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <Input label="Mint address" placeholder="Token address from step 1" value={form.mintAddress} onChange={set("mintAddress")} onFocus={(e) => {
     setTimeout(() => {
       e.target.scrollIntoView({ 
         behavior: 'smooth', 
         block: 'center',
         inline: 'nearest'
       });
     }, 400);
   }} />
            {isAutoFilled && form.mintAddress && (
              <div style={{ marginTop: 6, fontSize: 11, color: "var(--text-3)", display: "flex", alignItems: "center", gap: 6 }}>
                Auto-filled from your last created token ·{" "}
                <button 
                  onClick={clearAutoFill}
                  style={{ 
                    background: "none", 
                    border: "none", 
                    color: "var(--text-3)", 
                    textDecoration: "underline", 
                    cursor: "pointer", 
                    fontSize: 11,
                    padding: 0,
                    fontFamily: "inherit"
                  }}
                >
                  Clear
                </button>
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <Input label="Amount to lock" type="number" value={form.amount} onChange={e => setVal("amount")(Number(e.target.value))} onFocus={(e) => {
     setTimeout(() => {
       e.target.scrollIntoView({ 
         behavior: 'smooth', 
         block: 'center',
         inline: 'nearest'
       });
     }, 400);
   }} />
            </div>
            <div style={{ width: 110, display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)" }}>Decimals</span>
              <select value={form.decimals} onChange={e => setVal("decimals")(Number(e.target.value))} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", fontSize: 14, color: "var(--text)", outline: "none", fontFamily: "'Geist', sans-serif" }}>
                <option value={6}>6</option>
                <option value={9}>9</option>
              </select>
            </div>
          </div>
          <Input label="Stream name" placeholder={`Dev Allocation - ${form.symbol || "MyToken"}`} value={form.name} onChange={set("name")} onFocus={(e) => {
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

      {/* Schedule */}
      <Card>
        <SectionTitle>Schedule</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Input label="Start date" type="date" min={today} value={form.startDate} onChange={set("startDate")} onFocus={(e) => {
     setTimeout(() => {
       e.target.scrollIntoView({ 
         behavior: 'smooth', 
         block: 'center',
         inline: 'nearest'
       });
     }, 400);
   }} />

          {/* Cliff */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)" }}>Cliff period</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                {form.cliffMonths === 0 ? "None" : `${form.cliffMonths}mo`}
              </span>
            </div>
            <input type="range" min={0} max={12} value={form.cliffMonths} style={{ width: "100%", accentColor: "var(--text)", cursor: "pointer" }} onChange={e => setVal("cliffMonths")(Number(e.target.value))} />
            <p style={{ fontSize: 12, color: "var(--dim)" }}>
              {form.cliffMonths === 0
                ? "Tokens unlock linearly from start date"
                : `No tokens released for ${form.cliffMonths} month${form.cliffMonths > 1 ? "s" : ""}, then full release`}
            </p>
          </div>

          {/* Duration */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)" }}>Duration</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                {form.vestingMonths} month{form.vestingMonths > 1 ? "s" : ""}
              </span>
            </div>
            <input type="range" min={1} max={36} value={form.vestingMonths} style={{ width: "100%", accentColor: "var(--text)", cursor: "pointer" }} onChange={e => setVal("vestingMonths")(Number(e.target.value))} />
          </div>
        </div>
      </Card>

      {/* Summary */}
      <Card>
        <SectionTitle>Summary</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "'Geist Mono', monospace", fontSize: 12 }}>
          {[
            { label: "Start", value: form.startDate },
            form.cliffMonths > 0
              ? { label: "Cliff release", value: `${form.cliffMonths}mo — ${form.amount.toLocaleString()}` }
              : { label: "Monthly unlock", value: `~${monthlyUnlock.toLocaleString()}` },
            { label: "End date", value: endDate },
            { label: "Total locked", value: `${form.amount.toLocaleString()}`, highlight: true },
          ].map((row, i, arr) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 0",
              borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <span style={{ color: "var(--muted)" }}>{row.label}</span>
              <span style={{ color: row.highlight ? "var(--green)" : "var(--text)", fontWeight: row.highlight ? 600 : 400 }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Recipient */}
      <Card>
        <SectionTitle>Recipient</SectionTitle>
        <label style={{
          display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
          padding: "12px 14px", borderRadius: 8, marginBottom: 12,
          background: form.useOwnWallet ? "var(--surface)" : "transparent",
          border: "1px solid var(--border)",
        }}>
          <input type="checkbox" checked={form.useOwnWallet} style={{ width: 15, height: 15, accentColor: "var(--text)", cursor: "pointer" }} onChange={e => setForm(f => ({ ...f, useOwnWallet: e.target.checked }))} />
          <span style={{ fontSize: 13, fontWeight: 500 }}>Send to my own wallet</span>
        </label>

        {form.useOwnWallet ? (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", fontFamily: "'Geist Mono', monospace", fontSize: 11, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {publicKey.toBase58()}
          </div>
        ) : (
          <Input label="Recipient address" placeholder="Destination wallet address" value={form.recipient} onChange={set("recipient")} onFocus={(e) => {
     setTimeout(() => {
       e.target.scrollIntoView({ 
         behavior: 'smooth', 
         block: 'center',
         inline: 'nearest'
       });
     }, 400);
   }} />
        )}
      </Card>

      <ErrorBox message={error} />

      {isCreating && (
        <div style={{ padding: "12px 16px", borderRadius: 8, background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--text)", animation: "pulse 1.5s infinite" }} />
          <span style={{ fontSize: 13, color: "var(--muted)" }}>Creating Streamflow stream...</span>
        </div>
      )}

      <Button onClick={handleSubmit} disabled={!canSubmit} loading={isCreating}>
        Lock tokens
      </Button>

    </div>
  );
}