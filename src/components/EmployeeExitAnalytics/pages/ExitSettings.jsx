import React, { useState } from 'react';

export default function ExitSettings({ reasons, setReasons, userRole }) {
  const isAdmin = userRole === 'danisman' || userRole === 'superadmin' || userRole === 'musteri';
  const [newCategory, setNewCategory] = useState('');
  
  const handleAddReason = () => {
    if (!newCategory.trim()) return;
    const newR = {
      id: `r_${Date.now()}`,
      category: newCategory,
      weight: 5,
      relatedDimension: 'overallSatisfaction'
    };
    setReasons([...reasons, newR]);
    setNewCategory('');
  };

  const handleDelete = (id) => {
    setReasons(reasons.filter(r => r.id !== id));
  };

  if (!isAdmin) {
    return <div style={{ padding: '2rem', color: '#ef4444' }}>Bu sayfaya erişim yetkiniz bulunmamaktadır. Sadece yöneticiler ayarları değiştirebilir.</div>;
  }

  return (
    <div className="exit-settings fade-in">
      <div className="header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Ayarlar & Soru Setleri</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Çıkış mülakatı konfigürasyonları ve ayrılma nedeni kategorileri</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '800px' }}>
        <div className="glass" style={{ background: '#fff', borderRadius: '8px', padding: '2rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>Ayrılma Nedeni Kategorileri</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
            Yöneticilerin veya İK uzmanlarının çıkış kayıtlarını (Exit Record) oluştururken seçecekleri kök neden listesi.
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <input 
              type="text" 
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              placeholder="Yeni kategori adı (Örn: Ulaşım Zorluğu)"
              style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
            />
            <button 
              onClick={handleAddReason}
              style={{ padding: '0.75rem 1.5rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
              Ekle
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {reasons.map(r => (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <span style={{ color: '#1e293b', fontWeight: '500' }}>{r.category}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    Boyut: {r.relatedDimension}
                  </span>
                  <button onClick={() => handleDelete(r.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem' }}>Sil</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass" style={{ background: '#fff', borderRadius: '8px', padding: '2rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>Çıkış Mülakatı Boyutları (Dimensions)</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
            Sistemde değerlendirilen 1-10 puanlık memnuniyet boyutları. (Bu alan şu anda hardcoded mock data olarak sistem çekirdeğine bağlıdır, değiştirilemez).
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ background: '#e2e8f0', color: '#334155', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem' }}>Genel Memnuniyet</span>
            <span style={{ background: '#e2e8f0', color: '#334155', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem' }}>Yönetici İlişkisi</span>
            <span style={{ background: '#e2e8f0', color: '#334155', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem' }}>Ücret ve Yan Haklar</span>
            <span style={{ background: '#e2e8f0', color: '#334155', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem' }}>İş Yükü ve Stres</span>
            <span style={{ background: '#e2e8f0', color: '#334155', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem' }}>Kariyer Fırsatları</span>
            <span style={{ background: '#e2e8f0', color: '#334155', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem' }}>Şirket Kültürü</span>
            <span style={{ background: '#e2e8f0', color: '#334155', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem' }}>İş - Yaşam Dengesi</span>
            <span style={{ background: '#e2e8f0', color: '#334155', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem' }}>Psikolojik Güvenlik</span>
          </div>
        </div>
      </div>
    </div>
  );
}
