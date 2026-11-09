import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Home, 
  Bed, 
  Calendar, 
  Clock, 
  RotateCcw, 
  SlidersHorizontal,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { SearchFilterState, Language, Currency } from '../types';
import { translations } from '../i18n/translations';

interface SearchFilterBarProps {
  filter: SearchFilterState;
  onFilterChange: (newFilter: SearchFilterState) => void;
  lang: Language;
  currency: Currency;
  onQuickTagClick?: (tag: string) => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  filter,
  onFilterChange,
  lang,
  currency,
  onQuickTagClick
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const t = translations[lang].search;
  const tTypes = translations[lang].propertyTypes;
  const tLocs = translations[lang].locations;

  const handleInputChange = (key: keyof SearchFilterState, value: any) => {
    onFilterChange({
      ...filter,
      [key]: value
    });
  };

  const handleReset = () => {
    onFilterChange({
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
  };

  const formatPrice = (val: number) => {
    if (currency === 'USD') {
      const usdVal = Math.round(val / 48);
      return `$${(usdVal / 1000).toFixed(0)}k`;
    }
    return `${(val / 1000000).toFixed(1)}M ج.م`;
  };

  return (
    <div className="w-full bg-[#0c0d16] border border-amber-500/25 rounded-3xl p-4 sm:p-6 shadow-2xl relative z-20">
      
      {/* Top Header & Search Input */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-4">
        {/* Keyword Search Input */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-amber-400 absolute top-1/2 -translate-y-1/2 start-4 pointer-events-none" />
          <input
            type="text"
            value={filter.keyword}
            onChange={(e) => handleInputChange('keyword', e.target.value)}
            placeholder={t.keywordPlaceholder}
            className="w-full bg-neutral-900/90 border border-white/10 rounded-2xl py-3.5 ps-12 pe-4 text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        {/* Primary Filter: Location */}
        <div className="relative min-w-[200px]">
          <MapPin className="w-4 h-4 text-amber-400 absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
          <select
            value={filter.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full bg-neutral-900/90 border border-white/10 rounded-2xl py-3.5 ps-10 pe-8 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors appearance-none cursor-pointer"
          >
            <option value="all">{t.allLocations}</option>
            <option value="tenth_of_ramadan">{tLocs.tenth_of_ramadan}</option>
            <option value="new_cairo">{tLocs.new_cairo}</option>
            <option value="new_capital">{tLocs.new_capital}</option>
            <option value="sheikh_zayed">{tLocs.sheikh_zayed}</option>
            <option value="north_coast">{tLocs.north_coast}</option>
            <option value="el_gouna">{tLocs.el_gouna}</option>
          </select>
          <ChevronDown className="w-4 h-4 text-neutral-400 absolute top-1/2 -translate-y-1/2 end-3 pointer-events-none" />
        </div>

        {/* Primary Filter: Property Type */}
        <div className="relative min-w-[190px]">
          <Home className="w-4 h-4 text-amber-400 absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
          <select
            value={filter.propertyType}
            onChange={(e) => handleInputChange('propertyType', e.target.value)}
            className="w-full bg-neutral-900/90 border border-white/10 rounded-2xl py-3.5 ps-10 pe-8 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors appearance-none cursor-pointer"
          >
            <option value="all">{t.allTypes}</option>
            <option value="villa">{tTypes.villa}</option>
            <option value="twin_house">{tTypes.twin_house}</option>
            <option value="townhouse">{tTypes.townhouse}</option>
            <option value="penthouse">{tTypes.penthouse}</option>
            <option value="duplex">{tTypes.duplex}</option>
            <option value="apartment">{tTypes.apartment}</option>
            <option value="chalet">{tTypes.chalet}</option>
          </select>
          <ChevronDown className="w-4 h-4 text-neutral-400 absolute top-1/2 -translate-y-1/2 end-3 pointer-events-none" />
        </div>

        {/* Toggle Detailed Filters */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`px-4 py-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-center gap-2 text-sm font-medium ${
            isExpanded
              ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400'
              : 'bg-neutral-900 border-white/10 text-neutral-300 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">{lang === 'ar' ? 'تصفية متقدمة' : 'More Filters'}</span>
        </button>

        {/* Reset Filter Button */}
        <button
          onClick={handleReset}
          className="p-3.5 rounded-2xl bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          title={t.resetButton}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Expanded Advanced Filters Drawer */}
      {isExpanded && (
        <div className="pt-4 mt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-in slide-in-from-top-3 duration-200 text-xs">
          
          {/* Price Range Slider */}
          <div className="space-y-2 bg-neutral-900/60 p-3.5 rounded-xl border border-white/5">
            <div className="flex items-center justify-between text-neutral-300 font-medium">
              <span>{t.priceRange}</span>
              <span className="text-amber-400 font-bold">{formatPrice(filter.maxPrice)}</span>
            </div>
            <input
              type="range"
              min="5000000"
              max="100000000"
              step="2500000"
              value={filter.maxPrice}
              onChange={(e) => handleInputChange('maxPrice', Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500">
              <span>{formatPrice(5000000)}</span>
              <span>{formatPrice(100000000)}+</span>
            </div>
          </div>

          {/* Bedrooms Selector */}
          <div className="space-y-2 bg-neutral-900/60 p-3.5 rounded-xl border border-white/5">
            <label className="text-neutral-300 font-medium flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.bedrooms}</span>
            </label>
            <div className="grid grid-cols-5 gap-1">
              {['all', '2', '3', '4', '5'].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => handleInputChange('bedrooms', b)}
                  className={`py-1.5 rounded-lg text-center font-semibold transition-all cursor-pointer ${
                    filter.bedrooms === b
                      ? 'bg-amber-500 text-neutral-950'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {b === 'all' ? (lang === 'ar' ? 'الكل' : 'All') : `${b}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Status */}
          <div className="space-y-2 bg-neutral-900/60 p-3.5 rounded-xl border border-white/5">
            <label className="text-neutral-300 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.delivery}</span>
            </label>
            <select
              value={filter.deliveryStatus}
              onChange={(e) => handleInputChange('deliveryStatus', e.target.value)}
              className="w-full bg-neutral-800 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="all">{t.allDeliveries}</option>
              <option value="ready">{t.readyToMove}</option>
              <option value="under_construction">{t.underConstruction}</option>
            </select>
          </div>

          {/* Installment Years */}
          <div className="space-y-2 bg-neutral-900/60 p-3.5 rounded-xl border border-white/5">
            <div className="flex items-center justify-between text-neutral-300 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.maxInstallments}</span>
              </span>
              <span className="text-amber-400 font-bold">{filter.maxInstallmentYears} {t.years}</span>
            </div>
            <input
              type="range"
              min="3"
              max="10"
              step="1"
              value={filter.maxInstallmentYears}
              onChange={(e) => handleInputChange('maxInstallmentYears', Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500">
              <span>3 {t.years}</span>
              <span>10 {t.years}</span>
            </div>
          </div>

        </div>
      )}

      {/* Quick Inquiries / Popular Tags */}
      <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-neutral-400 font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{t.quickTags}</span>
        </span>

        <button
          onClick={() => {
            handleInputChange('location', 'tenth_of_ramadan');
            if (onQuickTagClick) onQuickTagClick('tenth_of_ramadan');
          }}
          className="px-2.5 py-1 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-colors cursor-pointer font-medium"
        >
          {t.tags.tenthOfRamadan}
        </button>

        <button
          onClick={() => {
            handleInputChange('keyword', 'مراسي');
            if (onQuickTagClick) onQuickTagClick('مراسي');
          }}
          className="px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-white/10 transition-colors cursor-pointer"
        >
          {t.tags.seaView}
        </button>

        <button
          onClick={() => {
            handleInputChange('deliveryStatus', 'ready');
            if (onQuickTagClick) onQuickTagClick('ready');
          }}
          className="px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-white/10 transition-colors cursor-pointer"
        >
          {t.tags.ready}
        </button>

        <button
          onClick={() => {
            handleInputChange('location', 'north_coast');
            if (onQuickTagClick) onQuickTagClick('north_coast');
          }}
          className="px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-white/10 transition-colors cursor-pointer"
        >
          {t.tags.rasElHekma}
        </button>

        <button
          onClick={() => {
            handleInputChange('location', 'new_cairo');
            if (onQuickTagClick) onQuickTagClick('new_cairo');
          }}
          className="px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-white/10 transition-colors cursor-pointer"
        >
          {t.tags.goldenSquare}
        </button>
      </div>

    </div>
  );
};
