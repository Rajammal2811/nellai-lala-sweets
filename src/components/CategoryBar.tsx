import React from 'react';
import { useMenu } from '../context/MenuContext';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles } from 'lucide-react';

export const CategoryBar: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory } = useMenu();
  const { language } = useLanguage();

  return (
    <div className="sticky top-20 z-30 bg-[#FAF7F2]/95 backdrop-blur-md py-3 border-b border-stone-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          
          {/* "All Items" tab */}
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-burgundy-900 text-gold-300 shadow-md ring-2 ring-gold-400/50'
                : 'bg-white text-stone-700 hover:bg-cream-100 border border-stone-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            <span>
              {language === 'ta' ? 'அனைத்தும்' : language === 'en' ? 'All Items' : 'அனைத்தும் / All'}
            </span>
          </button>

          {/* Dynamic Categories */}
          {categories.map(category => {
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-burgundy-900 text-gold-300 shadow-md ring-2 ring-gold-400/50 scale-[1.02]'
                    : 'bg-white text-stone-700 hover:bg-cream-100 border border-stone-300'
                }`}
              >
                <span>
                  {language === 'ta' 
                    ? category.name_ta 
                    : language === 'en' 
                    ? category.name_en 
                    : `${category.name_ta} (${category.name_en})`}
                </span>
                
                {/* Category Price Badge */}
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-full font-mono font-medium ${
                    isSelected
                      ? 'bg-gold-500 text-burgundy-950 font-bold'
                      : 'bg-stone-100 text-stone-600 border border-stone-200'
                  }`}
                >
                  ₹{category.default_price}/kg
                </span>
              </button>
            );
          })}

        </div>
      </div>
    </div>
  );
};
