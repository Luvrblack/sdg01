import { Product, PortfolioItem, ServiceItem, Testimonial, SiteConfig } from '../types';

export const initialSiteConfig: SiteConfig = {
  founderName: 'Reza Pratama (SDG Lead)',
  roleTitle: 'Lead Apparel Designer & Creative Director',
  bio: 'Menggabungkan karakter seni yang kuat dengan estetika desain modern. Berbekal pengalaman bertahun-tahun, kami hadir untuk mendefinisikan ulang tren streetwear masa kini dengan kualitas terbaik.',
  yearsOfExp: '07+',
  projectsDelivered: '750+',
  satisfiedClients: '120+',
  cottonQuality: '100% Cotton Combed',
  whatsappNumber: '628563566089',
  email: 'sgdindustries.official@gmail.com',
  instagram: '@sdgindustries',
  shopeeUrl: 'https://shopee.co.id/user/account/profile',
  address: 'Bandung & Jakarta, Indonesia',
  heroImages: [
    '/src/assets/images/sdg_hero_streetwear_1790683209963.jpg',
    '/src/assets/images/sdg_tshirt_black_heavyweight_1790683222338.jpg',
    '/src/assets/images/sdg_tshirt_white_minimal_1790683235920.jpg',
    '/src/assets/images/sdg_tshirt_acidwash_urban_1790683247848.jpg'
  ],
  channels: [
    { label: 'Shopee', url: 'https://shopee.co.id/user/account/profile' },
    { label: 'Tokopedia', url: 'https://tokopedia.com' },
    { label: 'Instagram', url: 'https://instagram.com/sdgindustries' },
    { label: 'TikTok Shop', url: 'https://tiktok.com' }
  ],
  promoTitle: 'SDG Streetwear Capsule',
  promoSubtitle: '100% Heavyweight Cotton 240 GSM',
  promoTag: 'SS-2025',
  promoBadgeTitle: 'High Quality',
  promoBadgeSubtitle: 'Katun Combed 100% Original',
  promoStatCount: '750+',
  promoStatLabel: 'Proyek & Kaos Terkirim',
  sizeChart: [
    { size: 'S', width: '48 cm', length: '70 cm', sleeve: '22 cm' },
    { size: 'M', width: '52 cm', length: '72 cm', sleeve: '23 cm' },
    { size: 'L', width: '56 cm', length: '75 cm', sleeve: '24 cm' },
    { size: 'XL', width: '60 cm', length: '77 cm', sleeve: '25 cm' },
    { size: 'XXL', width: '64 cm', length: '79 cm', sleeve: '26 cm' },
    { size: 'XXXL', width: '68 cm', length: '81 cm', sleeve: '27 cm' },
    { size: 'XXXXL', width: '72 cm', length: '83 cm', sleeve: '28 cm' },
    { size: 'XXXXXL', width: '76 cm', length: '85 cm', sleeve: '29 cm' }
  ]
};



