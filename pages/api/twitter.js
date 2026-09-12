const USER = 'realmanishb';
const PROFILE = `https://x.com/${USER}`;
const FALLBACK = [
  {
    id: null,
    text: 'I think engineers have a weird habit of asking: “Can we build this?” before asking: “Should this exist?” I’ve definitely been guilty of it. Spidey Tracker is probably evidence.',
    url: 'https://spidey-tracker-pi.vercel.app/',
    href: PROFILE
  },
  {
    id: null,
    text: 'One thing I learnt while building Spidey Tracker: realtime data ≠ normal database data. Firestore handles the persistent stuff. RTDB handles presence, location and nudges. The interesting part wasn’t using Firebase. It was deciding what actually deserved to be realtime.',
    url: null,
    href: PROFILE
  },
  {
    id: '2086671119478817110',
    text: 'New shots from the build log — shipping in public.',
    url: null,
    href: `https://x.com/${USER}/status/2086671119478817110`
  }
];

function stripMd(s) {
  return String(s || '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseJinaMarkdown(md) {
  const posts = [];
  const statusIds = [...String(md).matchAll(/x\.com\/realmanishb\/status\/(\d+)/gi)].map((m) => m[1]);
  const items = String(md).match(/^\*\s+.+$/gm) || [];

  for (const raw of items) {
    const text = stripMd(raw.replace(/^\*\s+/, ''));
    if (text.length < 40) continue;
    if (/^Manish Biswas$/i.test(text)) continue;
    if (/Joined November/i.test(text)) continue;
    posts.push({
      id: null,
      text,
      url: null,
      href: PROFILE
    });
  }

  // Attach known status ids where possible (last media-heavy posts often have ids)
  if (statusIds.length && posts.length) {
    posts[Math.min(posts.length - 1, 2)].id = statusIds[0];
    posts[Math.min(posts.length - 1, 2)].href = `https://x.com/${USER}/status/${statusIds[0]}`;
  }

  // Dedupe by text prefix
  const seen = new Set();
  return posts.filter((p) => {
    const key = p.text.slice(0, 80).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 6);
}

async function fetchRemotePosts() {
  const endpoints = [
    `https://r.jina.ai/https://x.com/${USER}`,
    `https://r.jina.ai/http://x.com/${USER}`
  ];

  for (const endpoint of endpoints) {
    try {
      const resp = await fetch(endpoint, {
        headers: { Accept: 'text/plain', 'User-Agent': 'manish-portfolio/1.0' }
      });
      if (!resp.ok) continue;
      const md = await resp.text();
      const posts = parseJinaMarkdown(md);
      if (posts.length) return posts;
    } catch (err) {
      console.error('twitter fetch failed', endpoint, err?.message || err);
    }
  }
  return null;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    return res.status(204).end();
  }
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET,OPTIONS');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const remote = await fetchRemotePosts();
    const posts = remote && remote.length ? remote : FALLBACK;
    return res.status(200).json({
      user: USER,
      profile: PROFILE,
      source: remote && remote.length ? 'live' : 'fallback',
      posts
    });
  } catch (error) {
    console.error('Twitter API error', error);
    return res.status(200).json({
      user: USER,
      profile: PROFILE,
      source: 'fallback',
      posts: FALLBACK
    });
  }
};
