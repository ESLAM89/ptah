import React, { useState } from 'react';
import { 
  MapPin, 
  Sparkles, 
  Sun, 
  Moon, 
  Sunset, 
  ExternalLink, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  RotateCw 
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { SOCIAL_LINKS } from '../data/mockProperties';

interface HeroAnimatedHouseProps {
  lang: Language;
  onExploreUnits?: () => void;
}

export const HeroAnimatedHouse: React.FC<HeroAnimatedHouseProps> = ({
  lang,
  onExploreUnits
}) => {
  const t = translations[lang].controls3D;
  const [lightingMood, setLightingMood] = useState<'golden' | 'daylight' | 'twilight'>('golden');
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const [selectedHotspot, setSelectedHotspot] = useState<number | null>(null);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState<boolean>(false);

  const hotspots = [
    {
      id: 1,
      x: '38%',
      y: '35%',
      titleAr: 'واجهة الحجر الطبيعي الماسي',
      titleEn: 'Natural Stone Masonry',
      descAr: 'تكسيات حجرية طبيعية معالجة حرارياً تمنح عزلاً صوتياً وحرارياً فائقاً.',
      descEn: 'Thermal-treated natural quarried stone delivering superior acoustic & heat insulation.'
    },
    {
      id: 2,
      x: '24%',
      y: '42%',
      titleAr: 'الواجهة الزجاجية الكاتدرائية',
      titleEn: 'Double-Height Glazing',
      descAr: 'زجاج مزدوج عاكس يوفر إضاءة طبيعية وافرة مع حماية كاملة من الأشعة.',
      descEn: 'Double-glazed panoramic curtain wall maximizing natural daylighting.'
    },
    {
      id: 3,
      x: '62%',
      y: '48%',
      titleAr: 'جناح المعيشة والبهو المضاء',
      titleEn: 'Luminous Living Pavilion',
      descAr: 'إضاءة دافئة مدمجة مع أسقف خشبية وأبواب سحب عريضة نحو الحديقة.',
      descEn: 'Integrated warm ambient cove lighting and seamless sliding doors to terrace.'
    },
    {
      id: 4,
      x: '46%',
      y: '82%',
      titleAr: 'الممشى الحجري المنسق',
      titleEn: 'Flagstone Garden Walkway',
      descAr: 'ممر حجري طبيعي منسق محاط بنباتات وزهور عطرية متناغمة مع الطبيعة.',
      descEn: 'Natural flagstone meandering pathway amidst sculpted flora and garden lamps.'
    }
  ];

  return (
    <div className="relative w-full h-[620px] md:h-[720px] overflow-hidden select-none bg-neutral-950 border-b border-amber-500/20">
      
      {/* Background House Image with Smooth Cinematic Animation */}
      <div 
        className={`absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 ${
          isAnimating ? 'animate-pulse-slow scale-105' : 'scale-100'
        }`}
        style={{
          backgroundImage: `url(${SOCIAL_LINKS.heroHouseImage})`,
          animationDuration: '14s',
          animationIterationCount: 'infinite',
          animationDirection: 'alternate'
        }}
      />

      {/* Lighting Mood Gradient Overlays */}
      {lightingMood === 'golden' && (
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-amber-950/20 to-amber-900/15 pointer-events-none transition-opacity duration-700" />
      )}
      {lightingMood === 'daylight' && (
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-sky-950/15 to-transparent pointer-events-none transition-opacity duration-700" />
      )}
      {lightingMood === 'twilight' && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080f] via-indigo-950/40 to-slate-950/50 pointer-events-none transition-opacity duration-700" />
      )}

      {/* Subtle Vignette & Frame */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-neutral-950/80 pointer-events-none" />

      {/* Top Left Badge: Location in 10th of Ramadan & Official Branding */}
      <div className="absolute top-6 start-6 z-20 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <a
          href={SOCIAL_LINKS.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group px-3.5 py-2 rounded-2xl bg-neutral-950/85 hover:bg-neutral-900 border border-amber-500/40 text-amber-400 text-xs font-bold backdrop-blur-md transition-all shadow-xl flex items-center gap-2 cursor-pointer hover:border-amber-400"
          title="افتح موقعنا على خرائط جوجل"
        >
          <MapPin className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
          <span>{lang === 'ar' ? 'العاشر من رمضان، الشرقية (خريطة جوجل)' : '10th of Ramadan, Sharqia (Google Maps)'}</span>
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>
      </div>

      {/* Top Right Quick Action */}
      <div className="absolute top-6 end-6 z-20 hidden sm:flex items-center gap-3">
        <button
          onClick={onExploreUnits}
          className="px-4 py-2 rounded-xl bg-gold-gradient text-neutral-950 font-black text-xs tracking-wide transition-all shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer hover:opacity-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{translations[lang].hero.browseUnits}</span>
        </button>
      </div>

      {/* Interactive Architectural Hotspot Pins */}
      {hotspots.map((spot) => (
        <div
          key={spot.id}
          className="absolute z-20"
          style={{ top: spot.y, left: spot.x }}
        >
          <button
            onClick={() => setSelectedHotspot(selectedHotspot === spot.id ? null : spot.id)}
            className="group relative flex items-center justify-center cursor-pointer"
            aria-label={lang === 'ar' ? spot.titleAr : spot.titleEn}
          >
            {/* Outer Soft Ring */}
            <span className="absolute w-8 h-8 rounded-full bg-amber-400/30 animate-ping opacity-75" />
            
            {/* Inner Core Pin */}
            <span className="relative w-6 h-6 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center font-bold text-[11px] shadow-lg shadow-black/60 border border-amber-300 group-hover:scale-110 transition-transform">
              <Eye className="w-3.5 h-3.5" />
            </span>
          </button>

          {/* Hotspot Info Popup */}
          {selectedHotspot === spot.id && (
            <div className="absolute bottom-9 start-1/2 -translate-x-1/2 z-30 w-64 p-3.5 rounded-2xl bg-neutral-950/95 border border-amber-500/40 text-neutral-100 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200">
              <div className="flex items-start justify-between gap-1 mb-1.5">
                <h4 className="text-xs font-bold text-amber-400">
                  {lang === 'ar' ? spot.titleAr : spot.titleEn}
                </h4>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="text-neutral-400 hover:text-white p-0.5 rounded cursor-pointer text-xs"
                >
                  ✕
                </button>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                {lang === 'ar' ? spot.descAr : spot.descEn}
              </p>
            </div>
          )}
        </div>
      ))}

      {/* Sleek Bottom Control Dock */}
      <div 
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-2xl transition-transform duration-300"
        style={{
          transform: isControlsCollapsed 
            ? 'translateX(-50%) translateY(calc(100% - 30px))' 
            : 'translateX(-50%) translateY(0)'
        }}
      >
        {/* Toggle Collapse Pill */}
        <div className="flex justify-center -mb-px">
          <button
            onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
            className="px-4 py-1 rounded-t-lg bg-neutral-900/90 border-t border-x border-amber-500/30 text-amber-400 text-xs font-medium flex items-center gap-1.5 backdrop-blur-md hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            {isControlsCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>{t.showControls}</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>{t.hideControls}</span>
              </>
            )}
          </button>
        </div>

        {/* Control Dock Panel */}
        <div className="glass-panel rounded-2xl p-3 shadow-2xl border border-amber-500/25 bg-neutral-950/90 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* Lighting Mood Switcher */}
            <div className="flex items-center gap-1 bg-neutral-900/80 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setLightingMood('golden')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 font-medium ${
                  lightingMood === 'golden'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Sunset className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.lighting.golden}</span>
              </button>

              <button
                onClick={() => setLightingMood('daylight')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 font-medium ${
                  lightingMood === 'daylight'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-yellow-300" />
                <span>{t.lighting.daylight}</span>
              </button>

              <button
                onClick={() => setLightingMood('twilight')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 font-medium ${
                  lightingMood === 'twilight'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-blue-300" />
                <span>{t.lighting.twilight}</span>
              </button>
            </div>

            {/* Animation Motion Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isAnimating
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-neutral-900 border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                <RotateCw className={`w-3.5 h-3.5 ${isAnimating ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
                <span>{t.autoRotate}</span>
              </button>
            </div>

            {/* Direct Google Maps Link */}
            <a
              href={SOCIAL_LINKS.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-amber-300 border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>{lang === 'ar' ? 'مقر العاشر من رمضان' : '10th of Ramadan HQ'}</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

          </div>
        </div>
      </div>

    </div>
  );
};
