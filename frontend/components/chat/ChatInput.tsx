"use client";

/**
 * ChatInput — Composer input with send button.
 */

import { useState, useRef, type KeyboardEvent } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isStreaming: boolean;
}

export default function ChatInput({ onSend, isStreaming }: ChatInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setValue("");
    inputRef.current?.focus();
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div
      className="p-4 border-t"
      style={{
        background: "var(--surface-container-lowest)",
        borderColor: "rgba(204, 195, 213, 0.1)",
      }}
    >
      <div
        className="relative flex items-center rounded-full px-3 py-1 transition-all"
        style={{
          background: "var(--surface-container-highest)",
        }}
      >
        <button
          className="p-2 rounded-full transition-colors"
          style={{ color: "var(--primary)" }}
        >
          <span className="material-symbols-outlined text-[18px]">attach_file</span>
        </button>
        <input
          ref={inputRef}
          className="flex-1 bg-transparent border-none text-[13px] py-2 px-2 focus:outline-none"
          style={{ color: "var(--on-surface)" }}
          placeholder={
            isStreaming
              ? "SwMaster is thinking..."
              : "Ask SwMaster about architecture, code, or QA..."
          }
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isStreaming}
        />
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || isStreaming}
          className="p-2.5 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform disabled:opacity-40"
          style={{
            background: "var(--primary)",
            color: "var(--on-primary)",
          }}
        >
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            send
          </span>
        </button>
      </div>
    </div>
  );
}
