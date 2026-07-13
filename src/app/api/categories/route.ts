import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from('Category')
      .select('*');
      
    if (error) throw error;
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Failed to fetch categories';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const { data: newCategory, error } = await supabase
      .from('Category')
      .insert({
        name: data.name,
        nameAr: data.nameAr,
        slug: data.slug,
        description: data.description || '',
        color: data.color || '#2B7CC1',
        gradient: data.gradient || '',
        icon: data.icon || '📦',
        image: data.image || '',
        productCount: data.productCount || 0,
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Failed to create category';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
