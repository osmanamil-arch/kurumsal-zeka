import React, { useState } from 'react';
import { calculateDepartmentSynergy } from '../services/engagementEngine';

export default function TeamSynergy({ departments, employees, profiles }) {
  const [selectedDeptId, setSelectedDeptId] = useState(departments[0]?.id || '');

  const { deptProfiles, typeCounts, synergyNote, riskNote } = calculateDepartmentSynergy(selectedDeptId, employees, profiles);
  const totalProfiles = deptProfiles.length;

  return (
    <div className="team-synergy fade-in">
      <div className="header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Ekip Sinerjisi ve Kültür Uyumu</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Departman bazında psikometrik dağılım ve uyum analizi</p>
      </div>

      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <label style={{ fontWeight: '600', color: '#334155' }}>Departman Seçin:</label>
        <select 
          value={selectedDeptId}
          onChange={e => setSelectedDeptId(e.target.value)}
          style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', minWidth: '250px' }}
        >
          {departments.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {totalProfiles === 0 ? (
        <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '8px', color: '#64748b', textAlign: 'center' }}>
          Bu departmanda çalışan bulunmuyor.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          
          <div className="glass" style={{ background: '#fff', borderRadius: '8px', padding: '2rem', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>Psikometrik Isı Haritası (DISC)</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', height: '250px', marginBottom: '2rem' }}>
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <strong style={{ color: '#ef4444', fontSize: '1.2rem' }}>D (Dominant)</strong>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#b91c1c' }}>{typeCounts['D']} Kişi</span>
              </div>
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <strong style={{ color: '#f59e0b', fontSize: '1.2rem' }}>I (İz Bırakan)</strong>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d97706' }}>{typeCounts['I']} Kişi</span>
              </div>
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <strong style={{ color: '#10b981', fontSize: '1.2rem' }}>S (Sadık)</strong>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#047857' }}>{typeCounts['S']} Kişi</span>
              </div>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <strong style={{ color: '#3b82f6', fontSize: '1.2rem' }}>C (Ciddi/Analitik)</strong>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1d4ed8' }}>{typeCounts['C']} Kişi</span>
              </div>
            </div>

            <h4 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>Kültür Motoru Yorumu</h4>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '6px', borderLeft: '4px solid #3b82f6', marginBottom: '1rem' }}>
              <strong style={{ display: 'block', color: '#1d4ed8', marginBottom: '0.25rem' }}>Sinerji Durumu</strong>
              <span style={{ fontSize: '0.85rem', color: '#334155' }}>{synergyNote}</span>
            </div>
            <div style={{ background: '#fef2f2', padding: '1rem', borderRadius: '6px', borderLeft: '4px solid #ef4444' }}>
              <strong style={{ display: 'block', color: '#b91c1c', marginBottom: '0.25rem' }}>Olası Çatışma / Risk</strong>
              <span style={{ fontSize: '0.85rem', color: '#7f1d1d' }}>{riskNote}</span>
            </div>
          </div>

          <div className="glass" style={{ background: '#fff', borderRadius: '8px', padding: '2rem', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>Ekip Üyeleri</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {deptProfiles.map((dp, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '500', color: '#0f172a', fontSize: '0.9rem' }}>{dp.employee.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{dp.employee.title}</span>
                  </div>
                  <span style={{ 
                    background: `${dp.profile.color}20`, 
                    color: dp.profile.color, 
                    fontWeight: 'bold', 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: '12px',
                    fontSize: '0.8rem'
                  }}>
                    {dp.profile.discType} - {dp.profile.discName.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
