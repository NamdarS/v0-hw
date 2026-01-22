import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MonitorSmartphone, Calendar, User, ExternalLink } from 'lucide-react';
import { summarizeArticle } from '../services/gemini';

const SummaryModal = ({ isOpen, onClose, newsItem }) => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && newsItem) {
            setSummary('');
            setIsLoading(true);

            // Trigger summary generation
            const generate = async () => {
                const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
                console.log("Generating summary... Key exists?", !!apiKey);

                try {
                    // Build richer context
                    let context = `Title: ${newsItem.title}\n`;
                    if (newsItem.description) context += `Description: ${newsItem.description}\n`;
                    context += `Source: ${newsItem.source}\n`;
                    context += `URL: ${newsItem.url}`;

                    const result = await summarizeArticle(context);
                    setSummary(result);
                } catch (e) {
                    console.error("Summary Generation Error:", e);
                    setSummary("Could not generate summary.");
                } finally {
                    setIsLoading(false);
                }
            };
            generate();
        }
    }, [isOpen, newsItem]);

    return (
        <AnimatePresence>
            {isOpen && newsItem && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 40 }}
                            className="glass-effect w-full max-w-2xl rounded-2xl shadow-2xl pointer-events-auto flex flex-col max-h-[85vh] overflow-hidden border-white/40"
                        >
                            {/* Hero Image (if available) or Pattern */}
                            <div className="h-48 bg-slate-100 relative shrink-0">
                                {newsItem.image ? (
                                    <div className="absolute inset-0">
                                        <img src={newsItem.image} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100" />
                                )}

                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white text-slate-800 rounded-full backdrop-blur-md transition-colors border border-white/50 shadow-sm"
                                >
                                    <X size={20} />
                                </button>

                                <div className="absolute bottom-4 left-6 right-6">
                                    <div className="flex gap-2 mb-2">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded backdrop-blur-md border ${newsItem.image ? 'text-white border-white/30 bg-black/20' : 'text-slate-700 bg-white/60 border-slate-200'}`}>
                                            {(newsItem.categories && newsItem.categories[0]) || 'General'}
                                        </span>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded backdrop-blur-md flex items-center gap-1 border ${newsItem.image ? 'text-white border-white/30 bg-black/20' : 'text-slate-600 bg-white/60 border-slate-200'}`}>
                                            <MonitorSmartphone size={10} /> {newsItem.source}
                                        </span>
                                    </div>
                                    <h2 className={`text-2xl md:text-3xl font-bold leading-tight ${newsItem.image ? 'text-white drop-shadow-md' : 'text-slate-900'}`}>
                                        {newsItem.title}
                                    </h2>
                                    <div className={`flex items-center gap-4 text-xs mt-2 ${newsItem.image ? 'text-slate-200' : 'text-slate-500'}`}>
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} /> {new Date(newsItem.time).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User size={12} /> {newsItem.author}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Body */}
                            <div className="p-6 md:p-8 overflow-y-auto bg-white">
                                {/* AI Summary Section */}
                                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-6 shadow-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Sparkles className="text-indigo-600" size={18} />
                                        <span className="text-sm font-semibold text-indigo-900 uppercase tracking-wide">
                                            AI Summary
                                        </span>
                                    </div>

                                    {isLoading ? (
                                        <div className="space-y-3 animate-pulse">
                                            <div className="h-4 bg-indigo-200/50 rounded w-full"></div>
                                            <div className="h-4 bg-indigo-200/50 rounded w-11/12"></div>
                                            <div className="h-4 bg-indigo-200/50 rounded w-4/5"></div>
                                        </div>
                                    ) : (
                                        <div className="text-lg text-slate-800 leading-relaxed font-normal">
                                            {summary}
                                        </div>
                                    )}
                                </div>

                                {newsItem.description && (
                                    <div className="mb-6">
                                        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2">Original Snippet</h4>
                                        <p className="text-slate-600 italic font-serif leading-relaxed">"{newsItem.description}..."</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
                                <a
                                    href={newsItem.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md hover:shadow-indigo-500/20"
                                >
                                    Read Full Article <ExternalLink size={18} />
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SummaryModal;
