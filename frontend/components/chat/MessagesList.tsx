"use client";

import MessageBubble from "./MessageBubble";

interface Message { id?: string; role: "user" | "assistant"; content: string; }

/**
 * MessagesList - Atomic rendering of message history.
 * Isolates mapping logic to stay below the Depth 3 nesting threshold.
 */
export default function MessagesList({ messages, isRunning }: { messages: Message[]; isRunning: boolean }) {
  return (
    <>
      {messages.map((m, i) => (
        <MessageBubble key={m.id || i} role={m.role === "assistant" ? "agent" : "user"} content={m.content} />
      ))}
      {isRunning && (
        <div className="self-start px-4 py-2 bg-[var(--surface-container)] rounded-2xl text-[10px] opacity-50 italic animate-pulse">
          Agent is working...
        </div>
      )}
    </>
  );
}
