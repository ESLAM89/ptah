import { Property, LeadInquiry, VisitorLog, CompanySettings } from '../types';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'ptah-prop-ramadan-01',
    refCode: 'PT-RAM-101',
    title: {
      ar: 'فيلا معمارية مودرن بالأحجار الطبيعية والحدائق - العاشر من رمضان، الشرقية',
      en: 'Modern Architectural Villa with Natural Stone & Gardens - 10th of Ramadan, Sharqia'
    },
    compound: 'واحة العاشر السكنية الفاخرة',
    developer: 'بتاح للتطوير العقاري (Ptah Development)',
    location: 'tenth_of_ramadan',
    locationName: { ar: 'العاشر من رمضان، محافظة الشرقية', en: '10th of Ramadan City, Sharqia' },
    type: 'villa',
    priceEGP: 22500000,
    priceUSD: 470000,
    areaSqm: 520,
    bedrooms: 5,
    bathrooms: 5,
    deliveryYear: 2025,
    status: 'ready',
    featured: true,
    paymentPlan: {
      downPaymentPercent: 10,
      installmentsYears: 8,
      monthlyInstallmentEGP: 210000
    },
    description: {
      ar: 'تحفة معمارية عصرية مصممة بدمج الأحجار الطبيعية والخشب الدافئ والواجهات الزجاجية الممتدة من الأرض إلى السقف. تقع في أرقى أحياء العاشر من رمضان بالشرقية، محاطة بحديقة خاصة وممشى حجري طبيعي ونظام إضاءة معمارية ذكية.',
      en: 'Modern architectural masterpiece combining natural stone masonry, warm rich timber, and expansive floor-to-ceiling glass facades. Situated in prime 10th of Ramadan, Sharqia, surrounded by private landscaped gardens, natural flagstone walkway, and ambient smart lighting.'
    },
    amenities: [
      { ar: 'واجهات حجر طبيعي وخشب راقي', en: 'Natural Stone & Wood Facades' },
      { ar: 'حديقة يابانية منسقة خاصة', en: 'Private Landscaped Japanese Garden' },
      { ar: 'ممشى حجري وإضاءة معمارية', en: 'Stone Walkway & Architectural Lighting' },
      { ar: 'نظام سمارت هوم للتحكم الكامل', en: 'Smart Home Automation' },
      { ar: 'أمن وحراسة خاصة 24/7', en: '24/7 Private Security' },
      { ar: 'جراج خاص يتسع لسيارتين', en: 'Private 2-Car Garage' }
    ],
    images: [
      '/assets/aistudio/download_eb054fbc.jpg',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80'
    ],
    model3DPreset: 'villa',
    vrRooms: [],
    createdAt: '2025-03-01'
  },
  {
    id: 'ptah-prop-01',
    refCode: 'PT-NC-901',
    title: {
      ar: 'فيلا فاخرة مستقلة بحمام سباحة خاص - ميفيدا التجمع الخامس',
      en: 'Luxury Standalone Villa with Private Infinity Pool - Mivida New Cairo'
    },
    compound: 'Mivida',
    developer: 'Emaar Misr',
    location: 'new_cairo',
    locationName: { ar: 'القاهرة الجديدة، التجمع الخامس', en: 'New Cairo, Fifth Settlement' },
    type: 'villa',
    priceEGP: 48500000,
    priceUSD: 1010000,
    areaSqm: 560,
    bedrooms: 5,
    bathrooms: 6,
    deliveryYear: 2025,
    status: 'ready',
    featured: true,
    paymentPlan: {
      downPaymentPercent: 15,
      installmentsYears: 7,
      monthlyInstallmentEGP: 490000
    },
    description: {
      ar: 'فيلا ملكية تتميز بتصميم معماري حديث وتشطيب فندقي فائق الفخامة، تطل على مساحات خضراء شاسعة وبحيرة صناعية خاصة. تحتوي على مصعد داخلي، جناح ماستر رئاسي، غرفة سينما منزلية وتراس واسع مزود بحمام سباحة دافئ.',
      en: 'Royal architectural masterpiece featuring ultra-luxury finishing, commanding sweeping views over open golf greens and private lagoons. Equipped with a private elevator, master presidential suite, smart home automation, and an infinity heated pool.'
    },
    amenities: [
      { ar: 'حمام سباحة خاص', en: 'Private Infinity Pool' },
      { ar: 'مصعد بانورامي داخلي', en: 'Panoramic Private Elevator' },
      { ar: 'نظام منزل ذكي متكامل', en: 'Full Smart Home System' },
      { ar: 'غرفة سينما خاصة', en: 'Private Home Cinema' },
      { ar: 'أمن وحراسة 24/7', en: '24/7 Elite Security' },
      { ar: 'حديقة منسقة خاصة', en: 'Landscaped Garden' }
    ],
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80'
    ],
    model3DPreset: 'villa',
    vrRooms: [
      {
        id: 'room-1',
        name: { ar: 'صالة الاستقبال والبهو الرئيسي', en: 'Grand Reception & Living Salon' },
        description: { ar: 'مساحة مفتوحة بارتفاع مزدوج مع رخام ستاتواريو إيطالي وإطلالة زجاجية كاملة', en: 'Double-height ceiling with Italian Statuario marble & panoramic floor-to-ceiling glass' },
        panoramaTheme: 'living',
        hotspots: [
          { title: { ar: 'رخام إيطالي فاخر', en: 'Italian Statuario Marble' }, x: -2, y: -1, z: 2, detail: { ar: 'رخام مستورد مع تدفئة أرضية متكاملة', en: 'Premium imported marble with radiant underfloor heating' } },
          { title: { ar: 'واجهة زجاجية عازلة', en: 'Double Glazed Facade' }, x: 0, y: 0.5, z: 4, detail: { ar: 'زجاج واقي من الحرارة والصوت بنسبة 99%', en: 'High acoustic and thermal insulation curtain wall' } }
        ]
      },
      {
        id: 'room-2',
        name: { ar: 'جناح النوم الماستر الملكي', en: 'Presidential Master Suite' },
        description: { ar: 'غرفة نوم رئيسية مزودة بغرفة ملابس واسعة وتراس خاص وحمام جاكوزي بانورامي', en: 'Expansive master bedroom with walk-in dressing room, private terrace, and whirlpool jacuzzi' },
        panoramaTheme: 'master_suite',
        hotspots: [
          { title: { ar: 'غرفة الملابس الفاخرة', en: 'Walk-in Boutique Wardrobe' }, x: -3, y: 0, z: 1, detail: { ar: 'خزائن خشب جوز إيطالي مع إضاءة خفية', en: 'Italian walnut cabinetry with sensor-activated cove lighting' } }
        ]
      },
      {
        id: 'room-3',
        name: { ar: 'التراس البانورامي وحمام السباحة', en: 'Sky Terrace & Infinity Pool' },
        description: { ar: 'تراس خارجي مع منطقة شواء فاخرة وكراسي تشميس تطل مباشرة على المياه', en: 'Outdoor sunset lounge with BBQ station, sun loungers, and horizon edge overflow pool' },
        panoramaTheme: 'terrace_pool',
        hotspots: [
          { title: { ar: 'حمام سباحة لا متناهي', en: 'Infinity Edge Pool' }, x: 0, y: -0.8, z: 3, detail: { ar: 'نظام تدفئة وإنارة ليلية تحت الماء بالألياف الضوئية', en: 'Fiber-optic underwater lighting with smart inverter heating' } }
        ]
      },
      {
        id: 'room-4',
        name: { ar: 'المطبخ العصري والتجهيزات الألمانية', en: 'Minimalist Gourmet Kitchen' },
        description: { ar: 'جزيرة رخامية متكاملة مع أجهزة مدمجة من كبرى الماركات العالمية', en: 'Calacatta marble island with integrated Miele & Gaggenau smart appliances' },
        panoramaTheme: 'kitchen',
        hotspots: [
          { title: { ar: 'الجزيرة الرخامية', en: 'Calacatta Marble Island' }, x: 0, y: -0.5, z: 1.5, detail: { ar: 'تصميم مخصص بمحطة طهي تعمل باللمس', en: 'Seamless waterfall edge with flush induction cooktop' } }
        ]
      }
    ],
    createdAt: '2025-01-15'
  },
  {
    id: 'ptah-prop-02',
    refCode: 'PT-NC-902',
    title: {
      ar: 'بنتهاوس سماوي فاخر بتراس بانورامي - فيليت سوديك التجمع الخامس',
      en: 'Ultra-Luxury Sky Penthouse with Panoramic Terrace - Villette SODIC New Cairo'
    },
    compound: 'Villette',
    developer: 'SODIC',
    location: 'new_cairo',
    locationName: { ar: 'التجمع الخامس، منطقة الجولدن سكوير', en: 'Golden Square, New Cairo' },
    type: 'penthouse',
    priceEGP: 29800000,
    priceUSD: 620000,
    areaSqm: 385,
    bedrooms: 4,
    bathrooms: 4,
    deliveryYear: 2025,
    status: 'ready',
    featured: true,
    paymentPlan: {
      downPaymentPercent: 10,
      installmentsYears: 6,
      monthlyInstallmentEGP: 372000
    },
    description: {
      ar: 'بنتهاوس استثنائي على أعلى نقطة في الجولدن سكوير بإطلالة 360 درجة، يضم تراس على السطح بمساحة 120 متر مع جاكوزي خارجي ومنطقة صالة خارجية ومطبخ صيفي.',
      en: 'Distinctive penthouse situated atop the Golden Square with 360-degree horizon views. Includes a 120 sqm rooftop terrace equipped with a private jacuzzi, pergola lounge, and outdoor summer kitchen.'
    },
    amenities: [
      { ar: 'جاكوزي خارجي في الروف', en: 'Private Rooftop Jacuzzi' },
      { ar: 'مصعد مباشر للشقة', en: 'Direct Keycard Elevator' },
      { ar: 'نظام صوتي محيطي', en: 'Bose Multi-room Audio' },
      { ar: 'موقفين سيارات تحت الأرض', en: '2 Underground Parking Bays' },
      { ar: 'نادي رياضي خاص', en: 'Clubhouse Membership' }
    ],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80'
    ],
    model3DPreset: 'penthouse',
    vrRooms: [
      {
        id: 'room-1',
        name: { ar: 'الصالون البانورامي العلوي', en: 'Sky Lounge Salon' },
        description: { ar: 'صالة مفتوحة مع زجاج بانورامي عريض', en: 'Expansive open plan with floor-to-ceiling city views' },
        panoramaTheme: 'living',
        hotspots: []
      },
      {
        id: 'room-2',
        name: { ar: 'روف التراس والجاكوزي', en: 'Rooftop Terrace & Jacuzzi' },
        description: { ar: 'إطلالة ساحرة على سماء التجمع الخامس والجولدن سكوير', en: 'Unrivaled sunset views over the Golden Square skyline' },
        panoramaTheme: 'terrace_pool',
        hotspots: []
      }
    ],
    createdAt: '2025-01-20'
  },
  {
    id: 'ptah-prop-03',
    refCode: 'PT-SA-301',
    title: {
      ar: 'فيلا شاطئية أول صف على البحر مباشرة - مراسي الساحل الشمالي',
      en: 'Frontline Beachfront Villa with Direct Sea Access - Marassi North Coast'
    },
    compound: 'Marassi (Sidi Abdel Rahman)',
    developer: 'Emaar Misr',
    location: 'north_coast',
    locationName: { ar: 'سيدي عبد الرحمن، الساحل الشمالي', en: 'Sidi Abdel Rahman, North Coast' },
    type: 'villa',
    priceEGP: 85000000,
    priceUSD: 1770000,
    areaSqm: 680,
    bedrooms: 6,
    bathrooms: 7,
    deliveryYear: 2025,
    status: 'ready',
    featured: true,
    paymentPlan: {
      downPaymentPercent: 20,
      installmentsYears: 5,
      monthlyInstallmentEGP: 1130000
    },
    description: {
      ar: 'أرقى فيلا على شواطئ سيدي عبد الرحمن برمالها البيضاء ومياهها الفيروزية، تقع في الصف الأول المباشر على البحر. تشمل شاطئ خاص، مسبح عاكس، تشطيبات يونانية وإيطالية راقية، ومساحات استقبال رحبة.',
      en: 'An ultra-prime beachfront residence on the turquoise waters of Sidi Abdel Rahman. Offers private white-sand beach access, horizon reflection pool, Mediterranean coastal architecture, and staff quarters.'
    },
    amenities: [
      { ar: 'شاطئ رملي خاص مباشر', en: 'Private Sandy Beach Access' },
      { ar: 'مسبح عاكس للأفق', en: 'Infinity Coastal Pool' },
      { ar: 'مرسى يخوت متاح', en: 'Marina Yacht Berth Access' },
      { ar: 'غرف للسائق والمساعدين', en: 'Maid & Driver Quarters' },
      { ar: 'حديقة شاطئية واسعة', en: 'Private Coastal Lawn' }
    ],
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80'
    ],
    model3DPreset: 'villa',
    vrRooms: [
      {
        id: 'room-1',
        name: { ar: 'صالة المعيشة المطلة على البحر', en: 'Oceanfront Living Salon' },
        description: { ar: 'صالة بيضاء بتصميم يوناني عصري مطلة على المياه الفيروزية', en: 'Contemporary Mediterranean lounge opening to the turquoise sea' },
        panoramaTheme: 'living',
        hotspots: []
      },
      {
        id: 'room-2',
        name: { ar: 'شاطئ الفيلا الخاص والتراس', en: 'Beach Deck & Infinity Pool' },
        description: { ar: 'الاندماج الكامل بين المياه الزرقاء والرمال البيضاء', en: 'Direct step-out to the private sands and crystal waters' },
        panoramaTheme: 'terrace_pool',
        hotspots: []
      }
    ],
    createdAt: '2025-02-01'
  },
  {
    id: 'ptah-prop-04',
    refCode: 'PT-ZAYED-501',
    title: {
      ar: 'تاون هاوس عصري كورنر مع حديقة - كرميل سوديك الشيخ زايد الجديدة',
      en: 'Modern Corner Townhouse with Landscaped Garden - Karmell SODIC New Zayed'
    },
    compound: 'Karmell SODIC',
    developer: 'SODIC',
    location: 'sheikh_zayed',
    locationName: { ar: 'الشيخ زايد الجديدة، الجيزة', en: 'New Zayed, Giza' },
    type: 'townhouse',
    priceEGP: 18900000,
    priceUSD: 395000,
    areaSqm: 245,
    bedrooms: 3,
    bathrooms: 4,
    deliveryYear: 2026,
    status: 'under_construction',
    featured: false,
    paymentPlan: {
      downPaymentPercent: 5,
      installmentsYears: 8,
      monthlyInstallmentEGP: 186000
    },
    description: {
      ar: 'تاون هاوس زاوية أنيق بتصميم مستوحى من الطراز الكاليفورني العصري. توزيع ذكي للمساحات مع غرفة خادمة، حديقة زاوية واسعة وإمكانية إضافة حمام سباحة، داخل كمبوند متكامل الخدمات.',
      en: 'Stylish corner townhouse inspired by coastal Californian architecture. Smart spatial layout including maid suite, expansive corner garden suitable for a plunge pool, within an amenity-rich gated community.'
    },
    amenities: [
      { ar: 'حديقة زاوية خاصة 140م', en: 'Private Corner Garden 140sqm' },
      { ar: 'نظام طاقة شمسية اختياري', en: 'Solar-Ready Roof' },
      { ar: 'ممشى للدراجات والمشاة', en: 'Jogging & Cycling Tracks' },
      { ar: 'نادي اجتماعي ورياضي', en: 'Community Clubhouse' }
    ],
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1600&q=80'
    ],
    model3DPreset: 'villa',
    vrRooms: [
      {
        id: 'room-1',
        name: { ar: 'منطقة الاستقبال والحديقة', en: 'Reception & Garden View' },
        description: { ar: 'واجهات زجاجية واسعة مطلة على الحديقة الخاصة', en: 'Sunlit living spaces connecting seamlessly to the private lawn' },
        panoramaTheme: 'living',
        hotspots: []
      }
    ],
    createdAt: '2025-02-10'
  },
  {
    id: 'ptah-prop-05',
    refCode: 'PT-CAP-201',
    title: {
      ar: 'شقة فندقية فاخرة بإطلالة مباشرة على النهر الأخضر - العاصمة الإدارية',
      en: 'Ultra-Luxury Serviced Residence Overlooking the Green River - New Capital'
    },
    compound: 'IL Bosco Verticale',
    developer: 'Misr Italia Properties',
    location: 'new_capital',
    locationName: { ar: 'العاصمة الإدارية الجديدة، النهر الأخضر', en: 'New Administrative Capital, Green River' },
    type: 'apartment',
    priceEGP: 14200000,
    priceUSD: 295000,
    areaSqm: 195,
    bedrooms: 3,
    bathrooms: 3,
    deliveryYear: 2026,
    status: 'under_construction',
    featured: true,
    paymentPlan: {
      downPaymentPercent: 10,
      installmentsYears: 9,
      monthlyInstallmentEGP: 118000
    },
    description: {
      ar: 'شقة فندقية بإطلالة خلابة على أطول محور حدائقي في العالم (النهر الأخضر) وقرب الحي الدبلوماسي. تشمل خدمات فندقية 5 نجوم وكونسيرج وإدارة تأجيرية مضمونة العائد الاستثماري.',
      en: 'High-floor branded residence boasting unobstructed vistas of the iconic Green River parkway near the Diplomatic District. Complete with 5-star hospitality concierge and lucrative rental yield management.'
    },
    amenities: [
      { ar: 'إطلالة مباشرة على النهر الأخضر', en: 'Direct Green River Panorama' },
      { ar: 'خدمات فندقية متكاملة', en: '5-Star Hospitality Services' },
      { ar: 'مسبح مدفأ مغطى', en: 'Indoor Temperature-Controlled Pool' },
      { ar: 'سبا وساونا فاخرة', en: 'Luxury Spa & Wellness Center' }
    ],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80'
    ],
    model3DPreset: 'tower',
    vrRooms: [
      {
        id: 'room-1',
        name: { ar: 'صالة الاستقبال وإطلالة النهر الأخضر', en: 'Skyline Reception' },
        description: { ar: 'إطلالة زجاجية مفتوحة على البرج الأيقوني والحدائق', en: 'Floor-to-ceiling vista encompassing the Iconic Tower' },
        panoramaTheme: 'living',
        hotspots: []
      }
    ],
    createdAt: '2025-02-12'
  },
  {
    id: 'ptah-prop-06',
    refCode: 'PT-GOUNA-701',
    title: {
      ar: 'فيلا لاجون فاخرة بمرسى قارب خاص - الجونة البحر الأحمر',
      en: 'Lagoonfront Waterfront Villa with Private Jetty - El Gouna Red Sea'
    },
    compound: 'Fanadir Lagoons',
    developer: 'Orascom Development',
    location: 'el_gouna',
    locationName: { ar: 'الجونة، البحر الأحمر', en: 'El Gouna, Red Sea' },
    type: 'villa',
    priceEGP: 62000000,
    priceUSD: 1290000,
    areaSqm: 490,
    bedrooms: 5,
    bathrooms: 6,
    deliveryYear: 2025,
    status: 'ready',
    featured: true,
    paymentPlan: {
      downPaymentPercent: 15,
      installmentsYears: 5,
      monthlyInstallmentEGP: 870000
    },
    description: {
      ar: 'تصميم نوبي عصري فريد على شاطئ اللاجون الفيروزي الهادئ في الجونة، مع مرسى خاص لليخوت ومسبح متصل بالبحيرة وتراسات تشميس بانورامية مع خصوصية تامة.',
      en: 'Modern Nubian sanctuary perched directly on the turquoise lagoons of El Gouna. Features private boat mooring jetty, lagoon-edge swimming pool, and bespoke rooftop stargazing lounge.'
    },
    amenities: [
      { ar: 'مرسى قارب خاص في اللاجون', en: 'Private Boat Jetty Mooring' },
      { ar: 'مسبح خاص دافئ', en: 'Private Heated Plunge Pool' },
      { ar: 'روف لمشاهدة النجوم والغروب', en: 'Sunset Stargazing Rooftop' },
      { ar: 'محيط شاطئي رملي نقي', en: 'Pure Sand Lagoon Shoreline' }
    ],
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80'
    ],
    model3DPreset: 'villa',
    vrRooms: [
      {
        id: 'room-1',
        name: { ar: 'صالة اللاجون المفتوحة', en: 'Lagoon Breeze Living' },
        description: { ar: 'أسقف خشبية وقباب نوبية عصرية مع نسيم البحر', en: 'Vaulted timber ceilings overlooking turquoise water' },
        panoramaTheme: 'living',
        hotspots: []
      }
    ],
    createdAt: '2025-02-15'
  }
];

