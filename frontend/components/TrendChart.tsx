"use client";

import { memo } from "react";

interface DayData { day: string; eff: number; qly: number; }
const CHART_DATA: DayData[] = [ { day: "Mon", eff: 82, qly: 90 }, { day: "Tue", eff: 85, qly: 92 }, { day: "Wed", eff: 88, qly: 91 }, { day: "Thu", eff: 84, qly: 94 }, { day: "Fri", eff: 90, qly: 95 }, { day: "Sat", eff: 94, qly: 98 }, { day: "Sun", eff: 96, qly: 99 } ];

const GridLines = () => (
  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03]">
    {[0, 1, 2, 3, 4].map(i => <div key={i} className="w-full h-px bg-[var(--on-surface)]" />)}
  </div>
);

const BarPair = ({ d }: { d: DayData }) => (
  <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
    <div className="flex-1 w-full flex items-end justify-center gap-1 min-h-[120px]">
      <div className="w-2 bg-[var(--primary)] rounded-full transition-all group-hover:w-3" style={{ height: `${d.eff}%`, opacity: 0.8 }} title={`Efficiency: ${d.eff}%`} />
      <div className="w-2 bg-[#60a5fa] rounded-full transition-all group-hover:w-3" style={{ height: `${d.qly}%`, opacity: 0.8 }} title={`Quality: ${d.qly}%`} />
    </div>
    <span className="text-[10px] font-bold opacity-30 uppercase tracking-tighter">{d.day}</span>
  </div>
);

/**
 * TrendChart - Brutally flattened to Depth 2. No 'any' types.
 */
function TrendChart() {
  return (
    <div className="col-span-2 bg-[var(--surface-container)] rounded-3xl p-6 border border-[rgba(204,195,213,0.1)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-sm font-bold">Engineering Velocity</h3><p className="text-[10px] opacity-40">AI Readiness & Quality Trends</p></div>
        <div className="flex gap-4"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[var(--primary)]" /><span className="text-[10px] opacity-60">Efficiency</span></div></div>
      </div>
      <div className="flex-1 flex gap-2 items-end relative pb-2 px-1">
        <GridLines />
        {CHART_DATA.map((d) => <BarPair key={d.day} d={d} />)}
      </div>
    </div>
  );
}

export default memo(TrendChart);
