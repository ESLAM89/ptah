import React, { useState } from 'react';
import { 
  Globe, 
  Menu, 
  X, 
  PhoneCall, 
  MessageCircle, 
  LayoutDashboard, 
  Building2, 
  Glasses, 
  Sparkles,
  DollarSign
} from 'lucide-react';
import { Language, Currency } from '../types';
import { translations } from '../i18n/translations';
import { SOCIAL_LINKS } from '../data/mockProperties';

interface NavbarProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  currency: Currency;
  onCurrencyChange: (curr: Currency) => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onRequestConsultation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onLanguageChange,
  currency,
  onCurrencyChange,
  activeTab,
  onNavigate,
  onRequestConsultation
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang].nav;

  const handleNavClick = (tabId: string) => {
    onNavigate(tabId);
    setMobileMenuOpen(false);
  };

  const openWhatsApp = () => {
    const text = lang === 'ar'
      ? 'مرحباً، أود التحدث مع مستشار عقاري من بتاح للاستثمار العقاري بخصوص الفرص الاستثمارية والوحدات الفاخرة.'
      : 'Hello, I would like to speak with a Ptah Real Estate senior property advisor regarding luxury investment opportunities.';
    window.open(`https://wa.me/${SOCIAL_LINKS.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/85 backdrop-blur-xl border-b border-amber-500/15">
      {/* Top micro bar for 24/7 hotline and verified official domain info */}
      <div className="bg-[#0c0d14] border-b border-white/5 py-1.5 px-4 text-[11px] text-neutral-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-400/90 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              {translations[lang].hero.consultantBadge}
            </span>
            <span className="hidden md:inline text-neutral-500">•</span>
            <a 
              href={`tel:${SOCIAL_LINKS.phone.replace(/[^0-9+]/g, '')}`} 
              className="hidden md:flex items-center gap-1 hover:text-white transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-amber-400" />
              <span>{SOCIAL_LINKS.phone}</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-neutral-500 hidden sm:inline">{SOCIAL_LINKS.domain}</span>
            {/* Currency Switcher */}
            <div className="flex items-center bg-neutral-900 rounded-md p-0.5 border border-white/10 text-[10px]">
              <button
                onClick={() => onCurrencyChange('EGP')}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${currency === 'EGP' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}`}
              >
                EGP (ج.م)
              </button>
              <button
                onClick={() => onCurrencyChange('USD')}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${currency === 'USD' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}`}
              >
                USD ($)
              </button>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => onLanguageChange(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium cursor-pointer px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20"
            >
              <Globe className="w-3 h-3" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-amber-500/30 p-0.5 shadow-lg shadow-amber-500/20 transition-transform group-hover:scale-105 bg-white">
            <img 
              src={SOCIAL_LINKS.logoUrl} 
              alt="Ptah Real Estate Logo" 
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg md:text-xl font-extrabold tracking-tight text-white font-sans">
                {lang === 'ar' ? 'بتاح' : 'PTAH'}
              </span>
              <span className="text-xs uppercase font-semibold text-amber-400 tracking-widest font-sans">
                {lang === 'ar' ? 'للعقارات' : 'REAL ESTATE'}
              </span>
            </div>
            <span className="text-[10px] text-amber-400/90 font-medium hidden sm:block tracking-wide">
              {lang === 'ar' ? 'العاشر من رمضان، الشرقية' : '10th of Ramadan, Sharqia'}
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => handleNavClick('home')}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'text-amber-400 bg-amber-500/10 font-bold border border-amber-500/20'
                : 'text-neutral-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {t.home}
          </button>

          <button
            onClick={() => handleNavClick('properties')}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'properties'
                ? 'text-amber-400 bg-amber-500/10 font-bold border border-amber-500/20'
                : 'text-neutral-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-400/80" />
            <span>{t.properties}</span>
          </button>

          <a
            href={SOCIAL_LINKS.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl text-sm font-medium transition-all text-neutral-300 hover:text-amber-300 hover:bg-white/5 flex items-center gap-1.5"
            title={lang === 'ar' ? 'مقرنا بالعاشر من رمضان على خرائط جوجل' : 'Our Location on Google Maps'}
          >
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span>{t.locationMaps}</span>
          </a>

          <button
            onClick={() => handleNavClick('projects')}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'projects'
                ? 'text-amber-400 bg-amber-500/10 font-bold border border-amber-500/20'
                : 'text-neutral-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {t.projects}
          </button>

          <button
            onClick={() => handleNavClick('about')}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'about'
                ? 'text-amber-400 bg-amber-500/10 font-bold border border-amber-500/20'
                : 'text-neutral-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {t.about}
          </button>

          <button
            onClick={() => handleNavClick('support')}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'support'
                ? 'text-amber-400 bg-amber-500/10 font-bold border border-amber-500/20'
                : 'text-neutral-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {t.support24}
          </button>
        </nav>

        {/* Action CTAs: Direct WhatsApp & Consultation */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            onClick={openWhatsApp}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t.whatsappQuick}</span>
          </button>

          <button
            onClick={onRequestConsultation}
            className="px-4 py-2.5 rounded-xl bg-gold-gradient text-neutral-950 font-bold text-xs flex items-center gap-2 hover:opacity-95 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-neutral-950" />
            <span>{t.requestCall}</span>
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-xl bg-neutral-900 border border-white/10 text-neutral-200 hover:text-white cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950 border-b border-amber-500/20 px-4 py-5 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-start px-3 py-2.5 rounded-xl text-sm font-semibold ${
                activeTab === 'home' ? 'text-amber-400 bg-amber-500/10' : 'text-neutral-300'
              }`}
            >
              {t.home}
            </button>
            <button
              onClick={() => handleNavClick('properties')}
              className={`text-start px-3 py-2.5 rounded-xl text-sm font-semibold ${
                activeTab === 'properties' ? 'text-amber-400 bg-amber-500/10' : 'text-neutral-300'
              }`}
            >
              {t.properties}
            </button>
            <a
              href={SOCIAL_LINKS.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-start px-3 py-2.5 rounded-xl text-sm font-semibold text-neutral-300 hover:text-amber-400 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span>{t.locationMaps}</span>
            </a>
            <button
              onClick={() => handleNavClick('projects')}
              className={`text-start px-3 py-2.5 rounded-xl text-sm font-semibold ${
                activeTab === 'projects' ? 'text-amber-400 bg-amber-500/10' : 'text-neutral-300'
              }`}
            >
              {t.projects}
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`text-start px-3 py-2.5 rounded-xl text-sm font-semibold ${
                activeTab === 'about' ? 'text-amber-400 bg-amber-500/10' : 'text-neutral-300'
              }`}
            >
              {t.about}
            </button>
            <button
              onClick={() => handleNavClick('support')}
              className={`text-start px-3 py-2.5 rounded-xl text-sm font-semibold ${
                activeTab === 'support' ? 'text-amber-400 bg-amber-500/10' : 'text-neutral-300'
              }`}
            >
              {t.support24}
            </button>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
              <button
                onClick={openWhatsApp}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.whatsappQuick}</span>
              </button>

              <button
                onClick={() => {
                  onRequestConsultation();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-gold-gradient text-neutral-950 font-bold text-xs flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-neutral-950" />
                <span>{t.requestCall}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
