// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Serve static audio files
// Serve static audio files
// In Vercel, files might be in a different location relative to __dirname or process.cwd()
let SONGS_DIR = path.join(__dirname, 'songs');

// Fallback for Vercel structure if __dirname doesn't work as expected
if (!fs.existsSync(SONGS_DIR)) {
    const potentialPath = path.join(process.cwd(), 'server', 'songs');
    if (fs.existsSync(potentialPath)) {
        SONGS_DIR = potentialPath;
    }
}

// Only try to create directory if we are NOT in production (local development)
// Vercel file system is read-only
if (process.env.NODE_ENV !== 'production') {
    if (!fs.existsSync(SONGS_DIR)) {
        try {
            fs.mkdirSync(SONGS_DIR);
            console.log('Created songs directory');
        } catch (err) {
            console.error('Failed to create songs directory:', err.message);
        }
    }
}
app.use('/audio', express.static(SONGS_DIR));

// Debug endpoint
app.get('/api/debug', (req, res) => {
    const debugInfo = {
        dirname: __dirname,
        cwd: process.cwd(),
        songsDir: SONGS_DIR,
        songsDirExists: fs.existsSync(SONGS_DIR),
        filesInSongsDir: fs.existsSync(SONGS_DIR) ? fs.readdirSync(SONGS_DIR) : 'Directory not found',
        filesInCurrentDir: fs.readdirSync(__dirname),
        // Try to list parent directory to see structure
        filesInParentDir: fs.existsSync(path.join(__dirname, '..')) ? fs.readdirSync(path.join(__dirname, '..')) : 'Parent not found'
    };
    res.json(debugInfo);
});

// Routes
// Routes
app.use('/api/songs', require('./routes/songs'));
app.use('/api/playlists', require('./routes/playlists'));

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
