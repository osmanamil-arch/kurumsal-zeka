import React, { useState } from 'react';

export default function HRLibraryModule({ 
  families, setFamilies, 
  functions, setFunctions, 
  levels, setLevels 
}) {
  const [activeTab, setActiveTab] = useState('families'); // 'families' | 'functions' | 'levels'
  
  // --- Aile Ekleme / Öneri Logic ---
  const [newFamilyName, setNewFamilyName] = useState('');
  const [familySuggestions, setFamilySuggestions] = useState([]);

  const handleFamilyChange = (e) => {
    const val = e.target.value;
    setNewFamilyName(val);
    
    if (val.length >= 2) {
      // Benzer veya mevcut kayıtlardan önerge çıkar (Büyük/küçük duyarsız, regex vb.)
      const lowerVal = val.trim().toLowerCase();
      const matches = families.filter(f => f.name.toLowerCase().includes(lowerVal) && f.isActive);
      setFamilySuggestions(matches);
    } else {
      setFamilySuggestions([]);
    }
  };

  const handleAddFamily = (e) => {
    e.preventDefault();
    const cleanName = newFamilyName.trim();
    if (!cleanName) return;

    // Tam Eşleşme (Duplicate) Kontrolü
    const exists = families.find(f => f.name.toLowerCase() === cleanName.toLowerCase());
    if (exists) {
      alert(`"${exists.name}" zaten kütüphanede mevcut. Lütfen onu seçin veya düzenleyin.`);
      return;
    }

    const newId = 'jf_' + Date.now();
    setFamilies([{ id: newId, name: cleanName, isActive: true, isPreloaded: false }, ...families]);
    setNewFamilyName('');
    setFamilySuggestions([]);
  };

  const toggleFamilyState = (id) => {
    setFamilies(families.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f));
  };


  // --- Fonksiyon Ekleme (Hiyerarşili) ---
  const [newFunctionName, setNewFunctionName] = useState('');
  const [newFunctionFamilyId, setNewFunctionFamilyId] = useState('');
  
  const handleAddFunction = (e) => {
    e.preventDefault();
    const cleanName = newFunctionName.trim();
    if (!cleanName || !newFunctionFamilyId) return;

    // Aynı AİLE VE FONKSİYON isminde kayıt var mı?
    const exists = functions.find(f => f.familyId === newFunctionFamilyId && f.name.toLowerCase() === cleanName.toLowerCase());
    if (exists) {
      alert(`Bu iş fonksiyonu seçili aile altında zaten mevcut.`);
      return;
    }

    setFunctions([{ id: 'fn_' + Date.now(), familyId: newFunctionFamilyId, name: cleanName, isActive: true, isPreloaded: false }, ...functions]);
    setNewFunctionName('');
  };

  const toggleFunctionState = (id) => {
    setFunctions(functions.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f));
  };

  
  // --- Seviye Ekleme ---
  const [newLevelName, setNewLevelName] = useState('');
  const [newLevelWeight, setNewLevelWeight] = useState(1);

  const handleAddLevel = (e) => {
    e.preventDefault();
    if (!newLevelName.trim()) return;
    setLevels([...levels, { id: 'l_' + Date.now(), name: newLevelName.trim(), level: Number(newLevelWeight), isActive: true, isPreloaded: false }]);
    setNewLevelName('');
  };

  const toggleLevelState = (id) => {
    setLevels(levels.map(l => l.id === id ? { ...l, isActive: !l.isActive } : l));
  };

  // Styles
  const formInputStyle = { width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' };

  return (
    <div className="fade-in" style={{ padding: '0.5rem' }}>
       {/* İç Menü */}
       <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>
         <button onClick={() => setActiveTab('families')} style={{ background: activeTab === 'families' ? '#1e293b' : 'transparent', color: activeTab === 'families' ? '#fff' : '#64748b', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Tüm İş Aileleri</button>
         <button onClick={() => setActiveTab('functions')} style={{ background: activeTab === 'functions' ? '#1e293b' : 'transparent', color: activeTab === 'functions' ? '#fff' : '#64748b', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>İş Fonksiyonları (Alt Kırılımlar)</button>
         <button onClick={() => setActiveTab('levels')} style={{ background: activeTab === 'levels' ? '#1e293b' : 'transparent', color: activeTab === 'levels' ? '#fff' : '#64748b', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>İş Seviyeleri</button>
       </div>

       {activeTab === 'families' && (
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            <div className="glass" style={{ padding: '1.5rem', background: '#f8fafc' }}>
               <h4 style={{ margin: '0 0 1rem 0', color: '#0f172a' }}>Yeni İş Ailesi Ekle</h4>
               <form onSubmit={handleAddFamily}>
                 <input 
                   type="text" 
                   required 
                   placeholder="Örn: Müşteri Deneyimi..." 
                   value={newFamilyName} 
                   onChange={handleFamilyChange} 
                   style={formInputStyle} 
                 />
                 
                 {/* Akıllı Öneri Alanı */}
                 {familySuggestions.length > 0 && (
                   <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0.5rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                      <span style={{ color: '#d97706', fontWeight: 600 }}>💡 Bunu mu demek istedin?</span>
                      <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0 0 0', color: '#475569' }}>
                        {familySuggestions.map(s => <li key={s.id}>{s.name}</li>)}
                      </ul>
                   </div>
                 )}

                 <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>Sistem çakışan (duplicate) isimleri engelleyecektir.</p>
                 <button type="submit" className="save-btn" style={{ width: '100%', marginTop: '1rem', background: '#2563eb' }}>+ Kütüphaneye Ekle</button>
               </form>
            </div>
            
            <div className="glass" style={{ padding: '1rem' }}>
               <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                 <thead>
                   <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                     <th style={{ padding: '1rem', width: '60%' }}>İş Ailesi Karakteristiği</th>
                     <th style={{ padding: '1rem', textAlign: 'center' }}>Tip</th>
                     <th style={{ padding: '1rem', textAlign: 'center' }}>Durum</th>
                   </tr>
                 </thead>
                 <tbody>
                    {families.map(f => (
                      <tr key={f.id} style={{ borderBottom: '1px solid #e2e8f0', opacity: f.isActive ? 1 : 0.6 }}>
                        <td style={{ padding: '1rem', fontWeight: 600, color: '#0f172a' }}>{f.name}</td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                           {f.isPreloaded ? <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px' }}>Sistem Şablonu</span> : <span style={{ fontSize: '0.75rem', background: '#e0e7ff', color: '#3730a3', padding: '2px 6px', borderRadius: '4px' }}>Özel Kayıt</span>}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                           <button 
                             onClick={() => toggleFamilyState(f.id)}
                             style={{ background: f.isActive ? '#ef4444' : '#10b981', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                           >
                             {f.isActive ? 'Pasife Al' : 'Aktifleştir'}
                           </button>
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
            </div>
         </div>
       )}

       {activeTab === 'functions' && (
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            <div className="glass" style={{ padding: '1.5rem', background: '#f8fafc' }}>
               <h4 style={{ margin: '0 0 1rem 0', color: '#0f172a' }}>İş Fonksiyonu Ekle</h4>
               <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>Fonksiyonlar her zaman bir "Aile"ye bağlı olmalıdır.</p>
               <form onSubmit={handleAddFunction}>
                 <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>Bağlı Olacağı Aile</label>
                 <select required value={newFunctionFamilyId} onChange={e => setNewFunctionFamilyId(e.target.value)} style={{...formInputStyle, marginBottom: '1rem'}}>
                   <option value="">Seçiniz...</option>
                   {families.filter(f => f.isActive).map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                 </select>

                 <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>Fonksiyon Adı</label>
                 <input type="text" required placeholder="Örn: Saha Satış..." value={newFunctionName} onChange={e => setNewFunctionName(e.target.value)} style={formInputStyle} />
                 
                 <button type="submit" className="save-btn" style={{ width: '100%', marginTop: '1rem', background: '#2563eb' }}>+ Ekle</button>
               </form>
            </div>
            
            <div className="glass" style={{ padding: '1rem', overflowY: 'auto', maxHeight: '600px' }}>
               <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                 <thead>
                   <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                     <th style={{ padding: '1rem' }}>Fonksiyon Adı</th>
                     <th style={{ padding: '1rem' }}>Bağlı Olduğu İş Ailesi (Üst Çatı)</th>
                     <th style={{ padding: '1rem', textAlign: 'center' }}>Durum</th>
                   </tr>
                 </thead>
                 <tbody>
                    {functions.map(fn => {
                      const fam = families.find(f => f.id === fn.familyId);
                      return (
                        <tr key={fn.id} style={{ borderBottom: '1px solid #e2e8f0', opacity: fn.isActive ? 1 : 0.6 }}>
                          <td style={{ padding: '1rem', fontWeight: 600, color: '#0f172a' }}>⚙️ {fn.name}</td>
                          <td style={{ padding: '1rem', color: '#475569' }}>
                             {fam ? <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>🏭 {fam.name}</span> : <span style={{color: 'red'}}>Kayıp Veri</span>}
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>
                             <button 
                               onClick={() => toggleFunctionState(fn.id)}
                               style={{ background: fn.isActive ? '#ef4444' : '#10b981', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                             >
                               {fn.isActive ? 'Gizle' : 'Göster'}
                             </button>
                          </td>
                        </tr>
                      )
                    })}
                 </tbody>
               </table>
            </div>
         </div>
       )}

       {activeTab === 'levels' && (
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            <div className="glass" style={{ padding: '1.5rem', background: '#f8fafc' }}>
               <h4 style={{ margin: '0 0 1rem 0', color: '#0f172a' }}>İş Seviyesi Ekle</h4>
               <form onSubmit={handleAddLevel}>
                 <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>Seviye Adı</label>
                 <input type="text" required placeholder="L6 - Kurucu Ortak..." value={newLevelName} onChange={e => setNewLevelName(e.target.value)} style={{...formInputStyle, marginBottom: '1rem'}} />
                 
                 <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>Hiyerarşik Ağırlık (1-10)</label>
                 <input type="number" min="1" max="10" required value={newLevelWeight} onChange={e => setNewLevelWeight(e.target.value)} style={formInputStyle} />
                 
                 <button type="submit" className="save-btn" style={{ width: '100%', marginTop: '1rem', background: '#2563eb' }}>+ Ekle</button>
               </form>
            </div>
            
            <div className="glass" style={{ padding: '1rem' }}>
               <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                 <thead>
                   <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                     <th style={{ padding: '1rem' }}>Seviye Adı</th>
                     <th style={{ padding: '1rem', textAlign: 'center' }}>Ağırlık Puanı</th>
                     <th style={{ padding: '1rem', textAlign: 'center' }}>Durum</th>
                   </tr>
                 </thead>
                 <tbody>
                    {/* Ağırlığa göre sıralanarak gösteriliyor */}
                    {[...levels].sort((a,b) => a.level - b.level).map(l => (
                      <tr key={l.id} style={{ borderBottom: '1px solid #e2e8f0', opacity: l.isActive ? 1 : 0.6 }}>
                        <td style={{ padding: '1rem', fontWeight: 600, color: '#0f172a' }}>{l.name}</td>
                        <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', color: '#2563eb' }}>{l.level}</td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                           <button 
                             onClick={() => toggleLevelState(l.id)}
                             style={{ background: l.isActive ? '#ef4444' : '#10b981', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                           >
                             {l.isActive ? 'Gizle' : 'Göster'}
                           </button>
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
            </div>
         </div>
       )}
    </div>
  )
}
