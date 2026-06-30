const { db } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  // ── List all RSVPs (party + dumpling dinner) ────────────────
  if (req.method === 'GET') {
    const { key } = req.query;
    if (!adminPassword || !key || key !== adminPassword) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const client = await db.connect();
    try {
      const { rows } = await client.query(
        `SELECT id, full_name, email, attending, dietary, quote, approved, created_at
         FROM rsvps ORDER BY created_at DESC`
      );

      let dinner = [];
      try {
        const r = await client.query(
          `SELECT id, full_name, attending, guests, note, created_at
           FROM dinner_rsvps ORDER BY created_at DESC`
        );
        dinner = r.rows;
      } catch (e) {
        // dinner_rsvps table may not exist yet — return empty list
        console.error('Dinner list error (table may be missing):', e.message);
      }

      return res.status(200).json({ rsvps: rows, dinner });
    } catch (err) {
      console.error('Admin list error:', err);
      return res.status(500).json({ error: 'Database error' });
    } finally {
      client.release();
    }
  }

  // ── Approve / unapprove / delete a single entry ─────────────
  if (req.method === 'POST') {
    const { key, action, id } = req.body || {};
    if (!adminPassword || !key || key !== adminPassword) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!id || !['approve', 'unapprove', 'delete', 'delete_dinner'].includes(action)) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const client = await db.connect();
    try {
      if (action === 'delete') {
        await client.query('DELETE FROM rsvps WHERE id = $1', [id]);
      } else if (action === 'delete_dinner') {
        await client.query('DELETE FROM dinner_rsvps WHERE id = $1', [id]);
      } else {
        await client.query(
          'UPDATE rsvps SET approved = $1 WHERE id = $2',
          [action === 'approve', id]
        );
      }
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('Admin action error:', err);
      return res.status(500).json({ error: 'Database error' });
    } finally {
      client.release();
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
