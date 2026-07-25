import React from 'react';

export default function Assessments({ assessments, catalog }) {
  return (
    <div className="assessments fade-in">
      <div className="header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Değerlendirme ve Sınavlar</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Eğitim sonrası ölçme ve başarı analizleri</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {assessments.map(ass => {
          const training = catalog.find(t => t.id === ass.linkedTraining);
          return (
            <div key={ass.id} className="assessment-card glass" style={{ padding: '1.5rem', borderRadius: '8px', background: '#fff', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', background: '#e0f2fe', color: '#0284c7', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>SINAV</span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{ass.questionCount} Soru</span>
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.1rem' }}>{ass.title}</h3>
              <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.85rem', color: '#64748b' }}>Bağlı Eğitim: {training?.title}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Geçme Notu</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#334155' }}>{ass.passingScore}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Ort. Başarı</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>{ass.averageScore}</div>
                </div>
              </div>
              
              <button style={{ width: '100%', padding: '0.75rem', background: 'transparent', color: '#3b82f6', border: '1px solid #3b82f6', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}>
                Sonuçları İncele
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
