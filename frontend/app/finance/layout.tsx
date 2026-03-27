"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { ChatProvider, openAIAdapter } from "@openuidev/react-headless";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatProvider 
      apiUrl={`${API_BASE}/api/chat`} 
      threadApiUrl={`${API_BASE}/api/threads`}
      streamProtocol={openAIAdapter()}
    >
      <div className="flex w-full h-screen overflow-hidden">
        <Sidebar activeInit="finance" />
        <main className="flex-1 h-screen overflow-hidden flex flex-col" style={{ background: "var(--surface-container-lowest)" }}>
          <Topbar />
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </ChatProvider>
  );
}
