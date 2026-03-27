"use client";

import { memo } from "react";
import { Transaction } from "@/types/finance";

interface Props {
  data: Transaction[];
}

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    confirmed: "bg-green-500/10 text-green-500",
    pending: "bg-yellow-500/10 text-yellow-500",
    staged: "bg-blue-500/10 text-blue-500",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${colors[status] || "bg-gray-500/10 text-gray-500"}`}>
      {status}
    </span>
  );
};

export default memo(function TransactionTable({ data }: Props) {
  return (
    <div className="bg-[var(--surface-container)] rounded-3xl border border-[rgba(204,195,213,0.1)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[rgba(204,195,213,0.05)] flex items-center justify-between">
        <h3 className="text-sm font-bold">Recent Transactions</h3>
      </div>
      <table className="w-full border-collapse">
        <thead className="bg-[#00000003] border-b border-[rgba(204,195,213,0.05)] text-[10px] font-bold uppercase tracking-widest opacity-30">
          <tr>
            <th className="text-left py-3 pl-6">Date</th>
            <th className="text-left py-3">Description</th>
            <th className="text-left py-3">Category</th>
            <th className="text-right py-3">Amount</th>
            <th className="text-center py-3 pr-6">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b last:border-0 border-[rgba(204,195,213,0.05)] hover:bg-[var(--surface-container-high)] transition-colors group text-xs">
              <td className="py-4 pl-6 opacity-60 font-medium">{new Date(row.date).toLocaleDateString()}</td>
              <td className="py-4 font-bold">{row.description}</td>
              <td className="py-4 opacity-60">{row.category_id || "Uncategorized"}</td>
              <td className={`py-4 text-right font-bold ${row.type === "Expense" ? "text-red-400" : "text-green-400"}`}>
                {row.type === "Expense" ? "-" : "+"}${Math.abs(row.amount).toFixed(2)}
              </td>
              <td className="py-4 pr-6 text-center">
                <StatusBadge status={row.status} />
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={5} className="py-10 text-center opacity-40 text-sm">No transactions found for this period.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
});
