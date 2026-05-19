import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env"
  );
}

/** Browser Supabase client (Vite SPA). Import as: `import { supabase } from "@/integrations/supabase/client"` */
export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseKey);
