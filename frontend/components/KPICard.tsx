"use client";

interface KPI { id: string; label: string; icon: string; value: string; color: string; }

const ICON_BG_ALPHA = "15";

/**
 * KPIIcon - Pure presentational component.
 */
const KPIIcon = ({ color, icon }: { color: string; icon: string }) => (
  <div className="p-2 rounded-xl" style={{ background: `${color}${ICON_BG_ALPHA}`, color }}>
    <span className="material-symbols-outlined text-[18px]">{icon}</span>
  </div>
);

/**
 * KPICard - Atomic unit for the dashboard.
 * Depth: 2 (Function -> div).
 */
export default function KPICard({ k }: { k: KPI }) {
  return (
    <div className="flex-1 bg-[var(--surface-container)] p-4 rounded-2xl border border-[rgba(204,195,213,0.1)]">
      <div className="flex items-center gap-3 mb-3">
        <KPIIcon color={k.color} icon={k.icon} />
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-40">{k.label}</span>
      </div>
      <div className="text-xl font-bold">{k.value}</div>
    </div>
  );
}