export const INITIAL_LEADS: LeadInquiry[] = [
  {
    id: 'lead-001',
    propertyId: 'ptah-prop-01',
    propertyTitle: 'Luxury Standalone Villa - Mivida New Cairo',
    clientName: 'د. طارق السعدني',
    clientPhone: '+20 100 123 4567',
    clientEmail: 'tarek.saadani@gmail.com',
    message: 'مهتم بمعاينة الفيلا الواقع الافتراضي ثم ترتيب زيارة ميدانية يوم السبت القادم.',
    type: 'vip_viewing',
    date: '2025-03-01 14:30',
    status: 'viewing_scheduled',
    notes: 'تم التواصل وتأكيد المعاينة الساعة 3 عصراً مع استشاري المبيعات.'
  },
  {
    id: 'lead-002',
    propertyId: 'ptah-prop-03',
    propertyTitle: 'Beachfront Villa - Marassi North Coast',
    clientName: 'Eng. Karim Mansour',
    clientPhone: '+971 50 889 9123',
    clientEmail: 'k.mansour@investdubai.ae',
    message: 'Requesting the detailed payment schedule and unit brochure in USD.',
    type: 'brochure',
    date: '2025-03-02 09:15',
    status: 'contacted',
    notes: 'Sent payment plan on WhatsApp and brochure via email.'
  },
  {
    id: 'lead-003',
    propertyId: 'ptah-prop-02',
    propertyTitle: 'Ultra-Luxury Sky Penthouse - Villette SODIC',
    clientName: 'الأستاذة نورهان الألفي',
    clientPhone: '+20 122 765 4321',
    clientEmail: 'nourhan.elalfy@outlook.com',
    message: 'استفسار عن خطة التقسيط على 6 سنوات وإمكانية استلام فوري.',
    type: 'whatsapp',
    date: '2025-03-02 18:45',
    status: 'new'
  }
];

