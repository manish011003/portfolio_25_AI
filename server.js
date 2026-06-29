require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { generateReply, ensureDiscoveredModels, GEMINI_API_KEY } = require('./lib/gemini');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const isProd = process.env.NODE_ENV === 'production';

if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set. Please create a .env file with GEMINI_API_KEY=...');
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
