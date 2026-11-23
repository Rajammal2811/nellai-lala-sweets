import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { SHOP_INFO } from '../data/initialData';
import { MapPin, Phone, Clock, QrCode, Shield, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-burgundy-950 via-[#31060F] to-[#20030A] text-stone-300 border-t-2 border-gold-500/40 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-gold-500/20">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Logo size="md" showPlaceholderNotice={true} />
            <p className="font-tamil text-gold-300 font-semibold text-sm">
              {SHOP_INFO.name_ta}
            </p>
            <p className="text-xs text-stone-300 leading-relaxed">
              {SHOP_INFO.tagline_ta}
            </p>
            <p className="text-xs text-stone-400 leading-relaxed font-serif italic">
              "Authentic heritage recipes prepared daily with utmost purity and care."
            </p>
          </div>

          {/* Contact & Address */}
          <div className="space-y-3">
            <h4 className="text-gold-400 font-serif font-bold text-sm tracking-wider uppercase flex items-center gap-1.5 border-b border-gold-500/30 pb-1.5">
              <MapPin className="w-4 h-4" />
              Shop Location / முகவரி
            </h4>
            <div className="text-xs space-y-2 text-stone-300">
              <p className="font-tamil leading-relaxed">
                {SHOP_INFO.address_ta}
              </p>
              <p className="text-stone-400 leading-relaxed">
                {SHOP_INFO.address_en}
              </p>
              <a
                href={SHOP_INFO.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-gold-400 hover:text-gold-300 text-xs font-medium underline mt-1"
              >
                View on Google Maps →
              </a>
            </div>
          </div>

          {/* Timings & Contact */}
          <div className="space-y-3">
            <h4 className="text-gold-400 font-serif font-bold text-sm tracking-wider uppercase flex items-center gap-1.5 border-b border-gold-500/30 pb-1.5">
              <Clock className="w-4 h-4" />
              Timings & Phone / தொடர்பு
            </h4>
            <div className="text-xs space-y-2.5">
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-gold-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-white">{SHOP_INFO.timing_en}</p>
                  <p className="font-tamil text-stone-400">{SHOP_INFO.timing_ta}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-gold-400 mt-0.5 shrink-0" />
                <div>
                  <a href={`tel:${SHOP_INFO.phone}`} className="text-white hover:text-gold-300 font-medium block">
                    {SHOP_INFO.phone}
                  </a>
                  {SHOP_INFO.phone_secondary && (
                    <a href={`tel:${SHOP_INFO.phone_secondary}`} className="text-stone-400 hover:text-gold-300 block">
                      {SHOP_INFO.phone_secondary}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* QR Digital Menu & Admin Link */}
          <div className="space-y-3">
            <h4 className="text-gold-400 font-serif font-bold text-sm tracking-wider uppercase flex items-center gap-1.5 border-b border-gold-500/30 pb-1.5">
              <QrCode className="w-4 h-4" />
              Digital Menu
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Scan our in-shop QR code from any smartphone to view today's fresh sweets, savories, and daily pricing without waiting.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/menu"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-500/40 text-xs font-semibold transition-all"
              >
                Browse Menu Online →
              </Link>
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 text-[11px] text-stone-400 hover:text-gold-400 transition-colors"
              >
                <Shield className="w-3 h-3 text-gold-500" />
                <span>Shop Owner Login Portal</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} Nellai Lala Sweets, Vedasandur. All Rights Reserved.</p>
          <p className="flex items-center gap-1 text-[11px] text-stone-400">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-gold-400 fill-gold-400" />
            <span>for Nellai Lala Sweets Traditional Heritage</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
