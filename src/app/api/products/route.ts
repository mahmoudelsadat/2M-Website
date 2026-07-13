import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');

    let query = supabase.from('Product').select('*');

    if (category) {
      query = query.eq('category', category);
    }
    if (brand) {
      query = query.eq('brand', brand);
    }
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data: products, error } = await query;

    if (error) throw error;

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Failed to fetch products';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    let tags: string[] = [];
    if (data.tags) {
      if (Array.isArray(data.tags)) {
        tags = data.tags;
      } else if (typeof data.tags === 'string') {
        tags = data.tags.split(',').map((t: string) => t.trim());
      }
    }

    const { data: newProduct, error } = await supabase
      .from('Product')
      .insert({
        slug: data.slug,
        name: data.name,
        brand: data.brand,
        category: data.category,
        subcategory: data.subcategory || '',
        price: Number(data.price),
        originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
        rating: data.rating ? Number(data.rating) : 0,
        reviewCount: data.reviewCount ? Number(data.reviewCount) : 0,
        image: data.image,
        badge: data.badge || null,
        inStock: data.inStock ?? true,
        stockCount: data.stockCount ? Number(data.stockCount) : 0,
        description: data.description || '',
        tags: tags,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Failed to create product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
