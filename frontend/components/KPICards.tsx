"use client";

/**
 * KPICards — Key metrics for the SwMaster agent.
 *
 * Shows active skills, SOD compliance, test coverage,
 * and active workflow nodes.
 */

interface KPICardProps {
  label: string;
  value: string;
  subValue?: string;
  status?: "positive" | "neutral" | "warning";
  statusText?: string;
  indicator?: "bar" | "dots" | "pulse";
  barPercent?: number;
}

function KPICard({
  label,
  value,
  subValue,
  status = "neutral",
  statusText,
  indicator = "bar",
  barPercent = 60,
}: KPICardProps) {
  const statusColors = {
    positive: { text: "text-green-600", bg: "bg-green-500" },
    neutral: { text: "text-[var(--on-surface-variant)]", bg: "bg-[var(--outline-variant)]" },
    warning: { text: "text-amber-600", bg: "bg-amber-500" },
  };

  return (
    <div
      className="p-4 rounded-xl border animate-fade-in"
      style={{
        background: "var(--surface-container-low)",
        borderColor: "rgba(204, 195, 213, 0.1)",
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <span
          className="text-[11px] font-bold uppercase tracking-wider"
          style={{ color: "var(--primary)" }}
        >
          {label}
        </span>
        {statusText && (
          <span className={`text-[10px] font-bold flex items-center ${statusColors[status].text}`}>
            {statusText}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold">
        {value}
        {subValue && (
          <span className="text-sm font-normal" style={{ color: "var(--on-surface-variant)" }}>
            {subValue}
          </span>
        )}
      </div>
      <div className="mt-2">
        {indicator === "bar" && (
          <div
            className="h-1 w-full rounded-full overflow-hidden"
            style={{ background: "rgba(204, 195, 213, 0.2)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${barPercent}%`,
                background: "var(--primary)",
              }}
            />
          </div>
        )}
        {indicator === "pulse" && (
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px]" style={{ color: "var(--on-surface-variant)" }}>
              Active
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function KPICards() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <KPICard
        label="Active Skills"
        value="4"
        subValue=" / 4"
        status="positive"
        statusText="All Loaded"
        indicator="bar"
        barPercent={100}
      />
      <KPICard
        label="SOD Compliance"
        value="100%"
        status="positive"
        statusText="Enforced"
        indicator="bar"
        barPercent={100}
      />
      <KPICard
        label="LLM Model"
        value="Gemini"
        subValue=" 2.5 Pro"
        status="neutral"
        statusText="Ready"
        indicator="pulse"
      />
      <KPICard
        label="Agent Status"
        value="Online"
        status="positive"
        statusText="Healthy"
        indicator="pulse"
      />
    </div>
  );
}
