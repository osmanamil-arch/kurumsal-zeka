import React, { useState, useEffect, useCallback, useRef } from 'react';

// ═══════════════════════════════════════════
// 1. SEMBOL ARAMA (Dikkat)
// ═══════════════════════════════════════════
export function SymbolSearchTest({ onComplete }) {
  const symbols = ['●','■','▲','◆','○','□','△','◇'];
  const target = '★';
  const [grid, setGrid] = useState([]);
  const [found, setFound] = useState(new Set());
  const [targetCount, setTargetCount] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const cells = [];
    const count = 6 + Math.floor(Math.random() * 3);
    for (let i = 0; i < 36; i++) cells.push(symbols[Math.floor(Math.random() * symbols.length)]);
    const positions = new Set();
    while (positions.size < count) positions.add(Math.floor(Math.random() * 36));
    positions.forEach(p => cells[p] = target);
    setGrid(cells);
    setTargetCount(count);
  }, []);

  useEffect(() => {
    if (done || timeLeft <= 0) { finish(); return; }
    const t = setTimeout(() => setTimeLeft(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, done]);

  const finish = () => {
    if (done) return;
    setDone(true);
    const accuracy = targetCount > 0 ? Math.round((found.size / targetCount) * 100) : 0;
    const penalty = Math.min(mistakes * 10, 30);
    onComplete(Math.max(0, accuracy - penalty));
  };

  const handleClick = (i) => {
    if (done) return;
    if (grid[i] === target) { setFound(prev => new Set([...prev, i])); if (found.size + 1 >= targetCount) finish(); }
    else setMistakes(m => m + 1);
  };

  return (
    <div className="it-test">
      <h4>🔍 Sembol Arama</h4>
      <p>Tablodaki <span style={{fontSize:'1.2rem'}}>★</span> sembollerini bulun ve tıklayın!</p>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'1rem'}}>
        <span>Bulunan: {found.size}/{targetCount}</span><span>Hata: {mistakes}</span><span>⏱ {timeLeft}s</span>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:4,maxWidth:360,margin:'0 auto'}}>
        {grid.map((s, i) => (
          <button key={i} onClick={() => handleClick(i)} disabled={done || found.has(i)}
            style={{width:56,height:56,fontSize:'1.5rem',border:'2px solid #E2E8F0',borderRadius:8,background:found.has(i)?'#DCFCE7':done&&s===target?'#FEE2E2':'white',cursor:done?'default':'pointer',transition:'all 0.15s'}}>
            {s}
          </button>
        ))}
      </div>
      {done && <div style={{textAlign:'center',marginTop:'1rem'}}><strong>Skor: {Math.max(0, Math.round((found.size/targetCount)*100) - Math.min(mistakes*10,30))}/100</strong></div>}
    </div>
  );
}

