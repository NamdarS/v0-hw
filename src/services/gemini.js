import { GoogleGenAI } from "@google/genai";

// Local cache to avoid redundant AI calls on every refresh
const VERIFIED_CACHE = new Map();

/**
 * @param {string} content - The text or URL to summarize.
 * @returns {Promise<string>} The AI response.
 */
export const summarizeArticle = async (content) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) return "Missing API Key.";

    const ai = new GoogleGenAI({ apiKey });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Summarize this tech article in 2 short sentences: ${content}`,
        });
        return response.text;
    } catch (error) {
        console.error("Gemini Failure:", error);
        return `API Error: ${error.message}.`;
    }
};

/**
 * Intelligent filter for tech news.
 */
export const filterArticlesAI = async (stories) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) return new Set(stories.map(s => s.id));

    const ai = new GoogleGenAI({ apiKey });

    // 1. Separate stories into Cached and New
    const toCheck = [];
    const verifiedIds = new Set();

    stories.forEach(s => {
        if (VERIFIED_CACHE.has(s.id)) {
            if (VERIFIED_CACHE.get(s.id)) verifiedIds.add(s.id);
        } else {
            toCheck.push(s);
        }
    });

    if (toCheck.length === 0) return verifiedIds;

    // 2. Batch check the new ones
    const BATCH_SIZE = 40;
    const candidates = toCheck.slice(0, BATCH_SIZE);

    const prompt = `You are a strict tech news editor. Review these titles and identify which are high-signal PROFESSIONAL TECH news (Software, Hardware, AI, Tech Business, Startups).
REJECT: medical/biology (e.g. tilapia, skin, doctors), general history, agriculture, lifestyle, and culture.
Return ONLY a JSON array of the indices of the articles that are tech news.
Example: [0, 2, 5]

Titles:
${candidates.map((s, i) => `${i}. ${s.title}`).join('\n')}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });

        const text = response.text;
        const match = text.match(/\[.*\]/s);
        const validIndices = match ? JSON.parse(match[0]) : [];

        // 3. Update Cache
        const passedIds = new Set(validIndices.map(idx => candidates[idx]?.id).filter(Boolean));

        candidates.forEach(s => {
            const passed = passedIds.has(s.id);
            VERIFIED_CACHE.set(s.id, passed);
            if (passed) verifiedIds.add(s.id);
        });

        return verifiedIds;
    } catch (error) {
        console.error("AI Filtering Error:", error);
        return new Set(stories.map(s => s.id)); // Fallback
    }
};
