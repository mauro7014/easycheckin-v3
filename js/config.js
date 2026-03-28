// 🔴 Verificación
if (!window.supabase) {
    console.error("❌ Supabase no cargó");
}

// 🔴 CONFIG REAL
const SUPABASE_URL = "https://gecfzunnxcjsuzoceshc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlY2Z6dW5ueGNqc3V6b2Nlc2hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2OTE4MjgsImV4cCI6MjA5MDI2NzgyOH0.dVxnQFpo8nXRAEuETLA7atGkxmAfMH0DUgbvvUCTYJc";

// 🔴 INIT
const { createClient } = window.supabase;

// 🔴 GLOBAL (clave para todo el proyecto)
window.sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("✅ Supabase listo");