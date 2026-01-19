const https = require('https');
const apiKey = 'sk-29078c3e5609447bb39bb4bab5f32790';

const data = JSON.stringify({
    prompt: "A cute cat",
    n: 1,
    size: "1024x1024"
});

const options = {
    hostname: 'api.deepseek.com',
    path: '/v1/images/generations', // Standard OpenAI image endpoint
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': data.length
    }
};

console.log('Testing DeepSeek Image Generation endpoint...');

const req = https.request(options, res => {
    console.log(`Status: ${res.statusCode}`);
    res.on('data', d => process.stdout.write(d));
});

req.on('error', error => {
    console.error('Error:', error.message);
});

req.write(data);
req.end();