const STORAGE_KEY_PROPERTIES = 'ptah_real_estate_properties_v4';
const STORAGE_KEY_LEADS = 'ptah_real_estate_leads_v4';

export function getStoredProperties(): Property[] {
  if (typeof window === 'undefined') return INITIAL_PROPERTIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROPERTIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(INITIAL_PROPERTIES));
      return INITIAL_PROPERTIES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read properties from localStorage:', err);
    return INITIAL_PROPERTIES;
  }
}

export function saveStoredProperties(properties: Property[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(properties));
    fetch('/api/properties', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(properties)
    }).catch(() => {});
  } catch (err) {
    console.error('Failed to save properties to localStorage:', err);
  }
}

export function resetPropertiesToDefault(): Property[] {
  if (typeof window === 'undefined') return INITIAL_PROPERTIES;
  localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(INITIAL_PROPERTIES));
  fetch('/api/properties', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(INITIAL_PROPERTIES)
  }).catch(() => {});
  return INITIAL_PROPERTIES;
}

export function getStoredLeads(): LeadInquiry[] {
  if (typeof window === 'undefined') return INITIAL_LEADS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LEADS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(INITIAL_LEADS));
      return INITIAL_LEADS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read leads from localStorage:', err);
    return INITIAL_LEADS;
  }
}

