import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Phone, 
  User, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  MessageCircle,
  Building2
} from 'lucide-react';
import { Language, Currency } from '../types';
import { SOCIAL_LINKS, addLead } from '../data/mockProperties';

interface ConsultationModalProps {
  lang: Language;
  currency: Currency;
  onClose: () => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  lang,
  currency,
  onClose
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('new_cairo');
  const [budget, setBudget] = useState('20m_40m');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    addLead({
      clientName: name,
      clientPhone: phone,
      clientEmail: email || undefined,
      message: `طلب استشارة VIP: المنطقة المفضلة (${preferredLocation})، الميزانية (${budget}). ملاحظات: ${notes || 'لا يوجد'}`,
      type: 'consultation'
    });

    setIsSuccess(true);
  };

  const handleWhatsAppDirect = () => {
    const text = lang === 'ar'
      ? `مرحباً بتاح للاستثمار العقاري، اسمي ${name || 'عميل مهتم'}، أود حجز جلسة استشارية خاصة لمناقشة الفرص الاستثمارية في مصر.`
      : `Hello Ptah Real Estate, my name is ${name || 'Interested Client'}, I would like to schedule a private VIP advisory consultation.`;
    window.open(`https://wa.me/${SOCIAL_LINKS.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0c0d16] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-neutral-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                {lang === 'ar' ? 'طلب استشارة عقارية VIP' : 'Request VIP Advisory Session'}
              </h3>
              <p className="text-xs text-neutral-400">
                {lang === 'ar' ? 'جلسة مجانية مع خبير استثماري معتمد' : 'Complimentary session with certified wealth advisor'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white">
              {lang === 'ar' ? 'تم استلام طلبكم بنجاح!' : 'Consultation Request Confirmed!'}
            </h4>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-sm mx-auto">
              {lang === 'ar'
                ? 'سيتواصل معكم أحد كبار مديري الاستثمار في بتاح خلال أقل من 15 دقيقة لترتيب موعد المكالمة أو المعاينة الميدانية.'
                : 'A Ptah Senior Partner will reach out in under 15 minutes to coordinate your executive session.'}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs"
            >
              {lang === 'ar' ? 'حسناً، إغلاق' : 'Close'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">
                {lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'} *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute top-1/2 -translate-y-1/2 start-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'ar' ? 'محمد إبراهيم' : 'Alexander Wright'}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl py-2.5 ps-9 pe-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">
                {lang === 'ar' ? 'رقم الهاتف / الواتساب' : 'Phone / WhatsApp'} *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 absolute top-1/2 -translate-y-1/2 start-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+20 100 ..."
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl py-2.5 ps-9 pe-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">
                {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute top-1/2 -translate-y-1/2 start-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="investor@example.com"
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl py-2.5 ps-9 pe-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  {lang === 'ar' ? 'المنطقة المفضلة' : 'Target District'}
                </label>
                <select
                  value={preferredLocation}
                  onChange={(e) => setPreferredLocation(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white cursor-pointer"
                >
                  <option value="tenth_of_ramadan">{lang === 'ar' ? 'العاشر من رمضان (الشرقية)' : '10th of Ramadan (Sharqia)'}</option>
                  <option value="new_cairo">{lang === 'ar' ? 'القاهرة الجديدة' : 'New Cairo'}</option>
                  <option value="north_coast">{lang === 'ar' ? 'الساحل الشمالي' : 'North Coast'}</option>
                  <option value="sheikh_zayed">{lang === 'ar' ? 'الشيخ زايد' : 'Sheikh Zayed'}</option>
                  <option value="new_capital">{lang === 'ar' ? 'العاصمة الإدارية' : 'New Capital'}</option>
                  <option value="el_gouna">{lang === 'ar' ? 'الجونة' : 'El Gouna'}</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  {lang === 'ar' ? 'الميزانية التقريبية' : 'Budget Range'}
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white cursor-pointer"
                >
                  <option value="15m_25m">{currency === 'USD' ? '$300k - $500k' : '15 - 25 مليون ج.م'}</option>
                  <option value="25m_50m">{currency === 'USD' ? '$500k - $1M' : '25 - 50 مليون ج.م'}</option>
                  <option value="50m_plus">{currency === 'USD' ? '$1M+ Luxury' : '50+ مليون ج.م'}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">
                {lang === 'ar' ? 'ملاحظات أو أسئلة استثمارية' : 'Specific Requirements'}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={lang === 'ar' ? 'استلام فوري، حمام سباحة خاص، تفضيلات مطور معين...' : 'Ready to move, golf view, specific developer...'}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gold-gradient text-neutral-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تأكيد طلب الاستشارة الآن' : 'Confirm Advisory Request'}</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppDirect}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{lang === 'ar' ? 'التحدث عبر الواتساب فوراً' : 'Or Inquire on WhatsApp Directly'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
