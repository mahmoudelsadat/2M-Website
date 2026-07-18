import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    
    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 401 });
    }

    const user = authData.user;
    
    // Retrieve role from user metadata
    let role = user.user_metadata?.role || 'customer';
    
    // Fallback: Check profiles or user_roles table if metadata role is not present
    if (!user.user_metadata?.role) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
          
        if (profile?.role) {
          role = profile.role;
        }
      } catch (err) {
        console.error('Failed to query user profiles table:', err);
      }
    }

    const token = jwt.sign({ email, role, id: user.id }, JWT_SECRET, { expiresIn: '1d' });
    
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
