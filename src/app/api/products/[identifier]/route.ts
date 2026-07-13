import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface RouteParams {
  params: Promise<{
    identifier: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { identifier } = await params;
    
    const { data: product, error } = await supabase
      .from('Product')
      .select('*')
      .eq('slug', identifier)
      .maybeSingle();
      
    if (error) throw error;
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Failed to fetch product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { identifier } = await params;
    const data = await request.json();
    
    let tags: string[] | undefined;
    if (data.tags) {
      if (Array.isArray(data.tags)) {
        tags = data.tags;
      } else if (typeof data.tags === 'string') {
        tags = data.tags.split(',').map((t: string) => t.trim());
      }
    }

    const updatePayload: Record<string, string | number | boolean | string[] | null | undefined> = {
      slug: data.slug,
      name: data.name,
      brand: data.brand,
      category: data.category,
      subcategory: data.subcategory || '',
      price: data.price !== undefined ? Number(data.price) : undefined,
      originalPrice: data.originalPrice !== undefined ? (data.originalPrice ? Number(data.originalPrice) : null) : undefined,
      rating: data.rating !== undefined ? Number(data.rating) : undefined,
      reviewCount: data.reviewCount !== undefined ? Number(data.reviewCount) : undefined,
      image: data.image,
      badge: data.badge || null,
      inStock: data.inStock,
      stockCount: data.stockCount !== undefined ? Number(data.stockCount) : undefined,
      description: data.description,
    };

    if (tags !== undefined) {
      updatePayload.tags = tags;
    }

    const { data: updatedProduct, error } = await supabase
      .from('Product')
      .update(updatePayload)
      .eq('id', identifier)
      .select()
      .single();
      
    if (error) throw error;
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Failed to update product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { identifier } = await params;
    
    const { error } = await supabase
      .from('Product')
      .delete()
      .eq('id', identifier);
      
    if (error) throw error;
    
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Failed to delete product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
