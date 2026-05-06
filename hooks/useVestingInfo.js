"use client";

import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { SolanaStreamClient, ICluster } from "@streamflow/stream";

export function useVestingInfo(mint) {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [state, setState] = useState({
    loading: true,
    error: null,
    streams: [],
    totalLocked: null,
    totalUnlocked: null,
  });

  useEffect(() => {
    if (!mint) return;

    async function load() {
      setState((s) => ({ ...s, loading: true, error: null }));

      try {
        const client = new SolanaStreamClient(
          connection.rpcEndpoint,
          ICluster.Mainnet
        );

        // Fetch tous les contrats liés à ce mint
        const streams = await client.get({ mint });

        const parsed = Object.entries(streams).map(([id, stream]) => {
          const decimals = stream.mint ? 9 : 9; // fallback
          const divisor = Math.pow(10, decimals);

          const depositedAmount = stream.depositedAmount
            ? stream.depositedAmount.toNumber() / divisor
            : 0;

          const withdrawnAmount = stream.withdrawnAmount
            ? stream.withdrawnAmount.toNumber() / divisor
            : 0;

          const remainingAmount = depositedAmount - withdrawnAmount;

          const start = stream.start
            ? new Date(stream.start * 1000)
            : null;

          const end = stream.end
            ? new Date(stream.end * 1000)
            : null;

          const now = Date.now() / 1000;
          const isActive = stream.start && stream.end
            ? now >= stream.start && now <= stream.end
            : false;

          const isCompleted = stream.end ? now > stream.end : false;

          const progressPct =
            stream.start && stream.end && now >= stream.start
              ? Math.min(
                  100,
                  ((now - stream.start) / (stream.end - stream.start)) * 100
                ).toFixed(1)
              : 0;

          return {
            id,
            name: stream.name || "Sans nom",
            recipient: stream.recipient,
            depositedAmount,
            withdrawnAmount,
            remainingAmount,
            start,
            end,
            isActive,
            isCompleted,
            progressPct,
            canceledAt: stream.canceledAt
              ? new Date(stream.canceledAt * 1000)
              : null,
          };
        });

        // Stats globales
        const totalLocked = parsed.reduce(
          (acc, s) => acc + s.remainingAmount,
          0
        );
        const totalUnlocked = parsed.reduce(
          (acc, s) => acc + s.withdrawnAmount,
          0
        );

        setState({
          loading: false,
          error: null,
          streams: parsed,
          totalLocked,
          totalUnlocked,
        });
      } catch (err) {
        console.warn("[useVestingInfo] error:", err.message);
        // Pas d'erreur bloquante si pas de streams
        setState({
          loading: false,
          error: null,
          streams: [],
          totalLocked: 0,
          totalUnlocked: 0,
        });
      }
    }

    load();
  }, [mint]);

  return state;
}
