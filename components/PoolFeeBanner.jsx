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
            {loading ? (
              <span>Loading...</span>
            ) : (
              <>
                <span style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 500 }}>
                  {balance !== null ? `${balance.toFixed(2)} SOL` : "Unable to fetch"}
                </span>
                {balance !== null && (
                  <span style={{
                    color: isBalanceSufficient ? "var(--green)" : "var(--red)",
                    fontWeight: 500
                  }}>
                    {isBalanceSufficient ? "✓" : "✗"}
                  </span>
                )}
              </>
            )}
          </div>
        )}
      </div>

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