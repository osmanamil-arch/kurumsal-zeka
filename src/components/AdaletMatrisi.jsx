import React, { useState } from 'react';
import './AdaletMatrisi.css';

const AdaletMatrisi = ({ title, currentMultiplier, onSave, onClose }) => {
  const [scores, setScores] = useState({
    scarcity: 3,
    criticality: 3,
    turnover: 3
  });
  
  const [evidence, setEvidence] = useState('');

  const calculateSuggestedMultiplier = () => {
    const avg = (scores.scarcity + scores.criticality + scores.turnover) / 3;
    if (avg >= 4.5) return 1.30;
    if (avg >= 4) return 1.20;
    if (avg >= 3.5) return 1.15;
    if (avg >= 3) return 1.10;
    return 1.05;
  };

  const suggested = calculateSuggestedMultiplier();

  return (
    <div className="modal-overlay">
      <div className="modal-content glass slide-up adalet-modal">
        <div className="modal-header">
          <h4>⚖️ Adalet Matrisi: {title.name}</h4>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        
        <div className="adalet-body">
          <p className="subtitle">Piyasa Kıtlığı Primini (Multiplier) Belirlemek İçin Kanıta Dayalı Değerlendirme</p>
          
          <div className="criteria-list">
            <div className="criterion">
              <label>Piyasa İkame Güçlüğü (1-5)</label>
              <input type="range" min="1" max="5" value={scores.scarcity} onChange={(e) => setScores({...scores, scarcity: parseInt(e.target.value)})} />
              <div className="c-desc">1: Çok Bol Aday - 5: Çok Nadir Yetenek</div>
            </div>
            
            <div className="criterion">
              <label>Stratejik Kritiklik (1-5)</label>
              <input type="range" min="1" max="5" value={scores.criticality} onChange={(e) => setScores({...scores, criticality: parseInt(e.target.value)})} />
              <div className="c-desc">1: Destek Rolü - 5: İş Durdurma Riski</div>
            </div>

            <div className="criterion">
              <label>Turnover / Aday Kaybı (1-5)</label>
              <input type="range" min="1" max="5" value={scores.turnover} onChange={(e) => setScores({...scores, turnover: parseInt(e.target.value)})} />
              <div className="c-desc">1: Düşük - 5: Maaş Kaynaklı Sürekli Kayıp</div>
            </div>
          </div>

          <div className="evidence-input">
            <label>Somut Kanıt / Gerekçe:</label>
            <textarea 
              placeholder="Örn: Son 6 ayda 3 aday maaş beklentisi uyuşmazlığı nedeniyle reddetti."
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
            />
          </div>

          <div className="suggestion-box glass">
             <div className="s-label">Sistem Önerisi</div>
             <div className="s-val">×{suggested}</div>
             <p>Analiz verilerine dayanarak bu pozisyon için %{(suggested * 100 - 100).toFixed(0)} prim önerilmektedir.</p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Vazgeç</button>
          <button 
            className="btn-save" 
            disabled={!evidence}
            onClick={() => onSave(suggested, evidence)}
          >
            Öneriyi Uygula
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdaletMatrisi;
