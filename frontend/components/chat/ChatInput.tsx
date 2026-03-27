"use client";

import React, { useRef } from "react";

interface ChatInputProps { onSend: (content: string) => void; isStreaming: boolean; }

const SendIcon = () => <span className="material-symbols-outlined text-[14px]">send</span>;
const SendBtn = ({ disabled, onClick }: { disabled: boolean; onClick: () => void }) => (
  <button onClick={onClick} disabled={disabled} className="px-4 py-1.5 rounded-lg bg-[var(--primary)] text-white hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed">
    <span className="text-[10px] font-bold uppercase tracking-widest">send</span>
    <SendIcon />
  </button>
);

const InputArea = ({ inputRef, value, onChange, onKeyDown, isStreaming }: { inputRef: React.RefObject<HTMLTextAreaElement | null>; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; onKeyDown: (e: React.KeyboardEvent) => void; isStreaming: boolean }) => (
  <textarea id="chat-textarea" ref={inputRef} value={value} onChange={onChange} onKeyDown={onKeyDown} disabled={isStreaming} className="w-full bg-transparent border-none focus:ring-0 text-xs py-1 placeholder:text-[var(--outline)] resize-none" placeholder={isStreaming ? "Thinking..." : "Ask SwMaster..."} rows={1} />
);

/**
 * ChatInput - Brutally flattened to Depth 2. No 'any' types.
 */
export default function ChatInput({ onSend, isStreaming }: ChatInputProps) {
  const [value, setValue] = React.useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => { if (value.trim()) { onSend(value.trim()); setValue(""); } };
  const onKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" && e.shiftKey) { e.preventDefault(); handleSend(); } };

  return (
    <div className="p-4 border-t border-[rgba(204,195,213,0.1)] bg-[var(--surface-container-low)]">
      <div className="bg-[var(--surface-container-lowest)] border p-2 rounded-2xl flex flex-col gap-2 transition-all focus-within:ring-2 ring-[var(--primary)]/20">
        <InputArea inputRef={inputRef} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={onKeyDown} isStreaming={isStreaming} />
        <div className="flex justify-between items-center px-1"><div /><SendBtn disabled={isStreaming || !value.trim()} onClick={handleSend} /></div>
      </div>
    </div>
  );
}
