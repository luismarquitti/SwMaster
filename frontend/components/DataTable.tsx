"use client";

/**
 * DataTable — Skills & Roles overview table.
 *
 * Shows the SwMaster agent's skills mapped to SOD roles
 * per the DUTIES.md specification.
 */

interface SkillRow {
  role: string;
  skill: string;
  description: string;
  status: "Active" | "Standby" | "Restricted";
}

const skillData: SkillRow[] = [
  {
    role: "Maker",
    skill: "architect_and_planner",
    description: "Specs, Mermaid diagrams, ADRs",
    status: "Active",
  },
  {
    role: "Maker",
    skill: "software_construction",
    description: "Clean, modular production code",
    status: "Active",
  },
  {
    role: "Checker",
    skill: "quality_assurance",
    description: "TDD, code review, security audit",
    status: "Active",
  },
  {
    role: "Executor",
    skill: "github_ops",
    description: "Branches, commits, Pull Requests",
    status: "Active",
  },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  Active: { bg: "bg-green-100", text: "text-green-700" },
  Standby: { bg: "bg-yellow-100", text: "text-yellow-700" },
  Restricted: { bg: "bg-red-100", text: "text-red-700" },
};

export default function DataTable() {
  return (
    <div
      className="rounded-2xl border overflow-hidden animate-slide-up"
      style={{
        background: "var(--surface-container-lowest)",
        borderColor: "rgba(204, 195, 213, 0.3)",
      }}
    >
      {/* Header */}
      <div
        className="p-4 border-b flex items-center justify-between"
        style={{ borderColor: "rgba(204, 195, 213, 0.2)" }}
      >
        <h3 className="text-sm font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-sm" style={{ color: "var(--primary)" }}>
            list_alt
          </span>
          <span>Segregation of Duties — Skills & Roles Map</span>
        </h3>
        <button
          className="text-xs font-medium px-2 py-1 rounded hover:opacity-70 transition"
          style={{ color: "var(--primary)" }}
        >
          View DUTIES.md
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr style={{ background: "var(--surface-container-low)" }}>
              <th
                className="px-4 py-3 font-bold border-b"
                style={{
                  color: "var(--on-surface-variant)",
                  borderColor: "rgba(204, 195, 213, 0.2)",
                }}
              >
                SOD Role
              </th>
              <th
                className="px-4 py-3 font-bold border-b"
                style={{
                  color: "var(--on-surface-variant)",
                  borderColor: "rgba(204, 195, 213, 0.2)",
                }}
              >
                Skill ID
              </th>
              <th
                className="px-4 py-3 font-bold border-b"
                style={{
                  color: "var(--on-surface-variant)",
                  borderColor: "rgba(204, 195, 213, 0.2)",
                }}
              >
                Description
              </th>
              <th
                className="px-4 py-3 font-bold border-b"
                style={{
                  color: "var(--on-surface-variant)",
                  borderColor: "rgba(204, 195, 213, 0.2)",
                }}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {skillData.map((row, i) => (
              <tr
                key={i}
                className="transition-colors hover:bg-[var(--surface-container)]"
                style={{ borderBottom: "1px solid rgba(204, 195, 213, 0.1)" }}
              >
                <td className="px-4 py-3 font-semibold">{row.role}</td>
                <td className="px-4 py-3 font-mono text-[11px]">{row.skill}</td>
                <td className="px-4 py-3" style={{ color: "var(--on-surface-variant)" }}>
                  {row.description}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColors[row.status].bg} ${statusColors[row.status].text}`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
