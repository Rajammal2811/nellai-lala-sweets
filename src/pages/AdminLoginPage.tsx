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
  Database,
  ExternalLink
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isSupabaseConnected } = useAuth();
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-burgundy-950 via-[#350711] to-[#20040A] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      
      {/* Background Motifs */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border-2 border-gold-500/40">
        
        {/* Logo and Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo size="md" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-burgundy-50 text-burgundy-900 border border-burgundy-200">
            <ShieldCheck className="w-4 h-4 text-burgundy-700" />
            <span>Owner Administration Portal</span>
          </div>

          <h1 className="font-tamil font-bold text-2xl text-burgundy-950">
            உரிமையாளர் உள்நுழைவு
          </h1>
          <p className="text-xs text-stone-500 font-sans">
            Secure Supabase Authentication for Nellai Lala Sweets shop owner.
          </p>
        </div>

        {/* Database Connection Notice if Credentials Missing */}
        {!isSupabaseConnected && (
          <div className="mt-5 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <Database className="w-4 h-4 text-amber-700" />
              <span>Supabase Configuration Required</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800">
              To log in as the owner, please connect your Supabase project by adding your credentials in <code>.env</code>:
            </p>
            <div className="bg-white/80 p-2 rounded-lg font-mono text-[10px] text-amber-950 border border-amber-200 space-y-0.5">
              <div>VITE_SUPABASE_URL=https://your-project.supabase.co</div>
              <div>VITE_SUPABASE_ANON_KEY=your-anon-key</div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mt-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Real Owner Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Owner Email Address
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
              Owner Password
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
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-burgundy-950 font-bold text-sm shadow-md hover:shadow-gold-glow flex items-center justify-center gap-2 transition-all disabled:opacity-60"
          >
            {isSubmitting ? (
              <span>Authenticating with Supabase...</span>
            ) : (
              <>
                <span>Sign In to Owner Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

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
