// ============================================================
//  api.ts  –  Backend integration service
//  Replace VITE_API_BASE_URL in your .env with your server URL
//  Replace VITE_ANTHROPIC_API_KEY in your .env with your key
//  (only needed if you use the "direct" Claude option below)
// ============================================================

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

// ── Types ────────────────────────────────────────────────────

export interface TextVerificationRequest {
  text?: string;
  url?: string;
}

export interface ImageVerificationRequest {
  imageBase64?: string; // data-url  e.g. "data:image/png;base64,..."
  imageUrl?: string;
  context?: string;
}

export interface VerificationResponse {
  result: 'authentic' | 'fake';
  confidence: number;           // 0 – 100
  aiProbability: number;        // 0 – 100
  humanProbability: number;     // 0 – 100
  analysisTime: string;         // e.g. "1.8s"
  detectionMethod: string;      // shown in the report card
  findings: string[];           // bullet points in "Detailed Findings"
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  reply: string;
}

// ── Text Verification ────────────────────────────────────────

export async function verifyText(
  req: TextVerificationRequest
): Promise<VerificationResponse> {
  const res = await fetch(`${API_BASE}/api/verify/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Text verification failed: ${err}`);
  }

  return res.json();
}

// ── Image Verification ───────────────────────────────────────

export async function verifyImage(
  req: ImageVerificationRequest
): Promise<VerificationResponse> {
  const res = await fetch(`${API_BASE}/api/verify/image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Image verification failed: ${err}`);
  }

  return res.json();
}

// ── Chatbot ──────────────────────────────────────────────────

export async function sendChatMessage(
  messages: ChatMessage[]
): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Chat failed: ${err}`);
  }

  return res.json();
}
