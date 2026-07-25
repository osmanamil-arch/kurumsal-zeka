import React, { useState, useMemo } from 'react';
import SalaryBulkUpload from './SalaryBulkUpload';
import AdaletMatrisi from './AdaletMatrisi';
import './SalaryManagementModule.css';

const SalaryManagementModule = ({ evaluations, titles, factors, setEvaluations }) => {
  const [activeSubTab, setActiveSubTab] = useState('bands');
  const [marketData, setMarketData] = useState([]);
  const [rangeSpread, setRangeSpread] = useState(40); 
  const [selectedForAdalet, setSelectedForAdalet] = useState(null);

  const gradeStructure = [
    { grade: 1, minPoints: 0, maxPoints: 150 },
    { grade: 2, minPoints: 151, maxPoints: 300 },
    { grade: 3, minPoints: 301, maxPoints: 450 },
    { grade: 4, minPoints: 451, maxPoints: 600 },
    { grade: 5, minPoints: 601, maxPoints: 800 },
    { grade: 6, minPoints: 801, maxPoints: 1000 }
  ];

  const calculateScore = (evalData) => {
    let totalScore = 0;
    factors.forEach(cat => {
      let catScore = 0;
      cat.subFactors.forEach(sf => {
        const level = evalData.factorScores[sf.id] || 0;
        const levelData = sf.levels.find(l => l.level === level);
        const points = levelData ? levelData.points : 0;
        catScore += points * (sf.weight / 100);
      });
      totalScore += catScore * (cat.weight / 100);
    });
    return totalScore;
  };

  const processedTitles = useMemo(() => {
    return titles.map(title => {
      const evaluation = evaluations.find(e => e.titleId === title.id);
      const score = evaluation ? calculateScore(evaluation) : 0;
      const grade = gradeStructure.find(g => score >= g.minPoints && score <= g.maxPoints)?.grade || 1;
      const market = marketData.find(m => m.TitleId === title.id) || { MarketMid: 0, CurrentSalary: 0 };
      const midPoint = market.MarketMid || (grade * 15000); 
      
      // Scarcity Multiplier (İkame Güçlüğü Çarpanı)
      const scarcityMultiplier = evaluation?.scarcityMultiplier || 1; 
      const adjustedMid = midPoint * scarcityMultiplier;
      
      const min = adjustedMid * (1 - (rangeSpread / 200));
      const max = adjustedMid * (1 + (rangeSpread / 200));
      const compaRatio = market.CurrentSalary ? (market.CurrentSalary / adjustedMid * 100).toFixed(1) : 0;

      return {
        ...title,
        score,
        grade,
        midPoint: adjustedMid,
        originalMid: midPoint,
        scarcityMultiplier,
        min,
        max,
        currentSalary: market.CurrentSalary || 0,
        compaRatio
      };
    }).sort((a, b) => b.score - a.score);
  }, [titles, evaluations, marketData, rangeSpread, factors]);

  const handleSaveMultiplier = (multiplier, evidence) => {
    const titleId = selectedForAdalet.id;
    const existingIndex = evaluations.findIndex(e => e.titleId === titleId);
    let newEvaluations = [...evaluations];
    
    if (existingIndex > -1) {
      newEvaluations[existingIndex] = { 
        ...newEvaluations[existingIndex], 
        scarcityMultiplier: multiplier,
        scarcityEvidence: evidence 
      };
    } else {
      newEvaluations.push({ 
        titleId, 
        factorScores: {}, 
        scarcityMultiplier: multiplier,
        scarcityEvidence: evidence 
      });
    }
    
    setEvaluations(newEvaluations);
    setSelectedForAdalet(null);
  };

  return (
    <div className="salary-management-module">
      <div className="salary-tabs glass">
        <button className={`tab-btn ${activeSubTab === 'bands' ? 'active' : ''}`} onClick={() => setActiveSubTab('bands')}>📊 Ücret Bantları</button>
        <button className={`tab-btn ${activeSubTab === 'upload' ? 'active' : ''}`} onClick={() => setActiveSubTab('upload')}>📥 Veri Yükleme</button>
      </div>

      <div className="salary-content">
        {activeSubTab === 'upload' && (
          <SalaryBulkUpload onUploadSuccess={(data) => setMarketData(data)} />
        )}

        {activeSubTab === 'bands' && (
          <div className="bands-view glass">
            <div className="bands-header">
              <h3>Pozisyon Bazlı Ücret Yapısı</h3>
              <div className="spread-control">
                <label>Bant Genişliği: %{rangeSpread}</label>
                <input type="range" min="20" max="60" step="5" value={rangeSpread} onChange={(e) => setRangeSpread(e.target.value)} />
              </div>
            </div>

            <div className="bands-table-wrapper">
              <table className="bands-table">
                <thead>
                  <tr>
                    <th>Unvan</th>
                    <th>Değerleme Puanı</th>
                    <th>Kademe (Grade)</th>
                    <th>Minimum</th>
                    <th>Piyasa Medyan (Mid)</th>
                    <th>Maximum</th>
                    <th>Mevcut Ort.</th>
                    <th>Compa-Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {processedTitles.map(t => (
                    <tr key={t.id}>
                      <td><strong>{t.name}</strong></td>
                      <td><span className="badge-score">{t.score.toFixed(1)}</span></td>
                      <td>
                        <span className="badge-grade">Grade {t.grade}</span>
                        {t.scarcityMultiplier > 1 && (
                          <div className="scarcity-tag" title="Piyasa Kıtlığı Primi Uygulandı">
                            🔥 ×{t.scarcityMultiplier}
                          </div>
                        )}
                      </td>
                      <td>{t.min.toLocaleString()} ₺</td>
                      <td className="mid-col">{t.midPoint.toLocaleString()} ₺</td>
                      <td>{t.max.toLocaleString()} ₺</td>
                      <td>{t.currentSalary > 0 ? `${t.currentSalary.toLocaleString()} ₺` : '-'}</td>
                      <td>
                        {t.currentSalary > 0 && (
                          <div className={`compa-badge ${t.compaRatio < 80 ? 'low' : t.compaRatio > 120 ? 'high' : 'normal'}`}>
                            %{t.compaRatio}
                          </div>
                        )}
                      </td>
                      <td>
                        <button className="btn-tiny" onClick={() => setSelectedForAdalet(t)}>
                          ⚖️ Adalet Matrisi
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedForAdalet && (
                <AdaletMatrisi 
                    title={selectedForAdalet}
                    onClose={() => setSelectedForAdalet(null)}
                    onSave={handleSaveMultiplier}
                />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryManagementModule;
