import React, { useState } from 'react';

export default function LearningPaths({ paths, setPaths, catalog, userRole, employees }) {
  const isAdmin = userRole === 'danisman' || userRole === 'superadmin' || userRole === 'musteri';

  // Modals State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newPathData, setNewPathData] = useState({ title: '', targetGrade: '', steps: [] });
  
  const [assignModalOpen, setAssignModalOpen] = useState(null); // null veya öğrenme yolu objesi
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  // --- OLUŞTURMA MANTIĞI ---
  const handleToggleStep = (training) => {
    const existing = newPathData.steps.find(s => s.trainingId === training.id);
    if (existing) {
      setNewPathData({ ...newPathData, steps: newPathData.steps.filter(s => s.trainingId !== training.id) });
    } else {
      setNewPathData({ 
        ...newPathData, 
        steps: [...newPathData.steps, { stepId: `s_${Date.now()}`, trainingId: training.id, isMandatory: true, order: newPathData.steps.length + 1 }]
      });
    }
  };

  const handleCreatePathSubmit = () => {
    if (!newPathData.title || newPathData.steps.length === 0) {
      alert('Lütfen başlık girin ve en az 1 eğitim seçin.');
      return;
    }
    
    // Calculate total duration from catalog
    let estDuration = 0;
    newPathData.steps.forEach(s => {
      const t = catalog.find(x => x.id === s.trainingId);
      if (t) estDuration += t.duration;
    });

    const newPath = {
      id: `lp_${Date.now()}`,
      title: newPathData.title,
      targetGrade: newPathData.targetGrade || 'Genel',
      steps: newPathData.steps,
      estimatedDuration: estDuration,
      linkedSkills: [],
      completionRate: 0
    };

    setPaths([newPath, ...paths]);
    alert('Yeni Öğrenme Yolu başarıyla oluşturuldu!');
    setCreateModalOpen(false);
    setNewPathData({ title: '', targetGrade: '', steps: [] });
  };

  // --- ATAMA MANTIĞI ---
  const handleAssignSubmit = () => {
    if (selectedEmployees.length === 0) {
      alert('Lütfen en az bir çalışan seçin.');
      return;
    }
    alert(`"${assignModalOpen.title}" programı başarıyla ${selectedEmployees.length} çalışana atandı! IDP'leri güncellendi.`);
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
    <div className="learning-paths fade-in" style={{ position: 'relative' }}>
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ color: '#1e293b', margin: 0 }}>Öğrenme Yolları</h2>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Rol bazlı ardışık gelişim programları</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setCreateModalOpen(true)}
            style={{ padding: '0.5rem 1.5rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', height: 'fit-content' }}>
            + Yeni Yol Oluştur
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {paths.map(path => (
          <div key={path.id} className="path-card glass" style={{ padding: '1.5rem', borderRadius: '8px', background: '#fff', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>{path.title}</h3>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Hedef: {path.targetGrade} | Toplam Süre: ~{path.estimatedDuration} Saat</span>
              </div>
              
              <button 
                onClick={() => {
                  if (isAdmin) setAssignModalOpen(path);
                  else alert(`"${path.title}" programına katılım talebiniz yöneticinize iletildi.`);
                }}
                style={{ 
                  padding: '0.5rem 1rem', 
                  background: isAdmin ? '#10b981' : '#3b82f6', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '6px', 
                  fontWeight: '500', 
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}>
                {isAdmin ? 'Yolu Ata / Yönet' : 'Programa Katıl / Talep Et'}
              </button>
            </div>
            
            <div className="steps-container" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {path.steps.sort((a,b)=>a.order-b.order).map((step, idx) => {
                const training = catalog.find(t => t.id === step.trainingId);
                return (
                  <div key={step.stepId} style={{ minWidth: '200px', padding: '1rem', background: '#f8fafc', borderRadius: '6px', border: '1px dashed #cbd5e1', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-10px', left: '-10px', width: '24px', height: '24px', background: '#3b82f6', color: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {idx + 1}
                    </div>
                    <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#334155' }}>{training ? training.title : 'Bilinmeyen Eğitim'}</h5>
                    <span style={{ fontSize: '0.75rem', color: step.isMandatory ? '#ef4444' : '#64748b' }}>
                      {step.isMandatory ? '* Zorunlu Adım' : 'Opsiyonel Adım'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* YOL OLUŞTURMA MODALI */}
      {createModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass fade-in" style={{ background: '#fff', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#1e293b' }}>Yeni Öğrenme Yolu Oluştur</h3>
              <button onClick={() => setCreateModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>×</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Program Başlığı</label>
                <input 
                  type="text" 
                  value={newPathData.title}
                  onChange={e => setNewPathData({...newPathData, title: e.target.value})}
                  placeholder="Örn: Yeni Yönetici Uyum Programı"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Hedef Rol / Seviye</label>
                <input 
                  type="text" 
                  value={newPathData.targetGrade}
                  onChange={e => setNewPathData({...newPathData, targetGrade: e.target.value})}
                  placeholder="Örn: Tüm Çalışanlar, Satış L3..."
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>

            <h4 style={{ fontSize: '0.95rem', color: '#334155', marginBottom: '0.5rem' }}>Adımları Seçin (Katalogdan)</h4>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '1rem', maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
              {catalog.map(training => (
                <label key={training.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox"
                    checked={newPathData.steps.some(s => s.trainingId === training.id)}
                    onChange={() => handleToggleStep(training)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '0.9rem' }}>{training.title} <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>({training.duration}s)</span></span>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button onClick={() => setCreateModalOpen(false)} style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>İptal</button>
              <button onClick={handleCreatePathSubmit} style={{ padding: '0.75rem 1.5rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Yolu Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {/* YOL ATAMA MODALI */}
      {assignModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass fade-in" style={{ background: '#fff', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#1e293b' }}>Programa Ata: {assignModalOpen.title}</h3>
              <button onClick={() => {setAssignModalOpen(null); setSelectedEmployees([]);}} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>×</button>
            </div>
            
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>Bu öğrenme yolunu atamak istediğiniz çalışanları seçin:</p>
            
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
