import React, { useState } from 'react';
import { 
  Bed, 
  Bath, 
  Maximize2, 
  MapPin, 
  Sparkles, 
  Glasses, 
  MessageCircle, 
  Heart, 
  ChevronRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { Property, Language, Currency } from '../types';
import { translations } from '../i18n/translations';
import { SOCIAL_LINKS } from '../data/mockProperties';

interface PropertyCardProps {
  property: Property;
  lang: Language;
  currency: Currency;
  onOpenDetails: (prop: Property) => void;
  onLaunchVR: (prop: Property) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  lang,
  currency,
  onOpenDetails,
  onLaunchVR,
  isFavorite = false,
  onToggleFavorite
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const tCatalog = translations[lang].catalog;
  const tTypes = translations[lang].propertyTypes;

  const displayPrice = currency === 'USD' 
    ? `$${(property.priceUSD).toLocaleString()}` 
    : `${(property.priceEGP).toLocaleString()} ج.م`;

  const displayDownPayment = currency === 'USD'
    ? `$${Math.round(property.priceUSD * (property.paymentPlan.downPaymentPercent / 100)).toLocaleString()}`
    : `${Math.round(property.priceEGP * (property.paymentPlan.downPaymentPercent / 100)).toLocaleString()} ج.م`;

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = lang === 'ar'
      ? `مرحباً، أود الاستفسار عن تفاصيل وحجز موعد معاينة للوحدة كود (${property.refCode}) - ${property.title.ar}، بسعر ${displayPrice}.`
      : `Hello, I would like to inquire about details and schedule a VIP tour for property ref (${property.refCode}) - ${property.title.en}, listed at ${displayPrice}.`;
    window.open(`https://wa.me/${SOCIAL_LINKS.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div 
      onClick={() => onOpenDetails(property)}
      className="group relative bg-[#0e1019] border border-amber-500/15 hover:border-amber-500/40 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col cursor-pointer"
    >
      {/* Top Image Showcase */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
        <img
          src={property.images[currentImageIndex] || property.images[0]}
          alt={property.title[lang]}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-black/40" />

        {/* Badges on Image */}
        <div className="absolute top-3 start-3 flex flex-wrap items-center gap-1.5 z-10">
          {property.featured && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-neutral-950 font-black text-[11px] shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-neutral-950" />
              <span>{tCatalog.featuredBadge}</span>
            </span>
          )}

          {property.status === 'ready' ? (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/90 text-white font-bold text-[11px] backdrop-blur-md">
              {tCatalog.readyBadge}
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-lg bg-neutral-900/80 border border-white/20 text-neutral-200 text-[11px] backdrop-blur-md flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-400" />
              <span>{property.deliveryYear}</span>
            </span>
          )}
        </div>

        {/* Top End Actions: Favorite & Ref Code */}
        <div className="absolute top-3 end-3 flex items-center gap-2 z-10">
          <span className="px-2 py-0.5 rounded-md bg-black/60 border border-white/10 text-neutral-300 text-[10px] font-mono">
            {property.refCode}
          </span>
          {onToggleFavorite && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(property.id);
              }}
              className="p-2 rounded-xl bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-colors cursor-pointer"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-neutral-300'}`} />
            </button>
          )}
        </div>

        {/* Quick View Details Pill */}
        <div className="absolute bottom-3 start-3 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(property);
            }}
            className="px-3 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-amber-500 hover:text-neutral-950 text-amber-300 text-xs font-bold border border-amber-500/30 backdrop-blur-md transition-all flex items-center gap-1.5 shadow-lg shadow-black/50 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:text-neutral-950" />
            <span>{tCatalog.viewDetails}</span>
          </button>
        </div>

        {/* Location pill on image */}
        <div className="absolute bottom-3 end-3 z-10 text-[11px] text-neutral-300 bg-black/60 px-2 py-1 rounded-lg backdrop-blur-md flex items-center gap-1">
          <MapPin className="w-3 h-3 text-amber-400" />
          <span className="line-clamp-1">{property.compound}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Developer & Type */}
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
            <span className="font-medium text-amber-400/90">{property.developer}</span>
            <span className="px-2 py-0.5 rounded-md bg-neutral-900 border border-white/5 text-[11px]">
              {tTypes[property.type]}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 mb-3 leading-snug">
            {property.title[lang]}
          </h3>

          {/* Specs Bar (Beds, Baths, Area) */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-2xl bg-neutral-900/60 border border-white/5 text-xs text-neutral-300 mb-4">
            <div className="flex items-center gap-1.5 justify-center">
              <Bed className="w-4 h-4 text-amber-400" />
              <span>{property.bedrooms} {lang === 'ar' ? 'غرف' : 'Beds'}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center border-x border-white/10">
              <Bath className="w-4 h-4 text-amber-400" />
              <span>{property.bathrooms} {lang === 'ar' ? 'حمام' : 'Baths'}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center">
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{property.areaSqm} {lang === 'ar' ? 'م²' : 'sqm'}</span>
            </div>
          </div>

          {/* Payment Plan summary */}
          <div className="text-xs text-neutral-400 space-y-1 mb-4 bg-neutral-950/40 p-2.5 rounded-xl border border-white/5">
            <div className="flex justify-between">
              <span>{tCatalog.downPayment} ({property.paymentPlan.downPaymentPercent}%):</span>
              <span className="font-semibold text-neutral-200">{displayDownPayment}</span>
            </div>
            <div className="flex justify-between">
              <span>{tCatalog.installmentsUpTo}:</span>
              <span className="font-semibold text-amber-400">{property.paymentPlan.installmentsYears} {translations[lang].search.years}</span>
            </div>
          </div>
        </div>

        {/* Price & Action Bottom Row */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
              {lang === 'ar' ? 'السعر الإجمالي' : 'Total Price'}
            </div>
            <div className="text-lg font-black text-white font-sans tracking-tight text-gold-gradient">
              {displayPrice}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleWhatsApp}
              title={tCatalog.whatsappInquire}
              className="p-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onOpenDetails(property)}
              className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-200 font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>{tCatalog.viewDetails}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
