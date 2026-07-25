import React, { useState, useMemo } from 'react';
import './ProcessAnalysisModule.css';

const TEST_NAMES = [
  { id: 't1', label: 'Çıktı Doğruluğu' },
  { id: 't2', label: 'Tutarlılık' },
  { id: 't3', label: 'Kapsam' },
  { id: 't4', label: 'Hata Yakalama' },
  { id: 't5', label: 'Dayanıklılık' },
  { id: 't6', label: 'Amaç Uyumu' },
  { id: 't7', label: 'Değer Üretimi' },
  { id: 't8', label: 'Kayıp (Sızıntı)' },
  { id: 't9', label: 'Bağımlılık' },
  { id: 't10', label: 'Görünürlük' }
];

export default function ProcessAnalysisModule({ processes, setProcesses, employees }) {
  const [formData, setFormData] = useState({
    department: '',
    ownerId: '',
    definition: '',
    scores: {
      t1: 1, t2: 1, t3: 1, t4: 1, t5: 1,
      t6: 1, t7: 1, t8: 1, t9: 1, t10: 1
    }
  });

    const calculateProcessStatus = (scores) => {
    const t1 = parseInt(scores.t1) || 1;
    const t3 = parseInt(scores.t3) || 1;
    const t7 = parseInt(scores.t7) || 1;
    const t9 = parseInt(scores.t9) || 1;

    const totalPoints = Object.values(scores).reduce((sum, val) => sum + (parseInt(val) || 1), 0);
    const normalizedScore = totalPoints; // Since max is 10 per test, 10 tests = 100 total

    let baseClass = "";
    let classLevel = 0; // 5: İşlevsel, 4: Kısmen, 3: Kırılgan, 2: İşlevsiz, 1: Kritik
    if (normalizedScore >= 85) { baseClass = "İşlevsel"; classLevel = 5; }
    else if (normalizedScore >= 70) { baseClass = "Kısmen İşlevsel"; classLevel = 4; }
    else if (normalizedScore >= 55) { baseClass = "Kırılgan"; classLevel = 3; }
    else if (normalizedScore >= 40) { baseClass = "İşlevsiz"; classLevel = 2; }
    else { baseClass = "Kritik"; classLevel = 1; }

    let finalClass = baseClass;
    let risks = [];
    let diagnosis = [];

    const isAnyLow = Object.values(scores).some(val => (parseInt(val) || 1) <= 4);
    const weakAreas = TEST_NAMES.filter(t => (parseInt(scores[t.id]) || 1) <= 4).map(t => t.label);

    if (isAnyLow && classLevel > 3) {
      finalClass = "Kırılgan";
      classLevel = 3;
    }

    if (t1 <= 4 || t7 <= 4) {
      if (classLevel > 2) {
        finalClass = "İşlevsiz";
        classLevel = 2;
      }
      risks.push(`Temel problem (${t1 <= 4 ? 'Çıktı' : ''}${t1<=4 && t7<=4 ? ' ve ' : ''}${t7 <= 4 ? 'Değer Üretimi' : ''} zayıf)`);
    }

    if (t3 >= 8 && t7 <= 4) {
      finalClass = "İllüzyonel";
      classLevel = 0;
      risks.push("Geniş kapsamlı ancak değersiz süreç (İllüzyonel)");
    }

    if (t9 <= 4) {
      if (classLevel > 3 && finalClass !== "İllüzyonel") {
        finalClass = "Kırılgan";
        classLevel = 3;
      }
      risks.push("Yüksek dış bağımlılık veya darboğaz riski");
    }

    if (weakAreas.length > 0 && finalClass !== "İllüzyonel") {
      diagnosis.push(`${finalClass} + ${weakAreas.length} zayıf alan`);
    } else {
      diagnosis.push(`${finalClass} süreç yapısı`);
    }

    return {
      normalizedScore: Math.round(normalizedScore),
      finalClass,
      weakAreas,
      risks,
      diagnosis: diagnosis.join(", ")
    };
  };

  const analytics = useMemo(() => {
    if (!processes || processes.length === 0) return null;
    
    const count = processes.length;
    const allStats = processes.map(p => calculateProcessStatus(p.scores));
    const avgScore = allStats.reduce((sum, s) => sum + s.normalizedScore, 0) / count;
    
    const criteriaStats = TEST_NAMES.map(t => {
      const avg = processes.reduce((sum, p) => sum + (parseInt(p.scores[t.id]) || 1), 0) / count;
      return { label: t.label, avg };
    });
    
    const sorted = [...criteriaStats].sort((a, b) => b.avg - a.avg);
    return {
      count,
      avgScore: Math.round(avgScore),
      top3: sorted.slice(0, 3),
      bottom3: sorted.slice(-3).reverse() 
    };
  }, [processes]);

  const uniqueDepartments = useMemo(() => {
    if (!employees) return [];
    const deps = employees.map(e => e.department).filter(Boolean);
    return [...new Set(deps)];
  }, [employees]);

  const handleScoreChange = (testId, val) => {
    setFormData(prev => ({
      ...prev,
      scores: { ...prev.scores, [testId]: parseInt(val) }
    }));
  };

  const handleAddProcess = (e) => {
    e.preventDefault();
    if (!formData.department || !formData.ownerId || !formData.definition.trim()) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    const newProcess = {
      id: Date.now().toString(),
      department: formData.department,
      ownerId: formData.ownerId,
      definition: formData.definition.trim(),
      scores: { ...formData.scores }
    };

    setProcesses(prev => [...prev, newProcess]);
    setFormData({
      department: '',
      ownerId: '',
      definition: '',
      scores: {
        t1: 1, t2: 1, t3: 1, t4: 1, t5: 1,
        t6: 1, t7: 1, t8: 1, t9: 1, t10: 1
      }
    });
  };

  const handleDelete = (id) => {
    setProcesses(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="process-analysis-module fade-in">
      <header className="page-header glass">
        <div className="header-info">
           <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Süreç ve İş Akışları</h3>
           <p style={{ margin: '0.2rem 0 0', color: 'var(--text-muted)' }}>Departman süreçlerini tanımlayın ve 10 kritere göre puanlayarak analiz edin.</p>
        </div>
        <button className="download-btn" onClick={() => alert("Danışman Yönergesi dosyası (PDF) indiriliyor... (Eklenmesi Bekliyor)")}>
           📥 Danışman Uygulama Yönergesini İndir
        </button>
      </header>

      {analytics && (
        <div className="analytics-grid">
          <div className="analytic-card glass">
            <span className="card-label">Analiz Edilen Süreç</span>
            <span className="card-value">{analytics.count}</span>
          </div>
          <div className="analytic-card glass">
            <span className="card-label">Süreç Puan Ortalaması</span>
            <span className="card-value">{analytics.avgScore}<small>/100</small></span>
          </div>
          <div className="analytic-card glass">
            <span className="card-label">En Yüksek 3 Kriter</span>
            <div className="criteria-list top">
              {analytics.top3.map((c, i) => (
                <div key={i} className="criteria-item">
                  <span className="c-name">{c.label}</span>
                  <span className="c-val">{c.avg.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="analytic-card glass">
            <span className="card-label">En Düşük 3 Kriter</span>
            <div className="criteria-list bottom">
              {analytics.bottom3.map((c, i) => (
                <div key={i} className="criteria-item">
                  <span className="c-name">{c.label}</span>
                  <span className="c-val">{c.avg.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="glass form-section">
        <h4 className="section-title">Yeni Süreç Değerlendirmesi Ekle</h4>
        <form className="process-form" onSubmit={handleAddProcess}>
           <div className="form-row">
             <div className="form-group">
               <label>Departman Seçin:</label>
               <select required value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                 <option value="">-- Departman --</option>
                 {uniqueDepartments.map(dep => (
                   <option key={dep} value={dep}>{dep}</option>
                 ))}
                 <option value="Diğer">Diğer / Yeni Departman</option>
               </select>
             </div>
             
             <div className="form-group">
               <label>Süreç Sahibi Seçin:</label>
               <select required value={formData.ownerId} onChange={e => setFormData({...formData, ownerId: e.target.value})}>
                 <option value="">-- Çalışan Rehberi --</option>
                 {employees && employees.map(emp => (
                   <option key={emp.id} value={emp.id}>{emp.name} ({emp.title || emp.department})</option>
                 ))}
               </select>
             </div>
           </div>
           
           <div className="form-group">
             <label>Süreci Tanımla:</label>
             <textarea 
               required 
               rows="2" 
               placeholder="Bu sürecin amacı ve adımları nedir? Kısaca açıklayın..."
               value={formData.definition}
               onChange={e => setFormData({...formData, definition: e.target.value})}
             />
           </div>

           <div className="scores-grid-container">
             <label className="grid-title">10 Test (Kriter) Üzerinden 1-10 Arası Puanlayın:</label>
             <div className="scores-grid">
               {TEST_NAMES.map(test => (
                 <div className="score-item" key={test.id}>
                   <span className="score-label" title={test.label}>{test.label}</span>
                   <select 
                     style={{
                       width: '60px',
                       textAlign: 'center',
                       padding: '0.4rem',
                       borderRadius: '6px',
                       border: '1px solid #d1d5db',
                       fontWeight: '700',
                       outline: 'none',
                       appearance: 'none'
                     }}
                     required
                     value={formData.scores[test.id]}
                     onChange={(e) => handleScoreChange(test.id, e.target.value)}
                   >
                     {[...Array(10)].map((_, idx) => (
                       <option key={idx + 1} value={idx + 1}>{idx + 1}</option>
                     ))}
                   </select>
                 </div>
               ))}
             </div>
           </div>

           <div className="form-actions">
             <button type="submit" className="primary-btn">Süreci ve Analizi Ekle</button>
           </div>
        </form>
      </div>

      <div className="glass matrix-section">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.2rem', borderBottom: '2px solid #f3f4f6', paddingBottom: '0.5rem'}}>
          <h4 className="section-title" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>Süreç Analiz Matrisi</h4>
          <div className="matrix-legend">
            <span className="legend-item"><span className="badge-weak"></span> Zayıf Alan (Skor ≤ 4)</span>
            <span className="legend-item"><span className="badge-risk"></span> Tespit Edilen Risk</span>
          </div>
        </div>
        {processes && processes.length > 0 ? (
          <div className="table-responsive">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th style={{ width: '10%' }}>Departman</th>
                  <th style={{ width: '12%' }}>Süreç Sahibi</th>
                  <th style={{ width: '18%' }}>Süreç Tanımı</th>
                  {TEST_NAMES.map(t => (
                    <th key={t.id} title={t.label} className="rotate-th"><div><span>{t.label}</span></div></th>
                  ))}
                  <th className="score-col">Genel Skor</th>
                  <th style={{ width: '15%' }}>Risk & Zayıflıklar</th>
                  <th style={{ width: '12%' }}>Teşhis</th>
                  <th style={{ width: '5%' }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {processes.map(p => {
                  const emp = employees ? employees.find(e => e.id === p.ownerId) : null;
                  const stats = calculateProcessStatus(p.scores);
                  
                  return (
                    <tr key={p.id}>
                      <td><strong>{p.department}</strong></td>
                      <td>{emp ? emp.name : 'Bilinmeyen'}</td>
                      <td><p className="td-definition">{p.definition}</p></td>
                      {TEST_NAMES.map(t => (
                        <td key={t.id} className="td-score">{p.scores[t.id]}</td>
                      ))}
                      <td className="td-total-score">
                         <div className={`score-badge ${stats.normalizedScore >= 80 ? 'high' : stats.normalizedScore >= 60 ? 'mid' : 'low'}`}>
                           {stats.normalizedScore}/100
                         </div>
                         <div style={{fontWeight: '700', fontSize: '0.85rem', marginTop: '0.4rem', color: 'var(--text-main)'}}>
                           {stats.finalClass}
                         </div>
                      </td>
                      <td className="td-tags">
                         <div className="tags-container">
                           {stats.weakAreas.map((w, idx) => (
                             <span key={idx} className="badge-weak" title="Zayıf Alan">{w}</span>
                           ))}
                           {stats.risks.map((r, idx) => (
                             <span key={idx} className="badge-risk" title="Tespit Edilen Risk">{r}</span>
                           ))}
                           {stats.weakAreas.length === 0 && stats.risks.length === 0 && (
                             <span style={{color: '#9ca3af', fontSize: '0.8rem'}}>Risk yok</span>
                           )}
                         </div>
                      </td>
                      <td className="td-diagnosis">
                         <div className="diag-section diag-summary" style={{marginTop: 0}}>
                           {stats.diagnosis}
                         </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button className="del-btn" onClick={() => handleDelete(p.id)}>❌</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
             <div className="empty-icon">📊</div>
             <p>Henüz tanımlanmış bir ana süreç yok. Yukarıdaki formdan ilk süreci ekleyin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
