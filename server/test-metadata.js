const { enhanceMetadata } = require('./utils/metadataEnhancer');

const testFiles = [
    "AAJ PHIR - LEGEND X @aricsince1940  ｜ LATEST HEARTFELT LOFI RAP SONG 2025 ｜ VIRAL HINDI RAP [ONIzuXApK9c].mp3"
];

async function runTests() {
    console.log("Testing Metadata Extraction...\n");

    for (const file of testFiles) {
        const fallback = { title: file, artist: "Unknown Artist" };
        const result = await enhanceMetadata(file, fallback);
        console.log(`File: ${file}`);
        console.log(`Result: "${result.title}" by ${result.artist}`);
        console.log("---");
    }
}

runTests();
