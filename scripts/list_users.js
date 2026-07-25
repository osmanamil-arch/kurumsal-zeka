const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wjacsevymirawqtatopt.supabase.co';
const supabaseAnonKey = 'sb_publishable_r2H3W085OFIfhiz7rPUmZA__szcQPQ4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listUsers() {
  try {
    const { data: profiles, error: profileErr } = await supabase.from('profiles').select('*');
    if (profileErr) throw profileErr;
    
    // Fetch companies to display human-readable company names
    const { data: companies, error: compErr } = await supabase.from('companies').select('id, name');
    if (compErr) throw compErr;

    const companyMap = {};
    companies.forEach(c => {
      companyMap[c.id] = c.name;
    });

    const mapped = profiles.map(p => ({
      id: p.id,
      email: p.email,
      name: p.name,
      role: p.role,
      company: p.company_id ? companyMap[p.company_id] || p.company_id : 'Atanmadı/Yok',
      assignedCompanies: p.assigned_companies && p.assigned_companies.length > 0 
        ? p.assigned_companies.map(id => companyMap[id] || id) 
        : 'Yok'
    }));

    console.log(JSON.stringify(mapped, null, 2));
  } catch (err) {
    console.error('Error fetching users:', err.message);
  }
}

listUsers();
