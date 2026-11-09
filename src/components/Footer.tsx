import React from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  ExternalLink,
  ShieldCheck,
  Headphones,
  Lock
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { SOCIAL_LINKS } from '../data/mockProperties';

interface FooterProps {
  lang: Language;
  onNavigate: (tab: string) => void;
  onOpenOwnerLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onNavigate, onOpenOwnerLogin }) => {
  const t = translations[lang].footer;
  const tNav = translations[lang].nav;

  const openWhatsApp = () => {
    const text = lang === 'ar'
      ? 'مرحباً، أود الاستفسار عن خدمات بتاح للاستثمار العقاري والوحدات المتاحة.'
      : 'Hello, I would like to inquire about Ptah Real Estate services and signature units.';
    window.open(`https://wa.me/${SOCIAL_LINKS.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <footer className="w-full bg-[#07080d] border-t border-amber-500/20 text-neutral-300 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Column 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-amber-500/30 p-0.5 shadow-md shadow-amber-500/10 bg-white">
                <img 
                  src={SOCIAL_LINKS.logoUrl} 
                  alt="Ptah Real Estate" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">
                  {lang === 'ar' ? 'بتاح للاستثمار العقاري' : 'Ptah Real Estate'}
                </h3>
                <p className="text-xs text-amber-400 font-medium">
                  {SOCIAL_LINKS.domain} • {lang === 'ar' ? 'العاشر من رمضان، الشرقية' : '10th of Ramadan, Sharqia'}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-md">
              {lang === 'ar' 
                ? 'الوجهة العقارية الأولى للنخبة في مصر. نوفر أرقى الوحدات السكنية والفندقية والاستثمارية في العاشر من رمضان بالشرقية، القاهرة الجديدة، والساحل الشمالي مع دعم مستمر على مدار 24 ساعة.'
                : 'The premier luxury real estate advisory in Egypt. Featuring handpicked residential and investment opportunities in 10th of Ramadan, New Cairo, and North Coast with 24/7 client concierge.'}
            </p>

            {/* Official Verified Social Links */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-neutral-200 mb-3 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{t.followUsTitle}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                
                {/* Facebook */}
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 hover:border-amber-500/40 hover:text-amber-400 text-xs font-medium transition-all flex items-center gap-1.5 group"
                >
                  <span className="font-bold text-blue-400 group-hover:text-amber-400">f</span>
                  <span>Facebook</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>

                {/* LinkedIn */}
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 hover:border-amber-500/40 hover:text-amber-400 text-xs font-medium transition-all flex items-center gap-1.5 group"
                >
                  <span className="font-bold text-blue-500 group-hover:text-amber-400">in</span>
                  <span>LinkedIn</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>

                {/* Instagram */}
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 hover:border-amber-500/40 hover:text-amber-400 text-xs font-medium transition-all flex items-center gap-1.5 group"
                >
                  <span className="font-bold text-pink-500 group-hover:text-amber-400">IG</span>
                  <span>Instagram</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>

                {/* YouTube */}
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 hover:border-amber-500/40 hover:text-amber-400 text-xs font-medium transition-all flex items-center gap-1.5 group"
                >
                  <span className="font-bold text-red-500 group-hover:text-amber-400">YT</span>
                  <span>YouTube</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>

                {/* TikTok */}
                <a
                  href={SOCIAL_LINKS.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 hover:border-amber-500/40 hover:text-amber-400 text-xs font-medium transition-all flex items-center gap-1.5 group"
                >
                  <span className="font-bold text-teal-400 group-hover:text-amber-400">TT</span>
                  <span>TikTok</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>

              </div>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans border-b border-amber-500/20 pb-2">
              {t.quickLinksTitle}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-start"
                >
                  {tNav.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('properties')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-start"
                >
                  {tNav.properties}
                </button>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors text-start flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span>{tNav.locationMaps}</span>
                </a>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('projects')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-start"
                >
                  {tNav.projects}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-start"
                >
                  {tNav.about}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('support')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-start"
                >
                  {tNav.support24}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Prime Locations */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans border-b border-amber-500/20 pb-2">
              {lang === 'ar' ? 'أبرز الوجهات العقارية' : 'Prime Destinations'}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li className="text-amber-400 font-bold">{translations[lang].locations.tenth_of_ramadan}</li>
              <li>{translations[lang].locations.new_cairo}</li>
              <li>{translations[lang].locations.new_capital}</li>
              <li>{translations[lang].locations.sheikh_zayed}</li>
              <li>{translations[lang].locations.north_coast}</li>
              <li>{translations[lang].locations.el_gouna}</li>
            </ul>
          </div>

          {/* Column 5: Direct Support & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans border-b border-amber-500/20 pb-2 flex items-center gap-1.5">
              <Headphones className="w-4 h-4 text-emerald-400" />
              <span>{translations[lang].support.badge}</span>
            </h4>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2 text-neutral-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div>{lang === 'ar' ? SOCIAL_LINKS.addressAr : SOCIAL_LINKS.addressEn}</div>
                  <a 
                    href={SOCIAL_LINKS.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline flex items-center gap-1 mt-0.5 font-medium"
                  >
                    <span>{lang === 'ar' ? 'عرض على خرائط جوجل' : 'Open in Google Maps'}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 text-neutral-300">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${SOCIAL_LINKS.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors">
                  {SOCIAL_LINKS.phone}
                </a>
              </div>

              <div className="flex items-center gap-2 text-neutral-300">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${SOCIAL_LINKS.email}`} className="hover:text-white transition-colors">
                  {SOCIAL_LINKS.email}
                </a>
              </div>

              <button
                onClick={openWhatsApp}
                className="w-full mt-2 py-2.5 px-3 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تواصل عبر الواتساب فوراً' : 'Live WhatsApp Support'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>{t.rights}</p>
          <div className="flex items-center gap-3">
            <span className="text-amber-400/80 font-medium">www.ptahrealestate.com</span>
            <span>•</span>
            <span>{t.developedWith}</span>
            {onOpenOwnerLogin && (
              <>
                <span>•</span>
                <button
                  onClick={onOpenOwnerLogin}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1 opacity-40 hover:opacity-100 cursor-pointer text-[11px]"
                  title={lang === 'ar' ? 'بوابة دخول إدارة الموقع' : 'Owner Portal'}
                >
                  <Lock className="w-3 h-3 text-amber-500/80" />
                  <span>{lang === 'ar' ? 'دخول الإدارة' : 'Owner Portal'}</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
