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
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex flex-col gap-1.5 max-w-[90%] animate-fade-in ${
        isUser ? "self-end items-end" : "self-start"
      }`}
    >
      <div
        className={`p-3.5 text-xs leading-relaxed border ${
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
        {/* Render content with basic markdown-like formatting and rich cards */}
        {content.split("\n\n").map((block, i) => {
          // Detect System Update: [UPDATE:success|info|warning:label:details]
          const updateMatch = block.match(/\[UPDATE:(success|info|warning):([^:]+):?([^\]]*)\]/);
          if (updateMatch) {
            return (
              <SystemUpdate
                key={i}
                type={updateMatch[1] as any}
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

          return (
            <div key={i} className="space-y-1.5">
              {block.split("\n").map((line, j) => (
                <p key={j} className={line === "" ? "h-2" : ""}>
                  {line.startsWith("```") ? (
                    <code className="block bg-black/5 p-2 rounded text-[11px] font-mono my-1 whitespace-pre-wrap">
                      {line.replace(/```\w*/, "")}
                    </code>
                  ) : line.startsWith("**") ? (
                    <strong>{line.replace(/\*\*/g, "")}</strong>
                  ) : (
                    line
                  )}
                </p>
              ))}
            </div>
          );
        })}
      </div>
      <span className="text-[9px] px-1" style={{ color: "var(--outline)" }}>
        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  );
}
