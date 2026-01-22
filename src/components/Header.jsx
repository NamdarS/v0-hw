import { Newspaper, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-50 glass-effect border-b border-white/20 shadow-sm"
        >
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="relative group cursor-pointer">
                        <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full"></div>
                        <Newspaper className="w-6 h-6 text-indigo-600 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
                    </div>
                    <h1 className="text-xl font-extrabold tracking-tight text-gradient">
                        TechPulse
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-700 bg-indigo-50/50 px-2.5 py-1 rounded-full border border-indigo-100/50 shadow-sm backdrop-blur-sm">
                        <Zap size={10} className="text-orange-500" fill="currentColor" />
                        <span className="tracking-widest">LIVE PULSE</span>
                    </div>
                </div>
            </div>
        </motion.header>
    );
};

export default Header;
