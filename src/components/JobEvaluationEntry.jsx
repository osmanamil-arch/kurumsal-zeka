import React, { useState, useMemo } from 'react';
import './JobEvaluationEntry.css';

const JobEvaluationEntry = ({ factors, titles, evaluations, setEvaluations }) => {
  const [selectedTitleId, setSelectedTitleId] = useState(titles[0]?.id || '');

  const currentEvaluation = useMemo(() => {
    return evaluations.find(e => e.titleId === selectedTitleId) || {
      titleId: selectedTitleId,
      factorScores: factors.reduce((acc, f) => ({ ...acc, [f.id]: 1 }), {})
    };
  }, [selectedTitleId, evaluations, factors]);

  const handleScoreChange = (factorId, level) => {
    const existingIndex = evaluations.findIndex(e => e.titleId === selectedTitleId);
    let newEvaluations = [...evaluations];
    
    const updatedEval = {
      ...currentEvaluation,
      factorScores: { ...currentEvaluation.factorScores, [factorId]: parseInt(level) }
    };

    if (existingIndex > -1) {
      newEvaluations[existingIndex] = updatedEval;
    } else {
      newEvaluations.push(updatedEval);
    }
    
    setEvaluations(newEvaluations);
  };

  const calculateTotalScore = (evalData) => {
    return factors.reduce((total, factor) => {
      const level = evalData.factorScores[factor.id] || 1;
      const levelData = factor.levels.find(l => l.level === level);
      const points = levelData ? levelData.points : 0;
      return total + (points * (factor.weight / 100));
    }, 0).toFixed(1);
  };

  const totalScore = calculateTotalScore(currentEvaluation);

  return (
    <div className="evaluation-entry-container glass">
      <div className="entry-header">
        <div className="title-selector-group">
          <label>Değerlendirilecek Unvan:</label>
          <select 
            value={selectedTitleId} 
            onChange={(e) => setSelectedTitleId(e.target.value)}
            className="title-select glass"
          >
            {titles.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        
        <div className="total-score-display glass">
          <span className="score-label">Toplam İş Değerleme Puanı</span>
          <span className="score-value">{totalScore}</span>
        </div>
      </div>

      <div className="scoring-grid">
        {factors.map(factor => {
          const currentLevel = currentEvaluation.factorScores[factor.id] || 1;
          const levelInfo = factor.levels.find(l => l.level === currentLevel);
          
          return (
            <div key={factor.id} className="scoring-card glass">
              <div className="scoring-factor-info">
                <h4>{factor.name} <span className="w-tag">(%{factor.weight})</span></h4>
                <p>{factor.description}</p>
              </div>
              
              <div className="level-selector">
                {factor.levels.map(l => (
                  <button 
                    key={l.level}
                    className={`level-btn ${currentLevel === l.level ? 'active' : ''}`}
                    onClick={() => handleScoreChange(factor.id, l.level)}
                  >
                    {l.level}
                  </button>
                ))}
              </div>
              
              <div className="selected-level-desc">
                <strong>Seviye {currentLevel}:</strong> {levelInfo?.description}
                <div className="level-points-calc">
                  {levelInfo?.points} Puan × %{factor.weight} = {(levelInfo?.points * factor.weight / 100).toFixed(1)} Etki
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JobEvaluationEntry;
