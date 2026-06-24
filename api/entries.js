const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { rows } = await sql`
      SELECT id, full_name, quote
      FROM burn_book_entries
      ORDER BY created_at ASC
    `;
    return res.status(200).json({ entries: rows });
  } catch (err) {
    console.error('Entries error:', err);
    return res.status(500).json({ error: 'Database error' });
  }
};
