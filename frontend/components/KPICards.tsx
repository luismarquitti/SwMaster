"use client";

import { useEffect, useState } from "react";

/**
 * KPICards — Display active metrics and status.
 */

interface DashboardStats {
  activeSkills: number;
  sodCompliance: number;
  llmModel: string;
  agentStatus: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function KPICards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`${API_URL}/api/dashboard/stats`);
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
        setError(true);
      }
    }
    fetchStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    {
      label: "Active Skills",
      value: stats?.activeSkills ?? "--",
      icon: "extension",
      color: "var(--primary)",
      trend: "4 Ready",
    },
    {
      label: "SOD Compliance",
      value: stats ? `${stats.sodCompliance}%` : "--",
      icon: "verified_user",
      color: "#4ade80",
      trend: "Strict Mode",
    },
    {
      label: "LLM Model",
      value: stats?.llmModel.split("/").pop() ?? "Gemini",
      icon: "neurology",
      color: "#8b5cf6",
      trend: stats?.llmModel.includes("pro") ? "Pro Tier" : "Active",
    },
    {
      label: "Agent Status",
      value: stats?.agentStatus ?? "Offline",
      icon: "sensors",
      color: stats?.agentStatus === "Active" ? "#4ade80" : "#ef4444",
      trend: "Latency: 24ms",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className="p-5 rounded-3xl border transition-all hover:shadow-lg group animate-fade-in"
          style={{
            background: "var(--surface-container-low)",
            borderColor: "rgba(204, 195, 213, 0.1)",
            animationDelay: `${i * 100}ms`,
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ background: `${card.color}15`, color: card.color }}
            >
              <span className="material-symbols-outlined text-xl">{card.icon}</span>
            </div>
            <div className="text-[10px] font-bold py-1 px-2 rounded-full bg-white/5 opacity-60">
              {card.trend}
            </div>
          </div>
          <h3 className="text-[11px] font-bold opacity-50 uppercase tracking-widest mb-1">
            {card.label}
          </h3>
          <p className="text-2xl font-bold tracking-tight">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
