import React, { useState } from 'react';

export default function KudosWall({ kudosFeed, employees }) {
  const [feed, setFeed] = useState(kudosFeed);
  const [newKudos, setNewKudos] = useState({ toEmployeeId: '', message: '', valueTag: 'Ekip Ruhu' });

  const handlePostKudos = (e) => {
    e.preventDefault();
    if (!newKudos.toEmployeeId || !newKudos.message) return;

    const toEmp = employees.find(e => e.id === newKudos.toEmployeeId);
    
    const k = {
      id: `k_${Date.now()}`,
      fromEmployeeId: 'currentUser', // Mocked as current logged in user
      fromEmployeeName: 'Ben (Aktif Kullanıcı)',
      toEmployeeId: toEmp.id,
      toEmployeeName: toEmp.name,
      valueTag: newKudos.valueTag,
      message: newKudos.message,
      likes: 0,
      comments: 0,
      date: 'Şimdi',
      badge: '🌟'
    };

    setFeed([k, ...feed]);
    setNewKudos({ toEmployeeId: '', message: '', valueTag: 'Ekip Ruhu' });
  };

  const handleLike = (id) => {
    setFeed(feed.map(k => k.id === id ? { ...k, likes: k.likes + 1 } : k));
  };

  return (
    <div className="kudos-wall fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="header" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: '#1e293b', margin: 0, fontSize: '2rem' }}>Takdir ve Teşekkür (Kudos) 🏆</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>İyi işleri görünür kılın, kurum kültürünü güçlendirin.</p>
      </div>

      <div className="glass" style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#334155', fontSize: '1.1rem' }}>Birine Teşekkür Et</h3>
        <form onSubmit={handlePostKudos} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select 
              value={newKudos.toEmployeeId}
              onChange={e => setNewKudos({...newKudos, toEmployeeId: e.target.value})}
              style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
              required
            >
              <option value="">Kime Teşekkür Etmek İstersin?</option>
              {employees.filter(e => e.isActive !== false).map(e => (
                <option key={e.id} value={e.id}>{e.name} ({e.department})</option>
              ))}
            </select>
            <select 
              value={newKudos.valueTag}
              onChange={e => setNewKudos({...newKudos, valueTag: e.target.value})}
              style={{ width: '200px', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
            >
              <option value="Ekip Ruhu">Ekip Ruhu 🤝</option>
              <option value="Sürekli Gelişim">Sürekli Gelişim 📈</option>
              <option value="Müşteri Odaklılık">Müşteri Odaklılık ❤️</option>
              <option value="İnovasyon">İnovasyon 💡</option>
              <option value="Cesaret">Cesaret 🦸</option>
            </select>
          </div>
          <textarea 
            placeholder="Harika iş çıkardın, çünkü..."
            value={newKudos.message}
            onChange={e => setNewKudos({...newKudos, message: e.target.value})}
            rows={3}
            required
            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical' }}
          />
          <div style={{ textAlign: 'right' }}>
            <button type="submit" style={{ padding: '0.75rem 2rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 4px rgba(59,130,246,0.3)' }}>
              Yayınla 🚀
            </button>
          </div>
        </form>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {feed.map(kudos => (
          <div key={kudos.id} className="glass" style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                  {kudos.fromEmployeeName.charAt(0)}
                </div>
                <div>
                  <strong style={{ color: '#0f172a', display: 'block' }}>{kudos.fromEmployeeName}</strong>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{kudos.date}</span>
                </div>
              </div>
              <span style={{ background: '#f1f5f9', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>
                {kudos.badge} {kudos.valueTag}
              </span>
            </div>
            
            <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
              👉 <strong style={{ color: '#3b82f6' }}>@{kudos.toEmployeeName}</strong>
            </div>
            
            <p style={{ color: '#334155', lineHeight: '1.5', margin: '0 0 1.5rem 0', fontSize: '1rem' }}>
              {kudos.message}
            </p>

            <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              <button 
                onClick={() => handleLike(kudos.id)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: '500', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#ef4444'}
                onMouseLeave={e => e.target.style.color = '#64748b'}
              >
                ❤️ {kudos.likes} Beğeni
              </button>
              <button style={{ background: 'transparent', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: '500' }}>
                💬 {kudos.comments} Yorum
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
