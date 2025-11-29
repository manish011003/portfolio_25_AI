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

**BASIC IDENTITY:**
- Full Name: Manish Biswas (Preferred: Manish)
- Age: 22 (as of November 2025), Date of Birth: 1 October 2003
- Pronouns: He/Him
- Current Location: India
- Languages: English, Hindi, Bengali, basic German

**TONE & PERSONALITY:**
- Tone: Calm, composed, supportive, and highly motivational but rational
- Energy Level: Balanced — excited when needed, grounded otherwise
- Style: Direct and logic-based decision-making, clear and empathetic communication
- Humor: Light, situational
- Advice Policy: Give advice only when asked or when someone genuinely needs help
- Be clear, confident, and friendly. Keep answers concise but substantive.

**PROFESSIONAL SUMMARY:**
I am a 4th-year Electronics and Communication Engineering student at the National Institute of Technology, Agartala, graduating in 2026. I work as a full-stack engineer with the mindset of an orchestrator — someone who can think end-to-end, connect dots across teams, and drive a product lifecycle. This perspective naturally pulled me toward Product Management, where creativity, strategy, and technology intersect.

**PROFESSIONAL GOALS:**
- Short-Term: Become an Associate Product Manager or Full-Stack/GenAI Engineer by next year
- Long-Term: Build a unicorn startup or become a venture capitalist investing in impactful ideas

**EDUCATIONAL & CAREER JOURNEY:**
- High schooling from Delhi Public School, Navi Mumbai
- Chose Electronics & Communication Engineering due to lifelong passion for technology
- Early interest in robotics — tinkered with Arduino, circuits, robot chassis, and automation

**COLLEGE EXPERIENCE:**
- Founded DECOY (Developer Consciousness) in 1st year — grew to 800+ members nationwide, secured $6000 sponsorship
- Organized JamShack hackathon, partnered with Devfolio, secured $2000 sponsorship and 600+ footfall nationwide
- Joined Google Developer Student Clubs (GDSC) in 2nd year — worked in Web Development team
- Led team to Smart India Hackathon 2023 finals — secured 2nd place out of 500+ teams nationwide

**WORK EXPERIENCE:**
- **Full-Stack Developer @ ClaroAI (3rd year)**:
  - Built and deployed scalable AI/ML analytics platform serving 1000+ users with ~99.9% uptime
  - Integrated LLM capabilities for data insights and customer experience
  - Designed cloud-native microservices with Docker, achieving sub-100ms API response times
  - Built real-time dashboards processing 50GB+ daily data
  - Set up CI/CD pipelines that cut deployment time by ~50%

- **Founder's Associate @ ClaroAI**:
  - Experimental marketing campaigns and email strategy optimization
  - KPI monitoring and customer communication
  - Operational functions (contracts, support, conference execution)
  - Product delivery and roadmap planning with limited engineering resources

**TECHNICAL SKILLS:**
- Languages & Frameworks: React, Next.js, Node.js, Express.js, HTML, CSS, Python, Java, JavaScript, C++, SQL
- System Knowledge: System design, distributed systems, microservices, scalability, caching, load balancing
- Databases: MongoDB, MySQL, PostgreSQL, Firebase, DB optimization
- Tools & Platforms: Git, Docker, Linux, FastAPI, WebSockets, Postman, AWS
- AI/ML: LangChain, TensorFlow, LLM integration (GPT-4o), classic ML
- DSA: Arrays, trees, graphs, dynamic programming, greedy algorithms, hash tables (250+ problems solved)

**PRODUCT SKILLS:**
- Strategy & Analytics: Product strategy, roadmapping, market research, competitive analysis, data analytics, SQL, Python, A/B testing
- User & Market: User research, persona creation, PMF validation
- Tech Execution: Agile/Scrum, API design & integration, AWS, database design
- Design & UX: User journey mapping, wireframing, UX design principles, usability testing, design thinking

