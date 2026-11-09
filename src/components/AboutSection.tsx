import React from 'react';
import { 
  Building2, 
  Glasses, 
  TrendingUp, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  MessageCircle,
  Users,
  MapPin
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { SOCIAL_LINKS } from '../data/mockProperties';

interface AboutSectionProps {
  lang: Language;
  onExploreProperties: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ lang, onExploreProperties }) => {
  const t = translations[lang].about;
  const tHero = translations[lang].hero;

  const openWhatsApp = () => {
    const text = lang === 'ar'
      ? 'مرحباً، أود معرفة المزيد عن خدمات بتاح للاستثمار العقاري وحجز موعد استشاري.'
      : 'Hello, I would like to learn more about Ptah Real Estate advisory services.';
    window.open(`https://wa.me/${SOCIAL_LINKS.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="w-full py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-16 animate-in fade-in duration-300">
      
      {/* Hero Narrative Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-900 via-[#10121d] to-[#0a0b12] border border-amber-500/25 p-8 md:p-14 shadow-2xl">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.title}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            {t.storyTitle}
          </h1>

          <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
            {t.storyP1}
          </p>

          <p className="text-sm md:text-base text-neutral-400 leading-relaxed">
            {t.storyP2}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onExploreProperties}
              className="px-6 py-3 rounded-xl bg-gold-gradient text-neutral-950 font-bold text-xs md:text-sm hover:opacity-95 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              {translations[lang].hero.browseUnits}
            </button>

            <button
              onClick={openWhatsApp}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{translations[lang].nav.whatsappQuick}</span>
            </button>
          </div>
        </div>

        {/* Decorative Ancient Architectural Watermark */}
        <div className="absolute end-4 bottom-4 opacity-5 pointer-events-none hidden md:block">
          <span className="font-serif text-[180px] font-black text-amber-400">
            PTAH
          </span>
        </div>
      </div>

      {/* Numerical Achievements */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900/70 p-6 rounded-2xl border border-white/5 text-center">
          <div className="text-3xl sm:text-4xl font-black text-gold-gradient font-sans mb-1">
            {tHero.stats.volume}
          </div>
          <div className="text-xs text-neutral-400 font-medium">{tHero.stats.volumeLabel}</div>
        </div>

        <div className="bg-neutral-900/70 p-6 rounded-2xl border border-white/5 text-center">
          <div className="text-3xl sm:text-4xl font-black text-white font-sans mb-1">
            {tHero.stats.families}
          </div>
          <div className="text-xs text-neutral-400 font-medium">{tHero.stats.familiesLabel}</div>
        </div>

        <div className="bg-neutral-900/70 p-6 rounded-2xl border border-white/5 text-center">
          <div className="text-3xl sm:text-4xl font-black text-amber-400 font-sans mb-1">
            {tHero.stats.developers}
          </div>
          <div className="text-xs text-neutral-400 font-medium">{tHero.stats.developersLabel}</div>
        </div>

        <div className="bg-neutral-900/70 p-6 rounded-2xl border border-white/5 text-center">
          <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-sans mb-1">
            {tHero.stats.satisfaction}
          </div>
          <div className="text-xs text-neutral-400 font-medium">{tHero.stats.satisfactionLabel}</div>
        </div>
      </div>

      {/* Strategic Pillars */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {t.pillarsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            {lang === 'ar' 
              ? 'معايير صارمة وضمانات حقيقية تميز تجربة عملاء بتاح العقارية'
              : 'Rigorous benchmarks delivering security and exceptional value'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-neutral-900/80 p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{t.pillar1Title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{t.pillar1Desc}</p>
            </div>
          </div>

          <div className="bg-neutral-900/80 p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                <Glasses className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{t.pillar2Title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{t.pillar2Desc}</p>
            </div>
          </div>

          <div className="bg-neutral-900/80 p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{t.pillar3Title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{t.pillar3Desc}</p>
            </div>
          </div>

          <div className="bg-neutral-900/80 p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{t.pillar4Title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{t.pillar4Desc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Official Verified Social Proof & Headquarters */}
      <div className="bg-neutral-900/50 p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">
            {lang === 'ar' ? 'تابع حسابات بتاح الرسمية الموثقة' : 'Connect with Our Verified Channels'}
          </h3>
          <p className="text-xs text-neutral-400">
            {SOCIAL_LINKS.domain} • Facebook • LinkedIn • Instagram • YouTube • TikTok
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={SOCIAL_LINKS.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow-md shadow-red-600/20"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'مقر العاشر من رمضان' : '10th of Ramadan HQ'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 hover:border-amber-500 text-xs font-semibold text-neutral-200 hover:text-white transition-colors"
          >
            LinkedIn Profile
          </a>

          <a
            href={SOCIAL_LINKS.youtube}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 hover:border-amber-500 text-xs font-semibold text-neutral-200 hover:text-white transition-colors"
          >
            YouTube Channel
          </a>

          <a
            href={SOCIAL_LINKS.tiktok}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 hover:border-amber-500 text-xs font-semibold text-neutral-200 hover:text-white transition-colors"
          >
            TikTok Official
          </a>
        </div>
      </div>

    </div>
  );
};
