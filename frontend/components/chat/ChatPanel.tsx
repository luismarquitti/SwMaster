"use client";

import { useThread } from "@openuidev/react-headless";
import ChatInput from "./ChatInput";
import ChatHeader from "./ChatHeader";
import MessagesList from "./MessagesList";
import { useEffect, useRef } from "react";

/**
 * ChatPanel - High-level orchestrator for the chat interface.
 * 
 * Hierarchy:
 * div (1) -> ChatHeader (2)
 * div (1) -> div (2) -> MessagesList (3)
 * div (1) -> ChatInput (2)
 * 
 * Maintains Depth 3 max for Gold-Standard AI Readiness.
 */
export default function ChatPanel() {
  const { messages, processMessage, isRunning } = useThread();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);
  
  const onSend = (content: string) => { 
    processMessage({ role: "user", content }).catch((e: Error) => console.error(e.message)); 
  };

  return (
    <div className="h-full flex flex-col">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6" ref={scrollRef}>
        <MessagesList messages={messages as any[]} isRunning={isRunning} />
      </div>
      <ChatInput onSend={onSend} isStreaming={isRunning} />
    </div>
  );
}
