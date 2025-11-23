// Test the YouTube ID extraction
const filename1 = "11K [nUAra7tddLY].mp3";
const filename2 = "4AM IN KARACHI - TALHA ANJUM [eWEPceAo4YQ].mp3";

function extractYouTubeId(filename) {
    // Match patterns like [xF1w1amKlsA] or [yHpIMxjcYIU]
    const match = filename.match(/\[([a-zA-Z0-9_-]{11})\]/);
    return match ? match[1] : null;
}

console.log("Test 1:", filename1);
console.log("Extracted ID:", extractYouTubeId(filename1));
console.log("Expected: nUAra7tddLY");
console.log("");

console.log("Test 2:", filename2);
console.log("Extracted ID:", extractYouTubeId(filename2));
console.log("Expected: eWEPceAo4YQ");
