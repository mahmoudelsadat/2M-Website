import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const { data: category, error } = await supabase
      .from('Category')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) throw error;
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Failed to fetch category';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const { data: updatedCategory, error } = await supabase
      .from('Category')
      .update({
        name: data.name,
        nameAr: data.nameAr,
        slug: data.slug,
        description: data.description,
        color: data.color,
        gradient: data.gradient,
        icon: data.icon,
        image: data.image,
        productCount: data.productCount,
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Failed to update category';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const { error } = await supabase
      .from('Category')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Failed to delete category';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
