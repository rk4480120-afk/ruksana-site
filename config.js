/* ============================================================
   SUPABASE CONFIG — Ruksana Medical Trust
   Replace with your actual Supabase project credentials
   ============================================================ */

const SUPABASE_CONFIG = {
  url: 'YOUR_SUPABASE_PROJECT_URL',        // e.g. https://xyzcompany.supabase.co
  anonKey: 'YOUR_SUPABASE_ANON_KEY'        // Your public anon key
};

/* ─── Initialize Supabase Client ─────────────────────────── */
// Import via CDN in HTML: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

let supabaseClient = null;

function getSupabase() {
  if (supabaseClient) return supabaseClient;

  if (typeof supabase === 'undefined') {
    console.warn('[RMT] Supabase not loaded. Check CDN import.');
    return null;
  }

  if (!SUPABASE_CONFIG.url || SUPABASE_CONFIG.url === 'YOUR_SUPABASE_PROJECT_URL') {
    console.warn('[RMT] Supabase credentials not configured. Using mock mode.');
    return null;
  }

  supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
  return supabaseClient;
}

/* ─── Database Schema Reference ─────────────────────────────
   Run this SQL in Supabase SQL Editor to create tables:

   -- Users Table
   CREATE TABLE IF NOT EXISTS users (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     name text NOT NULL,
     email text UNIQUE,
     phone text,
     created_at timestamptz DEFAULT now()
   );

   -- Appointments Table
   CREATE TABLE IF NOT EXISTS appointments (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     patient_name text NOT NULL,
     phone text NOT NULL,
     email text,
     age int,
     gender text,
     doctor text,
     department text NOT NULL,
     appointment_date date NOT NULL,
     appointment_time time NOT NULL,
     problem text,
     status text DEFAULT 'pending',
     created_at timestamptz DEFAULT now()
   );

   -- Contact Messages Table
   CREATE TABLE IF NOT EXISTS contact_messages (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     name text NOT NULL,
     email text,
     phone text,
     message text NOT NULL,
     created_at timestamptz DEFAULT now()
   );

   -- Enable RLS
   ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
   ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

   -- Allow anonymous inserts (for form submissions)
   CREATE POLICY "Allow anonymous inserts" ON appointments
     FOR INSERT TO anon WITH CHECK (true);

   CREATE POLICY "Allow anonymous inserts" ON contact_messages
     FOR INSERT TO anon WITH CHECK (true);
============================================================ */

/* ─── Appointment Operations ─────────────────────────────── */
async function submitAppointment(data) {
  const db = getSupabase();

  const appointment = {
    patient_name     : data.patient_name?.trim(),
    phone            : data.phone?.trim(),
    email            : data.email?.trim() || null,
    age              : parseInt(data.age) || null,
    gender           : data.gender || null,
    doctor           : data.doctor?.trim() || null,
    department       : data.department?.trim(),
    appointment_date : data.appointment_date,
    appointment_time : data.appointment_time,
    problem          : data.problem?.trim() || null,
    status           : 'pending'
  };

  if (!db) {
    // Mock mode — simulate success
    console.log('[RMT Mock] Appointment data:', appointment);
    await delay(800);
    return { data: { id: 'mock-' + Date.now(), ...appointment }, error: null };
  }

  const { data: result, error } = await db
    .from('appointments')
    .insert([appointment])
    .select()
    .single();

  return { data: result, error };
}

/* ─── Contact Message Operations ─────────────────────────── */
async function submitContactMessage(data) {
  const db = getSupabase();

  const message = {
    name    : data.name?.trim(),
    email   : data.email?.trim() || null,
    phone   : data.phone?.trim() || null,
    message : data.message?.trim()
  };

  if (!db) {
    console.log('[RMT Mock] Contact data:', message);
    await delay(800);
    return { data: { id: 'mock-' + Date.now(), ...message }, error: null };
  }

  const { data: result, error } = await db
    .from('contact_messages')
    .insert([message])
    .select()
    .single();

  return { data: result, error };
}

/* ─── Utility ─────────────────────────────────────────────── */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Expose to global scope
window.RMT_DB = {
  submitAppointment,
  submitContactMessage,
  getSupabase
};
