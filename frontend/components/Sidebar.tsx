"use client";

/**
 * Sidebar — Left navigation rail.
 *
 * Shows SwMaster agent skills and navigation sections
 * matching the stitch design's icon rail.
 */

import { useState } from "react";

interface NavItem {
  id: string;
  icon: string;
  label: string;
  filled?: boolean;
}

const navItems: NavItem[] = [
  { id: "dashboard", icon: "dashboard", label: "Dashboard", filled: true },
  { id: "agents", icon: "smart_toy", label: "Agents" },
  { id: "workflows", icon: "account_tree", label: "Workflows" },
  { id: "memory", icon: "database", label: "Memory" },
  { id: "settings", icon: "settings", label: "Settings" },
];

export default function Sidebar() {
  const [active, setActive] = useState("dashboard");

  return (
    <nav className="fixed left-0 top-0 h-full z-40 w-20 flex flex-col border-r"
         style={{
           background: "var(--surface-container-low)",
           borderColor: "rgba(204, 195, 213, 0.3)",
         }}>
      <div className="flex flex-col items-center py-6 gap-8 h-full">
        {/* Logo */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
          style={{ background: "var(--primary)" }}
          title="SwMaster"
        >
          S
        </div>

        {/* Nav Icons */}
        <div className="flex flex-col items-center gap-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              title={item.label}
              className={`rounded-2xl p-3 transition-all duration-200 ${
                active === item.id
                  ? "text-[var(--on-secondary-container)]"
                  : "text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)]"
              }`}
              style={
                active === item.id
                  ? { background: "var(--secondary-container)" }
                  : undefined
              }
            >
              <span
                className="material-symbols-outlined block"
                style={
                  active === item.id
                    ? { fontVariationSettings: "'FILL' 1" }
                    : undefined
                }
              >
                {item.icon}
              </span>
            </button>
          ))}
        </div>

        {/* Avatar */}
        <div className="mt-auto">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              background: "var(--primary-container)",
              color: "var(--on-primary-container)",
            }}
          >
            LM
          </div>
        </div>
      </div>
    </nav>
  );
}
