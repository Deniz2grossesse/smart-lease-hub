
import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key';

// Check if environment variables are properly set in production
if (import.meta.env.PROD && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  console.error('Missing Supabase environment variables in production');
}

// Add types to the Supabase client to improve TypeScript integration
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export types for database
export type { User, Session } from '@supabase/supabase-js';
