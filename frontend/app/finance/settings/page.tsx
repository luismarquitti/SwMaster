"use client";

import { useState, useEffect } from "react";
import { Category, Account } from "@/types/finance";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function FinanceSettings() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [newCat, setNewCat] = useState({ name: "", type: "Expense" });
  const [newAccount, setNewAccount] = useState({ name: "", institution: "", type: "Checking", initial_balance: 0 });

  useEffect(() => {
    fetch(`${API_BASE}/api/finance/categories`).then(r => r.json()).then(setCategories);
    fetch(`${API_BASE}/api/finance/accounts`).then(r => r.json()).then(setAccounts);
  }, []);

  const addCategory = async () => {
    const res = await fetch(`${API_BASE}/api/finance/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCat)
    });
    if (res.ok) {
      const cat = await res.json();
      setCategories([...categories, cat]);
      setNewCat({ name: "", type: "Expense" });
    }
  };

  const addAccount = async () => {
    const res = await fetch(`${API_BASE}/api/finance/accounts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAccount)
    });
    if (res.ok) {
      const acc = await res.json();
      setAccounts([...accounts, acc]);
      setNewAccount({ name: "", institution: "", type: "Checking", initial_balance: 0 });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Finance Settings</h2>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Categories Section */}
        <div className="bg-[var(--surface-container)] p-6 rounded-3xl border border-[rgba(204,195,213,0.1)] space-y-6">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">category</span>
            Categories
          </h3>
          <div className="flex gap-2">
            <input 
              className="flex-1 bg-[var(--surface-container-lowest)] p-2 rounded-xl text-xs outline-none border border-[rgba(204,195,213,0.1)]"
              placeholder="Category Name"
              value={newCat.name}
              onChange={e => setNewCat({...newCat, name: e.target.value})}
            />
            <select 
              className="bg-[var(--surface-container-lowest)] p-2 rounded-xl text-xs border border-[rgba(204,195,213,0.1)]"
              value={newCat.type}
              onChange={e => setNewCat({...newCat, type: e.target.value})}
            >
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
            </select>
            <button 
              onClick={addCategory}
              className="px-4 py-2 bg-[var(--primary)] text-white text-[10px] font-bold rounded-xl uppercase tracking-widest"
            >
              Add
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map(c => (
              <div key={c.id} className="p-3 bg-[var(--surface-container-lowest)] rounded-2xl flex justify-between items-center text-xs">
                <span className="font-bold">{c.name}</span>
                <span className={`text-[9px] uppercase tracking-widest font-bold ${c.type === "Expense" ? "text-red-400" : "text-green-400"}`}>{c.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Accounts Section */}
        <div className="bg-[var(--surface-container)] p-6 rounded-3xl border border-[rgba(204,195,213,0.1)] space-y-6">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">account_balance</span>
            Accounts
          </h3>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input 
                className="bg-[var(--surface-container-lowest)] p-2 rounded-xl text-xs outline-none border border-[rgba(204,195,213,0.1)]"
                placeholder="Account Name"
                value={newAccount.name}
                onChange={e => setNewAccount({...newAccount, name: e.target.value})}
              />
              <input 
                className="bg-[var(--surface-container-lowest)] p-2 rounded-xl text-xs outline-none border border-[rgba(204,195,213,0.1)]"
                placeholder="Institution"
                value={newAccount.institution}
                onChange={e => setNewAccount({...newAccount, institution: e.target.value})}
              />
            </div>
            <div className="flex gap-2">
              <input 
                type="number"
                className="flex-1 bg-[var(--surface-container-lowest)] p-2 rounded-xl text-xs border border-[rgba(204,195,213,0.1)]"
                placeholder="Initial Balance"
                value={newAccount.initial_balance}
                onChange={e => setNewAccount({...newAccount, initial_balance: Number(e.target.value)})}
              />
              <button 
                onClick={addAccount}
                className="px-6 py-2 bg-[var(--primary)] text-white text-[10px] font-bold rounded-xl uppercase tracking-widest"
              >
                Add Account
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {accounts.map(a => (
              <div key={a.id} className="p-3 bg-[var(--surface-container-lowest)] rounded-2xl flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold">{a.name}</p>
                  <p className="text-[9px] opacity-40 uppercase tracking-widest">{a.institution} • {a.type}</p>
                </div>
                <span className="font-bold">${a.current_balance.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
