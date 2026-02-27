// ============================================================
//  server.js  –  Place this at the ROOT of your project
//  (same level as package.json)
//
//  Install deps:  npm install express cors @anthropic-ai/sdk dotenv
//  Run:           node server.js
//
//  Required .env variables:
//    ANTHROPIC_API_KEY=sk-ant-...
//    PORT=3001   (optional, defaults to 3001)
// ============================================================

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';

const app  = express();
const PORT = process.env.PORT ?? 3001;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(cors());
app.use(express.json({ limit: '20mb' })); // images can be large

// ── Helpers ──────────────────────────────────────────────────

function parseJsonSafe(text) {
  // Strip markdown fences if Claude wrapped the JSON
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

// ── POST /api/verify/text ─────────────────────────────────────
// Body: { text?: string, url?: string }
// Returns: VerificationResponse
app.post('/api/verify/text', async (req, res) => {
  const { text, url } = req.body;

  if (!text && !url) {
    return res.status(400).json({ error: 'Provide text or url' });
  }

  const userContent = text
    ? `Analyze the following text and determine if it is AI-generated or human-written:\n\n${text}`
    : `Analyze the content at this URL and determine if it is AI-generated or human-written:\n${url}`;

  const systemPrompt = `You are a content authenticity expert. Analyze the given text and return ONLY a JSON object with this exact shape:
{
  "result": "authentic" | "fake",
  "confidence": <number 0-100>,
  "aiProbability": <number 0-100>,
  "humanProbability": <number 0-100>,
  "analysisTime": "<elapsed seconds e.g. '1.2s'>",
  "detectionMethod": "<short description of method used>",
  "findings": ["<finding 1>", "<finding 2>", "<finding 3>"]
}
"result" is "fake" if AI-generated, "authentic" if human-written.
"confidence" is how confident you are in your verdict.
"findings" should be 3 specific observations about the text that support your verdict.
Return ONLY the JSON object, no other text.`;

  try {
    const start = Date.now();
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 512,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }],
    });

    const elapsed = ((Date.now() - start) / 1000).toFixed(1) + 's';
    const rawText = message.content[0].text;
    const parsed  = parseJsonSafe(rawText);
    parsed.analysisTime = parsed.analysisTime ?? elapsed;

    res.json(parsed);
  } catch (err) {
    console.error('Text verify error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/verify/image ────────────────────────────────────
// Body: { imageBase64?: string, imageUrl?: string, context?: string }
// Returns: VerificationResponse
app.post('/api/verify/image', async (req, res) => {
  const { imageBase64, imageUrl, context } = req.body;

  if (!imageBase64 && !imageUrl) {
    return res.status(400).json({ error: 'Provide imageBase64 or imageUrl' });
  }

  const systemPrompt = `You are an image authenticity expert. Analyze the given image and return ONLY a JSON object with this exact shape:
{
  "result": "authentic" | "fake",
  "confidence": <number 0-100>,
  "aiProbability": <number 0-100>,
  "humanProbability": <number 0-100>,
  "analysisTime": "1.5s",
  "detectionMethod": "<short description>",
  "findings": ["<finding 1>", "<finding 2>", "<finding 3>"]
}
"result" is "fake" if AI-generated/manipulated, "authentic" if a real photo.
"findings" should be 3 specific visual observations.
Return ONLY the JSON object, no other text.`;

  // Build the image content block
  let imageBlock;
  if (imageBase64) {
    // imageBase64 comes as a data-url: "data:image/png;base64,<data>"
    const [meta, data] = imageBase64.split(',');
    const mediaType    = meta.match(/:(.*?);/)?.[1] ?? 'image/jpeg';
    imageBlock = { type: 'image', source: { type: 'base64', media_type: mediaType, data } };
  } else {
    imageBlock = { type: 'image', source: { type: 'url', url: imageUrl } };
  }

  const userContent = [
    imageBlock,
    { type: 'text', text: context ? `Context: ${context}\n\nAnalyze this image.` : 'Analyze this image.' },
  ];

  try {
    const start = Date.now();
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 512,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }],
    });

    const elapsed = ((Date.now() - start) / 1000).toFixed(1) + 's';
    const rawText = message.content[0].text;
    const parsed  = parseJsonSafe(rawText);
    parsed.analysisTime = parsed.analysisTime ?? elapsed;

    res.json(parsed);
  } catch (err) {
    console.error('Image verify error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/chat ────────────────────────────────────────────
// Body: { messages: Array<{ role: 'user'|'assistant', content: string }> }
// Returns: { reply: string }
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Provide a messages array' });
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 512,
      system: `You are noCap Assistant, a helpful AI embedded in the noCap content authenticity verifier app.
You help users understand how to use the tool, explain what AI-generated content looks like, and answer questions about digital trust and misinformation.
Keep responses concise (2-4 sentences). Be friendly and informative.`,
      messages,
    });

    res.json({ reply: response.content[0].text });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`noCap backend running on http://localhost:${PORT}`);
});
