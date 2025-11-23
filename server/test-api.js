const fetch = require('node-fetch');

async function testAPI() {
    try {
        const response = await fetch('http://localhost:5000/api/songs');
        const data = await response.json();

        console.log('Total songs:', data.length);
        console.log('\nFirst 3 songs:');
        data.slice(0, 3).forEach((song, i) => {
            console.log(`\n${i + 1}. ${song.title}`);
            console.log(`   Artist: ${song.artist}`);
            console.log(`   File: ${song.id}`);
            console.log(`   Album Art: ${song.albumArt || 'NULL'}`);
        });
    } catch (err) {
        console.error('Error:', err.message);
    }
}

testAPI();
