import React, { useState } from 'react';
import { Product } from '../types';
import { useMenu } from '../context/MenuContext';
import { CheckCircle2, XCircle, Info, Sparkles, X } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { categories } = useMenu();
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const category = categories.find(c => c.id === product.category_id);

  // Fallback placeholder image if image link fails or is blank
  const displayImage = !imageError && product.image_url 
    ? product.image_url 
    : 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80';

  return (
    <>
      <div 
        onClick={() => setDetailModalOpen(true)}
        className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col cursor-pointer ${
          product.is_available
            ? 'border-stone-200/90 hover:border-gold-400 hover:shadow-card-hover hover:-translate-y-1'
            : 'border-stone-200 bg-stone-50/70 opacity-85 hover:border-stone-400'
        }`}
      >
        {/* Top Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
          <img
            src={displayImage}
            alt={`${product.name_en} - ${product.name_ta}`}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
              !product.is_available ? 'grayscale-[40%]' : ''
            }`}
            loading="lazy"
          />

          {/* Gradient Overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            {/* Category Pill */}
            {category && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-burgundy-950/85 text-gold-300 backdrop-blur-sm border border-gold-500/30 shadow-sm">
                {category.name_ta}
              </span>
            )}

            {/* Featured Badge if applicable */}
            {product.is_featured && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-500 text-burgundy-950 flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 fill-burgundy-950" />
                Special
              </span>
            )}
          </div>

          {/* Availability Status Badge (Prominent overlay on image bottom-right) */}
          <div className="absolute bottom-3 right-3 pointer-events-none">
            {product.is_available ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600/90 text-white backdrop-blur-sm shadow-md border border-emerald-400/40">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>கிடைக்கும் • Available</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-700/95 text-white backdrop-blur-sm shadow-md border border-red-400/40">
                <XCircle className="w-3.5 h-3.5" />
                <span>தற்போது இல்லை • Unavailable</span>
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Tamil Name (Prominent & primary) */}
            <h3 className="font-tamil font-bold text-lg sm:text-xl text-burgundy-950 group-hover:text-burgundy-700 transition-colors leading-snug">
              {product.name_ta}
            </h3>

            {/* English Name */}
            <p className="font-serif font-semibold text-stone-700 text-sm sm:text-base mt-0.5 tracking-wide">
              {product.name_en}
            </p>

            {/* Short Description */}
            {product.description_ta && (
              <p className="font-tamil text-xs text-stone-500 line-clamp-2 mt-2 leading-relaxed">
                {product.description_ta}
              </p>
            )}
          </div>

          {/* Price Bar & Status */}
          <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-stone-500 uppercase tracking-wider font-medium">
                Price / விலை
              </div>
              <div className="flex items-baseline gap-1 text-burgundy-900 font-extrabold">
                <span className="text-xl sm:text-2xl font-mono">₹{product.price}</span>
                <span className="text-xs text-stone-600 font-normal">/ {product.unit || '1 kg'}</span>
              </div>
            </div>

            {/* Tap for info cue */}
            <div className="text-gold-700 group-hover:text-gold-600 p-2 rounded-full group-hover:bg-gold-50 transition-colors">
              <Info className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {detailModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setDetailModalOpen(false)}
        >
          <div 
            className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-2 border-gold-500/40 animate-scaleUp"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setDetailModalOpen(false)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="relative aspect-[16/10] w-full bg-stone-900">
              <img
                src={displayImage}
                alt={product.name_en}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Availability Banner in Modal */}
              <div className="absolute bottom-3 left-4">
                {product.is_available ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-md">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>கிடைக்கும் • Available in Shop</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-700 text-white shadow-md">
                    <XCircle className="w-4 h-4" />
                    <span>தற்போது இருப்பில் இல்லை • Currently Unavailable</span>
                  </span>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-gold-700">
                  {category?.name_en} • {category?.name_ta}
                </div>
                <h2 className="font-tamil font-bold text-2xl text-burgundy-950 mt-1">
                  {product.name_ta}
                </h2>
                <h3 className="font-serif font-bold text-lg text-stone-700">
                  {product.name_en}
                </h3>
              </div>

              {/* Descriptions */}
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80 space-y-2">
                {product.description_ta && (
                  <p className="font-tamil text-sm text-stone-700 leading-relaxed">
                    {product.description_ta}
                  </p>
                )}
                {product.description_en && (
                  <p className="text-xs text-stone-600 leading-relaxed italic">
                    "{product.description_en}"
                  </p>
                )}
              </div>

              {/* Price & Notice */}
              <div className="flex items-center justify-between p-4 bg-burgundy-50 rounded-xl border border-burgundy-100">
                <div>
                  <div className="text-xs text-stone-500 font-medium">விலை / Price</div>
                  <div className="text-2xl font-bold font-mono text-burgundy-950">
                    ₹{product.price} <span className="text-sm font-normal text-stone-600">/ {product.unit}</span>
                  </div>
                </div>
                <div className="text-right text-xs text-stone-500">
                  <div>Nellai Lala Sweets</div>
                  <div className="text-gold-700 font-semibold">Vedasandur, TN</div>
                </div>
              </div>

              {/* Digital Menu Information Note */}
              <div className="text-[11px] text-center text-stone-400">
                View-only digital QR menu • Visit our shop in Vedasandur for purchases.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
