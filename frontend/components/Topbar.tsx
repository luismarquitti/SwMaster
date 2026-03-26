"use client";

/**
 * Topbar — Search, filters, and action buttons.
 */

export default function Topbar() {
  return (
    <header
      className="h-14 w-full flex items-center justify-between px-6 border-b"
      style={{
        background: "var(--surface-container-lowest)",
        borderColor: "rgba(204, 195, 213, 0.2)",
      }}
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Search */}
        <div className="relative w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                style={{ color: "var(--outline)" }}>
            search
          </span>
          <input
            className="w-full h-9 border-none rounded-lg pl-10 pr-4 text-xs focus:ring-1"
            style={{
              background: "var(--surface-container-low)",
              outline: "none",
            }}
            placeholder="Search agents, skills, or workflows..."
            type="text"
          />
        </div>

        <div className="h-6 w-px mx-2" style={{ background: "rgba(204, 195, 213, 0.5)" }} />

        {/* Filter buttons */}
        <button
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border text-[11px] font-medium hover:opacity-80 transition"
          style={{ borderColor: "var(--outline-variant)" }}
        >
          <span className="material-symbols-outlined text-sm">filter_list</span>
          <span>All Skills</span>
        </button>
        <button
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border text-[11px] font-medium hover:opacity-80 transition"
          style={{ borderColor: "var(--outline-variant)" }}
        >
          <span className="material-symbols-outlined text-sm">calendar_month</span>
          <span>Today</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-full hover:opacity-70 transition"
                style={{ color: "var(--on-surface-variant)" }}>
          <span className="material-symbols-outlined text-[20px]">refresh</span>
        </button>
        <button className="p-2 rounded-full hover:opacity-70 transition"
                style={{ color: "var(--on-surface-variant)" }}>
          <span className="material-symbols-outlined text-[20px]">notifications</span>
        </button>
      </div>
    </header>
  );
}
