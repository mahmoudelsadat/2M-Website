import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const { data: updatedBrand, error } = await supabase
      .from('Brand')
      .update({
        name: data.name,
        slug: data.slug,
        logo: data.logo,
        productCount: data.productCount,
        featured: data.featured,
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return NextResponse.json(updatedBrand);
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Failed to update brand';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const { error } = await supabase
      .from('Brand')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Failed to delete brand';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
