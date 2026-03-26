import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import TabBar from "@/components/TabBar";
import KPICards from "@/components/KPICards";
import DataTable from "@/components/DataTable";
import TrendChart from "@/components/TrendChart";
import StrategyCard from "@/components/StrategyCard";
import ChatPanel from "@/components/chat/ChatPanel";

export default function Home() {
  return (
    <>
      <Sidebar />
      <main className="flex w-full ml-20 h-screen overflow-hidden">
        {/* Left: Dashboard Content */}
        <section
          className="w-[65%] h-full flex flex-col overflow-hidden"
          style={{ background: "var(--surface-container-lowest)" }}
        >
          <Topbar />
          <TabBar />

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <KPICards />
            <DataTable />

            <div className="grid grid-cols-3 gap-6">
              <TrendChart />
              <StrategyCard />
            </div>
          </div>
        </section>

        {/* Right: Chat Panel */}
        <ChatPanel />
      </main>
    </>
  );
}
