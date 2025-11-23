/**
 * Smart filename parser for extracting song metadata
 * No external APIs needed - pure logic-based parsing
 */

const fs = require('fs');
const path = require('path');
// dotenv is no longer needed for API key, but keeping it if used elsewhere or for consistency
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

// Debug logger
function logDebug(message) {
    const logPath = path.join(__dirname, '../debug.log');
    const timestamp = new Date().toISOString();
    try {
        fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
    } catch (e) {
        // Ignore logging errors
    }
}

// Cache to avoid repeated parsing
const metadataCache = new Map();

/**
 * Parse song title and artist from filename using intelligent heuristics
 * @param {string} filename - Original filename
 * @returns {Object} - {title, artist, confidence}
 */
function parseSongFromFilename(filename) {
    // 1. Remove extension
    let clean = filename.replace(/\.[a-z0-9]+$/i, "");

    // 2. Remove common garbage words
    const trashWords = [
        "official", "video", "audio", "lyrics", "lyric",
        "full song", "remix", "remastered", "cover",
        "slowed", "reverb", "8d audio", "bass boosted",
        "tiktok", "shorts", "status",
        "hd", "hq", "4k", "1080p", "720p", "5.1", "7.1",
        "prod.", "prod", "performance",
        "mp3", "m4a",
        "latest", "viral", "lofi", "rap song", "heartfelt", "2025", "2024" // Added from Gemini prompt rules
    ];

    trashWords.forEach(t => {
        const reg = new RegExp(`\\b${t}\\b`, "i");
        clean = clean.replace(reg, "");
    });

    // 3. Remove brackets and content inside
    clean = clean.replace(/\[[^\]]+\]/g, "")
        .replace(/\([^)]*\)/g, "");

    // 4. Normalize separators
    clean = clean
        .replace(/[_•·]+/g, " - ")
        .replace(/--+/g, "-")
        .replace(/\s+-\s+/g, " - ")
        .replace(/\s+/g, " ")
        .trim();

    // SPLIT using separators
    const separators = [" - ", "-", " by ", "|", "｜"]; // Added pipe separators
    let parts = null;

    for (const sep of separators) {
        if (clean.includes(sep)) {
            parts = clean.split(sep).map(p => p.trim());
            break;
        }
    }

    // If no separator, assume only title
    if (!parts || parts.length < 2) {
        return {
            title: clean,
            artist: "Unknown Artist",
            confidence: 0.40
        };
    }

    // Try combinations:
    let artist = parts[0];
    let title = parts.slice(1).join(" ");

    // 5. Heuristic scoring

    // Artist usually 1–3 short words
    const artistScore = artist.split(" ").length <= 3 ? 1 : 0;

    // Title usually longer
    const titleScore = title.split(" ").length >= 2 ? 1 : 0;

    // If reversed (title first), swap
    if (artistScore === 0 && titleScore === 0) {
        [artist, title] = [title, artist];
    }

    // If artist looks like a sentence → swap
    if (artist.split(" ").length > 4) {
        [artist, title] = [title, artist];
    }

    // Final cleanup
    artist = artist.replace(/[^a-z0-9 '&]/gi, "").trim();
    title = title.replace(/[^a-z0-9 '&]/gi, "").trim();

    // If after cleanup artist becomes empty, fallback
    if (artist.length < 2) {
        artist = "Unknown Artist";
    }

    return {
        title,
        artist,
        confidence: artist === "Unknown Artist" ? 0.60 : 0.85
    };
}

/**
 * Main function to enhance metadata
 * Uses smart parsing instead of external APIs
 * @param {string} filename - Original filename
 * @param {object} fallbackMetadata - Fallback metadata from filename parsing
 * @returns {Promise<{title: string, artist: string}>}
 */
async function enhanceMetadata(filename, fallbackMetadata) {
    try {
        // Check cache first
        const cacheKey = filename.toLowerCase();
        if (metadataCache.has(cacheKey)) {
            logDebug(`Cache hit for: ${filename}`);
            return metadataCache.get(cacheKey);
        }

        logDebug(`Enhancing (Heuristic): ${filename}`);

        // Use smart regex parsing
        const parsed = parseSongFromFilename(filename);

        const result = {
            title: parsed.title,
            artist: parsed.artist
        };

        // Cache the result
        metadataCache.set(cacheKey, result);
        logDebug(`Heuristic Success: ${JSON.stringify(result)}`);

        return result;

    } catch (error) {
        logDebug(`Enhancement Error: ${error.message}`);
        return fallbackMetadata;
    }
}

function clearCache() {
    metadataCache.clear();
    console.log('Metadata cache cleared');
}

module.exports = {
    enhanceMetadata,
    parseSongFromFilename,
    clearCache
};
