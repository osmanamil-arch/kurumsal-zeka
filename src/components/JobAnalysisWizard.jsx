import React, { useState, useEffect } from 'react';
import WizardStep2 from './WizardStep2';
import WizardStep3 from './WizardStep3';
import WizardStep4 from './WizardStep4';
import WizardStep5 from './WizardStep5';
import WizardStep6 from './WizardStep6';
import { generateJobAnalysisTaslak } from '../utils/aiService';

export default function JobAnalysisWizard({ 
  departments, titles, families, functions, levels, 
  respLib = [], taskLib = [], compLib = [], skillLib = [], knowLib = [], certLib = [],
  jobAnalyses, initialAnalysisId, wizardMode, 
  onClose, onSaveDraft 
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Form datası (Tüm 6 adımı taşıyacak merkezi state)
  const [formData, setFormData] = useState({
    id: '', 
    departmentId: '',
    titleId: '',
    jobFamilyId: '',
    jobFunctionId: '',
    jobLevelId: '',
    purpose: '',
    // Diğer adımların datası
    responsibilities: [],
    tasks: [],
    competencies: [],
    skills: [],
    knowledge: [],
    certifications: [],
    kpiDefinitions: [],
    workingConditions: [],
    // Versiyonlama ve Durum
    status: 'DRAFT',
    version: 1.0,
    previousVersionId: null,
    changeLog: ''
  });

  const [rejectionReason, setRejectionReason] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleAIFill = async () => {
    if (!formData.titleId) {
      setErrorMsg("Lütfen önce bir 'Ünvan / Pozisyon' seçin.");
      return;
    }
    const titleObj = titles.find(t => t.id === formData.titleId);
    if (!titleObj) return;

    try {
      setIsGeneratingAI(true);
      setErrorMsg('');
      const aiData = await generateJobAnalysisTaslak(titleObj.name);
      
      const aiResps = (aiData.responsibilities || []).map((r, i) => ({
        id: 'r_ai_' + Date.now() + '_' + i,
        title: r,
        sortOrder: i+1
      }));
      
      const aiTasks = aiResps.map((r) => ({
         id: 't_ai_' + Date.now() + '_' + r.id,
         refResponsibilityId: r.id,
         title: r.title + " süreçlerini yürütmek",
         sortOrder: 1
      }));

      setFormData(prev => ({
        ...prev,
        purpose: aiData.purpose || prev.purpose,
        responsibilities: aiResps,
        tasks: aiTasks,
        competencies: (aiData.competencies || []).map((c, i) => ({ id: 'c_ai_'+Date.now()+'_'+i, title: c, isCustomized: true, level: 3, sortOrder: i+1 })),
        skills: (aiData.skills || []).map((s, i) => ({ id: 's_ai_'+Date.now()+'_'+i, title: s, isCustomized: true, sortOrder: i+1 })),
        kpiDefinitions: (aiData.kpiDefinitions || []).map((k, i) => ({ id: 'k_ai_'+Date.now()+'_'+i, title: k, targetValue: '100', weight: 100/(aiData.kpiDefinitions.length || 1) }))
      }));
      
      alert("✨ AI taslağı başarıyla oluşturuldu! Tüm sekmeleri gezerek kontrol edebilirsiniz.");
    } catch (err) {
      setErrorMsg("AI hatası: " + err.message);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Mount (Açılış) esnasındaki mod analizi
  useEffect(() => {
    if (initialAnalysisId) {
      const existing = jobAnalyses.find(ja => ja.id === initialAnalysisId);
      if (existing) {
        if (wizardMode === 'revise') {
          // Rule 2 & 4: Revizyonda klonlama yapılır, versiyon artar.
          setFormData({
            ...existing,
            id: 'draft_' + Date.now().toString(), // Yeni ID
            status: 'DRAFT',
            version: existing.version + 1.0,
            previousVersionId: existing.id,
            changeLog: '' // Yeni bir değişiklik girmeli
          });
        } else {
          // 'edit_draft' veya düzenleme
          setFormData({ ...existing });
          
          // Rule 10: REJECTED bir analiz ise logda red sebebini çıkar
          if (existing.status === 'REJECTED') {
            setRejectionReason(existing.changeLog);
            // changeLog'u temizliyoruz ki kullanıcı yeni düzeltmesini yazsın
            setFormData(prev => ({ ...prev, changeLog: '' }));
          }
        }
      }
    } else {
      // Yepyeni bir create modu
      setFormData(prev => ({ ...prev, id: 'draft_' + Date.now().toString() }));
    }
  }, [initialAnalysisId, wizardMode, jobAnalyses]);


  // ------------------------------------
  // STEP 1 VALIDATION & LOGIC
  // ------------------------------------

  // Rule 1: Çakışma Kontrolü (Aynı pozisyon için açık DRAFT/REJECTED veya ACTIVE var mı?)
  const checkPositionConflict = (deptId, titId) => {
    if (!deptId || !titId) return null;
    
    // Yalnızca tamamen yeni kayıt oluştururken çakışma aranır. (Düzenlemede aranmaz).
    if (wizardMode === 'create') {
      const conflict = jobAnalyses.find(ja => 
        ja.departmentId === deptId && 
        ja.titleId === titId && 
        ja.status !== 'ARCHIVED'
      );
      if (conflict) {
        return `Bu pozisyon için ${conflict.version} versiyonunda (${conflict.status}) sistemde kayıt bulunuyor. Ekrandan çıkıp listeden 'Revize Et' veya 'Düzenlemeye Devam Et' seçeneklerini kullanın.`;
      }
    }
    return null;
  };

  const handleNextStep = () => {
    setErrorMsg('');
    
    if (currentStep === 1) {
      // Adım 1 Zorunlu Alan Kontrolü
      if (!formData.departmentId || !formData.titleId || !formData.jobFamilyId || !formData.jobFunctionId || !formData.jobLevelId || !formData.purpose) {
        setErrorMsg('Lütfen tüm zorunlu seçimleri ve iş amacı alanını doldurun.');
        return;
      }
      // Rule 1 Çakışma Testi
      const conflictErr = checkPositionConflict(formData.departmentId, formData.titleId);
      if (conflictErr) {
        setErrorMsg(conflictErr);
        return;
      }
      
      // AUTO CURATION (Faz 2: Veri Hamallığı Yerine Düzenleme Modu)
      if (wizardMode === 'create' && (formData.responsibilities || []).length === 0) {
        const preResps = respLib.filter(r => r.isActive && r.jobFamilyId === formData.jobFamilyId).map((r, idx) => ({
           id: 'pre_r_' + idx + '_' + Date.now().toString().substring(7),
           libraryId: r.id,
           title: r.title,
           description: r.description,
           isCustomized: false,
           sortOrder: idx + 1
        }));
        
        const preTasks = [];
        preResps.forEach(r => {
           const lTasks = taskLib.filter(t => t.isActive && t.responsibilityId === r.libraryId);
           lTasks.forEach((t, tIdx) => {
              preTasks.push({
                 id: 'pre_t_' + r.id + '_' + tIdx,
                 refResponsibilityId: r.id,
                 libraryId: t.id,
                 title: t.title,
                 criticality: t.criticality || 2,
                 isCustomized: false,
                 sortOrder: tIdx + 1
              });
           });
        });

        // Yetkinlik, beceri gibi kayıtları da otomatik kur (Eğer aile ile eşleşen var ise)
        const loadGeneric = (lib, pfx) => lib.filter(c => c.isActive && (!c.familyId || c.familyId === formData.jobFamilyId)).map((c, i) => ({
           id: `pre_${pfx}_${i}_${Date.now().toString().substring(7)}`,
           libraryId: c.id,
           linkedTestId: c.linkedTestId || null,
           title: c.title,
           isCustomized: false,
           sortOrder: i+1
        }));

        setFormData(prev => ({
           ...prev,
           responsibilities: preResps,
           tasks: preTasks,
           competencies: loadGeneric(compLib, 'comp'),
           skills: loadGeneric(skillLib, 'skill'),
           knowledge: loadGeneric(knowLib, 'know'),
           certifications: loadGeneric(certLib, 'cert')
        }));
      }
    } else if (currentStep === 2) {
      // Adım 2 Validasyon Kontrolü: 
      // 1. En az 1 responsibility.
      // 2. Her responsibility altına en az 1 task.
      const resps = formData.responsibilities || [];
      const tsks = formData.tasks || [];
      
      if (resps.length === 0) {
        setErrorMsg('Lütfen en az bir adet sorumluluk alanı belirleyin.');
        return;
      }
      for (const resp of resps) {
        const respTasks = tsks.filter(t => t.refResponsibilityId === resp.id);
        if (respTasks.length === 0) {
          setErrorMsg(`"${resp.title || 'İsimsiz Sorumluluk'}" başlıklı sorumluluğun altına en az bir adet görev eklemelisiniz.`);
          return;
        }
        for (const task of respTasks) {
          if (!task.title.trim()) {
            setErrorMsg(`"${resp.title}" altındaki görevlerden birinin metni boş bırakılmış. Lütfen doldurun veya boş görevi silin.`);
            return;
          }
        }
      }
    } else if (currentStep === 3) {
      // Adım 3 Validasyon
      // min 1 competency, 1 skill, 1 knowledge
      if ((formData.competencies || []).length === 0) {
        setErrorMsg('Lütfen en az 1 adet Davranışsal Yetkinlik ekleyin.');
        return;
      }
      if ((formData.skills || []).length === 0) {
        setErrorMsg('Lütfen en az 1 adet Teknik Beceri ekleyin.');
        return;
      }
      if ((formData.knowledge || []).length === 0) {
        setErrorMsg('Lütfen en az 1 adet Uzmanlık / Bilgi alanı ekleyin.');
        return;
      }
      
      // Boş kontrolü
      const checkEmpty = (arr, label) => {
        if ((arr || []).some(x => !x.title.trim())) {
           return `"${label}" sekmesinde boş bırakılmış kayıtlar var. Lütfen doldurun veya silin.`;
        }
        return null;
      };
      
      const errComp = checkEmpty(formData.competencies, 'Davranışsal Yetkinlik');
      if (errComp) { setErrorMsg(errComp); return; }
      
      const errSkill = checkEmpty(formData.skills, 'Teknik Beceri');
      if (errSkill) { setErrorMsg(errSkill); return; }
      
      const errKnow = checkEmpty(formData.knowledge, 'Bilgi Alanı');
      if (errKnow) { setErrorMsg(errKnow); return; }
      
      const errCert = checkEmpty(formData.certifications, 'Sertifika');
      if (errCert) { setErrorMsg(errCert); return; }
    } else if (currentStep === 4) {
      // Adım 4 Validasyon (KPI)
      const kpis = formData.kpiDefinitions || [];
      if (kpis.length > 0) {
        const totalWeight = kpis.reduce((sum, item) => sum + (Number(item.weight) || 0), 0);
        if (totalWeight !== 100) {
           setErrorMsg(`Girdiğiniz KPI ağırlıklarının toplamı %100 olmalıdır. Şu anki toplam: %${totalWeight}`);
           return;
        }
        if (kpis.some(k => !k.title.trim() || !k.targetValue.trim())) {
           setErrorMsg('Lütfen boş bırakılmış KPI Başlığı veya Hedef Değeri alanlarını doldurun.');
           return;
        }
      }
    } else if (currentStep === 5) {
      // Adım 5 Validasyon (Koşullar)
      const c = formData.workingConditions || {};
      if (!c.travelFrequency || !c.physicalEffort || !c.workEnvironment || !c.riskLevel || !c.workingHours) {
         setErrorMsg('Lütfen çalışma saatleri, özel notlar hariç diğer tüm fiziksel ortam ve koşul alanlarını doldurun.');
         return;
      }
    }

    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Rule 8 & 9: Çıkış ve Taslak Kayıt davranışları net olmalı
  const handleSaveAndExit = () => {
    // Validasyonu kapatıp ne varsa taslağa kaydederiz
    onSaveDraft(formData);
    onClose();
  };

  const handleSubmit = () => {
    // Son adımdayız, Müşteri Onayına gönder (IN_REVIEW).
    const finalData = {
      ...formData,
      status: 'IN_REVIEW',
      // version is already set based on mode
    };
    
    // Asıl save fonksiyonuna yolla (HumanResourcesModule'de listeye ekleyecek)
    onSaveDraft(finalData);
    onClose();
  };

  // UI Component Sizing
  const inputStyle = { width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', marginBottom: '1rem' };

  return (
    <div className="wizard-container" style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
      {/* HEADER */}
      <div style={{ background: '#1e293b', color: '#fff', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>
            {wizardMode === 'revise' ? '🔄 İş Analizi Revizyon Sihirbazı' : '✨ Yeni İş Analizi Sihirbazı'}
          </h2>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#cbd5e1' }}>
            {wizardMode === 'revise' ? `v${formData.version - 1} klonlandı. Düzenlenecek yeni versiyon: v${formData.version}` : 'Sıfırdan taslak oluşturuluyor'}
          </p>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', color: '#f87171', border: '1px solid #f87171', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>✖ Çıkış Yap</button>
      </div>

      {rejectionReason && (
        <div style={{ background: '#fef2f2', color: '#991b1b', padding: '1rem 1.5rem', borderBottom: '1px solid #fecaca' }}>
          <strong>⚠️ Müşteri Red Nedeni:</strong> {rejectionReason}
        </div>
      )}

      {/* BODY */}
      <div style={{ padding: '2rem' }}>
        {/* Adım 1: Sınıflandırma ve Çerçeve */}
        {currentStep === 1 && (
          <div className="wizard-step fade-in">
            <h3 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', color: '#0f172a' }}>Adım 1: Pozisyon & Çerçeve Tanımı</h3>
            
            {errorMsg && (
              <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '1.5rem', borderLeft: '4px solid #ef4444' }}>
                {errorMsg}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* Sol Kolon: Giyilen Gömlekler (Pozisyon) */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Departman *</label>
                <select value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})} style={inputStyle} disabled={wizardMode !== 'create'}>
                  <option value="">Seçiniz...</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>

                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Ünvan / Pozisyon *</label>
                <select value={formData.titleId} onChange={e => setFormData({...formData, titleId: e.target.value})} style={inputStyle} disabled={wizardMode !== 'create'}>
                  <option value="">Seçiniz...</option>
                  {titles.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                
                {wizardMode !== 'create' && <p style={{fontSize: '0.75rem', color: '#64748b', marginTop: '-0.5rem'}}>Revizyon işlemlerinde hedef pozisyon değiştirilemez.</p>}
              </div>

              {/* Sağ Kolon: Sınıflandırma */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>İş Ailesi *</label>
                <select value={formData.jobFamilyId} onChange={e => setFormData({...formData, jobFamilyId: e.target.value, jobFunctionId: ''})} style={inputStyle}>
                  <option value="">Seçiniz...</option>
                  {families.filter(f => f.isActive).map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>

                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>İş Fonksiyonu *</label>
                <select value={formData.jobFunctionId} onChange={e => setFormData({...formData, jobFunctionId: e.target.value})} style={inputStyle} disabled={!formData.jobFamilyId}>
                  <option value="">{formData.jobFamilyId ? 'Seçiniz...' : 'Önce İş Ailesi Seçin'}</option>
                  {functions.filter(fn => fn.isActive && fn.familyId === formData.jobFamilyId).map(fn => <option key={fn.id} value={fn.id}>{fn.name}</option>)}
                </select>

                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>İş Seviyesi *</label>
                <select value={formData.jobLevelId} onChange={e => setFormData({...formData, jobLevelId: e.target.value})} style={inputStyle}>
                  <option value="">Seçiniz...</option>
                  {[...levels].filter(l => l.isActive).sort((a,b) => a.level - b.level).map(l => <option key={l.id} value={l.id}>{l.name} - (Ağırlık: {l.level})</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ display: 'block', fontWeight: 600, margin: 0 }}>Pozisyonun Organizasyondaki Amacı *</label>
                <button 
                  onClick={handleAIFill} 
                  disabled={isGeneratingAI || !formData.titleId}
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', color: '#fff', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                >
                  {isGeneratingAI ? '⏳ AI Düşünüyor...' : '✨ Tüm Taslağı AI ile Doldur'}
                </button>
              </div>
              <textarea 
                value={formData.purpose} 
                onChange={e => setFormData({...formData, purpose: e.target.value})} 
                placeholder="Bu pozisyon, organizasyonda hangi temel boşluğu doldurur? (Özet cümle)"
                style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
              />
            </div>
          </div>
        )}

        {/* Adım 2: Sorumluluklar ve Görevler */}
        {currentStep === 2 && (
          <>
            {errorMsg && (
              <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '1.5rem', borderLeft: '4px solid #ef4444' }}>
                {errorMsg}
              </div>
            )}
            <WizardStep2 
              formData={formData} 
              setFormData={setFormData} 
              respLib={respLib} 
              taskLib={taskLib} 
              setErrorMsg={setErrorMsg} 
            />
          </>
        )}

        {/* Adım 3: Yeterlilikler ve Nitelikler */}
        {currentStep === 3 && (
          <>
            {errorMsg && (
              <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '1.5rem', borderLeft: '4px solid #ef4444' }}>
                {errorMsg}
              </div>
            )}
            <WizardStep3 
              formData={formData} 
              setFormData={setFormData} 
              compLib={compLib}
              skillLib={skillLib}
              knowLib={knowLib}
              certLib={certLib}
              setErrorMsg={setErrorMsg} 
            />
          </>
        )}

        {/* Adım 4: KPI */}
        {currentStep === 4 && (
          <>
            {errorMsg && (
              <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '1.5rem', borderLeft: '4px solid #ef4444' }}>
                {errorMsg}
              </div>
            )}
            <WizardStep4 formData={formData} setFormData={setFormData} />
          </>
        )}

        {/* Adım 5: Koşullar */}
        {currentStep === 5 && (
          <>
            {errorMsg && (
              <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '1.5rem', borderLeft: '4px solid #ef4444' }}>
                {errorMsg}
              </div>
            )}
            <WizardStep5 formData={formData} setFormData={setFormData} />
          </>
        )}

        {/* Adım 6: Önizleme */}
        {currentStep === 6 && (
           <WizardStep6 
              formData={formData} 
              departments={departments}
              titles={titles}
              families={families}
              functions={functions}
              levels={levels}
           />
        )}
      </div>

      {/* FOOTER ACTION BAR */}
      <div style={{ background: '#f8fafc', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0' }}>
        <div>
           {currentStep > 1 && (
             <button onClick={handlePrevStep} style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' }}>⬅ Geri</button>
           )}
           {/* Rule 8: Taslak Kaydet davranışının her ekranda bulunması */}
           <button onClick={handleSaveAndExit} style={{ background: '#fef08a', color: '#854d0e', border: '1px solid #fde047', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
             💾 İlerlemeyi DRAFT Olarak Kaydet & Çık
           </button>
        </div>

        <div>
           {currentStep < 6 ? (
             <button onClick={handleNextStep} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '0.5rem 2rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Sonraki Adım ➡</button>
           ) : (
             <button onClick={handleSubmit} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '0.5rem 2rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Müşteri Onayına Gönder</button>
           )}
        </div>
      </div>
    </div>
  )
}
