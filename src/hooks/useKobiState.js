import { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

export function useKobiState(companyId, key, defaultValue) {
  const storageKey = `kobi_${companyId}_${key}`;

  const [state, setState] = useState(() => {
    try {
      const item = window.localStorage.getItem(storageKey);
      if (item) return JSON.parse(item);
    } catch (e) {
      console.warn(`Error reading offline cache for ${key}:`, e);
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  });

  const isInitialMount = useRef(true);

  // 1. Fetch from Supabase on mount
  useEffect(() => {
    if (!isSupabaseConfigured || !companyId) return;

    let isMounted = true;
    const fetchFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('company_states')
          .select('data')
          .eq('company_id', companyId)
          .eq('key', key)
          .maybeSingle();

        if (isMounted && data && !error) {
          setState(data.data);
          window.localStorage.setItem(storageKey, JSON.stringify(data.data));
        }
      } catch (err) {
        console.error(`Error loading state ${key} from Supabase:`, err);
      }
    };

    fetchFromSupabase();

    return () => {
      isMounted = false;
    };
  }, [companyId, key]);

  // 2. Sync to Supabase & local cache on changes
  useEffect(() => {
    // Write cache immediately
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (e) {
      console.warn(`Error updating offline cache for ${key}:`, e);
    }

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!isSupabaseConfigured || !companyId) return;

    const saveToSupabase = async () => {
      try {
        await supabase
          .from('company_states')
          .upsert({
            company_id: companyId,
            key: key,
            data: state,
            updated_at: new Date().toISOString()
          });
      } catch (err) {
        console.error(`Error syncing state ${key} to Supabase:`, err);
      }
    };

    // Debounce to prevent API spamming
    const timer = setTimeout(saveToSupabase, 800);
    return () => clearTimeout(timer);
  }, [state, companyId, key]);

  return [state, setState];
}
