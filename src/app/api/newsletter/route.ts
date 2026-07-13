import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    const { data: subscriber, error } = await supabase
      .from('Subscriber')
      .insert({ email })
      .select()
      .single();
      
    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Email is already subscribed' }, { status: 400 });
      }
      throw error;
    }
    
    console.log(`Subscribed: ${subscriber.email}`);
    
    return NextResponse.json({ success: true, message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Subscription failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
