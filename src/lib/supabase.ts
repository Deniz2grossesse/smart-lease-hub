
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Utiliser directement les valeurs des identifiants du projet Supabase
const supabaseUrl = "https://tjizepapbrxjuunzzwek.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqaXplcGFwYnJ4anV1bnp6d2VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjE3NTYsImV4cCI6MjA2MzIzNzc1Nn0.JDR7-hzyqwxAsmanDra7gfYOEhwGYBh32Rx5B60yj_A";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Export types for database
export type { User, Session } from '@supabase/supabase-js';
export type { Database } from '@/integrations/supabase/types';
