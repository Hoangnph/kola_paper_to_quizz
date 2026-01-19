const https = require('https');
const fs = require('fs');
const path = require('path');

const apiKey = 'AIzaSyANSnFGL3ydU8Q9IKRe_cg4kKqVaZtBZxo';
// Using fast model for speed and efficiency
const model = 'models/imagen-4.0-fast-generate-001';

const prompts = [
    { id: 4, text: "Cartoon icon of a blue floppy disk representing the Save command, computer interface element, bright and friendly, white background" },
    { id: 5, text: "Cartoon illustration of a computer keyboard Shift key with an upward arrow, educational technology, simple, white background" },
    { id: 6, text: "Cartoon user interface showing the 'Home' tab on a ribbon toolbar, computer software theme, colorful, white background" },
    { id: 7, text: "Cartoon letter 'B' in bold style, text formatting icon, vibrant colors, white background" },
    { id: 8, text: "Cartoon list with bullet points, text formatting concept, clear and simple, white background" },
    { id: 9, text: "Educational cartoon showing text before and after formatting, clear visual comparison, white background" },
    { id: 10, text: "Cartoon hand cursor highlighting text on a screen, computer action concept, white background" },
    { id: 11, text: "Cartoon illustration of a presentation slide changing to another with a magic transition effect, white background" },
    { id: 12, text: "Cartoon user interface showing 'Transitions' tab, presentation software theme, white background" },
    { id: 13, text: "Simple cartoon showing one slide with exactly one transition effect icon, educational, white background" },
    { id: 14, text: "Cartoon 'Play' button symbol or presentation screen starting slideshow, white background" },
    { id: 15, text: "Cartoon icons representing 'Push', 'Wipe', 'Fade' visual effects, dynamic and fun, white background" }
];

const outputDir = path.join(__dirname, '../assets/images');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function generateImage(item) {
    return new Promise((resolve, reject) => {
        console.log(`Generating image for Q${item.id}...`);

        const postData = JSON.stringify({
            instances: [{ prompt: item.text }],
            parameters: { sampleCount: 1, aspectRatio: "1:1" }
        });

        const options = {
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/${model}:predict?key=${apiKey}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    console.error(`Error generating Q${item.id}: Status ${res.statusCode}`);
                    console.error(data);
                    resolve(false); // Resolve but mark failed
                    return;
                }

                try {
                    const json = JSON.parse(data);
                    if (json.predictions && json.predictions[0] && json.predictions[0].bytesBase64Encoded) {
                        const buffer = Buffer.from(json.predictions[0].bytesBase64Encoded, 'base64');
                        const filePath = path.join(outputDir, `q${item.id}.png`);
                        fs.writeFileSync(filePath, buffer);
                        console.log(`✅ Saved Q${item.id} to ${filePath}`);
                        resolve(true);
                    } else {
                        console.error(`Invalid response format for Q${item.id}:`, data.substring(0, 200));
                        resolve(false);
                    }
                } catch (e) {
                    console.error(`Parse error for Q${item.id}:`, e.message);
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Request error for Q${item.id}:`, e.message);
            resolve(false);
        });

        req.write(postData);
        req.end();
    });
}

async function run() {
    for (const item of prompts) {
        await generateImage(item);
        // Small delay to be nice to API
        await new Promise(r => setTimeout(r, 1000));
    }
}

run();
