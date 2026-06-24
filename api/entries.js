const { db } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = await db.connect();
  try {
    // Only memories the admin has approved appear publicly.
    const { rows } = await client.query(
      'SELECT id, full_name, quote FROM rsvps WHERE approved = TRUE ORDER BY created_at ASC'
    );
    return res.status(200).json({ entries: rows });
  } catch (err) {
    console.error('Entries error:', err);
    return res.status(500).json({ error: 'Database error' });
  } finally {
    client.release();
  }
};
