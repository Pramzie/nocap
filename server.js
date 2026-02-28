// ============================================================
//  server.js  –  Uses FREE Google Gemini API
//  Required .env variables:
//    GEMINI_API_KEY=your-key-from-aistudio.google.com
//    PORT=3001
// ============================================================

import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app  = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json({ limit: '20mb' }));

// ── Gemini helper ─────────────────────────────────────────────
async function callGemini(prompt, imageBase64 = null, imageMimeType = null) {
  const parts = [];

  if (imageBase64) {
    parts.push({ inline_data: { mime_type: imageMimeType, data: imageBase64 } });
  }

  parts.push({ text: prompt });

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts }] }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data.candidates[0].content.parts[0].text;
}

function parseJsonSafe(text) {
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

// ── POST /api/verify/text ─────────────────────────────────────
app.post('/api/verify/text', async (req, res) => {
  const { text, url } = req.body;

  if (!text && !url) {
    return res.status(400).json({ error: 'Provide text or url' });
  }

  const prompt = `You are a content authenticity expert. Analyze the following ${url ? 'URL' : 'text'} and determine if it is AI-generated or human-written.

${url ? `URL: ${url}` : `Text: ${text}`}

Return ONLY a JSON object with this exact shape, no other text:
{
  "result": "authentic",
  "confidence": 85,
  "aiProbability": 15,
  "humanProbability": 85,
  "analysisTime": "1.2s",
  "detectionMethod": "Linguistic pattern analysis",
  "findings": [
    "finding 1 about the text",
    "finding 2 about the text",
    "finding 3 about the text"
  ]
}

Rules:
- "result" must be "fake" if AI-generated, "authentic" if human-written
- "confidence" is how confident you are in your verdict (0-100)
- "aiProbability" + "humanProbability" must add up to 100
- "findings" must have exactly 3 specific observations that support your verdict
- Return ONLY the JSON, absolutely no other text`;

  try {
    const start   = Date.now();
    const rawText = await callGemini(prompt);
    const elapsed = ((Date.now() - start) / 1000).toFixed(1) + 's';
    const parsed  = parseJsonSafe(rawText);
    parsed.analysisTime = elapsed;
    res.json(parsed);
  } catch (err) {
    console.error('Text verify error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/verify/image ────────────────────────────────────
app.post('/api/verify/image', async (req, res) => {
  const { imageBase64, imageUrl, context } = req.body;

  if (!imageBase64 && !imageUrl) {
    return res.status(400).json({ error: 'Provide imageBase64 or imageUrl' });
  }

  const prompt = `You are an image authenticity expert. Analyze this image and determine if it is AI-generated/manipulated or a real photograph.
${context ? `Context: ${context}` : ''}

Return ONLY a JSON object with this exact shape, no other text:
{
  "result": "authentic",
  "confidence": 85,
  "aiProbability": 15,
  "humanProbability": 85,
  "analysisTime": "1.5s",
  "detectionMethod": "Visual artifact and metadata analysis",
  "findings": [
    "finding 1 about the image",
    "finding 2 about the image",
    "finding 3 about the image"
  ]
}

Rules:
- "result" must be "fake" if AI-generated or manipulated, "authentic" if a real photo
- "confidence" is how confident you are (0-100)
- "aiProbability" + "humanProbability" must add up to 100
- "findings" must have exactly 3 specific visual observations
- Return ONLY the JSON, absolutely no other text`;

  try {
    let base64Data = null;
    let mimeType   = 'image/jpeg';

    if (imageBase64) {
      const [meta, data] = imageBase64.split(',');
      mimeType   = meta.match(/:(.*?);/)?.[1] ?? 'image/jpeg';
      base64Data = data;
    }

    const start   = Date.now();
    const rawText = await callGemini(prompt, base64Data, mimeType);
    const elapsed = ((Date.now() - start) / 1000).toFixed(1) + 's';
    const parsed  = parseJsonSafe(rawText);
    parsed.analysisTime = elapsed;
    res.json(parsed);
  } catch (err) {
    console.error('Image verify error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/chat ────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Provide a messages array' });
  }

  const history = messages
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  const prompt = `You are noCap Assistant, a helpful AI embedded in the noCap content authenticity verifier app. You help users understand how to use the tool, explain what AI-generated content looks like, and answer questions about digital trust and misinformation. Keep responses concise (2-4 sentences). Be friendly and informative.

Conversation:
${history}
Assistant:`;

  try {
    const reply = await callGemini(prompt);
    res.json({ reply: reply.trim() });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`noCap backend running on http://localhost:${PORT}`);
});