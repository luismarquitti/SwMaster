"use client";

/**
 * ChatHeader - Pure presentational component.
 * Depth: 2 (Function -> div).
 */
export default function ChatHeader() {
  return (
    <div className="px-6 py-4 border-b border-[rgba(204,195,213,0.1)]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-[var(--primary)] flex items-center justify-center shadow-lg">
          <span className="material-symbols-outlined text-white text-[18px]">verified_user</span>
        </div>
        <div>
          <h2 className="text-sm font-bold tracking-tight">SwMaster Agent</h2>
          <p className="text-[10px] opacity-40 uppercase tracking-widest font-bold">Ready — SWEBOK v4</p>
        </div>
      </div>
    </div>
  );
}
