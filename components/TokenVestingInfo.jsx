"use client";

function ProgressBar({ pct }) {
  return (
    <div className="w-full bg-gray-800 rounded-full h-2">
      <div
        className="bg-blue-500 h-2 rounded-full transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function StreamCard({ stream }) {
  const statusColor = stream.isCompleted
    ? "text-green-400"
    : stream.isActive
    ? "text-blue-400"
    : "text-gray-400";

  const statusLabel = stream.canceledAt
    ? "Canceled"
    : stream.isCompleted
    ? "Completed"
    : stream.isActive
    ? "In progress"
    : "Pending";

  const formatDate = (d) =>
    d
      ? d.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  const formatAmount = (n) =>
    n != null ? n.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "—";

  return (
    <div className="bg-gray-900 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-white text-sm">{stream.name}</span>
        <span className={`text-xs font-medium ${statusColor}`}>
          {statusLabel}
        </span>
      </div>

      <div className="flex flex-col gap-1 text-xs text-gray-400">
        <div className="flex justify-between">
          <span>Recipient</span>
          <span className="font-mono text-gray-300 truncate max-w-[200px]">
            {stream.recipient}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Start</span>
          <span className="text-gray-300">{formatDate(stream.start)}</span>
        </div>
        <div className="flex justify-between">
          <span>End</span>
          <span className="text-gray-300">{formatDate(stream.end)}</span>
        </div>
      </div>

      <ProgressBar pct={stream.progressPct} />

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-gray-800 rounded-lg p-2 flex flex-col gap-1">
          <span className="text-gray-500">Total</span>
          <span className="text-white font-semibold">
            {formatAmount(stream.depositedAmount)}
          </span>
        </div>
        <div className="bg-gray-800 rounded-lg p-2 flex flex-col gap-1">
          <span className="text-gray-500">Unlocked</span>
          <span className="text-green-400 font-semibold">
            {formatAmount(stream.withdrawnAmount)}
          </span>
        </div>
        <div className="bg-gray-800 rounded-lg p-2 flex flex-col gap-1">
          <span className="text-gray-500">Remaining</span>
          <span className="text-blue-400 font-semibold">
            {formatAmount(stream.remainingAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function TokenVestingInfo({ streams, totalLocked, totalUnlocked, loading }) {
  if (loading) {
    return (
      <div className="text-sm text-gray-500 animate-pulse">
        Loading vesting contracts...
      </div>
    );
  }

  if (!streams || streams.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No vesting contracts found for this token.
      </div>
    );
  }

  const formatAmount = (n) =>
    n != null ? n.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "—";

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
        Vesting
      </h2>

      {/* Global Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-900 rounded-xl p-4 flex flex-col gap-1">
          <span className="text-xs text-gray-500">Total Locked</span>
          <span className="text-blue-400 font-bold text-lg">
            {formatAmount(totalLocked)}
          </span>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 flex flex-col gap-1">
          <span className="text-xs text-gray-500">Total Unlocked</span>
          <span className="text-green-400 font-bold text-lg">
            {formatAmount(totalUnlocked)}
          </span>
        </div>
      </div>

      {/* Streams List */}
      <div className="flex flex-col gap-3">
        {streams.map((stream) => (
          <StreamCard key={stream.id} stream={stream} />
        ))}
      </div>
    </div>
  );
}