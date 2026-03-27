"use client";

/**
 * ChatPanel — Right-side AI chat interface.
 *
 * Fully integrated with OpenUI's ChatProvider for thread persistence
 * and SSE streaming via the backend.
 */

import {
  ChatProvider,
  useThread,
  useThreadList,
  openAIAdapter,
} from "@openuidev/react-headless";
import { useState, useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";

interface Thread {
  id: string;
  title: string;
  createdAt: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Inner chat content — uses OpenUI hooks for state management.
 */
function ChatContent() {
  const { messages, isRunning, processMessage } = useThread();
  const { threads, selectThread, switchToNewThread, isLoadingThreads, selectedThreadId } = useThreadList();
  const [showThreadList, setShowThreadList] = useState(false);
  const [editingValue, setEditingValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    setEditingValue(""); // Clear any pending edit value
    await processMessage({ 
      role: "user",
      content: text 
    });
  };

  const handleCancelLastMessage = async () => {
    if (!selectedThreadId || isRunning) return;
    
    try {
      const resp = await fetch(`${API_BASE}/api/threads/${selectedThreadId}/messages/last`, {
        method: 'DELETE'
      });
      if (resp.ok) {
        const data = await resp.json();
        setEditingValue(data.cancelled_text || "");
        // Force refresh the thread messages
        selectThread(selectedThreadId);
      }
    } catch (err) {
      console.error("Critical: Failed to cancel message:", err);
      // Optional: Add UI notification here
    }
  };

  return (
    <section
      className="w-[35%] min-w-[360px] h-full flex flex-col shadow-2xl relative z-10 border-l"
      style={{
        background: "var(--surface-container-lowest)",
        borderColor: "rgba(204, 195, 213, 0.1)",
      }}
    >
      {/* Header */}
      <div
        className="h-14 flex items-center px-6 justify-between shrink-0"
        style={{ background: "var(--primary)", color: "var(--on-primary)" }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                borderColor: "rgba(255, 255, 255, 0.3)",
              }}
            >
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
            </div>
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 ${
                isRunning ? "bg-amber-400" : "bg-[#4ade80]"
              }`}
              style={{ borderColor: "var(--primary)" }}
            />
          </div>
          <div>
            <h2 className="text-xs font-bold tracking-wide">SwMaster AI</h2>
            <span className="text-[9px] opacity-70 uppercase font-bold tracking-widest">
              {isRunning ? "Generating Response..." : "Ready — SWEBOK v4"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => switchToNewThread()}
            title="New Chat"
            className="p-2 hover:bg-white/10 rounded-full transition"
          >
            <span className="material-symbols-outlined text-[18px]">add_comment</span>
          </button>
          <button 
            onClick={() => setShowThreadList(!showThreadList)}
            className="p-2 hover:bg-white/10 rounded-full transition"
            title="History"
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
          </button>
        </div>
      </div>

      {/* Thread List Flyout */}
      {showThreadList && (
        <div className="absolute top-14 left-0 w-full h-full z-20 flex flex-col p-4 animate-fade-in"
             style={{ background: "var(--surface-container-lowest)" }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm">Recent Conversations</h3>
            <button onClick={() => setShowThreadList(false)} className="text-xs opacity-50 hover:opacity-100">
              Close
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2">
            {isLoadingThreads ? (
              <p className="text-xs opacity-50 p-4">Loading threads...</p>
            ) : threads.length === 0 ? (
              <p className="text-xs opacity-50 p-4">No history yet.</p>
            ) : (
              threads.map((t: Thread) => (
                <button
                  key={t.id}
                  onClick={() => {
                    selectThread(t.id);
                    setShowThreadList(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                    selectedThreadId === t.id 
                      ? "border-[var(--primary)] bg-[var(--surface-container-low)] font-bold" 
                      : "border-transparent hover:bg-[var(--surface-container)]"
                  }`}
                >
                  <div className="truncate mb-1">{t.title}</div>
                  <div className="text-[10px] opacity-40">
                    {new Date(t.createdAt).toLocaleDateString()} {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 flex flex-col">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 gap-3">
            <span
              className="material-symbols-outlined text-4xl"
              style={{ color: "var(--primary)", fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            <p className="text-sm font-medium">SwMaster is ready</p>
            <p className="text-xs" style={{ color: "var(--on-surface-variant)" }}>
              Ask about architecture, write code, run QA, or manage GitHub workflows.
            </p>
          </div>
        )}
        {messages.map((msg) => {
          // OpenUI message content can be a string, array, or object.
          // We extract the string for MessageBubble.
          let textContent = "";
          if (typeof msg.content === "string") {
            textContent = msg.content;
          } else if (Array.isArray(msg.content)) {
            textContent = msg.content
              .map((c) => (typeof c === "string" ? c : "text" in c ? c.text : ""))
              .join("");
          }

          const isLastUser = msg.role === "user" && messages.filter(m => m.role === "user").pop()?.id === msg.id;

          return (
            <MessageBubble
              key={msg.id}
              role={msg.role as "user" | "assistant"}
              content={textContent}
              isLast={isLastUser}
              onEdit={handleCancelLastMessage}
            />
          );
        })}
        {isRunning && (
          <div className="flex items-center gap-2 px-2">
            <div className="ai-pulse w-4 h-4 rounded-full" />
            <span className="text-[10px] italic opacity-50">Thinking...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput 
        onSend={handleSend} 
        isStreaming={isRunning} 
        onCancelEdit={handleCancelLastMessage}
        initialValue={editingValue}
      />
    </section>
  );
}

export default function ChatPanel() {
  return (
    <ChatProvider
      apiUrl={`${API_BASE}/api/chat`}
      threadApiUrl={`${API_BASE}/api/threads`}
      streamProtocol={openAIAdapter()}
    >
      <ChatContent />
    </ChatProvider>
  );
}