export function saveStoredLeads(leads: LeadInquiry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(leads));
    fetch('/api/leads', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leads)
    }).catch(() => {});
  } catch (err) {
    console.error('Failed to save leads to localStorage:', err);
  }
}

export function addLead(lead: Omit<LeadInquiry, 'id' | 'date' | 'status'>): LeadInquiry {
  const current = getStoredLeads();
  const newLead: LeadInquiry = {
    ...lead,
    id: `lead-${Date.now()}`,
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    status: 'new'
  };
  const updated = [newLead, ...current];
  saveStoredLeads(updated);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ptah_new_lead', { detail: newLead }));
  }
  return newLead;
}

export const NEW_HERO_HOUSE_IMAGE = '/assets/aistudio/download__2__ed2da637.jpg';
const LEGACY_HERO_IMAGES = new Set([
  '/assets/aistudio/download_eb054fbc.jpg',
  '/assets/aistudio/3d_rendering_of_modern_cozy_house_with_garage_for_sale_or_rent_with_beautiful_landscaping_on_background__real_estate_concept_artwork_29fcfac4.jpg',
  '/assets/aistudio/download__1__66931253.jpg'
]);

export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  website: 'https://www.ptahrealestate.com',
  domain: 'www.ptahrealestate.com',
  facebook: 'https://www.facebook.com/?ref=homescreenpwa',
  linkedin: 'https://www.linkedin.com/in/ptah-real-estate-144b18431/',
  instagram: 'https://www.instagram.com/?utm_source=pwa_homescreen&__pwa=1',
  youtube: 'https://www.youtube.com/channel/UCpKdoL2ivnVOwUcnaqquRFw',
  tiktok: 'https://www.tiktok.com/@ptah.real.estate',
  whatsappNumber: '+201041981636',
  whatsappDisplay: '+20 104 198 1636',
  email: 'info@ptahrealestate.com',
  notificationEmail: '',
  notifyOnVisitorEmail: false,
  phone: '+20 104 198 1636',
  addressAr: 'العاشر من رمضان، محافظة الشرقية، مصر',
  addressEn: '10th of Ramadan City, Sharqia Governorate, Egypt',
  mapsUrl: 'https://maps.app.goo.gl/1j4jE64STYMftjHa7?g_st=aw',
  logoUrl: '/assets/aistudio/logo_ptah__8c02f9bc.jpeg',
  heroHouseImage: NEW_HERO_HOUSE_IMAGE
};

