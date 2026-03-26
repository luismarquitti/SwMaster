"use client";

/**
 * SystemUpdate — Status notification card for agent updates.
 */

interface SystemUpdateProps {
  type: "success" | "info" | "warning";
  label: string;
  details?: string;
}

export default function SystemUpdate({ type, label, details }: SystemUpdateProps) {
  const icon = type === 'success' ? 'check_circle' : type === 'warning' ? 'warning' : 'info';
  const color = type === 'success' ? '#4ade80' : type === 'warning' ? '#f59e0b' : 'var(--primary)';

  return (
    <div 
      className="my-2 p-3 rounded-xl border-l-4 flex items-start gap-3 bg-[var(--surface-container-low)] shadow-sm animate-slide-in"
      style={{ borderLeftColor: color, borderColor: "rgba(204, 195, 213, 0.1)" }}
    >
      <span 
        className="material-symbols-outlined text-sm shrink-0" 
        style={{ color }}
      >
        {icon}
      </span>
      <div>
        <h5 className="text-[11px] font-bold leading-tight">{label}</h5>
        {details && <p className="text-[10px] opacity-60 mt-0.5 leading-tight">{details}</p>}
      </div>
    </div>
  );
}
