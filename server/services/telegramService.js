const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

// Initialize bot if token is present
const token = process.env.TELEGRAM_BOT_TOKEN;
const channelId = process.env.TELEGRAM_CHANNEL_ID;

let bot = null;

if (token) {
    bot = new TelegramBot(token, { polling: false }); // No need for polling, just API calls
    console.log('Telegram Bot initialized');
} else {
    console.warn('TELEGRAM_BOT_TOKEN not found in environment variables');
}

/**
 * Uploads a file to the configured Telegram Channel
 * @param {string} filePath - Path to the local file
 * @returns {Promise<Object>} - The Telegram file object (contains file_id)
 */
async function uploadToChannel(filePath) {
    if (!bot || !channelId) {
        throw new Error('Bot Token or Channel ID missing');
    }

    try {
        console.log(`Uploading ${path.basename(filePath)} to Telegram...`);
        // sendAudio automatically handles audio metadata if possible, but we mostly care about the file_id
        const message = await bot.sendAudio(channelId, fs.createReadStream(filePath), {
            title: path.basename(filePath) // Simple metadata for the message itself
        });

        return message.audio; // Contains file_id, duration, mime_type, file_size
    } catch (error) {
        console.error('Telegram upload failed:', error.message);
        throw error;
    }
}

/**
 * Gets a direct download link for a file_id
 * Note: Should use file_id to get path, then construct URL
 * @param {string} fileId 
 * @returns {Promise<string>} - The download URL
 */
async function getFileLink(fileId) {
    if (!bot) throw new Error('Bot not initialized');

    // getFile returns file_path, which is valid for 1 hour
    const file = await bot.getFile(fileId);
    return `https://api.telegram.org/file/bot${token}/${file.file_path}`;
}

module.exports = {
    uploadToChannel,
    getFileLink,
    isReady: () => !!bot && !!channelId
};
