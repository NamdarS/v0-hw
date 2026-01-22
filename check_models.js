import fs from 'fs';

async function check() {
    try {
        const env = fs.readFileSync('.env', 'utf8');
        const match = env.match(/VITE_GEMINI_API_KEY=(.*)/);
        const key = match ? match[1].trim() : null;

        if (!key) {
            console.error("Could not find VITE_GEMINI_API_KEY in .env");
            return;
        }

        console.log("Found Key... querying Google API for available models...");
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", data.error);
        } else {
            console.log("--- START MODEL LIST ---");
            (data.models || []).forEach(m => {
                const name = m.name.replace('models/', '');
                console.log(name);
            });
            console.log("--- END MODEL LIST ---");
        }

    } catch (e) {
        console.error("Script Error:", e);
    }
}

check();
