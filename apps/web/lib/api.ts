import type { ChatResponse, DemoResetResponse, PipelineId } from './types';

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL ?? 'http://localhost:3001';

export async function postChat(input: {
  pipeline: PipelineId;
  message: string;
  sessionId?: string;
}): Promise<ChatResponse> {
  const response = await fetch(`${GATEWAY_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Chat failed (${response.status})`);
  }

  return (await response.json()) as ChatResponse;
}

export async function resetFixtures(): Promise<DemoResetResponse> {
  const response = await fetch(`${GATEWAY_URL}/demo/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Reset failed (${response.status})`);
  }

  return (await response.json()) as DemoResetResponse;
}
