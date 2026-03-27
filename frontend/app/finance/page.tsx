"use client";

import { useEffect, useState } from "react";
import KPICard from "@/components/KPICard";
import TransactionTable from "@/components/finance/TransactionTable";
import FileUpload from "@/components/finance/FileUpload";
import StagingArea from "@/components/finance/StagingArea";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function FinanceDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/finance/transactions`);
      const data = await res.json();
      setTransactions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch(`${API_BASE}/api/finance/analysis`);
      const data = await res.json();
      setAnalysis(data.analysis);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Finance Dashboard</h2>
        <a href="/finance/settings" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-all">
          <span className="material-symbols-outlined text-sm">settings</span>
          Settings
        </a>
      </div>
      
      <StagingArea onApproved={fetchTransactions} />
      
      {/* Header Cards */}
      <div className="flex gap-4">
        <KPICard k={{ id: "income", label: "Monthly Income", icon: "trending_up", value: "$4,250.00", color: "#4ade80" }} />
        <KPICard k={{ id: "expense", label: "Monthly Expenses", icon: "trending_down", value: "$2,105.40", color: "#f87171" }} />
        <KPICard k={{ id: "balance", label: "Total Balance", icon: "account_balance_wallet", value: "$12,450.00", color: "#60a5fa" }} />
        <KPICard k={{ id: "savings", label: "Savings Rate", icon: "savings", value: "48%", color: "#a78bfa" }} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <TransactionTable data={transactions} />
        </div>
        <div className="space-y-6">
          <FileUpload onUploadComplete={fetchTransactions} />
          <div className="bg-[var(--surface-container)] p-6 rounded-3xl border border-[rgba(204,195,213,0.1)]">
            <h3 className="text-sm font-bold mb-4">AI Insights</h3>
            <div className="space-y-4 text-xs opacity-60 leading-relaxed whitespace-pre-line">
              {analysis ? analysis : "Click the button below to generate insights based on your recent activity."}
              <button 
                onClick={getAIAnalysis}
                disabled={isAnalyzing}
                className="w-full py-2 mt-2 bg-[var(--primary)] text-white font-bold rounded-xl uppercase tracking-widest text-[10px] hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isAnalyzing ? "Analyzing..." : "Generate Full Analysis"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
