"use client";

import { useEffect, useState } from "react";
import KPICard from "./KPICard";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface KPI { id: string; label: string; icon: string; value: string; color: string; }
const CFG: KPI[] = [
  { id: "efficiency", label: "Efficiency", icon: "bolt", value: "94%", color: "#4ade80" },
  { id: "quality", label: "Quality", icon: "verified_user", value: "98.2%", color: "#60a5fa" },
  { id: "coverage", label: "Coverage", icon: "neurology", value: "88%", color: "#a78bfa" },
  { id: "performance", label: "Latency", icon: "sensors", value: "24ms", color: "#fbbf24" },
];

/**
 * KPICards - Ultra-flattened (Depth 2).
 */
export default function KPICards() {
  const [, setD] = useState(null);
  useEffect(() => { fetch(`${API_BASE}/api/stats`).then(r => r.json()).then(d => setD(d)).catch(e => console.error(e)); }, []);
  return <section className="p-8 pb-0 flex gap-4 w-full">{CFG.map(k => <KPICard key={k.id} k={k} />)}</section>;
}
