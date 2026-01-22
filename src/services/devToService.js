const BASE_URL = 'https://dev.to/api';

/**
 * Fetches rising/top articles from Dev.to
 */
export const fetchDevToArticles = async () => {
    try {
        // Filter specifically for "news" tag to avoid tutorials/personal stories
        const response = await fetch(`${BASE_URL}/articles?tag=news&top=1&per_page=15`);
        if (!response.ok) {
            throw new Error('Failed to fetch dev.to articles');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching Dev.to articles:', error);
        return [];
    }
};
