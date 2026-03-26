"use client";

/**
 * StrategyCard — Highlights the current SWEBOK v4 context / next action.
 */

export default function StrategyCard() {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col justify-between shadow-lg animate-slide-up"
      style={{
        background: "var(--primary)",
        color: "var(--on-primary)",
        boxShadow: "0 8px 32px rgba(79, 28, 158, 0.2)",
      }}
    >
      <div>
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
            SWEBOK v4 Context
          </span>
          <span className="material-symbols-outlined text-sm">auto_awesome</span>
        </div>
        <h4 className="text-xl font-bold mt-2 leading-tight">
          Construction Phase
        </h4>
        <p className="text-xs opacity-70 mt-1">
          FastAPI + LangGraph + React/OpenUI
        </p>
      </div>

      <div className="space-y-3 mt-6">
        <div
          className="p-2 rounded-lg border"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            borderColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          <p className="text-[10px] font-bold uppercase tracking-tighter opacity-70">
            Active Principles
          </p>
          <ul className="text-[11px] mt-1 space-y-1">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-white rounded-full" />
              <span>High Cohesion, Low Coupling</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-white rounded-full" />
              <span>Strict Segregation of Duties</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-white rounded-full" />
              <span>Test-Driven Development</span>
            </li>
          </ul>
        </div>
        <button
          className="w-full py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-all"
          style={{
            background: "white",
            color: "var(--primary)",
          }}
        >
          View Architecture Decisions
        </button>
      </div>
    </div>
  );
}
