
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://idlewpgkdcxjlchdvgqv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkbGV3cGdrZGN4amxjbmR2Z3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5ODk0NjIsImV4cCI6MjA4NjU2NTQ2Mn0.sCm1wZm0EwmgvIDFSK3hWrwnDHw_CKYFNswXc_8a0zY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function test() {
    console.log("Testing connection to:", SUPABASE_URL);
    const { data, error } = await supabase.from('user_progress').select('*').limit(1);
    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Success:", data);
    }
}

test();
