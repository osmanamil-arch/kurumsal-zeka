import React from 'react';
import { getTestById } from '../data/testCatalog';

export default function WizardStep6({ formData, departments, titles, families, functions, levels }) {
  
  const getDeptName = id => departments.find(d => d.id === id)?.name || id;
  const getTitleName = id => titles.find(t => t.id === id)?.name || id;
  const getFamilyName = id => families.find(f => f.id === id)?.name || id;
  const getFuncName = id => functions.find(f => f.id === id)?.name || id;
  const getLevelName = id => levels.find(l => l.id === id)?.name || id;

  const resps = formData.responsibilities || [];
  const tsks = formData.tasks || [];
  const comps = formData.competencies || [];
  const skills = formData.skills || [];
  const knows = formData.knowledge || [];
  const certs = formData.certifications || [];
  const kpis = formData.kpiDefinitions || [];
  const conds = formData.workingConditions || {};

  const actionTests = comps.filter(c => c.linkedTestId).map(c => ({
    competency: c.title,
    test: getTestById(c.linkedTestId)
  })).filter(item => item.test);

  const sectionStyle = { marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' };
  const h4Style = { color: '#0f172a', borderBottom: '2px solid #3b82f6', display: 'inline-block', paddingBottom: '4px', marginBottom: '1rem' };

  return (
    <div className="fade-in" style={{ padding: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', maxWidth: '900px', margin: '0 auto', fontSize: '0.9rem', color: '#334155' }}>
      
      {/* BAŞLIK VE KÜNYE */}
      <div style={{ textAlign: 'center', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '3px solid #1e293b' }}>
        <h2 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.75rem' }}>İş Analizi & Görev Tanımı Belgesi</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', color: '#64748b' }}>
          <span><strong>Versiyon:</strong> {formData.version.toFixed(1)}</span>
          <span>|</span>
          <span><strong>Oluşturulma:</strong> Yeni Kayıt (Draft)</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <tbody>
            <tr><td style={{ padding: '6px 0', fontWeight: 'bold', width: '120px' }}>Departman</td><td>: {getDeptName(formData.departmentId)}</td></tr>
            <tr><td style={{ padding: '6px 0', fontWeight: 'bold' }}>Ünvan</td><td>: {getTitleName(formData.titleId)}</td></tr>
            <tr><td style={{ padding: '6px 0', fontWeight: 'bold' }}>İş Ailesi</td><td>: {getFamilyName(formData.jobFamilyId)}</td></tr>
          </tbody>
        </table>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <tbody>
            <tr><td style={{ padding: '6px 0', fontWeight: 'bold', width: '120px' }}>Fonksiyon</td><td>: {getFuncName(formData.jobFunctionId)}</td></tr>
            <tr><td style={{ padding: '6px 0', fontWeight: 'bold' }}>Seviye</td><td>: {getLevelName(formData.jobLevelId)}</td></tr>
          </tbody>
        </table>
      </div>

      {/* AMACI */}
      <div style={sectionStyle}>
        <h4 style={h4Style}>1. Pozisyonun Organizasyondaki Amacı</h4>
        <p style={{ margin: 0, fontStyle: 'italic', background: '#f8fafc', padding: '1rem', borderLeft: '4px solid #94a3b8' }}>
          {formData.purpose || 'Belirtilmemiş'}
        </p>
      </div>

      {/* SORUMLULUK VE GÖREVLER */}
      <div style={sectionStyle}>
        <h4 style={h4Style}>2. Temel Sorumluluklar ve Görevler</h4>
        {resps.length === 0 ? <p>Belirtilmemiş</p> : (
          <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
            {resps.sort((a,b)=>a.sortOrder-b.sortOrder).map(r => (
              <li key={r.id} style={{ marginBottom: '1rem' }}>
                <strong>{r.title}</strong>
                {r.description && <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>{r.description}</div>}
                
                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', listStyleType: 'circle' }}>
                  {tsks.filter(t => t.refResponsibilityId === r.id).sort((a,b)=>a.sortOrder-b.sortOrder).map(t => (
                    <li key={t.id} style={{ marginBottom: '4px' }}>
                      {t.title} 
                      <span style={{ fontSize: '0.7rem', marginLeft: '6px', color: t.criticality === 1 ? '#dc2626' : '#64748b' }}>
                        [{t.criticality === 1 ? 'Kritik' : t.criticality === 2 ? 'Orta' : 'Düşük'}]
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* YETERLİLİKLER VE NİTELİKLER */}
      <div style={sectionStyle}>
        <h4 style={h4Style}>3. Beklenen Yetkinlik, Beceri ve Bilgi Alanları</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          
          <div>
             <h5 style={{ margin: '0 0 0.5rem 0', color: '#475569' }}>3.1 Davranışsal Yetkinlikler</h5>
             {comps.length === 0 ? <div style={{fontSize:'0.8rem',color:'#94a3b8'}}>Belirtilmemiş</div> : (
               <ul style={{ paddingLeft: '1rem', margin: 0, fontSize: '0.85rem' }}>
                 {comps.map(c => <li key={c.id}>{c.title} <strong style={{color:'#2563eb'}}>({c.proficiencyLevel === 1 ? 'Temel' : c.proficiencyLevel === 2 ? 'Fonksiyonel' : 'Yönetsel'})</strong> {c.isMandatory ? <span style={{color:'#ef4444'}}>*Zorunlu</span> : ''}</li>)}
               </ul>
             )}
          </div>
          <div>
             <h5 style={{ margin: '0 0 0.5rem 0', color: '#475569' }}>3.2 Teknik Beceriler</h5>
             {skills.length === 0 ? <div style={{fontSize:'0.8rem',color:'#94a3b8'}}>Belirtilmemiş</div> : (
               <ul style={{ paddingLeft: '1rem', margin: 0, fontSize: '0.85rem' }}>
                 {skills.map(c => <li key={c.id}>{c.title} <strong style={{color:'#2563eb'}}>({c.proficiencyLevel === 1 ? 'Temel' : c.proficiencyLevel === 2 ? 'Orta' : 'İleri'})</strong> {c.isMandatory ? <span style={{color:'#ef4444'}}>*Zorunlu</span> : ''}</li>)}
               </ul>
             )}
          </div>
          <div>
             <h5 style={{ margin: '0 0 0.5rem 0', color: '#475569' }}>3.3 Uzmanlık / Alan Bilgisi</h5>
             {knows.length === 0 ? <div style={{fontSize:'0.8rem',color:'#94a3b8'}}>Belirtilmemiş</div> : (
               <ul style={{ paddingLeft: '1rem', margin: 0, fontSize: '0.85rem' }}>
                 {knows.map(c => <li key={c.id}>{c.title} <strong style={{color:'#2563eb'}}>({c.proficiencyLevel === 1 ? 'Temel' : c.proficiencyLevel === 2 ? 'Orta' : 'İleri'})</strong> {c.isMandatory ? <span style={{color:'#ef4444'}}>*Zorunlu</span> : ''}</li>)}
               </ul>
             )}
          </div>
          <div>
             <h5 style={{ margin: '0 0 0.5rem 0', color: '#475569' }}>3.4 Sertifikalar ve Lisanslar</h5>
             {certs.length === 0 ? <div style={{fontSize:'0.8rem',color:'#94a3b8'}}>Belirtilmemiş</div> : (
               <ul style={{ paddingLeft: '1rem', margin: 0, fontSize: '0.85rem' }}>
                 {certs.map(c => <li key={c.id}>{c.title} {c.isMandatory ? <span style={{color:'#ef4444'}}>*Zorunlu</span> : ''} {c.issuingBody && `(${c.issuingBody})`}</li>)}
               </ul>
             )}
          </div>

        </div>
      </div>

      {/* KPI */}
      <div style={sectionStyle}>
        <h4 style={h4Style}>4. Anahtar Performans Göstergeleri (KPI)</h4>
        {kpis.length === 0 ? <p>Belirtilmemiş</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
                <th style={{ padding: '8px' }}>Hedef Başlığı</th>
                <th style={{ padding: '8px' }}>Ölçüm / Birim</th>
                <th style={{ padding: '8px' }}>Yüzde Ağırlık</th>
                <th style={{ padding: '8px' }}>Sıklık</th>
              </tr>
            </thead>
            <tbody>
              {kpis.map(k => (
                <tr key={k.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px' }}>{k.title}</td>
                  <td style={{ padding: '8px' }}>{k.targetValue} {k.unit}</td>
                  <td style={{ padding: '8px' }}>%{k.weight}</td>
                  <td style={{ padding: '8px' }}>{k.frequency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ÇALIŞMA KOŞULLARI */}
      <div style={{ marginBottom: '1rem' }}>
        <h4 style={h4Style}>5. Çalışma Koşulları ve Ortam Mimarisi</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
          <div><strong>Çalışma Ortamı:</strong> {conds.workEnvironment || '-'}</div>
          <div><strong>İSG Risk Seviyesi:</strong> {conds.riskLevel || '-'}</div>
          <div><strong>Seyahat Sıklığı:</strong> {conds.travelFrequency || '-'}</div>
          <div><strong>Fiziksel Efor:</strong> {conds.physicalEffort || '-'}</div>
          <div><strong>Çalışma Saatleri:</strong> {conds.workingHours || '-'}</div>
          {conds.specialConditions && (
            <div style={{ gridColumn: 'span 2' }}><strong>Özel Not:</strong> {conds.specialConditions}</div>
          )}
        </div>
      </div>

      {/* 6. ACTIONABLE AI: ÖNERİLEN SÜREÇLER */}
      <div style={{ marginBottom: '1rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h4 style={{ ...h4Style, borderBottomColor: '#2563eb', color: '#1d4ed8' }}>6. AI Çıktısı: Süreç Atamaları (Actionable Insights)</h4>
        <p style={{ fontSize: '0.85rem', color: '#1e40af', marginBottom: '1.5rem' }}>Aşağıdaki eylemler, onayınızın ardından İK Mülakat ve Psikometri süreçlerine otomatik eklenecektir:</p>
        
        {actionTests.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {actionTests.map((item, idx) => (
              <div key={idx} style={{ background: '#fff', borderRadius: '6px', padding: '1rem', borderLeft: `4px solid ${item.test.color || '#3b82f6'}`, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.test.icon}</div>
                <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>{item.test.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}><strong>Tetikleyen Yetkinlik:</strong> {item.competency}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>{item.test.questionCount} Soru | {item.test.estimatedMinutes} Dakika</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>Bu profile atanmış özel bir psikometrik test / teknik değerlendirme bulunamadı. Sihirbazın geri adımlarına dönerek Yetkinlikleri düzenleyebilirsiniz.</div>
        )}
      </div>

    </div>
  );
}
