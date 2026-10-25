import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseConfig } from '../types';

const STORAGE_KEY_SUPABASE = 'smartcare_supabase_config';

export function getStoredSupabaseConfig(): SupabaseConfig {
  const metaEnv = (import.meta as any).env || {};
  const envUrl = metaEnv.VITE_SUPABASE_URL || '';
  const envKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

  if (envUrl && envKey) {
    return {
      url: envUrl,
      anonKey: envKey,
      isConfigured: true
    };
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY_SUPABASE);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return {
          url: parsed.url,
          anonKey: parsed.anonKey,
          isConfigured: true
        };
      }
    }
  } catch (e) {
    console.warn('Failed to parse Supabase config from localStorage', e);
  }

  return {
    url: '',
    anonKey: '',
    isConfigured: false
  };
}

export function saveSupabaseConfig(url: string, anonKey: string) {
  try {
    localStorage.setItem(STORAGE_KEY_SUPABASE, JSON.stringify({ url, anonKey }));
  } catch (e) {
    console.error('Error saving Supabase config', e);
  }
}

export function clearSupabaseConfig() {
  try {
    localStorage.removeItem(STORAGE_KEY_SUPABASE);
  } catch (e) {
    console.error('Error clearing Supabase config', e);
  }
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const config = getStoredSupabaseConfig();
  if (!config.isConfigured || !config.url || !config.anonKey) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey);
    } catch (err) {
      console.error('Failed to initialize Supabase Client:', err);
      return null;
    }
  }
  return supabaseInstance;
}
