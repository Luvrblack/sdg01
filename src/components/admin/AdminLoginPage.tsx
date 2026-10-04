import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { SdgLogo } from '../SdgLogo';
import { ShieldCheck, Lock, User, Eye, EyeOff, AlertTriangle, ArrowLeft, KeyRound, CheckCircle2, ShieldAlert, X } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, setCurrentView, lockoutUntil } = useData();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaNum1, setCaptchaNum1] = useState(5);
  const [captchaNum2, setCaptchaNum2] = useState(7);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [remainingLockout, setRemainingLockout] = useState<number>(0);

  // Generate new math captcha
  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 9) + 2;
    const n2 = Math.floor(Math.random() * 9) + 2;
    setCaptchaNum1(n1);
    setCaptchaNum2(n2);
    setCaptchaAnswer('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (!lockoutUntil) {
      setRemainingLockout(0);
      return;
    }
    const interval = setInterval(() => {
      const diff = Math.ceil((lockoutUntil - Date.now()) / 1000);
      if (diff <= 0) {
        setRemainingLockout(0);
      } else {
        setRemainingLockout(diff);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Captcha validation
    if (parseInt(captchaAnswer, 10) !== captchaNum1 + captchaNum2) {
      setErrorMessage('Jawaban verifikasi keamanan (Captcha) salah. Silakan coba lagi.');
      generateCaptcha();
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginAdmin(username, password);
      if (result.success) {
        setSuccessMessage(result.message);
      } else {
        setErrorMessage(result.message);
        generateCaptcha();
      }
    } catch (err) {
      setErrorMessage('Terjadi kesalahan otentikasi sistem.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050907] text-slate-100 flex flex-col justify-between items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Premium Floating Close Button */}
      <button
        onClick={() => setCurrentView('store')}
        className="absolute top-4 right-4 z-50 p-3 rounded-full bg-slate-900/90 hover:bg-emerald-400 hover:text-black border border-emerald-900/40 text-slate-300 transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
        title="Kembali ke Halaman Utama"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-radial-emerald blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-950/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header Link */}
      <div className="w-full max-w-md flex justify-between items-center z-10 pt-2">
        <button
          onClick={() => setCurrentView('store')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Website Utama</span>
        </button>

        <span className="text-[11px] font-mono text-emerald-500 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-full">
          Portal Terisolasi
        </span>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md my-auto z-10">
        <div className="bg-[#0c1310]/95 border border-emerald-800/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-md">
          
          {/* Brand & Security Header */}
          <div className="text-center mb-7">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <SdgLogo size="lg" showText={false} />
                <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-black rounded-full ring-2 ring-[#0c1310]">
                  <Lock className="w-3 h-3" />
                </div>
              </div>
            </div>

            <h1 className="font-display text-2xl font-black text-white tracking-tight">
              cPanel Admin <span className="text-emerald-400">SDG</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Area Khusus Pengelola & Pengunggahan Konten Distro
            </p>

            {/* SQL Injection Defense Status Badge */}
            <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/50 text-[11px] font-medium text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Proteksi SQL Injection & Firewall Aktif</span>
            </div>
          </div>

          {/* Alerts */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-950/70 border border-rose-800/60 text-rose-200 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-600/60 text-emerald-200 text-xs flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{successMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Username Admin
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  disabled={remainingLockout > 0 || isLoading}
                  placeholder="Masukkan username admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-xs rounded-xl bg-slate-950 border border-emerald-950/80 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={remainingLockout > 0 || isLoading}
                  placeholder="Masukkan password admin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 text-xs rounded-xl bg-slate-950 border border-emerald-950/80 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Anti-Bot Captcha Verification */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Verifikasi Keamanan: Berapakah <span className="text-emerald-400 font-mono font-bold">{captchaNum1} + {captchaNum2}</span> ?
              </label>
              <input
                type="number"
                required
                disabled={remainingLockout > 0 || isLoading}
                placeholder="Tulis hasil penjumlahan"
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                className="w-full px-4 py-2.5 text-xs font-mono rounded-xl bg-slate-950 border border-emerald-950/80 text-white focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={remainingLockout > 0 || isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 disabled:bg-slate-800 disabled:text-slate-600 text-black text-xs font-extrabold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isLoading 
                  ? 'Memverifikasi...' 
                  : remainingLockout > 0 
                  ? `Terkunci (${remainingLockout}s)` 
                  : 'Masuk ke cPanel Admin'}
              </span>
            </button>

            {/* Premium Close / Back to Storefront button */}
            <button
              type="button"
              onClick={() => setCurrentView('store')}
              className="w-full py-3 px-4 rounded-xl bg-transparent hover:bg-slate-900 border border-slate-800/80 text-slate-400 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 mt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Tutup / Kembali ke Beranda</span>
            </button>

          </form>

        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-slate-500 py-3 z-10">
        © {new Date().getFullYear()} SDG Industries Security Gateway · Enkripsi SHA-256 Terlindungi
      </div>
    </div>
  );
};
