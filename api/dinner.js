const { db } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { full_name, attending, guests, note } = req.body || {};

  if (!full_name || !attending) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!['yes', 'no', 'maybe'].includes(attending)) {
    return res.status(400).json({ error: 'Invalid attending value' });
  }
  const g = Math.max(1, Math.min(20, parseInt(guests, 10) || 1));

  const client = await db.connect();
  try {
    await client.query(
      `INSERT INTO dinner_rsvps (full_name, attending, guests, note)
       VALUES ($1, $2, $3, $4)`,
      [full_name, attending, g, note || null]
    );
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Dinner RSVP error:', err);
    return res.status(500).json({ error: 'Database error' });
  } finally {
    client.release();
  }
};
