// ============================================================
//  SUPABASE CONFIG — Mujer Cobra
//  Cargar ANTES que shop.js y cart.js
// ============================================================
const SUPABASE_URL      = "https://mvtdzqjtbmgvhdoouhjw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12dGR6cWp0Ym1ndmhkb291aGp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMzE4OTYsImV4cCI6MjA5NzcwNzg5Nn0.8oECgc0FHwmjwinCISL4tsaZkQP75nfi2QHPHKivIUA";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: true,
        storageKey: 'mujercobra-admin',
        storage: window.localStorage,
        autoRefreshToken: true,
    }
});
window.supabaseClient = supabaseClient;
