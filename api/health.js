const { ensureDiscoveredModels } = require('../lib/gemini');

module.exports = async (_req, res) => {
  try {
    const models = await ensureDiscoveredModels();
    return res.status(200).json({ ok: true, models });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || 'list models failed' });
  }
};
