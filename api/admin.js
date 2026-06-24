const { db } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { key } = req.query;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || !key || key !== adminPassword) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const client = await db.connect();
  try {
    const { rows } = await client.query(
      'SELECT id, full_name, email, attending, dietary, quote, created_at FROM rsvps ORDER BY created_at DESC'
    );
    return res.status(200).json({ rsvps: rows });
  } catch (err) {
    console.error('Admin error:', err);
    return res.status(500).json({ error: 'Database error' });
  } finally {
    client.release();
  }
};
