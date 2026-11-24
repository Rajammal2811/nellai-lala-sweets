import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMenu } from '../context/MenuContext';
import { useLanguage } from '../context/LanguageContext';
import { CategoryBar } from '../components/CategoryBar';
import { ProductCard } from '../components/ProductCard';
import { QRCodeModal } from '../components/QRCodeModal';
import { SHOP_INFO } from '../data/initialData';
import { 
  Search, 
  X, 
  Filter, 
  Sparkles, 
  QrCode, 
  CheckCircle2, 
  Info,
  RefreshCw
} from 'lucide-react';

export const MenuPage: React.FC = () => {
  const { 
    categories, 
    products, 
    isLoading, 
    isSyncing,
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    availabilityFilter,
    setAvailabilityFilter,
    refreshData 
  } = useMenu();

  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Sync category from URL search params if present (e.g. ?category=sweets)
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setSelectedCategory(catParam);
    }
  }, [searchParams, setSelectedCategory]);

  // Filter products based on search query, category selection, and availability
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category match
      if (selectedCategory !== 'all' && product.category_id !== selectedCategory) {
        return false;
      }

      // Availability filter
      if (availabilityFilter === 'available_only' && !product.is_available) {
        return false;
      }

      // Search match (Tamil name, English name, or category name)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesEn = product.name_en.toLowerCase().includes(query);
        const matchesTa = product.name_ta.toLowerCase().includes(query);
        const matchesDesc = product.description_en?.toLowerCase().includes(query) || product.description_ta?.toLowerCase().includes(query);
        return matchesEn || matchesTa || matchesDesc;
      }

      return true;
    });
  }, [products, selectedCategory, availabilityFilter, searchQuery]);

  // Current selected category object for context banner
  const currentCategoryObj = categories.find(c => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24">
      
      {/* ======================================================== */}
      {/* 1. MENU HERO BANNER                                       */}
      {/* ======================================================== */}
      <section className="bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 text-white py-10 px-4 sm:px-6 lg:px-8 border-b-2 border-gold-500/40 relative">
        <div className="max-w-7xl mx-auto text-center space-y-2">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/20 text-gold-300 border border-gold-500/30">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Official QR Digital Menu • நேரடி டிஜிட்டல் மெனு</span>
          </div>

          <h1 className="font-tamil font-extrabold text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-300 to-gold-100">
            எங்கள் இனிப்பு & கார வகைகள்
          </h1>

          <p className="font-serif font-bold text-lg sm:text-xl text-stone-200">
            {SHOP_INFO.name_en} • {SHOP_INFO.location_en}
          </p>

          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto font-tamil">
            6 பாரம்பரிய தயாரிப்பு பிரிவுகள் • நேரடி கடை இருப்பு & விலைப்பட்டியல்
          </p>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. STICKY CATEGORIES BAR (EXACT 6 CATEGORIES)            */}
      {/* ======================================================== */}
      <CategoryBar />

      {/* ======================================================== */}
      {/* 3. SEARCH & FILTERS BAR                                   */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Live Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search sweets, savories, chips (தேடுங்கள்)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:bg-white transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Availability Toggle and Refresh Sync */}
          <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3">
            
            {/* Availability Filter Pill */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAvailabilityFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  availabilityFilter === 'all'
                    ? 'bg-burgundy-900 text-gold-300 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All Items ({products.length})
              </button>
              <button
                type="button"
                onClick={() => setAvailabilityFilter('available_only')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  availabilityFilter === 'available_only'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Available Now</span>
              </button>
            </div>

            {/* Live Refresh Button */}
            <button
              onClick={() => refreshData()}
              disabled={isSyncing}
              className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
              title="Refresh menu data"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-gold-600' : ''}`} />
            </button>

            {/* QR Modal Trigger */}
            <button
              onClick={() => setQrModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-burgundy-950 text-gold-300 hover:bg-burgundy-900 text-xs font-semibold border border-gold-500/40"
            >
              <QrCode className="w-4 h-4 text-gold-400" />
              <span>Table QR</span>
            </button>

          </div>
        </div>

        {/* Selected Category Banner Info */}
        {currentCategoryObj && (
          <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-burgundy-950/90 to-burgundy-900/90 text-white border border-gold-500/30 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-tamil font-bold text-xl text-gold-300">
                  {currentCategoryObj.name_ta}
                </span>
                <span className="text-stone-300 text-base font-serif">
                  ({currentCategoryObj.name_en})
                </span>
              </div>
              <p className="font-tamil text-xs text-stone-300 mt-0.5">
                {currentCategoryObj.description_ta}
              </p>
            </div>
            
            <div className="bg-gold-500 text-burgundy-950 px-3.5 py-1.5 rounded-xl font-bold font-mono text-sm shrink-0 shadow-md">
              Category Standard: ₹{currentCategoryObj.default_price} / {currentCategoryObj.unit}
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 4. PRODUCTS GRID                                          */}
      {/* ======================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {isLoading ? (
          /* Loading Skeleton */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-stone-200 animate-pulse space-y-3">
                <div className="aspect-[4/3] bg-stone-200 rounded-xl" />
                <div className="h-5 bg-stone-200 rounded w-3/4" />
                <div className="h-4 bg-stone-200 rounded w-1/2" />
                <div className="h-6 bg-stone-200 rounded w-1/3 pt-2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty Results View */
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-lg mx-auto shadow-sm my-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center mx-auto">
              <Filter className="w-8 h-8" />
            </div>
            <h3 className="font-tamil font-bold text-xl text-burgundy-950">
              தயாரிப்புகள் எதுவும் கிடைக்கவில்லை
            </h3>
            <p className="text-stone-500 text-sm">
              No products found matching "{searchQuery}". Try searching for another item or clear your filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setAvailabilityFilter('all');
              }}
              className="px-5 py-2.5 rounded-xl bg-burgundy-900 text-gold-300 font-semibold text-sm hover:bg-burgundy-800 transition-colors"
            >
              Reset Filters / அனைத்து பொருட்களையும் காட்டு
            </button>
          </div>
        ) : (
          /* Real Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* View-Only Digital Menu Reminder Banner */}
        <div className="mt-14 p-5 rounded-2xl bg-white border border-gold-500/30 shadow-sm text-center max-w-2xl mx-auto space-y-1">
          <div className="text-xs font-bold text-burgundy-900 font-tamil flex items-center justify-center gap-1.5">
            <Info className="w-4 h-4 text-gold-600" />
            <span>நேரடி கடையில் கிடைக்கும் புத்தம் புதிய இனிப்புகள்</span>
          </div>
          <p className="text-xs text-stone-500">
            This digital QR menu displays our live shop availability and category prices. Visit Nellai Lala Sweets, Vedasandur for purchases.
          </p>
        </div>

      </main>

      {/* Floating QR Quick Button for Mobile */}
      <button
        onClick={() => setQrModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-burgundy-950 shadow-gold-glow hover:scale-110 transition-transform sm:hidden border-2 border-burgundy-950"
        aria-label="Shop Menu QR Code"
      >
        <QrCode className="w-6 h-6" />
      </button>

      {/* QR Code Modal */}
      <QRCodeModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} />

    </div>
  );
};
