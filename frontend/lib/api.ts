/**
 * Backend API client for the SwMaster Command Center.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface SkillInfo {
  id: string;
  name: string;
  role: string;
  description: string;
}

export interface AgentInfo {
  name: string;
  version: string;
  description: string;
  skills: SkillInfo[];
  roles: string[];
}

/**
 * Fetch agent metadata from the backend.
 */
export async function fetchAgentInfo(): Promise<AgentInfo> {
  const res = await fetch(`${API_BASE}/api/agents`);
  if (!res.ok) throw new Error(`Failed to fetch agent info: ${res.statusText}`);
  return res.json();
}

/**
 * Health check.
 */
export async function healthCheck(): Promise<{ status: string; model: string }> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
  return res.json();
}

/**
 * Get the chat API URL for OpenUI's ChatProvider.
 */
export function getChatApiUrl(): string {
  return `${API_BASE}/api/chat`;
}