const STORAGE_KEY_SETTINGS = 'ptah_company_settings';

export function getStoredCompanySettings(): CompanySettings {
  if (typeof window === 'undefined') return DEFAULT_COMPANY_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_COMPANY_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<CompanySettings>;
    const heroHouseImage =
      !parsed.heroHouseImage || LEGACY_HERO_IMAGES.has(parsed.heroHouseImage)
        ? NEW_HERO_HOUSE_IMAGE
        : parsed.heroHouseImage;
    return { ...DEFAULT_COMPANY_SETTINGS, ...parsed, heroHouseImage };
  } catch {
    return DEFAULT_COMPANY_SETTINGS;
  }
}

export function saveStoredCompanySettings(settings: CompanySettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('ptah_settings_updated', { detail: settings }));
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }).catch(() => {});
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

export const SOCIAL_LINKS = DEFAULT_COMPANY_SETTINGS;

// --- EMAIL DISPATCH (FORMSUBMIT.CO AJAX) FOR STATIC + FULL-STACK HOSTING ---
export async function sendEmailViaFormSubmit(
  targetEmail: string,
  subject: string,
  fields: Record<string, string>
): Promise<{ ok: boolean; message?: string }> {
  const cleanEmail = (targetEmail || '').trim();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { ok: false, message: 'Invalid target email' };
  }
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(cleanEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        _subject: subject,
        _template: 'table',
        _captcha: 'false',
        ...fields
      })
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok && data?.success !== 'false', message: data?.message };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function sendTestEmail(targetEmail: string): Promise<{ ok: boolean; message?: string }> {
  return sendEmailViaFormSubmit(
    targetEmail,
    '✅ تفعيل واختبار استقبال رسائل موقع بتاح للعقارات (Ptah Real Estate)',
    {
      'الرسالة': 'هذه رسالة اختبار وتفعيل من لوحة تحكم شركة بتاح للاستثمار العقاري.',
      'البريد المستهدف': targetEmail,
      'النطاق': 'www.ptahrealestate.com',
      'التوقيت': new Date().toLocaleString('ar-EG'),
      'ملاحظة هامة': 'إذا كانت هذه أول رسالة تصلك عبر FormSubmit، اضغط على زر Activate Form بداخل الرسالة ليتم تفعيل استقبال جميع استفسارات العملاء فوراً.'
    }
  );
}

