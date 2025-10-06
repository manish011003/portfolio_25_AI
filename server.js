require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set. Please create a .env file with GEMINI_API_KEY=...');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body || {};
    if (typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Invalid message' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent([{ text: message }]);
    const text = result.response?.text?.() || '';

    if (!text) {
      return res.status(502).json({ error: 'Empty response from model' });
    }

    res.json({ reply: text });
  } catch (error) {
    console.error('Chat API error:', error?.response?.data || error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});