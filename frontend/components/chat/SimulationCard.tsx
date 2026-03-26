"use client";

/**
 * SimulationCard — Rich UI component for structured scenarios.
 */

interface SimulationCardProps {
  title: string;
  description: string;
  steps: Array<{ label: string; status: "done" | "active" | "todo" }>;
}

export default function SimulationCard({ title, description, steps }: SimulationCardProps) {
  return (
    <div 
      className="my-3 p-4 rounded-2xl border bg-[var(--surface-container-low)] shadow-sm animate-fade-in"
      style={{ borderColor: "rgba(79, 28, 158, 0.1)" }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white">
          <span className="material-symbols-outlined text-sm">settings_input_component</span>
        </div>
        <div>
          <h4 className="text-xs font-bold font-mono uppercase tracking-widest text-[var(--primary)]">{title}</h4>
          <p className="text-[10px] opacity-60">SwMaster Agent Scenario</p>
        </div>
      </div>
      
      <p className="text-xs mb-4 leading-relaxed">{description}</p>
      
      <div className="space-y-2.5">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
              step.status === 'done' ? 'bg-[#4ade80] border-[#4ade80]' : 
              step.status === 'active' ? 'border-[var(--primary)] animate-pulse' : 
              'border-outline opacity-30'
            }`}>
              {step.status === 'done' && (
                <span className="material-symbols-outlined text-[8px] text-white">check</span>
              )}
            </div>
            <span className={`text-[11px] ${step.status === 'active' ? 'font-bold' : 'opacity-70'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
