const fs = require('fs');
const path = require('path');

// Lists every image in the /photos folder so the site picks up new
// photos automatically — no code changes needed when you add more.
module.exports = function handler(req, res) {
  try {
    const dir = path.join(process.cwd(), 'photos');
    const files = fs.readdirSync(dir)
      .filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f))
      .sort();
    res.status(200).json({ photos: files });
  } catch (err) {
    console.error('Photos list error:', err);
    res.status(200).json({ photos: [] }); // fail soft — client has a fallback
  }
};
