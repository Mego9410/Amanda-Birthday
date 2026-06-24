const { db } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { full_name, email, attending, dietary, quote } = req.body || {};

  if (!full_name || !email || !attending || !quote) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!['yes', 'no', 'maybe'].includes(attending)) {
    return res.status(400).json({ error: 'Invalid attending value' });
  }

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      'INSERT INTO rsvps (full_name, email, attending, dietary, quote) VALUES ($1, $2, $3, $4, $5)',
      [full_name, email, attending, dietary || null, quote]
    );

    const { rows } = await client.query(
      'INSERT INTO burn_book_entries (full_name, quote) VALUES ($1, $2) RETURNING id',
      [full_name, quote]
    );

    await client.query('COMMIT');
    return res.status(200).json({ id: rows[0].id });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('RSVP error:', err);
    return res.status(500).json({ error: 'Database error' });
  } finally {
    client.release();
  }
};
