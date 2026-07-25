import React from 'react';

export default function RiskSegments({ records }) {
  const highPerformerLosses = records.filter(r => r.highPerformer).length;
  const earlyTurnover = records.filter(r => {
    // Mock logic for early turnover (assuming some joined recently)
    return r.reasonCategory === 'Kültür Uyumsuzluğu' || r.reasonCategory === 'İş Yükü ve Stres';
  }).length;

  return (
    <div className="risk-segments fade-in">
      <div className="header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Risk Segmentleri</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Odaklanılması gereken stratejik çalışan grupları</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        <div className="segment-card glass" style={{ background: '#fff', borderRadius: '8px', padding: '1.5rem', border: '1px solid #fecaca' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: '#b91c1c', fontSize: '1.1rem' }}>Yüksek Performans Kayıpları</h3>
            <span style={{ background: '#fef2f2', color: '#ef4444', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>{highPerformerLosses} Kişi</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>Şirket hedeflerine üstün katkı sağlayan ancak kaybedilen yetenekler.</p>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', color: '#475569' }}>
            <strong>Önerilen Aksiyon:</strong> High-performer grubuna özel yetenek yönetimi ve "Retention Bonus" (elde tutma) programı oluşturulmalı.
          </div>
        </div>

        <div className="segment-card glass" style={{ background: '#fff', borderRadius: '8px', padding: '1.5rem', border: '1px solid #fde68a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: '#b45309', fontSize: '1.1rem' }}>Erken Ayrılmalar (İlk 6 Ay)</h3>
            <span style={{ background: '#fffbeb', color: '#f59e0b', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>{earlyTurnover} Kişi</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>İşe alım sonrası adaptasyon sürecinde (Onboarding) kaybedilenler.</p>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', color: '#475569' }}>
            <strong>Önerilen Aksiyon:</strong> İşe alımdaki "Kültür Uyumu" (Cultural Fit) mülakatları ve oryantasyon sürecindeki mentorluk sistemi gözden geçirilmeli.
          </div>
        </div>

        <div className="segment-card glass" style={{ background: '#fff', borderRadius: '8px', padding: '1.5rem', border: '1px solid #bfdbfe' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: '#1d4ed8', fontSize: '1.1rem' }}>Kritik Rol Kayıpları</h3>
            <span style={{ background: '#eff6ff', color: '#3b82f6', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>0 Kişi</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>Pazarda yerine yenisini koyması zor ve operasyonu durdurabilecek kilit pozisyonlar.</p>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', color: '#475569' }}>
            <strong>Önerilen Aksiyon:</strong> Yedekleme (Succession) planları aktif tutulmalı.
          </div>
        </div>

      </div>
    </div>
  );
}
