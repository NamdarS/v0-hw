import { GoogleGenAI } from "@google/genai";
import fs from 'fs';

async function listModels() {
    const env = fs.readFileSync('.env', 'utf8');
    const match = env.match(/VITE_GEMINI_API_KEY=(.*)/);
    const apiKey = match ? match[1].trim() : null;

    if (!apiKey) {
        console.error("No API key found in .env");
        return;
    }

    const ai = new GoogleGenAI({ apiKey });

    try {
        console.log("Listing models...");
        const response = await ai.models.list();

        console.log("\n--- AVAILABLE MODELS ---");
        // The structure usually has a 'models' array.
        // Based on new SDK, response might be the iterable or have a property.
        // We'll try to iterate.
        if (Array.isArray(response)) {
            response.forEach(m => console.log(m.name || m));
        } else if (response.models) {
            response.models.forEach(m => console.log(m.name));
        } else {
            console.log("Response:", response);
        }
        console.log("--- END ---\n");
    } catch (e) {
        console.error("Error listing models:", e);
    }
}

listModels();
