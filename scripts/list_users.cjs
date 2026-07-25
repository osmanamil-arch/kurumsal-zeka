const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wjacsevymirawqtatopt.supabase.co';
const supabaseAnonKey = 'sb_publishable_r2H3W085OFIfhiz7rPUmZA__szcQPQ4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listUsers() {
  try {
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
      email: 'osmanamil@gmail.com',
      password: '123456'
    });
    if (authErr) throw authErr;

    const { data: profiles, error: profileErr } = await supabase.from('profiles').select('*');
    if (profileErr) throw profileErr;
    
    console.log(JSON.stringify(profiles, null, 2));
  } catch (err) {
    console.error('Error fetching users:', err.message);
  }
}

listUsers();
