"use client";

import { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function PoolFeeBanner({ tokenAmount }) {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  const MINIMUM_SOL_REQUIRED = 0.25;

  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey || !connection) {
        setBalance(null);
        return;
      }

      try {
        setLoading(true);
        const balanceResponse = await connection.getBalance(publicKey);
        setBalance(balanceResponse / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();

    // Refresh balance every 10 seconds when wallet is connected
    const interval = publicKey ? setInterval(fetchBalance, 10000) : null;
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [publicKey, connection]);

  const serviceFee = tokenAmount ? (parseFloat(tokenAmount) * 0.001).toFixed(6) : "0";

  const isBalanceSufficient = balance !== null && balance >= MINIMUM_SOL_REQUIRED;
  const shouldShowJupiterLink = publicKey && balance !== null && !isBalanceSufficient;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Fee Banner */}
      <div style={{
        padding: "16px",
        borderRadius: 12,
        background: "rgba(245,158,11,0.04)",
        border: "1px solid var(--amber)",
        display: "flex",
        gap: 12
      }}>
        <div style={{
          width: 20,
          height: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--amber)",
          fontSize: 16,
          flexShrink: 0
        }}>
          ⚠️
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--text)",
            marginBottom: 12,
            fontFamily: "'Syne', sans-serif"
          }}>
            Pool creation costs
          </h3>
          <div style={{
            fontSize: 13,
            color: "var(--text-2)",
            lineHeight: 1.6,
            fontFamily: "'Geist Mono', monospace"
          }}>
            <div style={{ marginBottom: 4 }}>• Orca Whirlpool initialization : ~0.15 SOL</div>
            <div style={{ marginBottom: 4 }}>• Tick arrays (3x) : ~0.09 SOL</div>
            <div style={{ marginBottom: 4 }}>• Position NFT : ~0.003 SOL</div>
            <div style={{ margin: "8px 0", color: "var(--border)" }}>──────────────────</div>
            <div style={{ marginBottom: 4, fontWeight: 500 }}>• Total estimé : ~{MINIMUM_SOL_REQUIRED} SOL minimum</div>
            <div style={{ marginBottom: 12, fontWeight: 500 }}>• Service fee : 0.1% of deposited tokens</div>
          </div>
          <p style={{
            fontSize: 11,
            color: "var(--text-3)",
            lineHeight: 1.4,
            marginTop: 8
          }}>
            Most fees go to Orca protocol and are used to rent on-chain accounts. They are not recoverable.
          </p>
        </div>
      </div>

      {/* Balance Check */}
      {publicKey && (
        <div style={{
          padding: "12px 16px",
          borderRadius: 8,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>
              Your balance:
            </span>
            {loading ? (
              <span style={{ fontSize: 13, color: "var(--muted)" }}>Loading...</span>
            ) : (
              <span style={{
                fontSize: 13,
                fontFamily: "'Geist Mono', monospace",
                fontWeight: 500
              }}>
                {balance !== null ? `${balance.toFixed(4)} SOL` : "Unable to fetch"}
              </span>
            )}
          </div>
          
          {balance !== null && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                fontSize: 12,
                color: isBalanceSufficient ? "var(--green)" : "var(--red)",
                fontWeight: 500
              }}>
                {isBalanceSufficient ? "✓ Sufficient" : "✗ Insufficient"}
              </span>
              {!isBalanceSufficient && (
                <span style={{
                  fontSize: 11,
                  color: "var(--red)",
                  fontStyle: "italic"
                }}>
                  — you need at least {MINIMUM_SOL_REQUIRED} SOL
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Jupiter Link */}
      {shouldShowJupiterLink && (
        <div style={{
          padding: "10px 16px",
          borderRadius: 8,
          background: "var(--surface-2)",
          border: "1px solid var(--border-strong)",
          textAlign: "center"
        }}>
          <a
            href="https://jup.ag/swap/USDC-SOL"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 13,
              color: "var(--blue)",
              textDecoration: "none",
              fontWeight: 500,
              borderBottom: "1px solid var(--blue)"
            }}
          >
            Get SOL on Jupiter →
          </a>
        </div>
      )}

      {/* Service Fee Display */}
      {tokenAmount && parseFloat(tokenAmount) > 0 && (
        <div style={{
          padding: "10px 16px",
          borderRadius: 8,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>
            Service fee (0.1%):
          </span>
          <span style={{
            fontSize: 13,
            fontFamily: "'Geist Mono', monospace",
            fontWeight: 500,
            color: "var(--text)"
          }}>
            {serviceFee} tokens
          </span>
        </div>
      )}
    </div>
  );
}