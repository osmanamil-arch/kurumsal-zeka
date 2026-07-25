import React, { useState } from 'react';
import './JobEvaluationFactors.css';

const JobEvaluationFactors = ({ factors, setFactors }) => {
  const [editingSubFactor, setEditingSubFactor] = useState(null);

  const handleMainWeightChange = (catId, newWeight) => {
    const updatedFactors = factors.map(cat => 
      cat.id === catId ? { ...cat, weight: parseInt(newWeight) } : cat
    );
    setFactors(updatedFactors);
  };

  const handleSubWeightChange = (catId, subId, newWeight) => {
    const updatedFactors = factors.map(cat => {
      if (cat.id === catId) {
        const updatedSubs = cat.subFactors.map(sf => 
          sf.id === subId ? { ...sf, weight: parseInt(newWeight) } : sf
        );
        return { ...cat, subFactors: updatedSubs };
      }
      return cat;
    });
    setFactors(updatedFactors);
  };

  if (!factors || !Array.isArray(factors)) {
    return <div className="error-box">Faktör verileri yüklenemedi.</div>;
  }

  const totalMainWeight = factors.reduce((sum, cat) => sum + (cat.weight || 0), 0);

  return (
    <div className="evaluation-factors-container glass">
      <div className="factors-header">
        <h3>Hiyerarşik İş Değerleme Yapısı</h3>
        <div className={`weight-total ${totalMainWeight === 100 ? 'valid' : 'invalid'}`}>
          Ana Kategori Toplamı: %{totalMainWeight}
        </div>
      </div>

      <div className="categories-stack">
        {factors.map(cat => {
          const subTotal = cat.subFactors?.reduce((sum, sf) => sum + (sf.weight || 0), 0) || 0;
          return (
          <div key={cat.id} className="category-section glass">
            <div className="category-row">
              <div className="cat-info">
                <h4>{cat.name}</h4>
                <span className="cat-badge">Ana Grup Ağırlığı</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <input 
                  type="range" min="0" max="100" step="5" 
                  value={cat.weight} 
                  onChange={(e) => handleMainWeightChange(cat.id, e.target.value)}
                  className="main-slider"
                />
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#a29bfe', minWidth: '55px', textAlign: 'right' }}>%{cat.weight}</span>
              </div>
            </div>

            {cat.subFactors && cat.subFactors.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ fontSize: '0.9rem', color: '#a0a0c0' }}>Alt Faktörler</span>
                <div className={`weight-total ${subTotal === 100 ? 'valid' : 'invalid'}`} style={{ fontSize: '0.85rem', padding: '4px 12px' }}>
                  Alt Faktör Toplamı: %{subTotal}
                </div>
              </div>
            )}

            <div className="subfactors-grid">
              {cat.subFactors?.map(sf => (
                <div key={sf.id} className="subfactor-card glass">
                  <div className="sf-header" style={{ marginBottom: '8px' }}>
                    <h5>{sf.name}</h5>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <input 
                      type="range" min="0" max="100" step="5" 
                      value={sf.weight} 
                      onChange={(e) => handleSubWeightChange(cat.id, sf.id, e.target.value)}
                      className="sub-slider"
                    />
                    <span style={{ fontWeight: 'bold', color: '#a29bfe', minWidth: '40px', textAlign: 'right' }}>%{sf.weight}</span>
                  </div>
                  <button 
                    className="btn-tiny" 
                    onClick={() => setEditingSubFactor(sf)}
                  >
                    Seviyeleri Gör
                  </button>
                </div>
              ))}
            </div>
          </div>
        )})}
      </div>

      {editingSubFactor && (
        <div className="modal-overlay">
          <div className="modal-content glass slide-up">
            <div className="modal-header">
              <h4>{editingSubFactor.name} - Detaylar</h4>
              <button className="btn-close" onClick={() => setEditingSubFactor(null)}>×</button>
            </div>
            <div className="levels-list">
              {editingSubFactor.levels.map(l => (
                <div key={l.level} className="level-item">
                  <strong>Lv {l.level}:</strong> {l.description}
                  <span className="l-pts">{l.points} Puan</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobEvaluationFactors;
