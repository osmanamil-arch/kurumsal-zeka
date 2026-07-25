import React, { useState, useMemo } from 'react';
import './SurveyModule.css';
import { surveyQuestions } from '../data/surveyData';

export default function SurveyModule({ surveyHistory = [], onSaveSurvey }) {
  const [answers, setAnswers] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  // Group questions by category
  const groupedQuestions = useMemo(() => {
    return surveyQuestions.reduce((acc, q) => {
      if (!acc[q.category]) acc[q.category] = [];
      acc[q.category].push(q);
      return acc;
    }, {});
  }, []);

  // Calculate score dynamically
  const { score, earnedPoints, maxAvailable, answeredCount } = useMemo(() => {
    let _earned = 0;
    let _maxAvailable = 0;
    let _answeredCount = Object.keys(answers).length;

    surveyQuestions.forEach(q => {
      const val = answers[q.id];
      if (val === 5) {
        // Muaf / N/A -> Not added to maxAvailable
      } else {
        _maxAvailable += (q.weight * 3);
        if (val !== undefined && val !== 5) {
          _earned += (q.weight * val);
        }
      }
    });

    const _score = _maxAvailable > 0 ? ((_earned / _maxAvailable) * 100) : 0;
    
    return {
      score: _score,
      earnedPoints: _earned,
      maxAvailable: _maxAvailable,
      answeredCount: _answeredCount
    };
  }, [answers]);

  const isAllAnswered = answeredCount === surveyQuestions.length;
  const missingQuestions = useMemo(() => {
    return surveyQuestions.filter(q => answers[q.id] === undefined).map(q => q.id);
  }, [answers]);
  const sortedHistory = useMemo(() => {
    return [...surveyHistory].sort((a,b) => new Date(b.date) - new Date(a.date));
  }, [surveyHistory]);

  const lastSurvey = sortedHistory.length > 0 ? sortedHistory[0] : null;

  const handleSave = () => {
    if (!isAllAnswered) {
      setShowErrors(true);
      alert("Envanter tam doldurulmadan kaydet butonu aktif olmayacaktır. Lütfen kırmızı ile işaretlenen eksik maddeleri kontrol edin.");
      return;
    }
    // Updated to pass payload
    onSaveSurvey({ score, answers });
    alert("Kurumsallaşma Skoru başarıyla kaydedildi! Tarih: " + new Date().toLocaleDateString('tr-TR') + "\nSkorunuz: " + score.toFixed(2));
  };

  const handleAnswer = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const getButtonClass = (qId, val) => {
    return `opt-btn ${answers[qId] === val ? 'active val-' + val : ''}`;
  };

  return (
    <div className="survey-module fade-in mt-4">
      <div className="survey-header glass">
        <div className="score-summary">
          <div className="main-score">
            <span className="score-number">{score.toFixed(2)}</span>
            <span className="score-percent">%</span>
          </div>
          <p className="score-label">Güncel Kurumsallaşma Puanı</p>
        </div>
        <div className="score-stats">
          <div className="stat-box">
            <span>Yanıtlanan Soru</span>
            <strong style={{ color: isAllAnswered ? 'var(--success)' : '#EF4444' }}>{answeredCount} / {surveyQuestions.length}</strong>
          </div>
          <div className="stat-box">
            <span>Kazanılan Puan</span>
            <strong>{earnedPoints} / {maxAvailable}</strong>
          </div>
          <button 
            className={`save-btn ${isAllAnswered ? 'ready' : 'disabled'}`}
            disabled={!isAllAnswered}
            onClick={handleSave}
          >
            {isAllAnswered ? '💾 Kaydet' : '🔒 Kaydet (Eksik Var)'}
          </button>
        </div>
        <div className="completion-warning">
           ⚠️ <strong>Dikkat:</strong> Envanter tam doldurulmadan kaydet butonu aktif olmayacaktır.
           {showErrors && !isAllAnswered && (
             <div className="missing-alert mt-2">
               Eksik maddeler: <span className="missing-ids">{missingQuestions.join(", ")}</span>
             </div>
           )}
        </div>
      </div>

      <div className="history-analysis glass">
         <h3>Geçmiş Skorlar ve Karşılaştırmalı Değişim</h3>
         <div className="history-grid">
           <div className="history-card current">
             <span className="h-date">Şu An (Yeni Skor)</span>
             <strong className="h-score">{score.toFixed(2)}</strong>
           </div>
           
           {sortedHistory.slice(0, 4).map((entry, idx) => {
             const diff = (score - entry.score).toFixed(2);
             return (
               <div className="history-card" key={entry.id}>
                 <span className="h-date">{new Date(entry.date).toLocaleDateString('tr-TR')}</span>
                 <strong className="h-score">{entry.score.toFixed(2)}</strong>
                 <div className={`h-diff ${diff >= 0 ? 'positive' : 'negative'}`}>
                   <span className="diff-label">Değişim</span>
                   <span className="diff-val">{diff > 0 ? '+' : ''}{diff}</span>
                 </div>
               </div>
             );
           })}
         </div>
      </div>

      <div className="survey-legend glass">
        <span className="legend-item"><div className="color-box v-0"></div>0: Yok</span>
        <span className="legend-item"><div className="color-box v-1"></div>1: Var ama vasat</span>
        <span className="legend-item"><div className="color-box v-2"></div>2: Var ve normal işliyor</span>
        <span className="legend-item"><div className="color-box v-3"></div>3: Var ve işlevsel</span>
        <span className="legend-item"><div className="color-box v-5"></div>x: Muaf (Puana Katılmaz)</span>
      </div>

      <div className="survey-body">
        {Object.entries(groupedQuestions).map(([category, qs]) => {
           const categoryAnswered = qs.filter(q => answers[q.id] !== undefined).length;
           return (
            <div className="category-section" key={category}>
              <div className="category-header">
                <h3>{category}</h3>
                <span className="cat-progress">{categoryAnswered} / {qs.length} Tamamlandı</span>
              </div>
              <div className="question-list">
                {qs.map(q => {
                  const isMissing = showErrors && answers[q.id] === undefined;
                  return (
                    <div className={`question-card ${answers[q.id] !== undefined ? 'answered' : ''} ${isMissing ? 'error-highlight' : ''}`} key={q.id}>
                      <div className="q-info">
                      <span className="q-num">{q.id}</span>
                      <p className="q-text">{q.text}</p>
                      <span className="q-weight" title="Soru Ağırlığı">Ağırlık: {q.weight}</span>
                    </div>
                    <div className="q-actions">
                      <div className="options-row" style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className={getButtonClass(q.id, 0)} onClick={() => handleAnswer(q.id, 0)} title="Yok">0</button>
                        <button className={getButtonClass(q.id, 1)} onClick={() => handleAnswer(q.id, 1)} title="Var ama vasat">1</button>
                        <button className={getButtonClass(q.id, 2)} onClick={() => handleAnswer(q.id, 2)} title="Var ve normal işliyor">2</button>
                        <button className={getButtonClass(q.id, 3)} onClick={() => handleAnswer(q.id, 3)} title="Var ve işlevsel">3</button>
                        <button className={getButtonClass(q.id, 5)} onClick={() => handleAnswer(q.id, 5)} title="Muaf / Değerlendirme Dışı">x</button>
                      </div>

                      {lastSurvey && lastSurvey.answers && lastSurvey.answers[q.id] !== undefined && lastSurvey.answers[q.id] !== answers[q.id] && (
                        <div className="prev-answer-highlight">
                          Önceki cevabınız: <strong>{lastSurvey.answers[q.id] === 5 ? 'x' : lastSurvey.answers[q.id]}</strong>
                        </div>
                      )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
           );
        })}
      </div>
    </div>
  );
}
