import { useState, useEffect } from 'react';
import { fetchAllNews, groupNewsByTime, CATEGORIES } from '../services/aggregator';
import { summarizeArticle } from '../services/gemini';
import Header from '../components/Header';
import CategoryNav from '../components/CategoryNav';
import NewsCard from '../components/NewsCard';
import SummaryModal from '../components/SummaryModal';
import { Loader2, Flame, Calendar, Clock } from 'lucide-react';

const Home = () => {
    const [newsGroups, setNewsGroups] = useState({ today: [], week: [], older: [] });
    const [allNews, setAllNews] = useState([]);
    const [category, setCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        loadNews();
    }, []);

    useEffect(() => {
        if (!allNews.length) return;

        let filtered = allNews;
        if (category !== 'All') {
            filtered = allNews.filter(item => item.categories && item.categories.includes(category));
        }
        setNewsGroups(groupNewsByTime(filtered));
    }, [category, allNews]);

    const loadNews = async () => {
        setLoading(true);
        try {
            const data = await fetchAllNews();
            setAllNews(data);
            setNewsGroups(groupNewsByTime(data));
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (item) => {
        setSelectedItem(item);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans selection:bg-indigo-500/20">
            <Header />

            <main className="container mx-auto px-4 pt-6">
                <div className="sticky top-16 z-40 bg-slate-50/90 backdrop-blur-xl py-4 -mx-4 px-4 border-b border-slate-200/60 mb-8 transition-colors">
                    <CategoryNav selected={category} onSelect={setCategory} />
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                            <Loader2 className="animate-spin text-indigo-600 relative z-10" size={40} />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {newsGroups.today.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-2 px-1">
                                    <Flame className="text-orange-600" size={16} fill="currentColor" />
                                    <h2 className="text-base font-bold text-slate-900 tracking-tight">Top Stories Today</h2>
                                    <div className="h-px bg-slate-200 flex-grow ml-4"></div>
                                </div>
                                <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide px-1">
                                    {newsGroups.today.map(item => (
                                        <div key={item.id} className="min-w-[75vw] md:min-w-[300px] snap-center">
                                            <NewsCard item={item} onClick={handleCardClick} dateFormat="time" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {newsGroups.week.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-3 px-1">
                                    <Calendar className="text-indigo-500" size={18} />
                                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">This Week</h2>
                                    <div className="h-px bg-slate-200 flex-grow ml-4"></div>
                                </div>
                                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-1">
                                    {newsGroups.week.map(item => (
                                        <div key={item.id} className="min-w-[260px] md:min-w-[300px] snap-start">
                                            <NewsCard item={item} onClick={handleCardClick} dateFormat="date" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {newsGroups.older.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-3 px-1">
                                    <Clock className="text-slate-400" size={18} />
                                    <h2 className="text-lg font-bold text-slate-500 tracking-tight">Beyond This Week</h2>
                                    <div className="h-px bg-slate-200 flex-grow ml-4"></div>
                                </div>
                                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-1 opacity-90 hover:opacity-100 transition-opacity">
                                    {newsGroups.older.map(item => (
                                        <div key={item.id} className="min-w-[220px] md:min-w-[260px] snap-start">
                                            <NewsCard item={item} onClick={handleCardClick} dateFormat="date" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {allNews.length === 0 && (
                            <div className="text-center py-20 text-slate-400">
                                No news found.
                            </div>
                        )}
                    </div>
                )}
            </main>

            <SummaryModal
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                newsItem={selectedItem}
            />
        </div>
    );
};

export default Home;
