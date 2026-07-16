// ─── Product & Category Data ──────────────────────────────────

export interface Product {
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
  badge?: 'sale' | 'new' | 'hot' | 'pharmacist-pick';
  inStock: boolean;
  stockCount?: number;
  description: string;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  productCount: number;
  color: string;
  gradient: string;
  icon: string;
  image: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  productCount: number;
  featured: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  product: string;
  date: string;
  verified: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────

export const categories: Category[] = [
  {
    id: 'pharmacy',
    name: 'Pharmacy',
    nameAr: 'الصيدلية',
    slug: 'pharmacy',
    description: 'Vitamins, supplements, medicines & more',
    productCount: 240,
    color: '#4facfe',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    icon: '💊',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80',
  },
  {
    id: 'beauty',
    name: 'Beauty',
    nameAr: 'الجمال',
    slug: 'beauty',
    description: 'Skincare, haircare, body & cosmetics',
    productCount: 185,
    color: '#f093fb',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: '✨',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
  },
  {
    id: 'wellness',
    name: 'Wellness',
    nameAr: 'العافية',
    slug: 'wellness',
    description: 'Sports nutrition, sleep, stress & more',
    productCount: 132,
    color: '#43e97b',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    icon: '🌿',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    nameAr: 'العناية الشخصية',
    slug: 'personal-care',
    description: 'Hygiene, grooming & daily essentials',
    productCount: 98,
    color: '#f5a623',
    gradient: 'linear-gradient(135deg, #f5a623 0%, #f76b1c 100%)',
    icon: '🧴',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80',
  },
];

export const products: Product[] = [
  {
    id: '1',
    slug: 'vitamin-d3-5000iu',
    name: 'Vitamin D3 5000 IU — 360 Softgels',
    brand: 'Now Foods',
    category: 'pharmacy',
    subcategory: 'vitamins-minerals',
    price: 380,
    originalPrice: 480,
    rating: 4.8,
    reviewCount: 312,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
    badge: 'pharmacist-pick',
    inStock: true,
    stockCount: 47,
    description: 'High-potency Vitamin D3 for immune support, bone health, and mood.',
    tags: ['immunity', 'bone-health', 'vitamin-d'],
  },
  {
    id: '2',
    slug: 'omega-3-fish-oil',
    name: 'Omega-3 Fish Oil Triple Strength',
    brand: 'Nordic Naturals',
    category: 'pharmacy',
    subcategory: 'supplements',
    price: 650,
    originalPrice: 820,
    rating: 4.9,
    reviewCount: 189,
    image: 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=400&q=80',
    badge: 'sale',
    inStock: true,
    stockCount: 28,
    description: 'Concentrated omega-3s for heart health, brain function, and inflammation support.',
    tags: ['heart-health', 'brain', 'omega-3'],
  },
  {
    id: '3',
    slug: 'niacinamide-serum',
    name: 'Niacinamide 10% + Zinc 1% Serum',
    brand: 'The Ordinary',
    category: 'beauty',
    subcategory: 'skincare',
    price: 290,
    rating: 4.7,
    reviewCount: 504,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80',
    badge: 'hot',
    inStock: true,
    stockCount: 120,
    description: 'Reduces pore appearance, controls sebum, and brightens skin tone.',
    tags: ['skincare', 'pores', 'brightening', 'acne'],
  },
  {
    id: '4',
    slug: 'magnesium-glycinate',
    name: 'Magnesium Glycinate 400mg',
    brand: 'Pure Encapsulations',
    category: 'wellness',
    subcategory: 'sleep-stress',
    price: 450,
    originalPrice: 550,
    rating: 4.9,
    reviewCount: 267,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
    badge: 'sale',
    inStock: true,
    stockCount: 34,
    description: 'Highly absorbable magnesium for deep sleep, muscle relaxation, and stress relief.',
    tags: ['sleep', 'stress', 'muscle-recovery', 'magnesium'],
  },
  {
    id: '5',
    slug: 'spf-50-sunscreen',
    name: 'Hydrating Mineral SPF 50+ Face Shield',
    brand: 'Altruist',
    category: 'beauty',
    subcategory: 'skincare',
    price: 220,
    rating: 4.6,
    reviewCount: 891,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80',
    badge: 'hot',
    inStock: true,
    stockCount: 250,
    description: 'Broad spectrum SPF 50 with hyaluronic acid for daily sun protection.',
    tags: ['spf', 'sunscreen', 'hydration', 'skincare'],
  },
  {
    id: '6',
    slug: 'whey-protein-chocolate',
    name: 'Gold Standard Whey Protein — Chocolate',
    brand: 'Optimum Nutrition',
    category: 'wellness',
    subcategory: 'sports-nutrition',
    price: 1200,
    originalPrice: 1450,
    rating: 4.8,
    reviewCount: 1423,
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80',
    badge: 'sale',
    inStock: true,
    stockCount: 12,
    description: 'Best-selling whey protein powder for muscle building and recovery.',
    tags: ['protein', 'muscle-gain', 'sports', 'chocolate'],
  },
  {
    id: '7',
    slug: 'vitamin-c-serum',
    name: 'Vitamin C 20% Brightening Serum',
    brand: 'Skinceuticals',
    category: 'beauty',
    subcategory: 'skincare',
    price: 890,
    originalPrice: 1100,
    rating: 4.9,
    reviewCount: 342,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80',
    badge: 'new',
    inStock: true,
    stockCount: 45,
    description: 'Pure L-ascorbic acid serum for brightening, anti-aging, and protection.',
    tags: ['vitamin-c', 'brightening', 'anti-aging', 'skincare'],
  },
  {
    id: '8',
    slug: 'zinc-lozenges',
    name: 'Zinc Elderberry Lozenges — Immunity Boost',
    brand: 'Garden of Life',
    category: 'pharmacy',
    subcategory: 'immunity',
    price: 195,
    rating: 4.5,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=400&q=80',
    badge: 'new',
    inStock: true,
    stockCount: 78,
    description: 'Zinc + elderberry combination for fast immune support.',
    tags: ['immunity', 'zinc', 'elderberry', 'cold-flu'],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sara Ahmed',
    avatar: 'https://i.pravatar.cc/60?img=1',
    rating: 5,
    text: 'Amazing quality products! The Vitamin D arrived next day and is exactly as described. Will definitely shop again. 🌟',
    product: 'Vitamin D3 5000 IU',
    date: '2 days ago',
    verified: true,
  },
  {
    id: '2',
    name: 'Mohamed Hassan',
    avatar: 'https://i.pravatar.cc/60?img=12',
    rating: 5,
    text: 'Best online pharmacy in Egypt. COD option made it so easy. The whey protein is authentic — I checked the batch number.',
    product: 'ON Gold Standard Whey',
    date: '1 week ago',
    verified: true,
  },
  {
    id: '3',
    name: 'Nour Khalil',
    avatar: 'https://i.pravatar.cc/60?img=5',
    rating: 5,
    text: 'The skincare section is incredible. Found products I couldn\'t find anywhere else in Egypt. Super fast delivery to Alexandria!',
    product: 'Niacinamide Serum',
    date: '3 days ago',
    verified: true,
  },
  {
    id: '4',
    name: 'Ahmed Sayed',
    avatar: 'https://i.pravatar.cc/60?img=8',
    rating: 5,
    text: 'Magnesium Glycinate changed my sleep quality completely. Professional packaging and great customer service.',
    product: 'Magnesium Glycinate',
    date: '5 days ago',
    verified: true,
  },
  {
    id: '5',
    name: 'Laila Mostafa',
    avatar: 'https://i.pravatar.cc/60?img=9',
    rating: 4,
    text: 'Love the premium feel of this website. Everything is well organized and easy to find. Highly recommend!',
    product: 'SPF 50 Sunscreen',
    date: '1 week ago',
    verified: true,
  },
  {
    id: '6',
    name: 'Omar Farouk',
    avatar: 'https://i.pravatar.cc/60?img=15',
    rating: 5,
    text: 'Finally a place I trust to buy genuine supplements. The Omega-3 is exactly what I needed. 100% authentic.',
    product: 'Nordic Naturals Omega-3',
    date: '2 weeks ago',
    verified: true,
  },
];

export const brands = [
  { name: 'Now Foods', logo: '🔵' },
  { name: 'Nordic Naturals', logo: '🟦' },
  { name: 'The Ordinary', logo: '⬛' },
  { name: 'Optimum Nutrition', logo: '🟥' },
  { name: 'Garden of Life', logo: '🟢' },
  { name: 'Pure Encapsulations', logo: '⚪' },
  { name: 'Skinceuticals', logo: '🔷' },
  { name: 'Altruist', logo: '🟧' },
  { name: 'Solgar', logo: '🔶' },
  { name: 'Jarrow Formulas', logo: '🟩' },
  { name: 'Thorne', logo: '🔴' },
  { name: 'Life Extension', logo: '🟣' },
];

export const trustStats = [
  { value: 500, suffix: '+', label: 'Premium Brands', labelAr: 'علامة تجارية' },
  { value: 10000, suffix: '+', label: 'Happy Customers', labelAr: 'عميل سعيد' },
  { value: 27, suffix: '', label: 'Governorates Covered', labelAr: 'محافظة' },
  { value: 98, suffix: '%', label: 'Authentic Products', labelAr: 'منتجات أصلية' },
];

export const navLinks = [
  {
    label: 'PHARMACY',
    labelAr: 'الصيدلية',
    href: '/pharmacy',
    submenu: [
      { label: 'Vitamins & Minerals', labelAr: 'الفيتامينات والمعادن', href: '/pharmacy/vitamins' },
      { label: 'Supplements', labelAr: 'المكملات الغذائية', href: '/pharmacy/supplements' },
      { label: 'Medicines & OTC', labelAr: 'الأدوية والمسكنات', href: '/pharmacy/medicines' },
      { label: 'Baby & Pediatric', labelAr: 'العناية بالطفل', href: '/pharmacy/baby' },
      { label: 'Medical Devices', labelAr: 'الأجهزة الطبية', href: '/pharmacy/devices' },
    ],
  },
  {
    label: 'BEAUTY',
    labelAr: 'الجمال',
    href: '/beauty',
    submenu: [
      { label: 'Skincare', labelAr: 'العناية بالبشرة', href: '/beauty/skincare' },
      { label: 'Hair Care', labelAr: 'العناية بالشعر', href: '/beauty/haircare' },
      { label: 'Body Care', labelAr: 'العناية بالجسم', href: '/beauty/bodycare' },
      { label: 'Cosmetics', labelAr: 'مستحضرات التجميل', href: '/beauty/cosmetics' },
      { label: 'Oral Care', labelAr: 'العناية بالفم', href: '/beauty/oral-care' },
    ],
  },
  {
    label: 'WELLNESS',
    labelAr: 'العافية',
    href: '/wellness',
    submenu: [
      { label: 'Sports Nutrition', labelAr: 'التغذية الرياضية', href: '/wellness/sports' },
      { label: 'Weight Management', labelAr: 'إدارة الوزن', href: '/wellness/weight' },
      { label: 'Sleep & Stress', labelAr: 'النوم والتوتر', href: '/wellness/sleep' },
      { label: 'Immunity', labelAr: 'المناعة', href: '/wellness/immunity' },
      { label: "Women's Health", labelAr: 'صحة المرأة', href: '/wellness/womens' },
    ],
  },
  {
    label: 'PERSONAL CARE',
    labelAr: 'العناية',
    href: '/personal-care',
    submenu: [
      { label: 'Hygiene', labelAr: 'النظافة الشخصية', href: '/personal-care/hygiene' },
      { label: 'Grooming', labelAr: 'العناية بالمظهر', href: '/personal-care/grooming' },
      { label: 'Feminine Care', labelAr: 'العناية بالمرأة', href: '/personal-care/feminine' },
      { label: 'Eye & Ear Care', labelAr: 'العناية بالعين والأذن', href: '/personal-care/eye-ear' },
    ],
  },
  { label: 'OFFERS', labelAr: 'العروض', href: '/offers', submenu: [] },
  { label: 'BRANDS', labelAr: 'الماركات', href: '/brands', submenu: [] },
];
