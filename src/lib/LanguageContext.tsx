/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Locale = 'en' | 'ar';

interface LanguageContextProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Navbars & Common
    cart: "Cart",
    myAccount: "Account",
    adminPortal: "Admin Portal",
    logout: "Log Out",
    login: "Log In",
    signup: "Sign Up",
    freeDelivery: "🚚 Free delivery on orders over EGP 500",
    cod: "💳 Cash on Delivery Available",
    authentic: "✅ 100% Authentic Products",
    offers: "OFFERS",
    brands: "BRANDS",
    pharmacy: "PHARMACY",
    beauty: "BEAUTY",
    wellness: "WELLNESS",
    personalCare: "PERSONAL CARE",
    home: "Home",
    search: "Search",
    shop: "Shop",
    account: "Account",

    // Search Autocomplete
    searchPlaceholder: "Search products, brands...",
    searchCategories: "Search Categories",
    trendingSearch: "Trending",
    allPharmacy: "💊 Pharmacy",
    allBeauty: "✨ Beauty",
    allWellness: "🌿 Wellness",
    searching: "Searching...",
    noResults: "No results for",
    tryDifferent: "Try a different keyword or browse categories",
    seeAllResults: "See all results for",

    // Hero
    heroTitle: "Premium Health & Wellness Delivered",
    heroSubtitle: "Egypt's trusted premium pharmacy — authentic vitamins, supplements, beauty, and daily essentials. Pharmacist-curated, right to your doorstep.",
    shopNow: "Shop Now",
    exploreBrands: "Explore Brands",

    // Trust stats
    statBrands: "Premium Brands",
    statCustomers: "Happy Customers",
    statGovernorates: "Governorates Covered",
    statAuthentic: "Authentic Products",

    // Buttons & General
    addToCart: "Add to Cart",
    viewProduct: "View Details",
    quickView: "Quick View",
    subtotal: "Subtotal",
    total: "Total",
    checkout: "Checkout",
    placeOrder: "Place Order",
    contactUs: "Contact Us",

    // Forms & Inputs
    fullName: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    message: "Your Message",
    messagePlaceholder: "How can we help you today? Please be as detailed as possible...",
    orderNotes: "Order Notes / Special Delivery Instructions",
    notesPlaceholder: "e.g., apartment number, building instructions, preferred delivery time...",
    charactersLeft: "characters remaining",
    submitting: "Submitting...",
    successSubmit: "Form submitted successfully!",

    // Dashboards
    userDashboard: "User Dashboard",
    welcomeBack: "Welcome back",
    healthPoints: "Loyalty Points Score",
    pointsDescription: "Earn 50 more points on your next purchase to unlock a free Vitamin C bottle!",
    activeOrders: "Active Orders",
    pastPurchases: "Order History",
    shippingAddress: "Shipping Addresses",
    orderTimeline: "Order Tracker Timeline",
    orderPlaced: "Order Placed",
    orderShipped: "Order Shipped",
    orderDelivered: "Out for Delivery",
    noActiveOrders: "No active orders. Place an order to track it here!",
    loyaltyTier: "Gold Health Member",
    addressTitle: "Default Delivery Address",
    addressPlaceholder: "12 El Horreya St, Heliopolis, Cairo, Egypt",

    // Admin Dashboard
    adminDashboard: "Admin Dashboard",
    revenue: "Total Revenue",
    totalOrders: "Orders Processed",
    productsCount: "Supplements Cataloged",
    activePatients: "Registered Patients",
    recentOrders: "Recent Orders Queue",
    statusPending: "Pending",
    statusShipped: "Shipped",
    statusDelivered: "Delivered",
    statusCanceled: "Canceled",
    actionUpdate: "Update Status",
    chartsLabel: "Weekly Revenue Performance (EGP)",
    adminDemoBypass: "Quick Demo Bypass"
  },
  ar: {
    // Navbars & Common
    cart: "السلة",
    myAccount: "حسابي",
    adminPortal: "بوابة المسؤول",
    logout: "تسجيل الخروج",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    freeDelivery: "🚚 شحن مجاني للطلبات فوق 500 جنيه",
    cod: "💳 الدفع عند الاستلام متوفر",
    authentic: "✅ منتجات أصلية 100%",
    offers: "العروض",
    brands: "الماركات",
    pharmacy: "الصيدلية",
    beauty: "الجمال",
    wellness: "العافية",
    personalCare: "العناية الشخصية",
    home: "الرئيسية",
    search: "البحث",
    shop: "المتجر",
    account: "الحساب",

    // Search Autocomplete
    searchPlaceholder: "ابحث عن المنتجات، العلامات التجارية...",
    searchCategories: "أقسام البحث",
    trendingSearch: "شائع حالياً",
    allPharmacy: "💊 الأدوية والفيتامينات",
    allBeauty: "✨ التجميل والبشرة",
    allWellness: "🌿 الصحة العامة",
    searching: "جاري البحث...",
    noResults: "لا توجد نتائج لـ",
    tryDifferent: "حاول البحث بكلمة أخرى أو تصفح الأقسام",
    seeAllResults: "عرض كافة النتائج لـ",

    // Hero
    heroTitle: "صحتك وعافيتك بأعلى جودة بين يديك",
    heroSubtitle: "صيدلية 2M بريميوم الموثوقة في مصر — فيتامينات ومكملات غذائية أصلية، ومستحضرات تجميل راقية. توصيل لكافة المحافظات والدفع عند الاستلام.",
    shopNow: "تسوق الآن",
    exploreBrands: "استكشف الماركات",

    // Trust stats
    statBrands: "ماركة فاخرة",
    statCustomers: "عميل سعيد",
    statGovernorates: "محافظة مغطاة",
    statAuthentic: "منتجات أصلية",

    // Buttons & General
    addToCart: "إضافة للسلة",
    viewProduct: "عرض التفاصيل",
    quickView: "عرض سريع",
    subtotal: "المجموع الفرعي",
    total: "الإجمالي",
    checkout: "الدفع والشحن",
    placeOrder: "تأكيد الطلب",
    contactUs: "اتصل بنا",

    // Forms & Inputs
    fullName: "الاسم بالكامل",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    message: "رسالتك",
    messagePlaceholder: "كيف يمكننا مساعدتك اليوم؟ يرجى كتابة التفاصيل هنا...",
    orderNotes: "ملاحظات الطلب / تعليمات التوصيل الخاصة",
    notesPlaceholder: "مثال: رقم الشقة، علامات مميزة للعنوان، وقت التوصيل المفضل...",
    charactersLeft: "حرفاً متبقياً",
    submitting: "جاري الإرسال...",
    successSubmit: "تم إرسال النموذج بنجاح!",

    // Dashboards
    userDashboard: "لوحة تحكم المستخدم",
    welcomeBack: "مرحباً بك مجدداً",
    healthPoints: "نقاط برنامج الولاء والصحة",
    pointsDescription: "احصل على 50 نقطة إضافية في طلبيتك القادمة لفتح هدية عبوة فيتامين C مجانية!",
    activeOrders: "الطلبات النشطة",
    pastPurchases: "سجل الطلبات السابقة",
    shippingAddress: "عناوين الشحن",
    orderTimeline: "مخطط تتبع حالة الطلب",
    orderPlaced: "تم تقديم الطلب",
    orderShipped: "تم الشحن",
    orderDelivered: "جاري التوصيل",
    noActiveOrders: "لا توجد طلبات نشطة حالياً. اطلب الآن لتتبعها هنا!",
    loyaltyTier: "عضو صحي ذهبي",
    addressTitle: "عنوان التوصيل الافتراضي",
    addressPlaceholder: "12 شارع الحرية، مصر الجديدة، القاهرة، مصر",

    // Admin Dashboard
    adminDashboard: "لوحة تحكم المسؤول",
    revenue: "إجمالي الإيرادات",
    totalOrders: "الطلبات المكتملة",
    productsCount: "المنتجات المدرجة",
    activePatients: "المرضى المسجلين",
    recentOrders: "قائمة الطلبات الأخيرة",
    statusPending: "قيد الانتظار",
    statusShipped: "تم الشحن",
    statusDelivered: "تم التوصيل",
    statusCanceled: "ملغي",
    actionUpdate: "تحديث الحالة",
    chartsLabel: "أداء الإيرادات الأسبوعية (بالجنيه)",
    adminDemoBypass: "الدخول السريع للتجربة"
  }
};

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('2m-locale') as Locale;
    if (saved === 'ar' || saved === 'en') {
      setLocaleState(saved);
      document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = saved;
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('2m-locale', newLocale);
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLocale;
  };

  const t = (key: string): string => {
    return translations[locale][key] || key;
  };

  const isRtl = locale === 'ar';

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
