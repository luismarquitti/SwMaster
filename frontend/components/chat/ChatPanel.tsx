"use client";

/**
 * ChatPanel — Right-side AI chat interface.
 *
 * Uses OpenUI's ChatProvider + openAIAdapter for SSE streaming,
 * wrapping a custom UI that matches the stitch design.
 */

import { ChatProvider, openAIAdapter, openAIMessageFormat } from "@openuidev/react-headless";
import { type ReactNode, useState, useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Inner chat content — reads thread state from OpenUI context.
 */
function ChatContent() {
  // We manage messages locally for the MVP; OpenUI's useThread could
  // be used once thread persistence is implemented.
  const [messages, setMessages] = useState<
    Array<{ id: string; role: "user" | "assistant"; content: string }>
  >([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend(text: string) {
    const userMsg = { id: crypto.randomUUID(), role: "user" as const, content: text };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setIsStreaming(true);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
          stream: true,
        }),
      });

      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process SSE lines
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;

          try {
            const chunk = JSON.parse(data);
            const delta = chunk?.choices?.[0]?.delta?.content;
            if (delta) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + delta } : m
                )
              );
            }
          } catch {
            // skip malformed chunks
          }
        }
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: `⚠️ Error connecting to SwMaster backend: ${err}` }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  }

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
        className="h-14 flex items-center px-6 justify-between"
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
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
              style={{
                background: "#4ade80",
                borderColor: "var(--primary)",
              }}
            />
          </div>
          <div>
            <h2 className="text-xs font-bold tracking-wide">SwMaster AI</h2>
            <span className="text-[9px] opacity-70 uppercase font-bold tracking-widest">
              {isStreaming ? "Generating Response..." : "Ready — SWEBOK v4"}
            </span>
          </div>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-full transition">
          <span className="material-symbols-outlined text-[18px]">more_vert</span>
        </button>
      </div>

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
        {messages.map((msg) => (
          <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
        ))}
        {isStreaming && messages[messages.length - 1]?.role === "assistant" && (
          <div className="flex items-center gap-2 px-2">
            <div className="ai-pulse w-4 h-4 rounded-full" />
            <span className="text-[10px] italic opacity-50">Thinking...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} isStreaming={isStreaming} />
    </section>
  );
}

export default function ChatPanel() {
  return <ChatContent />;
}
