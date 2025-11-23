const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const PLAYLISTS_FILE = path.join(DATA_DIR, 'playlists.json');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

if (!fs.existsSync(PLAYLISTS_FILE)) {
    fs.writeFileSync(PLAYLISTS_FILE, JSON.stringify([]));
}

const getPlaylists = () => {
    const data = fs.readFileSync(PLAYLISTS_FILE);
    return JSON.parse(data);
};

const savePlaylists = (playlists) => {
    fs.writeFileSync(PLAYLISTS_FILE, JSON.stringify(playlists, null, 2));
};

// Get all playlists
router.get('/', (req, res) => {
    res.json(getPlaylists());
});

// Create playlist
router.post('/', (req, res) => {
    const { name } = req.body;
    const playlists = getPlaylists();
    const newPlaylist = {
        id: Date.now().toString(),
        name,
        songs: []
    };
    playlists.push(newPlaylist);
    savePlaylists(playlists);
    res.json(newPlaylist);
});

// Add song to playlist
router.post('/:id/songs', (req, res) => {
    const { id } = req.params;
    const { song } = req.body;
    const playlists = getPlaylists();
    const playlist = playlists.find(p => p.id === id);

    if (playlist) {
        playlist.songs.push(song);
        savePlaylists(playlists);
        res.json(playlist);
    } else {
        res.status(404).json({ message: 'Playlist not found' });
    }
});

// Remove song from playlist
router.delete('/:id/songs/:songId', (req, res) => {
    const { id, songId } = req.params;
    const playlists = getPlaylists();
    const playlist = playlists.find(p => p.id === id);

    if (playlist) {
        playlist.songs = playlist.songs.filter(s => s.id !== songId);
        savePlaylists(playlists);
        res.json(playlist);
    } else {
        res.status(404).json({ message: 'Playlist not found' });
    }
});

// Delete playlist
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    let playlists = getPlaylists();
    playlists = playlists.filter(p => p.id !== id);
    savePlaylists(playlists);
    res.json({ message: 'Playlist deleted' });
});

module.exports = router;
