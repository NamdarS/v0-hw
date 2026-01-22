const ALGOLIA_API = 'https://hn.algolia.com/api/v1/search';

const fetchAlgoliaStories = async (startTime, endTime, limit = 50) => {
    try {
        const start = Math.floor(startTime / 1000);
        const end = Math.floor(endTime / 1000);

        const params = new URLSearchParams({
            tags: 'story',
            hitsPerPage: limit,
            numericFilters: `created_at_i>${start},created_at_i<${end}`
        });

        const response = await fetch(`${ALGOLIA_API}?${params.toString()}`);
        const data = await response.json();

        return data.hits.map(story => ({
            id: story.objectID,
            title: story.title,
            url: story.url,
            by: story.author,
            time: story.created_at_i,
            score: story.points
        })).filter(s => s.url);
    } catch (error) {
        console.error('Algolia Fetch Error:', error);
        return [];
    }
};

export const fetchRecentStories = async () => {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    return fetchAlgoliaStories(oneDayAgo, now, 100);
};

export const fetchWeekStories = async () => {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    return fetchAlgoliaStories(sevenDaysAgo, oneDayAgo, 200);
};

export const fetchOlderStories = async () => {
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    const monthAgo = now - (30 * 24 * 60 * 60 * 1000);
    return fetchAlgoliaStories(monthAgo, sevenDaysAgo, 200);
};

export const fetchTopStories = async () => {
    return fetchRecentStories();
};
