import React, { useState, useMemo } from 'react';

export default function WizardStep3({ formData, setFormData, compLib = [], skillLib = [], knowLib = [], certLib = [], setErrorMsg }) {
  const [activeTab, setActiveTab] = useState('competencies'); // 'competencies', 'skills', 'knowledge', 'certifications'

  // --- Öneri Motoru (Context-Aware) ---
  const extractTaskKeywords = () => {
    const text = (formData.tasks || []).map(t => t.title.toLowerCase()).join(' ');
    return text;
  };

  const suggestedItems = useMemo(() => {
    const taskText = extractTaskKeywords();
    const currentFamilyId = formData.jobFamilyId;
    
    // Yardımcı: İlgili ailenin item'ı mı veya genel (familyId null) item mı?
    const isRelevantFamily = (item) => !item.familyId || item.familyId === currentFamilyId;

    if (activeTab === 'competencies') {
       return compLib.filter(c => c.isActive && isRelevantFamily(c) && (
           // Liderlik seviyesiyse (L4, L5) liderlik yetkinliklerini öner
           (formData.jobLevelId && (formData.jobLevelId === 'l4' || formData.jobLevelId === 'l5') && c.category === 'Leadership') ||
           // Genel Core yetkinlik
           c.category === 'Core'
       )).slice(0, 5); // İlk 5'i göster
    }
    if (activeTab === 'skills') {
       return skillLib.filter(s => s.isActive && isRelevantFamily(s)); 
    }
    if (activeTab === 'knowledge') {
       return knowLib.filter(k => k.isActive && isRelevantFamily(k));
    }
    if (activeTab === 'certifications') {
       return certLib.filter(c => c.isActive && isRelevantFamily(c));
    }
    return [];
  }, [activeTab, formData.jobLevelId, formData.jobFamilyId, formData.tasks, compLib, skillLib, knowLib, certLib]);

  // --- Ortak Ekleme Fonksiyonu ---
  const handleAddItem = (listName, libItem = null) => {
    const newId = listName.charAt(0) + '_' + Date.now().toString();
    
    // Duplicate kontrolü
    if (libItem && (formData[listName] || []).some(item => item.libraryId === libItem.id)) {
        alert('Bu kayıt formunuza zaten eklenmiş!');
        return;
    }

    let newItem = {
      id: newId,
      libraryId: libItem ? libItem.id : null,
      title: libItem ? libItem.title : '',
      isMandatory: true,
      isCustomized: !libItem
    };

    if (listName !== 'certifications') {
      newItem.proficiencyLevel = 2; // Default Orta
    } else {
      newItem.issuingBody = libItem ? libItem.issuingBody : '';
      newItem.expiry = '';
    }

    setFormData(prev => ({ ...prev, [listName]: [...(prev[listName] || []), newItem] }));
  };

  const handleUpdateItem = (listName, id, field, value) => {
    setFormData(prev => ({
      ...prev,
      [listName]: (prev[listName] || []).map(item => 
        item.id === id ? { ...item, [field]: value, isCustomized: true } : item
      )
    }));
  };

  const handleRemoveItem = (listName, id) => {
    setFormData(prev => ({
      ...prev,
      [listName]: (prev[listName] || []).filter(item => item.id !== id)
    }));
  };

  const inputStyle = { width: '100%', padding: '0.4rem 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' };

  // --- TAB RENDER YARDIMCISI ---
  const renderList = (listName, titleLabel, showProficiency = true) => {
    const list = formData[listName] || [];
    
    return (
      <div className="fade-in">
        {list.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#f1f5f9', borderRadius: '8px', color: '#64748b', border: '2px dashed #cbd5e1' }}>
            Henüz eklenmiş {titleLabel} yok. Sağdaki havuzdan seçebilir veya yeni ekleyebilirsiniz.
          </div>
        )}

        {list.map((item, index) => (
          <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem', background: '#fff', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', width: '15px' }}>{index + 1}.</span>
            
            <div style={{ flex: 2 }}>
              <input 
                type="text" 
                value={item.title} 
                onChange={e => handleUpdateItem(listName, item.id, 'title', e.target.value)}
                placeholder={`${titleLabel} başlığı...`}
                style={{ ...inputStyle, fontWeight: 600 }}
              />
              {listName === 'certifications' && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input type="text" value={item.issuingBody || ''} onChange={e => handleUpdateItem(listName, item.id, 'issuingBody', e.target.value)} placeholder="Veren Kurum (Ops.)" style={{ ...inputStyle, flex: 1 }} />
                  <input type="text" value={item.expiry || ''} onChange={e => handleUpdateItem(listName, item.id, 'expiry', e.target.value)} placeholder="Geçerlilik/Sınır (Ops.)" style={{ ...inputStyle, flex: 1 }} />
                </div>
              )}
            </div>

            {showProficiency && (
              <div style={{ flex: 1 }}>
                <select 
                  value={item.proficiencyLevel} 
                  onChange={e => handleUpdateItem(listName, item.id, 'proficiencyLevel', Number(e.target.value))}
                  style={inputStyle}
                >
                  {listName === 'competencies' ? (
                    <>
                      <option value={1}>1 - Temel</option>
                      <option value={2}>2 - Fonksiyonel</option>
                      <option value={3}>3 - Yönetsel</option>
                    </>
                  ) : (
                    <>
                      <option value={1}>1 - Temel</option>
                      <option value={2}>2 - Orta</option>
                      <option value={3}>3 - İleri</option>
                    </>
                  )}
                </select>
              </div>
            )}

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <select 
                  value={item.isMandatory ? "true" : "false"} 
                  onChange={e => handleUpdateItem(listName, item.id, 'isMandatory', e.target.value === "true")}
                  style={{ ...inputStyle, background: item.isMandatory ? '#fee2e2' : '#dcfce7', color: item.isMandatory ? '#991b1b' : '#166534', borderColor: item.isMandatory ? '#fca5a5' : '#86efac' }}
              >
                <option value="true">Zorunlu</option>
                <option value="false">Opsiyonel</option>
              </select>
            </div>

            <button title="Sil" onClick={() => handleRemoveItem(listName, item.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>✖</button>
          </div>
        ))}

        <button onClick={() => handleAddItem(listName)} style={{ background: '#e0e7ff', color: '#3730a3', border: '1px dashed #a5b4fc', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          + Manuel {titleLabel} Ekle
        </button>
      </div>
    );
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* TEK KOLON: TEKMELER VE LİSTELER */}
      <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
        <h3 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', color: '#0f172a', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <span>Adım 3: Yeterlilikler & Nitelikler</span>
          
          <div style={{ fontSize: '0.75rem', display: 'flex', gap: '0.5rem', color: '#64748b', fontWeight: 'normal' }}>
            <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>🎯 ${(formData.competencies || []).length} Yetkinlik</span>
            <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>🔧 ${(formData.skills || []).length} Beceri</span>
            <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>🧠 ${(formData.knowledge || []).length} Bilgi</span>
            <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>📜 ${(formData.certifications || []).length} Sertifika</span>
          </div>
        </h3>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0' }}>
          <button onClick={() => setActiveTab('competencies')} style={{ padding: '0.5rem 1rem', background: 'transparent', border: 'none', borderBottom: activeTab === 'competencies' ? '3px solid #3b82f6' : '3px solid transparent', color: activeTab === 'competencies' ? '#3b82f6' : '#64748b', fontWeight: activeTab === 'competencies' ? 'bold' : 'normal', cursor: 'pointer' }}>Davranışsal Yetkinlik</button>
          <button onClick={() => setActiveTab('skills')} style={{ padding: '0.5rem 1rem', background: 'transparent', border: 'none', borderBottom: activeTab === 'skills' ? '3px solid #3b82f6' : '3px solid transparent', color: activeTab === 'skills' ? '#3b82f6' : '#64748b', fontWeight: activeTab === 'skills' ? 'bold' : 'normal', cursor: 'pointer' }}>Teknik Beceri</button>
          <button onClick={() => setActiveTab('knowledge')} style={{ padding: '0.5rem 1rem', background: 'transparent', border: 'none', borderBottom: activeTab === 'knowledge' ? '3px solid #3b82f6' : '3px solid transparent', color: activeTab === 'knowledge' ? '#3b82f6' : '#64748b', fontWeight: activeTab === 'knowledge' ? 'bold' : 'normal', cursor: 'pointer' }}>Kurum/Alan Bilgisi</button>
          <button onClick={() => setActiveTab('certifications')} style={{ padding: '0.5rem 1rem', background: 'transparent', border: 'none', borderBottom: activeTab === 'certifications' ? '3px solid #3b82f6' : '3px solid transparent', color: activeTab === 'certifications' ? '#3b82f6' : '#64748b', fontWeight: activeTab === 'certifications' ? 'bold' : 'normal', cursor: 'pointer' }}>Sertifika & Lisans</button>
        </div>

        {/* 🌟 YENİ: ÖNERİ HAVUZU (INLINE / ÇEVİK) */}
        {(() => {
          let suggestedItems = [];
          if (activeTab === 'competencies') suggestedItems = (compLib || []).filter(c => c.isActive && c.familyId === formData.jobFamilyId);
          if (activeTab === 'skills') suggestedItems = (skillLib || []).filter(s => s.isActive && s.familyId === formData.jobFamilyId);
          if (activeTab === 'knowledge') suggestedItems = (knowLib || []).filter(k => k.isActive && k.familyId === formData.jobFamilyId);
          if (activeTab === 'certifications') suggestedItems = (certLib || []).filter(c => c.isActive && c.familyId === formData.jobFamilyId);

          if (suggestedItems.length === 0) return null;

          return (
            <div style={{ padding: '1.25rem', background: '#eff6ff', border: '1px dashed #bfdbfe', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🪄</span> AI Kütüphane Önerileri ({activeTab === 'competencies' ? 'Yetkinlik' : activeTab === 'skills' ? 'Beceri' : activeTab === 'knowledge' ? 'Bilgi' : 'Sertifika'})
              </h4>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {suggestedItems.map(libItem => {
                   const isAdded = (formData[activeTab] || []).some(item => item.libraryId === libItem.id);
                   if (isAdded) return null;
                   return (
                     <button 
                       key={libItem.id} 
                       onClick={() => handleAddGeneric(activeTab)(libItem)} 
                       style={{ padding: '0.5rem 1rem', background: '#fff', border: '1px solid #93c5fd', borderRadius: '20px', color: '#2563eb', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'all 0.2s', outline: 'none' }}
                       onMouseOver={e => e.currentTarget.style.background = '#dbeafe'}
                       onMouseOut={e => e.currentTarget.style.background = '#fff'}
                     >
                       + {libItem.title}
                     </button>
                   )
                })}
                {suggestedItems.every(r => (formData[activeTab] || []).some(existing => existing.libraryId === r.id)) && (
                   <span style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>Tüm harika öneriler forma başarıyla işlendi! 🎉</span>
                )}
              </div>
            </div>
          );
        })()}

        {activeTab === 'competencies' && renderList('competencies', 'Davranışsal Yetkinlik', true)}
        {activeTab === 'skills' && renderList('skills', 'Teknik Beceri', true)}
        {activeTab === 'knowledge' && renderList('knowledge', 'Uzmanlık/Bilgi', true)}
        {activeTab === 'certifications' && renderList('certifications', 'Sertifika', false)}

      </div>
    </div>
  );
}
