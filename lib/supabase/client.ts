import { createBrowserClient } from '@supabase/ssr';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  // Valid-format placeholder JWT — allows client to init without real credentials
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTkwMDAwMDAwMH0.KnCR-9l7vmjMHOaG6s7I6sGn7K2yK4Y2XK3aBKJxG8A';

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}
