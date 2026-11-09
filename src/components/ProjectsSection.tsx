import React from 'react';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Glasses
} from 'lucide-react';
import { Language } from '../types';

interface ProjectsSectionProps {
  lang: Language;
  onSelectCompound: (compoundName: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ lang, onSelectCompound }) => {
  const compounds = [
    {
      id: 'ramadan_oasis',
      name: '10th of Ramadan Prime Residences',
      nameAr: 'واحة العاشر السكنية الفاخرة',
      developer: 'بتاح للتطوير العقاري (Ptah Development)',
      location: lang === 'ar' ? 'العاشر من رمضان، محافظة الشرقية' : '10th of Ramadan City, Sharqia',
      type: lang === 'ar' ? 'فيلات معمارية مستقلة بالأحجار الطبيعية والحدائق' : 'Modern architectural villas with natural stone & landscaping',
      image: '/assets/aistudio/download_eb054fbc.jpg',
      tag: lang === 'ar' ? 'مقرنا بالشرقية' : 'Sharqia Flagship',
      unitsCount: '16+'
    },
    {
      id: 'mivida',
      name: 'Mivida New Cairo',
      nameAr: 'ميفيدا التجمع الخامس',
      developer: 'Emaar Misr',
      location: lang === 'ar' ? 'التجمع الخامس، القاهرة الجديدة' : 'Fifth Settlement, New Cairo',
      type: lang === 'ar' ? 'مجتمع فيلات متكامل وداون تاون تجاري' : 'Master planned villas & retail boulevard',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      tag: lang === 'ar' ? 'الجولدن سكوير' : 'Golden Square',
      unitsCount: '18+'
    },
    {
      id: 'marassi',
      name: 'Marassi Sidi Abdel Rahman',
      nameAr: 'مراسي سيدي عبد الرحمن',
      developer: 'Emaar Misr',
      location: lang === 'ar' ? 'سيدي عبد الرحمن، الساحل الشمالي' : 'Sidi Abdel Rahman, North Coast',
      type: lang === 'ar' ? 'منتجع شاطئي عالمي ومارينا يخوت دولية' : 'World-class marina resort & beachfront',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      tag: lang === 'ar' ? 'أول صف بحر' : 'Frontline Beach',
      unitsCount: '12+'
    },
    {
      id: 'villette',
      name: 'Villette SODIC',
      nameAr: 'فيليت سوديك',
      developer: 'SODIC',
      location: lang === 'ar' ? 'التجمع الخامس، القاهرة الجديدة' : 'Golden Square, New Cairo',
      type: lang === 'ar' ? 'فيلات وبنتهاوس مع أندية ونوادي رياضية' : 'Signature townhouses, sky villas & sports club',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      tag: lang === 'ar' ? 'تسليم فوري' : 'Ready to Move',
      unitsCount: '15+'
    },
    {
      id: 'il_bosco',
      name: 'IL Bosco Verticale',
      nameAr: 'إل بوسكو العاصمة الإدارية',
      developer: 'Misr Italia',
      location: lang === 'ar' ? 'العاصمة الإدارية الجديدة، النهر الأخضر' : 'New Capital, Green River Parkway',
      type: lang === 'ar' ? 'أبراج حدائق عمودية وشقق فندقية براندد' : 'Vertical forest towers & branded residences',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      tag: lang === 'ar' ? 'إطلالة النهر الأخضر' : 'Green River Panorama',
      unitsCount: '24+'
    },
    {
      id: 'el_gouna',
      name: 'Fanadir Lagoons El Gouna',
      nameAr: 'لاجونز الجونة',
      developer: 'Orascom Development',
      location: lang === 'ar' ? 'الجونة، ساحل البحر الأحمر' : 'El Gouna, Red Sea Coast',
      type: lang === 'ar' ? 'فيلات وشاليهات شاطئية مع مراسي خاصة' : 'Lagoon villas with private boat moorings',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      tag: lang === 'ar' ? 'شاطئ لاجون' : 'Lagoon Sanctuary',
      unitsCount: '9+'
    },
    {
      id: 'karmell',
      name: 'Karmell SODIC New Zayed',
      nameAr: 'كارميل سوديك الشيخ زايد',
      developer: 'SODIC',
      location: lang === 'ar' ? 'الشيخ زايد الجديدة، الجيزة' : 'New Zayed, West Cairo',
      type: lang === 'ar' ? 'طراز ساحلي كاليفورني وممشى خضري' : 'Californian architecture & lush linear parks',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      tag: lang === 'ar' ? 'أطول فترة تقسيط' : '8 Years Plan',
      unitsCount: '14+'
    }
  ];

  return (
    <div className="w-full py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
          <Building2 className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'أكبر المطورين والمشروعات' : 'Accredited Master Developments'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          {lang === 'ar' ? 'المشروعات الرائدة والمجتمعات الفاخرة' : 'Flagship Communities & Master Plans'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          {lang === 'ar' 
            ? 'شراكات استراتيجية مباشرة مع كبرى شركات التطوير العقاري في مصر لتقديم أفضل الفرص والأسعار الرسمية'
            : 'Strategic direct partnerships ensuring official launch allocations, maximum discounts, and zero client fees'}
        </p>
      </div>

      {/* Grid of Compounds */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {compounds.map((comp) => (
          <div
            key={comp.id}
            onClick={() => onSelectCompound(comp.name)}
            className="group relative bg-[#0e1019] border border-amber-500/15 hover:border-amber-500/40 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-amber-500/10"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
              <img
                src={comp.image}
                alt={comp.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-black/30" />

              <div className="absolute top-3 start-3">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-neutral-950 font-black text-[11px] shadow-md">
                  {comp.tag}
                </span>
              </div>

              <div className="absolute top-3 end-3">
                <span className="px-2 py-0.5 rounded-md bg-black/60 border border-white/10 text-neutral-300 text-[11px] font-medium backdrop-blur-md">
                  {comp.unitsCount} {lang === 'ar' ? 'وحدة متاحة' : 'Units'}
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs font-semibold text-amber-400/90 mb-1">
                  {comp.developer}
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  {lang === 'ar' ? comp.nameAr : comp.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="line-clamp-1">{comp.location}</span>
                </div>
                <p className="text-xs text-neutral-300 mt-2.5 leading-relaxed">
                  {comp.type}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-neutral-400 font-medium">
                  {lang === 'ar' ? 'استعراض وحدات المشروع' : 'View Units'}
                </span>
                <div className="w-8 h-8 rounded-full bg-neutral-900 group-hover:bg-amber-500 group-hover:text-neutral-950 text-neutral-300 flex items-center justify-center transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
