import { GoogleGenAI } from "@google/genai";
import fs from 'fs';

async function verify() {
    try {
        const env = fs.readFileSync('.env', 'utf8');
        const match = env.match(/VITE_GEMINI_API_KEY=(.*)/);
        const apiKey = match ? match[1].trim() : null;

        if (!apiKey) {
            console.error("No API Key found");
            return;
        }

        console.log("Initializing SDK with key...");
        const ai = new GoogleGenAI({ apiKey });

        console.log("Listing Models...");
        const response = await ai.models.list();

        console.log("\n--- AVAILABLE MODELS ---");
        const generateModels = [];

        // The response structure depends on the SDK version, let's log safe
        if (response && response.models) {
            response.models.forEach(m => {
                console.log(`- ${m.name} [${m.supportedGenerationMethods.join(', ')}]`);
                if (m.supportedGenerationMethods.includes('generateContent')) {
                    generateModels.push(m.name);
                }
            });
        } else {
            console.log("Raw Response Model List:", response);
        }
        console.log("--- END LIST ---\n");

        if (generateModels.length > 0) {
            const modelToTest = generateModels.find(m => m.includes('flash')) || generateModels[0];
            const cleanName = modelToTest.replace('models/', '');
            console.log(`Testing Generation with: ${cleanName}`);

            try {
                const res = await ai.models.generateContent({
                    model: cleanName,
                    contents: [{ parts: [{ text: "Hello" }] }]
                });
                console.log("SUCCESS! response:", res.text());
            } catch (e) {
                console.error("Test Failed:", e.message);
            }
        } else {
            console.error("No models found that support generateContent.");
        }

    } catch (e) {
        console.error("Script Error:", e);
    }
}

verify();
