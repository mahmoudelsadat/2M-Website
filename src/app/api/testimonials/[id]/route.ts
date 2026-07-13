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
    
    const { data: updatedTestimonial, error } = await supabase
      .from('Testimonial')
      .update({
        name: data.name,
        avatar: data.avatar,
        rating: data.rating ? Number(data.rating) : undefined,
        text: data.text,
        product: data.product,
        date: data.date,
        verified: data.verified,
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return NextResponse.json(updatedTestimonial);
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Failed to update testimonial';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const { error } = await supabase
      .from('Testimonial')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Failed to delete testimonial';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
