import React from 'react';
import { calculateDepartmentRisks } from '../services/exitAnalyticsEngine';

export default function DepartmentManagerAnalytics({ records, surveys }) {
  const deptRisks = calculateDepartmentRisks(records);

  // Group by manager
  const managerData = {};
  records.forEach(r => {
    if (!managerData[r.managerName]) {
      managerData[r.managerName] = { count: 0, dept: r.departmentName, satisfaction: [] };
    }
    managerData[r.managerName].count += 1;
    
    // Find survey if exists
    const survey = surveys.find(s => s.exitRecordId === r.id);
    if (survey) {
      managerData[r.managerName].satisfaction.push(survey.managerSatisfaction);
    }
  });

  const managerList = Object.keys(managerData).map(k => {
    const arr = managerData[k].satisfaction;
    const avg = arr.length > 0 ? (arr.reduce((a,b)=>a+b,0) / arr.length).toFixed(1) : '-';
    return {
      managerName: k,
      department: managerData[k].dept,
      exitCount: managerData[k].count,
      avgSatisfaction: avg
    };
  }).sort((a,b) => b.exitCount - a.exitCount);

  return (
    <div className="dept-manager-analytics fade-in">
      <div className="header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Departman ve Yönetici Analizi</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Hangi ekiplerde sirkülasyon yüksek ve yönetici etkisi nedir?</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div className="glass" style={{ background: '#fff', borderRadius: '8px', padding: '2rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>Departman Risk Haritası</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {deptRisks.map((d, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '6px', borderLeft: `4px solid ${d.risk === 'high' ? '#ef4444' : '#f59e0b'}` }}>
                <div>
                  <strong style={{ display: 'block', color: '#0f172a' }}>{d.department}</strong>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Ayrılan: {d.exitCount} Kişi</span>
                </div>
                <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', background: d.risk === 'high' ? '#fee2e2' : '#fef3c7', color: d.risk === 'high' ? '#b91c1c' : '#b45309' }}>
                  {d.risk === 'high' ? 'YÜKSEK RİSK' : 'ORTA RİSK'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass" style={{ background: '#fff', borderRadius: '8px', padding: '2rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>Yönetici Bazlı Ayrılma Tablosu</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '0.9rem' }}>
                <th style={{ padding: '1rem' }}>Yönetici Adı</th>
                <th style={{ padding: '1rem' }}>Departman</th>
                <th style={{ padding: '1rem' }}>Kayıp Sayısı</th>
                <th style={{ padding: '1rem' }}>Exit Mülakatı: Yönetici Memnuniyeti</th>
              </tr>
            </thead>
            <tbody>
              {managerList.map((m, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem', fontWeight: '500', color: '#0f172a' }}>{m.managerName}</td>
                  <td style={{ padding: '1rem', color: '#64748b' }}>{m.department}</td>
                  <td style={{ padding: '1rem', color: '#ef4444', fontWeight: 'bold' }}>{m.exitCount}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontWeight: 'bold',
                      background: m.avgSatisfaction === '-' ? '#f1f5f9' : (parseFloat(m.avgSatisfaction) < 5 ? '#fee2e2' : '#dcfce3'),
                      color: m.avgSatisfaction === '-' ? '#64748b' : (parseFloat(m.avgSatisfaction) < 5 ? '#b91c1c' : '#15803d')
                    }}>
                      {m.avgSatisfaction !== '-' ? `${m.avgSatisfaction} / 10` : 'Veri Yok'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
