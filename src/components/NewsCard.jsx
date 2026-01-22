import { motion } from 'framer-motion';
import { ExternalLink, ThumbsUp, Clock } from 'lucide-react';
import { CATEGORY_COLORS } from '../services/aggregator';

const NewsCard = ({ item, onClick, dateFormat = 'time' }) => {
    // Get domain for favicon or display
    let domain = '';
    try {
        domain = new URL(item.url).hostname;
    } catch (e) {
        domain = item.source; // fallback
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={() => onClick(item)}
            className="group relative glass-card rounded-xl overflow-hidden glow-hover transition-soft cursor-pointer flex flex-col h-full"
        >
            {/* Hero Image Section - Tighter Aspect Ratio */}
            <div className="relative aspect-[16/8] overflow-hidden bg-white/10">
                <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="p-3 flex flex-col flex-grow">
                {/* Header: Source/Favicon & Category - Tighter Spacing */}
                <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-200">
                            <img
                                src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                                className="w-3 h-3 relative z-10"
                                onError={(e) => { e.target.style.display = 'none' }}
                                loading="lazy"
                            />
                        </div>
                        <span className="text-[10px] font-medium text-slate-500 group-hover:text-indigo-600 transition-colors truncate max-w-[100px]">
                            {item.source}
                        </span>
                    </div>
                    <div className="flex gap-1">
                        {(item.categories || [item.category || 'General']).slice(0, 1).map((cat, i) => (
                            <span
                                key={i}
                                className={`text-[8px] font-bold tracking-tight uppercase px-1 py-0.5 rounded border ${CATEGORY_COLORS[cat] || CATEGORY_COLORS.General}`}
                            >
                                {cat}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Title - Significantly Smaller and Tighter */}
                <h3
                    className="text-sm font-bold text-slate-900 leading-[1.2] mb-1.5 group-hover:text-indigo-600 transition-colors line-clamp-2 text-ellipsis overflow-hidden"
                    title={item.title}
                >
                    {item.title}
                </h3>

                {/* Footer Info - Ultra Compact */}
                <div className="flex items-center justify-between text-[9px] text-slate-400 mt-auto pt-1.5 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                            <ThumbsUp size={8} />
                            <span>{item.score || 0}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                            <Clock size={8} />
                            <span>
                                {dateFormat === 'time'
                                    ? new Date(item.time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
                                    : new Date(item.time).toLocaleDateString([], { month: 'short', day: 'numeric' })
                                }
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default NewsCard;
