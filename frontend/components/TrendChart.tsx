"use client";

/**
 * TrendChart — Workflow pipeline activity visualization.
 *
 * Shows the sdd-tdd-flow steps as a visual bar chart
 * representing the development pipeline stages.
 */

const pipelineSteps = [
  { label: "Analyze Issue", height: "40%", opacity: 0.3 },
  { label: "Write Tests", height: "65%", opacity: 0.5 },
  { label: "Write Code", height: "85%", opacity: 0.7 },
  { label: "Code Review", height: "70%", opacity: 0.6 },
  { label: "Create PR", height: "95%", opacity: 0.9 },
];

export default function TrendChart() {
  return (
    <div
      className="col-span-2 rounded-2xl p-6 border animate-slide-up"
      style={{
        background: "var(--surface-container)",
        borderColor: "rgba(204, 195, 213, 0.1)",
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-bold text-sm">SDD-TDD Workflow Pipeline</h4>
        <div className="flex gap-3">
          <span className="flex items-center text-[10px] gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: "var(--primary)" }} />
            <span>Execution</span>
          </span>
          <span className="flex items-center text-[10px] gap-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "var(--outline-variant)" }}
            />
            <span>Pending</span>
          </span>
        </div>
      </div>

      {/* Bar chart */}
      <div className="h-40 flex items-end gap-3 w-full">
        {pipelineSteps.map((step, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-100 relative group cursor-pointer"
            style={{
              height: step.height,
              background: `rgba(79, 28, 158, ${step.opacity})`,
            }}
          >
            <div
              className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-white text-[9px] px-1.5 py-0.5 rounded transition-opacity whitespace-nowrap"
              style={{ background: "var(--primary)" }}
            >
              Step {i + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-4 text-[10px] font-medium"
           style={{ color: "var(--on-surface-variant)" }}>
        {pipelineSteps.map((step) => (
          <span key={step.label} className="text-center flex-1">
            {step.label}
          </span>
        ))}
      </div>
    </div>
  );
}
