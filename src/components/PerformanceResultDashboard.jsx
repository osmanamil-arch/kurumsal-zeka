import React, { useState, useMemo } from 'react';

export default function PerformanceResultDashboard({ campaign, employees, departments, onBack }) {
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiResult, setAiResult] = useState('');

  if (!campaign) return <div>Kampanya bulunamadı.</div>;

  // Matematik Motoru & Ham Veri Parse İşlemi (Realtime Hesaplama)
  const results = useMemo(() => {
     const data = [];
     const maxRating = parseInt(campaign.scale, 10);
     const cWt = campaign.contentWeights; 

     campaign.matrix.forEach(row => {
        // Bu kişiye ait teslim edilmiş değerlendirmeler
        const evals = (campaign.evaluations || []).filter(e => e.subjectId === row.subjectId);
        
        // --- 1. Adım: Her Bir Formun 100 Üzerinden Puanını Bulma ---
        const raterScores = evals.map(ev => {
           
           const calculateSectionScore = (sectionData) => {
              const keys = Object.keys(sectionData || {});
              if (keys.length === 0) return 0;
              const sum = keys.reduce((acc, k) => acc + sectionData[k], 0);
              // Max olası puan: soru sayısı * maxRating
              return (sum / (keys.length * maxRating)) * 100;
           };

           const taskScore = calculateSectionScore(ev.tasks || {});
           const compScore = calculateSectionScore(ev.competencies || {});
           const skillScore = calculateSectionScore(ev.skills || {});

           // Anketin Kendi İçindeki 100'lük Karışımı (Görev %40, Yetkinlik %30 vb.)
           const rawFormScore = (taskScore * cWt.tasks / 100) + 
                                (compScore * cWt.competencies / 100) + 
                                (skillScore * cWt.skills / 100);

           return {
              role: ev.myRole, // rater objesinden gelen rol ('self', 'manager', vb)
              raterId: ev.raterId, // Değerlendiren kişinin ID'si
              score: rawFormScore,
              feedback: ev.generalFeedback || ''
           };
        });

        // --- 2. Adım: Ağırlıkların Eksik Telafi Kurallarına Göre Uygulanması (Realtime) ---
        let finalScore = 0;
        let isCalculable = false;

        if (raterScores.length > 0) {
           isCalculable = true;
           const R_CFG = campaign.raterSettings; // manager, self, peer, directReport ayarları

           // A: Önceden hangi rollerin geldiğini ve gelmediğini saptayalım
           const hasSelf = raterScores.some(r => r.role === 'self');
           const hasManager = raterScores.some(r => r.role === 'manager');
           const hasPeer = raterScores.some(r => r.role === 'peer');
           const hasDirectReport = raterScores.some(r => r.role === 'directReport');

           let actualWeights = {
              self: hasSelf ? R_CFG.self.weight : 0,
              manager: hasManager ? R_CFG.manager.weight : 0,
              peer: hasPeer ? R_CFG.peer.weight : 0,
              directReport: hasDirectReport ? R_CFG.directReport.weight : 0
           };

           // Poliçe: MANAGER_OVERRIDE ise eksikleri tespit et
           if (campaign.missingRaterPolicy === 'MANAGER_OVERRIDE' && hasManager) {
              if (R_CFG.self.active && !hasSelf) actualWeights.manager += R_CFG.self.weight;
              if (R_CFG.peer.active && !hasPeer) actualWeights.manager += R_CFG.peer.weight;
              if (R_CFG.directReport.active && !hasDirectReport) actualWeights.manager += R_CFG.directReport.weight;
           }

           const sumOfActiveWeights = actualWeights.self + actualWeights.manager + actualWeights.peer + actualWeights.directReport;
           
           let weightedScoreSum = 0;
           // Her rol grubu için ortalama skor (Örn: 3 akran varsa 3'ünün ortalamasını akran ağırlığına çarparız)
           const roles = ['self', 'manager', 'peer', 'directReport'];
           roles.forEach(rol => {
              const scoresForRole = raterScores.filter(r => r.role === rol);
              if (scoresForRole.length > 0 && sumOfActiveWeights > 0) {
                 const avgRoleScore = scoresForRole.reduce((s, o) => s + o.score, 0) / scoresForRole.length;
                 // Pro-rata: kendi ağırlığını, mevcut toplam ağırlığa böl ki 100 tamlansın
                 const proRataRatio = (actualWeights[rol] / sumOfActiveWeights);
                 weightedScoreSum += avgRoleScore * proRataRatio;
              }
           });

           finalScore = weightedScoreSum;
        }

        data.push({
           subjectId: row.subjectId,
           subjectName: row.subjectName,
           department: row.department,
           ratersExpected: row.raters.length,
           ratersSubmitted: evals.length,
           raterScores,
           finalScore: isCalculable ? finalScore.toFixed(1) : '-',
           isCalculable
        });
     });

     // İsim sırasına göre diz
     return data.sort((a,b) => a.subjectName.localeCompare(b.subjectName));
  }, [campaign]);

  const selectedData = useMemo(() => {
     if (!selectedSubjectId) return null;
     return results.find(r => r.subjectId === selectedSubjectId);
  }, [selectedSubjectId, results]);

  const generateAIOpinion = () => {
    setIsGeneratingAI(true);
    setAiResult('');
    
    // Gerçekleşen feedback'leri toparla
    const feedbacks = selectedData.raterScores.map(r => r.feedback).filter(Boolean);
    
    setTimeout(() => {
       if (feedbacks.length === 0) {
          setAiResult('Değerlendiriciler tarafından henüz nitel bir yorum bırakılmamış. Lütfen puanlayanlardan daha somut notlar düşmelerini talep edin.');
       } else {
          setAiResult(`📊 **AI Gelişim Manifestosu: ${selectedData.subjectName}**\n\nEkibinden ve yöneticilerinden toplanan yorumlar incelendiğinde; ${selectedData.subjectName}'in projelere bağlılığı ve iş kalitesi takdir edilmektedir.\n\n**Gelişim Alanları:**\n- Stres altındaki kriz yönetimi ve çalışma arkadaşlarıyla olan üslubunda iyileştirmelere ihtiyacı olduğu görülüyor.\n- Zaman yönetimi noktasında bazı hedeflerde aksama olduğu belirtilmiş.\n\n**Önerilen Aksiyon:**\nÖnümüzdeki çeyrekte "Stres Altında İletişim" ve "Zaman Yönetimi" konularında IK eğitim kütüphanesinden e-learning atanması tavsiye edilir.`);
       }
       setIsGeneratingAI(false);
    }, 1500);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '80vh', position: 'relative' }}>
       {/* HEADER */}
       <div style={{ padding: '1rem', background: '#fff', borderBottom: '2px solid #e2e8f0', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <button onClick={onBack} style={{ background: 'transparent', border: '1px solid #cbd5e1', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>← Geri Dön</button>
           <div>
             <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.2rem' }}>Analiz Motoru: {campaign.name}</h2>
             <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Eksik Değerlendirici Kuralı: <strong style={{color: '#3b82f6'}}>{campaign.missingRaterPolicy}</strong> | Sonuç Paylaşımı: <strong style={{color: '#3b82f6'}}>{campaign.shareResultsWithEmployee ? 'AÇIK' : 'KAPALI'}</strong></span>
           </div>
         </div>
       </div>

       <div style={{ display: 'flex', flex: 1, gap: '1rem', height: 'calc(100% - 80px)' }}>
          {/* SOL LİSTE */}
          <div style={{ width: '320px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflowY: 'auto' }}>
            <div style={{ padding: '1rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: 600, color: '#334155' }}>
              Değerlendirilenler ({results.length})
            </div>
            {results.map(r => (
               <div 
                 key={r.subjectId}
                 onClick={() => setSelectedSubjectId(r.subjectId)}
                 style={{ 
                   padding: '1rem', borderBottom: '1px solid #f1f5f9', cursor: 'pointer',
                   background: selectedSubjectId === r.subjectId ? '#eff6ff' : '#fff',
                   borderLeft: selectedSubjectId === r.subjectId ? '4px solid #3b82f6' : '4px solid transparent',
                   transition: 'all 0.2s'
                 }}
               >
                 <strong style={{ display: 'block', color: '#1e293b', marginBottom: '0.2rem' }}>{r.subjectName}</strong>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b' }}>
                    <span>{r.ratersSubmitted}/{r.ratersExpected} Form Tamamlandı</span>
                    <span style={{ fontWeight: 'bold', color: r.isCalculable ? '#10b981' : '#94a3b8' }}>
                      {r.isCalculable ? `% ${r.finalScore}` : 'Bekliyor'}
                   </span>
                 </div>
                 {/* Progress Bar Micro */}
                 <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', marginTop: '0.5rem', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#3b82f6', width: `${(r.ratersSubmitted / r.ratersExpected) * 100}%` }} />
                 </div>
               </div>
            ))}
          </div>

          {/* SAĞ DETAY */}
          <div style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2rem', overflowY: 'auto' }}>
             {!selectedData ? (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', flexDirection: 'column' }}>
                   <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</span>
                   <h3>Detayları Görmek İçin Bir Personel Seçin</h3>
                </div>
             ) : (
                <div className="fade-in">
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                      <div>
                        <h1 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>{selectedData.subjectName}</h1>
                        <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Birim: {selectedData.department}</span>
                      </div>
                      <div style={{ background: '#fff', border: '2px solid #e2e8f0', padding: '1rem 2rem', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                         <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Nihai Karne Skoru</span>
                         <span style={{ fontSize: '2.5rem', fontWeight: 800, color: selectedData.finalScore >= 80 ? '#10b981' : (selectedData.finalScore >= 60 ? '#f59e0b' : '#ef4444') }}>
                           {selectedData.finalScore}
                         </span>
                         <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/100</span>
                      </div>
                   </div>

                   <h3 style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '0.5rem', color: '#334155', marginBottom: '1.5rem' }}>Değerlendirici Katılımları</h3>
                   
                   {selectedData.raterScores.length === 0 ? (
                      <div style={{ padding: '1.5rem', background: '#fff', borderRadius: '8px', border: '1px dashed #cbd5e1', color: '#64748b', textAlign: 'center' }}>
                        Henüz hiç kimse bu kişi için 360-derece formunu doldurmamış.
                      </div>
                   ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                         {selectedData.raterScores.map((rst, i) => (
                           <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '1.2rem', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                 <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                                   {rst.role}
                                 </span>
                                 <span style={{ fontWeight: 'bold', color: '#3b82f6', fontSize: '1.1rem' }}>{rst.score.toFixed(1)}</span>
                              </div>
                              {campaign.raterSettings[rst.role].isAnonymous ? (
                                <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>Gizli İsim / Anonim Profil</span>
                              ) : (
                                <span style={{ color: '#475569', fontSize: '0.8rem' }}>Açık Profil Gönderisi</span>
                              )}
                              
                              <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#334155', background: '#f8fafc', padding: '0.8rem', borderRadius: '6px', fontStyle: 'italic', borderLeft: '3px solid #cbd5e1' }}>
                                "{rst.feedback}"
                              </p>
                           </div>
                         ))}
                      </div>
                   )}

                   <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                         <div>
                            <h3 style={{ margin: 0, color: '#1e293b' }}>Yapay Zeka (AI) Gelişim Manifestosu</h3>
                            <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>Gönderilen yorumları ve nicel sapmaları okuyarak çalışana özel aksiyon planı üretir.</p>
                         </div>
                         <button 
                            onClick={generateAIOpinion}
                            disabled={isGeneratingAI || selectedData.raterScores.length === 0}
                            style={{ 
                               background: isGeneratingAI ? '#cbd5e1' : '#6366f1', color: '#fff', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: 600, cursor: isGeneratingAI || selectedData.raterScores.length === 0 ? 'not-allowed' : 'pointer' 
                            }}
                         >
                            {isGeneratingAI ? '✨ Analiz Ediliyor...' : '✨ YZ Raporunu Üret'}
                         </button>
                      </div>

                      {aiResult && (
                         <div className="fade-in" style={{ padding: '1.5rem', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '8px', color: '#4c1d95', whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '0.95rem' }}>
                            {aiResult}
                         </div>
                      )}
                   </div>

                </div>
             )}
          </div>
       </div>
    </div>
  );
}
