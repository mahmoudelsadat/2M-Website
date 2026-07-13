// ─── Admin Data Store ─────────────────────────────────────────
// All admin data is persisted in localStorage under 2m-admin-* keys
// This module provides typed read/write helpers used by the admin dashboard

export interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: 'pharmacy' | 'beauty' | 'wellness' | 'personal-care';
  subcategory: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: 'sale' | 'new' | 'hot' | 'pharmacist-pick' | '';
  inStock: boolean;
  stockCount: number;
  description: string;
  tags: string;
}

export interface AdminOrder {
  id: string;
  customer: string;
  phone: string;
  items: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled';
  paymentMethod: 'instapay' | 'vodafone' | 'ecash';
  address: string;
  date: string;
  notes?: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  image: string;
}

export interface Announcement {
  id: string;
  textEn: string;
  textAr: string;
  active: boolean;
}

export interface SiteSettings {
  storeNameEn: string;
  storeNameAr: string;
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  freeDeliveryThreshold: number;
  deliveryFee: number;
  instaPayUsername: string;
}

export interface HeroContent {
  headlineEn: string;
  headlineAr: string;
  subtitleEn: string;
  subtitleAr: string;
  ctaEn: string;
  ctaAr: string;
}

export interface FaqItem {
  id: string;
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
}

// ─── Default data ────────────────────────────────────────────