export const initialProducts: Product[] = [
  {
    id: 'prod-01',
    name: 'SDG "Born From The Street" Heavyweight Tee',
    category: 'heavyweight',
    price: 185000,
    originalPrice: 225000,
    description: 'Kaos oversize streetwear signature SDG Industries dengan bahan Heavyweight 16s Cotton Combed 240 GSM. Potongan boxy fit modern dengan sablon High-Density Plastisol tahan cuci.',
    material: '100% Cotton Combed 16s Heavyweight (240 GSM)',
    gsm: '240 GSM',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Onyx Black', 'Off-White', 'Charcoal'],
    imageUrl: '/src/assets/images/sdg_tshirt_black_heavyweight_1790683222338.jpg',
    stock: 45,
    featured: true,
    tag: 'Best Seller',
    rating: 4.9,
    soldCount: 342,
    marketplaceUrl: 'https://shopee.co.id/product-born-from-street'
  },
  {
    id: 'prod-02',
    name: 'SDG Hexagonal Emblem Minimalist Tee',
    category: 'minimalist',
    price: 165000,
    originalPrice: 195000,
    description: 'Kaos katun 24s premium dengan sentuhan bordir micro-woven hexagonal emblem SDG pada bagian dada kiri. Sangat nyaman, sejuk untuk iklim tropis, dan rapi untuk gaya smart casual.',
    material: '100% Premium Cotton Combed 24s Reactive',
    gsm: '185 GSM',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Vintage White', 'Emerald Green', 'Deep Navy'],
    imageUrl: '/src/assets/images/sdg_tshirt_white_minimal_1790683235920.jpg',
    stock: 28,
    featured: true,
    tag: 'Trending',
    rating: 4.8,
    soldCount: 215,
    marketplaceUrl: 'https://shopee.co.id/product-hexagonal-emblem'
  },
  {
    id: 'prod-03',
    name: 'SDG Acid Wash Urban Distro Tee',
    category: 'vintage',
    price: 210000,
    originalPrice: 250000,
    description: 'Proses pencucian Acid Wash khusus menghasilkan tekstur abu-abu charcoal vintage yang unik pada setiap helai. Dilengkapi sablon Discharge Waterbase ramah lingkungan.',
    material: '100% Cotton 20s Acid Wash Vintage Treated',
    gsm: '210 GSM',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Acid Charcoal', 'Washed Olive', 'Slate Grey'],
    imageUrl: '/src/assets/images/sdg_tshirt_acidwash_urban_1790683247848.jpg',
    stock: 19,
    featured: true,
    tag: 'Limited Stock',
    rating: 5.0,
    soldCount: 188,
    marketplaceUrl: 'https://shopee.co.id/product-acid-wash'
  },
  {
    id: 'prod-04',
    name: 'SDG "Redefine Boundaries" Oversize Drop-Shoulder',
    category: 'oversize',
    price: 195000,
    originalPrice: 235000,
    description: 'Siluet drop-shoulder longgar dengan kerah rib tebal anti-melar. Detail grafis tipografi futuristik khas SDG di punggung belakang dengan teknik sablon DTF HD Glow.',
    material: '100% Combed Cotton 24s Two-Ply Interlock',
    gsm: '220 GSM',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Pitch Black', 'Forest Green', 'Sand Khaki'],
    imageUrl: '/src/assets/images/sdg_hero_streetwear_1790683209963.jpg',
    stock: 35,
    featured: false,
    tag: 'New Arrival',
    rating: 4.9,
    soldCount: 120,
    marketplaceUrl: 'https://shopee.co.id/product-redefine-boundaries'
  },
  {
    id: 'prod-05',
    name: 'SDG Cyberpunk Division Graphic Tee',
    category: 'limited',
    price: 225000,
    originalPrice: 275000,
    description: 'Edisi eksklusif kolaborasi visual Cyberpunk & Distro Nusantara. Dicetak terbatas 100 pcs dengan sertifikat keaslian dan packaging ziplock box premium.',
    material: '100% Heavy Combed Cotton 20s (230 GSM)',
    gsm: '230 GSM',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Cyber Black', 'Metallic Silver'],
    imageUrl: '/src/assets/images/sdg_tshirt_black_heavyweight_1790683222338.jpg',
    stock: 8,
    featured: true,
    tag: 'Exclusive 100 Pcs',
    rating: 5.0,
    soldCount: 92,
    marketplaceUrl: 'https://shopee.co.id/product-cyberpunk-division'
  },
  {
    id: 'prod-06',
    name: 'SDG Raw Earth Organic Cotton Tee',
    category: 'minimalist',
    price: 175000,
    originalPrice: 210000,
    description: 'Dibuat dari 100% serat katun organik bersertifikat tanpa pemutih klorin. Tekstur alami super lembut dan hypoallergenic dengan label woven daur ulang.',
    material: '100% Certified Organic Cotton 24s',
    gsm: '190 GSM',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Natural Unbleached Cream', 'Earth Brown', 'Sage Green'],
    imageUrl: '/src/assets/images/sdg_tshirt_white_minimal_1790683235920.jpg',
    stock: 22,
    featured: false,
    tag: 'Eco Friendly',
    rating: 4.8,
    soldCount: 140,
    marketplaceUrl: 'https://shopee.co.id/product-raw-earth'
  }
];

export const initialPortfolio: PortfolioItem[] = [
  {
    id: 'port-01',
    title: 'SDG "Born From The Street" Lookbook SS25',
    category: 'apparel',
    client: 'SDG Industries Official',
    year: '2025',
    description: 'Konsep pengarahan visual dan fotografi lookbook streetwear musim semi/panas, memadukan siluet oversize dengan palet monokromatik dan aksen hijau emerald.',
    imageUrl: '/src/assets/images/sdg_hero_streetwear_1790683209963.jpg',
    tags: ['Creative Direction', 'Lookbook', 'Apparel Design', 'Photo Shoot'],
    stats: '15.000+ Engagement & Sold Out in 48 Hours'
  },
  {
    id: 'port-02',
    title: 'Identity & Brand Architecture: SDG Hexa-TM',
    category: 'branding',
    client: 'SDG Apparel Group',
    year: '2024',
    description: 'Perancangan logo geometris heksagonal, manual identitas visual, label woven, hangtag embossed, dan pedoman tipografi merk distro.',
    imageUrl: '/src/assets/images/sdg_tshirt_black_heavyweight_1790683222338.jpg',
    tags: ['Logo Design', 'Brand Guidelines', 'Typography', 'Apparel Packaging'],
    stats: 'Multi-device Vector Kit & Complete Woven Specs'
  },
  {
    id: 'port-03',
    title: 'Acid Wash & Distro Graphic Series',
    category: 'apparel',
    client: 'Outlaw Culture Distro',
    year: '2024',
    description: 'Seri ilustrasi kaos gaya vintage bootleg 90-an dengan separasi warna sablon plastisol raster 8 warna presisi tinggi.',
    imageUrl: '/src/assets/images/sdg_tshirt_acidwash_urban_1790683247848.jpg',
    tags: ['Graphic Illustration', 'Screen Printing Separation', 'Vintage Bootleg'],
    stats: '5 Seri Kaos Terjual 2.500+ Pcs'
  },
  {
    id: 'port-04',
    title: 'SDG Distro E-Commerce & Web Showcase',
    category: 'uiux',
    client: 'SDG Digital Store',
    year: '2025',
    description: 'Perancangan antarmuka web toko online responsif dengan tema gelap elegan, filter interaktif, live cart, dan integrasi WhatsApp checkout.',
    imageUrl: '/src/assets/images/sdg_hero_streetwear_1790683209963.jpg',
    tags: ['UI/UX Design', 'React & Tailwind', 'Mobile-First', 'E-Commerce'],
    stats: '0.6s Page Load Speed & 100% Mobile Ready'
  },
  {
    id: 'port-05',
    title: 'Custom Ziplock & Eco-Packaging Box',
    category: 'packaging',
    client: 'Urban Syndicate Clothing',
    year: '2024',
    description: 'Desain kemasan distro eksklusif berbahan matte frosted ziplock dengan sablon foil silver dan sticker pack hologram.',
    imageUrl: '/src/assets/images/sdg_tshirt_white_minimal_1790683235920.jpg',
    tags: ['Packaging Design', 'Dieline', 'Print Production', 'Merchandise'],
    stats: 'Unboxing Rating 5.0 dari 800+ Reviewer'
  },
  {
    id: 'port-06',
    title: 'Heavyweight Drop Series Capsule Collection',
    category: 'merchandise',
    client: 'Bandung Street Collective',
    year: '2025',
    description: 'Produksi terbatas 300 pcs hoodie & kaos heavyweight 330gsm dengan detail bordir chenille dan sablon puff 3D.',
    imageUrl: '/src/assets/images/sdg_tshirt_black_heavyweight_1790683222338.jpg',
    tags: ['Apparel Capsule', 'Embroidery', 'Screen Printing', 'Limited Batch'],
    stats: 'Terjual Habis dalam 1 Minggu Pre-Order'
  }
];

