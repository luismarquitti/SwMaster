"use client";

import { StagedTransaction, Account } from "@/types/finance";
import { useState, useEffect } from "react";

export default function StagingArea({ onApproved }: { onApproved: () => void }) {
  const [staged, setStaged] = useState<StagedTransaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<number | "">("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/finance/staged`).then(r => r.json()).then(setStaged);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/finance/accounts`).then(r => r.json()).then(setAccounts);
  }, []);

  const approve = async (id: number) => {
    if (!selectedAccount) return alert("Select an account first");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/finance/staged/${id}/approve?account_id=${selectedAccount}`, {
      method: "POST"
    });
    if (res.ok) {
      setStaged(prev => prev.filter(s => s.id !== id));
      onApproved();
    }
  };

  if (staged.length === 0) return null;

  return (
    <div className="bg-[var(--surface-container-high)] p-6 rounded-3xl border border-[var(--primary)]/30 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-[var(--primary)]">info</span>
          New Items to Review ({staged.length})
        </h3>
        <select 
          className="text-[10px] bg-[var(--surface-container-lowest)] p-1 rounded-lg outline-none font-bold uppercase tracking-widest border border-[rgba(204,195,213,0.1)]"
          value={selectedAccount}
          onChange={e => setSelectedAccount(Number(e.target.value))}
        >
          <option value="">Dest. Account</option>
          {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {staged.map(item => (
          <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-[var(--surface-container-lowest)] border border-[rgba(204,195,213,0.05)] text-xs">
            <div className="flex-1">
              <p className="font-bold">{item.description}</p>
              <p className="opacity-40 text-[10px] uppercase tracking-widest">{item.date} • {item.source_file}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`font-bold ${item.type === "Expense" ? "text-red-400" : "text-green-400"}`}>
                ${Math.abs(item.amount).toFixed(2)}
              </span>
              <button 
                onClick={() => approve(item.id)}
                className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center hover:opacity-90 transition-all"
              >
                <span className="material-symbols-outlined text-sm">check</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
