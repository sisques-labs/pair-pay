import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Check if user has a couple
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('Profile')
          .select('coupleId')
          .eq('id', user.id)
          .single();
        
        // Redirect to appropriate page
        if (profile?.coupleId) {
          return NextResponse.redirect(`${origin}/expenses`);
        } else {
          return NextResponse.redirect(`${origin}/couple/create`);
        }
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${origin}/login`);
}
