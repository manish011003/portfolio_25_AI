const { generateReply, GEMINI_API_KEY } = require('../lib/gemini');

const isProd = process.env.NODE_ENV === 'production';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }
    const { message } = body || {};

    if (typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Invalid message' });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const text = await generateReply(message);
    if (!text) {
      return res.status(502).json({ error: 'Empty response from model' });
    }

    return res.status(200).json({ reply: text });
  } catch (error) {
    console.error('Chat API error:', error?.data || error?.hint || error);
    const clientMessage = isProd ? 'Something went wrong' : (error?.message || 'Something went wrong');
    return res.status(500).json({ error: clientMessage });
  }
};
