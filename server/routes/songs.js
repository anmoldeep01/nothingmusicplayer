const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mm = require('music-metadata');
const { enhanceMetadata } = require('../utils/metadataEnhancer');

const SONGS_DIR = path.join(__dirname, '../songs');

// Function to extract YouTube video ID from filename
function extractYouTubeId(filename) {
    // Match patterns like [xF1w1amKlsA] or [yHpIMxjcYIU]
    const match = filename.match(/\[([a-zA-Z0-9_-]{11})\]/);
    return match ? match[1] : null;
}

// Function to get YouTube thumbnail URL
function getYouTubeThumbnail(videoId) {
    if (!videoId) return null;
    // Try maxresdefault first (1280x720), fallback to hqdefault (480x360)
    // maxresdefault is not available for all videos, but provides best quality when available
    return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
}

// Function to clean song metadata from filename
function cleanMetadata(filename) {
    // Remove all common audio file extensions (not just .mp3)
    let cleaned = filename.replace(/\.(mp3|m4a|wav|flac|ogg|aac|wma|opus|webm)$/i, '');

    // Extract YouTube ID before removing it
    const videoId = extractYouTubeId(filename);
    console.log(`Processing: ${filename} -> videoId: ${videoId}`);

    // Remove YouTube IDs (e.g., [xF1w1amKlsA], [yHpIMxjcYIU])
    cleaned = cleaned.replace(/\[[\w-]+\]/g, '');

    // Remove common patterns like (Official Music Video), (Lyrics), etc.
    cleaned = cleaned.replace(/\(.*?\)/g, '');

    // Remove brackets content like [Official Audio], [HD], etc.
    cleaned = cleaned.replace(/\[.*?\]/g, '');

    // Try to extract artist and title
    let artist = 'Unknown Artist';
    let title = cleaned;

    // Pattern 1: "Artist - Title"
    if (cleaned.includes(' - ')) {
        const parts = cleaned.split(' - ');
        artist = parts[0].trim();
        title = parts.slice(1).join(' - ').trim();
    }
    // Pattern 2: "Title ｜ Artist" or "Title | Artist"
    else if (cleaned.includes('｜')) {
        const parts = cleaned.split('｜');
        title = parts[0].trim();
        artist = parts[1]?.trim() || 'Unknown Artist';
    }
    else if (cleaned.includes(' | ')) {
        const parts = cleaned.split(' | ');
        title = parts[0].trim();
        artist = parts[1]?.trim() || 'Unknown Artist';
    }
    // Pattern 3: "Artist feat. Artist2 - Title"
    else if (cleaned.toLowerCase().includes('feat.') || cleaned.toLowerCase().includes('ft.')) {
        const parts = cleaned.split(' - ');
        if (parts.length > 1) {
            artist = parts[0].trim();
            title = parts.slice(1).join(' - ').trim();
        }
    }

    // Clean up extra spaces and special characters
    title = title.replace(/\s+/g, ' ').trim();
    artist = artist.replace(/\s+/g, ' ').trim();

    // Remove "Prod. by" and similar
    title = title.replace(/Prod\.?\s*by\s*.*/i, '').trim();
    artist = artist.replace(/Prod\.?\s*by\s*.*/i, '').trim();

    // Remove trailing dashes or pipes
    title = title.replace(/[-|]\s*$/, '').trim();
    artist = artist.replace(/[-|]\s*$/, '').trim();

    // Truncate overly long titles (more than 60 characters)
    // This handles cases where filename is extremely long
    if (title.length > 60) {
        // Try to find a natural break point (comma, dash, parenthesis)
        const breakPoints = [
            title.lastIndexOf(',', 60),
            title.lastIndexOf('-', 60),
            title.lastIndexOf('(', 60)
        ];
        const breakPoint = Math.max(...breakPoints);

        if (breakPoint > 30) {
            // Found a good break point
            title = title.substring(0, breakPoint).trim();
        } else {
            // No good break point, just truncate at word boundary
            const words = title.split(' ');
            let truncated = '';
            for (const word of words) {
                if ((truncated + ' ' + word).length > 60) break;
                truncated += (truncated ? ' ' : '') + word;
            }
            title = truncated || title.substring(0, 60);
        }
    }

    return { title, artist, videoId };
}

