/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  PhoneCall, 
  MessageCircle,
  Maximize2,
  ChevronRight,
  Filter,
  Layers,
  Heart,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { Property, LeadInquiry, Language, Currency, SearchFilterState } from './types';
import { translations } from './i18n/translations';
import { 
  getStoredProperties, 
  saveStoredProperties, 
  getStoredLeads, 
  saveStoredLeads,
  SOCIAL_LINKS 
} from './data/mockProperties';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroAnimatedHouse } from './components/HeroAnimatedHouse';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { SearchFilterBar } from './components/SearchFilterBar';
import { AdminDashboard } from './components/AdminDashboard';
import { AboutSection } from './components/AboutSection';
import { SupportSection } from './components/SupportSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ConsultationModal } from './components/ConsultationModal';
import { WhatsAppFloatingConcierge } from './components/WhatsAppFloatingConcierge';
import { OwnerAuthModal } from './components/OwnerAuthModal';

export default function App() {
  // 1. Language & Direction
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ptah_lang');
      if (saved === 'en' || saved === 'ar') return saved;
    }
    return 'ar';
  });

  // Owner Authentication State (Dashboard strictly for owner only)
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ptah_owner_authenticated') === 'true';
    }
    return false;
  });
  const [isOwnerAuthModalOpen, setIsOwnerAuthModalOpen] = useState<boolean>(false);

  // 2. Currency
  const [currency, setCurrency] = useState<Currency>('EGP');

  // Sync RTL / LTR document attributes
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('ptah_lang', lang);
  }, [lang]);

  // 3. Properties State (Synced with localStorage for real-time live CMS)
  const [properties, setProperties] = useState<Property[]>(getStoredProperties);
  const handleUpdateProperties = (newProps: Property[]) => {
    setProperties(newProps);
    saveStoredProperties(newProps);
  };

  // 4. Leads State
  const [leads, setLeads] = useState<LeadInquiry[]>(getStoredLeads);
  const handleUpdateLeads = (newLeads: LeadInquiry[]) => {
    setLeads(newLeads);
    saveStoredLeads(newLeads);
  };

  // 5. Active Tab Navigation
  const [activeTab, setActiveTab] = useState<string>('home');

  // 6. Search Filter State
  const [filter, setFilter] = useState<SearchFilterState>({
    keyword: '',
    location: 'all',
    propertyType: 'all',
    minPrice: 0,
    maxPrice: 100000000,
    bedrooms: 'all',
    deliveryStatus: 'all',
    maxInstallmentYears: 10,
    sortBy: 'newest'
  });

  // 7. Modals
  const [selectedPropertyForDetail, setSelectedPropertyForDetail] = useState<Property | null>(null);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState<boolean>(false);

  // 8. Wishlist Favorites
  const [favorites, setFavorites] = useState<string[]>([]);
  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const t = translations[lang];

  // Filter Properties Logic
  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      // Keyword
      if (filter.keyword.trim()) {
        const kw = filter.keyword.toLowerCase();
        const matchTitleAr = prop.title.ar.toLowerCase().includes(kw);
        const matchTitleEn = prop.title.en.toLowerCase().includes(kw);
        const matchCompound = prop.compound.toLowerCase().includes(kw);
        const matchDev = prop.developer.toLowerCase().includes(kw);
        const matchRef = prop.refCode.toLowerCase().includes(kw);
        if (!matchTitleAr && !matchTitleEn && !matchCompound && !matchDev && !matchRef) {
          return false;
        }
      }

      // Location
      if (filter.location !== 'all' && prop.location !== filter.location) {
        return false;
      }

      // Property Type
      if (filter.propertyType !== 'all' && prop.type !== filter.propertyType) {
        return false;
      }

      // Max Price
      if (prop.priceEGP > filter.maxPrice) {
        return false;
      }

      // Bedrooms
      if (filter.bedrooms !== 'all') {
        const num = parseInt(filter.bedrooms, 10);
        if (prop.bedrooms < num) return false;
      }

      // Delivery Status
      if (filter.deliveryStatus !== 'all') {
        if (filter.deliveryStatus === 'ready' && prop.status !== 'ready') return false;
        if (filter.deliveryStatus === 'under_construction' && prop.status !== 'under_construction') return false;
      }

      // Installment Years
      if (prop.paymentPlan.installmentsYears > filter.maxInstallmentYears) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filter.sortBy === 'price_asc') return a.priceEGP - b.priceEGP;
      if (filter.sortBy === 'price_desc') return b.priceEGP - a.priceEGP;
      if (filter.sortBy === 'area_desc') return b.areaSqm - a.areaSqm;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [properties, filter]);

  // Featured Properties for Hero Showcase
  const featuredProperties = useMemo(() => {
    return properties.filter(p => p.featured);
  }, [properties]);

  const handleOpenDetails = (prop: Property) => {
    setSelectedPropertyForDetail(prop);
  };

  const handleNavigate = (tab: string) => {
    if (tab === 'admin') {
      if (isOwnerAuthenticated) {
        setActiveTab('admin');
      } else {
        setIsOwnerAuthModalOpen(true);
      }
    } else {
      setActiveTab(tab);
    }
  };

  const handleOwnerAuthSuccess = () => {
    setIsOwnerAuthenticated(true);
    setIsOwnerAuthModalOpen(false);
    setActiveTab('admin');
  };

  const handleOwnerLogout = () => {
    setIsOwnerAuthenticated(false);
    localStorage.removeItem('ptah_owner_authenticated');
    setActiveTab('home');
  };

  const openWhatsApp = () => {
    const text = lang === 'ar'
      ? 'مرحباً، أود التحدث مع مستشار عقاري من شركة بتاح للاستثمار العقاري بفرع العاشر من رمضان.'
      : 'Hello, I would like to speak with a Ptah Real Estate property advisor regarding 10th of Ramadan & Cairo units.';
    window.open(`https://wa.me/${SOCIAL_LINKS.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#090a10] text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-neutral-950">
      
      {/* Top Main Navigation */}
      <Navbar
        lang={lang}
        onLanguageChange={setLang}
        currency={currency}
        onCurrencyChange={setCurrency}
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onRequestConsultation={() => setIsConsultationModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full">
        
        {/* TAB 1: HOME PAGE */}
        {activeTab === 'home' && (
          <div className="space-y-16">
            
            {/* Animated House Hero Experience (Using user's uploaded house photo) */}
            <section className="relative w-full">
              <HeroAnimatedHouse
                lang={lang}
                onExploreUnits={() => setActiveTab('properties')}
              />

              {/* Floating Headline Card Overlay right below hero */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-16 sm:-mt-24 relative z-20">
                <div className="bg-gradient-to-r from-neutral-950/95 via-[#0e101b]/95 to-neutral-950/95 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t.hero.tag}</span>
                      </div>
                      <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                        <span className="text-gold-gradient">{t.hero.titleHighlight}</span>{' '}
                        <span>{t.hero.titleRest}</span>
                      </h1>
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                        {t.hero.subtitle}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                      <button
                        onClick={() => setActiveTab('properties')}
                        className="px-6 py-3.5 rounded-2xl bg-gold-gradient text-neutral-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
                      >
                        <Building2 className="w-4 h-4" />
                        <span>{t.hero.browseUnits}</span>
                      </button>

                      <a
                        href={SOCIAL_LINKS.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-amber-500/30 transition-all cursor-pointer shadow-md"
                      >
                        <MapPin className="w-4 h-4 text-red-400" />
                        <span>{t.hero.viewLocation}</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Smart Search Filter Engine */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <SearchFilterBar
                filter={filter}
                onFilterChange={setFilter}
                lang={lang}
                currency={currency}
                onQuickTagClick={(tag) => {
                  setActiveTab('properties');
                }}
              />
            </section>

            {/* Featured Luxury Units (فرص مميزة) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t.catalog.featuredBadge}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    {lang === 'ar' ? 'أندر الفرص العقارية بالعاشر من رمضان والقاهرة' : 'Curated Signature Opportunities in Sharqia & Cairo'}
                  </h2>
                </div>

                <button
                  onClick={() => setActiveTab('properties')}
                  className="text-xs sm:text-sm text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>{lang === 'ar' ? 'عرض كافة الوحدات' : 'View Full Catalog'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProperties.slice(0, 3).map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    lang={lang}
                    currency={currency}
                    onOpenDetails={handleOpenDetails}
                    onLaunchVR={handleOpenDetails}
                    isFavorite={favorites.includes(prop.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            </section>

            {/* 10th of Ramadan / Sharqia Corporate Location Feature Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0c0d16] via-[#121526] to-[#0c0d16] border border-amber-500/30 p-8 sm:p-12 shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold">
                      <MapPin className="w-4 h-4 text-red-400" />
                      <span>{lang === 'ar' ? 'مقر الشركة بالشرقية' : 'Sharqia Headquarters'}</span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                      {lang === 'ar'
                        ? 'مقر شركة بتاح للاستثمار العقاري بالعاشر من رمضان'
                        : 'Visit Ptah Real Estate in 10th of Ramadan City'}
                    </h2>

                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {lang === 'ar'
                        ? 'يسعدنا استقبالكم في مقرنا الرسمي بالعاشر من رمضان، محافظة الشرقية. نوفر استشارات عقارية واستثمارية متخصصة في أرقى أحياء العاشر من رمضان، القاهرة الجديدة، والمدن الساحلية.'
                        : 'We welcome you to our flagship headquarters located in 10th of Ramadan City, Sharqia Governorate. Delivering certified wealth advisory and luxury property acquisitions.'}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-200 pt-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400" />
                        <span>{lang === 'ar' ? 'موقع استراتيجي سهل الوصول' : 'Prime Accessible Location'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400" />
                        <span>{lang === 'ar' ? 'جلسات استشارية VIP خاصة' : 'Private VIP Consultation Room'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400" />
                        <span>{lang === 'ar' ? 'فريق مستشارين معتمدين' : 'Certified Senior Advisors'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400" />
                        <span>{lang === 'ar' ? 'مواقف خاصة واستقبال فندقي' : 'Private Parking & Lounge'}</span>
                      </div>
                    </div>

                    <div className="pt-3 flex flex-wrap items-center gap-3">
                      <a
                        href={SOCIAL_LINKS.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3.5 rounded-2xl bg-gold-gradient text-neutral-950 font-black text-xs sm:text-sm flex items-center gap-2 hover:opacity-95 shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
                      >
                        <MapPin className="w-4 h-4 text-neutral-950" />
                        <span>{lang === 'ar' ? 'فتح الموقع في Google Maps' : 'Open in Google Maps'}</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => setIsConsultationModalOpen(true)}
                        className="px-5 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm border border-white/10 transition-colors cursor-pointer"
                      >
                        {t.nav.requestCall}
                      </button>
                    </div>
                  </div>

                  {/* Interactive Map Visual Card */}
                  <div className="relative rounded-2xl overflow-hidden border border-amber-500/40 shadow-2xl bg-neutral-950 p-6 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                          <MapPin className="w-5 h-5 text-red-400" />
                          <span>{lang === 'ar' ? 'بيانات الموقع والوصول' : 'Location & Navigation'}</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
                          {lang === 'ar' ? 'مفتوح للزيارات' : 'Open for Visits'}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-neutral-900/90 border border-white/5 space-y-2 text-xs">
                        <div className="text-neutral-400 font-medium">
                          {lang === 'ar' ? 'العنوان الرسمي:' : 'Official Address:'}
                        </div>
                        <div className="text-white font-bold leading-relaxed">
                          {lang === 'ar' ? SOCIAL_LINKS.addressAr : SOCIAL_LINKS.addressEn}
                        </div>
                        <div className="text-amber-400/90 font-mono text-[11px] pt-1">
                          {SOCIAL_LINKS.mapsUrl}
                        </div>
                      </div>
                    </div>

                    <a
                      href={SOCIAL_LINKS.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 transition-all"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'بدء التوجيه الملاحي عبر خريطة جوجل' : 'Start Navigation on Google Maps'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Why Ptah Real Estate / Value Pillars */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <AboutSection 
                lang={lang} 
                onExploreProperties={() => setActiveTab('properties')} 
              />
            </section>

            {/* Accredited Master Compounds */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <ProjectsSection 
                lang={lang} 
                onSelectCompound={(compoundName) => {
                  setFilter({ ...filter, keyword: compoundName });
                  setActiveTab('properties');
                }} 
              />
            </section>

            {/* VIP Direct Assistance CTA Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
              <div className="bg-gradient-to-r from-neutral-900 via-[#10121d] to-neutral-900 border border-amber-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-5">
                <h2 className="text-2xl sm:text-4xl font-black text-white">
                  {lang === 'ar' ? 'هل تبحث عن عقار استثنائي بمواصفات خاصة؟' : 'Seeking a Bespoke Architectural Residence?'}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed">
                  {lang === 'ar'
                    ? 'فريق بتاح للاستشارات العقارية بالعاشر من رمضان والقاهرة جاهز لتوفير قوائم حصرية غير معلنة بالمزادات والوحدات الملكية مع تسهيلات سداد خاصة.'
                    : 'Our senior partners provide off-market private treaty access, bespoke payment structuring, and white-glove advisory.'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setIsConsultationModalOpen(true)}
                    className="px-6 py-3.5 rounded-2xl bg-gold-gradient text-neutral-950 font-black text-xs sm:text-sm hover:opacity-95 shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    {t.nav.requestCall}
                  </button>
                  <button
                    onClick={openWhatsApp}
                    className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t.nav.whatsappQuick}</span>
                  </button>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* TAB 2: PROPERTIES & UNITS CATALOG */}
        {activeTab === 'properties' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
            {/* Title & Stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-white">
                  {t.catalog.title}
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  {t.catalog.subtitle}
                </p>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-400">{t.catalog.sortBy}:</span>
                <select
                  value={filter.sortBy}
                  onChange={(e) => setFilter({ ...filter, sortBy: e.target.value as any })}
                  className="bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="newest">{t.catalog.sortOptions.newest}</option>
                  <option value="price_asc">{t.catalog.sortOptions.priceAsc}</option>
                  <option value="price_desc">{t.catalog.sortOptions.priceDesc}</option>
                  <option value="area_desc">{t.catalog.sortOptions.areaDesc}</option>
                </select>
              </div>
            </div>

            {/* Filter Bar */}
            <SearchFilterBar
              filter={filter}
              onFilterChange={setFilter}
              lang={lang}
              currency={currency}
            />

            {/* Results Counter */}
            <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
              <span>
                {t.catalog.resultsCount.replace('{count}', String(filteredProperties.length))}
              </span>
              {favorites.length > 0 && (
                <span className="text-amber-400 font-medium flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                  <span>{favorites.length} {lang === 'ar' ? 'في المفضلة' : 'Saved'}</span>
                </span>
              )}
            </div>

            {/* Properties Grid */}
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    lang={lang}
                    currency={currency}
                    onOpenDetails={handleOpenDetails}
                    onLaunchVR={handleOpenDetails}
                    isFavorite={favorites.includes(prop.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-neutral-900/50 border border-white/10 rounded-3xl p-12 text-center space-y-4">
                <Building2 className="w-12 h-12 text-neutral-600 mx-auto" />
                <h3 className="text-lg font-bold text-white">
                  {t.catalog.noResults}
                </h3>
                <button
                  onClick={() => setFilter({
                    keyword: '',
                    location: 'all',
                    propertyType: 'all',
                    minPrice: 0,
                    maxPrice: 100000000,
                    bedrooms: 'all',
                    deliveryStatus: 'all',
                    maxInstallmentYears: 10,
                    sortBy: 'newest'
                  })}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs"
                >
                  {t.search.resetButton}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROJECTS & DEVELOPERS */}
        {activeTab === 'projects' && (
          <ProjectsSection
            lang={lang}
            onSelectCompound={(compoundName) => {
              setFilter({ ...filter, keyword: compoundName });
              setActiveTab('properties');
            }}
          />
        )}

        {/* TAB 4: ABOUT PTAH */}
        {activeTab === 'about' && (
          <AboutSection
            lang={lang}
            onExploreProperties={() => setActiveTab('properties')}
          />
        )}

        {/* TAB 5: 24/7 SUPPORT */}
        {activeTab === 'support' && (
          <SupportSection lang={lang} />
        )}

        {/* TAB 6: ADMIN DASHBOARD (OWNER ONLY CMS) */}
        {activeTab === 'admin' && (
          isOwnerAuthenticated ? (
            <AdminDashboard
              properties={properties}
              onUpdateProperties={handleUpdateProperties}
              leads={leads}
              onUpdateLeads={handleUpdateLeads}
              lang={lang}
              currency={currency}
              onLogout={handleOwnerLogout}
            />
          ) : (
            <div className="max-w-md mx-auto my-24 p-8 rounded-3xl bg-[#0c0d15] border border-amber-500/30 text-center space-y-4 shadow-2xl">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">
                {lang === 'ar' ? 'منطقة محظورة - خاصة بمالك الموقع' : 'Restricted Owner Area'}
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {lang === 'ar' 
                  ? 'لوحة التحكم هذه مخصصة حصرياً لإدارة شركة بتاح للاستثمار العقاري لإدارة الوحدات وحجوزات العملاء. يرجى إدخال رمز المرور السري للمتابعة.'
                  : 'This control panel is strictly reserved for the website owner and administration.'}
              </p>
              <button
                onClick={() => setIsOwnerAuthModalOpen(true)}
                className="w-full py-3 rounded-xl bg-gold-gradient text-neutral-950 font-black text-xs hover:opacity-95 shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                {lang === 'ar' ? 'تسجيل دخول مالك الموقع' : 'Owner Login'}
              </button>
              <button
                onClick={() => setActiveTab('home')}
                className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs cursor-pointer"
              >
                {lang === 'ar' ? 'الرجوع إلى صفحة العملاء' : 'Back to Public Website'}
              </button>
            </div>
          )
        )}

      </main>

      {/* Footer with Verified Socials */}
      <Footer
        lang={lang}
        onNavigate={handleNavigate}
        onOpenOwnerLogin={() => setIsOwnerAuthModalOpen(true)}
      />

      {/* Owner Authentication Modal */}
      <OwnerAuthModal
        isOpen={isOwnerAuthModalOpen}
        onClose={() => setIsOwnerAuthModalOpen(false)}
        onSuccess={handleOwnerAuthSuccess}
        lang={lang}
      />

      {/* Floating WhatsApp 24/7 Concierge */}
      <WhatsAppFloatingConcierge lang={lang} />

      {/* Detailed Property Specification & Booking Modal */}
      {selectedPropertyForDetail && (
        <PropertyDetailModal
          property={selectedPropertyForDetail}
          lang={lang}
          currency={currency}
          onClose={() => setSelectedPropertyForDetail(null)}
          onLaunchVR={handleOpenDetails}
        />
      )}

      {/* VIP Consultation Request Modal */}
      {isConsultationModalOpen && (
        <ConsultationModal
          lang={lang}
          currency={currency}
          onClose={() => setIsConsultationModalOpen(false)}
        />
      )}

    </div>
  );
}
