import React, { useState, useMemo } from 'react';

export default function WizardStep2({ formData, setFormData, respLib = [], taskLib = [], setErrorMsg }) {

  // --- Kütüphane Filtreleme Mantığı (Adım 1'deki seçimlere göre) ---
  const suggestedResponsibilities = useMemo(() => {
    return respLib.filter(r => r.isActive && r.jobFamilyId === formData.jobFamilyId);
  }, [respLib, formData.jobFamilyId]);

  // --- Sorumluluk Ekleme/Çıkarma ---
  const handleAddResponsibility = (libItem = null) => {
    const newId = 'r_' + Date.now().toString();
    const newResp = {
      id: newId,
      libraryId: libItem ? libItem.id : null,
      title: libItem ? libItem.title : '',
      description: libItem ? libItem.description : '',
      isCustomized: !libItem,
      sortOrder: formData.responsibilities.length + 1
    };
    
    // Duplicate Check (Zaten formda var mı?)
    if (libItem) {
      if ((formData.responsibilities || []).some(r => r.libraryId === libItem.id)) {
         alert('Bu sorumluluk zaten ekli!');
         return;
      }
    }

    setFormData(prev => ({ ...prev, responsibilities: [...(prev.responsibilities || []), newResp] }));
  };

  const handleUpdateResponsibility = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: (prev.responsibilities || []).map(r => 
        r.id === id ? { ...r, [field]: value, isCustomized: true } : r
      )
    }));
  };

  const handleRemoveResponsibility = (id) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: (prev.responsibilities || []).filter(r => r.id !== id),
      tasks: (prev.tasks || []).filter(t => t.refResponsibilityId !== id) // Bağlı görevleri de sil
    }));
  };

  // --- Görev (Task) Ekleme/Çıkarma ---
  const handleAddTask = (respId, libItem = null) => {
    const newTaskId = 't_' + Date.now().toString();
    const currentTasks = (formData.tasks || []).filter(t => t.refResponsibilityId === respId);

    const newTask = {
      id: newTaskId,
      refResponsibilityId: respId,
      libraryId: libItem ? libItem.id : null,
      title: libItem ? libItem.title : '',
      criticality: libItem ? libItem.criticality : 2, // Default Orta (2)
      isCustomized: !libItem,
      sortOrder: currentTasks.length + 1
    };

    if (libItem) {
      if ((formData.tasks || []).some(t => t.libraryId === libItem.id && t.refResponsibilityId === respId)) {
         alert('Bu görev bu sorumluluğa zaten ekli!');
         return;
      }
    }

    setFormData(prev => ({ ...prev, tasks: [...(prev.tasks || []), newTask] }));
  };

  const handleUpdateTask = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      tasks: (prev.tasks || []).map(t => 
        t.id === id ? { ...t, [field]: value, isCustomized: true } : t
      )
    }));
  };

  const handleRemoveTask = (id) => {
    setFormData(prev => ({ ...prev, tasks: (prev.tasks || []).filter(t => t.id !== id) }));
  };

  const inputStyle = { width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.9rem' };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* TEK KOLON: FORM */}
      <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
        <h3 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', color: '#0f172a' }}>Adım 2: Sorumluluk ve Görevler (Önerilenler)</h3>
        
        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem', borderLeft: '4px solid #3b82f6', fontSize: '0.85rem', color: '#334155' }}>
          <strong>Bilgilendirme:</strong><br/>
          <strong>Sorumluluklar:</strong> "Vardiya Yönetimi", "Bölge Satış İşlemleri" gibi geniş çaplı etki alanlarıdır.<br/>
          <strong>Görevler:</strong> İşletmede günlük/haftalık yapılan somut eylem adımlarıdır. *(Örn: Günlük müşteri iade faturalarını kesmek)*
        </div>

        {/* 🌟 YENİ: ÖNERİ HAVUZU (INLINE / ÇEVİK) */}
        {suggestedResponsibilities.length > 0 && (
          <div style={{ padding: '1.25rem', background: '#eff6ff', border: '1px dashed #bfdbfe', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🪄</span> AI Kütüphane Önerileri (Tek Tıkla Ekle)
            </h4>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {suggestedResponsibilities.map(libResp => {
                 const isAdded = (formData.responsibilities || []).some(r => r.libraryId === libResp.id);
                 if (isAdded) return null;
                 return (
                   <button 
                     key={libResp.id} 
                     onClick={() => handleAddResponsibility(libResp)} 
                     style={{ padding: '0.5rem 1rem', background: '#fff', border: '1px solid #93c5fd', borderRadius: '20px', color: '#2563eb', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'all 0.2s', outline: 'none' }}
                     onMouseOver={e => e.currentTarget.style.background = '#dbeafe'}
                     onMouseOut={e => e.currentTarget.style.background = '#fff'}
                   >
                     + {libResp.title}
                   </button>
                 )
              })}
              {suggestedResponsibilities.every(r => (formData.responsibilities || []).some(existing => existing.libraryId === r.id)) && (
                 <span style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>Tüm harika öneriler forma başarıyla işlendi! 🎉</span>
              )}
            </div>
          </div>
        )}

        {/* Sorumluluk Listesi */}
        {(formData.responsibilities || []).length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#f1f5f9', borderRadius: '8px', color: '#64748b', border: '2px dashed #cbd5e1' }}>
            Bu iş ailesi için henüz otomatik öneri bulunmuyor. Lütfen aşağıdaki "Manuel Ekle" butonu ile başlayın.
          </div>
        )}

        {[...(formData.responsibilities || [])].sort((a,b)=>(a.sortOrder || 0) - (b.sortOrder || 0)).map((resp, rIndex) => (
          <div key={resp.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '1.5rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            
            {/* Sorumluluk Header */}
            <div style={{ background: '#f1f5f9', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ background: '#cbd5e1', color: '#334155', fontWeight: 'bold', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                {rIndex + 1}
              </div>
              <div style={{ flex: 1 }}>
                <input 
                  type="text" 
                  value={resp.title} 
                  onChange={e => handleUpdateResponsibility(resp.id, 'title', e.target.value)} 
                  placeholder="Sorumluluk Başlığı (Örn: Saha Operasyon Yönetimi)" 
                  style={{ ...inputStyle, fontWeight: 'bold', marginBottom: '0.5rem' }} 
                />
                <textarea 
                  value={resp.description} 
                  onChange={e => handleUpdateResponsibility(resp.id, 'description', e.target.value)} 
                  placeholder="Bu sorumluluğun genel açıklaması (Opsiyonel)" 
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '60px' }} 
                />
                {resp.isCustomized && resp.libraryId && <span style={{ fontSize: '0.7rem', color: '#d97706', display: 'block', marginTop: '4px' }}>* Kütüphaneden alındıktan sonra özelleştirildi</span>}
              </div>
              <button title="Sorumluluğu Sil" onClick={() => handleRemoveResponsibility(resp.id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}>🗑️</button>
            </div>

            {/* Görevler (Tasks) Listesi */}
            <div style={{ padding: '1rem' }}>
              <h5 style={{ margin: '0 0 1rem 0', color: '#475569', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>🎯 Bu Sorumluluğa Bağlı Görevler</span>
              </h5>
              
              {(formData.tasks || []).filter(t => t.refResponsibilityId === resp.id).sort((a,b)=>(a.sortOrder || 0) - (b.sortOrder || 0)).map((task, tIndex) => (
                <div key={task.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem', width: '20px' }}>{tIndex + 1}.</span>
                  <input 
                    type="text" 
                    value={task.title} 
                    onChange={e => handleUpdateTask(task.id, 'title', e.target.value)}
                    placeholder="Görev metni..." 
                    style={{ ...inputStyle, flex: 1 }} 
                  />
                  <select 
                    value={task.criticality} 
                    onChange={e => handleUpdateTask(task.id, 'criticality', Number(e.target.value))}
                    style={{ ...inputStyle, width: '120px' }}
                  >
                    <option value={1}>1 - Kritik</option>
                    <option value={2}>2 - Orta</option>
                    <option value={3}>3 - Düşük</option>
                  </select>
                  <button title="Görevi Sil" onClick={() => handleRemoveTask(task.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>✖</button>
                </div>
              ))}

              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <button onClick={() => handleAddTask(resp.id)} style={{ background: '#e0e7ff', color: '#3730a3', border: '1px dashed #a5b4fc', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                  + Manuel Görev Ekle
                </button>

                {/* Eğer Kütüphaneden gelen bir sorumluluksa, onun alt görevlerini önerebiliriz */}
                {resp.libraryId && taskLib.some(t => t.responsibilityId === resp.libraryId && t.isActive) && (
                  <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', padding: '0.4rem 1rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <span style={{ color: '#166534' }}>💡 Kütüphane Görevleri:</span>
                    {taskLib.filter(t => t.responsibilityId === resp.libraryId && t.isActive).map(libTask => (
                       <button 
                         key={libTask.id}
                         title={libTask.title}
                         onClick={() => handleAddTask(resp.id, libTask)}
                         style={{ background: '#fff', border: '1px solid #86efac', borderRadius: '4px', padding: '2px 6px', fontSize: '0.75rem', cursor: 'pointer' }}
                       >
                         + Ekle
                       </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        ))}

        <button onClick={() => handleAddResponsibility()} style={{ background: '#1e293b', color: '#fff', border: 'none', padding: '0.75rem 2rem', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', fontWeight: 600, marginTop: '1rem', width: '100%' }}>
          + Manuel Sorumluluk Grubu Ekle
        </button>

      </div>
    </div>
  );
}