router.get('/', async (req, res) => {
    try {
        const songs = [];

        // Helper to process a directory
        const processDirectory = async (dirPath, playlistName = null) => {
            const items = fs.readdirSync(dirPath, { withFileTypes: true });

            for (const item of items) {
                const fullPath = path.join(dirPath, item.name);
                const relativePath = path.relative(SONGS_DIR, fullPath);

                if (item.isDirectory()) {
                    // Recursively process subdirectories (playlists)
                    // If we are already in a playlist (subfolder), we can treat nested ones as part of the same or nested
                    // For now, let's assume 1 level deep = playlist
                    const newPlaylistName = playlistName ? `${playlistName} - ${item.name}` : item.name;
                    await processDirectory(fullPath, newPlaylistName);
                } else if (/\.(mp3|m4a|wav|flac|ogg|aac|wma|opus|webm)$/i.test(item.name)) {
                    // It's a song file
                    try {
                        const metadata = await mm.parseFile(fullPath);
                        const cleaned = cleanMetadata(item.name);

                        // Always use offline filename parsing for metadata
                        console.log(`\n📝 File: ${relativePath}`);
                        const enhanced = await enhanceMetadata(item.name, cleaned);

                        console.log(`  Parsed: "${enhanced.title}" by ${enhanced.artist}`);

                        // Check if album art exists in MP3
                        const hasEmbeddedArt = metadata.common.picture && metadata.common.picture.length > 0;

                        // Determine album art source: embedded > YouTube ID thumbnail > null
                        let albumArt = null;
                        // Use relative path for ID to ensure uniqueness and correct art fetching
                        const encodedId = encodeURIComponent(relativePath);

                        if (hasEmbeddedArt) {
                            albumArt = `http://localhost:5000/api/songs/${encodedId}/art`;
                        } else if (cleaned.videoId) {
                            albumArt = getYouTubeThumbnail(cleaned.videoId);
                        }

                        // Construct URL - express.static handles subdirs, but we need to encode path parts
                        // Windows path separator is \, web needs /
                        const webPath = relativePath.split(path.sep).map(encodeURIComponent).join('/');

                        songs.push({
                            id: relativePath, // Use relative path as ID
                            title: enhanced.title,
                            artist: enhanced.artist,
                            album: metadata.common.album || 'Unknown Album',
                            duration: metadata.format.duration,
                            url: `http://localhost:5000/audio/${webPath}`,
                            albumArt: albumArt,
                            playlist: playlistName || 'All Songs' // Add playlist field
                        });
                    } catch (err) {
                        console.error(`\n❌ Error parsing metadata for ${relativePath}:`, err.message);
                        const cleaned = cleanMetadata(item.name);
                        const enhanced = await enhanceMetadata(item.name, cleaned);

                        const webPath = relativePath.split(path.sep).map(encodeURIComponent).join('/');

                        songs.push({
                            id: relativePath,
                            title: enhanced.title,
                            artist: enhanced.artist,
                            url: `http://localhost:5000/audio/${webPath}`,
                            albumArt: cleaned.videoId ? getYouTubeThumbnail(cleaned.videoId) : null,
                            playlist: playlistName || 'All Songs'
                        });
                    }
                }
            }
        };

        console.log(`\n🎵 Scanning songs directory...`);
        await processDirectory(SONGS_DIR);

        console.log(`\n✅ Successfully processed ${songs.length} songs\n`);
        res.json(songs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Endpoint to serve embedded album art
router.get('/:id/art', async (req, res) => {
    try {
        const filePath = path.join(SONGS_DIR, req.params.id);
        const metadata = await mm.parseFile(filePath);

        if (metadata.common.picture && metadata.common.picture.length > 0) {
            const picture = metadata.common.picture[0];
            res.set('Content-Type', picture.format);
            res.send(picture.data);
        } else {
            res.status(404).json({ message: 'No album art found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
