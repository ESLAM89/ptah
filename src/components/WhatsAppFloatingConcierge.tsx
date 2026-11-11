import React, { useState } from 'react';
import { 
  MessageCircle, 
  X, 
  Sparkles, 
  ChevronUp, 
  Send, 
  ShieldCheck, 
  Headphones 
} from 'lucide-react';
import { Language } from '../types';
import { SOCIAL_LINKS, getStoredCompanySettings } from '../data/mockProperties';

interface WhatsAppFloatingProps {
  lang: Language;
}

export const WhatsAppFloatingConcierge: React.FC<WhatsAppFloatingProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);

  const quickPrompts = lang === 'ar' ? [
    { title: 'استفسار عن خطط السداد والتقسيط', text: 'مرحباً، أود الاستفسار عن تفاصيل خطط السداد وأطول فترات التقسيط المتاحة للمشاريع الحالية.' },
    { title: 'معاينة الموقع بالعاشر من رمضان والشرقية', text: 'مرحباً، أود التنسيق لزيارة ومعاينة ميدانية للوحدات المتاحة بالعاشر من رمضان والشرقية.' },
    { title: 'التحدث مع استشاري مبيعات كبير', text: 'مرحباً، أود التحدث هاتفياً أو عبر الواتساب مع كبير مستشاري بتاح العقاريين.' },
    { title: 'طلب بروشور المشروعات الفاخرة', text: 'مرحباً، برجاء إرسال أحدث ملفات المشروعات بالعاشر من رمضان والقاهرة الجديدة.' }
  ] : [
    { title: 'Inquire About Flexible Payment Plans', text: 'Hello, I would like to inquire about payment plan options and down payment requirements for prime properties.' },
    { title: '10th of Ramadan & Sharqia Site Visit', text: 'Hello, I would like to schedule an on-site property viewing in 10th of Ramadan / Sharqia.' },
    { title: 'Speak with Senior Property Advisor', text: 'Hello, please connect me directly with a Ptah Senior Property Advisor.' },
    { title: 'Request Curated Project Portfolio', text: 'Hello, please share the latest luxury portfolio brochure and price lists.' }
  ];

  const handleLaunchWhatsApp = (messageText: string) => {
    const settings = getStoredCompanySettings();
    const cleanNumber = (settings.whatsappNumber || SOCIAL_LINKS.whatsappNumber).replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 end-6 z-40">
      
      {/* Floating Popup Window */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-neutral-950 border border-emerald-500/40 rounded-3xl p-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-200 text-neutral-100">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{lang === 'ar' ? 'كونسيرج بتاح 24/7' : 'Ptah 24/7 Concierge'}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[10px] text-emerald-400 font-medium">
                  {lang === 'ar' ? 'متاح للرد الفوري خلال 60 ثانية' : 'Online • Replies in < 60s'}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Option Prompts */}
          <div className="py-3 space-y-2">
            <p className="text-[11px] text-neutral-400">
              {lang === 'ar' ? 'اختر نوع الاستفسار لبدء المحادثة فوراً على الواتساب:' : 'Select inquiry prompt to start instant WhatsApp chat:'}
            </p>

            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleLaunchWhatsApp(q.text)}
                className="w-full text-start p-2.5 rounded-xl bg-neutral-900/90 hover:bg-emerald-950/40 border border-white/5 hover:border-emerald-500/30 text-xs font-medium text-neutral-200 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
              >
                <span className="line-clamp-1">{q.title}</span>
                <Send className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>

          {/* Direct Custom WhatsApp CTA */}
          <button
            onClick={() => handleLaunchWhatsApp(lang === 'ar' ? 'مرحباً، أود التحدث مع مستشار عقاري من بتاح.' : 'Hello, I would like to chat with a Ptah property advisor.')}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/30 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{lang === 'ar' ? 'فتح محادثة واتساب مباشرة' : 'Open Direct WhatsApp'}</span>
          </button>

          {/* Trust Footnote */}
          <div className="pt-2 text-center text-[10px] text-neutral-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            <span>{SOCIAL_LINKS.domain} • {SOCIAL_LINKS.whatsappDisplay}</span>
          </div>

        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-2xl shadow-emerald-600/40 transition-all hover:scale-105 cursor-pointer border border-emerald-400/30"
        aria-label="Direct WhatsApp Concierge"
      >
        <span className="relative flex h-3 w-3">
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>
        <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
        <span className="hidden sm:inline font-sans">
          {lang === 'ar' ? 'واتساب 24/7' : 'WhatsApp 24/7'}
        </span>
      </button>

    </div>
  );
};
