const SUPABASE_URL = "https://fayyvzywdytthjynjlef.supabase.co";
const SUPABASE_KEY = "sb_publishable_zW6ewM4keRUwNYSbl8njLw_VEVafsBK";

// Tambahan Debug Langkah 3
console.log("URL:", SUPABASE_URL);
console.log("KEY:", SUPABASE_KEY.substring(0, 20) + "...");

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("Public Supabase Ready");