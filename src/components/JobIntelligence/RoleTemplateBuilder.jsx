import React, { useState, useEffect } from 'react';
import { useMetadataStorage } from '../../hooks/useMetadataStorage';
import { RuleEngine } from '../../engine/CoreEngines';
import './JI_Styles.css';

const WEIGHTED_TYPES = [
  { id: 'COMPETENCY', label: 'Yetkinlikler' },
  { id: 'SKILL', label: 'Beceriler' },
  { id: 'TASK', label: 'Görevler' },
  { id: 'RESPONSIBILITY', label: 'Sorumluluklar' },
  { id: 'KPI', label: 'KPI Tanımları' }
];

const LIST_TYPES = [
  { id: 'KNOWLEDGE', label: 'Bilgi Alanları' },
  { id: 'WORK_CONDITION', label: 'Çalışma Koşulları' },
  { id: 'CERTIFICATION', label: 'Sertifikalar' }
];

export default function RoleTemplateBuilder() {
  const db = useMetadataStorage();
  
  const [templateForm, setTemplateForm] = useState({
    name: '',
    jobFamily: '',
    jobFunction: '',
    level: '',
    items: [], // Array of { libraryItemId: string, weight: number, isRequired: boolean, note: string }
    customFields: {},
    education: '',
    experience: ''
  });

  const [validationResult, setValidationResult] = useState({ isValid: true, errors: [], warnings: [] });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false); // AI State

  useEffect(() => {
    const result = RuleEngine.validateTemplate(templateForm, db);
    setValidationResult(result);
  }, [templateForm, db]);

  const handleAddItem = (e, type) => {
    const libId = e.target.value;
    if (!libId) return;
    
    if (templateForm.items.find(it => it.libraryItemId === libId)) return;
    const isWeighted = WEIGHTED_TYPES.find(w => w.id === type);
    
    setTemplateForm(prev => ({
      ...prev,
      items: [...prev.items, { libraryItemId: libId, weight: isWeighted ? 10 : 0, isRequired: true, note: '' }]
    }));
  };

  const handleUpdateItem = (libId, field, value) => {
    setTemplateForm(prev => ({
      ...prev,
      items: prev.items.map(it => it.libraryItemId === libId ? { ...it, [field]: value } : it)
    }));
  };

  const handleRemoveItem = (libId) => {
    setTemplateForm(prev => ({
      ...prev,
      items: prev.items.filter(it => it.libraryItemId !== libId)
    }));
  };

  const handleSave = () => {
    if (!validationResult.isValid) return alert("Kural hataları giderilmeden kayıt yapılamaz.");
    if (!templateForm.name || !templateForm.jobFamily || !templateForm.level) return alert("Temel bilgiler eksik.");
    
    db.saveRoleTemplate(templateForm);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // --- MOCK AI SIMULATION ENGINE ---
  const handleAutoFillMatch = () => {
    // Biraz veri yoksa uyarı ver.
    if (db.library.length < 10) {
      alert("AI Asistanı için kütüphanede yeterli veri yok. Önce Master Data'dan sahte veriler ekleyin.");
      return;
    }

    setIsAiThinking(true);
    
    setTimeout(() => {
      const searchSpace = `${templateForm.name} ${templateForm.jobFamily} ${templateForm.jobFunction} ${templateForm.level}`.toLowerCase();
      
      let newItems = [];
      const weightDistributions = [
        [50, 30, 20],
        [40, 30, 20, 10],
        [60, 40],
        [30, 30, 20, 20]
      ];

      // Ağırlıklı tipler
      WEIGHTED_TYPES.forEach(typeConf => {
        const availableItems = db.library.filter(l => l.type === typeConf.id && l.isActive);
        if(availableItems.length === 0) return;

        // Kelime eşleştirme skoru (Heuristic)
        const scoredItems = availableItems.map(item => {
           let score = Math.random() * 10; // taban rastgelelik (aynı heceler kalmaması için)
           const itemStr = `${item.name} ${item.tags?.join(' ')} ${item.category}`.toLowerCase();
           
           if(searchSpace.length > 3) {
             const words = searchSpace.split(' ').filter(w => w.length > 3);
             words.forEach(w => {
                if (itemStr.includes(w)) score += 50; // yüksek eşleşme
             });
           }
           return { ...item, _aiScore: score };
        }).sort((a, b) => b._aiScore - a._aiScore);

        // Rastgele bir dağıtım deseni seç (Örn: 3'lü dağıtım -> [50, 30, 20])
        const distCount = Math.min(scoredItems.length, weightDistributions[Math.floor(Math.random() * weightDistributions.length)].length);
        const distArray = weightDistributions.find(arr => arr.length === distCount) || weightDistributions[0];
        
        // Sepete Ekle
        for(let i=0; i < distCount; i++) {
          if (!scoredItems[i]) continue;
          const isReq = Math.random() > 0.3; // %70 ihtimalle mandatory
          newItems.push({
            libraryItemId: scoredItems[i].id,
            weight: distArray[i] || 0,
            isRequired: isReq,
            note: scoredItems[i]._aiScore > 30 ? "✨ AI: Bu rolün karakteri/profil adı ile doğrudan eşleştiği için önceliklendirildi." : ""
          });
        }
      });

      // Liste (Ağırlıksız) tipler
      LIST_TYPES.forEach(typeConf => {
        const availableItems = db.library.filter(l => l.type === typeConf.id && l.isActive);
        if(availableItems.length === 0) return;
        
        const count = Math.min(availableItems.length, Math.floor(Math.random() * 3) + 1); // 1-3 adet
        const shuffled = availableItems.sort(() => 0.5 - Math.random());
        for(let i=0; i < count; i++) {
          newItems.push({
             libraryItemId: shuffled[i].id,
             weight: 0,
             isRequired: Math.random() > 0.5,
             note: ""
          });
        }
      });

      // State'i ez (kullanıcının girdiklerini temizleyip AI verisini koyar)
      setTemplateForm(prev => ({
        ...prev,
        items: newItems
      }));

      setIsAiThinking(false);
    }, 1800); // 1.8 sn düşünme animasyonu
  };

  const jobFamilies = db.library.filter(l => l.type === 'JOB_FAMILY');
  const jobFunctions = db.library.filter(l => l.type === 'JOB_FUNCTION');
  const jobLevels = db.library.filter(l => l.type === 'JOB_LEVEL');
  const customFieldsRender = db.metadataFields.filter(f => f.entityType === 'ROLE_TEMPLATE');

  const renderGroup = (groupConfig, isWeighted) => {
    const availableItemsInLibrary = db.library.filter(l => l.type === groupConfig.id && l.isActive);
    const addedItems = templateForm.items.filter(it => {
      const lib = db.library.find(l => l.id === it.libraryItemId);
      return lib && lib.type === groupConfig.id;
    });

    const totalWeight = addedItems.reduce((acc, curr) => acc + (curr.weight || 0), 0);
    const isWeightValid = totalWeight === 100;

    return (
      <div key={groupConfig.id} className="glass-card" style={{ marginBottom: '1.5rem', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        {/* Eğer AI dokunduysa arkaya ufak bir border veya glow eklenebilir, şimdilik sade. */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #E2E8F0' }}>
          <h3 style={{ margin: 0, color: '#1E293B' }}>{groupConfig.label}</h3>
          
          {isWeighted && addedItems.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: isWeightValid ? '#D1FAE5' : '#FEE2E2', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
              <span style={{ fontSize: '0.8rem', color: isWeightValid ? '#065F46' : '#991B1B', fontWeight: 600 }}>T. Ağırlık:</span>
              <span style={{ fontSize: '0.9rem', color: isWeightValid ? '#065F46' : '#991B1B', fontWeight: 700 }}>%{totalWeight}</span>
              {!isWeightValid && <span style={{ fontSize: '0.7rem', color: '#991B1B' }}> (100 olmalı)</span>}
            </div>
          )}
        </div>

        <select className="ji-input" style={{ marginBottom: '1rem', borderColor: '#CBD5E1', backgroundColor: '#F8FAFC' }} onChange={(e) => handleAddItem(e, groupConfig.id)} value="">
          <option value="">+ {groupConfig.label} Havuzundan Seçin...</option>
          {availableItemsInLibrary.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {addedItems.map((item, index) => {
            const libItem = db.library.find(l => l.id === item.libraryItemId);
            if (!libItem) return null;
            
            return (
              <div key={item.libraryItemId} style={{ display: 'flex', flexDirection: 'column', padding: '0.75rem 1rem', background: 'white', border: item.note.includes('AI:') ? '1px solid #8B5CF6' : '1px solid #E2E8F0', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: '25px', textAlign: 'center', fontWeight: 700, color: '#94A3B8' }}>{index + 1}.</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.9rem' }}>{libItem.name}</div>
                  </div>
                  
                  <button 
                    onClick={() => handleUpdateItem(item.libraryItemId, 'isRequired', !item.isRequired)} 
                    style={{ padding: '0.2rem 0.5rem', border: 'none', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', background: item.isRequired ? '#DBEAFE' : '#E2E8F0', color: item.isRequired ? '#1E40AF' : '#64748B' }}
                  >
                    {item.isRequired ? '✅ Zorunlu' : '☑️ Opsiyonel'}
                  </button>

                  {isWeighted && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <label style={{ fontSize: '0.75rem', color: '#475569' }}>Ağırlık %</label>
                      <input type="number" min="0" max="100" className="ji-input" style={{ width: '60px', padding: '0.3rem', fontSize: '0.85rem' }} value={item.weight} onChange={e => handleUpdateItem(item.libraryItemId, 'weight', Number(e.target.value))} />
                    </div>
                  )}

                  <button className="ji-btn danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => handleRemoveItem(item.libraryItemId)}>X</button>
                </div>
                
                <div style={{ paddingLeft: '35px' }}>
                  <input 
                    type="text" 
                    className="ji-input" 
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.5rem', background: item.note.includes('AI:') ? '#F5F3FF' : '#F8FAFC', width: '100%', color: item.note.includes('AI:') ? '#6D28D9' : '#1E293B' }} 
                    placeholder="Şirkete özel (lokal) not ekle..." 
                    value={item.note || ''} 
                    onChange={e => handleUpdateItem(item.libraryItemId, 'note', e.target.value)}
                  />
                </div>
              </div>
            );
          })}
          {addedItems.length === 0 && <div style={{ fontSize: '0.8rem', color: '#94A3B8', textAlign: 'center', padding: '0.5rem' }}>Öğe eklenmedi.</div>}
        </div>
      </div>
    );
  };

  return (
    <div className="fade-in ji-container">
      <div className="glass-card ji-header" style={{ marginBottom: '1.5rem', borderLeftColor: '#8B5CF6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
             <h2>🏗️ Dinamik Rol Şablonu Üreticisi</h2>
             <p style={{ color: '#64748B', fontSize: '0.9rem', margin: '0.5rem 0 0' }}>
               Tüm veriler ayrı kategoriler halinde yönetilir. Ağırlıklı kategorilerin kendi içinde toplamı %100 olmak zorundadır.
             </p>
          </div>
          <button 
             className={`ji-btn ${isAiThinking ? 'disabled' : ''}`} 
             style={{ 
                background: isAiThinking ? '#CBD5E1' : 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', 
                color: 'white', border: 'none', padding: '0.75rem 1.5rem', fontSize: '0.95rem', boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.3)' 
             }}
             disabled={isAiThinking}
             onClick={handleAutoFillMatch}
          >
             {isAiThinking ? '✨ AI Şablonu Çıkarıyor...' : '✨ AI Asistan: Taslak Doldur'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '2rem' }}>
        
        {/* Sol Alan: Builder UI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h3 style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#1E293B' }}>Temel Profil Bilgileri</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Şablon Adı</label>
                <input className="ji-input" value={templateForm.name} onChange={e => setTemplateForm({...templateForm, name: e.target.value})} placeholder="Örn: Kıdemli Veri Mimarı" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>İş Ailesi</label>
                <select className="ji-input" value={templateForm.jobFamily} onChange={e => setTemplateForm({...templateForm, jobFamily: e.target.value})}>
                  <option value="">Seçiniz</option>
                  {jobFamilies.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>İş Fonksiyonu</label>
                <select className="ji-input" value={templateForm.jobFunction} onChange={e => setTemplateForm({...templateForm, jobFunction: e.target.value})}>
                  <option value="">Seçiniz</option>
                  {jobFunctions.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Seviye</label>
                <select className="ji-input" value={templateForm.level} onChange={e => setTemplateForm({...templateForm, level: e.target.value})}>
                  <option value="">Seçiniz</option>
                  {jobLevels.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Eğitim Gereksinimleri</label>
                <input className="ji-input" value={templateForm.education} onChange={e => setTemplateForm({...templateForm, education: e.target.value})} placeholder="Örn: Endüstri Mühendisliği Lisans" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Kıdem & Deneyim</label>
                <input className="ji-input" value={templateForm.experience} onChange={e => setTemplateForm({...templateForm, experience: e.target.value})} placeholder="Örn: 5+ yıl sektör tecrübesi" />
              </div>
            </div>

            {/* Dinamik Metadata Alanları */}
            {customFieldsRender.length > 0 && (
              <div style={{ paddingTop: '1.5rem', borderTop: '1px dashed #E2E8F0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <h4 style={{ margin: 0, color: '#4F46E5', fontSize: '0.9rem' }}>✨ Şirkete Özel Konfigürasyon</h4>
                </div>
                {customFieldsRender.map(field => (
                  <div key={field.id}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>{field.name} {field.isRequired && '*'}</label>
                    <input 
                      type={field.fieldType === 'NUMBER' ? 'number' : 'text'} 
                      className="ji-input" 
                      value={templateForm.customFields[field.id] || ''}
                      onChange={e => setTemplateForm({
                        ...templateForm, 
                        customFields: { ...templateForm.customFields, [field.id]: e.target.value }
                      })} 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <h2 style={{ fontSize: '1.2rem', color: '#1E293B', marginBottom: '0', marginTop: '1rem' }}>Sistem Modülleri (Ağırlıklı %100)</h2>
          {WEIGHTED_TYPES.map(g => renderGroup(g, true))}

          <h2 style={{ fontSize: '1.2rem', color: '#1E293B', marginBottom: '0', marginTop: '1rem' }}>Sistem Modülleri (Liste)</h2>
          {LIST_TYPES.map(g => renderGroup(g, false))}

        </div>

        {/* Sağ Alan: Rule Engine & Console */}
        <div className="ji-sidebar">
          <div className="glass-card" style={{ position: 'sticky', top: '2rem' }}>
            <h3 style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>🤖 Rule Engine Konsolu</h3>
            
            <div style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: validationResult.isValid ? '#10B981' : '#EF4444' }}></div>
                <strong>Durum: {validationResult.isValid ? 'Geçerli' : 'Hata Var'}</strong>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#1E293B', fontSize: '0.85rem' }}>Engine Metrikleri:</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8rem', color: '#64748B' }}>
                <li style={{ padding: '0.2rem 0' }}>• Toplam Seçili Kategori: {Array.from(new Set(templateForm.items.map(i => { const l=db.library.find(x=>x.id===i.libraryItemId); return l?l.type:''; }))).filter(x=>x).length}</li>
                <li style={{ padding: '0.2rem 0' }}>• Toplam Ağırlıklı Eklenen: {templateForm.items.filter(i => { const l=db.library.find(x=>x.id===i.libraryItemId); return l && WEIGHTED_TYPES.some(w=>w.id===l.type); }).length}</li>
                <li style={{ padding: '0.2rem 0' }}>• Opsiyonel Modüller: {templateForm.items.filter(i => !i.isRequired).length}</li>
              </ul>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {validationResult.errors.map((e, idx) => (
                <div key={idx} style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                  ❌ {e}
                </div>
              ))}
              {validationResult.warnings.map((w, idx) => (
                <div key={idx} style={{ background: '#FEF3C7', color: '#B45309', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                  ⚠️ {w}
                </div>
              ))}
              {validationResult.isValid && validationResult.warnings.length === 0 && (
                <div style={{ background: '#D1FAE5', color: '#065F46', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                  ✅ Kurallar ihlal edilmedi.
                </div>
              )}
            </div>

            <button 
               className="ji-btn primary" 
               style={{ width: '100%', background: validationResult.isValid ? '#4F46E5' : '#CBD5E1', cursor: validationResult.isValid ? 'pointer' : 'not-allowed' }}
               onClick={handleSave}
            >
              💾 Veritabanına Kaydet
            </button>
            {saveSuccess && <div style={{ color: '#10B981', fontSize: '0.8rem', textAlign: 'center', marginTop: '0.5rem' }}>✅ Başarıyla kaydedildi ve versiyon eklendi!</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
