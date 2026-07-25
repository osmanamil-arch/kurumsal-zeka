import React from 'react';

export default function CareerDevelopment({ employees, employeeProfiles, skillLibrary }) {
  // Demo: Let's focus on Burak Ateş (e4) for career development demo
  const employeeId = 'e4';
  const employee = employees.find(e => e.id === employeeId);
  const profile = employeeProfiles.find(p => p.employeeId === employeeId);

  // Mock next role: 'l4' Müdür (from l3 Uzman)
  const nextRoleTarget = 'Satış Müdürü';
  const requiredSkillsForNextRole = [
    { id: 'lib_s1_sales', name: 'İleri B2B Satış', expectedLevel: 5 },
    { id: 'lib_s3_sales_mgmt', name: 'Satış Ekibi Yönetimi', expectedLevel: 3 }, // mock skill
  ];

  return (
    <div className="career-development fade-in">
      <div className="header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Kariyer Gelişimi & Succession</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Rol değişimleri için yetkinlik hazırlık analizi</p>
      </div>

      <div className="career-container" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        <div className="profile-card glass" style={{ padding: '1.5rem', borderRadius: '8px', background: '#fff', border: '1px solid #e2e8f0' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: '80px', height: '80px', background: '#e0f2fe', color: '#0284c7', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', fontWeight: 'bold', margin: '0 auto 1rem auto' }}>
              {employee?.name.split(' ').map(n=>n[0]).join('')}
            </div>
            <h3 style={{ margin: 0 }}>{employee?.name}</h3>
            <p style={{ color: '#64748b', margin: '0.25rem 0 0 0' }}>Mevcut Rol: {employee?.title}</p>
          </div>
          
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase' }}>Hedef Kariyer Adımı</h4>
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '1rem', borderRadius: '6px' }}>
              <h5 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.1rem' }}>{nextRoleTarget}</h5>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1, background: '#e2e8f0', height: '8px', borderRadius: '4px' }}>
                  <div style={{ width: '60%', height: '100%', background: '#3b82f6', borderRadius: '4px' }}></div>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#3b82f6' }}>%60 Hazır</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Tahmini Hazırlık: 6-8 Ay</p>
            </div>
          </div>
        </div>

        <div className="gap-analysis glass" style={{ padding: '1.5rem', borderRadius: '8px', background: '#fff', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>Yetkinlik Eksikleri Analizi (Gap Analysis)</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {requiredSkillsForNextRole.map(skill => {
              const current = profile?.currentSkills.find(s => s.id === skill.id) || { level: 0 };
              const gap = skill.expectedLevel - current.level;
              return (
                <div key={skill.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                  <div style={{ flex: 1 }}>
                    <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', color: '#334155' }}>{skill.name}</h5>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
                      <span>Mevcut: {current.level}</span>
                      <span>Hedef: {skill.expectedLevel}</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {Array.from({length: 5}).map((_, i) => (
                      <div key={i} style={{ width: '20px', height: '20px', borderRadius: '4px', background: i < current.level ? '#3b82f6' : (i < skill.expectedLevel ? '#bfdbfe' : '#e2e8f0') }}></div>
                    ))}
                  </div>

                  <div style={{ width: '150px', textAlign: 'right' }}>
                    {gap > 0 ? (
                      <button 
                        onClick={() => alert(`"${skill.name}" yetkinliğini geliştirmek için Burak Ateş'in Gelişim Planına (IDP) otomatik bir hedef ve ilgili eğitim yolu atandı!`)}
                        style={{ padding: '0.5rem 1rem', background: '#fff', border: '1px solid #3b82f6', color: '#3b82f6', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#eff6ff'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = '#fff'; }}
                      >
                        Gelişim Yolu Ata
                      </button>
                    ) : (
                      <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 'bold' }}>✓ Yeterli</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
