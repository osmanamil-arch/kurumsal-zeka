import React, { useMemo } from 'react';
import { calculateSkillGap } from '../services/learningEngine';

export default function SkillMatrix({ employees, employeeProfiles, jobAnalyses, skillLibrary }) {
  const matrixData = useMemo(() => {
    return employees.map(emp => {
      const gaps = calculateSkillGap(emp.id, employeeProfiles, jobAnalyses, employees, skillLibrary);
      return { ...emp, gaps };
    });
  }, [employees, employeeProfiles, jobAnalyses, skillLibrary]);

  return (
    <div className="skill-matrix fade-in">
      <div className="header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Yetkinlik ve Skill Matrix</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Organizasyonel yetkinlik haritası ve kritik açıklar</p>
      </div>

      <div className="matrix-table-container" style={{ overflowX: 'auto', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '1rem', color: '#475569' }}>Çalışan</th>
              <th style={{ padding: '1rem', color: '#475569' }}>Departman / Rol</th>
              <th style={{ padding: '1rem', color: '#475569' }}>Kritik Yetkinlik Açıkları (Gaps)</th>
              <th style={{ padding: '1rem', color: '#475569', textAlign: 'center' }}>Risk Durumu</th>
            </tr>
          </thead>
          <tbody>
            {matrixData.map(row => (
              <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: '500', color: '#0f172a' }}>{row.name}</div>
                </td>
                <td style={{ padding: '1rem', color: '#64748b' }}>{row.department} - {row.title}</td>
                <td style={{ padding: '1rem' }}>
                  {row.gaps.length === 0 ? <span style={{ color: '#10b981', fontSize: '0.85rem' }}>Açık Yok</span> : 
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {row.gaps.map(g => (
                        <div key={g.skillId} style={{ background: g.risk === 'Kritik' ? '#fee2e2' : '#fef3c7', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', border: `1px solid ${g.risk === 'Kritik' ? '#fca5a5' : '#fde68a'}` }}>
                           <span style={{ fontWeight: '500', color: g.risk === 'Kritik' ? '#b91c1c' : '#b45309' }}>{g.skillName}</span>
                           <span style={{ marginLeft: '0.5rem', color: '#64748b' }}>(Mevcut: {g.currentLevel} / Hedef: {g.expectedLevel})</span>
                        </div>
                      ))}
                    </div>
                  }
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                   {row.gaps.some(g => g.risk === 'Kritik') ? 
                     <span style={{ background: '#ef4444', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold' }}>Yüksek Risk</span> : 
                     row.gaps.length > 0 ? 
                     <span style={{ background: '#f59e0b', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold' }}>Orta Risk</span> : 
                     <span style={{ background: '#10b981', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold' }}>İyi</span>
                   }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
