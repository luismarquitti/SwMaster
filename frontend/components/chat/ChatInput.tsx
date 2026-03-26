"use client";

/**
 * ChatInput — Composer input with send button.
 */

import { useState, useRef, useEffect, type KeyboardEvent } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isStreaming: boolean;
  onCancelEdit?: () => void;
  initialValue?: string;
}

export default function ChatInput({ 
  onSend, 
  isStreaming, 
  onCancelEdit,
  initialValue = "" 
}: ChatInputProps) {
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialValue) {
      setValue(initialValue);
      // Focus and adjust height
      setTimeout(adjustHeight, 0);
    }
  }, [initialValue]);

  function adjustHeight() {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, window.innerHeight / 3);
      textarea.style.height = `${newHeight}px`;
    }
  }

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    // Arrow Up to edit last message if input is empty
    if (e.key === "ArrowUp" && !value.trim() && onCancelEdit) {
      e.preventDefault();
      onCancelEdit();
      return;
    }

    // Swapped: Shift+Enter sends, Enter is next line
    if (e.key === "Enter") {
      if (e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      } else {
        // Default Enter behavior in textarea is new line
        // We just let it happen, but we need to adjust height
        setTimeout(adjustHeight, 0);
      }
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
        className="relative flex items-end gap-2 rounded-2xl px-3 py-2 transition-all border"
        style={{
          background: "var(--surface-container-highest)",
          borderColor: "rgba(204, 195, 213, 0.2)",
        }}
      >
        <button
          className="p-2 rounded-full transition-colors mb-0.5"
          style={{ color: "var(--primary)" }}
        >
          <span className="material-symbols-outlined text-[18px]">attach_file</span>
        </button>
        <textarea
          ref={textareaRef}
          className="flex-1 bg-transparent border-none text-[13px] py-1.5 px-2 focus:outline-none resize-none font-sans leading-relaxed"
          style={{ 
            color: "var(--on-surface)",
            minHeight: "36px",
            maxHeight: "33vh",
            fontFamily: value.includes('```') || value.includes('{') ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' : 'inherit'
          }}
          placeholder={
            isStreaming
              ? "SwMaster is thinking..."
              : "Ask SwMaster... (Shift+Enter to send)"
          }
          rows={1}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            adjustHeight();
          }}
          onKeyDown={handleKeyDown}
          disabled={isStreaming}
        />
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || isStreaming}
          className="p-2.5 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform disabled:opacity-40 mb-0.5"
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
