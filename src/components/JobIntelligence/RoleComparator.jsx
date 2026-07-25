import React, { useState } from 'react';
import { useMetadataStorage } from '../../hooks/useMetadataStorage';
import './JI_Styles.css';

export default function RoleComparator() {
  const db = useMetadataStorage();
  
  const [leftId, setLeftId] = useState('');
  const [rightId, setRightId] = useState('');

  // Sadece şablonları kıyasla (veya analizleri)
  const templates = db.roleTemplates || [];

  const leftTemplate = templates.find(t => t.id === leftId);
  const rightTemplate = templates.find(t => t.id === rightId);

  // Kıyaslama algoritması (Eksik Yetkinlik vb.)
  const analyzeDiff = () => {
    if (!leftTemplate || !rightTemplate) return null;

    const leftLibs = leftTemplate.items || [];
    const rightLibs = rightTemplate.items || [];

    const allLibIds = Array.from(new Set([...leftLibs.map(l => l.libraryItemId), ...rightLibs.map(r => r.libraryItemId)]));

    return allLibIds.map(libId => {
      const libData = db.library.find(l => l.id === libId);
      const leftItem = leftLibs.find(l => l.libraryItemId === libId);
      const rightItem = rightLibs.find(r => r.libraryItemId === libId);

      const leftWeight = leftItem ? leftItem.weight : 0;
      const rightWeight = rightItem ? rightItem.weight : 0;
      
      const diff = leftWeight - rightWeight; // positive means left has more, negative right has more.

      return {
        id: libId,
        name: libData?.name || 'Bilinmeyen Öğe',
        type: libData?.type || 'Bilinmeyen',
        leftWeight,
        rightWeight,
        diff
      };
    });
  };

  const diffResult = analyzeDiff();

  return (
    <div className="fade-in ji-container">
      <div className="glass-card ji-header" style={{ marginBottom: '1.5rem', borderLeftColor: '#8B5CF6' }}>
        <h2>⚖️ Rol (Şablon) Karşılaştırma Analizi</h2>
        <p style={{ color: '#64748B', fontSize: '0.9rem', margin: '0.5rem 0 0' }}>
          İki farklı şablonu veya seviyeyi yan yana koyarak beklenen yetkinlik / görev farklılıklarını (Gap Analysis) raporlayın.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
         <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ margin: '0 0 1rem 0' }}>Sol Profil (A)</h4>
            <select className="ji-input" value={leftId} onChange={e => setLeftId(e.target.value)}>
               <option value="">Seçiniz...</option>
               {templates.map(t => <option key={t.id} value={t.id}>{t.name} (v{t.version}) - {t.level}</option>)}
            </select>
         </div>
         <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ margin: '0 0 1rem 0' }}>Sağ Profil (B)</h4>
            <select className="ji-input" value={rightId} onChange={e => setRightId(e.target.value)}>
               <option value="">Seçiniz...</option>
               {templates.map(t => <option key={t.id} value={t.id}>{t.name} (v{t.version}) - {t.level}</option>)}
            </select>
         </div>
      </div>

      {diffResult && (
         <div className="glass-card fade-in" style={{ padding: '2rem' }}>
           <h3 style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Fark Analizi (Gap & Diff)</h3>
           
           <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 2fr', gap: '1rem', fontWeight: 700, color: '#475569', borderBottom: '2px solid #CBD5E1', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
             <div>Kütüphane Kaydı</div>
             <div style={{ textAlign: 'center', color: '#4F46E5' }}>{leftTemplate.name}</div>
             <div style={{ textAlign: 'center', color: '#D97706' }}>{rightTemplate.name}</div>
             <div>Fark (Diff) Gözlemi</div>
           </div>

           {diffResult.map(res => {
             const isAddedOnLeft = res.rightWeight === 0 && res.leftWeight > 0;
             const isAddedOnRight = res.leftWeight === 0 && res.rightWeight > 0;
             
             return (
               <div key={res.id} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 2fr', gap: '1rem', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #F1F5F9' }}>
                 <div>
                   <div style={{ fontWeight: 600, color: '#1E293B' }}>{res.name}</div>
                   <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{res.type}</div>
                 </div>
                 <div style={{ textAlign: 'center', fontWeight: res.leftWeight > 0 ? 600 : 400, color: res.leftWeight > 0 ? '#1E293B' : '#CBD5E1' }}>
                    %{res.leftWeight}
                 </div>
                 <div style={{ textAlign: 'center', fontWeight: res.rightWeight > 0 ? 600 : 400, color: res.rightWeight > 0 ? '#1E293B' : '#CBD5E1' }}>
                    %{res.rightWeight}
                 </div>
                 <div style={{ fontSize: '0.85rem' }}>
                    {isAddedOnLeft && <span style={{ color: '#4F46E5', fontWeight: 600 }}>Sadece A'ya özel kalifiye</span>}
                    {isAddedOnRight && <span style={{ color: '#D97706', fontWeight: 600 }}>Sadece B'ye özel kalifiye</span>}
                    {!isAddedOnLeft && !isAddedOnRight && res.diff > 0 && <span style={{ color: '#4F46E5'}}>A profili için %+{(res.diff)} daha kritik</span>}
                    {!isAddedOnLeft && !isAddedOnRight && res.diff < 0 && <span style={{ color: '#D97706'}}>B profili için %+{(Math.abs(res.diff))} daha kritik</span>}
                    {!isAddedOnLeft && !isAddedOnRight && res.diff === 0 && <span style={{ color: '#10B981'}}>Eşit Ağırlıkta (=)</span>}
                 </div>
               </div>
             )
           })}

           {diffResult.length === 0 && (
             <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                Kıyaslanacak hiçbir ortak veya farklı öğe bulunamadı.
             </div>
           )}
         </div>
      )}
      
      {!diffResult && (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8', border: '2px dashed #E2E8F0', borderRadius: '12px' }}>
          Analizi çalıştırmak için yukarıdan iki farklı şablon seçin.
        </div>
      )}

    </div>
  );
}
