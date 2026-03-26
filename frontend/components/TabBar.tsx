"use client";

/**
 * TabBar — Section tabs for the main content area.
 */

import { useState } from "react";

interface Tab {
  id: string;
  icon: string;
  label: string;
}

const tabs: Tab[] = [
  { id: "overview", icon: "insights", label: "Agent Overview" },
  { id: "skills", icon: "psychology", label: "Skills & Roles" },
  { id: "workflows", icon: "account_tree", label: "Workflow Pipeline" },
  { id: "memory", icon: "storage", label: "Memory & ADRs" },
];

export default function TabBar() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div
      className="px-6 flex items-center justify-between border-b"
      style={{
        background: "var(--surface-container-lowest)",
        borderColor: "rgba(204, 195, 213, 0.2)",
      }}
    >
      <div className="flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 text-sm font-medium flex items-center gap-2 transition-colors ${
              activeTab === tab.id
                ? "border-b-[3px]"
                : "text-[var(--on-surface-variant)] hover:text-[var(--primary)]"
            }`}
            style={
              activeTab === tab.id
                ? {
                    borderColor: "var(--primary)",
                    color: "var(--primary)",
                  }
                : undefined
            }
          >
            <span className="material-symbols-outlined text-sm">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      <button className="p-1.5 rounded-md hover:opacity-70 transition"
              style={{ color: "var(--outline)" }}>
        <span className="material-symbols-outlined text-sm">add</span>
      </button>
    </div>
  );
}
