import React from 'react';

export default function InternalEvents({ clubs }) {
  return (
    <div className="internal-events fade-in">
      <div className="header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>İç İletişim, Etkinlikler ve Kulüpler</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Kişilik envanterlerine göre desteklenen şirket içi sosyal kulüpler</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {clubs.map(club => (
          <div key={club.id} className="glass" style={{ background: '#fff', borderRadius: '8px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>{club.name}</h3>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1, background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>{club.memberCount}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Aktif Üye</div>
              </div>
              <div style={{ flex: 1, background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center', marginBottom: '0.25rem' }}>
                  {club.targetDisc.map((d, i) => <span key={i} style={{ background: '#e2e8f0', color: '#334155', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>{d}</span>)}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Hedef Kitle</div>
              </div>
            </div>

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
              <strong style={{ display: 'block', color: '#1d4ed8', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Sıradaki Etkinlik</strong>
              <span style={{ color: '#1e3a8a', fontWeight: '500' }}>{club.nextEvent}</span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{ flex: 1, padding: '0.5rem', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>Üyeleri Gör</button>
              <button style={{ flex: 1, padding: '0.5rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>Duyuru Yap</button>
            </div>
          </div>
        ))}

        <div className="glass" style={{ background: '#f8fafc', borderRadius: '8px', padding: '1.5rem', border: '2px dashed #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>+</div>
          <strong style={{ fontSize: '1.1rem' }}>Yeni Kulüp Oluştur</strong>
          <span style={{ fontSize: '0.8rem', textAlign: 'center', marginTop: '0.5rem' }}>Çalışanların hobi ve motivasyon envanterine göre sistem size kulüp önerebilir.</span>
        </div>
      </div>
    </div>
  );
}
