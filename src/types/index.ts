export interface Product {
  id: string;
  name: string;
  category: 'oversize' | 'heavyweight' | 'vintage' | 'minimalist' | 'limited';
  price: number;
  originalPrice?: number;
  description: string;
  material: string;
  gsm: string;
  sizes: string[];

  colors: string[];
  imageUrl: string;
  stock: number;
  featured: boolean;
  tag?: string;
  rating: number;
  soldCount: number;
  marketplaceUrl?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  client: string;
  year: string;
  description: string;
  imageUrl: string;
  tags: string[];
  link?: string;
  stats?: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  icon: string;
  startingPrice: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  content: string;
  verified: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface SocialChannel {
  label: string;
  url: string;
}

export interface SizeChartRow {
  size: string;
  width: string;
  length: string;
  sleeve: string;
}

export interface SiteConfig {
  founderName: string;
  roleTitle: string;
  bio: string;
  yearsOfExp: string;
  projectsDelivered: string;
  satisfiedClients: string;
  cottonQuality: string;
  whatsappNumber: string;
  email: string;
  instagram: string;
  shopeeUrl?: string;
  address: string;
  heroImages?: string[];
  channels?: SocialChannel[];
  // Custom Promo & Release Announcement Card Fields for Admin CPanel
  promoTitle?: string;
  promoSubtitle?: string;
  promoTag?: string;
  promoBadgeTitle?: string;
  promoBadgeSubtitle?: string;
  promoStatCount?: string;
  promoStatLabel?: string;
  sizeChart?: SizeChartRow[];
  logoUrl?: string;
}



