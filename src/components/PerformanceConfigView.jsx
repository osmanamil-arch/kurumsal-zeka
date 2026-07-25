import React, { useState, useEffect, useMemo } from 'react';

export default function PerformanceConfigView({ 
  employees = [], 
  departments = [], 
  titles = [], 
  jobAnalyses = [], 
  initialCampaignId, 
  existingCampaigns = [], 
  onSave, 
  onClose 
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Matrix edit inline states
  const [addRaterMenu, setAddRaterMenu] = useState({ subjectId: null, role: null });

  // Sadece taslak aşamasında default form.
  const [formData, setFormData] = useState({
    id: `camp_${Date.now()}`,
    name: '',
    periodStart: '',
    periodEnd: '',
    scale: '5', // 1-5, 1-10, 100
    status: 'DRAFT',
    
    // Step 1: Kapsam ve Filtreler
    filters: {
      departments: [],
      jobLevels: [],
      excludeNewbies: false, // Son 3 ayda başlayanları hariç tut
      excludeProbation: false, // Deneme süresinde olanları hariç tut
      excludeInactives: true, // Pasifleri çıkar
      exceptionGroups: [] // Opsiyonel, sadece 'Liderler' grubu vs
    },

    // Step 2: Formül 1 (Content Weights) Toplam 100 olmalı
    contentWeights: {
      tasks: 40,
      kpis: 30,
      competencies: 20,
      skills: 10
    },

    // Step 3: Formül 2 (Rater Settings) Toplam 100 olmalı
    raterSettings: {
      manager: { active: true, weight: 60, min: 1, max: 2, isAnonymous: false },
      self: { active: true, weight: 10, min: 1, max: 1, isAnonymous: false },
      peer: { active: true, weight: 15, min: 2, max: 4, isAnonymous: true },
      directReport: { active: true, weight: 15, min: 3, max: 5, isAnonymous: true }
    },
    missingRaterPolicy: 'PRO_RATA', // 'PRO_RATA' | 'MANAGER_OVERRIDE'
    shareResultsWithEmployee: false, // Çalışan sonuçlarını kendisi görebilsin mi?

    // Step 4: Değerlendirici Matrisi (OrgChart tabanlı öneriler + revizyonlar)
    matrix: []
  });

  useEffect(() => {
    if (initialCampaignId) {
      const camp = existingCampaigns.find(c => c.id === initialCampaignId);
      if (camp) setFormData(camp);
    }
  }, [initialCampaignId, existingCampaigns]);

  // Validations per step
  const handleNext = () => {
    setErrorMsg('');
    if (currentStep === 1) {
      if (!formData.name || !formData.periodStart || !formData.periodEnd) {
        setErrorMsg('Lütfen kampanya adını ve periyot tarihlerini seçiniz.');
        return;
      }
    }
    if (currentStep === 2) {
      const { tasks, kpis, competencies, skills } = formData.contentWeights;
      const total = Number(tasks) + Number(kpis) + Number(competencies) + Number(skills);
      if (total !== 100) {
        setErrorMsg(`İçerik ağırlıkları toplamı tam olarak %100 olmalıdır. Şu anki toplam: %${total}`);
        return;
      }
    }
    if (currentStep === 3) {
      let totalW = 0;
      Object.keys(formData.raterSettings).forEach(role => {
        if (formData.raterSettings[role].active) {
          totalW += Number(formData.raterSettings[role].weight);
        }
      });
      if (totalW !== 100) {
        setErrorMsg(`Değerlendirici rol ağırlıkları toplamı tam olarak %100 olmalıdır. Şu anki toplam: %${totalW}`);
        return;
      }
      
      // Matrisi Oto Yarat (Generate Suggested Matrix)
      generateAutoMatrix();
    }
    
    if (currentStep < 4) setCurrentStep(c => c + 1);
  };

  const handlePrev = () => {
    setErrorMsg('');
    if (currentStep > 1) setCurrentStep(c => c - 1);
  };

  const handleSaveDraft = () => {
    onSave({ ...formData, status: 'DRAFT', lastUpdatedAt: new Date().toISOString() });
  };

  const handleLaunchCampaign = () => {
    if (formData.matrix.length === 0) {
      setErrorMsg('Değerlendirici matrisiniz boş. Kampanya kimseye atanamadı!');
      return;
    }
    if (window.confirm('Kampanyayı yayına alırsanız 360-derece formlar matristeki kullanıcılara tahsis edilecektir. Onaylıyor musunuz?')) {
      onSave({ ...formData, status: 'ACTIVE', launchedAt: new Date().toISOString() });
    }
  };


  // ============================================
  // STEP 4: OTO-MATRİS ÜRETİM ALGORİTMASI (OrgChart Bazlı)
  // ============================================
  const generateAutoMatrix = () => {
    // Kurallar:
    // 1. Departman filtresi uygulanmış olan "Çalışanlar (Employees)" ana havuz olur.
    // 2. Kapsam dışı filtrelerine takılanlar listeye "Değerlendirilen" olarak girmez ama "Değerlendiren" olabilir.
    
    const suggestedMatrix = [];
    
    // (A) Hedef Kitle Filtreleme (Kaba)
    let targetEmployees = employees.filter(emp => {
      // 10. Hariç tutma kuralı
      // Not: Çalışan datasında isActive mock objelerde tanımlı değilse aktif kabul edilir. Sadece eksiksiz false ise pasiftir.
      if (formData.filters.excludeInactives && emp.isActive === false) return false;
      if (formData.filters.departments.length > 0 && !formData.filters.departments.includes(emp.departmentId)) return false;
      return true;
    });

    targetEmployees.forEach(emp => {
      // Değerlendiricileri bul
      let assignedRaters = [];
      
      // Self
      if (formData.raterSettings.self.active && formData.raterSettings.self.weight > 0) {
        assignedRaters.push({ role: 'self', employeeId: emp.id, name: `${emp.firstName || emp.name} ${emp.lastName || ''}`.trim() });
      }

      // Yönetici (Manager)
      if (formData.raterSettings.manager.active && formData.raterSettings.manager.weight > 0 && emp.managerId) {
        const mgr = employees.find(e => e.id === emp.managerId);
        if (mgr) assignedRaters.push({ role: 'manager', employeeId: mgr.id, name: `${mgr.firstName || mgr.name} ${mgr.lastName || ''}`.trim() });
      }

      // Ast (Direct Report)
      if (formData.raterSettings.directReport.active && formData.raterSettings.directReport.weight > 0) {
        const reports = employees.filter(e => e.managerId === emp.id && e.isActive !== false);
        reports.forEach(r => {
           assignedRaters.push({ role: 'directReport', employeeId: r.id, name: `${r.firstName || r.name} ${r.lastName || ''}`.trim() });
        });
      }

      // Akran (Peer)
      // Kural: "Aynı yöneticiye bağlı + Aynı/Yakın Level" (Bizim veride Title/Department üzerinden basitleştirelim)
      if (formData.raterSettings.peer.active && formData.raterSettings.peer.weight > 0 && emp.managerId) {
        // Aynı yöneticiye bağlı diğer aktif çalışanlar (Kendisi hariç)
        const peers = employees.filter(e => e.managerId === emp.managerId && e.id !== emp.id && e.isActive !== false);
        // Basitçe maksimum limite kadar alalım
        const maxPeers = formData.raterSettings.peer.max;
        peers.slice(0, maxPeers).forEach(p => {
           assignedRaters.push({ role: 'peer', employeeId: p.id, name: `${p.firstName || p.name} ${p.lastName || ''}`.trim() });
        });
      }

      suggestedMatrix.push({
        subjectId: emp.id,
        subjectName: `${emp.firstName || emp.name} ${emp.lastName || ''}`.trim(),
        department: departments.find(d => d.id === emp.departmentId)?.name || 'Bilinmiyor',
        raters: assignedRaters
      });
    });

    setFormData(prev => ({ ...prev, matrix: suggestedMatrix }));
  };

  const removeRaterFromMatrix = (subjectId, raterEmployeeId, role) => {
    setFormData(prev => ({
      ...prev,
      matrix: prev.matrix.map(row => 
        row.subjectId === subjectId 
          ? { ...row, raters: row.raters.filter(r => !(r.employeeId === raterEmployeeId && r.role === role)) }
          : row
      )
    }));
  };

  const addRaterToMatrix = (subjectId, role, newRaterId) => {
    if (!newRaterId) return;
    const raterEmp = employees.find(e => e.id === newRaterId);
    if (!raterEmp) return;

    setFormData(prev => ({
      ...prev,
      matrix: prev.matrix.map(row => {
        if (row.subjectId === subjectId) {
          // Check if already exists
          if (row.raters.some(r => r.employeeId === newRaterId && r.role === role)) return row;
          return {
            ...row,
            raters: [...row.raters, { role, employeeId: raterEmp.id, name: `${raterEmp.firstName || raterEmp.name} ${raterEmp.lastName || ''}`.trim() }]
          };
        }
        return row;
      })
    }));
    setAddRaterMenu({ subjectId: null, role: null }); // Close menu
  };

  // ============================================
  // RENDER HELPER COMPONENTS
  // ============================================
  const inputStyle = { width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' };
  const getSubTitle = () => {
    switch(currentStep) {
      case 1: return "1. Kampanya Kapsamı ve Filtreler";
      case 2: return "2. İçerik ve Ağırlık Dağılımı";
      case 3: return "3. 360 Değerlendirici Rolleri";
      case 4: return "4. Otonom Matris Onayı";
      default: return "";
    }
  };

  return (
    <div className="perf-config-wrapper fade-in" style={{ maxWidth: '1000px', margin: '0 auto', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
      
      {/* HEADER WIZARD BAR */}
      <div style={{ background: '#f8fafc', padding: '1.5rem', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Performans Konfigürasyon Sihirbazı</span>
            <h2 style={{ margin: '0.2rem 0 0 0', color: '#0f172a' }}>{getSubTitle()}</h2>
         </div>
         <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
      </div>

      <div style={{ display: 'flex' }}>
        {/* SOL: PROGRESS BAR */}
        <div style={{ width: '220px', padding: '2rem', borderRight: '1px solid #e2e8f0', background: '#fdfdfd' }}>
           {[
             { step: 1, label: 'Kapsam & Filtreler' },
             { step: 2, label: 'İçerik Ağırlıkları' },
             { step: 3, label: '360° Rol Kotaları' },
             { step: 4, label: 'Değerlendirici Matrisi' },
           ].map(s => (
             <div key={s.step} style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', opacity: currentStep >= s.step ? 1 : 0.4 }}>
               <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: currentStep === s.step ? '#3b82f6' : (currentStep > s.step ? '#10b981' : '#e2e8f0'), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '0.75rem' }}>
                 {currentStep > s.step ? '✓' : s.step}
               </div>
               <span style={{ fontWeight: currentStep === s.step ? 600 : 400, color: '#334155', fontSize: '0.9rem' }}>{s.label}</span>
             </div>
           ))}
        </div>

        {/* SAĞ: İÇERİK EKRANLARI */}
        <div style={{ flex: 1, padding: '2rem' }}>
          
          {errorMsg && (
             <div className="fade-in" style={{ padding: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '1.5rem', borderLeft: '4px solid #ef4444', fontSize: '0.9rem' }}>
               ⚠️ {errorMsg}
             </div>
          )}

          {/* STEP 1 */}
          {currentStep === 1 && (
             <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                   <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Kampanya / Dönem Adı</label>
                      <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} placeholder="Örn: 2026/Y1 Bölge Yöneticileri Değerlendirmesi" />
                   </div>
                   <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Başlangıç Tarihi</label>
                      <input type="date" value={formData.periodStart} onChange={e => setFormData({...formData, periodStart: e.target.value})} style={inputStyle} />
                   </div>
                   <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Bitiş Tarihi</label>
                      <input type="date" value={formData.periodEnd} onChange={e => setFormData({...formData, periodEnd: e.target.value})} style={inputStyle} />
                   </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                   <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                     <h4 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>Filtreler (Kapsam)</h4>
                     <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>Departman Filtresi (Boşsa Tüm Şirket)</label>
                     <select 
                       multiple 
                       style={{ ...inputStyle, minHeight: '120px' }} 
                       value={formData.filters.departments}
                       onChange={e => {
                         const vals = Array.from(e.target.selectedOptions, option => option.value);
                         setFormData(prev => ({ ...prev, filters: { ...prev.filters, departments: vals } }));
                       }}
                     >
                       {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                     </select>
                   </div>

                   <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                     <h4 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>Dışlama (Exclusion) Kuralları</h4>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: '#475569' }}>
                           <input type="checkbox" checked={formData.filters.excludeInactives} onChange={e => setFormData(p => ({...p, filters: {...p.filters, excludeInactives: e.target.checked}}))} />
                           Pasif durumdaki çalışanları hariç tut
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: '#475569' }}>
                           <input type="checkbox" checked={formData.filters.excludeProbation} onChange={e => setFormData(p => ({...p, filters: {...p.filters, excludeProbation: e.target.checked}}))} />
                           Deneme süresinde olanları hariç tut
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: '#475569' }}>
                           <input type="checkbox" checked={formData.filters.excludeNewbies} onChange={e => setFormData(p => ({...p, filters: {...p.filters, excludeNewbies: e.target.checked}}))} />
                           Son 3 ayda işe girenleri hariç tut
                        </label>
                     </div>
                     
                     <div style={{ marginTop: '1.5rem' }}>
                       <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>Puanlama Ölçeği (Score Scale)</label>
                       <select value={formData.scale} onChange={e => setFormData({...formData, scale: e.target.value})} style={inputStyle}>
                         <option value="5">1-5 Yıldız / Puan Skalası</option>
                         <option value="10">1-10 Puan Skalası</option>
                         <option value="100">100 Üzerinden % Yüzde Skalası</option>
                       </select>
                     </div>
                   </div>
                </div>
             </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
             <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <div style={{ background: '#f0f9ff', padding: '1.5rem', borderRadius: '8px', border: '1px dashed #7dd3fc' }}>
                 <strong style={{ color: '#0369a1' }}>Kural 2: İçerik Ağırlıkları.</strong> 
                 <p style={{ margin: '0.5rem 0 0 0', color: '#0c4a6e', fontSize: '0.9rem' }}>İş Analizinden çekilecek kalemlerin formun sonuç puanına etki oranlarını belirleyin. Toplam *kesinlikle* 100 olmalıdır.</p>
               </div>
               
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                 {[
                   { id: 'tasks', label: 'Görev ve Sorumluluk Hedefleri (%)', color: '#3b82f6' },
                   { id: 'kpis', label: 'Temel Performans KPI\'ları (%)', color: '#10b981' },
                   { id: 'competencies', label: 'Davranışsal Yetkinlikler (%)', color: '#8b5cf6' },
                   { id: 'skills', label: 'Teknik Beklentiler/Beceriler (%)', color: '#f59e0b' }
                 ].map(item => (
                   <div key={item.id} style={{ padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                     <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '1rem' }}>{item.label}</label>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                       <input 
                         type="range" 
                         min="0" max="100" step="5"
                         value={formData.contentWeights[item.id]} 
                         onChange={e => setFormData(p => ({...p, contentWeights: {...p.contentWeights, [item.id]: Number(e.target.value)}}))}
                         style={{ flex: 1, accentColor: item.color }}
                       />
                       <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: item.color, width: '40px', textAlign: 'center' }}>{formData.contentWeights[item.id]}</span>
                     </div>
                   </div>
                 ))}
               </div>

               <div style={{ padding: '1rem', background: '#334155', borderRadius: '8px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                 <span style={{ fontWeight: 600 }}>Form Ağırlığı Toplamı:</span>
                 <span style={{ fontSize: '1.5rem', fontWeight: 800, color: (formData.contentWeights.tasks + formData.contentWeights.kpis + formData.contentWeights.competencies + formData.contentWeights.skills) === 100 ? '#4ade80' : '#f87171' }}>
                    %{(formData.contentWeights.tasks + formData.contentWeights.kpis + formData.contentWeights.competencies + formData.contentWeights.skills)}
                 </span>
               </div>
             </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
             <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <div style={{ background: '#fdf4ff', padding: '1.5rem', borderRadius: '8px', border: '1px dashed #f5d0fe' }}>
                 <strong style={{ color: '#86198f' }}>Kural 4: Değerlendirici Rolleri ve Gizlilik.</strong> 
                 <p style={{ margin: '0.5rem 0 0 0', color: '#701a75', fontSize: '0.9rem' }}>Kimlerin bu süreçte rol alacağını ve sonuçlara yüzde kaç etki edeceğini yapılandırın. Ast ve Akran atamalarında minimum sayı ve anonimlik kuralları psikolojik güvenlik açısından kritiktir.</p>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 {[
                   { id: 'manager', label: 'Bir Üst Yöneticinin Değerlendirmesi' },
                   { id: 'self', label: 'Özdeğerlendirme (Çalışanın Kendisi)' },
                   { id: 'peer', label: 'Akran / İş Arkadaşı Puanı' },
                   { id: 'directReport', label: 'Ast (Aşağıdan Yukarıya) Puanı' },
                 ].map(role => (
                   <div key={role.id} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem 1.5rem', background: formData.raterSettings[role.id].active ? '#fff' : '#f8fafc', border: formData.raterSettings[role.id].active ? '1px solid #cbd5e1' : '1px dashed #e2e8f0', borderRadius: '8px', opacity: formData.raterSettings[role.id].active ? 1 : 0.6 }}>
                     
                     <div style={{ width: '250px' }}>
                       <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#1e293b', cursor: 'pointer' }}>
                         <input 
                           type="checkbox" 
                           checked={formData.raterSettings[role.id].active} 
                           onChange={e => setFormData(p => ({...p, raterSettings: {...p.raterSettings, [role.id]: {...p.raterSettings[role.id], active: e.target.checked}}}))} 
                           style={{ transform: 'scale(1.2)' }}
                         />
                         {role.label}
                       </label>
                     </div>

                     <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '2rem' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                         <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Ağırlık:%</span>
                         <input 
                           type="number" min="0" max="100" 
                           disabled={!formData.raterSettings[role.id].active}
                           value={formData.raterSettings[role.id].weight} 
                           onChange={e => setFormData(p => ({...p, raterSettings: {...p.raterSettings, [role.id]: {...p.raterSettings[role.id], weight: Number(e.target.value)}}}))}
                           style={{ width: '70px', padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none' }}
                         />
                       </div>

                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                         <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Kişi Limiti (Min-Max):</span>
                         <input type="number" min="1" disabled={!formData.raterSettings[role.id].active} value={formData.raterSettings[role.id].min} onChange={e => setFormData(p => ({...p, raterSettings: {...p.raterSettings, [role.id]: {...p.raterSettings[role.id], min: Number(e.target.value)}}}))} style={{ width: '50px', padding: '0.4rem', border: '1px solid #cbd5e1' }} />
                         <span>-</span>
                         <input type="number" min="1" disabled={!formData.raterSettings[role.id].active} value={formData.raterSettings[role.id].max} onChange={e => setFormData(p => ({...p, raterSettings: {...p.raterSettings, [role.id]: {...p.raterSettings[role.id], max: Number(e.target.value)}}}))} style={{ width: '50px', padding: '0.4rem', border: '1px solid #cbd5e1' }} />
                       </div>

                       <div style={{ display: 'flex', alignItems: 'center' }}>
                         {role.id !== 'self' && (
                           <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#475569', cursor: 'pointer' }}>
                             <input type="checkbox" disabled={!formData.raterSettings[role.id].active} checked={formData.raterSettings[role.id].isAnonymous} onChange={e => setFormData(p => ({...p, raterSettings: {...p.raterSettings, [role.id]: {...p.raterSettings[role.id], isAnonymous: e.target.checked}}}))} />
                             Skoru/İsmi Gizle (Anonim)
                           </label>
                         )}
                       </div>
                     </div>
                   </div>
                 ))}
               </div>

               <div style={{ padding: '1rem', background: '#334155', borderRadius: '8px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                 <span style={{ fontWeight: 600 }}>Değerlendirici Ağırlığı Toplamı:</span>
                 <span style={{ fontSize: '1.5rem', fontWeight: 800, color: (Object.values(formData.raterSettings).filter(r => r.active).reduce((sum, r) => sum + r.weight, 0)) === 100 ? '#4ade80' : '#f87171' }}>
                    %{Object.values(formData.raterSettings).filter(r => r.active).reduce((sum, r) => sum + r.weight, 0)}
                 </span>
               </div>
               
               <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '0.5rem' }}>
                 <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>Eksik Değerlendirici Telafi Kuralı</h4>
                 <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem', lineHeight: '1.5' }}>
                   Eğer bir çalışanın belirli bir roldeki değerlendiricisi (örn: Astı) yoksa, boşa çıkan % yüzdelik ağırlığın sistem tarafından nasıl kompanse edileceğini seçin:
                 </p>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                   <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', padding: '0.75rem', background: formData.missingRaterPolicy === 'PRO_RATA' ? '#eff6ff' : '#fff', border: formData.missingRaterPolicy === 'PRO_RATA' ? '1px solid #93c5fd' : '1px solid #e2e8f0', borderRadius: '8px' }}>
                     <input type="radio" name="missRater" value="PRO_RATA" checked={formData.missingRaterPolicy === 'PRO_RATA'} onChange={e => setFormData({...formData, missingRaterPolicy: e.target.value})} style={{ marginTop: '0.2rem' }} />
                     <div>
                       <strong style={{ display: 'block', color: '#1e293b', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Dinamik Yeniden Dağıtım (Önerilen)</strong>
                       <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Boşa çıkan ağırlık oranı kaybolmaz; kalan değerlendiricilerin (Yönetici, Akran vb.) ağırlıklarına kendi payları oranında matematiksel olarak dağıtılır.</span>
                     </div>
                   </label>
                   <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', padding: '0.75rem', background: formData.missingRaterPolicy === 'MANAGER_OVERRIDE' ? '#eff6ff' : '#fff', border: formData.missingRaterPolicy === 'MANAGER_OVERRIDE' ? '1px solid #93c5fd' : '1px solid #e2e8f0', borderRadius: '8px' }}>
                     <input type="radio" name="missRater" value="MANAGER_OVERRIDE" checked={formData.missingRaterPolicy === 'MANAGER_OVERRIDE'} onChange={e => setFormData({...formData, missingRaterPolicy: e.target.value})} style={{ marginTop: '0.2rem' }} />
                     <div>
                       <strong style={{ display: 'block', color: '#1e293b', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Üst Yöneticiye Devir (Manager Override)</strong>
                       <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Boşa çıkan tüm ağırlık, oranlanmadan ve sadece çalışanın birinci amirine (yöneticisine) aktarılır. Yöneticinin puan yetkisi artırılır.</span>
                     </div>
                   </label>
                 </div>
               </div>

               <div style={{ padding: '1.5rem', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '0.5rem' }}>
                 <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>Sonuçların Görünürlüğü</h4>
                 <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem', color: '#334155' }}>
                   <input 
                     type="checkbox" 
                     checked={formData.shareResultsWithEmployee} 
                     onChange={e => setFormData({...formData, shareResultsWithEmployee: e.target.checked})} 
                     style={{ transform: 'scale(1.2)' }}
                   />
                   Kampanya kapandığında, değerlendirilen çalışan kendi <strong>Nihai 360-Derece Karnesini</strong> (ve anonim yorumların Yapay Zeka derlemesini) "Değerlendirmelerim" panelinde görsün.
                 </label>
               </div>
             </div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
             <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <div style={{ background: '#ecfdf5', padding: '1.5rem', borderRadius: '8px', border: '1px dashed #6ee7b7' }}>
                 <strong style={{ color: '#047857' }}>Kural 6 & 7: Akıllı Değerlendirici Matrisi.</strong> 
                 <p style={{ margin: '0.5rem 0 0 0', color: '#065f46', fontSize: '0.9rem' }}>Sistem, departman mimarisine (OrgChart) bakarak kurallarınıza uygun adayları eşleştirdi. Listeyi inceleyip manuel "istisna (exception)" yönetimi yapabilirsiniz.</p>
               </div>

               <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                 <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                   <thead>
                     <tr style={{ background: '#f1f5f9', color: '#475569' }}>
                       <th style={{ padding: '1rem', borderBottom: '2px solid #cbd5e1' }}>Değerlendirilen Çalışan</th>
                       <th style={{ padding: '1rem', borderBottom: '2px solid #cbd5e1' }}>Departman</th>
                       <th style={{ padding: '1rem', borderBottom: '2px solid #cbd5e1' }}>Manager Review</th>
                       <th style={{ padding: '1rem', borderBottom: '2px solid #cbd5e1' }}>Peer (Akran)</th>
                       <th style={{ padding: '1rem', borderBottom: '2px solid #cbd5e1' }}>Direct Reports (Ast)</th>
                       <th style={{ padding: '1rem', borderBottom: '2px solid #cbd5e1', textAlign: 'center' }}>İşlem</th>
                     </tr>
                   </thead>
                   <tbody>
                     {formData.matrix.map((row, idx) => (
                       <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                         <td style={{ padding: '1rem', fontWeight: 600, color: '#334155' }}>{row.subjectName}</td>
                         <td style={{ padding: '1rem', color: '#64748b' }}>{row.department}</td>
                         
                         {/* Manager Slot */}
                         <td style={{ padding: '1rem' }}>
                           {row.raters.filter(r => r.role==='manager').map(m => (
                             <span key={m.employeeId} style={{ display: 'inline-block', background: '#dbeafe', color: '#1d4ed8', padding: '0.2rem 0.5rem', borderRadius: '12px', margin: '2px', fontSize: '0.75rem', fontWeight: 600 }}>{m.name} <button onClick={() => removeRaterFromMatrix(row.subjectId, m.employeeId, 'manager')} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', marginLeft: '4px' }}>x</button></span>
                           ))}
                           {row.raters.filter(r => r.role==='manager').length === 0 && <span style={{ color: '#cbd5e1' }}>- Yok -</span>}
                           
                           {/* Add Manager Inline */}
                           {addRaterMenu.subjectId === row.subjectId && addRaterMenu.role === 'manager' ? (
                              <select 
                                style={{ display: 'block', marginTop: '4px', padding: '2px', fontSize: '0.75rem' }}
                                onChange={(e) => addRaterToMatrix(row.subjectId, 'manager', e.target.value)}
                                onBlur={() => setAddRaterMenu({subjectId: null, role: null})}
                              >
                                <option value="">Seçiniz...</option>
                                {employees.filter(e => e.isActive !== false && e.id !== row.subjectId).map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                              </select>
                           ) : (
                              <button onClick={() => setAddRaterMenu({subjectId: row.subjectId, role: 'manager'})} style={{ border: '1px dashed #cbd5e1', background: 'transparent', padding: '0.1rem 0.5rem', borderRadius: '12px', color: '#94a3b8', fontSize: '0.75rem', cursor: 'pointer', margin: '2px' }}>+ Ekle</button>
                           )}
                         </td>

                         {/* Peer Slot */}
                         <td style={{ padding: '1rem' }}>
                           {row.raters.filter(r => r.role==='peer').map(p => (
                             <span key={p.employeeId} style={{ display: 'inline-block', background: '#f3e8ff', color: '#7e22ce', padding: '0.2rem 0.5rem', borderRadius: '12px', margin: '2px', fontSize: '0.75rem', fontWeight: 600 }}>{p.name} <button onClick={() => removeRaterFromMatrix(row.subjectId, p.employeeId, 'peer')} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', marginLeft: '4px' }}>x</button></span>
                           ))}
                           
                           {/* Add Peer Inline */}
                           {addRaterMenu.subjectId === row.subjectId && addRaterMenu.role === 'peer' ? (
                              <select 
                                style={{ display: 'block', marginTop: '4px', padding: '2px', fontSize: '0.75rem' }}
                                onChange={(e) => addRaterToMatrix(row.subjectId, 'peer', e.target.value)}
                                onBlur={() => setAddRaterMenu({subjectId: null, role: null})}
                              >
                                <option value="">Seçiniz...</option>
                                {employees.filter(e => e.isActive !== false && e.id !== row.subjectId).map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                              </select>
                           ) : (
                              <button onClick={() => setAddRaterMenu({subjectId: row.subjectId, role: 'peer'})} style={{ border: '1px dashed #cbd5e1', background: 'transparent', padding: '0.1rem 0.5rem', borderRadius: '12px', color: '#94a3b8', fontSize: '0.75rem', cursor: 'pointer', margin: '2px' }}>+ Ekle</button>
                           )}
                         </td>

                         {/* Ast Slot */}
                         <td style={{ padding: '1rem' }}>
                           {row.raters.filter(r => r.role==='directReport').map(d => (
                             <span key={d.employeeId} style={{ display: 'inline-block', background: '#e0f2fe', color: '#0369a1', padding: '0.2rem 0.5rem', borderRadius: '12px', margin: '2px', fontSize: '0.75rem', fontWeight: 600 }}>{d.name} <button onClick={() => removeRaterFromMatrix(row.subjectId, d.employeeId, 'directReport')} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', marginLeft: '4px' }}>x</button></span>
                           ))}
                           {row.raters.filter(r => r.role==='directReport').length === 0 && <span style={{ color: '#cbd5e1' }}>- Yok -</span>}
                           
                           {/* Add Direct Report Inline */}
                           {addRaterMenu.subjectId === row.subjectId && addRaterMenu.role === 'directReport' ? (
                              <select 
                                style={{ display: 'block', marginTop: '4px', padding: '2px', fontSize: '0.75rem' }}
                                onChange={(e) => addRaterToMatrix(row.subjectId, 'directReport', e.target.value)}
                                onBlur={() => setAddRaterMenu({subjectId: null, role: null})}
                              >
                                <option value="">Seçiniz...</option>
                                {employees.filter(e => e.isActive !== false && e.id !== row.subjectId).map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                              </select>
                           ) : (
                              <button onClick={() => setAddRaterMenu({subjectId: row.subjectId, role: 'directReport'})} style={{ border: '1px dashed #cbd5e1', background: 'transparent', padding: '0.1rem 0.5rem', borderRadius: '12px', color: '#94a3b8', fontSize: '0.75rem', cursor: 'pointer', margin: '2px' }}>+ Ekle</button>
                           )}
                         </td>

                         <td style={{ padding: '1rem', textAlign: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Revize Edilebilir</span>
                         </td>
                       </tr>
                     ))}
                     {formData.matrix.length === 0 && (
                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Filtrelere uygun katılımcı bulunamadı. Lütfen Adım 1'i kontrol edin.</td></tr>
                     )}
                   </tbody>
                 </table>
               </div>
             </div>
          )}

        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div style={{ padding: '1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <button 
           onClick={handlePrev} 
           style={{ padding: '0.6rem 1.5rem', background: '#fff', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '8px', fontWeight: 600, cursor: currentStep > 1 ? 'pointer' : 'not-allowed', opacity: currentStep > 1 ? 1 : 0.4 }}
           disabled={currentStep === 1}
         >
           Geçmişe Dön
         </button>
         
         <div style={{ display: 'flex', gap: '1rem' }}>
           <button onClick={handleSaveDraft} style={{ padding: '0.6rem 1.5rem', background: 'transparent', color: '#4f46e5', border: '2px solid #4f46e5', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
             Taslak Olarak Kaydet
           </button>
           {currentStep < 4 ? (
             <button onClick={handleNext} style={{ padding: '0.6rem 2rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)' }}>
               İleri
             </button>
           ) : (
             <button onClick={handleLaunchCampaign} style={{ padding: '0.6rem 2rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)' }}>
               🚀 Matrisi Onayla & Kampanyayı Başlat
             </button>
           )}
         </div>
      </div>

    </div>
  );
}
