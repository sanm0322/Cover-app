import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

/**
 * React hook that returns the current Supabase auth session.
 * Returns `null` when loading, `false` when not logged in, and the session
 * object when logged in.
 */
export function useSession() {
  const [session, setSession] = useState(null); // null = still loading

  useEffect(() => {
    // Fetch the current session once on mount
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? false);
    });

    // Subscribe to changes (login, logout, token refresh)
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? false);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  return session;
}
