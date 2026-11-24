import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Logo } from './Logo';
import { SHOP_INFO } from '../data/initialData';
import { 
  X, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Sparkles, 
  ExternalLink,
  QrCode
} from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const printStandRef = useRef<HTMLDivElement>(null);

  // Link to deployed customer menu (uses window.location.origin or configured URL)
  const defaultMenuUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/menu`
    : 'https://nellai-lala-sweets.vercel.app/menu';

  const [targetUrl, setTargetUrl] = useState<string>(defaultMenuUrl);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentOrigin = window.location.origin;
      const configuredSiteUrl = import.meta.env.VITE_PUBLIC_SITE_URL;
      const initial = configuredSiteUrl ? `${configuredSiteUrl}/menu` : `${currentOrigin}/menu`;
      setTargetUrl(initial);
    }
  }, []);

  useEffect(() => {
    if (!targetUrl) return;

    // Generate high resolution QR code data URL with rich burgundy dots
    QRCode.toDataURL(targetUrl, {
      width: 480,
      margin: 2,
      color: {
        dark: '#5C1527', // Rich burgundy QR dots
        light: '#FFFFFF', // Crisp pure white background
      },
      errorCorrectionLevel: 'H',
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Error generating QR code:', err));
  }, [targetUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPNG = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `nellai-lala-sweets-menu-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-2 border-gold-500/50 my-6 animate-scaleUp text-stone-800"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gold-100 text-gold-900 border border-gold-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Official Shop Digital Menu QR Code</span>
          </div>
          <h2 className="font-tamil font-bold text-2xl text-burgundy-950">
            டிஜிட்டல் மெனு க்யூஆர் கோட்
          </h2>
          <p className="font-serif font-bold text-stone-800 text-lg">
            Nellai Lala Sweets • QR Digital Menu
          </p>
          <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
            Customers can scan this code with any mobile camera to view today's fresh sweets, savories and prices without login.
          </p>
        </div>

        {/* PRINTABLE STAND CARD (Ready for shop counter / tables) */}
        <div 
          ref={printStandRef}
          id="printable-stand-card"
          className="mx-auto max-w-md p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#FAF7F2] via-white to-[#F6EDE2] border-4 border-burgundy-900 shadow-xl relative overflow-hidden"
        >
          {/* Ornate Gold Border Inner Frame */}
          <div className="absolute inset-1.5 border-2 border-gold-500/80 rounded-xl pointer-events-none" />
          <div className="absolute inset-3 border border-dashed border-gold-600/40 rounded-lg pointer-events-none" />

          {/* Shop Header Inside Card */}
          <div className="text-center relative z-10 space-y-2">
            <div className="flex justify-center">
              <Logo size="md" />
            </div>

            <div className="text-xs font-semibold text-gold-800 tracking-wide">
              ஸ்ரீ முருகன் விலாஸ்
            </div>
            <div className="font-tamil font-bold text-2xl text-burgundy-950 leading-tight">
              {SHOP_INFO.name_ta}
            </div>
            <div className="font-serif font-extrabold text-base tracking-widest text-burgundy-900 uppercase">
              {SHOP_INFO.name_en}
            </div>
            <div className="text-xs font-semibold text-gold-700 tracking-wider">
              {SHOP_INFO.location_en}
            </div>

            {/* Instruction Banner */}
            <div className="my-3 py-2 px-3 rounded-lg bg-burgundy-950 text-gold-300 font-semibold text-xs border border-gold-500/40">
              <div className="font-tamil text-sm">மெனுவை காண ஸ்கேன் செய்யவும்</div>
              <div className="text-[11px] text-stone-300 tracking-wider">SCAN TO VIEW LIVE MENU & PRICES</div>
            </div>

            {/* QR Code Graphic */}
            <div className="flex justify-center py-2">
              <div className="p-3 bg-white rounded-xl shadow-md border-2 border-gold-500/60 inline-block">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Nellai Lala Sweets Menu QR"
                    className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                  />
                ) : (
                  <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center bg-stone-100 text-stone-400">
                    <QrCode className="w-12 h-12 animate-pulse" />
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Stand Info */}
            <div className="text-center pt-2 space-y-0.5">
              <p className="text-[11px] font-medium text-stone-600">
                ✨ No App Required • Live Shop Availability
              </p>
              <p className="font-tamil text-[11px] text-burgundy-900 font-semibold">
                6 பாரம்பரிய தயாரிப்பு பிரிவுகள்
              </p>
              <p className="text-xs text-stone-600 pt-1 font-mono font-bold">
                Ph: {SHOP_INFO.phone} / {SHOP_INFO.phone_secondary}
              </p>
            </div>
          </div>
        </div>

        {/* QR Code Target URL Configuration */}
        <div className="mt-6 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
          <label className="block text-stone-600 font-medium mb-1">
            Linked Menu Destination URL:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={targetUrl}
              onChange={e => setTargetUrl(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-mono text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-gold-500"
              placeholder="https://..."
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center gap-1 font-medium transition-colors"
              title="Copy URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700"
              title="Open menu link"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <p className="text-[10px] text-stone-500 mt-1">
            ℹ️ This QR code remains permanently valid. When the owner edits products, prices, or availability in the dashboard, customer scans immediately show the updated menu without changing the QR code.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleDownloadPNG}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-burgundy-900 hover:bg-burgundy-800 text-gold-300 font-semibold text-sm flex items-center justify-center gap-2 shadow-md border border-gold-500/40 transition-all hover:scale-[1.02]"
          >
            <Download className="w-4 h-4 text-gold-400" />
            <span>Download High-Res QR (PNG)</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-burgundy-950 font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02]"
          >
            <Printer className="w-4 h-4" />
            <span>Print Counter Stand Card</span>
          </button>
        </div>

      </div>
    </div>
  );
};