export async function submitLeadWithNotifications(
  lead: Omit<LeadInquiry, 'id' | 'date' | 'status'>
): Promise<LeadInquiry> {
  const newLead = addLead(lead);

  // Notify backend server + real-time SSE owner dashboard
  fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newLead)
  }).catch(() => {});

  // Dispatch real email to info@ptahrealestate.com (+ optional backup notification email)
  const settings = getStoredCompanySettings();
  const primaryEmail = (settings.email || 'info@ptahrealestate.com').trim();
  const backupEmail = (settings.notificationEmail || '').trim();
  const subject = `🏡 استفسار عميل جديد - ${lead.clientName} | بتاح للعقارات`;
  const emailPayload: Record<string, string> = {
    'اسم العميل': lead.clientName,
    'رقم الهاتف / الواتساب': lead.clientPhone,
    'البريد الإلكتروني للعميل': lead.clientEmail || 'غير مرفق',
    'الوحدة / الموضوع': lead.propertyTitle || 'استشارة عقارية عامة',
    'نوع الطلب': lead.type,
    'التفاصيل والرسالة': lead.message,
    'التاريخ والوقت': newLead.date
  };

  const tasks: Promise<unknown>[] = [sendEmailViaFormSubmit(primaryEmail, subject, emailPayload)];
  if (backupEmail && backupEmail.toLowerCase() !== primaryEmail.toLowerCase()) {
    tasks.push(sendEmailViaFormSubmit(backupEmail, subject, emailPayload));
  }
  await Promise.allSettled(tasks);

  return newLead;
}

// --- GEOIP COUNTRY DETECTION & REAL-TIME VISITOR LOGGING ---
const STORAGE_KEY_VISITORS = 'ptah_visitor_logs';
const SESSION_KEY_GEO = 'ptah_visitor_geo_v1';
const SESSION_KEY_VISITOR_EMAIL_SENT = 'ptah_visitor_email_notified';

