import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageMode = 'all' | 'ta' | 'en';

interface LanguageContextType {
  language: LanguageMode;
  setLanguage: (lang: LanguageMode) => void;
  t: (key: string) => string;
}

const translations: Record<string, { en: string; ta: string }> = {
  // Navigation & General
  'nav.home': { en: 'Home', ta: 'முகப்பு' },
  'nav.menu': { en: 'Digital Menu', ta: 'டிஜிட்டல் மெனு' },
  'nav.qr': { en: 'QR Code', ta: 'க்யூஆர் கோட்' },
  'nav.admin': { en: 'Owner Admin', ta: 'நிர்வாகம்' },
  'nav.contact': { en: 'Contact', ta: 'தொடர்பு' },

  // Hero Section
  'hero.welcome': { en: 'Welcome to Nellai Lala Sweets', ta: 'நெல்லை லாலா ஸ்வீட்ஸுக்கு நல்வரவு' },
  'hero.subtitle': { en: 'Authentic Traditional Taste & Freshness Since Inception', ta: 'தூய நெய்யும் தரமான பொருட்களும் கொண்டு பாரம்பரிய சுவையுடன் தயாரிக்கப்படும் இனிப்புகள்' },
  'hero.browse_menu': { en: 'Explore Today\'s Fresh Menu', ta: 'இன்றைய மெனுவை பாருங்கள்' },
  'hero.view_qr': { en: 'Get Menu QR Code', ta: 'மெனு QR கோட்' },
  'hero.location': { en: 'Vedasandur, Tamil Nadu', ta: 'வேடசந்தூர், தமிழ்நாடு' },

  // Menu Page
  'menu.title': { en: 'Our Traditional Menu', ta: 'எங்கள் இனிப்பு & கார வகைகள்' },
  'menu.subtitle': { en: 'Freshly prepared daily with pure cow ghee and the finest ingredients', ta: 'தினசரி பசு நெய்யில் சுத்தமாகவும் சுவையாகவும் தயாரிக்கப்படுகிறது' },
  'menu.all_categories': { en: 'All Items', ta: 'அனைத்தும்' },
  'menu.search_placeholder': { en: 'Search sweets, savories, chips...', ta: 'ஸ்வீட்ஸ், கார வகைகளை தேடுங்கள்...' },
  'menu.filter_available': { en: 'Available Now Only', ta: 'இருப்பில் உள்ளவை மட்டும்' },
  'menu.filter_all': { en: 'Show All Items', ta: 'அனைத்தையும் காட்டு' },
  'menu.no_items': { en: 'No products found matching your search.', ta: 'நீங்கள் தேடிய தயாரிப்புகள் எதுவும் கிடைக்கவில்லை.' },
  'menu.category_price_note': { en: 'Category Standard Price', ta: 'பிரிவு நிலையான விலை' },

  // Product Card
  'product.available': { en: 'Available', ta: 'கிடைக்கும்' },
  'product.unavailable': { en: 'Currently Unavailable', ta: 'தற்போது இல்லை' },
  'product.per_kg': { en: 'per kg', ta: 'கிலோவுக்கு' },
  'product.quick_view': { en: 'Details', ta: 'விவரம்' },

  // QR Modal
  'qr.title': { en: 'Scan QR for Live Digital Menu', ta: 'மெனுவை பார்க்க QR ஸ்கேன் செய்யவும்' },
  'qr.instructions': { en: 'Scan this QR code with any smartphone camera to view today\'s updated menu and prices.', ta: 'எந்தவொரு ஸ்மார்ட்போன் கேமரா மூலமும் இந்த QR கோடை ஸ்கேன் செய்து இன்றைய மெனு மற்றும் விலைகளை உடனடியாக காணலாம்.' },
  'qr.no_login_needed': { en: 'No app or login required. Live sync with shop updates.', ta: 'உள்நுழைவு தேவையில்லை. கடை புதுப்பிப்புகளுடன் உடனுக்குடன் மாறும்.' },
  'qr.download_png': { en: 'Download Print Stand (PNG)', ta: 'அச்சிட பதிவிறக்கு (PNG)' },
  'qr.print_stand': { en: 'Print Stand Card', ta: 'ஸ்டாண்ட் அச்சிடு' },

  // Footer & Contact
  'footer.about_title': { en: 'Nellai Lala Sweets', ta: 'நெல்லை லாலா ஸ்வீட்ஸ்' },
  'footer.about_desc': { en: 'Preserving the authentic royal heritage of traditional South Indian sweets and crispy savories in Vedasandur.', ta: 'வேடசந்தூரில் பாரம்பரிய சுவை மாறாமல் மணக்க மணக்க தயாரிக்கப்படும் சுவையான இனிப்பு மற்றும் கார பலகாரங்கள்.' },
  'footer.opening_hours': { en: 'Opening Hours', ta: 'திறந்திருக்கும் நேரம்' },
  'footer.quick_links': { en: 'Quick Links', ta: 'முக்கிய இணைப்புகள்' },
  'footer.admin_portal': { en: 'Owner Dashboard Access', ta: 'உரிமையாளர் உள்நுழைவு' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageMode>(() => {
    const saved = localStorage.getItem('nellai_lang_pref');
    return (saved as LanguageMode) || 'all';
  });

  useEffect(() => {
    localStorage.setItem('nellai_lang_pref', language);
  }, [language]);

  const t = (key: string): string => {
    const item = translations[key];
    if (!item) return key;
    if (language === 'ta') return item.ta;
    if (language === 'en') return item.en;
    // For 'all' (bilingual), provide Tamil followed by English or primary
    return `${item.ta} / ${item.en}`;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
