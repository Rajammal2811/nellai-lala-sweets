import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { useLanguage, LanguageMode } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { SHOP_INFO } from '../data/initialData';
import { 
  Menu as MenuIcon, 
  X, 
  QrCode, 
  UtensilsCrossed, 
  Home, 
  ShieldCheck, 
  Languages,
  PhoneCall
} from 'lucide-react';
import { QRCodeModal } from './QRCodeModal';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 text-white shadow-lg border-b border-gold-500/30 backdrop-blur-sm bg-opacity-95">
        {/* Subtle decorative gold line on top */}
        <div className="h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 w-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left: Original Logo & Brand Name */}
            <Link to="/" className="flex items-center gap-3 group py-1">
              <Logo size="md" />
              <div className="hidden sm:block text-left">
                <div className="text-[11px] text-gold-300 font-semibold tracking-wide">
                  ஸ்ரீ முருகன் விலாஸ்
                </div>
                <div className="font-tamil font-bold text-white text-base leading-tight group-hover:text-gold-300 transition-colors">
                  {SHOP_INFO.name_ta}
                </div>
                <div className="font-serif font-bold text-gold-400 tracking-wider text-xs uppercase leading-snug">
                  {SHOP_INFO.name_en}
                </div>
                <div className="text-[10px] text-stone-300 tracking-wider">
                  {SHOP_INFO.location_en}
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  isActive('/') 
                    ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-sm' 
                    : 'text-stone-200 hover:text-gold-300 hover:bg-burgundy-800/40'
                }`}
              >
                <Home className="w-4 h-4 text-gold-400" />
                <span>Home / முகப்பு</span>
              </Link>

              <Link
                to="/menu"
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  isActive('/menu')
                    ? 'bg-gold-500 text-burgundy-950 shadow-md font-bold'
                    : 'text-stone-100 bg-burgundy-800/60 hover:bg-gold-500/20 hover:text-gold-300 border border-gold-500/30'
                }`}
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Menu / மெனு</span>
              </Link>

              {/* QR Code Action Button */}
              <button
                onClick={() => setQrModalOpen(true)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-stone-200 hover:text-gold-300 hover:bg-burgundy-800/50 transition-colors flex items-center gap-1.5"
                title="View & Download Shop Menu QR Code"
              >
                <QrCode className="w-4 h-4 text-gold-400" />
                <span>QR Code</span>
              </button>

              {/* Admin Dashboard / Login */}
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  isActive('/admin') || isActive('/admin/dashboard')
                    ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40'
                    : 'text-stone-300 hover:text-gold-300 hover:bg-burgundy-800/40'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>{isAdmin ? 'Owner Panel' : 'Owner Login'}</span>
              </Link>
            </nav>

            {/* Language Preference & Mobile Menu Button */}
            <div className="flex items-center gap-2">
              {/* Language Selector Pill */}
              <div className="relative flex items-center bg-burgundy-900/80 border border-gold-500/30 rounded-lg p-0.5 text-xs font-medium">
                <Languages className="w-3.5 h-3.5 text-gold-400 ml-2 mr-1" />
                <button
                  type="button"
                  onClick={() => setLanguage('all')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    language === 'all'
                      ? 'bg-gold-500 text-burgundy-950 font-bold'
                      : 'text-stone-300 hover:text-white'
                  }`}
                  title="Show Tamil & English together"
                >
                  Both
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('ta')}
                  className={`px-2 py-1 rounded-md transition-colors font-tamil ${
                    language === 'ta'
                      ? 'bg-gold-500 text-burgundy-950 font-bold'
                      : 'text-stone-300 hover:text-white'
                  }`}
                  title="தமிழ் மட்டும்"
                >
                  தமிழ்
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    language === 'en'
                      ? 'bg-gold-500 text-burgundy-950 font-bold'
                      : 'text-stone-300 hover:text-white'
                  }`}
                  title="English only"
                >
                  EN
                </button>
              </div>

              {/* Mobile QR Quick Button */}
              <button
                onClick={() => setQrModalOpen(true)}
                className="md:hidden p-2 rounded-lg bg-burgundy-800/60 border border-gold-500/30 text-gold-400 hover:text-gold-300"
                aria-label="Menu QR Code"
              >
                <QrCode className="w-5 h-5" />
              </button>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-stone-200 hover:text-white hover:bg-burgundy-800/60 focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-burgundy-950 border-b border-gold-500/40 px-4 pt-3 pb-5 space-y-2 animate-fadeIn">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive('/') ? 'bg-gold-500 text-burgundy-950 font-bold' : 'text-stone-200 hover:bg-burgundy-900'
              }`}
            >
              <Home className="w-5 h-5 text-gold-400" />
              <span>Home / முகப்பு</span>
            </Link>

            <Link
              to="/menu"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive('/menu') ? 'bg-gold-500 text-burgundy-950 font-bold' : 'text-stone-200 hover:bg-burgundy-900'
              }`}
            >
              <UtensilsCrossed className="w-5 h-5 text-gold-400" />
              <span>Digital Menu / மெனு</span>
            </Link>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setQrModalOpen(true);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-stone-200 hover:bg-burgundy-900 text-left"
            >
              <QrCode className="w-5 h-5 text-gold-400" />
              <span>QR Code Scanner & Print Stand</span>
            </button>

            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive('/admin') ? 'bg-gold-500 text-burgundy-950 font-bold' : 'text-stone-200 hover:bg-burgundy-900'
              }`}
            >
              <ShieldCheck className="w-5 h-5 text-gold-400" />
              <span>{isAdmin ? 'Owner Admin Panel' : 'Shop Owner Login'}</span>
            </Link>

            <div className="pt-2 border-t border-gold-500/20 text-xs text-stone-300 flex items-center gap-2 px-3">
              <PhoneCall className="w-3.5 h-3.5 text-gold-400" />
              <span>{SHOP_INFO.phone} / {SHOP_INFO.phone_secondary}</span>
            </div>
          </div>
        )}
      </header>

      {/* QR Code Modal */}
      <QRCodeModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} />
    </>
  );
};
