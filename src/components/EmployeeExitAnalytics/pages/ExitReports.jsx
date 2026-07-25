import React from 'react';

export default function ExitReports({ records, surveys }) {
  return (
    <div className="exit-reports fade-in">
      <div className="header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Raporlar</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>İşgücü kaybı trendleri ve stratejik IK raporları</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        <div className="glass" style={{ background: '#fff', borderRadius: '8px', padding: '2rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, color: '#1e293b' }}>Aylık Turnover (Sirkülasyon) Trendi</h3>
            <button style={{ padding: '0.5rem 1rem', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}>Dışa Aktar (PDF)</button>
          </div>
          
          {/* Mock Chart Area */}
          <div style={{ width: '100%', height: '300px', background: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'flex-end', padding: '1rem', gap: '1rem', border: '1px dashed #cbd5e1' }}>
            {/* Mock Bars */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <div style={{ width: '40%', height: '40%', background: '#3b82f6', borderRadius: '4px 4px 0 0' }}></div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Oca</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <div style={{ width: '40%', height: '60%', background: '#3b82f6', borderRadius: '4px 4px 0 0' }}></div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Şub</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <div style={{ width: '40%', height: '90%', background: '#ef4444', borderRadius: '4px 4px 0 0' }}></div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Mar</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <div style={{ width: '40%', height: '50%', background: '#3b82f6', borderRadius: '4px 4px 0 0' }}></div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Nis</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <div style={{ width: '40%', height: '20%', background: '#3b82f6', borderRadius: '4px 4px 0 0' }}></div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>May</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <div style={{ width: '40%', height: '0%', background: '#3b82f6', borderRadius: '4px 4px 0 0' }}></div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Haz</span>
            </div>
          </div>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', marginTop: '1rem' }}>* Mart ayında üretim departmanında yaşanan toplu çıkışlar nedeniyle tepe noktası (peak) görülmüştür.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="glass" style={{ background: '#fff', borderRadius: '8px', padding: '2rem', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>Gönüllü / Gönülsüz Ayrılma</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'conic-gradient(#f59e0b 0% 66%, #ef4444 66% 100%)' }}></div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ width: '12px', height: '12px', background: '#f59e0b', borderRadius: '2px' }}></span>
                  <span style={{ fontSize: '0.9rem', color: '#475569' }}>Gönüllü (İstifa): %66</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '2px' }}></span>
                  <span style={{ fontSize: '0.9rem', color: '#475569' }}>Gönülsüz: %34</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass" style={{ background: '#fff', borderRadius: '8px', padding: '2rem', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>Regrettable Loss Oranı</h3>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', paddingBottom: '2rem' }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#10b981', textAlign: 'center' }}>%33</div>
              <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', margin: '0.5rem 0 0 0' }}>Ayrılan her 3 kişiden 1'i şirket için kritik kayıp (High Performer) statüsündedir.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
