const BASE_URL = 'https://newsapi.org/v2/top-headlines';

const MOCK_NEWS = [
    {
        title: "SpaceX successfully launches next-gen Starship, promising cheaper orbital transport",
        url: "https://www.spacex.com/launches",
        source: { name: "Reuters" },
        author: "Joey Roulette",
        publishedAt: new Date().toISOString(),
        description: "The massive rocket achieved orbit for the first time, marking a major milestone in reusable rocketry.",
        urlToImage: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "OpenAI releases new 'GPT-5' details: What we know so far",
        url: "https://openai.com/blog",
        source: { name: "The Verge" },
        author: "Nilay Patel",
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        description: "The next iteration of the popular model promises better reasoning capabilities and reduced hallucinations.",
        urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "Apple Vision Pro 2 rumors suggest a cheaper, lighter headset in 2026",
        url: "https://www.apple.com/newsroom",
        source: { name: "Wired" },
        author: "Julian Chokkattu",
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        description: "Supply chain leaks indicate a shift towards consumer accessibility for the mixed reality device.",
        urlToImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop"
    }
];

export const fetchMainstreamNews = async () => {
    const apiKey = import.meta.env.VITE_NEWS_API_KEY;

    if (!apiKey) {
        console.warn('NewsAPI Key missing. Using Mock Data.');
        return MOCK_NEWS;
    }

    try {
        const response = await fetch(`${BASE_URL}?category=technology&language=en&pageSize=40&apiKey=${apiKey}`);
        const data = await response.json();

        if (data.status === 'ok') {
            return data.articles;
        } else {
            console.error('NewsAPI Error Response:', data);
            return MOCK_NEWS;
        }
    } catch (error) {
        console.error('Fetch Error (NewsAPI):', error);
        return MOCK_NEWS;
    }
};
