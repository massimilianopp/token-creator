"use client";

import { useState } from "react";
import { useWhirlpool } from "@/hooks/useWhirlpool";
import { Card, SectionTitle, Input, Select, Button, LogConsole, ResultBox, ErrorBox } from "@/components/ui/Card";

export default function PoolForm() {
  const { createPool, status, logs, result, error } = useWhirlpool();
  const [form, setForm] = useState({
    tokenMint: "", tokenDecimals: "9", pairedWith: "SOL",
    initialPrice: "", amountToken: "", amountPaired: "",
  });

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));
  const isLoading = status === "loading";

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <SectionTitle>Pool Configuration</SectionTitle>
        <div className="flex flex-col gap-4">
          <Input label="Mint address" placeholder="Your token address..." value={form.tokenMint} onChange={set("tokenMint")} disabled={isLoading} />
          <div className="flex gap-3">
            <Input label="Decimals" type="number" min="0" max="9" value={form.tokenDecimals} onChange={set("tokenDecimals")} disabled={isLoading} />
            <Select label="Pair" value={form.pairedWith} onChange={set("pairedWith")} disabled={isLoading}>
              <option value="SOL">Token / SOL</option>
              <option value="USDC">Token / USDC</option>
            </Select>
          </div>
          <Input label="Initial Price" hint="Ignored if the pool already exists" type="number" step="any" placeholder="Ex: 0.001" value={form.initialPrice} onChange={set("initialPrice")} disabled={isLoading} />
          <div className="flex gap-3">
            <Input label="Token amount" type="number" step="any" placeholder="Ex: 1000" value={form.amountToken} onChange={set("amountToken")} disabled={isLoading} />
            <Input label={`${form.pairedWith} amount`} type="number" step="any" placeholder={form.pairedWith === "SOL" ? "Ex: 0.5" : "Ex: 10"} value={form.amountPaired} onChange={set("amountPaired")} disabled={isLoading} />
          </div>
        </div>
      </Card>

      <Button onClick={() => createPool({ tokenMint: form.tokenMint, tokenDecimals: parseInt(form.tokenDecimals), pairedWith: form.pairedWith, initialPrice: parseFloat(form.initialPrice), amountToken: parseFloat(form.amountToken), amountPaired: parseFloat(form.amountPaired) })} loading={isLoading} disabled={!form.tokenMint || !form.initialPrice}>
        Create Pool
      </Button>

      <LogConsole logs={logs} />
      <ErrorBox message={error} />

      {status === "success" && result && (() => {
        // Replace ?cluster=devnet in both URLs poolUrl and txUrl
        const poolUrl = `https://solscan.io/account/${result.poolAddress}`;
        const txUrl = `https://solscan.io/tx/${result.txSignature}`;
        return (
          <ResultBox>
            <p className="text-xs font-bold" style={{ color: "#10b981" }}>Pool created ✓</p>
            <div className="flex flex-col gap-1 text-xs font-mono">
              <span style={{ color: "#64748b" }}>Pool</span>
              <a href={poolUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#6366f1" }} className="truncate">{result.poolAddress}</a>
              <span style={{ color: "#64748b" }} className="mt-1">Position NFT</span>
              <span style={{ color: "#94a3b8" }} className="truncate">{result.positionMint}</span>
              <span style={{ color: "#64748b" }} className="mt-1">Tx</span>
              <a href={txUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#6366f1" }} className="truncate">{result.txSignature}</a>
            </div>
          </ResultBox>
        );
      })()}
    </div>
  );
}