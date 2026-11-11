export type Language = 'ar' | 'en';
export type Currency = 'EGP' | 'USD';

export type PropertyType = 
  | 'villa' 
  | 'twin_house' 
  | 'townhouse' 
  | 'penthouse' 
  | 'duplex' 
  | 'apartment' 
  | 'chalet';

export type LocationKey = 
  | 'tenth_of_ramadan'
  | 'new_cairo' 
  | 'new_capital' 
  | 'sheikh_zayed' 
  | 'north_coast' 
  | 'el_gouna' 
  | 'october_city';

export interface VRRoom {
  id: string;
  name: { ar: string; en: string };
  description: { ar: string; en: string };
  panoramaTheme: 'living' | 'master_suite' | 'terrace_pool' | 'kitchen';
  hotspots: {
    title: { ar: string; en: string };
    x: number;
    y: number;
    z: number;
    detail: { ar: string; en: string };
  }[];
}

export interface Property {
  id: string;
  refCode: string;
  title: { ar: string; en: string };
  compound: string;
  developer: string;
  location: LocationKey;
  locationName: { ar: string; en: string };
  type: PropertyType;
  priceEGP: number;
  priceUSD: number;
  areaSqm: number;
  bedrooms: number;
  bathrooms: number;
  deliveryYear: number;
  status: 'ready' | 'under_construction';
  featured: boolean;
  paymentPlan: {
    downPaymentPercent: number;
    installmentsYears: number;
    monthlyInstallmentEGP?: number;
  };
  description: { ar: string; en: string };
  amenities: { ar: string; en: string }[];
  images: string[];
  model3DPreset: 'villa' | 'tower' | 'penthouse';
  vrRooms: VRRoom[];
  createdAt: string;
}

export interface LeadInquiry {
  id: string;
  propertyId?: string;
  propertyTitle?: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  message: string;
  type: 'vip_viewing' | 'consultation' | 'whatsapp' | 'brochure';
  date: string;
  status: 'new' | 'contacted' | 'viewing_scheduled' | 'closed';
  notes?: string;
}

export interface SearchFilterState {
  keyword: string;
  location: string;
  propertyType: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string;
  deliveryStatus: string;
  maxInstallmentYears: number;
  sortBy: 'price_asc' | 'price_desc' | 'area_desc' | 'newest';
}

export interface VisitorLog {
  id: string;
  timestamp: string;
  page: string;
  device: 'mobile' | 'desktop' | 'tablet';
  browser: string;
  referrer: string;
}

export interface CompanySettings {
  website: string;
  domain: string;
  facebook: string;
  linkedin: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  email: string;
  phone: string;
  addressAr: string;
  addressEn: string;
  mapsUrl: string;
  logoUrl: string;
  heroHouseImage: string;
}

