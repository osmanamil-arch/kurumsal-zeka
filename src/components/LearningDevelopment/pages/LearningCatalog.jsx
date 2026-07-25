import React, { useState } from 'react';

export default function LearningCatalog({ catalog, userRole, employees }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // Modal State
  const [assignModalOpen, setAssignModalOpen] = useState(null); // null veya eğitim objesi
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const filteredCatalog = catalog.filter(t => {
    if (filterType !== 'all' && t.category !== filterType) return false;
    if (searchTerm && !t.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleAssignSubmit = () => {
    if (selectedEmployees.length === 0) {
      alert('Lütfen en az bir çalışan seçin.');
      return;
    }
    alert(`"${assignModalOpen.title}" eğitimi başarıyla ${selectedEmployees.length} çalışana atandı! Çalışanlara bildirim gönderildi.`);
    setAssignModalOpen(null);
    setSelectedEmployees([]);
  };

  const toggleEmployeeSelection = (empId) => {
    if (selectedEmployees.includes(empId)) {
      setSelectedEmployees(selectedEmployees.filter(id => id !== empId));
    } else {
      setSelectedEmployees([...selectedEmployees, empId]);
    }
  };

  return (
    <div className="learning-catalog fade-in" style={{ position: 'relative' }}>
      <div className="catalog-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ color: '#1e293b', margin: 0 }}>Akademi / Eğitim Kataloğu</h2>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Kurum içi ve dışı tüm eğitim fırsatlarını keşfedin</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Eğitim ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
          />
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
          >
            <option value="all">Tüm Kategoriler</option>
            <option value="technical">Teknik</option>
            <option value="behavioral">Davranışsal</option>
            <option value="mandatory">Zorunlu / İSG</option>
          </select>
        </div>
      </div>

      <div className="catalog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {filteredCatalog.map(training => (
          <div key={training.id} className="training-card glass" style={{ padding: '1.5rem', borderRadius: '8px', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: training.isMandatory ? '#fee2e2' : '#e0f2fe', color: training.isMandatory ? '#ef4444' : '#0284c7', borderRadius: '4px', fontWeight: 'bold' }}>
                {training.isMandatory ? 'ZORUNLU' : training.category.toUpperCase()}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>⏱ {training.duration} saat</span>
            </div>
            <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>{training.title}</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', flex: 1 }}>{training.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {training.tags.map(tag => (
                <span key={tag} style={{ fontSize: '0.7rem', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#475569' }}>#{tag}</span>
              ))}
            </div>
            <button 
              onClick={() => {
                if (userRole === 'danisman' || userRole === 'superadmin' || userRole === 'musteri') {
                  setAssignModalOpen(training);
                } else {
                  alert(`"${training.title}" eğitimi için talebiniz yöneticinize iletildi.`);
                }
              }}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                background: (userRole === 'danisman' || userRole === 'superadmin' || userRole === 'musteri') ? '#10b981' : '#3b82f6', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '6px', 
                fontWeight: '500', 
                cursor: 'pointer', 
                marginTop: '0.5rem',
                transition: 'background 0.2s'
              }}>
              {(userRole === 'danisman' || userRole === 'superadmin' || userRole === 'musteri') ? 'Eğitim Ata / Yönet' : 'Eğitime Git / Talep Et'}
            </button>
          </div>
        ))}
        {filteredCatalog.length === 0 && <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#64748b' }}>Eşleşen eğitim bulunamadı.</p>}
      </div>

      {/* Eğitim Atama Modalı */}
      {assignModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass fade-in" style={{ background: '#fff', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#1e293b' }}>Eğitim Ata: {assignModalOpen.title}</h3>
              <button onClick={() => {setAssignModalOpen(null); setSelectedEmployees([]);}} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>×</button>
            </div>
            
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>Eğitimi atamak istediğiniz çalışanları seçin:</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
              {employees && employees.map(emp => (
                <label key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '4px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedEmployees.includes(emp.id)}
                    onChange={() => toggleEmployeeSelection(emp.id)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontWeight: '500', color: '#1e293b' }}>{emp.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{emp.department} - {emp.title}</div>
                  </div>
                </label>
              ))}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button onClick={() => {setAssignModalOpen(null); setSelectedEmployees([]);}} style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>
                İptal
              </button>
              <button onClick={handleAssignSubmit} style={{ padding: '0.75rem 1.5rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                Seçili Kişilere Ata ({selectedEmployees.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
