import fs from 'fs';

async function testraw() {
    try {
        const env = fs.readFileSync('.env', 'utf8');
        const match = env.match(/VITE_GEMINI_API_KEY=(.*)/);
        const key = match ? match[1].trim() : null;

        if (!key) {
            console.error("No API Key found in .env");
            return;
        }

        console.log(`Testing Raw REST API with key: ${key.substring(0, 6)}...`);

        // Test gemini-pro
        const model = "gemini-pro";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

        console.log(`POST to ${url}`);

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Explain how AI works in a few words" }] }]
            })
        });

        console.log(`Status: ${response.status} ${response.statusText}`);
        const text = await response.text();
        console.log("Response Body:", text);

    } catch (e) {
        console.error("Script Error:", e);
    }
}

testraw();
