export default async function handler(req, res) {
  // Only allow POST (IGDB uses POST requests)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Get the path after /api/igdb/ (e.g. "games", "genres", etc.)
  const igdbPath = req.query.path?.join('/') || '';

  const response = await fetch(`https://api.igdb.com/v4/${igdbPath}`, {
    method: 'POST',
    headers: {
      'Client-ID': process.env.IGDB_CLIENT_ID,
      'Authorization': `Bearer ${process.env.IGDB_ACCESS_TOKEN}`,
      'Content-Type': 'text/plain',
    },
    body: req.body,
  });

  const data = await response.json();
  res.status(response.status).json(data);
}