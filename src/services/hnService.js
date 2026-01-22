const ALGOLIA_API = 'https://hn.algolia.com/api/v1/search';

/**
 * Fetches stories from a specific time range using Algolia
 */
const fetchAlgoliaStories = async (startTime, endTime, limit = 50) => {
    try {
        // Algolia uses seconds for timestamps
        const start = Math.floor(startTime / 1000);
        const end = Math.floor(endTime / 1000);

        const params = new URLSearchParams({
            tags: 'story',
            hitsPerPage: limit,
            numericFilters: `created_at_i>${start},created_at_i<${end}`
        });

        const response = await fetch(`${ALGOLIA_API}?${params.toString()}`);
        const data = await response.json();

        // Normalize Algolia format to match what we expect
        return data.hits.map(story => ({
            id: story.objectID,
            title: story.title,
            url: story.url,
            by: story.author,
            time: story.created_at_i, // Keep as seconds to match original HN format
            score: story.points
        })).filter(s => s.url); // Ensure URL exists
    } catch (error) {
        console.error('Algolia Fetch Error:', error);
        return [];
    }
};

/**
 * Fetches "Breaking" stories (Last 24h)
 */
export const fetchRecentStories = async () => {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    // Fetch top 100 to ensure we get the absolute best of the day
    return fetchAlgoliaStories(oneDayAgo, now, 100);
};

/**
 * Fetches "This Week" stories (24h ago to 7 days ago)
 */
export const fetchWeekStories = async () => {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    // Increase to 200 to ensure distribution across the whole week
    return fetchAlgoliaStories(sevenDaysAgo, oneDayAgo, 200);
};

/**
 * Fetches "Older" stories (7 days ago to 30 days ago)
 */
export const fetchOlderStories = async () => {
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    const monthAgo = now - (30 * 24 * 60 * 60 * 1000);
    // Increase for broader coverage
    return fetchAlgoliaStories(monthAgo, sevenDaysAgo, 200);
};

// Deprecated: fetchTopStories (kept for interface compatibility if needed, but we should switch aggregator)
export const fetchTopStories = async () => {
    // Fallback to recent if called directly
    return fetchRecentStories();
};
