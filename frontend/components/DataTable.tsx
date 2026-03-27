"use client";

import { memo } from "react";

interface Row { id: string; agent: string; status: "success" | "warning" | "info"; duty: string; progress: string; }

const DATA: Row[] = [
  { id: "1", agent: "Architect", status: "success", duty: "System Design", progress: "100%" },
  { id: "2", agent: "Maker", status: "info", duty: "Software Construction", progress: "85%" },
  { id: "3", agent: "Reviewer", status: "warning", duty: "Quality Assurance", progress: "92%" },
  { id: "4", agent: "Conductor", status: "success", duty: "GitHub Ops", progress: "78%" },
];

const StatusDot = ({ status }: { status: Row["status"] }) => {
  const c = { success: "#4ade80", warning: "#fbbf24", info: "#60a5fa" };
  return <div className="w-1.5 h-1.5 rounded-full" style={{ background: c[status] }} />;
};

const DataRow = ({ row }: { row: Row }) => (
  <tr key={row.id} className="border-b last:border-0 border-[rgba(204,195,213,0.05)] hover:bg-[var(--surface-container-high)] transition-colors group">
    <td className="py-4 pl-6"><div className="flex items-center gap-3"><StatusDot status={row.status} /><span className="text-xs font-bold">{row.agent}</span></div></td>
    <td className="py-4 text-xs opacity-60 font-medium">{row.duty}</td>
    <td className="py-4"><div className="w-32 h-1.5 bg-[var(--surface-container-high)] rounded-full overflow-hidden"><div className="h-full bg-[var(--primary)] rounded-full" style={{ width: row.progress }} /></div></td>
    <td className="py-4 pr-6 text-right"><span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{row.progress}</span></td>
  </tr>
);

const TableRows = () => <>{DATA.map((r) => <DataRow key={r.id} row={r} />)}</>;
const TableHeader = () => (
  <thead className="bg-[#00000003] border-b border-[rgba(204,195,213,0.05)] text-[10px] font-bold uppercase tracking-widest opacity-30">
    <tr><th className="text-left py-3 pl-6 font-bold">Agent</th><th className="text-left py-3 font-bold">Duty</th><th className="text-left py-3 font-bold">Pipeline Status</th><th className="text-right py-3 pr-6 font-bold">Load</th></tr>
  </thead>
);

/**
 * DataTable - Ultra-flattened to Depth 2.
 */
function DataTable() {
  return (
    <div className="bg-[var(--surface-container)] rounded-3xl border border-[rgba(204,195,213,0.1)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[rgba(204,195,213,0.05)] flex items-center justify-between"><h3 className="text-sm font-bold">Active Engineering Threads</h3></div>
      <table className="w-full border-collapse">
        <TableHeader />
        <tbody><TableRows /></tbody>
      </table>
    </div>
  );
}

export default memo(DataTable);
