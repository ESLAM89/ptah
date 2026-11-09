import React, { useState } from 'react';
import { 
  Headphones, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  Send, 
  ShieldCheck,
  ChevronDown,
  MapPin
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { SOCIAL_LINKS, addLead } from '../data/mockProperties';

interface SupportSectionProps {
  lang: Language;
}

export const SupportSection: React.FC<SupportSectionProps> = ({ lang }) => {
  const t = translations[lang].support;
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [ticketName, setTicketName] = useState('');
  const [ticketPhone, setTicketPhone] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const openWhatsApp = () => {
    const text = lang === 'ar'
      ? 'مرحباً، أود التواصل مع فريق الدعم الفني والاستشارات العقارية في بتاح على مدار الساعة.'
      : 'Hello, I would like to reach Ptah 24/7 technical and advisory support.';
    window.open(`https://wa.me/${SOCIAL_LINKS.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketName || !ticketPhone) return;

    addLead({
      clientName: ticketName,
      clientPhone: ticketPhone,
      message: `[دعم فني واستشارة 24/7]: ${ticketMessage}`,
      type: 'consultation'
    });

    setTicketSubmitted(true);
  };

  const faqs = [
    { q: t.faq1Q, a: t.faq1A },
    { q: t.faq2Q, a: t.faq2A },
    { q: t.faq3Q, a: t.faq3A }
  ];

  return (
    <div className="w-full py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-16 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{t.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          {t.title}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          {t.subtitle}
        </p>
      </div>

      {/* Support Contact Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* WhatsApp 24/7 Channel */}
        <div className="bg-gradient-to-b from-[#0f1715] to-[#0a100d] border border-emerald-500/30 p-6 rounded-3xl space-y-4 hover:border-emerald-500/60 transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              {t.whatsappDirect}
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {t.whatsappDesc}
            </p>
          </div>

          <div className="pt-4">
            <div className="text-xs font-mono text-emerald-400 font-bold mb-3">
              {SOCIAL_LINKS.whatsappDisplay}
            </div>
            <button
              onClick={openWhatsApp}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{lang === 'ar' ? 'بدء محادثة واتساب الآن' : 'Start WhatsApp Chat'}</span>
            </button>
          </div>
        </div>

        {/* Direct Phone Channel */}
        <div className="bg-neutral-900/60 border border-white/10 p-6 rounded-3xl space-y-4 hover:border-amber-500/30 transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              {t.phoneCall}
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {lang === 'ar' ? 'خط ساخن مخصص لعملاء المشروعات الفاخرة والاستشارات' : 'VIP dedicated telephone hotline for luxury acquisitions'}
            </p>
          </div>

          <div className="pt-4">
            <div className="text-xs font-mono text-neutral-200 font-bold mb-3">
              {SOCIAL_LINKS.phone}
            </div>
            <a
              href={`tel:${SOCIAL_LINKS.phone.replace(/[^0-9+]/g, '')}`}
              className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors block text-center"
            >
              <Phone className="w-4 h-4 inline-block" />
              <span>{lang === 'ar' ? 'اتصال هاتفي مباشر' : 'Call Phone Line'}</span>
            </a>
          </div>
        </div>

        {/* Corporate HQ Lounge */}
        <div className="bg-neutral-900/60 border border-white/10 p-6 rounded-3xl space-y-4 hover:border-amber-500/30 transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              {t.officeVisit}
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {lang === 'ar' ? SOCIAL_LINKS.addressAr : SOCIAL_LINKS.addressEn}
            </p>
          </div>

          <div className="pt-4 space-y-2">
            <a
              href={SOCIAL_LINKS.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-red-600/20"
            >
              <MapPin className="w-4 h-4" />
              <span>{lang === 'ar' ? 'فتح الموقع في خرائط جوجل' : 'Open in Google Maps'}</span>
            </a>

            <a
              href={`mailto:${SOCIAL_LINKS.email}`}
              className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors block text-center"
            >
              <Mail className="w-4 h-4 inline-block" />
              <span>{lang === 'ar' ? 'إرسال بريد إلكتروني' : 'Email Concierge'}</span>
            </a>
          </div>
        </div>

      </div>

      {/* Ticket / Rapid Callback Form */}
      <div className="bg-gradient-to-r from-neutral-900 via-[#10121d] to-neutral-900 border border-amber-500/25 rounded-3xl p-6 sm:p-10">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {lang === 'ar' ? 'طلب معاودة اتصال أو دعم استشاري فوري' : 'Request Instant Callback or Advisory Ticket'}
            </h2>
            <p className="text-xs text-neutral-400">
              {lang === 'ar' ? 'اترك بياناتك وسيتصل بك استشاري بتاح خلال دقائق معدودة' : 'Leave your contact info and our Senior Consultant will call you promptly'}
            </p>
          </div>

          {ticketSubmitted ? (
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{lang === 'ar' ? 'تم استلام طلبكم بنجاح! سيتم التواصل معكم فوراً.' : 'Ticket received! Our advisor is reviewing your request now.'}</span>
            </div>
          ) : (
            <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  {lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={ticketName}
                  onChange={(e) => setTicketName(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  {lang === 'ar' ? 'رقم الهاتف / الواتساب' : 'Phone / WhatsApp'} *
                </label>
                <input
                  type="tel"
                  required
                  value={ticketPhone}
                  onChange={(e) => setTicketPhone(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  {lang === 'ar' ? 'تفاصيل الاستفسار أو الدعم المطلوب' : 'Inquiry or Support Message'}
                </label>
                <textarea
                  rows={3}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder={lang === 'ar' ? 'أود الاستفسار عن وحدات الاستلام الفوري...' : 'Inquiring about immediate handover units...'}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gold-gradient text-neutral-950 font-black text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إرسال طلب الدعم الفوري' : 'Submit Support Request'}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white">
            {t.faqTitle}
          </h2>
          <p className="text-xs text-neutral-400">
            {lang === 'ar' ? 'إجابات واضحة عن كل ما يخص المعاينة الافتراضية وإجراءات التعاقد' : 'Clear answers about 3D VR tours, remote purchasing, and legal protections'}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div 
              key={i}
              className="bg-neutral-900/60 border border-white/10 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-4 text-start font-bold text-xs sm:text-sm text-white flex items-center justify-between gap-3 hover:bg-neutral-800/40 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-amber-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>

              {openFaq === i && (
                <div className="p-4 pt-0 text-xs text-neutral-300 leading-relaxed border-t border-white/5">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
