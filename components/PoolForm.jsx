"use client";

import { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWhirlpool } from "@/hooks/useWhirlpool";
import { Card, SectionTitle, Input, Button, LogConsole, ErrorBox, Badge, Divider } from "@/components/ui/Card";
import WalletButton from "@/components/WalletButton";
import FeedbackModal from "./FeedbackModal";

export default function PoolForm() {
  const { createPool, status, logs, result, error } = useWhirlpool();
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(null);
  const [form, setForm] = useState({
    tokenMint: "", tokenDecimals: "9", pairedWith: "SOL",
    initialPrice: "", amountToken: "", amountPaired: "",
  });
  
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));
  const isLoading = status === "loading";
  const MINIMUM_SOL_REQUIRED = 0.25;

  // Auto-fill mint address from localStorage on component mount
  useEffect(() => {
    if (!form.tokenMint) {
      const lastMint = localStorage.getItem("lastCreatedMint");
      if (lastMint) {
        setForm(f => ({ ...f, tokenMint: lastMint }));
        setIsAutoFilled(true);
      }
    }
  }, [form.tokenMint]);

  // Show feedback modal when pool creation is successful
  useEffect(() => {
    if (status === "success") {
      setShowFeedback(true);
    }
  }, [status]);

  const clearAutoFill = () => {
    setForm(f => ({ ...f, tokenMint: "" }));
    localStorage.removeItem("lastCreatedMint");
    setIsAutoFilled(false);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey || !connection) {
        setBalance(null);
        return;
      }

      try {
        const balanceResponse = await connection.getBalance(publicKey);
        setBalance(balanceResponse / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance(null);
      }
    };

    fetchBalance();
    const interval = publicKey ? setInterval(fetchBalance, 10000) : null;
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [publicKey, connection]);

  const isBalanceSufficient = balance !== null && balance >= MINIMUM_SOL_REQUIRED;
  const isFormValid = form.tokenMint && form.initialPrice && (!publicKey || isBalanceSufficient);

  const handleCreate = () => createPool({
    tokenMint: form.tokenMint,
    tokenDecimals: parseInt(form.tokenDecimals),
    pairedWith: form.pairedWith,
    initialPrice: parseFloat(form.initialPrice),
    amountToken: parseFloat(form.amountToken),
    amountPaired: parseFloat(form.amountPaired),
  });

  // ── Not connected ──
  if (!publicKey) {
    return (
      <div style={{ padding: "48px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <p style={{ fontSize: 14, color: "var(--muted)" }}>Connect your wallet to create a liquidity pool</p>
        <WalletButton />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingBottom: "100px" }}>

      {/* Mint */}
      <Card>
        <SectionTitle>Token</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <Input label="Mint address" placeholder="Your token address..." value={form.tokenMint} onChange={set("tokenMint")} disabled={isLoading} onFocus={(e) => {
     setTimeout(() => {
       e.target.scrollIntoView({ 
         behavior: 'smooth', 
         block: 'center',
         inline: 'nearest'
       });
     }, 400);
   }} />
            {isAutoFilled && form.tokenMint && (
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
            <div style={{ width: 100 }}>
              <Input label="Decimals" type="number" min="0" max="9" value={form.tokenDecimals} onChange={set("tokenDecimals")} disabled={isLoading} onFocus={(e) => {
     setTimeout(() => {
       e.target.scrollIntoView({ 
         behavior: 'smooth', 
         block: 'center',
         inline: 'nearest'
       });
     }, 400);
   }} />
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
          
          {/* Inline Fee Warning */}
          <div style={{
            borderLeft: "2px solid var(--amber)",
            paddingLeft: 12,
            background: "transparent"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ color: "var(--amber)", fontSize: 14 }}>⚠</span>
              <span style={{
                fontSize: 13,
                color: "var(--text-2)",
                fontFamily: "'Geist', sans-serif"
              }}>
                Pool creation requires ~0.25 SOL (Orca protocol fees) + 0.1% of deposited tokens (service fee).
              </span>
            </div>
            
            {/* Balance Display - inline */}
            {publicKey && (
              <div style={{ fontSize: 11, color: "var(--text-3)", display: "flex", alignItems: "center", gap: 8 }}>
                <span>Your balance: </span>
                {balance ? (
                  <>
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 500 }}>
                      {balance.toFixed(2)} SOL
                    </span>
                    <span style={{
                      color: isBalanceSufficient ? "var(--green)" : "var(--red)",
                      fontWeight: 500
                    }}>
                      {isBalanceSufficient ? "✓" : "✗"}
                    </span>
                  </>
                ) : (
                  <span>Loading...</span>
                )}
              </div>
            )}
          </div>
          
          <Input label="Initial price" hint="Ignored if pool already exists" type="number" step="any" placeholder="Ex: 0.001" value={form.initialPrice} onChange={set("initialPrice")} disabled={isLoading} onFocus={(e) => {
     setTimeout(() => {
       e.target.scrollIntoView({ 
         behavior: 'smooth', 
         block: 'center',
         inline: 'nearest'
       });
     }, 400);
   }} />
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <Input label="Token amount" type="number" step="any" placeholder="Ex: 1000" value={form.amountToken} onChange={set("amountToken")} disabled={isLoading} onFocus={(e) => {
     setTimeout(() => {
       e.target.scrollIntoView({ 
         behavior: 'smooth', 
         block: 'center',
         inline: 'nearest'
       });
     }, 400);
   }} />
            </div>
            <div style={{ flex: 1 }}>
              <Input label={`${form.pairedWith} amount`} type="number" step="any" placeholder={form.pairedWith === "SOL" ? "Ex: 0.5" : "Ex: 10"} value={form.amountPaired} onChange={set("amountPaired")} disabled={isLoading} onFocus={(e) => {
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
        const poolUrl = `https://solscan.io/account/${result.poolAddress}`;
        const txUrl = `https://solscan.io/tx/${result.txSignature}`;
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

      <Button 
        onClick={handleCreate} 
        loading={isLoading} 
        disabled={!isFormValid}
        title={publicKey && !isBalanceSufficient ? `Insufficient SOL balance. You need at least ${MINIMUM_SOL_REQUIRED} SOL to create a pool.` : undefined}
      >
        {publicKey && !isBalanceSufficient ? "Insufficient SOL balance" : "Create pool"}
      </Button>

      {showFeedback && <FeedbackModal step="pool" onClose={() => setShowFeedback(false)} />}
    </div>
  );
}