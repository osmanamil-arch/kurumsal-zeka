import React, { useState, useMemo, useEffect } from 'react';
import { smartMapAnalysisToEvaluation, getEvidenceForFactor } from '../utils/evaluationMapping';
import './GuidedJobEvaluation.css';

const GuidedJobEvaluation = ({ factors, titles, evaluations, setEvaluations, jobAnalyses }) => {
  const [selectedTitleId, setSelectedTitleId] = useState(titles[0]?.id || '');
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [showEvidence, setShowEvidence] = useState(true);
  const [aiAnalysisStatus, setAiAnalysisStatus] = useState('none'); // 'none', 'auto-filled', 'partial'
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);

  // Sync edit mode on position shift
  useEffect(() => {
    setShowSuccessScreen(false);
    setActiveCategoryIndex(0); // Start from first category on position switch
    if (selectedTitleId) {
      const isAlreadyEvaluated = evaluations.some(e => e.titleId === selectedTitleId);
      setIsEditingMode(!isAlreadyEvaluated);
    }
  }, [selectedTitleId]);

  const activeCategory = factors[activeCategoryIndex];
  
  const currentAnalysis = useMemo(() => {
    return jobAnalyses.find(ja => ja.titleId === selectedTitleId && ja.isActiveVersion);
  }, [selectedTitleId, jobAnalyses]);

  const currentEvaluation = useMemo(() => {
    return evaluations.find(e => e.titleId === selectedTitleId) || null;
  }, [selectedTitleId, evaluations]);

  const aiResults = useMemo(() => {
    return smartMapAnalysisToEvaluation(currentAnalysis, factors);
  }, [currentAnalysis, factors]);

  // AUTO-POPULATE LOGIC
  useEffect(() => {
    if (!currentEvaluation && aiResults && selectedTitleId) {
      const factorScores = {};
      const comments = {};
      let allFound = true;

      Object.keys(aiResults).forEach(fId => {
        factorScores[fId] = aiResults[fId].level;
        if (aiResults[fId].isAutoFilled) {
          comments[fId] = 'Yapay zeka tarafından analiz verilerine dayanılarak doldurulmuştur.';
        } else {
          allFound = false;
        }
      });

      const newEval = {
        titleId: selectedTitleId,
        factorScores,
        comments,
        isAiGenerated: true
      };

      setEvaluations(prev => [...prev, newEval]);
      setAiAnalysisStatus(allFound ? 'auto-filled' : 'partial');
    } else if (currentEvaluation) {
      setAiAnalysisStatus(currentEvaluation.isAiGenerated ? 'auto-filled' : 'none');
    }
  }, [selectedTitleId, currentEvaluation, aiResults, setEvaluations]);

  const handleScoreChange = (factorId, level, comment = '') => {
    const existingIndex = evaluations.findIndex(e => e.titleId === selectedTitleId);
    let newEvaluations = [...evaluations];
    
    const baseEval = currentEvaluation || { titleId: selectedTitleId, factorScores: {}, comments: {} };
    const updatedEval = {
      ...baseEval,
      factorScores: { ...baseEval.factorScores, [factorId]: parseInt(level) },
      comments: { ...baseEval.comments, [factorId]: comment },
      isAiGenerated: false // Manuel müdahale yapıldığında etiketi kaldırabiliriz veya "Manuel Düzenlendi" diyebiliriz.
    };

    if (existingIndex > -1) {
      newEvaluations[existingIndex] = updatedEval;
    } else {
      newEvaluations.push(updatedEval);
    }
    
    setEvaluations(newEvaluations);
  };

  const calculateCategoryScore = (category) => {
    if (!currentEvaluation) return "0.0";
    let score = 0;
    category.subFactors.forEach(sf => {
        const level = currentEvaluation.factorScores[sf.id] || 0;
        const levelData = sf.levels.find(l => l.level === level);
        const points = levelData ? levelData.points : 0;
        score += points * (sf.weight / 100);
    });
    return (score * (category.weight / 100)).toFixed(1);
  };

  const totalScore = useMemo(() => {
    if (!factors || !Array.isArray(factors)) return "0.0";
    return factors.reduce((sum, cat) => sum + parseFloat(calculateCategoryScore(cat)), 0).toFixed(1);
  }, [factors, currentEvaluation]);

  return (
    <div className="guided-evaluation-layout">
      {/* Sidebar: Position List */}
      <aside className="position-sidebar glass">
        <h4>Pozisyonlar</h4>
        <div className="position-list">
          {titles.map(t => (
            <div 
              key={t.id} 
              className={`pos-item ${selectedTitleId === t.id ? 'active' : ''}`}
              onClick={() => setSelectedTitleId(t.id)}
            >
              <div className="pos-name">{t.name}</div>
              <div className="pos-status">
                {evaluations.find(e => e.titleId === t.id) ? '✅ Değerlendi' : '⭕ Bekliyor'}
              </div>
            </div>
          ))}
        </div>
        <div className="total-score-box glass">
            <span>Toplam Puan</span>
            <div className="score">{totalScore}</div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="evaluation-main">
        {showSuccessScreen ? (
          <div className="evaluation-success-container glass slide-down" style={{ padding: '2.5rem', borderRadius: '16px', textAlign: 'center', width: '100%', maxWidth: '600px', margin: '40px auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ fontSize: '4rem' }}>🎉</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--success)' }}>İş Değerleme Başarıyla Tamamlandı!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.5' }}>
              <strong>{titles.find(t => t.id === selectedTitleId)?.name}</strong> pozisyonu için değerlendirme başarıyla kaydedildi.
            </p>
            <div className="total-score-badge" style={{ background: 'rgba(108, 92, 231, 0.1)', border: '1px solid var(--primary)', padding: '1.5rem 3rem', borderRadius: '12px', marginTop: '1rem' }}>
              <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', display: 'block', marginBottom: '0.5rem' }}>Hesaplanan Toplam Skor</span>
              <span style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--primary)' }}>{totalScore}</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', width: '100%' }}>
              <button 
                onClick={() => {
                  const nextUnevaluated = titles.find(t => !evaluations.some(e => e.titleId === t.id));
                  if (nextUnevaluated) {
                    setSelectedTitleId(nextUnevaluated.id);
                  } else {
                    alert('Tüm pozisyonlar başarıyla değerlendirildi!');
                  }
                  setShowSuccessScreen(false);
                }} 
                className="btn-nav primary"
                style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Yeni Pozisyon Seç
              </button>
              <button 
                onClick={() => {
                  setShowSuccessScreen(false);
                  setIsEditingMode(true);
                }} 
                className="btn-nav"
                style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Değerleri Düzenle
              </button>
            </div>
          </div>
        ) : (!isEditingMode && currentEvaluation) ? (
          <div className="evaluation-summary-container glass slide-up" style={{ padding: '2.5rem', borderRadius: '16px', width: '100%', maxWidth: '600px', margin: '40px auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem' }}>🛡️</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Değerlendirme Tamamlandı</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              <strong>{titles.find(t => t.id === selectedTitleId)?.name}</strong> pozisyonu daha önce değerlendirilmiştir.
            </p>
            <div className="total-score-badge" style={{ background: 'rgba(108, 92, 231, 0.1)', border: '1px solid var(--primary)', padding: '1.5rem 3rem', borderRadius: '12px', marginTop: '1rem' }}>
              <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', display: 'block', marginBottom: '0.5rem' }}>Mevcut Toplam Skor</span>
              <span style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--primary)' }}>{totalScore}</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', marginTop: '1rem' }}>
              Değerleri güncellemek veya tamamen sıfırlamak için aşağıdaki seçenekleri kullanabilirsiniz.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', width: '100%' }}>
              <button 
                onClick={() => setIsEditingMode(true)} 
                className="btn-nav primary"
                style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Değerleri Güncelle
              </button>
              <button 
                onClick={() => {
                  if (window.confirm(`${titles.find(t => t.id === selectedTitleId)?.name} pozisyonunun değerlendirmesini sıfırlamak istediğinize emin misiniz?`)) {
                    setEvaluations(prev => prev.filter(e => e.titleId !== selectedTitleId));
                    setIsEditingMode(true);
                    setActiveCategoryIndex(0);
                  }
                }} 
                className="btn-nav"
                style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', background: '#ef4444', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Sıfırla ve Yeniden Başlat
              </button>
            </div>
          </div>
        ) : (
          <>
            {aiAnalysisStatus !== 'none' && (
                <div className="ai-banner glass slide-up">
                    <div className="ai-icon">🤖</div>
                    <div className="ai-text">
                        <strong>Yapay Zeka Destekli Değerleme:</strong> Girdiğiniz iş analizi ve görev tanımı bilgilerine göre default olarak tanımlanmıştır. Lütfen kontrol ediniz.
                    </div>
                </div>
            )}

            <div className="category-stepper glass">
              {factors.map((cat, idx) => (
                <div 
                  key={cat.id} 
                  className={`step ${idx === activeCategoryIndex ? 'active' : ''} ${idx < activeCategoryIndex ? 'completed' : ''}`}
                  onClick={() => setActiveCategoryIndex(idx)}
                >
                  <span className="step-num">{idx + 1}</span>
                  <span className="step-label">{cat.name}</span>
                </div>
              ))}
            </div>

            <div className="active-category-container slide-up">
              <div className="cat-header">
                <h3>{activeCategory.name} <span className="cat-w">(%{activeCategory.weight})</span></h3>
              </div>

              <div className="factors-scroller">
                {activeCategory.subFactors?.map(sf => {
                  const currentLevel = currentEvaluation?.factorScores[sf.id] || 0;
                  const aiData = aiResults?.[sf.id];
                  const evidence = getEvidenceForFactor(currentAnalysis, sf.id);

                  return (
                    <div key={sf.id} className={`factor-guided-card glass ${!aiData?.isAutoFilled ? 'warning-border' : ''}`}>
                      <div className="factor-header">
                        <div className="f-title-row">
                            <h4>
                                {sf.name} 
                                {!aiData?.isAutoFilled && (
                                    <span className="missing-icon" title="Analiz verilerinde bu faktör için net bilgi bulunamadı. Lütfen manuel seçiniz.">
                                        ⚠️ Eksik Veri
                                    </span>
                                )}
                            </h4>
                            {aiData?.isAutoFilled && (
                                 <span className="ai-tag">AI Önerisi</span>
                            )}
                        </div>
                        <p className="f-desc">{sf.description}</p>
                      </div>

                      <div className="level-selection-row">
                        {sf.levels?.map(l => (
                          <div 
                            key={l.level} 
                            className={`level-option ${currentLevel === l.level ? 'selected' : ''}`}
                            onClick={() => handleScoreChange(sf.id, l.level)}
                          >
                            <div className="l-num">{l.level}</div>
                            <div className="l-desc">{l.description}</div>
                            <div className="l-pts">{l.points} Pts</div>
                          </div>
                        ))}
                      </div>

                      {evidence.length > 0 && showEvidence && (
                        <div className="evidence-inline glass">
                            <strong>📊 Analizden Gelen Kanıtlar:</strong>
                            <ul>
                                {evidence.map((ev, i) => <li key={i}>{ev}</li>)}
                            </ul>
                        </div>
                      )}

                      <div className="factor-footer">
                        <input 
                          type="text" 
                          placeholder="Gerekçe / Not ekle..." 
                          className="comment-input"
                          value={currentEvaluation?.comments?.[sf.id] || ''}
                          onChange={(e) => handleScoreChange(sf.id, currentLevel, e.target.value)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="navigation-footer">
                <button 
                  disabled={activeCategoryIndex === 0} 
                  onClick={() => setActiveCategoryIndex(prev => prev - 1)}
                  className="btn-nav"
                >
                  ← Geri
                </button>
                <button 
                  onClick={() => {
                    if (activeCategoryIndex === factors.length - 1) {
                      setShowSuccessScreen(true);
                    } else {
                      setActiveCategoryIndex(prev => prev + 1);
                    }
                  }}
                  className="btn-nav primary"
                  style={activeCategoryIndex === factors.length - 1 ? { background: 'var(--success)' } : {}}
                >
                  {activeCategoryIndex === factors.length - 1 ? 'Değerlemeyi Tamamla ve Kaydet' : 'Sonraki →'}
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Right Sidebar */}
      <aside className="calibration-sidebar glass">
        <h4>Rehber & Kalibrasyon</h4>
        <div className="anchors-panel">
            <h5>Çıpa Pozisyonlar</h5>
            <div className="anchor-list">
                {activeCategory.subFactors.map(sf => sf.anchors ? (
                    <div key={sf.id} className="anchor-item">
                        <span className="a-factor">{sf.name}</span>
                        <span className="a-val">Lv {sf.anchors.level}: {sf.anchors.role}</span>
                    </div>
                ) : null)}
            </div>
        </div>
      </aside>
    </div>
  );
};

export default GuidedJobEvaluation;
