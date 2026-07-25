import React, { useMemo } from 'react';
import './EvaluationMatrix.css';

const EvaluationMatrix = ({ factors, titles, evaluations, setEvaluations }) => {
  const allSubFactors = useMemo(() => factors.flatMap(cat => cat.subFactors), [factors]);

  const calculateTotalScore = (evalData) => {
    if (!evalData) return 0;
    let total = 0;
    factors.forEach(cat => {
      let catSum = 0;
      cat.subFactors.forEach(sf => {
        const level = evalData.factorScores[sf.id] || 0;
        const levelData = sf.levels.find(l => l.level === level);
        const points = levelData ? levelData.points : 0;
        catSum += points * (sf.weight / 100);
      });
      total += catSum * (cat.weight / 100);
    });
    return total.toFixed(1);
  };

  const handleCellChange = (titleId, factorId, newLevel) => {
    const existingIndex = evaluations.findIndex(e => e.titleId === titleId);
    let newEvaluations = [...evaluations];
    
    if (existingIndex > -1) {
      const currentEval = newEvaluations[existingIndex];
      newEvaluations[existingIndex] = {
        ...currentEval,
        factorScores: { ...currentEval.factorScores, [factorId]: parseInt(newLevel) },
        isAiGenerated: false
      };
    } else {
      newEvaluations.push({
        titleId,
        factorScores: { [factorId]: parseInt(newLevel) },
        comments: {},
        isAiGenerated: false
      });
    }
    
    setEvaluations(newEvaluations);
  };

  return (
    <div className="evaluation-matrix-container glass slide-up">
      <div className="matrix-header">
        <h3>İş Değerleme Matrisi (Toplu Düzenleme)</h3>
        <p className="subtitle">Tüm pozisyonları ve kriter puanlarını tek bir tablodan yönetin.</p>
      </div>

      <div className="matrix-table-wrapper">
        <table className="matrix-table">
          <thead>
            <tr>
              <th className="sticky-col">No</th>
              <th className="sticky-col title-col">Unvan</th>
              <th className="total-col">Toplam Puan</th>
              {allSubFactors.map(sf => (
                <th key={sf.id} title={sf.description}>
                    <div className="th-content">
                        <span>{sf.name}</span>
                        <small>%{(sf.weight * factors.find(c => c.subFactors.includes(sf)).weight / 100).toFixed(1)}</small>
                    </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {titles.map((title, idx) => {
              const evalData = evaluations.find(e => e.titleId === title.id);
              const score = calculateTotalScore(evalData);
              
              return (
                <tr key={title.id}>
                  <td className="sticky-col">{idx + 1}</td>
                  <td className="sticky-col title-col"><strong>{title.name}</strong></td>
                  <td className="total-col"><span className="badge-score">{score}</span></td>
                  {allSubFactors.map(sf => {
                    const currentLevel = evalData?.factorScores[sf.id] || 0;
                    return (
                      <td key={sf.id}>
                        <select 
                          className={`matrix-select ${currentLevel === 0 ? 'empty' : ''}`}
                          value={currentLevel}
                          onChange={(e) => handleCellChange(title.id, sf.id, e.target.value)}
                        >
                          <option value="0">-</option>
                          {sf.levels.map(l => (
                            <option key={l.level} value={l.level}>{l.level}</option>
                          ))}
                        </select>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EvaluationMatrix;