export const COUNTRY_AR_MAP: Record<string, string> = {
  EG: 'مصر',
  SA: 'السعودية',
  AE: 'الإمارات',
  KW: 'الكويت',
  QA: 'قطر',
  BH: 'البحرين',
  OM: 'عُمان',
  JO: 'الأردن',
  LB: 'لبنان',
  IQ: 'العراق',
  SY: 'سوريا',
  PS: 'فلسطين',
  YE: 'اليمن',
  LY: 'ليبيا',
  TN: 'تونس',
  DZ: 'الجزائر',
  MA: 'المغرب',
  SD: 'السودان',
  US: 'الولايات المتحدة',
  GB: 'المملكة المتحدة',
  DE: 'ألمانيا',
  FR: 'فرنسا',
  IT: 'إيطاليا',
  ES: 'إسبانيا',
  TR: 'تركيا',
  CA: 'كندا',
  AU: 'أستراليا',
  RU: 'روسيا',
  CN: 'الصين',
  IN: 'الهند'
};

export function countryCodeToFlag(code: string): string {
  if (!code || code.length !== 2) return '🌍';
  const upper = code.toUpperCase();
  const offset = 127397;
  return String.fromCodePoint(...upper.split('').map((c) => c.charCodeAt(0) + offset));
}

interface GeoInfo {
  country: string;
  countryAr: string;
  countryCode: string;
  city: string;
  flag: string;
}

function getTimezoneFallbackGeo(): GeoInfo {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const map: Record<string, { code: string; en: string; city: string }> = {
      'Africa/Cairo': { code: 'EG', en: 'Egypt', city: 'القاهرة / مصر' },
      'Asia/Riyadh': { code: 'SA', en: 'Saudi Arabia', city: 'الرياض' },
      'Asia/Dubai': { code: 'AE', en: 'United Arab Emirates', city: 'دبي' },
      'Asia/Kuwait': { code: 'KW', en: 'Kuwait', city: 'الكويت' },
      'Asia/Qatar': { code: 'QA', en: 'Qatar', city: 'الدوحة' },
      'Asia/Bahrain': { code: 'BH', en: 'Bahrain', city: 'المنامة' },
      'Asia/Muscat': { code: 'OM', en: 'Oman', city: 'مسقط' },
      'Asia/Amman': { code: 'JO', en: 'Jordan', city: 'عمّان' },
      'Europe/London': { code: 'GB', en: 'United Kingdom', city: 'London' },
      'Europe/Berlin': { code: 'DE', en: 'Germany', city: 'Berlin' },
      'Europe/Paris': { code: 'FR', en: 'France', city: 'Paris' },
      'America/New_York': { code: 'US', en: 'United States', city: 'New York' },
      'America/Los_Angeles': { code: 'US', en: 'United States', city: 'Los Angeles' },
    };
    const hit = map[tz];
    if (hit) {
      return {
        country: hit.en,
        countryAr: COUNTRY_AR_MAP[hit.code] || hit.en,
        countryCode: hit.code,
        city: hit.city,
        flag: countryCodeToFlag(hit.code)
      };
    }
  } catch {
    // ignore
  }
  return {
    country: 'Egypt',
    countryAr: 'مصر',
    countryCode: 'EG',
    city: '',
    flag: '🇪🇬'
  };
}

export async function detectVisitorGeo(): Promise<GeoInfo> {
  if (typeof window === 'undefined') return getTimezoneFallbackGeo();
  try {
    const cached = sessionStorage.getItem(SESSION_KEY_GEO);
    if (cached) {
      return JSON.parse(cached) as GeoInfo;
    }
  } catch {
    // ignore
  }

  // Try ipwho.is first (no key required, CORS enabled)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3200);
    const resp = await fetch('https://ipwho.is/', { signal: controller.signal });
    clearTimeout(timer);
    if (resp.ok) {
      const data = await resp.json();
      if (data && data.success !== false && data.country_code) {
        const cc = String(data.country_code).toUpperCase();
        const geo: GeoInfo = {
          country: data.country || cc,
          countryAr: COUNTRY_AR_MAP[cc] || data.country || 'غير معروف',
          countryCode: cc,
          city: data.city || '',
          flag: countryCodeToFlag(cc)
        };
        try {
          sessionStorage.setItem(SESSION_KEY_GEO, JSON.stringify(geo));
        } catch {
          // ignore
        }
        return geo;
      }
    }
  } catch {
    // fall through
  }

  // Try ipapi.co fallback
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3200);
    const resp = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(timer);
    if (resp.ok) {
      const data = await resp.json();
      if (data && data.country_code) {
        const cc = String(data.country_code).toUpperCase();
        const geo: GeoInfo = {
          country: data.country_name || cc,
          countryAr: COUNTRY_AR_MAP[cc] || data.country_name || 'غير معروف',
          countryCode: cc,
          city: data.city || '',
          flag: countryCodeToFlag(cc)
        };
        try {
          sessionStorage.setItem(SESSION_KEY_GEO, JSON.stringify(geo));
        } catch {
          // ignore
        }
        return geo;
      }
    }
  } catch {
    // fall through
  }

  return getTimezoneFallbackGeo();
}

