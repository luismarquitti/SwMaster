"use client";

/**
 * MessageBubble — Individual chat message display.
 *
 * Renders user messages (right-aligned) and assistant
 * messages (left-aligned) with different visual treatments.
 */

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
        {/* Render content with basic markdown-like formatting */}
        {content.split("\n").map((line, i) => (
          <p key={i} className={line === "" ? "h-2" : ""}>
            {line.startsWith("```") ? (
              <code className="block bg-black/5 p-2 rounded text-[11px] font-mono my-1">
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
      <span className="text-[9px] px-1" style={{ color: "var(--outline)" }}>
        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  );
}
