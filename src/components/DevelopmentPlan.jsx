import React, { useState } from 'react';

export default function DevelopmentPlan({ plans, setPlans, employees, userRole, catalog }) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiResult, setAiResult] = useState('');

  // Sadece yöneticinin kendi altındakiler veya admin için tümü
  const visibleEmployees = employees.filter(e => {
    if (userRole === 'superadmin' || userRole === 'danisman') return true;
    // Mock user e1 (Genel Müdür) ise altındakileri görür
    // Gerçekte login olan kullanıcının ID'sine göre filtrelenir
    return e.managerId === 'e1' || e.id === 'e1'; 
  });

  const selectedPlan = plans.find(p => p.employeeId === selectedEmployeeId);
  const selectedEmployee = employees.find(e => e.id === selectedEmployeeId);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'HIGH': return '#ef4444';
      case 'MEDIUM': return '#f59e0b';
      case 'LOW': return '#3b82f6';
      default: return '#64748b';
    }
  };

  const getSourceIcon = (source) => {
    switch(source) {
      case 'performance': return '📈';
      case 'gap_analysis': return '⚖️';
      case 'psychometric': return '🧠';
      default: return '✍️';
    }
  };

  const generateAIOpinion = () => {
    setIsGeneratingAI(true);
    setAiResult('');
    
    setTimeout(() => {
       setAiResult(`🤖 **AI Gelişim Analizi - ${selectedEmployee?.name || 'Çalışan'}**\n\n- **Performans Sinyali:** Son 360 değerlendirmesinde "Stres Yönetimi" boyutu şirket ortalamasının altında kaldı.\n- **İş Analizi Boşluğu:** Satış Uzmanı rolü için beklenen "B2B İkna" yetkinliğinde %20'lik gelişim alanı tespit edildi.\n\n**Önerilen Aksiyonlar:**\n1. "Stres Altında Kriz Yönetimi" e-learning modülü (Kısa Vade)\n2. "B2B Satış Teknikleri" sınıf eğitimi (Orta Vade)\n\n*Bu plan taslağını tek tıkla IDP'ye ekleyebilirsiniz.*`);
       setIsGeneratingAI(false);
    }, 1500);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', gap: '2rem', height: '100%' }}>
      {/* SOL: Çalışan Seçimi */}
      <div style={{ width: '300px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <h4 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>Çalışan Seçimi</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
          {visibleEmployees.map(emp => {
            const hasPlan = plans.some(p => p.employeeId === emp.id);
            return (
              <button
                key={emp.id}
                onClick={() => { setSelectedEmployeeId(emp.id); setAiResult(''); }}
                style={{
                  padding: '0.8rem', textAlign: 'left', background: selectedEmployeeId === emp.id ? '#eff6ff' : '#f8fafc',
                  border: `1px solid ${selectedEmployeeId === emp.id ? '#3b82f6' : '#e2e8f0'}`, borderRadius: '8px', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>{emp.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{emp.title}</div>
                </div>
                {hasPlan ? <span style={{ color: '#10b981', fontSize: '0.8rem' }}>●</span> : <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>○</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* SAĞ: Plan Detayı */}
      <div style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2rem', overflowY: 'auto' }}>
        {!selectedEmployee ? (
           <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', flexDirection: 'column' }}>
              <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</span>
              <h3>Gelişim planını görmek için soldan bir çalışan seçin</h3>
           </div>
        ) : (
          <div className="fade-in">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>{selectedEmployee.name} - Bireysel Gelişim Planı (IDP)</h2>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{selectedEmployee.department} | {selectedEmployee.title}</span>
                </div>
                <button style={{ padding: '0.6rem 1.2rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                  + Yeni Hedef Ekle
                </button>
             </div>

             {/* AI Öneri Motoru (Sadece Yöneticiler/Danışmanlar için) */}
             {(userRole === 'superadmin' || userRole === 'danisman') && (
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: aiResult ? '1rem' : 0 }}>
                      <div>
                         <h4 style={{ margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>🧠</span> AI Gelişim Öneri Motoru</h4>
                         <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>Performans, psikometri ve iş analizi gap verilerini sentezleyerek otomatik plan üretir.</p>
                      </div>
                      <button 
                         onClick={generateAIOpinion}
                         disabled={isGeneratingAI}
                         style={{ background: isGeneratingAI ? '#cbd5e1' : '#6366f1', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: 600, cursor: isGeneratingAI ? 'not-allowed' : 'pointer' }}
                      >
                         {isGeneratingAI ? 'Analiz Ediliyor...' : '✨ Sentezle ve Öner'}
                      </button>
                   </div>
                   {aiResult && (
                      <div className="fade-in" style={{ padding: '1rem', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '8px', color: '#4c1d95', whiteSpace: 'pre-wrap', lineHeight: '1.5', fontSize: '0.9rem' }}>
                         {aiResult}
                         <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                            <button style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>Plan Taslağını İçeri Aktar</button>
                         </div>
                      </div>
                   )}
                </div>
             )}

             {/* Mevcut Hedefler */}
             {!selectedPlan || selectedPlan.goals.length === 0 ? (
               <div style={{ padding: '3rem', background: '#fff', borderRadius: '8px', border: '1px dashed #cbd5e1', color: '#64748b', textAlign: 'center' }}>
                 Bu çalışan için henüz bir gelişim hedefi tanımlanmamış.
               </div>
             ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                 {selectedPlan.goals.map(goal => (
                   <div key={goal.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                         <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                               <span style={{ fontSize: '1.2rem' }} title="Tetikleyici Kaynak">{getSourceIcon(goal.source)}</span>
                               <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem' }}>{goal.title}</h3>
                            </div>
                            <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                               Kaynak: {goal.source.toUpperCase()}
                            </span>
                         </div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: getPriorityColor(goal.priority), fontWeight: 'bold', fontSize: '0.85rem' }}>
                               {goal.priority === 'HIGH' ? 'YÜKSEK ÖNCELİK' : goal.priority === 'MEDIUM' ? 'ORTA ÖNCELİK' : 'DÜŞÜK ÖNCELİK'}
                            </span>
                            <span style={{ padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, 
                               background: goal.status === 'COMPLETED' ? '#dcfce7' : (goal.status === 'IN_PROGRESS' ? '#fef3c7' : '#f1f5f9'),
                               color: goal.status === 'COMPLETED' ? '#166534' : (goal.status === 'IN_PROGRESS' ? '#92400e' : '#475569')
                            }}>
                               {goal.status === 'COMPLETED' ? 'Tamamlandı' : (goal.status === 'IN_PROGRESS' ? 'Devam Ediyor' : 'Planlandı')}
                            </span>
                         </div>
                      </div>

                      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', borderLeft: '3px solid #cbd5e1' }}>
                         <strong style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.3rem' }}>Yönetici / IK Notu:</strong>
                         <p style={{ margin: 0, color: '#334155', fontSize: '0.9rem', fontStyle: 'italic' }}>"{goal.managerNote}"</p>
                      </div>

                      <div>
                         <strong style={{ display: 'block', fontSize: '0.85rem', color: '#1e293b', marginBottom: '0.5rem' }}>Bağlı Eğitimler:</strong>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {goal.trainings.map(tid => {
                               const tInfo = catalog.find(c => c.id === tid);
                               return tInfo ? (
                                  <div key={tid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                                     <span style={{ fontSize: '0.9rem', color: '#3b82f6', fontWeight: 500 }}>🎓 {tInfo.title}</span>
                                     <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{tInfo.format}</span>
                                  </div>
                               ) : null;
                            })}
                         </div>
                      </div>

                      {goal.completionEvidence && (
                         <div style={{ marginTop: '1rem', padding: '0.8rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', color: '#166534', fontSize: '0.85rem' }}>
                            <strong>Tamamlanma Notu:</strong> {goal.completionEvidence}
                         </div>
                      )}
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
