require('dotenv').config({ path: '../.env' }); // Adjust path to .env
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Song = require('../models/Song');
const telegramService = require('../services/telegramService');
const mm = require('music-metadata');

// Configuration
const SONGS_DIR = path.join(__dirname, '../songs');
const BATCH_SIZE = 5; // Upload 5 files at a time to avoid flooding

async function connect() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
}

async function processFile(filePath) {
    const fileName = path.basename(filePath);

    // Check if already in DB
    const existing = await Song.findOne({ fileName: fileName });
    if (existing) {
        console.log(`Skipping (Already in DB): ${fileName}`);
        return;
    }

    try {
        // Parse Metadata
        const metadata = await mm.parseFile(filePath);
        const duration = metadata.format.duration || 0;
        const title = metadata.common.title || fileName.replace(/\.[^/.]+$/, "");
        const artist = metadata.common.artist || 'Unknown Artist';
        const album = metadata.common.album || 'Unknown Album';

        // Upload to Telegram
        console.log(`Uploading: ${fileName}...`);
        const telegramFile = await telegramService.uploadToChannel(filePath);

        // Save to DB
        const newSong = new Song({
            fileId: telegramFile.file_id,
            title,
            artist,
            album,
            duration,
            size: telegramFile.file_size,
            mimeType: telegramFile.mime_type,
            fileName: fileName
        });

        await newSong.save();
        console.log(`✅ Saved: ${title}`);

    } catch (err) {
        console.error(`❌ Error processing ${fileName}:`, err.message);
    }
}

async function main() {
    if (!telegramService.isReady()) {
        console.error('Telegram keys missing in .env');
        process.exit(1);
    }

    await connect();

    console.log(`Scanning ${SONGS_DIR}...`);
    const files = fs.readdirSync(SONGS_DIR);
    const audioFiles = files.filter(f => /\.(mp3|m4a|wav|flac|ogg)$/i.test(f));

    console.log(`Found ${audioFiles.length} audio files via local scan.`);

    // Process in batches
    for (let i = 0; i < audioFiles.length; i += BATCH_SIZE) {
        const batch = audioFiles.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(file => processFile(path.join(SONGS_DIR, file))));
    }

    console.log('All done!');
    process.exit(0);
}

main();
