import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { useMenu } from '../context/MenuContext';
import { useLanguage } from '../context/LanguageContext';
import { SHOP_INFO } from '../data/initialData';
import { ProductCard } from '../components/ProductCard';
import { QRCodeModal } from '../components/QRCodeModal';
import { 
  UtensilsCrossed, 
  QrCode, 
  Sparkles, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Flame, 
  Award, 
  HeartHandshake,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { categories, products } = useMenu();
  const { language } = useLanguage();
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Featured products highlight (e.g. Milk Sweets & Ghee Sweets)
  const featuredProducts = products.filter(p => p.is_featured).slice(0, 6);

  return (
    <div className="min-h-screen">
      
      {/* ======================================================== */}
      {/* 1. HERO SECTION - Premium Burgundy & Gold Aesthetic       */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-burgundy-950 via-burgundy-900 to-[#380914] text-white py-14 sm:py-20 border-b-4 border-gold-500/50">
        
        {/* Subtle Decorative Pattern Background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Ambient Gold Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gold-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Logo Container with Strict Rule Enforcement */}
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-burgundy-950/80 rounded-2xl border-2 border-gold-500/60 shadow-gold-glow backdrop-blur-md">
              <Logo size="lg" showPlaceholderNotice={true} />
            </div>
          </div>

          {/* Shop Name In Tamil & English */}
          <div className="space-y-2 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs sm:text-sm font-semibold bg-gold-500/20 text-gold-300 border border-gold-400/40 mb-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>வேடசந்தூர் • Vedasandur, Tamil Nadu</span>
            </div>

            <h1 className="font-tamil font-extrabold text-3xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 tracking-tight leading-tight">
              {SHOP_INFO.name_ta}
            </h1>

            <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-white tracking-widest uppercase">
              {SHOP_INFO.name_en}
            </h2>
          </div>

          {/* Welcome Message */}
          <div className="mt-5 max-w-2xl mx-auto space-y-2">
            <p className="font-tamil text-stone-200 text-base sm:text-lg leading-relaxed font-medium">
              {SHOP_INFO.tagline_ta}
            </p>
            <p className="text-xs sm:text-sm text-gold-200/90 font-serif italic">
              "Experience the regal heritage of pure cow ghee sweets, traditional savories, and daily freshly handcrafted delicacies."
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/menu"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-burgundy-950 font-extrabold text-base sm:text-lg shadow-xl hover:shadow-gold-glow transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105"
            >
              <UtensilsCrossed className="w-5 h-5 text-burgundy-950" />
              <span>Browse Digital Menu • மெனு</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setQrModalOpen(true)}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-burgundy-950/80 hover:bg-burgundy-800 text-gold-300 font-bold text-sm sm:text-base border border-gold-500/50 shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-105"
            >
              <QrCode className="w-5 h-5 text-gold-400" />
              <span>Scan / Print Shop QR Code</span>
            </button>
          </div>

          {/* Quick Badges */}
          <div className="mt-10 pt-8 border-t border-gold-500/20 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-stone-300">
            <div className="flex items-center justify-center gap-2">
              <Award className="w-4 h-4 text-gold-400 shrink-0" />
              <span>100% தூய நெய்</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Flame className="w-4 h-4 text-gold-400 shrink-0" />
              <span>தினசரி புத்துணர்ச்சி</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <HeartHandshake className="w-4 h-4 text-gold-400 shrink-0" />
              <span>பாரம்பரிய சுவை</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
              <span>உயர்தர தரம்</span>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. CATEGORIES OVERVIEW GRID (With Section 5 Prices)       */}
      {/* ======================================================== */}
      <section className="py-14 sm:py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold uppercase tracking-widest text-burgundy-800 font-serif">
              Our Specialties • எங்கள் வகைகள்
            </div>
            <h2 className="font-tamil font-bold text-2xl sm:text-4xl text-burgundy-950 mt-1">
              தயாரிப்பு பிரிவுகள் & நிலையான விலைகள்
            </h2>
            <p className="text-stone-600 text-sm mt-2">
              All categories prepared freshly with authentic recipes and transparent per-kg pricing.
            </p>
          </div>

          {/* Category Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat, idx) => (
              <Link
                key={cat.id}
                to={`/menu?category=${cat.id}`}
                className="group relative bg-white rounded-2xl p-6 border border-stone-200/90 hover:border-gold-500 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
              >
                {/* Top Corner Accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gold-100 to-transparent rounded-bl-3xl -z-0" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-gold-700 bg-gold-50 px-2 py-0.5 rounded-full border border-gold-200">
                      0{idx + 1}
                    </span>
                    <span className="font-mono font-bold text-lg text-burgundy-900 bg-burgundy-50 px-3 py-1 rounded-xl border border-burgundy-100">
                      ₹{cat.default_price} <span className="text-xs text-stone-500 font-normal">/ {cat.unit}</span>
                    </span>
                  </div>

                  <h3 className="font-tamil font-bold text-xl text-burgundy-950 group-hover:text-burgundy-700 transition-colors">
                    {cat.name_ta}
                  </h3>
                  <h4 className="font-serif font-semibold text-stone-700 text-sm mt-0.5">
                    {cat.name_en}
                  </h4>

                  <p className="font-tamil text-xs text-stone-500 mt-2 leading-relaxed">
                    {cat.description_ta}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-gold-800 group-hover:text-gold-600">
                  <span>View Items →</span>
                  <Sparkles className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. FEATURED PRODUCTS & MILK SWEETS SPOTLIGHT              */}
      {/* ======================================================== */}
      <section className="py-14 sm:py-20 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-gold-700">
                Fresh Daily Specialties • இன்றைய சிறப்பு
              </div>
              <h2 className="font-tamil font-bold text-2xl sm:text-3xl text-burgundy-950 mt-1">
                பால்கோவா, சாக்லேட் ரோல் & கோவா ரோல்
              </h2>
              <p className="text-stone-600 text-sm mt-1">
                Delicious pure condensed milk sweets and signature favorites prepared with farm-fresh milk.
              </p>
            </div>

            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-burgundy-950 text-gold-300 font-semibold text-sm hover:bg-burgundy-900 border border-gold-500/40 transition-all shrink-0 self-start md:self-auto"
            >
              <span>View All Menu Items</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. SHOP LOCATION & CONTACT INFORMATION                   */}
      {/* ======================================================== */}
      <section className="py-14 sm:py-20 bg-gradient-to-b from-[#FAF7F2] to-[#F3EDE2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-gold-500/30 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              
              {/* Left Column: Details */}
              <div className="space-y-6">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-burgundy-100 text-burgundy-900 border border-burgundy-200">
                    Visit Our Vedasandur Shop
                  </span>
                  <h3 className="font-tamil font-bold text-2xl sm:text-3xl text-burgundy-950 mt-3">
                    {SHOP_INFO.name_ta} – நேரடி கடை முகவரி
                  </h3>
                  <p className="font-serif font-bold text-stone-700 text-lg">
                    {SHOP_INFO.name_en}, Vedasandur
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-burgundy-900 text-gold-300 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 text-sm">Shop Address:</div>
                      <p className="font-tamil text-stone-700 text-sm mt-0.5">{SHOP_INFO.address_ta}</p>
                      <p className="text-stone-500 text-xs mt-0.5">{SHOP_INFO.address_en}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-burgundy-900 text-gold-300 shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 text-sm">Phone Inquiries:</div>
                      <div className="flex flex-wrap gap-3 mt-1">
                        <a 
                          href={`tel:${SHOP_INFO.phone}`}
                          className="font-mono text-sm font-bold text-burgundy-900 hover:text-gold-700"
                        >
                          {SHOP_INFO.phone}
                        </a>
                        {SHOP_INFO.phone_secondary && (
                          <a 
                            href={`tel:${SHOP_INFO.phone_secondary}`}
                            className="font-mono text-sm font-bold text-burgundy-900 hover:text-gold-700"
                          >
                            {SHOP_INFO.phone_secondary}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-burgundy-900 text-gold-300 shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 text-sm">Shop Operating Hours:</div>
                      <p className="text-stone-700 text-sm font-medium">{SHOP_INFO.timing_en}</p>
                      <p className="font-tamil text-stone-500 text-xs">{SHOP_INFO.timing_ta}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href={SHOP_INFO.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-xl bg-burgundy-900 hover:bg-burgundy-800 text-gold-300 font-semibold text-sm flex items-center gap-2 shadow-md transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Get Directions on Google Maps</span>
                  </a>

                  <button
                    onClick={() => setQrModalOpen(true)}
                    className="px-5 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-burgundy-950 font-bold text-sm flex items-center gap-2 shadow-md transition-colors"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Open Shop QR Code</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Decorative Visual Card */}
              <div className="relative rounded-2xl overflow-hidden bg-burgundy-950 p-8 text-center text-white border-2 border-gold-500/40">
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex justify-center">
                    <Logo size="md" showPlaceholderNotice={false} />
                  </div>

                  <h4 className="font-tamil font-bold text-xl text-gold-300">
                    சுத்தமான இனிப்புகள் & கார வகைகள்
                  </h4>
                  <p className="text-xs text-stone-300 leading-relaxed max-w-sm mx-auto">
                    விசேஷங்கள், திருமணங்கள் மற்றும் பண்டிகைகளுக்கான அனைத்து ஸ்வீட்ஸ் மற்றும் கார வகைகள் மொத்தமாகவும் சில்லறையாகவும் கிடைக்கும்.
                  </p>

                  <div className="pt-4 border-t border-gold-500/30 flex items-center justify-center gap-4 text-xs text-gold-200">
                    <span>★ தூய நெய்</span>
                    <span>★ தரமான முந்திரி</span>
                    <span>★ பாரம்பரிய சுவை</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* QR Code Modal */}
      <QRCodeModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} />

    </div>
  );
};
