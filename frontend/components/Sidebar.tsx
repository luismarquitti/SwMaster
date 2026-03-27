"use client";

import { useState } from "react";

interface NavItem { id: string; label: string; icon: string; }
const MAIN_NAV: NavItem[] = [ 
  { id: "agents", label: "Agents", icon: "smart_toy" }, 
  { id: "workflows", label: "Workflows", icon: "account_tree" }, 
  { id: "memory", label: "Memory", icon: "database" },
  { id: "finance", label: "Finance", icon: "payments" }
];
const SYS_NAV: NavItem[] = [ { id: "settings", label: "Settings", icon: "settings" } ];

const LogoIcon = () => <div className="p-1.5 rounded-lg bg-[var(--primary)]"><span className="material-symbols-outlined text-white text-base">grid_view</span></div>;
const Logo = () => <div className="h-16 flex items-center px-6 gap-3 mb-4 shrink-0"><LogoIcon /><h1 className="text-xs font-bold tracking-widest uppercase opacity-70">SwMaster</h1></div>;

const NavBtn = ({ id, active, label, icon, onSelect }: { id: string; active: string; label: string; icon: string; onSelect: (id: string) => void }) => (
  <button onClick={() => onSelect(id)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${active === id ? "bg-[var(--primary)] text-white shadow-lg" : "text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-high)]"}`}>
    <span className="material-symbols-outlined text-[20px]">{icon}</span>
    <span className="text-xs font-medium">{label}</span>
  </button>
);

const UserAvatar = () => <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-[10px] text-white font-bold">JD</div>;
const UserInfo = () => <div className="flex-1 min-w-0"><p className="text-[11px] font-bold truncate">John Doe</p><p className="text-[10px] opacity-40 truncate">Solutions Architect</p></div>;
const UserProfile = () => <div className="p-4 border-t mt-auto border-[rgba(204,195,213,0.1)]"><div className="flex items-center gap-3 p-2 rounded-xl border border-transparent hover:border-[var(--outline-variant)] hover:bg-[var(--surface-container)] cursor-pointer transition-all"><UserAvatar /><UserInfo /></div></div>;

/**
 * Sidebar - Brutally flattened to Depth 2. No 'any' types.
 */
export default function Sidebar({ activeInit = "agents" }: { activeInit?: string }) {
  const [active, setActive] = useState(activeInit);
  return (
    <aside className="w-64 h-full flex flex-col border-r bg-[var(--surface-container-lowest)] border-[rgba(204,195,213,0.1)]">
      <Logo />
      <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
        <div className="space-y-1">{MAIN_NAV.map((n) => <NavBtn key={n.id} {...n} active={active} onSelect={setActive} />)}</div>
        <div className="space-y-1">{SYS_NAV.map((n) => <NavBtn key={n.id} {...n} active={active} onSelect={setActive} />)}</div>
      </nav>
      <UserProfile />
    </aside>
  );
}
