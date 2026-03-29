const SUPABASE_URL = "https://gecfzunnxcjsuzoceshc.supabase.co";
const SUPABASE_ANON_KEY = "TU_ANON_KEY_REAL";

// conexión correcta
const { createClient } = window.supabase;

// cliente global
window.sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("Supabase OK");