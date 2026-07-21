import { createClient } from "@supabase/supabase-js";

// Menggunakan VITE_ prefix agar bisa diakses oleh aplikasi React (Frontend)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder";

export const supabase = createClient(supabaseUrl, supabaseKey);
