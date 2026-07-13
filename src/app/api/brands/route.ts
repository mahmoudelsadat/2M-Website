import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: brands, error } = await supabase
      .from('Brand')
      .select('*');
      
    if (error) throw error;
    
    return NextResponse.json(brands);
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Failed to fetch brands';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const slug = data.slug || data.name.toLowerCase().replace(/ /g, '-');
    const { data: newBrand, error } = await supabase
      .from('Brand')
      .insert({
        name: data.name,
        slug: slug,
        logo: data.logo || '🔵',
        productCount: data.productCount || 0,
        featured: data.featured ?? false,
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return NextResponse.json(newBrand, { status: 201 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Failed to create brand';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
