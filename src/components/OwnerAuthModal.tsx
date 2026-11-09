import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, X, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { SOCIAL_LINKS } from '../data/mockProperties';

interface OwnerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lang: Language;
}

const DEFAULT_PIN = 'ptah2025';

export const OwnerAuthModal: React.FC<OwnerAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  lang
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [showChangePin, setShowChangePin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinChangedMsg, setPinChangedMsg] = useState(false);

  if (!isOpen) return null;

  const getStoredPin = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ptah_owner_pin');
      if (saved) return saved;
    }
    return DEFAULT_PIN;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPin = getStoredPin();

    if (pin.trim() === currentPin) {
      setError('');
      localStorage.setItem('ptah_owner_authenticated', 'true');
      onSuccess();
    } else {
      setError(
        lang === 'ar'
          ? 'رمز المرور غير صحيح. هذه المنطقة مخصصة حصرياً لمالك وإدارة شركة بتاح.'
          : 'Incorrect password. This area is reserved strictly for Ptah Real Estate administration.'
      );
    }
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length < 4) {
      setError(
        lang === 'ar'
          ? 'يجب أن يتكون الرمز الجديد من 4 خانات على الأقل.'
          : 'New PIN must be at least 4 characters.'
      );
      return;
    }
    localStorage.setItem('ptah_owner_pin', newPin.trim());
    setPinChangedMsg(true);
    setShowChangePin(false);
    setNewPin('');
    setError('');
    setTimeout(() => setPinChangedMsg(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0d0e17] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-neutral-100 shadow-amber-500/10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Logo */}
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <div className="relative w-14 h-14 rounded-2xl bg-white p-1 border border-amber-500/40 shadow-lg shadow-amber-500/20">
            <img 
              src={SOCIAL_LINKS.logoUrl} 
              alt="Ptah Logo" 
              className="w-full h-full object-contain rounded-xl"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'منطقة مالك الموقع فقط' : 'Owner Access Only'}</span>
          </div>

          <h3 className="text-xl font-black text-white">
            {lang === 'ar' ? 'بوابة دخول إدارة شركة بتاح' : 'Ptah Real Estate Owner Portal'}
          </h3>

          <p className="text-xs text-neutral-400 leading-relaxed max-w-xs">
            {lang === 'ar'
              ? 'هذه اللوحة مخصصة حصرياً لإدارة الشركة وأصحاب العمل للتحكم بالعقارات وتحديث البيانات. غير متاحة للعملاء.'
              : 'Restricted administrative portal for company management & property updates. Not accessible to clients.'}
          </p>
        </div>

        {pinChangedMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{lang === 'ar' ? 'تم تحديث رمز مرور الإدارة بنجاح!' : 'Owner password updated successfully!'}</span>
          </div>
        )}

        {/* Login Form */}
        {!showChangePin ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                {lang === 'ar' ? 'كلمة المرور / رمز الحماية (PIN)' : 'Owner Security Password / PIN'}
              </label>

              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    if (error) setError('');
                  }}
                  autoFocus
                  placeholder={lang === 'ar' ? 'أدخل رمز المرور السري...' : 'Enter owner password...'}
                  className="w-full bg-neutral-900 border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute top-1/2 -translate-y-1/2 end-3 text-neutral-400 hover:text-white p-1 cursor-pointer"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <div className="mt-2 text-xs text-red-400 flex items-center gap-1.5 bg-red-950/40 border border-red-500/20 p-2.5 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gold-gradient text-neutral-950 font-black text-sm hover:opacity-95 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'ar' ? 'الدخول إلى لوحة الإدارة' : 'Enter Owner Dashboard'}</span>
            </button>

            <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-400 border-t border-white/5">
              <span className="text-neutral-500">
                {lang === 'ar' ? 'الرمز الافتراضي: ' : 'Default PIN: '}
                <strong className="text-amber-400/90 font-mono">ptah2025</strong>
              </span>

              <button
                type="button"
                onClick={() => {
                  setShowChangePin(true);
                  setError('');
                }}
                className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <KeyRound className="w-3 h-3" />
                <span>{lang === 'ar' ? 'تغيير الرمز' : 'Change PIN'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Change PIN Form */
          <form onSubmit={handleUpdatePin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                {lang === 'ar' ? 'أدخل الرمز السري الجديد لإدارة الموقع' : 'Enter New Owner PIN'}
              </label>
              <input
                type="password"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                autoFocus
                placeholder={lang === 'ar' ? 'رمز جديد (4 أحرف أو أرقام على الأقل)' : 'New PIN (min 4 characters)'}
                className="w-full bg-neutral-900 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none"
              />
            </div>

            {error && (
              <div className="text-xs text-red-400 flex items-center gap-1.5 bg-red-950/40 p-2 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs cursor-pointer"
              >
                {lang === 'ar' ? 'حفظ الرمز الجديد' : 'Save New PIN'}
              </button>
              <button
                type="button"
                onClick={() => setShowChangePin(false)}
                className="py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs cursor-pointer"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
