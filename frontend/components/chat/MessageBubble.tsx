"use client";

import SimulationCard from "./SimulationCard";
import SystemUpdate from "./SystemUpdate";
import React from "react";

/** Standardized role type for the SwMaster domain. */
export type Role = "user" | "agent";

/** Supported system update levels. */
type UpdateType = "success" | "info" | "warning";

/** Props for the MessageBubble component. */
interface MessageBubbleProps { role: Role; content: string; onEdit?: (content: string) => void; }

const Avatar = ({ isUser }: { isUser: boolean }) => (
  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isUser ? "bg-[var(--primary)]" : "bg-[var(--surface-container-high)]"}`}>
    <span className="material-symbols-outlined text-[10px] text-white">{isUser ? "person" : "verified_user"}</span>
  </div>
);

/** Parses basic markdown (bold/italic) into JSX. */
const TextFormatter = ({ text }: { text: string }) => {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
        if (p.startsWith("*") && p.endsWith("*")) return <em key={i}>{p.slice(1, -1)}</em>;
        return p;
      })}
    </>
  );
};

const RichBlock = ({ b, isUser }: { b: string; isUser: boolean }) => {
  if (isUser) return <p className="break-words"><TextFormatter text={b} /></p>;
  if (b.includes("[UPDATE:")) {
    const m = b.match(/\[UPDATE:(success|info|warning):([^:]+):?([^\]]*)\]/);
    if (!m) return null;
    return <SystemUpdate type={m[1] as UpdateType} label={m[2]} details={m[3]} />;
  }
  if (b.includes("```json") && b.includes('"type": "simulation"')) {
    const jsonStr = b.match(/```json\n([\s\S]*?)\n```/)?.[1];
    if (!jsonStr) return null;
    const d = JSON.parse(jsonStr);
    return <SimulationCard title={d.title} description={d.description} steps={d.steps} />;
  }
  if (b.includes("```")) return <pre className="bg-black/5 p-2 rounded font-mono text-[10px] overflow-x-auto">{b.replace(/```\w*\n?|```/g, "")}</pre>;
  return <p className="break-words"><TextFormatter text={b} /></p>;
};

/**
 * MessageBubble - Atomically flattened component.
 * Depth: 2 (Function -> div).
 */
export default function MessageBubble({ role, content, onEdit }: MessageBubbleProps) {
  const isUser = role === "user";
  const handleCopy = () => navigator.clipboard.writeText(content);
  return (
    <div className={`group flex items-start gap-2 max-w-[95%] animate-fade-in relative ${isUser ? "self-end flex-row-reverse" : "self-start"}`}>
      <Avatar isUser={isUser} />
      <div className={`p-3 text-xs leading-relaxed border shadow-sm ${isUser ? "rounded-2xl rounded-tr-none bg-[var(--primary-subtle)]" : "rounded-2xl rounded-tl-none bg-[var(--surface-container)]"}`}>
        {content.split("\n\n").map((b, i) => <RichBlock key={i} b={b} isUser={isUser} />)}
      </div>
      <div className={`absolute -top-1 ${isUser ? "-left-14" : "-right-14"} opacity-0 group-hover:opacity-100 flex gap-1`}>
        {!isUser && <button onClick={handleCopy} className="p-1 rounded bg-surface-container border hover:bg-surface-container-high transition"><span className="material-symbols-outlined text-[12px]">content_copy</span></button>}
        {isUser && onEdit && <button onClick={() => onEdit(content)} className="p-1 rounded bg-surface-container border hover:bg-surface-container-high transition"><span className="material-symbols-outlined text-[12px]">edit</span></button>}
      </div>
    </div>
  );
}
