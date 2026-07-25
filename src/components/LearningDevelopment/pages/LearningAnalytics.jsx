import React from 'react';

export default function LearningAnalytics() {
  return (
    <div className="learning-analytics fade-in">
      <div className="header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Organizasyonel Analitik</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Eğitim yatırımlarının dönüşü (ROI) ve stratejik departman hedefleri</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="glass" style={{ padding: '2rem', borderRadius: '8px', background: '#fff' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>Departman Bazlı Skill Gap Analizi</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Satış ve Üretim departmanlarında kritik seviyede yetkinlik açığı gözlemlenmektedir. Özellikle dijital yetkinliklerde (IT dışı) genel bir gelişim alanı bulunmaktadır.</p>
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span>Satış Departmanı (Kritik Açık: %32)</span>
                <span>Yüksek Risk</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px' }}>
                <div style={{ width: '32%', height: '100%', background: '#ef4444', borderRadius: '4px' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span>Üretim Departmanı (Kritik Açık: %18)</span>
                <span>Orta Risk</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px' }}>
                <div style={{ width: '18%', height: '100%', background: '#f59e0b', borderRadius: '4px' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span>Finans Departmanı (Kritik Açık: %5)</span>
                <span>Düşük Risk</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px' }}>
                <div style={{ width: '5%', height: '100%', background: '#10b981', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass" style={{ padding: '2rem', borderRadius: '8px', background: '#fff' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>Eğitim ROI (Yatırımın Geri Dönüşü)</h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
             <div style={{ textAlign: 'center' }}>
               <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#10b981' }}>+24%</div>
               <p style={{ color: '#64748b', margin: '0.5rem 0' }}>Performans Artışı</p>
               <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>* Son 6 ayda eğitim tamamlayan çalışanların performans değerlendirme ortalamalarındaki artış.</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
