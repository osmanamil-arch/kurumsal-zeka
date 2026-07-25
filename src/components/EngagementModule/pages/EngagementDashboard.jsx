import React from 'react';

export default function EngagementDashboard({ surveys }) {
  const latestSurvey = surveys[0] || {};
  const prevSurvey = surveys[1] || {};
  
  const eNpsDiff = latestSurvey.eNps - (prevSurvey.eNps || 0);

  return (
    <div className="engagement-dashboard fade-in">
      <div className="header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Çalışan Bağlılığı Özeti (Engagement Pulse)</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Kurum içi mutluluk endeksi ve nabız anketleri trendleri</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass" style={{ padding: '1.5rem', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Güncel eNPS Skoru</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: latestSurvey.eNps > 30 ? '#10b981' : '#f59e0b' }}>{latestSurvey.eNps}</div>
            <div style={{ fontSize: '0.85rem', color: eNpsDiff >= 0 ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
              {eNpsDiff >= 0 ? '▲' : '▼'} {Math.abs(eNpsDiff)} Puan
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.5rem 0 0 0' }}>-100 ile +100 arasında ölçülür.</p>
        </div>

        <div className="glass" style={{ padding: '1.5rem', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Son Anket Ortalaması</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3b82f6' }}>{latestSurvey.avgScore} <span style={{fontSize:'1rem', color:'#94a3b8'}}>/ 10</span></div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.5rem 0 0 0' }}>Katılım: %{latestSurvey.participationRate}</p>
        </div>

        <div className="glass" style={{ padding: '1.5rem', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem' }}>En Güçlü Yön</div>
          <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#10b981', marginTop: '0.5rem' }}>{latestSurvey.topArea}</div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.5rem 0 0 0' }}>Ankette en çok memnun olunan alan.</p>
        </div>

        <div className="glass" style={{ padding: '1.5rem', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Gelişim Alanı (Zayıf Yön)</div>
          <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#ef4444', marginTop: '0.5rem' }}>{latestSurvey.bottomArea}</div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.5rem 0 0 0' }}>Acil aksiyon planı gerektiren alan.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
         <div className="glass" style={{ background: '#fff', borderRadius: '8px', padding: '2rem', border: '1px solid #e2e8f0' }}>
           <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>eNPS Dağılımı (Tavsiye Skoru)</h3>
           <div style={{ display: 'flex', gap: '2px', height: '40px', borderRadius: '6px', overflow: 'hidden', marginBottom: '1rem' }}>
             <div style={{ width: '15%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 'bold' }}>Detractors (%15)</div>
             <div style={{ width: '28%', background: '#fcd34d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#92400e', fontSize: '0.8rem', fontWeight: 'bold' }}>Passives (%28)</div>
             <div style={{ width: '57%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 'bold' }}>Promoters (%57)</div>
           </div>
           <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
             Şirketinizi arkadaşlarınıza çalışmak için bir yer olarak tavsiye etme olasılığınız nedir? (0-10 ölçeği)
           </p>
         </div>

         <div className="glass" style={{ background: '#fff', borderRadius: '8px', padding: '2rem', border: '1px solid #e2e8f0' }}>
           <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>Kültür Motoru Önerileri</h3>
           <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
             <li style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '6px', fontSize: '0.85rem', color: '#334155', borderLeft: '3px solid #3b82f6' }}>
               📊 Son ankette "Kariyer Olanakları" skoru düştü. IDP (Gelişim Planı) süreçlerini hızlandırın.
             </li>
             <li style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '6px', fontSize: '0.85rem', color: '#334155', borderLeft: '3px solid #f59e0b' }}>
               🗣️ "İz Bırakan (I)" karakterdeki çalışanlar için sosyal kulüp etkinliklerini artırın.
             </li>
           </ul>
         </div>
      </div>
    </div>
  );
}