export function getStoredVisitorLogs(): VisitorLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VISITORS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<VisitorLog>[];
    return parsed.map((v) => ({
      id: v.id || `vis-${Date.now()}`,
      timestamp: v.timestamp || '',
      page: v.page || 'الرئيسية (Home)',
      device: v.device || 'desktop',
      browser: v.browser || 'Browser',
      referrer: v.referrer || 'مباشر (Direct)',
      country: v.country || 'Egypt',
      countryAr: v.countryAr || 'مصر',
      countryCode: v.countryCode || 'EG',
      city: v.city || '',
      flag: v.flag || countryCodeToFlag(v.countryCode || 'EG')
    }));
  } catch {
    return [];
  }
}

export function saveStoredVisitorLogs(logs: VisitorLog[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_VISITORS, JSON.stringify(logs.slice(0, 150)));
  } catch {
    // ignore
  }
}

export async function logNewVisitor(pageName: string, overrideGeo?: Partial<GeoInfo>): Promise<VisitorLog> {
  const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isTablet = typeof navigator !== 'undefined' && /iPad|Tablet/i.test(navigator.userAgent);
  const deviceType: 'mobile' | 'desktop' | 'tablet' = isTablet ? 'tablet' : (isMobile ? 'mobile' : 'desktop');

  const now = new Date();
  const timeStr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString('ar-EG');

  let browserName = 'Browser';
  if (typeof navigator !== 'undefined') {
    const ua = navigator.userAgent;
    if (ua.includes('Edg/')) browserName = 'Edge';
    else if (ua.includes('Chrome/')) browserName = 'Chrome';
    else if (ua.includes('Safari/') && !ua.includes('Chrome/')) browserName = 'Safari';
    else if (ua.includes('Firefox/')) browserName = 'Firefox';
  }

  let referrerStr = 'مباشر (Direct)';
  if (typeof document !== 'undefined' && document.referrer) {
    try {
      referrerStr = new URL(document.referrer).hostname || 'مباشر (Direct)';
    } catch {
      referrerStr = 'مباشر (Direct)';
    }
  }

  const detectedGeo = overrideGeo?.countryCode
    ? {
        country: overrideGeo.country || overrideGeo.countryCode,
        countryAr: overrideGeo.countryAr || COUNTRY_AR_MAP[overrideGeo.countryCode] || overrideGeo.country || 'غير معروف',
        countryCode: overrideGeo.countryCode,
        city: overrideGeo.city || '',
        flag: overrideGeo.flag || countryCodeToFlag(overrideGeo.countryCode)
      }
    : await detectVisitorGeo();

  let newLog: VisitorLog = {
    id: `vis-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: `${timeStr} (${dateStr})`,
    page: pageName,
    device: deviceType,
    browser: browserName,
    referrer: referrerStr,
    country: detectedGeo.country,
    countryAr: detectedGeo.countryAr,
    countryCode: detectedGeo.countryCode,
    city: detectedGeo.city,
    flag: detectedGeo.flag
  };

  if (typeof window !== 'undefined') {
    // Post to backend API so server resolves GeoIP & broadcasts live SSE alert to Owner Dashboard across devices
    try {
      const resp = await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog)
      });
      if (resp.ok) {
        const serverEntry = await resp.json();
        if (serverEntry && serverEntry.id) {
          newLog = { ...newLog, ...serverEntry };
        }
      }
    } catch {
      // Offline/static hosting fallback works locally via localStorage
    }

    try {
      const logs = getStoredVisitorLogs();
      const updated = [newLog, ...logs.filter((l) => l.id !== newLog.id)].slice(0, 150);
      localStorage.setItem(STORAGE_KEY_VISITORS, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('ptah_new_visitor', { detail: newLog }));
    } catch (err) {
      console.error('Failed to log visitor:', err);
    }

    // Optional visitor arrival email notification (sent once per visitor session if owner enabled it)
    try {
      const settings = getStoredCompanySettings();
      const isOwnerSession = localStorage.getItem('ptah_owner_authenticated') === 'true';
      const alreadySent = sessionStorage.getItem(SESSION_KEY_VISITOR_EMAIL_SENT) === 'true';
      if (settings.notifyOnVisitorEmail && !isOwnerSession && !alreadySent && !overrideGeo) {
        sessionStorage.setItem(SESSION_KEY_VISITOR_EMAIL_SENT, 'true');
        const target = (settings.notificationEmail || settings.email || 'info@ptahrealestate.com').trim();
        sendEmailViaFormSubmit(
          target,
          `👀 زائر جديد دخل موقع بتاح من ${newLog.flag || ''} ${newLog.countryAr}`,
          {
            'الدولة': `${newLog.flag || ''} ${newLog.countryAr} (${newLog.country})`,
            'المدينة': newLog.city || 'غير محددة',
            'الصفحة': newLog.page,
            'الجهاز': newLog.device,
            'المتصفح': newLog.browser,
            'المصدر': newLog.referrer,
            'التوقيت': newLog.timestamp
          }
        ).catch(() => {});
      }
    } catch {
      // ignore
    }
  }

  return newLog;
}

export function clearVisitorLogs(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_VISITORS);
  fetch('/api/visitors', { method: 'DELETE' }).catch(() => {});
  window.dispatchEvent(new CustomEvent('ptah_visitors_cleared'));
}

export function playNotificationSound(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(440, now);
    osc2.frequency.exponentialRampToValueAtTime(659.25, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.46);
    osc2.stop(now + 0.46);
  } catch {
    // Audio autoplay policy
  }
}


