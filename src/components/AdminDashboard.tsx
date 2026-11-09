import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Search, 
  RotateCcw, 
  Phone, 
  MessageCircle, 
  Calendar, 
  DollarSign, 
  Building2, 
  Users, 
  ExternalLink,
  ShieldCheck,
  Save,
  Download,
  Globe,
  LogOut
} from 'lucide-react';
import { Property, LeadInquiry, Language, Currency, PropertyType, LocationKey } from '../types';
import { translations } from '../i18n/translations';
import { SOCIAL_LINKS, resetPropertiesToDefault } from '../data/mockProperties';

interface AdminDashboardProps {
  properties: Property[];
  onUpdateProperties: (newProps: Property[]) => void;
  leads: LeadInquiry[];
  onUpdateLeads: (newLeads: LeadInquiry[]) => void;
  lang: Language;
  currency: Currency;
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  properties,
  onUpdateProperties,
  leads,
  onUpdateLeads,
  lang,
  currency,
  onLogout
}) => {
  const t = translations[lang].admin;
  const tTypes = translations[lang].propertyTypes;
  const tLocs = translations[lang].locations;

  const [activeTab, setActiveTab] = useState<'properties' | 'leads' | 'social' | 'domain'>('properties');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Property Add/Edit Modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    titleAr: '',
    titleEn: '',
    refCode: '',
    compound: '',
    developer: '',
    location: 'new_cairo' as LocationKey,
    type: 'villa' as PropertyType,
    priceEGP: 25000000,
    priceUSD: 520000,
    areaSqm: 350,
    bedrooms: 4,
    bathrooms: 4,
    deliveryYear: 2025,
    status: 'ready' as 'ready' | 'under_construction',
    downPaymentPercent: 10,
    installmentsYears: 7,
    monthlyInstallmentEGP: 250000,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    model3DPreset: 'villa' as 'villa' | 'tower' | 'penthouse',
    descriptionAr: '',
    descriptionEn: '',
    featured: false
  });

  // Calculate Real-time Dashboard KPIs
  const totalValueEGP = properties.reduce((acc, p) => acc + p.priceEGP, 0);
  const totalValueUSD = properties.reduce((acc, p) => acc + p.priceUSD, 0);
  const featuredCount = properties.filter(p => p.featured).length;

  const displayTotalValue = currency === 'USD'
    ? `$${(totalValueUSD / 1000000).toFixed(1)}M`
    : `${(totalValueEGP / 1000000).toFixed(1)}M ج.م`;

  // Filter properties in table
  const filteredProperties = properties.filter(p => 
    p.title.ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.refCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.compound.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.developer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingPropertyId(null);
    setFormData({
      titleAr: '',
      titleEn: '',
      refCode: `PT-${Math.floor(100 + Math.random() * 900)}`,
      compound: '',
      developer: '',
      location: 'new_cairo',
      type: 'villa',
      priceEGP: 30000000,
      priceUSD: 625000,
      areaSqm: 400,
      bedrooms: 4,
      bathrooms: 5,
      deliveryYear: 2025,
      status: 'ready',
      downPaymentPercent: 10,
      installmentsYears: 7,
      monthlyInstallmentEGP: 320000,
      imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80',
      model3DPreset: 'villa',
      descriptionAr: 'عقار فاخر بتشطيبات مميزة وموقع استراتيجي متكامل الخدمات.',
      descriptionEn: 'Luxury residence featuring premium finishing and prime strategic location.',
      featured: false
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (prop: Property) => {
    setEditingPropertyId(prop.id);
    setFormData({
      titleAr: prop.title.ar,
      titleEn: prop.title.en,
      refCode: prop.refCode,
      compound: prop.compound,
      developer: prop.developer,
      location: prop.location,
      type: prop.type,
      priceEGP: prop.priceEGP,
      priceUSD: prop.priceUSD,
      areaSqm: prop.areaSqm,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      deliveryYear: prop.deliveryYear,
      status: prop.status,
      downPaymentPercent: prop.paymentPlan.downPaymentPercent,
      installmentsYears: prop.paymentPlan.installmentsYears,
      monthlyInstallmentEGP: prop.paymentPlan.monthlyInstallmentEGP || 0,
      imageUrl: prop.images[0] || '',
      model3DPreset: prop.model3DPreset,
      descriptionAr: prop.description.ar,
      descriptionEn: prop.description.en,
      featured: prop.featured
    });
    setIsFormModalOpen(true);
  };

  const handleDeleteProperty = (id: string) => {
    if (window.confirm(t.actions.confirmDelete)) {
      const updated = properties.filter(p => p.id !== id);
      onUpdateProperties(updated);
    }
  };

  const handleToggleFeatured = (id: string) => {
    const updated = properties.map(p => {
      if (p.id === id) {
        return { ...p, featured: !p.featured };
      }
      return p;
    });
    onUpdateProperties(updated);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const locationNameMap: Record<LocationKey, { ar: string; en: string }> = {
      tenth_of_ramadan: { ar: 'العاشر من رمضان، محافظة الشرقية', en: '10th of Ramadan City, Sharqia' },
      new_cairo: { ar: 'القاهرة الجديدة، التجمع الخامس', en: 'New Cairo, 5th Settlement' },
      new_capital: { ar: 'العاصمة الإدارية الجديدة', en: 'New Administrative Capital' },
      sheikh_zayed: { ar: 'الشيخ زايد، الجيزة', en: 'Sheikh Zayed, Giza' },
      north_coast: { ar: 'الساحل الشمالي، البحر المتوسط', en: 'North Coast & Ras El Hekma' },
      el_gouna: { ar: 'الجونة، البحر الأحمر', en: 'El Gouna, Red Sea' },
      october_city: { ar: 'مدينة السادس من أكتوبر', en: '6th of October City' }
    };

    if (editingPropertyId) {
      // Update existing
      const updated = properties.map(p => {
        if (p.id === editingPropertyId) {
          return {
            ...p,
            refCode: formData.refCode,
            title: { ar: formData.titleAr, en: formData.titleEn },
            compound: formData.compound,
            developer: formData.developer,
            location: formData.location,
            locationName: locationNameMap[formData.location],
            type: formData.type,
            priceEGP: Number(formData.priceEGP),
            priceUSD: Number(formData.priceUSD),
            areaSqm: Number(formData.areaSqm),
            bedrooms: Number(formData.bedrooms),
            bathrooms: Number(formData.bathrooms),
            deliveryYear: Number(formData.deliveryYear),
            status: formData.status,
            featured: formData.featured,
            paymentPlan: {
              downPaymentPercent: Number(formData.downPaymentPercent),
              installmentsYears: Number(formData.installmentsYears),
              monthlyInstallmentEGP: Number(formData.monthlyInstallmentEGP)
            },
            description: { ar: formData.descriptionAr, en: formData.descriptionEn },
            images: [formData.imageUrl, ...p.images.slice(1)],
            model3DPreset: formData.model3DPreset
          };
        }
        return p;
      });
      onUpdateProperties(updated);
    } else {
      // Add new
      const newProperty: Property = {
        id: `ptah-prop-${Date.now()}`,
        refCode: formData.refCode,
        title: { ar: formData.titleAr, en: formData.titleEn },
        compound: formData.compound,
        developer: formData.developer,
        location: formData.location,
        locationName: locationNameMap[formData.location],
        type: formData.type,
        priceEGP: Number(formData.priceEGP),
        priceUSD: Number(formData.priceUSD),
        areaSqm: Number(formData.areaSqm),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        deliveryYear: Number(formData.deliveryYear),
        status: formData.status,
        featured: formData.featured,
        paymentPlan: {
          downPaymentPercent: Number(formData.downPaymentPercent),
          installmentsYears: Number(formData.installmentsYears),
          monthlyInstallmentEGP: Number(formData.monthlyInstallmentEGP)
        },
        description: { ar: formData.descriptionAr, en: formData.descriptionEn },
        amenities: [
          { ar: 'تشطيب فندقي فاخر', en: 'Luxury Hotel Finishing' },
          { ar: 'حراسة وأمن 24/7', en: '24/7 Security' },
          { ar: 'إطلالة مفتوحة', en: 'Open Panoramic View' }
        ],
        images: [formData.imageUrl],
        model3DPreset: formData.model3DPreset,
        vrRooms: [
          {
            id: 'room-1',
            name: { ar: 'صالة الاستقبال الرئيسية', en: 'Grand Reception Salon' },
            description: { ar: 'مساحة فسيحة مع واجهات زجاجية وإضاءة عصرية', en: 'Spacious area with panoramic glazing and modern lighting' },
            panoramaTheme: 'living',
            hotspots: []
          }
        ],
        createdAt: new Date().toISOString().split('T')[0]
      };
      onUpdateProperties([newProperty, ...properties]);
    }

    setIsFormModalOpen(false);
  };

  const handleUpdateLeadStatus = (leadId: string, newStatus: LeadInquiry['status']) => {
    const updated = leads.map(l => {
      if (l.id === leadId) {
        return { ...l, status: newStatus };
      }
      return l;
    });
    onUpdateLeads(updated);
  };

  const handleLeadWhatsApp = (lead: LeadInquiry) => {
    const phoneNum = lead.clientPhone.replace(/[^0-9]/g, '');
    const text = lang === 'ar'
      ? `مرحباً أستاذ ${lead.clientName}، نتواصل معكم من شركة بتاح للاستثمار العقاري بخصوص طلبكم لمعاينة (${lead.propertyTitle || 'وحدة سكنية فاخرة'}). يسعدنا ترتيب الموعد المناسب لسيادتكم.`
      : `Hello ${lead.clientName}, contacting you from Ptah Real Estate regarding your inquiry for (${lead.propertyTitle || 'Luxury Property'}). We are pleased to coordinate your private consultation.`;
    window.open(`https://wa.me/${phoneNum}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleResetToDefaults = () => {
    if (window.confirm('هل تريد استرجاع العقارات الافتراضية؟')) {
      const def = resetPropertiesToDefault();
      onUpdateProperties(def);
    }
  };

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-neutral-900 via-[#10121d] to-neutral-900 p-6 rounded-3xl border border-amber-500/25 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Ptah Live Real-time CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {t.dashboardTitle}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            {t.dashboardSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/ptah-website.zip"
            download="ptah-website.zip"
            className="px-3.5 py-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            title={lang === 'ar' ? 'تحميل ملفات الموقع الكاملة لرفعها على استضافتك أو الدومين' : 'Download complete production files'}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'تحميل ملفات الموقع (ZIP)' : 'Download Build (ZIP)'}</span>
          </a>

          <button
            onClick={handleResetToDefaults}
            className="px-3.5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetData}</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-gold-gradient text-neutral-950 font-black text-xs flex items-center gap-2 hover:opacity-95 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addNewProperty}</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="px-3.5 py-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              title={lang === 'ar' ? 'تسجيل الخروج والعودة لصفحة الزوار' : 'Log out to visitor view'}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'تسجيل خروج الإدارة' : 'Owner Logout'}</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900/80 p-5 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>{t.stats.totalProps}</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-sans">
            {properties.length}
          </div>
        </div>

        <div className="bg-neutral-900/80 p-5 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>{t.stats.portfolioValue}</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-gold-gradient font-sans">
            {displayTotalValue}
          </div>
        </div>

        <div className="bg-neutral-900/80 p-5 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>{t.stats.leadsCount}</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-sans">
            {leads.length}
          </div>
        </div>

        <div className="bg-neutral-900/80 p-5 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>{t.stats.featuredCount}</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-sans">
            {featuredCount}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('properties')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'properties'
              ? 'bg-amber-500 text-neutral-950'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{t.tabs.properties} ({properties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'leads'
              ? 'bg-amber-500 text-neutral-950'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t.tabs.leads} ({leads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('domain')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'domain'
              ? 'bg-amber-500 text-neutral-950'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>{lang === 'ar' ? 'ربط الدومين الخاص' : 'Custom Domain'}</span>
        </button>

        <button
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'social'
              ? 'bg-amber-500 text-neutral-950'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{t.tabs.systemInfo}</span>
        </button>
      </div>

      {/* Tab 1: Properties Table */}
      {activeTab === 'properties' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute top-1/2 -translate-y-1/2 start-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.filterPlaceholder}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl py-2 ps-9 pe-3 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <span className="text-xs text-neutral-400">
              {filteredProperties.length} {lang === 'ar' ? 'عقار' : 'Properties'}
            </span>
          </div>

          <div className="bg-neutral-900/60 rounded-2xl border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs text-neutral-300">
                <thead className="bg-neutral-950/80 text-neutral-400 font-medium uppercase text-[11px] border-b border-white/10">
                  <tr>
                    <th className="p-3.5 text-start">{t.table.ref}</th>
                    <th className="p-3.5 text-start">{t.table.title}</th>
                    <th className="p-3.5 text-start">{t.table.location}</th>
                    <th className="p-3.5 text-start">{t.table.type}</th>
                    <th className="p-3.5 text-start">{t.table.price}</th>
                    <th className="p-3.5 text-center">{t.table.status}</th>
                    <th className="p-3.5 text-center">{t.table.featured}</th>
                    <th className="p-3.5 text-end">{t.table.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredProperties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-neutral-800/50 transition-colors">
                      <td className="p-3.5 font-mono text-amber-400 font-bold whitespace-nowrap">
                        {prop.refCode}
                      </td>
                      <td className="p-3.5 font-bold text-white max-w-xs truncate">
                        {prop.title[lang]}
                        <div className="text-[10px] text-neutral-400 font-normal">
                          {prop.compound} • {prop.developer}
                        </div>
                      </td>
                      <td className="p-3.5 whitespace-nowrap text-neutral-300">
                        {prop.locationName[lang]}
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-[10px]">
                          {tTypes[prop.type]}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-white font-sans whitespace-nowrap">
                        {currency === 'USD' ? `$${prop.priceUSD.toLocaleString()}` : `${prop.priceEGP.toLocaleString()} ج.م`}
                      </td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          prop.status === 'ready'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {prop.status === 'ready' ? (lang === 'ar' ? 'استلام فوري' : 'Ready') : prop.deliveryYear}
                        </span>
                      </td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleToggleFeatured(prop.id)}
                          className={`p-1 rounded-lg transition-colors cursor-pointer ${
                            prop.featured ? 'text-amber-400 hover:text-amber-300' : 'text-neutral-600 hover:text-neutral-400'
                          }`}
                          title="Toggle Featured"
                        >
                          <Sparkles className="w-4 h-4 fill-current" />
                        </button>
                      </td>
                      <td className="p-3.5 text-end whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(prop)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                            title={t.actions.edit}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProperty(prop.id)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-500/20 text-neutral-300 hover:text-red-400 transition-colors cursor-pointer"
                            title={t.actions.delete}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Leads Management Table */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          <div className="bg-neutral-900/60 rounded-2xl border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs text-neutral-300">
                <thead className="bg-neutral-950/80 text-neutral-400 font-medium uppercase text-[11px] border-b border-white/10">
                  <tr>
                    <th className="p-3.5 text-start">{t.leadTable.clientName}</th>
                    <th className="p-3.5 text-start">{t.leadTable.phone}</th>
                    <th className="p-3.5 text-start">{t.leadTable.property}</th>
                    <th className="p-3.5 text-start">{t.leadTable.type}</th>
                    <th className="p-3.5 text-start">{t.leadTable.date}</th>
                    <th className="p-3.5 text-center">{t.leadTable.status}</th>
                    <th className="p-3.5 text-end">{t.leadTable.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-neutral-800/50 transition-colors">
                      <td className="p-3.5 font-bold text-white whitespace-nowrap">
                        {lead.clientName}
                        {lead.clientEmail && (
                          <div className="text-[10px] text-neutral-400 font-normal">{lead.clientEmail}</div>
                        )}
                      </td>
                      <td className="p-3.5 font-mono text-neutral-200 whitespace-nowrap">
                        {lead.clientPhone}
                      </td>
                      <td className="p-3.5 text-neutral-300 max-w-xs truncate">
                        {lead.propertyTitle || 'استشارة عامة'}
                        <div className="text-[10px] text-neutral-400">{lead.message}</div>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-amber-300 text-[10px]">
                          {lead.type}
                        </span>
                      </td>
                      <td className="p-3.5 text-neutral-400 whitespace-nowrap">
                        {lead.date}
                      </td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as any)}
                          className="bg-neutral-950 border border-white/15 rounded-lg px-2 py-1 text-[11px] text-neutral-200 cursor-pointer"
                        >
                          <option value="new">{t.leadStatuses.new}</option>
                          <option value="contacted">{t.leadStatuses.contacted}</option>
                          <option value="viewing_scheduled">{t.leadStatuses.viewing_scheduled}</option>
                          <option value="closed">{t.leadStatuses.closed}</option>
                        </select>
                      </td>
                      <td className="p-3.5 text-end whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleLeadWhatsApp(lead)}
                            className="p-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                            title="WhatsApp Client"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={`tel:${lead.clientPhone.replace(/[^0-9+]/g, '')}`}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                            title="Call Client"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Official Social Channels & System Links */}
      {activeTab === 'social' && (
        <div className="bg-neutral-900/60 p-6 rounded-3xl border border-white/10 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              {lang === 'ar' ? 'الروابط الرسمية الموثقة لشركة بتاح' : 'Official Verified Ptah Real Estate Links'}
            </h3>
            <p className="text-xs text-neutral-400">
              {lang === 'ar' 
                ? 'جميع الحسابات الرسمية المعتمدة والتي تم ربطها بجميع أنحاء الموقع والفوتر ومحركات البحث.'
                : 'All verified social media channels linked across the web platform, footer, and inquiry widgets.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            <div className="bg-neutral-950 p-4 rounded-2xl border border-white/5 space-y-2">
              <div className="font-bold text-amber-400 flex items-center justify-between">
                <span>الموقع الإلكتروني الرسمي (Official Website)</span>
                <span className="text-emerald-400 text-[10px]">نشط 24/7</span>
              </div>
              <div className="font-mono text-neutral-300 break-all">{SOCIAL_LINKS.domain}</div>
              <a
                href={SOCIAL_LINKS.website}
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:underline flex items-center gap-1 pt-1"
              >
                <span>زيارة الرابط</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-neutral-950 p-4 rounded-2xl border border-white/5 space-y-2">
              <div className="font-bold text-blue-400 flex items-center justify-between">
                <span>Facebook Page</span>
                <span className="text-emerald-400 text-[10px]">Verified</span>
              </div>
              <div className="font-mono text-neutral-300 break-all">{SOCIAL_LINKS.facebook}</div>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline flex items-center gap-1 pt-1"
              >
                <span>فتح صفحة فيسبوك</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-neutral-950 p-4 rounded-2xl border border-white/5 space-y-2">
              <div className="font-bold text-blue-500 flex items-center justify-between">
                <span>LinkedIn Corporate Profile</span>
                <span className="text-emerald-400 text-[10px]">Connected</span>
              </div>
              <div className="font-mono text-neutral-300 break-all">{SOCIAL_LINKS.linkedin}</div>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline flex items-center gap-1 pt-1"
              >
                <span>فتح حساب لينكد إن</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-neutral-950 p-4 rounded-2xl border border-white/5 space-y-2">
              <div className="font-bold text-pink-400 flex items-center justify-between">
                <span>Instagram Profile</span>
                <span className="text-emerald-400 text-[10px]">Active</span>
              </div>
              <div className="font-mono text-neutral-300 break-all">{SOCIAL_LINKS.instagram}</div>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noreferrer"
                className="text-pink-400 hover:underline flex items-center gap-1 pt-1"
              >
                <span>فتح حساب إنستغرام</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-neutral-950 p-4 rounded-2xl border border-white/5 space-y-2">
              <div className="font-bold text-red-500 flex items-center justify-between">
                <span>YouTube Channel</span>
                <span className="text-emerald-400 text-[10px]">Active</span>
              </div>
              <div className="font-mono text-neutral-300 break-all">{SOCIAL_LINKS.youtube}</div>
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noreferrer"
                className="text-red-400 hover:underline flex items-center gap-1 pt-1"
              >
                <span>فتح قناة يوتيوب</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-neutral-950 p-4 rounded-2xl border border-white/5 space-y-2">
              <div className="font-bold text-teal-400 flex items-center justify-between">
                <span>TikTok Channel (@ptah.real.estate)</span>
                <span className="text-emerald-400 text-[10px]">Active</span>
              </div>
              <div className="font-mono text-neutral-300 break-all">{SOCIAL_LINKS.tiktok}</div>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noreferrer"
                className="text-teal-400 hover:underline flex items-center gap-1 pt-1"
              >
                <span>فتح حساب تيك توك</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-neutral-950 p-4 rounded-2xl border border-white/5 space-y-2 md:col-span-2">
              <div className="font-bold text-red-400 flex items-center justify-between">
                <span>مقر الشركة بالعاشر من رمضان (Google Maps Location)</span>
                <span className="text-emerald-400 text-[10px]">Verified Location</span>
              </div>
              <div className="text-neutral-300 text-xs font-semibold">{SOCIAL_LINKS.addressAr}</div>
              <div className="font-mono text-amber-400 text-[11px] break-all">{SOCIAL_LINKS.mapsUrl}</div>
              <a
                href={SOCIAL_LINKS.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-red-400 hover:underline flex items-center gap-1 pt-1 font-bold"
              >
                <span>فتح الرابط في خرائط جوجل</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-neutral-950 p-4 rounded-2xl border border-white/5 space-y-2 md:col-span-2">
              <div className="font-bold text-emerald-400 flex items-center justify-between">
                <span>WhatsApp 24/7 Concierge Hotline</span>
                <span className="text-emerald-400 text-[10px]">Online Now</span>
              </div>
              <div className="font-mono text-neutral-300">{SOCIAL_LINKS.whatsappDisplay}</div>
              <p className="text-[11px] text-neutral-400">
                مربوط بنظام استقبال استفسارات العملاء وحجوزات المعاينة الميدانية تلقائياً.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Tab 4: Custom Domain & Deployment Guide */}
      {activeTab === 'domain' && (
        <div className="bg-neutral-900/60 p-6 rounded-3xl border border-white/10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-2">
                <Globe className="w-3.5 h-3.5" />
                <span>ptahrealestate.com</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {lang === 'ar' ? 'دليل ربط الموقع بالدومين الخاص بشركة بتاح' : 'Connect Your Custom Domain Guide'}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                {lang === 'ar' 
                  ? 'خطوات عملية لربط موقع شركة بتاح للاستثمار العقاري بالدومين الخاص بكم عبر أي استضافة أو سحابة.'
                  : 'Practical steps to point your custom domain to this real estate production build.'}
              </p>
            </div>

            <a
              href="/ptah-website.zip"
              download="ptah-website.zip"
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all self-start cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{lang === 'ar' ? 'تحميل ملفات الموقع (Build ZIP)' : 'Download Production ZIP'}</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Method 1: cPanel / Hostinger / Standard Hosting */}
            <div className="bg-neutral-950 p-5 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center text-xs">1</span>
                  <span>{lang === 'ar' ? 'الرفع المباشر على cPanel أو استضافة سابقة' : 'cPanel or Web Hosting Upload'}</span>
                </h4>
                <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">الأكثر شيوعاً</span>
              </div>

              <ol className="text-xs text-neutral-300 space-y-2 list-decimal list-inside leading-relaxed">
                <li>حمّل حزمة الموقع الجاهزة بالضغط على زر <strong className="text-emerald-400">تحميل ملفات الموقع (ZIP)</strong> في الأعلى.</li>
                <li>سجّل دخول إلى لوحة تحكم الاستضافة الخاصة بك (مثل cPanel أو Hostinger أو GoDaddy).</li>
                <li>افتح إدارة الملفات (<span className="text-amber-300 font-mono">File Manager</span>) ثم ادخل إلى مجلد <span className="text-amber-300 font-mono">public_html</span>.</li>
                <li>ارفع ملف <span className="font-mono text-white">ptah-website.zip</span> واضغط عليه بالزر الأيمن ثم اختر <strong className="text-amber-400">Extract (فك الضغط)</strong>.</li>
                <li>افتح موقع <span className="text-emerald-400 font-bold">www.ptahrealestate.com</span> وسيظهر الموقع الجديد فوراً بكامل صور وتفاصيل الشركة!</li>
              </ol>
            </div>

            {/* Method 2: Cloudflare Pages / Vercel / Netlify */}
            <div className="bg-neutral-950 p-5 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center text-xs">2</span>
                  <span>{lang === 'ar' ? 'الاستضافة السحابية الفائقة (Vercel أو Cloudflare)' : 'Ultra-Fast Cloud Hosting'}</span>
                </h4>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">مجانية وسريعة جداً</span>
              </div>

              <ol className="text-xs text-neutral-300 space-y-2 list-decimal list-inside leading-relaxed">
                <li>افتح موقع <strong className="text-white">app.netlify.com/drop</strong> أو <strong className="text-white">vercel.com</strong> (خدمات استضافة سحابية مجانية عالمية).</li>
                <li>اسحب مجلد <span className="font-mono text-white">dist</span> أو ملف الـ ZIP وضعه في صفحة الرفع.</li>
                <li>بعد ثوانٍ معدودة سيتم النشر، اذهب إلى إعدادات الدومين (<span className="text-amber-300 font-mono">Custom Domains</span>) واكتب <span className="text-amber-300 font-bold">ptahrealestate.com</span>.</li>
                <li>ستعطيك المنصة سجلات DNS لوضعها في الشركة التي حجزت منها الدومين (GoDaddy / Namecheap).</li>
              </ol>
            </div>

          </div>

          {/* DNS Settings Reference */}
          <div className="bg-neutral-950 p-5 rounded-2xl border border-white/10 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ar' ? 'سجلات الـ DNS العامة للدومين (DNS Records)' : 'Standard DNS Records for your Registrar'}</span>
            </h4>
            <p className="text-[11px] text-neutral-400">
              في لوحة تحكم الدومين لدى مسجل النطاق (مثل GoDaddy أو Namecheap أو Cloudflare)، يتم إضافة السجلات التالية:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs font-mono text-neutral-300">
                <thead className="bg-neutral-900 text-neutral-400 text-[11px]">
                  <tr>
                    <th className="p-2.5 text-start">Type (النوع)</th>
                    <th className="p-2.5 text-start">Name / Host (الاسم)</th>
                    <th className="p-2.5 text-start">Value / Target (القيمة)</th>
                    <th className="p-2.5 text-start">TTL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-2.5 text-amber-400 font-bold">CNAME</td>
                    <td className="p-2.5">www</td>
                    <td className="p-2.5 text-neutral-100">اسم خادم الاستضافة (أو استضافة السحابة)</td>
                    <td className="p-2.5 text-neutral-400">Automatic / 3600</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-emerald-400 font-bold">A Record</td>
                    <td className="p-2.5">@</td>
                    <td className="p-2.5 text-neutral-100">عنوان IP الخاص بسيرفر الاستضافة</td>
                    <td className="p-2.5 text-neutral-400">Automatic / 3600</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Property Form Modal (Add / Edit) */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#0b0c14] border border-amber-500/30 rounded-3xl p-6 shadow-2xl my-auto text-neutral-100 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h2 className="text-lg font-bold text-white">
                {editingPropertyId ? t.modalEditTitle : t.modalAddTitle}
              </h2>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    {t.form.titleAr} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleAr}
                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    {t.form.titleEn} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    {t.form.refCode} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.refCode}
                    onChange={(e) => setFormData({ ...formData, refCode: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    {t.form.compound} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.compound}
                    onChange={(e) => setFormData({ ...formData, compound: e.target.value })}
                    placeholder="Mivida, Marassi, Villette..."
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    {t.form.developer} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.developer}
                    onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                    placeholder="Emaar Misr, SODIC, Palm Hills..."
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    {t.form.location} *
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value as any })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white cursor-pointer"
                  >
                    <option value="tenth_of_ramadan">{tLocs.tenth_of_ramadan}</option>
                    <option value="new_cairo">{tLocs.new_cairo}</option>
                    <option value="new_capital">{tLocs.new_capital}</option>
                    <option value="sheikh_zayed">{tLocs.sheikh_zayed}</option>
                    <option value="north_coast">{tLocs.north_coast}</option>
                    <option value="el_gouna">{tLocs.el_gouna}</option>
                    <option value="october_city">{tLocs.october_city}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    {t.form.type} *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white cursor-pointer"
                  >
                    <option value="villa">{tTypes.villa}</option>
                    <option value="twin_house">{tTypes.twin_house}</option>
                    <option value="townhouse">{tTypes.townhouse}</option>
                    <option value="penthouse">{tTypes.penthouse}</option>
                    <option value="duplex">{tTypes.duplex}</option>
                    <option value="apartment">{tTypes.apartment}</option>
                    <option value="chalet">{tTypes.chalet}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    {t.form.status} *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white cursor-pointer"
                  >
                    <option value="ready">{lang === 'ar' ? 'استلام فوري (Ready)' : 'Ready to Move'}</option>
                    <option value="under_construction">{lang === 'ar' ? 'تحت الإنشاء (Under Construction)' : 'Under Construction'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    {t.form.priceEGP} *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.priceEGP}
                    onChange={(e) => setFormData({ ...formData, priceEGP: Number(e.target.value), priceUSD: Math.round(Number(e.target.value) / 48) })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white font-sans"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    {t.form.priceUSD} *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.priceUSD}
                    onChange={(e) => setFormData({ ...formData, priceUSD: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white font-sans"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    {t.form.areaSqm} *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.areaSqm}
                    onChange={(e) => setFormData({ ...formData, areaSqm: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white font-sans"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    {t.form.bedrooms}
                  </label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    {t.form.bathrooms}
                  </label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    {t.form.deliveryYear}
                  </label>
                  <input
                    type="number"
                    value={formData.deliveryYear}
                    onChange={(e) => setFormData({ ...formData, deliveryYear: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    {t.form.downPaymentPercent}
                  </label>
                  <input
                    type="number"
                    value={formData.downPaymentPercent}
                    onChange={(e) => setFormData({ ...formData, downPaymentPercent: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    {t.form.installmentsYears}
                  </label>
                  <input
                    type="number"
                    value={formData.installmentsYears}
                    onChange={(e) => setFormData({ ...formData, installmentsYears: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  {t.form.imageUrl}
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  {t.form.descriptionAr}
                </label>
                <textarea
                  rows={2}
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  {t.form.descriptionEn}
                </label>
                <textarea
                  rows={2}
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
                <label htmlFor="featuredCheck" className="text-neutral-300 cursor-pointer">
                  {t.form.featured}
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white"
                >
                  {t.actions.cancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gold-gradient text-neutral-950 font-bold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{t.actions.save}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
