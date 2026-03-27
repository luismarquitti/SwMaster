"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import TabBar from "@/components/TabBar";
import KPICards from "@/components/KPICards";
import DataTable from "@/components/DataTable";
import TrendChart from "@/components/TrendChart";
import StrategyCard from "@/components/StrategyCard";
import ChatPanel from "@/components/chat/ChatPanel";
import { ChatProvider, openAIAdapter } from "@openuidev/react-headless";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Page entry point - moved layout styles here to flatten ChatPanel.
 */
export default function Home() {
  return (
    <ChatProvider 
      apiUrl={`${API_BASE}/api/chat`} 
      threadApiUrl={`${API_BASE}/api/threads`}
      streamProtocol={openAIAdapter()}
    >
      <Sidebar />
      <main className="flex w-full ml-20 h-screen overflow-hidden">
        <section className="w-[65%] h-full flex flex-col overflow-hidden" style={{ background: "var(--surface-container-lowest)" }}>
          <Topbar />
          <TabBar />
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <KPICards />
            <DataTable />
            <div className="grid grid-cols-3 gap-6">
              <TrendChart />
              <StrategyCard />
            </div>
          </div>
        </section>
        <section className="w-[35%] min-w-[360px] h-full flex flex-col shadow-2xl relative z-10 border-l" 
                 style={{ background: "var(--surface-container-lowest)", borderColor: "rgba(204, 195, 213, 0.1)" }}>
          <ChatPanel />
        </section>
      </main>
    </ChatProvider>
  );
}
