import React, { useState } from 'react';
import { improvePerformanceFeedback } from '../utils/aiService';

export default function PerformanceEvaluationForm({ 
  evalTask, 
  jobAnalyses, 
  employees, 
  onBack,
  onSave
}) {
  const [activeTab, setActiveTab] = useState('tasks');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [formData, setFormData] = useState({
    tasks: {},
    competencies: {},
    skills: {},
    generalFeedback: '' // Kullanıcının istediği açık uçlu metin alanı
  });

  const { campaignBase, subjectName, subjectDepartment, myRole } = evalTask;
  
  // Job Analysis bulmaya çalış, yoksa generic fallback.
  // Gerçek senaryoda evalTask.subjectId üzerinden subject'in TitleId'sine gidilir,
  // oradan da jobAnalyses.find(ja => ja.titleId === subject.titleId) yapılır.
  const targetEmployee = employees.find(e => e.id === evalTask.subjectId);
  const targetJobAnalysis = jobAnalyses?.find(ja => ja.titleId === targetEmployee?.titleId);

  // Mock sorular (Kütüphane veya JobAnalysis'ten çektiğimizi varsayıyoruz)
  const taskQuestions = targetJobAnalysis?.tasks || [
     { id: 't1', text: 'Günlük operasyonel sorumluluklarını zamanında eksiksiz tamamlama' },
     { id: 't2', text: 'Stresli anlarda veya kriz durumlarında görevi aksatmama' }
  ];

  const compQuestions = targetJobAnalysis?.competencies || [
     { id: 'c1', text: 'Davranışsal: Ekip içi iletişim ve yardımlaşma' },
     { id: 'c2', text: 'Davranışsal: Problemlere karşı çözüm odaklı yaklaşım' }
  ];

  const skillQuestions = targetJobAnalysis?.skills || [
     { id: 's1', text: 'Sektörel ve teknik bilgiyi etkin kullanma' }
  ];

  const maxScore = parseInt(campaignBase.scale, 10); // 5, 10 veya 100

  const handleScoreChange = (category, qId, val) => {
    setFormData(prev => ({
      ...prev,
      [category]: { ...prev[category], [qId]: Number(val) }
    }));
  };

  const getRoleTitle = (role) => {
    if (role === 'self') return 'Kendinizi Değerlendiriyorsunuz';
    if (role === 'peer') return 'İş Arkadaşınızı Değerlendiriyorsunuz';
    if (role === 'manager') return 'Astınızı Değerlendiriyorsunuz';
    if (role === 'directReport') return 'Yöneticinizi Değerlendiriyorsunuz';
    return '';
  };

  const isFormComplete = () => {
     // Çok kaba bir validasyon: En azından genel bir geribildirim yazılmış mı?
     return formData.generalFeedback.length > 5;
  };

  const handleAIFeedback = async () => {
    if (formData.generalFeedback.length < 10) {
      alert("Lütfen önce taslak olarak birkaç kelime (en az 10 karakter) geribildirim yazın. AI bu taslağı profesyonelleştirecektir.");
      return;
    }
    try {
      setIsGeneratingAI(true);
      const improvedText = await improvePerformanceFeedback(formData.generalFeedback);
      setFormData(prev => ({ ...prev, generalFeedback: improvedText }));
    } catch(err) {
      alert("AI Hatası: " + err.message);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = () => {
     if (!isFormComplete()) {
       alert("Lütfen en azından bir 'Genel Geribildirim' ekibini doldurun.");
       return;
     }

     if (window.confirm("Bu değerlendirmeyi göndermek istediğinize emin misiniz? Gönderildikten sonra değiştirilemez.")) {
       if (onSave) {
          onSave(formData);
       } else {
          onBack(); // Listeye geri dön (Fallback)
       }
     }
  };

  const renderRatingInput = (category, qId) => {
     if (maxScore === 5 || maxScore === 10) {
        return (
          <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.5rem' }}>
             {Array.from({ length: maxScore }).map((_, i) => {
                const score = i + 1;
                const isSelected = formData[category][qId] === score;
                return (
                  <button 
                    key={score}
                    type="button"
                    onClick={() => handleScoreChange(category, qId, score)}
                    style={{ 
                      width: '35px', height: '35px', borderRadius: '50%', border: '1px solid #cbd5e1', 
                      background: isSelected ? '#3b82f6' : '#f8fafc',
                      color: isSelected ? '#fff' : '#64748b',
                      fontWeight: isSelected ? 'bold' : 'normal',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    {score}
                  </button>
                )
             })}
          </div>
        );
     } else {
        // 100 üzerinden değerlendirme
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
             <input 
               type="range" min="0" max="100" step="1"
               value={formData[category][qId] || 0}
               onChange={e => handleScoreChange(category, qId, e.target.value)}
               style={{ flex: 1 }}
             />
             <span style={{ fontWeight: 'bold', width: '40px', fontSize: '1.2rem', color: '#3b82f6' }}>{formData[category][qId] || 0}</span>
          </div>
        )
     }
  };

  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
       {/* HEADER */}
       <div style={{ background: '#1e293b', color: '#fff', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ display: 'inline-block', background: '#3b82f6', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>
               {getRoleTitle(myRole)}
            </span>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{subjectName}</h2>
            <p style={{ margin: '0.2rem 0 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>Departman: {subjectDepartment}</p>
          </div>
          <button onClick={onBack} style={{ background: 'transparent', border: '1px solid #64748b', color: '#cbd5e1', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>Geri Dön</button>
       </div>

       {/* KAMPANYA AĞIRLIK BİLGİSİ */}
       <div style={{ padding: '1rem 2rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '2rem', fontSize: '0.85rem' }}>
          <div><strong>Kampanya:</strong> {campaignBase.name}</div>
          <div><strong>Ağırlık Dağılımı:</strong> Görevler (%{campaignBase.contentWeights.tasks}) | Yetkinlikler (%{campaignBase.contentWeights.competencies}) | Beceriler (%{campaignBase.contentWeights.skills})</div>
          <div><strong>Skala:</strong> 1-{maxScore} Puan Sistemi</div>
       </div>

       <div style={{ display: 'flex', minHeight: '500px' }}>
          {/* SOL: SEKMELER */}
          <div style={{ width: '250px', background: '#fdfdfd', borderRight: '1px solid #e2e8f0', padding: '1.5rem 0' }}>
             {[
               { id: 'tasks', icon: '📋', label: 'Görev ve Hedefler', weight: campaignBase.contentWeights.tasks },
               { id: 'competencies', icon: '🧠', label: 'Davranışsal Yetkinlikler', weight: campaignBase.contentWeights.competencies },
               { id: 'skills', icon: '🛠️', label: 'Teknik Beceriler', weight: campaignBase.contentWeights.skills },
               { id: 'feedback', icon: '💬', label: 'Genel Geribildirim', weight: null }
             ].map(tab => (
                <div 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ 
                    padding: '1rem 1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem',
                    background: activeTab === tab.id ? '#eff6ff' : 'transparent',
                    borderRight: activeTab === tab.id ? '4px solid #3b82f6' : '4px solid transparent',
                    color: activeTab === tab.id ? '#1e3a8a' : '#475569',
                    fontWeight: activeTab === tab.id ? 600 : 400
                  }}
                >
                   <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
                   <div>
                     <span style={{ display: 'block' }}>{tab.label}</span>
                     {tab.weight !== null && <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Ağırlık: %{tab.weight}</span>}
                   </div>
                </div>
             ))}
          </div>

          {/* SAĞ: İÇERİK EKRANI */}
          <div style={{ flex: 1, padding: '2rem' }}>
             {activeTab === 'tasks' && (
                <div className="fade-in">
                   <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>Görevler ve Sorumluluk Hedefleri</h3>
                   {taskQuestions.map((q, idx) => (
                     <div key={q.id} style={{ marginBottom: '2rem', background: '#fff', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '8px' }}>
                        <div style={{ fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>{idx+1}. {q.text}</div>
                        {renderRatingInput('tasks', q.id)}
                     </div>
                   ))}
                </div>
             )}

             {activeTab === 'competencies' && (
                <div className="fade-in">
                   <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>Davranışsal Yetkinlik Değerlendirmesi</h3>
                   {compQuestions.map((q, idx) => (
                     <div key={q.id} style={{ marginBottom: '2rem', background: '#fff', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '8px' }}>
                        <div style={{ fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>{idx+1}. {q.text}</div>
                        {renderRatingInput('competencies', q.id)}
                     </div>
                   ))}
                </div>
             )}

             {activeTab === 'skills' && (
                <div className="fade-in">
                   <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>İşin Gerektirdiği Teknik Beceriler</h3>
                   {skillQuestions.map((q, idx) => (
                     <div key={q.id} style={{ marginBottom: '2rem', background: '#fff', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '8px' }}>
                        <div style={{ fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>{idx+1}. {q.text}</div>
                        {renderRatingInput('skills', q.id)}
                     </div>
                   ))}
                </div>
             )}

             {activeTab === 'feedback' && (
                <div className="fade-in">
                   <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>Gelişim ve Yapıcı Geribildirim <span style={{ color: '#ef4444' }}>*</span></h3>
                   
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                     <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                       Yıldız ve puanların ötesinde, {subjectName} için gördüğün gelişim alanlarını ve takdir ettiğin yönlerini açıkça belirt. Yazdıklarının {campaignBase.raterSettings[myRole]?.isAnonymous ? 'anonim olarak' : 'isminle beraber'} karşı tarafa raporlanacağını unutma.
                     </p>
                     <button 
                       onClick={handleAIFeedback}
                       disabled={isGeneratingAI}
                       style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', color: '#fff', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap', marginLeft: '1rem' }}
                     >
                       {isGeneratingAI ? '⏳ Düşünüyor...' : '✨ AI ile Profesyonelleştir'}
                     </button>
                   </div>
                   
                   <textarea
                     value={formData.generalFeedback}
                     onChange={e => setFormData({...formData, generalFeedback: e.target.value})}
                     placeholder="Örn: Projelere liderlik etme konusunda çok başarılısın. Ancak stresli anlarda iletişimi kesmemeni ve ekibi daha çok motive etmeni öneririm..."
                     style={{ width: '100%', minHeight: '200px', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical', fontSize: '0.95rem', fontFamily: 'inherit' }}
                   />

                   <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                      <button 
                         onClick={handleSubmit}
                         style={{ padding: '0.8rem 2rem', background: '#10b981', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)' }}
                      >
                         Değerlendirmeyi Gönder ✓
                      </button>
                   </div>
                </div>
             )}
          </div>
       </div>

    </div>
  );
}
