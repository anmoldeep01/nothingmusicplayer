const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    fileId: {
        type: String,
        required: true,
        unique: true
    }, // The Telegram File ID
    title: {
        type: String,
        required: true,
        index: true
    },
    artist: {
        type: String,
        default: 'Unknown Artist',
        index: true
    },
    album: {
        type: String,
        default: 'Unknown Album'
    },
    duration: {
        type: Number,
        default: 0
    },
    size: {
        type: Number
    },
    mimeType: {
        type: String,
        default: 'audio/mpeg'
    },
    fileName: {
        type: String
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Song', songSchema);
