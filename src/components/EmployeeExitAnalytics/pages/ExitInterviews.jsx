import React from 'react';

export default function ExitInterviews({ surveys, records }) {
  if (surveys.length === 0) return <div>Data bulunamadı.</div>;

  return (
    <div className="exit-interviews fade-in">
      <div className="header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Çıkış Mülakatı Analizi (Exit Interview)</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Ayrılan personelin boyut bazlı geri bildirimleri ve açık uçlu yorumları</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        <div className="glass" style={{ background: '#fff', borderRadius: '8px', padding: '2rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>Son Mülakat Geri Bildirimleri</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {surveys.map(s => {
              const rec = records.find(r => r.id === s.exitRecordId);
              return (
                <div key={s.id} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', borderLeft: `4px solid ${s.recommendationScore >= 7 ? '#10b981' : '#ef4444'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                    <div>
                      <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>{rec?.employeeName || 'Bilinmeyen'}</strong>
                      <span style={{ margin: '0 0.5rem', color: '#cbd5e1' }}>|</span>
                      <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{rec?.departmentName} - {rec?.roleName}</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Tarih: {s.surveyDate}</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div><span style={{fontSize:'0.8rem', color:'#64748b', display:'block'}}>Yönetici Memnuniyeti</span><strong style={{color: s.managerSatisfaction > 5 ? '#10b981' : '#ef4444'}}>{s.managerSatisfaction}/10</strong></div>
                    <div><span style={{fontSize:'0.8rem', color:'#64748b', display:'block'}}>Kariyer Fırsatı</span><strong style={{color: s.careerOpportunitySatisfaction > 5 ? '#10b981' : '#ef4444'}}>{s.careerOpportunitySatisfaction}/10</strong></div>
                    <div><span style={{fontSize:'0.8rem', color:'#64748b', display:'block'}}>İş Yükü ve Stres</span><strong style={{color: s.workloadSatisfaction > 5 ? '#10b981' : '#ef4444'}}>{s.workloadSatisfaction}/10</strong></div>
                    <div><span style={{fontSize:'0.8rem', color:'#64748b', display:'block'}}>Genel Memnuniyet</span><strong style={{color: s.overallSatisfaction > 5 ? '#10b981' : '#ef4444'}}>{s.overallSatisfaction}/10</strong></div>
                  </div>

                  {s.openFeedback && (
                    <div style={{ background: '#fff', padding: '1rem', borderRadius: '6px', fontStyle: 'italic', color: '#334155', border: '1px solid #e2e8f0' }}>
                      "{s.openFeedback}"
                    </div>
                  )}
                  
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                    <span style={{ background: s.rehireWillingness === 'yes' ? '#dcfce3' : '#fee2e2', color: s.rehireWillingness === 'yes' ? '#15803d' : '#b91c1c', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      Yeniden Çalışmak İster mi? {s.rehireWillingness === 'yes' ? 'Evet' : 'Hayır'}
                    </span>
                    <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      Tavsiye Skoru (eNPS): {s.recommendationScore}/10
                    </span>
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
