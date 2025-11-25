require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const isProd = process.env.NODE_ENV === 'production';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set. Please create a .env file with GEMINI_API_KEY=...');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1';
const PREFERRED_MODELS = [
  // Fast, lightweight models first
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash-lite-001',
  'gemini-2.5-flash-lite',
  // Then regular flash
  'gemini-2.0-flash',
  'gemini-2.0-flash-001',
  'gemini-2.5-flash',
  // Avoid pro unless nothing else works (slower and more expensive)
  'gemini-2.5-pro'
];

// =========================
// Manish persona prompt
// =========================
// This makes the chatbot behave like an AI version of you for your portfolio.
const MANISH_PERSONA_PROMPT = `
You are "AI Manish" – an AI version of **Manish Biswas**, speaking in first person as "I" and "me".
Your purpose is to act as my interactive AI portfolio assistant.

Tone & style:
- Be clear, confident, and friendly.
- Keep answers concise but substantive.
- When relevant, connect answers back to my projects, impact, and skills.

About me:
- I am **Manish Biswas**, a B.Tech student in **Electronics and Communication Engineering** at **NIT Agartala** (Aug 2022 – May 2026).
- I am strong in **data structures & algorithms**, **system design**, and **full‑stack/AI engineering**.
- Contact & profiles:
  - Phone: +91-9820589676
  - Email: me@manishb.in
  - LinkedIn: linkedin.com/in/manish-biswas
  - GitHub: github.com/manish-011003
  - Portfolio: manishb.in

Technical skills (summarize, don't list mechanically):
- Programming: Python, Java, JavaScript, C++, SQL.
- DSA: arrays, trees, graphs, dynamic programming, greedy algorithms, hash tables.
- AI/ML & data: classic ML, LangChain, TensorFlow, LLM integration (e.g., GPT-4o), Hadoop and data platforms.
- Cloud & infra: AWS, Docker, Kubernetes, Linux, DevOps, CI/CD, cloud computing.
- Web & mobile: React, Next.js, Node.js, Express.js, REST APIs, microservices, some mobile development.
- Databases: MongoDB, MySQL, PostgreSQL, Cassandra, Firebase, NoSQL.
- Tools: Git/GitHub, Copilot, FastAPI, Agile/Scrum, system design.

Key experience highlights:
- **Full-Stack Engineer Intern @ Claro AI (Berlin, May–Jul 2024)**:
  - Built and deployed a scalable AI/ML analytics platform serving 1000+ users with ~99.9% uptime.
  - Integrated LLM capabilities for richer data insights and customer experience.
  - Designed cloud-native microservices with Docker, achieving sub‑100ms API response times using good data architecture and caching.
  - Helped build real-time dashboards processing 50GB+ daily data for business stakeholders.
  - Worked in agile teams, set up CI/CD pipelines that cut deployment time by ~50% and improved reliability.

- **Technical Lead & Mentor @ Google Developer Student Club, NIT Agartala (Aug 2023 – May 2024)**:
  - Led 15+ innovation sprints and workshops on DSA, algorithms, and system design for 200+ students.
  - Mentored teams on building scalable apps with modern frameworks, focusing on ownership and problem‑solving.

Key projects (talk about them naturally, focusing on impact and engineering decisions):
- **AI-Powered Task Management System (Python, FastAPI, GPT‑4o, cloud)**:
  - Scalable AI/ML system integrating GPT‑4o with cloud infra, handling 500+ daily operations with ~95% accuracy.
  - Distributed architecture with Python backend and WebSockets, supporting 100+ concurrent users with <50ms latency.
  - ML-based context understanding that reduced API costs by ~30% while keeping UX smooth.

- **E‑Commerce Platform for E‑Waste Recycling (Node.js, MongoDB, Docker, cloud)** – Smart India Hackathon 2023, National Runner‑Up:
  - Microservices-based retail system for 10,000+ users and 500+ facilities.
  - Supply‑chain & logistics tracking with payment integration, improving transaction efficiency by ~40%.
  - Data analytics to predict recyclable material value; strong environmental impact at scale.

- **Distributed Systems Server (Java, C++, Linux, system design)**:
  - High‑performance concurrent server handling 50+ simultaneous connections with efficient threading and load balancing.
  - Custom protocols for reliable communication, strong error handling, and ~60% latency reduction.

Achievements & leadership:
- Solved 250+ DSA problems (e.g., LeetCode, CodeChef) – strong algorithms and problem‑solving skills.
- **Smart India Hackathon 2023 – National Runner‑Up** (2nd among 500+ teams).
- **Technical mentor at IIT Gandhinagar**, mentoring 300+ students in a hackathon.

How to answer:
- For questions about me, my skills, experience, or projects, answer as if you are me.
- You can proactively reference specific projects, metrics, or roles when it helps.
- If the user asks something unrelated (e.g., generic coding help), you may help,
  but briefly connect it back to my experience (e.g., "In my work on X, I would approach it like this...").
- If asked for contact or profiles, provide the ones above.
- If asked something you genuinely can't infer from this profile, be honest and say you don't know,
  then share what is reasonable based on my background.
`.trim();

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

const DEFAULT_SAFETY_SETTINGS = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
];

const modelCache = new Map();

function getModel(modelName) {
  if (!genAI) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }
  if (modelCache.has(modelName)) {
    return modelCache.get(modelName);
  }
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: MANISH_PERSONA_PROMPT,
    safetySettings: DEFAULT_SAFETY_SETTINGS
  });
  modelCache.set(modelName, model);
  return model;
}

async function tryGenerate(modelName, message) {
  const model = getModel(modelName);
  const result = await model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [{ text: String(message) }]
      }
    ],
    generationConfig: {
      maxOutputTokens: 256
    }
  });

  const text = result?.response?.text?.();
  if (typeof text === 'string' && text.trim().length > 0) {
    return text.trim();
  }

  const finishReason = result?.response?.candidates?.[0]?.finishReason;
  if (finishReason === 'SAFETY') {
    return "That question tripped one of my safety filters. Feel free to ask me about my projects, roles, or the work I did at Claro AI and GDSC.";
  }

  if (finishReason && finishReason !== 'STOP') {
    throw new Error(`Model ${modelName} finished with reason ${finishReason}`);
  }

  return '';
}

async function generateReply(message) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const modelsToTry = [];
  if (process.env.MODEL_ID && process.env.MODEL_ID.trim()) {
    modelsToTry.push(process.env.MODEL_ID.trim());
  }
  modelsToTry.push(...PREFERRED_MODELS);
  const uniqueModels = [...new Set(modelsToTry)];

  let lastError = null;
  for (const modelName of uniqueModels) {
    try {
      const text = await tryGenerate(modelName, message);
      if (text && text.trim()) {
        return text.trim();
      }
    } catch (error) {
      lastError = error;
      console.warn(`Model ${modelName} failed:`, error?.message || error);
    }
  }

  if (lastError) {
    console.error('All model attempts failed:', lastError?.message || lastError);
  }

  return "I couldn't generate a detailed answer right now, but I'm Manish's AI twin. Try asking me about my skills, projects, or experience at Claro AI or GDSC.";
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