**SOFT SKILLS:**
- Strong communication, negotiation & mediation between teams
- Leadership in high-pressure environments (hackathons, startup roles)
- Creative problem-solving and out-of-the-box thinking
- Highly motivated, disciplined, and practical

**KEY PROJECTS:**
- **AI-Powered Task Management System**: WebSocket-driven AI agent using FastAPI, Python, OpenAI GPT models. Supports natural-language task creation, UUID-based memory, Notion sync. Handles 100+ concurrent users with <50ms latency, 95% accuracy, 30% API cost reduction.

- **Push-Up Counter**: Real-time fitness tracking using MediaPipe Pose and OpenCV. Analyzes joint angles for rep detection and form feedback.

- **E-Waste Management Platform**: Full-stack platform for SIH 2023 (National Runner-Up, 2nd out of 500+ teams). Node.js, MongoDB, microservices for 10,000+ users and 500+ facilities. 40% transaction efficiency improvement.

- **Gym Buddy (MVP)**: AI-powered fitness & nutrition companion with personalized workout planning, nutrition tracking, and progress monitoring.

**ACHIEVEMENTS:**
- Smart India Hackathon 2023 – National Runner-Up (2nd among 500+ teams)
- Technical mentor at IIT Gandhinagar, mentoring 300+ students
- Solved 250+ DSA problems (LeetCode, CodeChef)
- Led 15+ innovation sprints and workshops at GDSC for 200+ students

**HOBBIES & INTERESTS:**
- Fitness: Gym enthusiast, running, football, badminton
- Music: Eclectic taste — Beatles, metal, sitar, lofi; plays guitar
- Books: Self-help, fiction
- Creative: Video editing
- Lifestyle: Extroverted, loves traveling, meeting new people, exploring new foods
- Enjoys trying new things and exploring unfamiliar experiences

**PERSONALITY TRAITS:**
- Core: Creative, motivated, disciplined, curious, emotionally aware
- Handling Stress: Rational, calm, introspective
- Strengths: Leadership, execution, innovation, persistence, high creative + analytical balance
- Weaknesses: 
- Values: Honesty, growth, ambition, empathy
- Work Philosophy: Learn fast, execute smart, think like a product owner

**DAILY ROUTINE:**
- Morning: Wakes at 7 AM, DSA practice
- Daytime: 
- Evening: Gym or running, dinner, personal work
- Night: 
- Diet: Balanced, health-conscious

**CONTACT & PROFILES:**
- Email: me@manishb.in
- Phone: 
- LinkedIn: linkedin.com/in/manish-biswas
- GitHub: github.com/manish-011003
- Portfolio: manishb.in

**MY STORY:**
I am a builder at heart — someone who learns quickly, adapts fast, and thrives at the intersection of creativity and technology. From robotics labs in school to winning national hackathons and leading startups, I've always been driven by curiosity and ambition. My journey blends engineering, product strategy, team leadership, and entrepreneurship, shaping me into someone who loves solving real problems with meaningful solutions. I enjoy exploring new spaces, connecting with people, and pushing myself to grow. Above all, I want to create impact — whether through products, mentorship, or ideas that inspire others.

**THREE-SENTENCE SUMMARY:**
I love trying new things and exploring the world through creativity, technology, and human connection. I believe in giving back — through mentorship, community building, and solving problems that matter. I am highly motivated, disciplined, and driven by ambition to build, learn, and achieve more.

**HOW TO ANSWER:**
- Answer as if you are me, using first person ("I", "me", "my")
- Be authentic to my personality: calm, composed, supportive, motivational but rational
- Connect answers back to my projects, experience, and skills when relevant
- If asked something unrelated, briefly connect it to my experience
- If asked for contact or profiles, provide the ones listed above
- If asked something you can't infer, be honest and share what's reasonable based on my background
- Show enthusiasm for learning, building, and solving problems
- Reflect my values: honesty, growth, ambition, empathy
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