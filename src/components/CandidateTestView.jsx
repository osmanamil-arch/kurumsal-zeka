import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { generateBasicAbilityTest, scoreBasicAbility, scorePersonality, buildScoreArray } from '../utils/testEngine';
import { personalityBank, likertScale } from '../data/personalityBank';
import { rankPositions } from '../data/positionProfiles';
import { SymbolSearchTest, StroopTest, ReactionTimeTest, GoNoGoTest, OddOneOutTest, MentalRotationTest } from './InteractiveTests';
import './CandidateTestView.css';

const PHASES = ['intro','temel_yetenek','kisilik','dikkat','gorsel','sonuc'];
const PHASE_LABELS = { intro:'Giriş', temel_yetenek:'Temel Yetenek', kisilik:'Kişilik', dikkat:'Dikkat', gorsel:'Görsel', sonuc:'Sonuçlar' };

export default function CandidateTestView({ onComplete, onCancel, candidateName: initialName }) {
  const [phase, setPhase] = useState('intro');
  const [candidateName, setCandidateName] = useState(initialName || '');
  const [answers, setAnswers] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [results, setResults] = useState(null);

  // Dikkat & görsel alt test skorları
  const [attScores, setAttScores] = useState({});
  const [visScores, setVisScores] = useState({});
  const [dikkatStep, setDikkatStep] = useState(0);
  const [gorselStep, setGorselStep] = useState(0);

  const testSections = useMemo(() => generateBasicAbilityTest(1), []);
  const personalityDims = useMemo(() => Object.entries(personalityBank), []);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleAnswer = useCallback((qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  }, []);

  const handleFinishTest = useCallback(() => {
    const basicScores = scoreBasicAbility(testSections, answers);
    const persScores = scorePersonality(personalityBank, answers);
    const attentionScores = { dikkat: attScores.dikkat||0, zamanlama: attScores.zamanlama||0, odaklanma: attScores.odaklanma||0, oz_kontrol: attScores.oz_kontrol||0 };
    const visualScores = { gorsel_dikkat: visScores.gorsel_dikkat||0, gorsel_ayirt_edicilik: visScores.gorsel_ayirt_edicilik||0, sekil_uzay: visScores.sekil_uzay||0 };
    const allScores = buildScoreArray(basicScores, visualScores, attentionScores, persScores);
    const ranked = rankPositions(allScores);
    const result = { basicScores, persScores, attentionScores, visualScores, ranked, allScores, candidateName, date: new Date().toISOString() };
    setResults(result);
    setPhase('sonuc');
    if (onComplete) onComplete(result);
  }, [testSections, answers, candidateName, onComplete, attScores, visScores]);

  // Phase indicator component
  const PhaseBar = () => (
    <div className="ct-header">
      <div className="ct-phase-indicator">
        {PHASES.filter(p => p !== 'intro').map(p => (
          <div key={p} className={`ct-phase-dot ${phase === p ? 'active' : PHASES.indexOf(p) < PHASES.indexOf(phase) ? 'done' : ''}`}>{PHASE_LABELS[p]}</div>
        ))}
      </div>
      {timeLeft !== null && <div className="ct-timer">⏱ {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}</div>}
    </div>
  );

  // ─── INTRO ───
  if (phase === 'intro') {
    return (
      <div className="ct-wrapper">
        <div className="ct-card ct-intro fade-in">
          <div className="ct-logo">🧠</div>
          <h1>Aday Değerlendirme Testi</h1>
          <p className="ct-subtitle">Bu test, pozisyon uygunluğunuzu belirlemek amacıyla <strong>4 boyutta</strong> yetkinliklerinizi ölçmektedir.</p>
          <div className="ct-info-grid">
            <div className="ct-info-item"><span className="ct-info-icon">📊</span><div><strong>Temel Yetenek</strong><span>18 soru · 5 şıklı</span></div></div>
            <div className="ct-info-item"><span className="ct-info-icon">🎭</span><div><strong>Kişilik</strong><span>30 ifade · Likert</span></div></div>
            <div className="ct-info-item"><span className="ct-info-icon">🔍</span><div><strong>Dikkat</strong><span>4 interaktif test</span></div></div>
            <div className="ct-info-item"><span className="ct-info-icon">👁️</span><div><strong>Görsel</strong><span>2 algı testi</span></div></div>
          </div>
          <div className="ct-name-input">
            <label>Adınız Soyadınız</label>
            <input value={candidateName} onChange={e => setCandidateName(e.target.value)} placeholder="Adınızı girin..." />
          </div>
          <div className="ct-actions">
            <button className="ct-btn primary" disabled={!candidateName.trim()} onClick={() => { setPhase('temel_yetenek'); setTimeLeft(600); }}>Teste Başla →</button>
            {onCancel && <button className="ct-btn ghost" onClick={onCancel}>İptal</button>}
          </div>
        </div>
      </div>
    );
  }

  // ─── TEMEL YETENEK ───
  if (phase === 'temel_yetenek') {
    const section = testSections[currentSection];
    const question = section?.questions[currentQ];
    const totalQ = testSections.reduce((s, sec) => s + sec.questions.length, 0);
    const answeredCount = testSections.reduce((s, sec) => s + sec.questions.filter(q => answers[q.id] !== undefined).length, 0);
    const progress = (answeredCount / totalQ) * 100;
    const diffColors = { kolay:'#22C55E', orta:'#F59E0B', zor:'#EF4444' };
    const diffLabels = { kolay:'Kolay', orta:'Orta', zor:'Zor' };

    const goNext = () => {
      if (currentQ < section.questions.length - 1) setCurrentQ(c => c + 1);
      else if (currentSection < testSections.length - 1) { setCurrentSection(s => s + 1); setCurrentQ(0); }
      else { setPhase('kisilik'); setTimeLeft(300); }
    };
    const goPrev = () => {
      if (currentQ > 0) setCurrentQ(c => c - 1);
      else if (currentSection > 0) { setCurrentSection(s => s - 1); setCurrentQ(testSections[currentSection - 1].questions.length - 1); }
    };

    return (
      <div className="ct-wrapper"><div className="ct-test-container fade-in">
        <PhaseBar />
        <div className="ct-progress-bar"><div className="ct-progress-fill" style={{ width: `${progress}%` }} /></div>
        <div className="ct-section-header"><h2>📊 {section.label}</h2><span className="ct-badge" style={{ background: diffColors[question.difficulty], color:'white' }}>{diffLabels[question.difficulty]}</span></div>
        <div className="ct-question-card glass">
          <div className="ct-q-number">Soru {answeredCount + (answers[question.id] !== undefined ? 0 : 1)} / {totalQ}</div>
          <h3 className="ct-q-text">{question.q}</h3>
          <div className="ct-options">
            {question.o.map((opt, i) => (
              <button key={i} className={`ct-option ${answers[question.id] === i ? 'selected' : ''}`} onClick={() => handleAnswer(question.id, i)}>
                <span className="ct-opt-letter">{String.fromCharCode(65 + i)}</span><span className="ct-opt-text">{opt}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="ct-nav">
          <button className="ct-btn ghost" onClick={goPrev} disabled={currentSection === 0 && currentQ === 0}>← Önceki</button>
          <button className="ct-btn primary" onClick={goNext}>{currentSection === testSections.length - 1 && currentQ === section.questions.length - 1 ? 'Kişilik Testi →' : 'Sonraki →'}</button>
        </div>
      </div></div>
    );
  }

  // ─── KİŞİLİK ───
  if (phase === 'kisilik') {
    const allItems = personalityDims.flatMap(([, dim]) => dim.items);
    const answeredP = allItems.filter(it => answers[it.id] !== undefined).length;
    const progress = (answeredP / allItems.length) * 100;

    return (
      <div className="ct-wrapper"><div className="ct-test-container fade-in">
        <PhaseBar />
        <div className="ct-progress-bar"><div className="ct-progress-fill" style={{ width: `${progress}%` }} /></div>
        <h2 style={{ marginBottom:'1.5rem' }}>🎭 Kişilik Envanteri</h2>
        <p style={{ color:'var(--text-muted)', marginBottom:'2rem' }}>Her ifade için size en uygun seçeneği işaretleyin.</p>
        <div className="ct-personality-list">
          {personalityDims.map(([key, dim]) => (
            <div key={key} className="ct-pers-section">
              <h4 className="ct-pers-dim-title">{dim.label}</h4>
              {dim.items.map(item => (
                <div key={item.id} className="ct-pers-item glass">
                  <p className="ct-pers-text">{item.text}</p>
                  <div className="ct-likert-row">
                    {likertScale.map(ls => (
                      <button key={ls.value} className={`ct-likert-btn ${answers[item.id] === ls.value ? 'selected' : ''}`} onClick={() => handleAnswer(item.id, ls.value)} title={ls.label}>{ls.value}</button>
                    ))}
                  </div>
                  <div className="ct-likert-labels"><span>Kesinlikle Katılmıyorum</span><span>Kesinlikle Katılıyorum</span></div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="ct-nav" style={{ marginTop:'2rem' }}>
          <button className="ct-btn ghost" onClick={() => setPhase('temel_yetenek')}>← Geri</button>
          <button className="ct-btn primary" onClick={() => { setPhase('dikkat'); setTimeLeft(null); setDikkatStep(0); }}>Dikkat Testine Geç →</button>
        </div>
      </div></div>
    );
  }

  // ─── DİKKAT ───
  if (phase === 'dikkat') {
    const dikkatTests = [
      { key:'dikkat', label:'Sembol Arama', Comp: SymbolSearchTest },
      { key:'odaklanma', label:'Stroop Testi', Comp: StroopTest },
      { key:'zamanlama', label:'Reaksiyon Zamanı', Comp: ReactionTimeTest },
      { key:'oz_kontrol', label:'Go / No-Go', Comp: GoNoGoTest },
    ];
    const current = dikkatTests[dikkatStep];
    if (!current) { setPhase('gorsel'); setGorselStep(0); return null; }

    const handleDikkatComplete = (score) => {
      setAttScores(prev => ({ ...prev, [current.key]: score }));
      setTimeout(() => {
        if (dikkatStep + 1 >= dikkatTests.length) { setPhase('gorsel'); setGorselStep(0); }
        else setDikkatStep(s => s + 1);
      }, 1500);
    };

    return (
      <div className="ct-wrapper"><div className="ct-test-container fade-in">
        <PhaseBar />
        <div className="ct-progress-bar"><div className="ct-progress-fill" style={{ width: `${((dikkatStep) / dikkatTests.length) * 100}%` }} /></div>
        <div style={{ marginBottom:'1rem', display:'flex', gap:'0.5rem' }}>
          {dikkatTests.map((t, i) => (
            <span key={t.key} style={{ padding:'0.3rem 0.7rem', borderRadius:20, fontSize:'0.75rem', fontWeight:600,
              background: i < dikkatStep ? '#22C55E' : i === dikkatStep ? '#4F46E5' : '#E2E8F0',
              color: i <= dikkatStep ? 'white' : '#94A3B8' }}>{t.label}</span>
          ))}
        </div>
        <current.Comp key={dikkatStep} onComplete={handleDikkatComplete} />
      </div></div>
    );
  }

  // ─── GÖRSEL ───
  if (phase === 'gorsel') {
    const gorselTests = [
      { key:'gorsel_ayirt_edicilik', label:'Farklı Olanı Bul', Comp: OddOneOutTest },
      { key:'sekil_uzay', label:'Zihinsel Döndürme', Comp: MentalRotationTest },
    ];
    const current = gorselTests[gorselStep];
    if (!current) { handleFinishTest(); return null; }

    const handleGorselComplete = (score) => {
      setVisScores(prev => ({ ...prev, [current.key]: score, gorsel_dikkat: prev.gorsel_dikkat || score }));
      setTimeout(() => {
        if (gorselStep + 1 >= gorselTests.length) handleFinishTest();
        else setGorselStep(s => s + 1);
      }, 1500);
    };

    return (
      <div className="ct-wrapper"><div className="ct-test-container fade-in">
        <PhaseBar />
        <div className="ct-progress-bar"><div className="ct-progress-fill" style={{ width: `${((gorselStep) / gorselTests.length) * 100}%` }} /></div>
        <div style={{ marginBottom:'1rem', display:'flex', gap:'0.5rem' }}>
          {gorselTests.map((t, i) => (
            <span key={t.key} style={{ padding:'0.3rem 0.7rem', borderRadius:20, fontSize:'0.75rem', fontWeight:600,
              background: i < gorselStep ? '#22C55E' : i === gorselStep ? '#4F46E5' : '#E2E8F0',
              color: i <= gorselStep ? 'white' : '#94A3B8' }}>{t.label}</span>
          ))}
        </div>
        <current.Comp key={gorselStep} onComplete={handleGorselComplete} />
      </div></div>
    );
  }

  // ─── SONUÇLAR ───
  if (phase === 'sonuc' && results) {
    return (
      <div className="ct-wrapper"><div className="ct-test-container ct-results fade-in">
        <div className="ct-result-header"><div className="ct-result-icon">✅</div><h1>Test Tamamlandı</h1><p>{results.candidateName} · {new Date(results.date).toLocaleDateString('tr-TR')}</p></div>

        <h3 style={{ marginBottom:'1rem' }}>📊 Temel Yetenek Skorları</h3>
        <div className="ct-scores-grid">
          {Object.entries(results.basicScores).map(([key, score]) => {
            const section = testSections.find(s => s.key === key);
            return (<div key={key} className="ct-score-card glass"><div className="ct-score-label">{section?.label || key}</div><div className="ct-score-bar-wrap"><div className="ct-score-bar" style={{ width:`${score}%`, background: score>=70?'#22C55E':score>=40?'#F59E0B':'#EF4444' }} /></div><div className="ct-score-value">{score}</div></div>);
          })}
        </div>

        <h3 style={{ margin:'2rem 0 1rem' }}>🔍 Dikkat Skorları</h3>
        <div className="ct-scores-grid">
          {Object.entries(results.attentionScores).map(([key, score]) => (
            <div key={key} className="ct-score-card glass"><div className="ct-score-label">{key.replace(/_/g,' ')}</div><div className="ct-score-bar-wrap"><div className="ct-score-bar" style={{ width:`${score}%`, background:'#2563EB' }} /></div><div className="ct-score-value">{score}</div></div>
          ))}
        </div>

        <h3 style={{ margin:'2rem 0 1rem' }}>👁️ Görsel Skorlar</h3>
        <div className="ct-scores-grid">
          {Object.entries(results.visualScores).map(([key, score]) => (
            <div key={key} className="ct-score-card glass"><div className="ct-score-label">{key.replace(/_/g,' ')}</div><div className="ct-score-bar-wrap"><div className="ct-score-bar" style={{ width:`${score}%`, background:'#059669' }} /></div><div className="ct-score-value">{score}</div></div>
          ))}
        </div>

        <h3 style={{ margin:'2rem 0 1rem' }}>🎭 Kişilik Profili</h3>
        <div className="ct-scores-grid">
          {Object.entries(results.persScores).map(([key, score]) => {
            const dim = personalityBank[key];
            return (<div key={key} className="ct-score-card glass"><div className="ct-score-label">{dim?.label || key}</div><div className="ct-score-bar-wrap"><div className="ct-score-bar" style={{ width:`${score}%`, background:'#818CF8' }} /></div><div className="ct-score-value">{score}</div></div>);
          })}
        </div>

        <h3 style={{ margin:'2rem 0 1rem' }}>🏆 Pozisyon Uygunluk Sıralaması</h3>
        <div className="ct-ranking">
          {results.ranked.slice(0, 5).map((pos, i) => (
            <div key={pos.id} className={`ct-rank-item glass ${i === 0 ? 'top' : ''}`}>
              <div className="ct-rank-pos">#{i + 1}</div>
              <div className="ct-rank-info"><strong>{pos.title}</strong><span>{pos.category === 'mavi' ? '🔵 Mavi Yaka' : '⚪ Beyaz Yaka'}</span></div>
              <div className="ct-rank-score"><div className="ct-fit-circle" style={{ '--fit': pos.fitScore }}><span>{pos.fitScore}%</span></div></div>
            </div>
          ))}
        </div>

        <div className="ct-nav" style={{ marginTop:'2rem' }}>
          {onCancel && <button className="ct-btn primary" onClick={onCancel}>Panele Dön</button>}
        </div>
      </div></div>
    );
  }

  return null;
}