export const initialServices: ServiceItem[] = [
  {
    id: 'srv-01',
    number: '01',
    title: 'Desain Grafis Kaos & Apparel',
    subtitle: 'Streetwear, Vintage Bootleg, Typography & Vector Art',
    description: 'Menciptakan karya grafis orisinal dengan resolusi tinggi (300 DPI) siap sablon, lengkap dengan file separasi warna CMYK/Spot Color.',
    features: ['File Master AI, PSD, CDR, & PDF', 'Separasi Warna Sablon Presisi', 'Mockup 3D Realistis untuk Promosi', 'Revisi hingga Sesuai Karakter Brand'],
    icon: 'Layers',
    startingPrice: 'Mulai Rp 350.000 / Desain'
  },
  {
    id: 'srv-02',
    number: '02',
    title: 'Produksi Kaos Premium Cotton',
    subtitle: 'Konveksi High Quality & Sablon High-Density',
    description: 'Layanan pengerjaan kaos distro dari potongan pola hingga jahit rantai rapi dengan bahan katun combed 24s/30s/16s heavyweight pilihan.',
    features: ['100% Cotton Combed Original Anti-Luntur', 'Pilihan Sablon Plastisol, DTF HD, Discharge', 'Minimal Order Fleksibel (Mulai 24 pcs)', 'Quality Control Jahitan & Packaging Rapih'],
    icon: 'Shirt',
    startingPrice: 'Mulai Rp 65.000 / Pcs'
  },
  {
    id: 'srv-03',
    number: '03',
    title: 'Brand Identity & Distro Packaging',
    subtitle: 'Woven Label, Hangtag, Ziplock & Brand Manual',
    description: 'Membangun identitas merk clothing yang matang dari pembuatan logo, kartu garansi, label kerah, hingga kemasan unboxing yang memorable.',
    features: ['Desain Logo & Konsep Visual Merk', 'Desain Woven Label Kerah & Hem Label', 'Hangtag Tebal Embossed / Foil', 'Desain Ziplock Bag & Thank You Card'],
    icon: 'Tag',
    startingPrice: 'Mulai Rp 1.200.000 / Paket Brand'
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: 'test-01',
    name: 'Dimas Satria',
    role: 'Founder & Creative Director',
    company: 'Vanguard Streetwear Jakarta',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    content: 'Kualitas sablon dan bahan kaos 16s heavyweight dari SDG Industries benar-benar di atas rata-rata! Pelanggan distro kami sangat puas dengan jahitan dan fitting boxy-nya.',
    verified: true
  },
  {
    id: 'test-02',
    name: 'Stephanie Wardani',
    role: 'Brand Manager',
    company: 'Eclipse Apparel Bali',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    content: 'Kolaborasi desain grafis kaos untuk drop edisi terbatas kami sukses besar, 500 pcs ludes terjual dalam 3 hari. Komunikasi cepat dan pengiriman tepat waktu.',
    verified: true
  },
  {
    id: 'test-03',
    name: 'Fauzan Hakim',
    role: 'Owner & Merchandiser',
    company: 'Noise & Culture Distro Bandung',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    content: 'Panel web portofolio dan showroom ini sangat memudahkan kami memamerkan katalog terbaru ke investor dan reseller. Desain gelapnya elegan sekali!',
    verified: true
  }
];
