"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { createSetAuthorityInstruction, AuthorityType } from "@solana/spl-token";
import { Card, SectionTitle, Input, Button, ErrorBox } from "@/components/ui/Card";

function RevokeForm() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const searchParams = useSearchParams();

  const [mint, setMint] = useState(searchParams.get("mint") || "");
  const [authorities, setAuthorities] = useState(null);
  const [loading, setLoading] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [revoked, setRevoked] = useState(false);
  const [error, setError] = useState(null);

  const checkAuthorities = async () => {
    if (!mint) return;
    setLoading(true);
    setError(null);
    try {
      const mintPubkey = new PublicKey(mint);
      const info = await connection.getParsedAccountInfo(mintPubkey);
      const parsed = info.value?.data?.parsed?.info;
      if (!parsed) throw new Error("Token not found");
      setAuthorities({
        mintAuthority: parsed.mintAuthority || null,
        freezeAuthority: parsed.freezeAuthority || null,
      });
    } catch (e) {
      setError(e.message);
      setAuthorities(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (mint) checkAuthorities();
  }, []);

  const handleRevoke = async () => {
    if (!publicKey || !mint) return;
    setRevoking(true);
    setError(null);
    try {
      const mintPubkey = new PublicKey(mint);
      const instructions = [];

      if (authorities?.mintAuthority) {
        instructions.push(
          createSetAuthorityInstruction(mintPubkey, publicKey, AuthorityType.MintTokens, null)
        );
      }
      if (authorities?.freezeAuthority) {
        instructions.push(
          createSetAuthorityInstruction(mintPubkey, publicKey, AuthorityType.FreezeAccount, null)
        );
      }

      if (!instructions.length) {
        setError("No authorities to revoke.");
        setRevoking(false);
        return;
      }

      const tx = new Transaction().add(...instructions);
      tx.feePayer = publicKey;
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, "confirmed");

      setRevoked(true);
      setAuthorities({ mintAuthority: null, freezeAuthority: null });
    } catch (e) {
      setError(e.message);
    }
    setRevoking(false);
  };

  if (!publicKey) {
    return (
      <div style={{ padding: "48px 0", textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "var(--muted)" }}>Connect your wallet to continue</p>
      </div>
    );
  }

  const canRevoke = authorities?.mintAuthority || authorities?.freezeAuthority;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {/* Input */}
      <Card>
        <SectionTitle>Token address</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Input
            label="Mint address"
            placeholder="Enter token mint address..."
            value={mint}
            onChange={e => { setMint(e.target.value); setAuthorities(null); setRevoked(false); }}
          />
          <Button onClick={checkAuthorities} loading={loading} disabled={!mint} variant="ghost">
            Check authorities
          </Button>
        </div>
      </Card>

      {/* Status */}
      {authorities && (
        <Card>
          <SectionTitle>Current status</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Mint Authority", value: authorities.mintAuthority },
              { label: "Freeze Authority", value: authorities.freezeAuthority },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 8, background: "var(--surface)", border: "1px solid var(--border)" }}>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>{label}</span>
                <span style={{
                  fontSize: 12,
                  fontFamily: "'Geist Mono', monospace",
                  fontWeight: 500,
                  color: value ? "var(--red)" : "var(--green)",
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: value ? "var(--red-dim)" : "var(--green-dim)",
                  border: value ? "1px solid var(--red-border)" : "1px solid var(--green-border)",
                }}>
                  {value ? "Active" : "Revoked"}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Warning */}
      {authorities && canRevoke && !revoked && (
        <div style={{ padding: "12px 14px", borderRadius: 8, background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", fontSize: 13, color: "var(--amber)" }}>
          ⚠️ This action is permanent and cannot be undone. Make sure your vesting is set up before revoking mint authority.
        </div>
      )}

      {/* Success */}
      {revoked && (
        <div style={{ padding: "12px 14px", borderRadius: 8, background: "var(--green-dim)", border: "1px solid var(--green-border)", fontSize: 13, color: "var(--green)", textAlign: "center" }}>
          ✓ Authorities revoked — fully decentralized token
        </div>
      )}

      <ErrorBox message={error} />

      {/* Revoke button */}
      {authorities && canRevoke && !revoked && (
        <Button variant="danger" onClick={handleRevoke} loading={revoking}>
          Revoke authorities
        </Button>
      )}

      {authorities && !canRevoke && !revoked && (
        <div style={{ padding: "12px 14px", borderRadius: 8, background: "var(--surface)", border: "1px solid var(--border)", fontSize: 13, color: "var(--muted)", textAlign: "center" }}>
          All authorities already revoked for this token.
        </div>
      )}
    </div>
  );
}

export default function RevokePage() {
  return (
    <main style={{ padding: "32px 24px 80px" }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8, fontFamily: "'Geist Mono', monospace" }}>
          Revoke
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 6 }}>
          Revoke authorities
        </h1>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
          Permanently remove mint and freeze authority from any token you control.
        </p>
      </div>
      <Suspense fallback={null}>
        <RevokeForm />
      </Suspense>
    </main>
  );
}