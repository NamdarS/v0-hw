import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';

async function test() {
    try {
        const env = fs.readFileSync('.env', 'utf8');
        const match = env.match(/VITE_GEMINI_API_KEY=(.*)/);
        const apiKey = match ? match[1].trim() : null;

        if (!apiKey) {
            console.error("No API Key found");
            return;
        }

        console.log("Testing API Key:", apiKey.substring(0, 5) + "...");

        const models = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-001",
            "gemini-1.5-flash-latest",
            "gemini-pro",
            "gemini-1.0-pro",
            "gemini-1.5-pro",
            "gemini-1.5-pro-latest"
        ];

        const genAI = new GoogleGenerativeAI(apiKey);

        for (const modelName of models) {
            console.log(`Testing model: ${modelName}...`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                const response = await result.response;
                console.log(`SUCCESS with ${modelName}! Response: ${response.text()}`);
                return; // Stop on first success
            } catch (e) {
                console.log(`FAILED ${modelName}: ${e.message.split(' ')[0]} ${e.message.split(' ')[1] || ''}...`);
            }
        }
        console.log("All models failed.");

    } catch (e) {
        console.error("Script Error:", e);
    }
}

test();