export const DEFAULT_PRODUCTS: AdminProduct[] = [
  { id: '1', slug: 'vitamin-d3-5000iu', name: 'Vitamin D3 5000 IU — 360 Softgels', brand: 'Now Foods', category: 'pharmacy', subcategory: 'vitamins-minerals', price: 380, originalPrice: 480, rating: 4.8, reviewCount: 312, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', badge: 'pharmacist-pick', inStock: true, stockCount: 47, description: 'High-potency Vitamin D3 for immune support, bone health, and mood.', tags: 'immunity,bone-health,vitamin-d' },
  { id: '2', slug: 'omega-3-fish-oil', name: 'Omega-3 Fish Oil Triple Strength', brand: 'Nordic Naturals', category: 'pharmacy', subcategory: 'supplements', price: 650, originalPrice: 820, rating: 4.9, reviewCount: 189, image: 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=400&q=80', badge: 'sale', inStock: true, stockCount: 28, description: 'Concentrated omega-3s for heart health, brain function.', tags: 'heart-health,brain,omega-3' },
  { id: '3', slug: 'niacinamide-serum', name: 'Niacinamide 10% + Zinc 1% Serum', brand: 'The Ordinary', category: 'beauty', subcategory: 'skincare', price: 290, rating: 4.7, reviewCount: 504, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80', badge: 'hot', inStock: true, stockCount: 120, description: 'Reduces pore appearance, controls sebum, and brightens skin tone.', tags: 'skincare,pores,brightening,acne' },
  { id: '4', slug: 'magnesium-glycinate', name: 'Magnesium Glycinate 400mg', brand: 'Pure Encapsulations', category: 'wellness', subcategory: 'sleep-stress', price: 450, originalPrice: 550, rating: 4.9, reviewCount: 267, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', badge: 'sale', inStock: true, stockCount: 34, description: 'Highly absorbable magnesium for deep sleep and stress relief.', tags: 'sleep,stress,muscle-recovery,magnesium' },
  { id: '5', slug: 'spf-50-sunscreen', name: 'Hydrating Mineral SPF 50+ Face Shield', brand: 'Altruist', category: 'beauty', subcategory: 'skincare', price: 220, rating: 4.6, reviewCount: 891, image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80', badge: 'hot', inStock: true, stockCount: 250, description: 'Broad spectrum SPF 50 with hyaluronic acid for daily sun protection.', tags: 'spf,sunscreen,hydration,skincare' },
  { id: '6', slug: 'whey-protein-chocolate', name: 'Gold Standard Whey — Chocolate', brand: 'Optimum Nutrition', category: 'wellness', subcategory: 'sports', price: 1850, originalPrice: 2100, rating: 4.8, reviewCount: 743, image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80', badge: 'sale', inStock: true, stockCount: 18, description: '24g protein per serving. Fast-digesting whey for muscle recovery.', tags: 'protein,whey,muscle,sports' },
];

export const DEFAULT_ORDERS: AdminOrder[] = [
  { id: '2M-91044', customer: 'Mahmoud El Sadat', phone: '01115160947', items: 'Solgar D3 + Altruist Dry Skin', total: 890, status: 'shipped', paymentMethod: 'instapay', address: 'Cairo, Maadi', date: '2026-05-22', notes: '' },
  { id: '2M-90821', customer: 'Yasmin Nour', phone: '01098765432', items: 'Altruist Sunscreen + Solgar Zinc', total: 720, status: 'delivered', paymentMethod: 'vodafone', address: 'Giza, Dokki', date: '2026-05-18', notes: '' },
  { id: '2M-90765', customer: 'Tarek Aly', phone: '01234567890', items: 'Nordic Naturals Omega-3 120ct', total: 1250, status: 'pending', paymentMethod: 'ecash', address: 'Alexandria, Sidi Gaber', date: '2026-05-22', notes: 'Please pack carefully' },
  { id: '2M-90510', customer: 'Farida Kamel', phone: '01122334455', items: 'CeraVe Hydrating Cleanser 473ml', total: 680, status: 'canceled', paymentMethod: 'instapay', address: 'Cairo, Heliopolis', date: '2026-05-15', notes: '' },
  { id: '2M-90301', customer: 'Ahmed Hassan', phone: '01055667788', items: 'Magnesium Glycinate 400mg', total: 450, status: 'processing', paymentMethod: 'vodafone', address: 'Cairo, Nasr City', date: '2026-05-21', notes: '' },
];

export const DEFAULT_CUSTOMERS: AdminCustomer[] = [
  { id: 'c1', name: 'Mahmoud El Sadat', phone: '01115160947', email: 'mahmoud@example.com', address: 'Cairo, Maadi', totalOrders: 4, totalSpent: 2890, joinDate: '2026-01-15' },
  { id: 'c2', name: 'Yasmin Nour', phone: '01098765432', email: 'yasmin@example.com', address: 'Giza, Dokki', totalOrders: 2, totalSpent: 1420, joinDate: '2026-02-20' },
  { id: 'c3', name: 'Tarek Aly', phone: '01234567890', email: 'tarek@example.com', address: 'Alexandria', totalOrders: 3, totalSpent: 3100, joinDate: '2026-03-05' },
  { id: 'c4', name: 'Farida Kamel', phone: '01122334455', email: 'farida@example.com', address: 'Cairo, Heliopolis', totalOrders: 1, totalSpent: 680, joinDate: '2026-04-12' },
  { id: 'c5', name: 'Ahmed Hassan', phone: '01055667788', email: 'ahmed@example.com', address: 'Cairo, Nasr City', totalOrders: 2, totalSpent: 1950, joinDate: '2026-05-01' },
];

export const DEFAULT_CATEGORIES: AdminCategory[] = [
  { id: 'pharmacy', name: 'Pharmacy', nameAr: 'الصيدلية', slug: 'pharmacy', description: 'Vitamins, supplements, medicines & more', icon: '💊', color: '#2B7CC1', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80' },
  { id: 'beauty', name: 'Beauty', nameAr: 'الجمال', slug: 'beauty', description: 'Skincare, haircare, body & cosmetics', icon: '✨', color: '#C4665A', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80' },
  { id: 'wellness', name: 'Wellness', nameAr: 'العافية', slug: 'wellness', description: 'Sports nutrition, sleep, stress & more', icon: '🌿', color: '#4A7C59', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80' },
  { id: 'personal-care', name: 'Personal Care', nameAr: 'العناية الشخصية', slug: 'personal-care', description: 'Hygiene, grooming & daily essentials', icon: '🧴', color: '#B5742A', gradient: 'linear-gradient(135deg, #f5a623 0%, #f76b1c 100%)', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80' },
];

export const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  { id: 'a1', textEn: '🚚 Free delivery on orders over EGP 500', textAr: '🚚 توصيل مجاني للطلبات أكثر من 500 جنيه', active: true },
  { id: 'a2', textEn: '⚡ Pay via InstaPay · Vodafone Cash · e& Cash', textAr: '⚡ الدفع عبر InstaPay · Vodafone Cash · e& Cash', active: true },
  { id: 'a3', textEn: '✅ 100% Authentic — Pharmacist Curated Products', textAr: '✅ منتجات أصلية 100% — اختيار صيادلة متخصصين', active: true },
  { id: 'a4', textEn: '📦 Egypt-wide delivery in 2–5 business days', textAr: '📦 توصيل لكافة محافظات مصر خلال 2–5 أيام عمل', active: true },
  { id: 'a5', textEn: '💊 Prescription advice? Chat with us on WhatsApp', textAr: '💊 استشارة دوائية؟ تحدث معنا على واتساب', active: true },
];

export const DEFAULT_SETTINGS: SiteSettings = {
  storeNameEn: '2M Premium Pharmacy',
  storeNameAr: 'صيدلية 2M المتميزة',
  whatsapp: '201115160947',
  phone: '01115160947',
  email: 'hello@2mpharmacy.com',
  address: 'Cairo, Egypt',
  freeDeliveryThreshold: 500,
  deliveryFee: 50,
  instaPayUsername: '@2mpharmacy',
};

export const DEFAULT_HERO: HeroContent = {
  headlineEn: 'Premium Health & Wellness Delivered.',
  headlineAr: 'صحتك وعافيتك بأعلى جودة تصلك لباب بيتك.',
  subtitleEn: 'Egypt\'s most trusted online pharmacy — 100% authentic products, pharmacist curated, delivered to your door.',
  subtitleAr: 'أكثر صيدلية إلكترونية موثوقاً بها في مصر — منتجات أصلية 100%، باختيار صيادلة متخصصين، توصيل لباب بيتك.',
  ctaEn: 'Shop Now',
  ctaAr: 'تسوق الآن',
};

export const DEFAULT_FAQS: FaqItem[] = [
  { id: 'f1', questionEn: 'Are your products 100% authentic?', questionAr: 'هل منتجاتكم أصلية 100%؟', answerEn: 'Yes, all our products are sourced directly from licensed distributors and manufacturers.', answerAr: 'نعم، جميع منتجاتنا مصدرها مباشرة من موزعين ومصنّعين معتمدين.' },
  { id: 'f2', questionEn: 'How long does delivery take?', questionAr: 'كم يستغرق التوصيل؟', answerEn: 'Delivery takes 2–5 business days across all Egyptian governorates.', answerAr: 'يستغرق التوصيل من 2 إلى 5 أيام عمل لجميع محافظات مصر.' },
  { id: 'f3', questionEn: 'What payment methods do you accept?', questionAr: 'ما طرق الدفع المقبولة؟', answerEn: 'We accept InstaPay, Vodafone Cash, and e& Cash transfers only.', answerAr: 'نقبل التحويل عبر InstaPay أو Vodafone Cash أو e& Cash فقط.' },
];

// ─── Storage Helpers ─────────────────────────────────────────

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

function save<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Admin Store API ─────────────────────────────────────────

export const adminStore = {
  // Products
  getProducts: (): AdminProduct[] => load('2m-admin-products', DEFAULT_PRODUCTS),
  saveProducts: (p: AdminProduct[]) => save('2m-admin-products', p),

  // Orders
  getOrders: (): AdminOrder[] => load('2m-admin-orders', DEFAULT_ORDERS),
  saveOrders: (o: AdminOrder[]) => save('2m-admin-orders', o),

  // Customers
  getCustomers: (): AdminCustomer[] => load('2m-admin-customers', DEFAULT_CUSTOMERS),
  saveCustomers: (c: AdminCustomer[]) => save('2m-admin-customers', c),

  // Categories
  getCategories: (): AdminCategory[] => load('2m-admin-categories', DEFAULT_CATEGORIES),
  saveCategories: (c: AdminCategory[]) => save('2m-admin-categories', c),

  // Announcements
  getAnnouncements: (): Announcement[] => load('2m-admin-announcements', DEFAULT_ANNOUNCEMENTS),
  saveAnnouncements: (a: Announcement[]) => save('2m-admin-announcements', a),

  // Settings
  getSettings: (): SiteSettings => load('2m-admin-settings', DEFAULT_SETTINGS),
  saveSettings: (s: SiteSettings) => save('2m-admin-settings', s),

  // Hero
  getHero: (): HeroContent => load('2m-admin-hero', DEFAULT_HERO),
  saveHero: (h: HeroContent) => save('2m-admin-hero', h),

  // FAQs
  getFaqs: (): FaqItem[] => load('2m-admin-faqs', DEFAULT_FAQS),
  saveFaqs: (f: FaqItem[]) => save('2m-admin-faqs', f),

  // Password
  getPassword: (): string => load('2m-admin-password', 'admin123'),
  savePassword: (p: string) => save('2m-admin-password', p),

  // Revenue helper
  getTotalRevenue: (): number => {
    const orders = load<AdminOrder[]>('2m-admin-orders', DEFAULT_ORDERS);
    return orders.filter(o => o.status !== 'canceled').reduce((s, o) => s + o.total, 0);
  },
};
