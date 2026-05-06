"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useVesting } from "../hooks/useVesting";
import { Card, SectionTitle, Input, Button, ErrorBox, ResultBox } from "@/components/ui/Card";

export default function VestingForm({ mintAddress, decimals, devTokens, symbol }) {
  const { publicKey } = useWallet();
  const { createVesting, status, streamId, reset } = useVesting();

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

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  const setVal = (field) => (val) => setForm(f => ({ ...f, [field]: val }));

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

  if (!publicKey) {
    return (
      <Card>
        <div className="flex flex-col items-center gap-3 py-8">
          <span className="text-4xl">🔒</span>
          <p className="text-sm" style={{ color: "#64748b" }}>Connect your wallet to continue</p>
        </div>
      </Card>
    );
  }

  if (status === "done") {
    return (
      <div className="flex flex-col gap-4">
        <Card>
          <div className="flex flex-col items-center gap-2 pb-4 mb-4" style={{ borderBottom: "1px solid #1e1e30" }}>
            <span className="text-5xl">🔒</span>
            <h2 className="text-xl font-extrabold">Vesting active!</h2>
            <p className="text-sm" style={{ color: "#64748b" }}>
              {form.amount.toLocaleString()} tokens locked via Streamflow
            </p>
          </div>

          <SectionTitle>Stream ID</SectionTitle>
          <div className="font-mono text-xs break-all rounded-xl px-4 py-3 mb-4" style={{ background: "#0d0d14", color: "#8b5cf6", border: "1px solid #1e1e30" }}>
            {streamId}
          </div>

          <a href="https://app.streamflow.finance/" target="_blank" rel="noopener noreferrer" className="block text-center text-xs py-3 rounded-xl font-semibold mb-2 transition-all" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", color: "#8b5cf6" }}>
            View on Streamflow ↗
          </a>
        </Card>
        <Button onClick={reset} variant="ghost">+ Create another stream</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Token */}
      <Card>
        <SectionTitle>Token to lock</SectionTitle>
        <div className="flex flex-col gap-4">
          <Input label="Mint address *" placeholder="Token address from step 1" value={form.mintAddress} onChange={set("mintAddress")} />
          <Input label="Stream name" placeholder={`Dev Allocation - ${form.symbol || "MyToken"}`} value={form.name} onChange={set("name")} />
          <div className="flex gap-3">
            <Input label="Tokens to lock *" type="number" value={form.amount} onChange={e => setVal("amount")(Number(e.target.value))} />
            <div className="flex flex-col gap-1.5" style={{ width: 130 }}>
              <span className="text-xs font-semibold" style={{ color: "#64748b" }}>Decimals</span>
              <select className="rounded-xl px-4 py-3 text-sm outline-none" style={{ background: "#0d0d14", border: "1px solid #1e1e30", color: "#f1f5f9" }} value={form.decimals} onChange={e => setVal("decimals")(Number(e.target.value))}>
                <option value={6}>6</option>
                <option value={9}>9</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Schedule */}
      <Card>
        <SectionTitle>Schedule</SectionTitle>
        <div className="flex flex-col gap-5">
          <Input label="Start date" type="date" min={today} value={form.startDate} onChange={set("startDate")} />

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span style={{ color: "#64748b" }}>Cliff</span>
              <span style={{ color: "#8b5cf6" }} className="font-bold">
                {form.cliffMonths === 0 ? "Disabled" : `${form.cliffMonths} month${form.cliffMonths > 1 ? "s" : ""}`}
              </span>
            </div>
            <input type="range" min={0} max={12} value={form.cliffMonths} className="w-full cursor-pointer" style={{ accentColor: "#8b5cf6" }} onChange={e => setVal("cliffMonths")(Number(e.target.value))} />
            <p className="text-xs" style={{ color: "#334155" }}>
              {form.cliffMonths === 0
                ? "Immediate linear unlock"
                : `No unlock for ${form.cliffMonths} month${form.cliffMonths > 1 ? "s" : ""}, then full release`}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span style={{ color: "#64748b" }}>Total duration</span>
              <span style={{ color: "#6366f1" }} className="font-bold">{form.vestingMonths} month{form.vestingMonths > 1 ? "s" : ""}</span>
            </div>
            <input type="range" min={1} max={36} value={form.vestingMonths} className="w-full cursor-pointer" style={{ accentColor: "#6366f1" }} onChange={e => setVal("vestingMonths")(Number(e.target.value))} />
          </div>
        </div>
      </Card>

      {/* Preview */}
      <Card>
        <SectionTitle>📅 Summary</SectionTitle>
        <div className="flex flex-col gap-2 text-xs font-mono" style={{ color: "#64748b" }}>
          {[
            { label: "Start", value: form.startDate, color: "#94a3b8" },
            form.cliffMonths > 0
              ? { label: "Cliff", value: `${form.cliffMonths}mo — ${form.amount.toLocaleString()} tokens`, color: "#8b5cf6" }
              : { label: "Unlock / month", value: `~${monthlyUnlock.toLocaleString()}`, color: "#6366f1" },
            { label: "End", value: endDate, color: "#94a3b8" },
            { label: "Total locked", value: `${form.amount.toLocaleString()} tokens`, color: "#10b981" },
          ].map((row, i) => (
            <div key={i} className="flex justify-between items-center py-2" style={{ borderBottom: i < 3 ? "1px solid #1e1e30" : "none" }}>
              <span>▸ {row.label}</span>
              <span style={{ color: row.color }} className="font-bold">{row.value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Recipient */}
      <Card>
        <SectionTitle>Recipient</SectionTitle>
        <label className="flex items-center gap-3 cursor-pointer rounded-xl px-4 py-3 mb-3 transition-all" style={{ background: form.useOwnWallet ? "rgba(99,102,241,0.05)" : "#0d0d14", border: form.useOwnWallet ? "1px solid rgba(99,102,241,0.2)" : "1px solid #1e1e30" }}>
          <input type="checkbox" checked={form.useOwnWallet} className="w-4 h-4 cursor-pointer" style={{ accentColor: "#6366f1" }} onChange={e => setForm(f => ({ ...f, useOwnWallet: e.target.checked }))} />
          <span className="text-sm font-medium">Send to my own wallet</span>
        </label>

        {form.useOwnWallet ? (
          <div className="font-mono text-xs rounded-xl px-4 py-3 truncate" style={{ background: "#0d0d14", border: "1px solid #1e1e30", color: "#64748b" }}>
            {publicKey.toBase58()}
          </div>
        ) : (
          <Input label="Recipient address" placeholder="Destination wallet address" value={form.recipient} onChange={set("recipient")} />
        )}
      </Card>

      <ErrorBox message={error} />

      {isCreating && (
        <Card>
          <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.3)" }}>
            <span>⏳</span>
            <span className="text-sm" style={{ color: "#6366f1" }}>Creating Streamflow stream...</span>
          </div>
        </Card>
      )}

      <Button onClick={handleSubmit} disabled={!canSubmit} loading={isCreating}>
        🔒 Lock tokens
      </Button>
    </div>
  );
}