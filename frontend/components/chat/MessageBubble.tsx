"use client";

/**
 * MessageBubble — Individual chat message display.
 *
 * Renders user messages (right-aligned) and assistant
 * messages (left-aligned) with different visual treatments.
 */

import SimulationCard from "./SimulationCard";
import SystemUpdate from "./SystemUpdate";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  isLast?: boolean;
  onEdit?: (content: string) => void;
}

export default function MessageBubble({ role, content, isLast, onEdit }: MessageBubbleProps) {
  const isUser = role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div
      className={`group flex flex-col gap-1.5 max-w-[90%] animate-fade-in relative ${
        isUser ? "self-end items-end" : "self-start"
      }`}
    >
      {/* Action Buttons (Visible on hover) */}
      <div className={`absolute -top-1 ${isUser ? "-left-14" : "-right-14"} opacity-0 group-hover:opacity-100 transition-opacity flex gap-1`}>
        {!isUser && (
          <button 
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-surface-container-high border hover:bg-surface-container transition shadow-sm"
            title="Copy to clipboard"
          >
            <span className="material-symbols-outlined text-[14px]">content_copy</span>
          </button>
        )}
        {isUser && isLast && onEdit && (
          <button 
            onClick={() => onEdit(content)}
            className="p-1.5 rounded-lg bg-surface-container-high border hover:bg-surface-container transition shadow-sm"
            title="Edit message"
          >
            <span className="material-symbols-outlined text-[14px]">edit</span>
          </button>
        )}
      </div>

      <div
        className={`p-3.5 text-xs leading-relaxed border shadow-sm ${
          isUser ? "rounded-2xl rounded-tr-none" : "rounded-2xl rounded-tl-none"
        }`}
        style={
          isUser
            ? {
                background: "rgba(79, 28, 158, 0.05)",
                color: "var(--on-surface)",
                borderColor: "rgba(79, 28, 158, 0.2)",
              }
            : {
                background: "var(--surface-container)",
                color: "var(--on-surface)",
                borderColor: "rgba(204, 195, 213, 0.1)",
              }
        }
      >
        {/* Render content with robust formatting for both roles */}
        {content.split("\n\n").map((block, i) => {
          // Assistant-only rich components (only if not User)
          if (!isUser) {
            // Detect System Update: [UPDATE:success|info|warning:label:details]
            const updateMatch = block.match(/\[UPDATE:(success|info|warning):([^:]+):?([^\]]*)\]/);
            if (updateMatch) {
              return (
                <SystemUpdate
                  key={i}
                  type={updateMatch[1] as "success" | "info" | "warning"}
                  label={updateMatch[2]}
                  details={updateMatch[3]}
                />
              );
            }

            // Detect Simulation Card (JSON block)
            if (block.includes("```json") && block.includes('"type": "simulation"')) {
              try {
                const jsonStr = block.match(/```json\n([\s\S]*?)\n```/)?.[1];
                if (jsonStr) {
                  const data = JSON.parse(jsonStr);
                  return (
                    <SimulationCard
                      key={i}
                      title={data.title}
                      description={data.description}
                      steps={data.steps}
                    />
                  );
                }
              } catch (e) {
                console.error("Failed to parse simulation card JSON:", e);
              }
            }
          }

          // Shared Markdown-like rendering
          return (
            <div key={i} className="space-y-1.5">
              {block.split("\n").map((line, j) => {
                // Code blocks (triple backticks)
                if (line.trim().startsWith("```")) {
                  const lang = line.replace("```", "").trim();
                  return null; // Start of block, handied by combined logic below if needed
                }
                
                // Very basic inline formatting
                let processedLine: string | React.ReactNode = line;
                
                // Bold
                if (line.includes("**")) {
                  const parts = line.split("**");
                  processedLine = parts.map((part, idx) => 
                    idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part
                  );
                }

                return (
                  <p key={j} className={`${line === "" ? "h-2" : ""} break-words`}>
                    {line.startsWith("    ") || line.startsWith("\t") ? (
                      <code className="bg-black/5 px-1 rounded font-mono text-[11px]">{line}</code>
                    ) : (
                      processedLine
                    )}
                  </p>
                );
              })}
              
              {/* Handle code blocks more robustly if needed, 
                  but for now let's ensure text-wrap and monospace */}
              {block.includes("```") && (
                <div className="bg-black/5 p-3 rounded-lg font-mono text-[11px] my-2 overflow-x-auto whitespace-pre border border-black/5">
                  {block.replace(/```\w*\n?|```/g, "")}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <span className="text-[9px] px-1 opacity-40 self-end" style={{ color: "var(--outline)" }}>
        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  );
}
