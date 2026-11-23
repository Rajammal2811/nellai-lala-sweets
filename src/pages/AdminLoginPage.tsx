import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  KeyRound,
  ExternalLink
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isMockAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setErrorMsg(res.error || 'Failed to authenticate');
    }
  };

  // Quick Demo Login Fill for local test review
  const handleQuickDemoLogin = async () => {
    setEmail('admin@nellailala.com');
    setPassword('nellailala123');
    setIsSubmitting(true);
    const res = await login('admin@nellailala.com', 'nellailala123');
    setIsSubmitting(false);
    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setErrorMsg(res.error || 'Demo login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-burgundy-950 via-[#350711] to-[#20040A] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      
      {/* Background Motifs */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border-2 border-gold-500/40">
        
        {/* Logo and Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo size="md" showPlaceholderNotice={false} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-burgundy-50 text-burgundy-900 border border-burgundy-200">
            <ShieldCheck className="w-4 h-4 text-burgundy-700" />
            <span>Owner Administration Portal</span>
          </div>

          <h1 className="font-tamil font-bold text-2xl text-burgundy-950">
            உரிமையாளர் உள்நுழைவு
          </h1>
          <p className="text-xs text-stone-500 font-sans">
            Secure authentication for Nellai Lala Sweets shop management.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mt-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="owner@nellailala.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-gold-500 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Secret Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-gold-500 font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-burgundy-950 font-bold text-sm shadow-md hover:shadow-gold-glow flex items-center justify-center gap-2 transition-all"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Secure Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Mode Helper when Supabase credentials aren't plugged in yet */}
        {isMockAuth && (
          <div className="mt-6 pt-5 border-t border-stone-200">
            <div className="p-3.5 rounded-xl bg-gold-50/80 border border-gold-200 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-gold-900">
                <Sparkles className="w-3.5 h-3.5 text-gold-700" />
                <span>Instant Reviewer / Demo Access</span>
              </div>
              <p className="text-[11px] text-stone-600">
                Supabase credentials not yet populated in <code>.env</code>. You can click below to test the full owner dashboard immediately:
              </p>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2 rounded-lg bg-burgundy-900 hover:bg-burgundy-800 text-gold-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>One-Click Demo Owner Sign In</span>
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-xs text-stone-500 hover:text-burgundy-900 font-medium transition-colors"
          >
            ← Return to Customer Website
          </a>
        </div>

      </div>
    </div>
  );
};
