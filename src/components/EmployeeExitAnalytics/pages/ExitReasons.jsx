import React from 'react';

export default function ExitReasons({ records, reasons }) {
  const reasonCounts = {};
  records.forEach(r => {
    reasonCounts[r.reasonCategory] = (reasonCounts[r.reasonCategory] || 0) + 1;
  });

  const sortedReasons = Object.keys(reasonCounts).map(k => ({
    category: k,
    count: reasonCounts[k]
  })).sort((a,b) => b.count - a.count);

  const maxCount = sortedReasons[0]?.count || 1;

  return (
    <div className="exit-reasons fade-in">
      <div className="header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Ayrılma Nedenleri (Pareto Analizi)</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>İşgücü kaybının arkasındaki kök nedenlerin yoğunluk dağılımı</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="glass" style={{ background: '#fff', borderRadius: '8px', padding: '2rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>En Sık Görülen Kök Nedenler</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {sortedReasons.map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#1e293b' }}>
                  <span>{idx + 1}. {item.category}</span>
                  <strong>{item.count} Kişi</strong>
                </div>
                <div style={{ width: '100%', height: '12px', background: '#e2e8f0', borderRadius: '6px' }}>
                  <div style={{ width: `${(item.count / maxCount) * 100}%`, height: '100%', background: idx === 0 ? '#ef4444' : (idx === 1 ? '#f59e0b' : '#3b82f6'), borderRadius: '6px' }}></div>
                </div>
              </div>
            ))}
            {sortedReasons.length === 0 && <p style={{ color: '#64748b' }}>Kayıt yok.</p>}
          </div>
        </div>

        <div className="glass" style={{ background: '#fff', borderRadius: '8px', padding: '2rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>Yüksek Performans Kayıpları</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
            Şirketin "High Performer" olarak işaretlediği ve kaybettiği yeteneklerin ayrılma nedenleri:
          </p>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '6px', borderLeft: '3px solid #b45309' }}>
            <strong style={{ display: 'block', color: '#92400e', marginBottom: '0.5rem' }}>1. Kariyer Fırsatı Eksikliği</strong>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>%100 (1 Kayıt)</span>
          </div>
          <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#475569', fontStyle: 'italic' }}>
            Not: Yüksek performans gösteren yetenekler ağırlıklı olarak organizasyon içinde yükselemeyeceklerini hissettiklerinde ayrılmaktadır.
          </p>
        </div>
      </div>
    </div>
  );
}