// ═══════════════════════════════════════════
// 2. STROOP TESTİ (Odaklanma)
// ═══════════════════════════════════════════
export function StroopTest({ onComplete }) {
  const colors = [
    {name:'Kırmızı',code:'#EF4444'},{name:'Mavi',code:'#3B82F6'},{name:'Yeşil',code:'#22C55E'},{name:'Sarı',code:'#EAB308'},{name:'Turuncu',code:'#F97316'}
  ];
  const neutralWords = ['Masa', 'Kalem', 'Araba', 'Çiçek', 'Ev', 'Kitap', 'Kapı', 'Ağaç'];
  const [round, setRound] = useState(0);
  const [results, setResults] = useState([]);
  const [stimulus, setStimulus] = useState(null);
  const [renderTime, setRenderTime] = useState(0);
  const totalRounds = 15; // 5 Neutral, 5 Congruent, 5 Incongruent

  const generateStimulus = useCallback((rIdx) => {
    // Determine condition: mix them up but roughly balance
    const conditionPool = ['neutral', 'congruent', 'incongruent'];
    const conditionNum = Math.floor(Math.random() * 3);
    const condition = conditionPool[conditionNum];
    
    const ink = colors[Math.floor(Math.random() * colors.length)];
    let word;

    if (condition === 'neutral') {
      word = neutralWords[Math.floor(Math.random() * neutralWords.length)];
    } else if (condition === 'congruent') {
      word = ink.name;
    } else {
      let otherColors = colors.filter(c => c.name !== ink.name);
      word = otherColors[Math.floor(Math.random() * otherColors.length)].name;
    }

    return { word, ink, condition };
  }, [neutralWords, colors]);

  useEffect(() => { 
    setStimulus(generateStimulus(0)); 
    setRenderTime(Date.now());
  }, []);

  const handleAnswer = (colorName) => {
    const rt = Date.now() - renderTime;
    const isCorrect = colorName === stimulus.ink.name;
    
    const newResults = [...results, { condition: stimulus.condition, rt, isCorrect }];
    setResults(newResults);

    const next = round + 1;
    if (next >= totalRounds) { 
      // Calculate metrics
      const calcMetrics = (cond) => {
        const condResults = newResults.filter(r => r.condition === cond);
        const acc = condResults.length > 0 ? Math.round((condResults.filter(r => r.isCorrect).length / condResults.length) * 100) : 0;
        let correctGrp = condResults.filter(r => r.isCorrect);
        if (correctGrp.length === 0) correctGrp = condResults; // fallback
        const avgRt = correctGrp.length > 0 ? Math.round(correctGrp.reduce((sum, r) => sum + r.rt, 0) / correctGrp.length) : 0;
        return { acc, avgRt };
      };

      const neutral = calcMetrics('neutral');
      const congruent = calcMetrics('congruent');
      const incongruent = calcMetrics('incongruent');

      // Interference is difference between Incongruent RT and Congruent RT
      const interference = Math.max(0, incongruent.avgRt - congruent.avgRt);
      // Overall accuracy
      const overallAcc = Math.round((newResults.filter(r => r.isCorrect).length / totalRounds) * 100);

      onComplete({
        rounds: newResults,
        performanceScore100: overallAcc,
        metrics: {
          neutralRt: neutral.avgRt,
          neutralAcc: neutral.acc,
          congruentRt: congruent.avgRt,
          congruentAcc: congruent.acc,
          incongruentRt: incongruent.avgRt,
          incongruentAcc: incongruent.acc,
          interference: interference
        }
      });
      return; 
    }
    
    setRound(next);
    setStimulus(generateStimulus(next));
    setRenderTime(Date.now());
  };

  if (!stimulus) return null;
  return (
    <div className="it-test">
      <h4>🎨 Stroop Testi</h4>
      <p>Yazının <strong>RENGİNİ</strong> seçin, kelimenin anlamını değil!</p>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'1rem'}}>
        <span>Tur: {round+1}/{totalRounds}</span>
        <span>Doğru: {results.filter(r => r.isCorrect).length}</span>
      </div>
      <div style={{textAlign:'center',padding:'2rem',background:'#F8FAFC',borderRadius:12,marginBottom:'1.5rem',minHeight:140,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <span style={{fontSize:'3.5rem',fontWeight:800,color:stimulus.ink.code,userSelect:'none',lineHeight:1}}>{stimulus.word}</span>
      </div>
      <div style={{display:'flex',flexWrap:'wrap',gap:'0.75rem',justifyContent:'center'}}>
        {colors.map(c => (
          <button key={c.name} onClick={() => handleAnswer(c.name)}
            style={{padding:'0.75rem 1.5rem',borderRadius:10,border:'2px solid #E2E8F0',background:'white',cursor:'pointer',fontWeight:600,fontSize:'0.9rem',transition:'all 0.15s'}}>
            <span style={{display:'inline-block',width:16,height:16,borderRadius:'50%',background:c.code,marginRight:8,verticalAlign:'middle'}}/>{c.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// 3. REAKSİYON ZAMANI (Zamanlama)
// ═══════════════════════════════════════════
export function ReactionTimeTest({ onComplete }) {
  const [state, setState] = useState('waiting'); // waiting, ready, go, result, early
  const [round, setRound] = useState(0);
  const [times, setTimes] = useState([]);
  const [goTime, setGoTime] = useState(0);
  const timerRef = useRef(null);
  const totalRounds = 6;

  const startRound = useCallback(() => {
    setState('ready');
    const delay = 1500 + Math.random() * 3000;
    timerRef.current = setTimeout(() => { setState('go'); setGoTime(Date.now()); }, delay);
  }, []);

  useEffect(() => { startRound(); return () => clearTimeout(timerRef.current); }, []);

  const handleClick = () => {
    if (state === 'ready') { clearTimeout(timerRef.current); setState('early'); setTimeout(() => { setState('waiting'); startRound(); }, 1000); return; }
    if (state === 'go') {
      const rt = Date.now() - goTime;
      const newTimes = [...times, rt];
      setTimes(newTimes);
      const next = round + 1;
      if (next >= totalRounds) {
        const avg = newTimes.reduce((s,t)=>s+t,0)/newTimes.length;
        const score = Math.max(0, Math.min(100, Math.round(100 - (avg - 200) / 5)));
        onComplete(score);
        setState('result');
        return;
      }
      setRound(next);
      setState('waiting');
      setTimeout(startRound, 500);
    }
  };

  const bgColor = state==='ready'?'#EF4444':state==='go'?'#22C55E':state==='early'?'#F59E0B':'#64748B';
  const label = state==='waiting'?'Hazırlanın...':state==='ready'?'Bekleyin...':state==='go'?'TIKLAYIN!':state==='early'?'Çok erken!':
    `Ortalama: ${Math.round(times.reduce((s,t)=>s+t,0)/times.length)}ms`;

  return (
    <div className="it-test">
      <h4>⚡ Reaksiyon Zamanı</h4>
      <p>Ekran <span style={{color:'#22C55E',fontWeight:700}}>yeşil</span> olunca hızla tıklayın! Erken tıklamayın.</p>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'1rem'}}><span>Tur: {round+1}/{totalRounds}</span><span>Son: {times.length>0?times[times.length-1]+'ms':'—'}</span></div>
      <div onClick={handleClick} style={{height:200,borderRadius:16,background:bgColor,display:'flex',alignItems:'center',justifyContent:'center',cursor:state==='result'?'default':'pointer',transition:'background 0.15s',userSelect:'none'}}>
        <span style={{fontSize:'1.5rem',fontWeight:800,color:'white'}}>{label}</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// 4. GO / NO-GO (Öz Kontrol)
// ═══════════════════════════════════════════
export function GoNoGoTest({ onComplete }) {
  const [round, setRound] = useState(0);
  const [stimulus, setStimulus] = useState(null);
  const [score, setScore] = useState({ goCorrect:0, nogoCorrect:0, goMiss:0, nogoFail:0 });
  const [showFeedback, setShowFeedback] = useState(null);
  const totalRounds = 20;
  const timerRef = useRef(null);

  const nextStimulus = useCallback(() => {
    setShowFeedback(null);
    const isGo = Math.random() < 0.7;
    setStimulus(isGo ? 'go' : 'nogo');
    timerRef.current = setTimeout(() => {
      // Time expired without click
      if (isGo) { setScore(s => ({...s, goMiss:s.goMiss+1})); setShowFeedback('miss'); }
      else { setScore(s => ({...s, nogoCorrect:s.nogoCorrect+1})); setShowFeedback('correct'); }
      setTimeout(() => advance(), 600);
    }, 1200);
  }, [round]);

  const advance = useCallback(() => {
    const next = round + 1;
    if (next >= totalRounds) {
      const s = score;
      const total = s.goCorrect + s.nogoCorrect;
      onComplete(Math.round((total / totalRounds) * 100));
      return;
    }
    setRound(next);
  }, [round, score, onComplete]);

  useEffect(() => { nextStimulus(); return () => clearTimeout(timerRef.current); }, [round]);

  const handleClick = () => {
    clearTimeout(timerRef.current);
    if (stimulus === 'go') { setScore(s => ({...s, goCorrect:s.goCorrect+1})); setShowFeedback('correct'); }
    else { setScore(s => ({...s, nogoFail:s.nogoFail+1})); setShowFeedback('wrong'); }
    setTimeout(() => advance(), 400);
  };

  return (
    <div className="it-test">
      <h4>🚦 Go / No-Go</h4>
      <p>🟢 = TIKLA | 🔴 = TIKLAMA</p>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'1rem'}}><span>Tur: {round+1}/{totalRounds}</span><span>Doğru: {score.goCorrect+score.nogoCorrect}</span></div>
      <div onClick={handleClick} style={{height:200,borderRadius:16,background:stimulus==='go'?'#22C55E':'#EF4444',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'background 0.1s',userSelect:'none',position:'relative'}}>
        <span style={{fontSize:'5rem'}}>{stimulus==='go'?'🟢':'🔴'}</span>
        {showFeedback && <div style={{position:'absolute',bottom:10,fontSize:'1.5rem'}}>{showFeedback==='correct'?'✅':showFeedback==='wrong'?'❌':'⏰'}</div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// 5. TEK FARKLI OLAN (Görsel Ayırt Edicilik)
// ═══════════════════════════════════════════
export function OddOneOutTest({ onComplete }) {
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const totalRounds = 6;

  const generateRound = useCallback((r) => {
    const patterns = [
      {base:'◆◆◇',odd:'◆◇◆'},{base:'▲●▲',odd:'▲▲●'},{base:'■□■□',odd:'□■□■'},
      {base:'○●○●',odd:'●○●○'},{base:'▲▲▲',odd:'△▲▲'},{base:'●●○',odd:'○●●'},
      {base:'◇◆◇',odd:'◇◇◆'},{base:'□■□',odd:'■□■'}
    ];
    const p = patterns[r % patterns.length];
    const oddIdx = Math.floor(Math.random() * 5);
    return Array.from({length:5}, (_, i) => ({ pattern: i===oddIdx ? p.odd : p.base, isOdd: i===oddIdx }));
  }, []);

  const [items, setItems] = useState(() => generateRound(0));

  const handleSelect = (idx) => {
    const isCorrect = items[idx].isOdd;
    if (isCorrect) setCorrect(c => c + 1);
    const next = round + 1;
    if (next >= totalRounds) { onComplete(Math.round(((correct + (isCorrect?1:0)) / totalRounds) * 100)); return; }
    setRound(next);
    setItems(generateRound(next));
  };

  return (
    <div className="it-test">
      <h4>👁️ Farklı Olanı Bul</h4>
      <p>5 desenden farklı olanını seçin.</p>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'1rem'}}><span>Tur: {round+1}/{totalRounds}</span><span>Doğru: {correct}</span></div>
      <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
        {items.map((item, i) => (
          <button key={i} onClick={() => handleSelect(i)}
            style={{width:100,height:100,fontSize:'1.75rem',border:'2px solid #E2E8F0',borderRadius:12,background:'white',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',letterSpacing:4,transition:'all 0.15s'}}>
            {item.pattern}
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// 6. ZİHİNSEL DÖNDÜRME (Şekil-Uzay)
// ═══════════════════════════════════════════
export function MentalRotationTest({ onComplete }) {
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const totalRounds = 6;

  const shapes = [
    {target:'▲■●',options:['●■▲','▲●■','■▲●','▲■●'],answer:3},
    {target:'◆○□',options:['□○◆','○◆□','◆□○','◆○□'],answer:3},
    {target:'●▲□◆',options:['◆□▲●','●□▲◆','□▲●◆','▲●◆□'],answer:0},
    {target:'■○▲',options:['▲○■','○▲■','■▲○','▲■○'],answer:0},
    {target:'□◆●▲',options:['▲●◆□','●▲□◆','◆□▲●','□●▲◆'],answer:0},
    {target:'○■◆',options:['◆■○','■◆○','○◆■','◆○■'],answer:0},
  ];

  const handleSelect = (idx) => {
    const isCorrect = idx === shapes[round % shapes.length].answer;
    if (isCorrect) setCorrect(c => c + 1);
    const next = round + 1;
    if (next >= totalRounds) { onComplete(Math.round(((correct + (isCorrect?1:0)) / totalRounds) * 100)); return; }
    setRound(next);
  };

  const s = shapes[round % shapes.length];
  return (
    <div className="it-test">
      <h4>🔄 Zihinsel Döndürme</h4>
      <p>Hedef deseni ters çevrilmiş (mirror) halini bulun.</p>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'1rem'}}><span>Tur: {round+1}/{totalRounds}</span><span>Doğru: {correct}</span></div>
      <div style={{textAlign:'center',padding:'1.5rem',background:'#EEF2FF',borderRadius:12,marginBottom:'1.5rem',border:'2px solid #818CF8'}}>
        <span style={{fontSize:'2.5rem',letterSpacing:12}}>{s.target}</span>
        <div style={{fontSize:'0.8rem',color:'#4F46E5',marginTop:'0.5rem',fontWeight:600}}>HEDEF DESEN</div>
      </div>
      <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
        {s.options.map((opt, i) => (
          <button key={i} onClick={() => handleSelect(i)}
            style={{width:120,height:80,fontSize:'1.5rem',letterSpacing:8,border:'2px solid #E2E8F0',borderRadius:12,background:'white',cursor:'pointer',transition:'all 0.15s'}}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
