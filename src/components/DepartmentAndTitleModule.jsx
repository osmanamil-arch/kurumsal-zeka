import React, { useState } from 'react';

export default function DepartmentAndTitleModule({ departments, setDepartments, titles, setTitles }) {
  const [activeTab, setActiveTab] = useState('departments'); // 'departments' | 'titles'
  
  const [newDeptName, setNewDeptName] = useState('');
  
  const handleAddDept = (e) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;
    setDepartments([...departments, { id: 'd_' + Date.now(), name: newDeptName.trim() }]);
    setNewDeptName('');
  };

  const deleteDept = (id) => {
    setDepartments(departments.filter(d => d.id !== id));
    // Departmanı sildiğinde bağlı ünvanları boşa çıkar
    setTitles(titles.map(t => t.departmentId === id ? { ...t, departmentId: null } : t));
  };

  const [newTitleName, setNewTitleName] = useState('');
  const [newTitleDeptId, setNewTitleDeptId] = useState('');

  const handleAddTitle = (e) => {
    e.preventDefault();
    if (!newTitleName.trim() || !newTitleDeptId) return;
    setTitles([...titles, { id: 't_' + Date.now(), name: newTitleName.trim(), departmentId: newTitleDeptId, level: 1 }]);
    setNewTitleName('');
  };

  const deleteTitle = (id) => {
    setTitles(titles.filter(t => t.id !== id));
  };

  const inputStyle = { width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '1rem', fontSize: '0.9rem' };

  return (
     <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div className="glass" style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px' }}>
          {/* Menu */}
           <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>
             <button onClick={() => setActiveTab('departments')} style={{ background: activeTab === 'departments' ? '#1e293b' : 'transparent', color: activeTab === 'departments' ? '#fff' : '#64748b', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>🏢 Departmanlar</button>
             <button onClick={() => setActiveTab('titles')} style={{ background: activeTab === 'titles' ? '#1e293b' : 'transparent', color: activeTab === 'titles' ? '#fff' : '#64748b', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>👔 Ünvanlar</button>
           </div>
           
           {activeTab === 'departments' && (
             <form onSubmit={handleAddDept} className="fade-in">
               <h4 style={{ marginBottom: '1rem', color: '#1e293b' }}>Yeni Departman Ekle</h4>
               <input type="text" placeholder="Departman Adı (Örn: Finans)" value={newDeptName} onChange={e => setNewDeptName(e.target.value)} required style={inputStyle} />
               <button type="submit" style={{ width: '100%', padding: '0.75rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>+ Ekle</button>
             </form>
           )}

           {activeTab === 'titles' && (
             <form onSubmit={handleAddTitle} className="fade-in">
               <h4 style={{ marginBottom: '1rem', color: '#1e293b' }}>Yeni Ünvan Ekle</h4>
               <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600, color: '#475569' }}>Bağlı Olduğu Departman</label>
               <select value={newTitleDeptId} onChange={e => setNewTitleDeptId(e.target.value)} required style={inputStyle}>
                 <option value="">-- Seçiniz --</option>
                 {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
               </select>
               <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600, color: '#475569' }}>Ünvan Adı</label>
               <input type="text" placeholder="Ünvan Adı (Örn: Finans Müdürü)" value={newTitleName} onChange={e => setNewTitleName(e.target.value)} required style={inputStyle} />
               <button type="submit" style={{ width: '100%', padding: '0.75rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>+ Ekle</button>
             </form>
           )}
        </div>

        <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
           {activeTab === 'departments' && (
              <div className="fade-in">
                <h3 style={{ marginBottom: '1rem', color: '#334155' }}>Mevcut Departmanlar</h3>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                      <th style={{ padding: '1rem', color: '#475569' }}>Departman Adı</th>
                      <th style={{ padding: '1rem', textAlign: 'right', color: '#475569' }}>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                     {departments.length === 0 ? <tr><td colSpan="2" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Henüz departman eklenmemiş.</td></tr> : null}
                     {departments.map(d => (
                       <tr key={d.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s' }}>
                         <td style={{ padding: '1rem', fontWeight: 600, color: '#1e293b' }}>{d.name}</td>
                         <td style={{ padding: '1rem', textAlign: 'right' }}>
                            <button onClick={() => deleteDept(d.id)} style={{ background: '#fee2e2', color: '#ef4444', border: '1px solid #fecdd3', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>Sil</button>
                         </td>
                       </tr>
                     ))}
                  </tbody>
                </table>
              </div>
           )}

           {activeTab === 'titles' && (
              <div className="fade-in">
                <h3 style={{ marginBottom: '1rem', color: '#334155' }}>Mevcut Ünvanlar</h3>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                      <th style={{ padding: '1rem', color: '#475569' }}>Ünvan Adı</th>
                      <th style={{ padding: '1rem', color: '#475569' }}>Bağlı Departman</th>
                      <th style={{ padding: '1rem', textAlign: 'right', color: '#475569' }}>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                     {titles.length === 0 ? <tr><td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Henüz ünvan eklenmemiş.</td></tr> : null}
                     {titles.map(t => {
                       const dept = departments.find(d => d.id === t.departmentId);
                       return (
                       <tr key={t.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s' }}>
                         <td style={{ padding: '1rem', fontWeight: 600, color: '#1e293b' }}>{t.name}</td>
                         <td style={{ padding: '1rem', color: '#64748b' }}>{dept ? dept.name : <span style={{ color: '#ef4444' }}>Bağlantısız</span>}</td>
                         <td style={{ padding: '1rem', textAlign: 'right' }}>
                            <button onClick={() => deleteTitle(t.id)} style={{ background: '#fee2e2', color: '#ef4444', border: '1px solid #fecdd3', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>Sil</button>
                         </td>
                       </tr>
                     )})}
                  </tbody>
                </table>
              </div>
           )}
        </div>
     </div>
  );
}
