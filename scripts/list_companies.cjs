const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wjacsevymirawqtatopt.supabase.co';
const supabaseAnonKey = 'sb_publishable_r2H3W085OFIfhiz7rPUmZA__szcQPQ4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listCompanies() {
  try {
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
      email: 'osmanamil@gmail.com',
      password: '123456'
    });
    if (authErr) throw authErr;

    const { data: companies, error: compErr } = await supabase.from('companies').select('*');
    if (compErr) throw compErr;

    console.log(JSON.stringify(companies, null, 2));
  } catch (err) {
    console.error('Error fetching companies:', err.message);
  }
}

listCompanies();
