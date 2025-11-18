require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const isProd = process.env.NODE_ENV === 'production';

if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set. Please create a .env file with GEMINI_API_KEY=...');
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1';
const PREFERRED_MODELS = [
  // Preferred order; we will intersect with what your key actually has
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.0-pro-latest',
  'gemini-1.0-pro',
  'gemini-pro'
];

let discoveredModelsCache = null; // cache of model ids supporting generateContent

async function listModels() {
  const url = `${GEMINI_API_BASE}/models?key=${encodeURIComponent(GEMINI_API_KEY)}`;
  const resp = await fetch(url);
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const msg = data?.error?.message || `HTTP ${resp.status}`;
    throw new Error(`ListModels failed: ${msg}`);
  }
  const models = Array.isArray(data?.models) ? data.models : [];
  // Only models supporting generateContent
  const ids = models
    .filter(m => Array.isArray(m?.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
    .map(m => m?.name?.replace(/^models\//, ''))
    .filter(Boolean);
  return ids;
}

async function ensureDiscoveredModels() {
  if (Array.isArray(discoveredModelsCache) && discoveredModelsCache.length > 0) return discoveredModelsCache;
  const ids = await listModels();
  discoveredModelsCache = ids;
  return discoveredModelsCache;
}

async function callGeminiHttp(model, message) {
  const url = `${GEMINI_API_BASE}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: String(message) }]
      }
    ]
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const err = new Error(`HTTP ${resp.status}: ${data?.error?.message || 'Unknown error'}`);
    err.status = resp.status;
    err.data = data;
    throw err;
  }

  const candidates = data?.candidates || [];
  for (const c of candidates) {
    const parts = c?.content?.parts || [];
    for (const p of parts) {
      if (typeof p?.text === 'string' && p.text.trim().length > 0) {
        return p.text;
      }
    }
  }
  return '';
}

async function generateReply(message) {
  const available = await ensureDiscoveredModels();
  const envModel = process.env.MODEL_ID && process.env.MODEL_ID.trim();

  // Build the try list: env override first (if present), then preferred intersection, then remaining available
  const preferredAvailable = PREFERRED_MODELS.filter(m => available.includes(m));
  const remaining = available.filter(m => !preferredAvailable.includes(m) && m !== envModel);
  const tryList = [
    ...(envModel ? [envModel] : []),
    ...preferredAvailable,
    ...remaining
  ];

  if (tryList.length === 0) {
    throw new Error('No available models with generateContent for this API key. Check model access in Google AI Studio.');
  }

  const errors = [];
  for (const modelName of tryList) {
    try {
      const text = await callGeminiHttp(modelName, message);
      if (text) return text;
      errors.push(`${modelName}: empty response`);
    } catch (err) {
      const code = String(err?.status || '');
      const msg = String(err?.message || '');
      errors.push(`${modelName}: ${code || ''} ${msg}`.trim());
      // On 404/unsupported, continue; otherwise break
      if (/404/.test(code) || /not found|unsupported/i.test(msg)) {
        continue;
      }
      break;
    }
  }
  const hint = `Tried models: ${tryList.join(', ')}. Errors: ${errors.join(' | ')}`;
  const e = new Error(`Failed to generate reply. ${hint}`);
  e.hint = hint;
  throw e;
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body || {};
    if (typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Invalid message' });
    }

    const text = await generateReply(message);
    if (!text) {
      return res.status(502).json({ error: 'Empty response from model' });
    }

    res.json({ reply: text });
  } catch (error) {
    console.error('Chat API error:', error?.data || error?.hint || error);
    const clientMessage = isProd
      ? 'Something went wrong'
      : (error?.message || 'Something went wrong');
    res.status(500).json({ error: clientMessage });
  }
});

app.get('/health', async (_req, res) => {
  try {
    const models = await ensureDiscoveredModels();
    res.json({ ok: true, models });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || 'list models failed' });
  }
});

app.listen(port, async () => {
  console.log(`Server listening at http://localhost:${port}`);
  try {
    const models = await ensureDiscoveredModels();
    console.log('Discovered models supporting generateContent:', models);
    if (process.env.MODEL_ID) {
      console.log('MODEL_ID override:', process.env.MODEL_ID);
    }
  } catch (e) {
    console.warn('Could not list models at startup:', e?.message || e);
  }
});