import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: testimonials, error } = await supabase
      .from('Testimonial')
      .select('*');
      
    if (error) throw error;
    
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Failed to fetch testimonials';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const { data: newTestimonial, error } = await supabase
      .from('Testimonial')
      .insert({
        name: data.name,
        avatar: data.avatar || 'https://i.pravatar.cc/60?img=1',
        rating: data.rating ? Number(data.rating) : 5,
        text: data.text || '',
        product: data.product || '',
        date: data.date || 'Just now',
        verified: data.verified ?? true,
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Failed to create testimonial';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
