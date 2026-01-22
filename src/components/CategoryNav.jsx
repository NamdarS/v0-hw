import { CATEGORIES, CATEGORY_COLORS } from '../services/aggregator';

const CategoryNav = ({ selected, onSelect }) => {
    return (
        <div className="flex gap-2 overflow-x-auto pb-4 pt-2 scrollbar-hide">
            {CATEGORIES.map((category) => {
                const activeStyle = CATEGORY_COLORS[category] || CATEGORY_COLORS.General;

                return (
                    <button
                        key={category}
                        onClick={() => onSelect(category)}
                        className={`relative px-4 py-1.5 rounded-full text-xs font-extrabold transition-all duration-300 whitespace-nowrap outline-none hover:scale-105 active:scale-95
                            ${selected === category
                                ? activeStyle + ' shadow-lg shadow-indigo-200/50 glow-indigo ring-1 ring-white/50'
                                : 'glass-pill text-slate-500 hover:text-indigo-600 hover:bg-white'
                            }`}
                    >
                        {category}
                    </button>
                );
            })}
        </div>
    );
};

export default CategoryNav;
