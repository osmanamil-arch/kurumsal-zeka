import React, { useState } from 'react';

export default function PulseSurveys({ surveys }) {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'create'

  return (
    <div className="pulse-surveys fade-in">
      <div className="header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: '#1e293b', margin: 0 }}>Nabız Anketleri (Pulse Surveys)</h2>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Haftalık veya aylık kısa, durumsal ve hedeflenmiş anketler</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setActiveTab('list')} style={{ background: activeTab === 'list' ? '#1e293b' : 'transparent', color: activeTab === 'list' ? '#fff' : '#64748b', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Anket Geçmişi</button>
          <button onClick={() => setActiveTab('create')} style={{ background: activeTab === 'create' ? '#3b82f6' : 'transparent', color: activeTab === 'create' ? '#fff' : '#3b82f6', border: activeTab === 'create' ? 'none' : '1px solid #3b82f6', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>+ Yeni Anket Oluştur</button>
        </div>
      </div>

      {activeTab === 'list' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          {surveys.map(s => (
            <div key={s.id} className="glass" style={{ background: '#fff', borderRadius: '8px', padding: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>{s.title}</h3>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Tarih: {s.date} | Katılım Oranı: %{s.participationRate}</span>
              </div>
              <div style={{ display: 'flex', gap: '2rem', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: s.eNps > 30 ? '#10b981' : '#f59e0b' }}>{s.eNps}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>eNPS</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>{s.avgScore}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Ortalama</div>
                </div>
                <button style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '0 1rem', borderRadius: '4px', color: '#475569', cursor: 'pointer', fontWeight: '500' }}>Detay Raporu</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'create' && (
        <div className="glass" style={{ background: '#fff', borderRadius: '8px', padding: '2rem', border: '1px solid #e2e8f0', maxWidth: '600px' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>Hızlı Nabız Anketi Gönder</h3>
          <form onSubmit={e => { e.preventDefault(); alert('Demo: Anket gönderildi!'); setActiveTab('list'); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>Anket Başlığı</label>
              <input type="text" placeholder="Örn: Evden Çalışma Memnuniyeti" required style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>Hedef Kitle (Psikometri Odaklı Filtre Seçimi Opsiyonel)</label>
              <select style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}>
                <option value="all">Tüm Şirket</option>
                <option value="sales">Sadece Satış Departmanı</option>
                <option value="highRisk">Ayrılma Riski Yüksek Olanlar (Tahminsel AI)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>Soru Seti</label>
              <select style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}>
                <option value="enps">Sadece eNPS (Tek Soru)</option>
                <option value="weekly">Haftalık Standart Nabız (3 Soru)</option>
                <option value="custom">Özel Soru Seti Ekle...</option>
              </select>
            </div>
            <button type="submit" style={{ marginTop: '1rem', padding: '0.75rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Anketi Başlat</button>
          </form>
        </div>
      )}
    </div>
  );
}
