import { type Product, type Category } from '@/lib/data';

const isServer = typeof window === 'undefined';
const API_URL = isServer
  ? (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') + '/api'
  : '/api';


export async function getProducts(filters?: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'newest';
  page?: number;
  pageSize?: number;
}): Promise<{ items: Product[]; total: number; hasMore: boolean }> {
  const params = new URLSearchParams();
  
  if (filters?.category && filters.category !== 'all') {
    params.append('category', filters.category);
  }
  if (filters?.search) {
    params.append('search', filters.search);
  }
  // Optional: implement minPrice, maxPrice, sortBy in backend or ignore for now
  
  const res = await fetch(`${API_URL}/products?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  
  const items: Product[] = await res.json();
  
  const total = items.length;
  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? 8;
  const paged = items.slice((page - 1) * pageSize, page * pageSize);

  return { items: paged, total, hasMore: (page - 1) * pageSize + paged.length < total };
}

export async function getProduct(slug: string): Promise<Product | null> {
  const res = await fetch(`${API_URL}/products/${slug}`);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch product');
  }
  return res.json();
}

export async function searchProducts(query: string, limit = 6): Promise<Product[]> {
  if (!query.trim()) return [];
  const params = new URLSearchParams({ search: query });
  const res = await fetch(`${API_URL}/products?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to search products');
  const items: Product[] = await res.json();
  return items.slice(0, limit);
}

export async function getProductsByBrand(brandName: string): Promise<Product[]> {
  const params = new URLSearchParams({ brand: brandName });
  const res = await fetch(`${API_URL}/products?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch products by brand');
  return res.json();
}

export async function getCategory(id: string): Promise<Category | null> {
  const res = await fetch(`${API_URL}/categories/${id}`);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch category');
  }
  return res.json();
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function getBrands(): Promise<{ name: string; logo: string; id?: string; slug?: string; productCount?: number; featured?: boolean }[]> {
  const res = await fetch(`${API_URL}/brands`);
  if (!res.ok) throw new Error('Failed to fetch brands');
  return res.json();
}

export async function getTestimonials() {
  const res = await fetch(`${API_URL}/testimonials`);
  if (!res.ok) throw new Error('Failed to fetch testimonials');
  return res.json();
}
