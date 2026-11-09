import React, { useState } from 'react';
import { 
  X, 
  Bed, 
  Bath, 
  Maximize2, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  Glasses, 
  MessageCircle, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  Phone,
  User,
  Mail,
  Send,
  Calculator
} from 'lucide-react';
import { Property, Language, Currency } from '../types';
import { translations } from '../i18n/translations';
import { SOCIAL_LINKS, addLead } from '../data/mockProperties';

interface PropertyDetailModalProps {
  property: Property;
  lang: Language;
  currency: Currency;
  onClose: () => void;
  onLaunchVR: (prop: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  lang,
  currency,
  onClose,
  onLaunchVR
}) => {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const t = translations[lang].detail;
  const tTypes = translations[lang].propertyTypes;
  const tCatalog = translations[lang].catalog;

  const displayPrice = currency === 'USD'
    ? `$${property.priceUSD.toLocaleString()}`
    : `${property.priceEGP.toLocaleString()} ج.م`;

  const downPaymentAmount = currency === 'USD'
    ? Math.round(property.priceUSD * (property.paymentPlan.downPaymentPercent / 100))
    : Math.round(property.priceEGP * (property.paymentPlan.downPaymentPercent / 100));

  const displayDownPayment = currency === 'USD'
    ? `$${downPaymentAmount.toLocaleString()}`
    : `${downPaymentAmount.toLocaleString()} ج.م`;

  const remainingYears = property.paymentPlan.installmentsYears;
  const totalMonths = remainingYears * 12;
  const remainingBalance = currency === 'USD'
    ? property.priceUSD - downPaymentAmount
    : property.priceEGP - downPaymentAmount;

  const monthlyEst = Math.round(remainingBalance / totalMonths);
  const displayMonthlyEst = currency === 'USD'
    ? `$${monthlyEst.toLocaleString()}`
    : `${monthlyEst.toLocaleString()} ج.م`;

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) return;

    addLead({
      propertyId: property.id,
      propertyTitle: property.title[lang],
      clientName,
      clientPhone,
      clientEmail: clientEmail || undefined,
      message: `طلب معاينة VIP بتاريخ ${preferredDate || 'بأقرب وقت'}. ملاحظات: ${notes || 'لا يوجد'}`,
      type: 'vip_viewing'
    });

    setBookingSuccess(true);
  };

  const handleWhatsAppBooking = () => {
    const text = lang === 'ar'
      ? `مرحباً بتاح للاستثمار العقاري، أود حجز معاينة خاصة للوحدة كود (${property.refCode}) - ${property.title.ar}، بسعر ${displayPrice}. هل يمكن ترتيب موعد مع استشاري المبيعات؟`
      : `Hello Ptah Real Estate, I would like to schedule a private VIP viewing for property ref (${property.refCode}) - ${property.title.en}, priced at ${displayPrice}. Please connect me with a Senior Advisor.`;
    window.open(`https://wa.me/${SOCIAL_LINKS.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#090a10] border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl my-auto text-neutral-100 flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-neutral-900/90 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold">
              {property.refCode}
            </span>
            <span className="text-xs text-neutral-400 font-medium hidden sm:inline">
              {property.compound} • {property.developer}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={SOCIAL_LINKS.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-500/20"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'الموقع على خرائط جوجل' : 'Google Maps Location'}</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-950 border border-white/5">
              <img
                src={property.images[activeImgIndex] || property.images[0]}
                alt={property.title[lang]}
                className="w-full h-full object-cover"
              />

              {property.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImgIndex((prev) => (prev > 0 ? prev - 1 : property.images.length - 1))}
                    className="absolute start-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setActiveImgIndex((prev) => (prev < property.images.length - 1 ? prev + 1 : 0))}
                    className="absolute end-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 start-4 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-xs text-amber-400 font-bold border border-amber-500/30 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{property.locationName[lang]}</span>
              </div>
            </div>

            {/* Thumbnail Row */}
            {property.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {property.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImgIndex(i)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeImgIndex === i ? 'border-amber-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Core Price Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
                <span>{property.developer}</span>
                <span>•</span>
                <span>{tTypes[property.type]}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {property.title[lang]}
              </h2>
            </div>

            <div className="text-start md:text-end bg-neutral-900/60 p-4 rounded-2xl border border-white/5 min-w-[220px]">
              <div className="text-xs text-neutral-400 font-medium">
                {lang === 'ar' ? 'السعر الكلي للوحدة' : 'Total Investment Price'}
              </div>
              <div className="text-2xl font-black text-gold-gradient font-sans">
                {displayPrice}
              </div>
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <div>
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3">
              {t.specsTitle}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <div className="bg-neutral-900/80 p-3.5 rounded-2xl border border-white/5 text-center">
                <Maximize2 className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
                <div className="text-[11px] text-neutral-400">{t.area}</div>
                <div className="text-sm font-bold text-white">{property.areaSqm} {t.sqm}</div>
              </div>

              <div className="bg-neutral-900/80 p-3.5 rounded-2xl border border-white/5 text-center">
                <Bed className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
                <div className="text-[11px] text-neutral-400">{t.beds}</div>
                <div className="text-sm font-bold text-white">{property.bedrooms}</div>
              </div>

              <div className="bg-neutral-900/80 p-3.5 rounded-2xl border border-white/5 text-center">
                <Bath className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
                <div className="text-[11px] text-neutral-400">{t.baths}</div>
                <div className="text-sm font-bold text-white">{property.bathrooms}</div>
              </div>

              <div className="bg-neutral-900/80 p-3.5 rounded-2xl border border-white/5 text-center">
                <Calendar className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
                <div className="text-[11px] text-neutral-400">{t.delivery}</div>
                <div className="text-sm font-bold text-white">
                  {property.status === 'ready' ? tCatalog.readyBadge : property.deliveryYear}
                </div>
              </div>

              <div className="bg-neutral-900/80 p-3.5 rounded-2xl border border-white/5 text-center">
                <ShieldCheck className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
                <div className="text-[11px] text-neutral-400">{t.developer}</div>
                <div className="text-xs font-bold text-white truncate">{property.developer}</div>
              </div>

              <div className="bg-neutral-900/80 p-3.5 rounded-2xl border border-white/5 text-center">
                <MapPin className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
                <div className="text-[11px] text-neutral-400">{t.compound}</div>
                <div className="text-xs font-bold text-white truncate">{property.compound}</div>
              </div>
            </div>
          </div>

          {/* Payment Plan & Mortgage Calculation */}
          <div className="bg-[#0e1019] border border-amber-500/20 rounded-3xl p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                {t.paymentPlanTitle}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="bg-neutral-900/80 p-4 rounded-2xl border border-white/5">
                <div className="text-xs text-neutral-400 mb-1">
                  {t.downPayment} ({property.paymentPlan.downPaymentPercent}%)
                </div>
                <div className="text-lg font-bold text-white">
                  {displayDownPayment}
                </div>
              </div>

              <div className="bg-neutral-900/80 p-4 rounded-2xl border border-white/5">
                <div className="text-xs text-neutral-400 mb-1">
                  {t.yearsInstallment}
                </div>
                <div className="text-lg font-bold text-amber-400">
                  {property.paymentPlan.installmentsYears} {translations[lang].search.years} ({totalMonths} {lang === 'ar' ? 'شهر' : 'Months'})
                </div>
              </div>

              <div className="bg-neutral-900/80 p-4 rounded-2xl border border-white/5">
                <div className="text-xs text-neutral-400 mb-1">
                  {t.monthlyEst}
                </div>
                <div className="text-lg font-bold text-emerald-400">
                  {displayMonthlyEst}
                </div>
              </div>
            </div>
            
            <p className="text-xs text-neutral-400">
              {lang === 'ar' 
                ? '* تتوفر أنظمة سداد مخصصة وخصومات فورية للدفع الكاش، مع إمكانية جدولة الأقساط بشكل ربع سنوي أو نصف سنوي حسب رغبتكم.'
                : '* Custom payment structures and cash discounts available. Installments can be tailored quarterly or semi-annually upon request.'}
            </p>
          </div>

          {/* Architectural Description */}
          <div>
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-2">
              {t.descriptionTitle}
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed bg-neutral-900/40 p-4 rounded-2xl border border-white/5">
              {property.description[lang]}
            </p>
          </div>

          {/* Amenities & Luxury Perks */}
          <div>
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3">
              {t.amenitiesTitle}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {property.amenities.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 bg-neutral-900/70 p-3 rounded-xl border border-white/5 text-xs text-neutral-200">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{item[lang]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Book Private VIP Viewing Form */}
          <div className="bg-gradient-to-br from-neutral-900 to-[#121420] border border-amber-500/30 rounded-3xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>{t.bookViewingTitle}</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  {lang === 'ar' 
                    ? 'سيقوم كبير مستشاري بتاح العقاريين بالتواصل معكم وتأكيد موعد المعاينة وتوفير سيارة خاصة لنقلكم للموقع.'
                    : 'A Ptah Senior Real Estate Consultant will coordinate your private chauffeur-driven property site tour.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleWhatsAppBooking}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shrink-0 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp VIP</span>
              </button>
            </div>

            {bookingSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{t.bookingSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    {t.fullName} *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-400 absolute top-1/2 -translate-y-1/2 start-3" />
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder={lang === 'ar' ? 'الاسم الثلاثي' : 'John Doe'}
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl py-2.5 ps-9 pe-3 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    {t.phone} *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-400 absolute top-1/2 -translate-y-1/2 start-3" />
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+20 100 ..."
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl py-2.5 ps-9 pe-3 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    {t.email}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute top-1/2 -translate-y-1/2 start-3" />
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="client@example.com"
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl py-2.5 ps-9 pe-3 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    {t.preferredDate}
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-neutral-400 absolute top-1/2 -translate-y-1/2 start-3" />
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl py-2.5 ps-9 pe-3 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    {t.notes}
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={lang === 'ar' ? 'أي تفاصيل خاصة بتوقيت المعاينة أو أسئلة استثمارية...' : 'Any specific time requirements or investment goals...'}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gold-gradient text-neutral-950 font-black text-sm flex items-center gap-2 hover:opacity-95 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.submitBooking}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
