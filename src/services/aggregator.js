import { fetchRecentStories, fetchWeekStories, fetchOlderStories } from './hnService';
import { fetchMainstreamNews } from './newsApiService';

/**
 * Categories for filtering
 */
export const CATEGORIES = ['All', 'Software', 'Hardware', 'AI', 'Business'];

/**
 * Keyword mapping for auto-categorization labels
 */
const KEYWORDS = {
    AI: ['ai', 'gpt', 'llm', 'learning', 'model', 'neural', 'robot', 'intelligence', 'gemini', 'openai', 'claude', 'llama', 'transformer', 'deep learning'],
    Business: ['crypto', 'bitcoin', 'eth', 'finance', 'market', 'stock', 'money', 'vc', 'shutdown', 'acquisition', 'startup', 'funding', 'ipo', 'layoff'],
    Hardware: ['apple', 'chip', 'nvidia', 'amd', 'intel', 'processor', 'phone', 'vision', 'headset', 'device', 'raspberry', 'arduino', 'gpu', 'cpu'],
    Software: ['react', 'vue', 'js', 'javascript', 'css', 'html', 'node', 'web', 'browser', 'frontend', 'backend', 'api', 'dev', 'cloud', 'aws', 'linux', 'rust', 'go', 'python', 'docker', 'kubernetes'],
};

export const CATEGORY_COLORS = {
    AI: 'text-purple-700 bg-purple-100 border-purple-200',
    Business: 'text-emerald-700 bg-emerald-100 border-emerald-200',
    Hardware: 'text-orange-700 bg-orange-100 border-orange-200',
    Software: 'text-blue-700 bg-blue-100 border-blue-200',
    General: 'text-slate-600 bg-slate-100 border-slate-200'
};

const FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop', // Circuit board
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop', // Retro tech
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop', // Laptop/Coding
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop', // Abstract digital
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop', // Robotics
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1200&auto=format&fit=crop', // Modern laptop
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop', // Code on screen
    'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=1200&auto=format&fit=crop', // Server room
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop', // Minimal workspace
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop', // Cyber code
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop', // Team at tech office
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop', // Text "Hello World"
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop', // Engineering
    'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=1200&auto=format&fit=crop', // Network glow
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=1200&auto=format&fit=crop', // Processor macro
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop', // Blue digital abstract
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop', // Vibrant React/JS
    'https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=1200&auto=format&fit=crop', // Desktop dev setup
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop', // AI face/neural
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=1200&auto=format&fit=crop', // Lab equipment
    'https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=1200&auto=format&fit=crop', // GPU/Processor
    'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1200&auto=format&fit=crop', // Microchip macro
    'https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1200&auto=format&fit=crop', // Futuristic tunnel
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop', // Cybersecurity shield
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=1200&auto=format&fit=crop', // iPhone/Mobile
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1200&auto=format&fit=crop', // Smartphone patterns
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop', // Modern office
    'https://images.unsplash.com/photo-1491975474562-1f4e30bc9468?q=80&w=1200&auto=format&fit=crop', // Minimal coder home
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1200&auto=format&fit=crop', // Laptop macro
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop'  // Console coding
];

const getFallbackImage = (id, title = '') => {
    // Salt the hash with the title to ensure variance for sequential IDs
    const str = String(id) + String(title);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    // Mix it more heavily
    hash = (hash ^ (hash >>> 16)) * 0x85ebca6b;
    hash = (hash ^ (hash >>> 13)) * 0xc2b2ae35;
    hash = (hash ^ (hash >>> 16));

    return FALLBACK_IMAGES[Math.abs(hash) % FALLBACK_IMAGES.length];
};

const categorize = (title, tags = [], description = '') => {
    const text = (title + ' ' + tags.join(' ') + ' ' + description).toLowerCase();
    const foundTags = new Set();
    for (const [category, words] of Object.entries(KEYWORDS)) {
        if (words.some(word => text.includes(word))) {
            foundTags.add(category);
        }
    }
    // Restore 'General' so articles don't get dropped if they lack specific keywords
    return foundTags.size > 0 ? Array.from(foundTags) : ['General'];
};

const normalizeHN = (item) => {
    const title = item.title.replace(/^(Show HN|Ask HN):?\s*/i, '').trim();
    let source = 'Hacker News';
    try {
        if (item.url) source = new URL(item.url).hostname.replace('www.', '');
    } catch (e) { }

    return {
        id: `hn-${item.id}`,
        title: title,
        url: item.url,
        source: source,
        author: item.by,
        score: item.score,
        time: item.time * 1000,
        categories: categorize(title),
        image: getFallbackImage(item.id, title),
        hasNativeImage: false,
        original: item
    };
};

const normalizeNewsApi = (item) => {
    const id = `newsapi-${item.url}`;
    const hasImage = !!(item.urlToImage && item.urlToImage.startsWith('http'));
    return {
        id: id,
        title: item.title,
        url: item.url,
        source: item.source.name || 'News',
        author: item.author,
        score: null,
        time: new Date(item.publishedAt).getTime(),
        categories: categorize(item.title, [], item.description || ''),
        description: item.description,
        image: hasImage ? item.urlToImage : getFallbackImage(id, item.title),
        hasNativeImage: hasImage,
        original: item
    };
};

const isSpamOrInvalid = (item) => {
    const text = item.title.toLowerCase();
    if (item.url && (item.url.includes('.github.io') || item.url.includes('whatsmydepreciation.co'))) return true;
    const spamWords = ['win', 'giveaway', 'prize', 'challenge', 'promo', 'deal', 'sale', 'free ticket'];
    return spamWords.some(w => text.includes(w));
};

export const groupNewsByTime = (news) => {
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const sevenDays = 7 * oneDay;
    const groups = { today: [], week: [], older: [] };

    news.forEach(item => {
        const diff = now - item.time;
        if (diff >= 0 && diff < oneDay) groups.today.push(item);
        else if (diff < sevenDays) groups.week.push(item);
        else groups.older.push(item);
    });

    const getScore = (item) => {
        let baseScore = item.score === null || item.score === undefined ? 85 : item.score;
        if (item.hasNativeImage) baseScore += 5000;
        else if (item.image) baseScore += 100;
        return baseScore;
    };
    const sortByScore = (list) => list.sort((a, b) => {
        const scoreDiff = getScore(b) - getScore(a);
        if (scoreDiff !== 0) return scoreDiff;
        return b.time - a.time;
    });

    const limit = (list) => sortByScore(list).slice(0, 20);
    groups.today = limit(groups.today);
    groups.week = limit(groups.week);
    groups.older = limit(groups.older);
    return groups;
};

export const fetchAllNews = async () => {
    const [hnRecent, hnWeek, hnOlder, newsApiArticles] = await Promise.all([
        fetchRecentStories(),
        fetchWeekStories(),
        fetchOlderStories(),
        fetchMainstreamNews()
    ]);

    const normalize = (list) => list.map(normalizeHN);
    const hnAll = [...normalize(hnRecent), ...normalize(hnWeek), ...normalize(hnOlder)];
    const newsApiNorm = (newsApiArticles || []).map(normalizeNewsApi);

    // 1. Merge and filter clear technical spam
    const all = [...newsApiNorm, ...hnAll]
        .filter(item => !isSpamOrInvalid(item));

    return all;
};
