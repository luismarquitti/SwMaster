"use client";

import { useState } from "react";

interface Tab { id: string; icon: string; label: string; }

const TABS: Tab[] = [
  { id: "overview", icon: "insights", label: "Agent Overview" },
  { id: "skills", icon: "psychology", label: "Skills & Duties" },
  { id: "workflows", icon: "account_tree", label: "Workflow Pipeline" },
  { id: "memory", icon: "storage", label: "Memory & ADRs" },
];

const TabItem = ({ tab, activeId, onSelect }: { tab: Tab; activeId: string; onSelect: (id: string) => void }) => (
  <button key={tab.id} onClick={() => onSelect(tab.id)} className={`py-3 text-sm font-medium flex items-center gap-2 transition-colors ${activeId === tab.id ? "border-b-[3px] text-[var(--primary)] border-[var(--primary)]" : "text-[var(--on-surface-variant)] hover:text-[var(--primary)] border-b-[3px] border-transparent"}`}>
    <span className="material-symbols-outlined text-sm">{tab.icon}</span>
    <span>{tab.label}</span>
  </button>
);

const AddButton = () => (
  <button className="p-1.5 rounded-md hover:opacity-70 transition self-center" style={{ color: "var(--outline)" }}>
    <span className="material-symbols-outlined text-sm">add</span>
  </button>
);

/**
 * TabBar - Brutally flattened to Depth 2.
 */
export default function TabBar() {
  const [activeTab, setActiveTab] = useState("overview");
  return (
    <nav className="flex gap-8 px-8 border-b shrink-0" style={{ background: "var(--surface-container-lowest)", borderColor: "rgba(204, 195, 213, 0.1)" }}>
      {TABS.map((t) => <TabItem key={t.id} tab={t} activeId={activeTab} onSelect={setActiveTab} />)}
      <div className="flex-1" />
      <AddButton />
    </nav>
  );
}
