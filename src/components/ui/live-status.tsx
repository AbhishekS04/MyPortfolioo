"use client";

import { useEffect, useMemo, useState } from "react";

interface LiveStatusProps {
  endpoint: string;
  pollInterval?: number;
  className?: string;
  style?: React.CSSProperties;
  labels?: {
    vibing?: string;
    offline?: string;
  };
}

interface StatusPayload {
  state: "vibing" | "offline";
  updated_at: string;
  source: string;
}

function getRelativeTime(isoString: string, nowMs = Date.now()) {
  const date = new Date(isoString);
  const diffMs = nowMs - date.getTime();

  if (Number.isNaN(diffMs) || diffMs < 0) {
    return "just now";
  }

  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 10) return "just now";
  if (diffSecs < 60) return `${diffSecs}s ago`;

  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function LiveStatus({
  endpoint,
  pollInterval = 20000,
  className = "",
  style,
  labels = {},
}: LiveStatusProps) {
  const [status, setStatus] = useState<StatusPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [nowTick, setNowTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const fetchStatus = async () => {
      try {
        const url = new URL(endpoint);
        url.searchParams.set("_t", Date.now().toString());

        const response = await fetch(url.toString(), {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch status: ${response.status} ${response.statusText}`,
          );
        }

        const data = (await response.json()) as StatusPayload;

        if (!cancelled) {
          setStatus(data);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setStatus(null);
          setLoading(false);
        }
      }
    };

    fetchStatus();
    intervalId = setInterval(fetchStatus, pollInterval);

    return () => {
      cancelled = true;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [endpoint, pollInterval]);

  useEffect(() => {
    if (!status || status.state !== "offline") return;

    const interval = setInterval(() => {
      setNowTick(Date.now());
    }, 10000);

    return () => clearInterval(interval);
  }, [status]);

  const stateStr = status ? status.state : "offline";
  const relativeTime = useMemo(() => {
    if (!status || status.state !== "offline") {
      return "just now";
    }

    return getRelativeTime(status.updated_at, nowTick);
  }, [status, nowTick]);

  const displayLabel = useMemo(() => {
    if (stateStr === "vibing") {
      return labels.vibing || "Vibing";
    }

    const baseOfflineLabel = labels.offline || "Offline";
    return `${baseOfflineLabel} · ${relativeTime}`;
  }, [labels, relativeTime, stateStr]);

  const containerStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 12px",
    borderRadius: "20px",
    backgroundColor: "#18181b",
    border: "1px solid #27272a",
    color: "#e4e4e7",
    fontSize: "13px",
    fontWeight: 500,
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    ...style,
  };

  const dotStyle: React.CSSProperties = {
    width: "8px",
    height: "8px",
    borderRadius: "9999px",
    backgroundColor: stateStr === "vibing" ? "#22c55e" : "#71717a",
    boxShadow:
      stateStr === "vibing"
        ? "0 0 0 4px rgba(34, 197, 94, 0.15)"
        : "0 0 0 4px rgba(113, 113, 122, 0.15)",
    flexShrink: 0,
  };

  return (
    <div className={className} style={containerStyle} aria-live="polite">
      <span style={dotStyle} />
      <span>{loading ? "Loading..." : displayLabel}</span>
    </div>
  );
}
