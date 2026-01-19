const apiKey = 'AIzaSyANSnFGL3ydU8Q9IKRe_cg4kKqVaZtBZxo';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

const https = require('https');

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.models) {
                console.log('Available Models:');
                json.models.forEach(m => {
                    if (m.name.includes('gemini') || m.name.includes('imagen')) {
                        console.log(m.name);
                    }
                });
            } else {
                console.log('Error response:', json);
            }
        } catch (e) {
            console.error('Parse error:', e.message);
        }
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
