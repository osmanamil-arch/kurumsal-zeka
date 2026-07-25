import React, { useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './ManagementSummaryModule.css';

const CHECKUP_STEPS = [
  'Kurumsal Teşhis','Kurumsallaşma Envanteri','İşlevsellik Ölçeği',
  'Memnuniyet Ölçümü','Süreç Analizi','Bire-bir Görüşmeler',
  'SWOT/PEST','Raporlama','Periyodik Değerlendirme'
];

const DEPT_COLORS = ['#4F46E5','#10B981','#F59E0B','#3B82F6','#E11D48','#8B5CF6','#14B8A6','#F97316'];
const AVATAR_COLORS = ['#6366F1','#10B981','#F59E0B','#EC4899','#3B82F6','#8B5CF6'];

function DonutChart({ segments, total }) {
  let cum = 0;
  const gradParts = segments.map(s => {
    const start = cum; cum += (s.value / (total||1)) * 100;
    return `${s.color} ${start}% ${cum}%`;
  });
  if (cum < 100) gradParts.push(`#e2e8f0 ${cum}% 100%`);
  return (
    <div className="donut-chart" style={{ background: `conic-gradient(${gradParts.join(',')})` }}>
      <div className="donut-center">
        <span className="donut-center-val">{total}</span>
        <span className="donut-center-label">Hedef</span>
      </div>
    </div>
  );
}

export default function ManagementSummaryModule({
  employees=[], goals=[], dailyTasks=[], meetings=[],
  companyInfo={}, departments=[], titles=[],
  surveyHistory=[], surveyResponses=[], functionalityResponses=[],
  processes=[], swotEntries=[], jobAnalyses=[],
  jobEvaluations=[], performanceCampaigns=[], roadmapActions=[],
  interviews=[], oneOnOneInterviews=[]
}) {
  const [assignments] = useLocalStorage('kobi_testAssignments', []);

  const calc = useMemo(() => {
    const today = new Date(); today.setHours(0,0,0,0);
    const endOfWeek = new Date(today); endOfWeek.setDate(today.getDate()+7);

    // Tasks
    let allTasks = [];
    goals.forEach(g => g.actions?.forEach(a => allTasks.push({...a, source:'strategy', goalId:g.id, dimension:g.dimension})));
    dailyTasks.forEach(t => allTasks.push({...t, source:'daily'}));
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(t => t.status==='tamamlandi').length;
    const delayedTasks = allTasks.filter(t => t.status!=='tamamlandi' && new Date(t.deadline)<today);
    const taskPct = totalTasks ? Math.round((completedTasks/totalTasks)*100) : 0;

    // Weekly
    const weeklyTasks = allTasks.filter(t => t.status!=='tamamlandi' && new Date(t.deadline)>=today && new Date(t.deadline)<=endOfWeek);
    const weeklyMeetings = meetings.filter(m => new Date(m.date)>=today && new Date(m.date)<=endOfWeek);

    // Criticals
    let criticals = [];
    delayedTasks.forEach(t => criticals.push({type:'task', title:t.title, owner:t.owner, deadline:t.deadline}));
    goals.filter(g => !g.actions?.length).forEach(g => criticals.push({type:'goal', title:g.title}));

    // Survey
    const lastScore = surveyHistory.length ? surveyHistory[0]?.score : null;
    const prevScore = surveyHistory.length > 1 ? surveyHistory[1]?.score : null;
    const scoreDelta = lastScore && prevScore ? +(lastScore - prevScore).toFixed(1) : 0;

    // BSC
    const bscDims = [{id:'finance',label:'Finans',icon:'💰',color:'#10B981'},
      {id:'customer',label:'Müşteri',icon:'🤝',color:'#3B82F6'},
      {id:'process',label:'Süreç',icon:'⚙️',color:'#F59E0B'},
      {id:'learning',label:'Gelişim',icon:'🧠',color:'#8B5CF6'}];
    const bscData = bscDims.map(d => ({...d, value: goals.filter(g=>g.dimension===d.id).length}));

    // Strategy health
    const healthScore = Math.min(100, (goals.length>0?40:0) + (allTasks.length>0?30:0) + (goals.every(g=>g.kpi?.targetValue)?30:0));

    // Meetings & decisions
    const totalDecisions = meetings.reduce((a,m) => a+(m.decisions?.length||0), 0);
    const convertedDecisions = meetings.reduce((a,m) => a+(m.decisions?.filter(d=>d.convertedToTask)?.length||0), 0);

    // Job Analysis
    const jaActive = jobAnalyses.filter(j=>j.status==='ACTIVE').length;
    const jaDraft = jobAnalyses.filter(j=>j.status==='DRAFT').length;
    const jaRejected = jobAnalyses.filter(j=>j.status==='REJECTED').length;

    // Job Evaluation
    const jeCompleted = jobEvaluations.length;
    const jePct = titles.length ? Math.round((jeCompleted/titles.length)*100) : 0;

    // Performance
    const activeCampaigns = performanceCampaigns.filter(c=>c.status==='ACTIVE'||c.status==='COMPLETED');
    const perfEvals = performanceCampaigns.reduce((a,c)=>a+(c.evaluations?.length||0),0);
    const perfTotal = performanceCampaigns.reduce((a,c)=>a+(c.matrix?.reduce((x,r)=>x+r.raters.length,0)||0),0);
    const perfPct = perfTotal ? Math.round((perfEvals/perfTotal)*100) : 0;

    // Processes
    const processAvg = processes.length ? Math.round(processes.reduce((a,p)=>a+Object.values(p.scores).reduce((s,v)=>s+(parseInt(v)||1),0),0)/processes.length) : 0;

    // SWOT
    const swot = {S:0,W:0,O:0,T:0};
    swotEntries.forEach(e => { if(swot[e.type]!==undefined) swot[e.type]++; });

    // Psychometrics
    const testTotal = assignments.length;
    const testCompleted = assignments.filter(a=>a.status==='completed').length;
    const testPct = testTotal ? Math.round((testCompleted/testTotal)*100) : 0;

    // Check-up steps status
    const checkupStatus = CHECKUP_STEPS.map((_,i) => {
      const id = i+1;
      if(id===1) return (interviews.length>0 && interviews.every(x=>x.status==='completed'))?'completed':'in-progress';
      if(id===2) { const ls=surveyHistory[0]; return (ls && (new Date()-new Date(ls.date))/(864e5)<90)?'completed':'in-progress'; }
      if(id===3) return functionalityResponses.length>0?'completed':'in-progress';
      if(id===4) return surveyResponses.length>0?'completed':'in-progress';
      if(id===5) return processes.length>0?'completed':'in-progress';
      if(id===6) return (oneOnOneInterviews.length>0 && oneOnOneInterviews.every(x=>x.status==='completed'))?'completed':'in-progress';
      if(id===7) return swotEntries.length>0?'completed':'pending';
      if(id===8) return 'in-progress';
      return 'pending';
    });
    const checkupDone = checkupStatus.filter(s=>s==='completed').length;

    // Dept distribution
    const deptDist = departments.map(d => ({
      name: d.name,
      count: employees.filter(e=>e.departmentId===d.id).length
    })).sort((a,b)=>b.count-a.count);

    // Emp stats
    const empStats = employees.map(emp => {
      const eTasks = allTasks.filter(t=>t.owner===emp.id);
      const delayed = eTasks.filter(t=>t.status!=='tamamlandi'&&new Date(t.deadline)<today).length;
      const completed = eTasks.filter(t=>t.status==='tamamlandi').length;
      const active = eTasks.length - completed;
      return {...emp, totalCount:eTasks.length, delayedCount:delayed, completedCount:completed, activeCount:active};
    }).sort((a,b)=>b.activeCount-a.activeCount);

    // Roadmap
    const rmTotal = roadmapActions.length;

    return {
      totalTasks, completedTasks, taskPct, delayedTasks, criticals,
      weeklyTasks, weeklyMeetings,
      lastScore, scoreDelta, bscData, healthScore,
      totalDecisions, convertedDecisions,
      jaActive, jaDraft, jaRejected,
      jeCompleted, jePct,
      activeCampaigns, perfEvals, perfTotal, perfPct,
      processAvg, swot, testTotal, testCompleted, testPct,
      checkupStatus, checkupDone,
      deptDist, empStats, rmTotal
    };
  }, [employees, goals, dailyTasks, meetings, surveyHistory, surveyResponses,
      functionalityResponses, processes, swotEntries, jobAnalyses, jobEvaluations,
      performanceCampaigns, assignments, departments, titles, interviews,
      oneOnOneInterviews, roadmapActions]);

  const activeEmps = employees.filter(e=>e.isActive!==false).length;

  return (
    <div className="dashboard-wrapper fade-in">

      {/* ═══ KATMAN 1: HERO CARDS ═══ */}
      <div className="hero-stats">
        <div className="hero-card card-indigo animate-in animate-in-1">
          <div className="hero-icon">📊</div>
          <div>
            <div className="hero-value">{calc.lastScore ? calc.lastScore.toFixed(1) : '—'}</div>
            <div className="hero-label">Kurumsallaşma Skoru</div>
            {calc.scoreDelta !== 0 && (
              <div className={`hero-trend ${calc.scoreDelta>0?'up':'down'}`}>
                {calc.scoreDelta>0?'▲':'▼'} {Math.abs(calc.scoreDelta)} puan
              </div>
            )}
          </div>
        </div>

        <div className="hero-card card-emerald animate-in animate-in-2">
          <div className="hero-icon">👥</div>
          <div>
            <div className="hero-value">{activeEmps}</div>
            <div className="hero-label">Aktif Çalışan</div>
            <div className="hero-trend">{departments.length} Departman · {titles.length} Pozisyon</div>
          </div>
        </div>

        <div className="hero-card card-blue animate-in animate-in-3">
          <div className="hero-icon">🎯</div>
          <div>
            <div className="hero-value">{goals.length}</div>
            <div className="hero-label">Stratejik Hedef</div>
            <div className="hero-trend">Sağlık: {calc.healthScore}/100</div>
          </div>
        </div>

        <div className="hero-card card-amber animate-in animate-in-4">
          <div className="hero-icon">✅</div>
          <div>
            <div className="hero-value">%{calc.taskPct}</div>
            <div className="hero-label">Görev Tamamlama</div>
            <div className={`hero-trend ${calc.delayedTasks.length>0?'down':''}`}>
              {calc.completedTasks}/{calc.totalTasks} iş {calc.delayedTasks.length>0 && `· ${calc.delayedTasks.length} gecikmiş`}
            </div>
          </div>
        </div>

        <div className="hero-card card-rose animate-in animate-in-5">
          <div className="hero-icon">🤝</div>
          <div>
            <div className="hero-value">{meetings.length}</div>
            <div className="hero-label">Toplantı</div>
            <div className="hero-trend">{calc.totalDecisions} karar · {calc.convertedDecisions} göreve dönüşen</div>
          </div>
        </div>

        <div className="hero-card card-slate animate-in animate-in-6">
          <div className="hero-icon">📈</div>
          <div>
            <div className="hero-value">{calc.activeCampaigns.length}</div>
            <div className="hero-label">Performans Kampanyası</div>
            <div className="hero-trend">%{calc.perfPct} form tamamlanma</div>
          </div>
        </div>
      </div>

      {/* ═══ KATMAN 2: CHARTS ═══ */}
      <div className="charts-row">
        {/* BSC Donut */}
        <div className="chart-card">
          <div className="chart-title">
            <span className="chart-title-icon" style={{background:'#EEF2FF',color:'#4F46E5'}}>🎯</span>
            BSC Boyut Dağılımı
          </div>
          <div className="donut-container">
            <DonutChart segments={calc.bscData} total={goals.length} />
            <div className="donut-legend">
              {calc.bscData.map(d => (
                <div className="legend-item" key={d.id}>
                  <span className="legend-dot" style={{background:d.color}} />
                  {d.icon} {d.label}
                  <span className="legend-val">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Score Trend */}
        <div className="chart-card">
          <div className="chart-title">
            <span className="chart-title-icon" style={{background:'#F0FDF4',color:'#10B981'}}>📈</span>
            Kurumsallaşma Skoru Trendi
          </div>
          <div className="sparkline-wrapper">
            <div className="sparkline-chart">
              {[...surveyHistory].reverse().map((h, i) => {
                const pct = Math.max(10, (h.score / 100) * 100);
                const color = h.score >= 70 ? '#10B981' : h.score >= 50 ? '#F59E0B' : '#EF4444';
                const dateStr = new Date(h.date).toLocaleDateString('tr-TR',{month:'short',year:'2-digit'});
                return (
                  <div key={h.id||i} className="spark-bar" data-label={dateStr}
                    style={{height:`${pct}%`, background:`linear-gradient(180deg, ${color}, ${color}99)`}}>
                    <span className="spark-tooltip">{h.score}</span>
                  </div>
                );
              })}
              {surveyHistory.length === 0 && <div className="empty-state" style={{width:'100%'}}>Henüz veri yok</div>}
            </div>
          </div>
        </div>

        {/* Check-up Progress */}
        <div className="chart-card">
          <div className="chart-title">
            <span className="chart-title-icon" style={{background:'#FEF3C7',color:'#D97706'}}>🏥</span>
            Check-Up İlerleme ({calc.checkupDone}/9)
          </div>
          <div className="checkup-steps">
            {CHECKUP_STEPS.map((name, i) => {
              const st = calc.checkupStatus[i];
              return (
                <div className="checkup-step-row" key={i}>
                  <span className={`checkup-step-num ${st}`}>{st==='completed'?'✓':i+1}</span>
                  <span className="checkup-step-name">{name}</span>
                  <span className={`checkup-step-badge ${st}`}>
                    {st==='completed'?'Tamam':st==='in-progress'?'Devam':'Bekliyor'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ KATMAN 3: MODULE STATUS ═══ */}
      <div className="section-divider">
        <div className="section-divider-icon">📦</div>
        <div><h3>Modül Durumları</h3><p>Tüm sistemin anlık görünümü</p></div>
      </div>

      <div className="modules-grid">
        {/* İş Analizi */}
        <div className="module-status-card">
          <div className="module-status-header">
            <div className="module-status-icon" style={{background:'#EEF2FF'}}>📝</div>
            <div>
              <div className="module-status-title">İş Analizi</div>
              <div className="module-status-subtitle">Görev tanımları ve pozisyon analizi</div>
            </div>
          </div>
          <div className="module-stats-row">
            <div className="module-stat-pill"><span className="module-stat-val" style={{color:'#10B981'}}>{calc.jaActive}</span><span className="module-stat-label">Aktif</span></div>
            <div className="module-stat-pill"><span className="module-stat-val" style={{color:'#F59E0B'}}>{calc.jaDraft}</span><span className="module-stat-label">Taslak</span></div>
            <div className="module-stat-pill"><span className="module-stat-val" style={{color:'#EF4444'}}>{calc.jaRejected}</span><span className="module-stat-label">Reddedilen</span></div>
          </div>
          <div className="mini-progress">
            <div className="mini-progress-fill indigo" style={{width:`${titles.length?Math.round((calc.jaActive/titles.length)*100):0}%`}} />
          </div>
        </div>

        {/* İş Değerleme */}
        <div className="module-status-card">
          <div className="module-status-header">
            <div className="module-status-icon" style={{background:'#F0FDF4'}}>⚖️</div>
            <div>
              <div className="module-status-title">İş Değerleme</div>
              <div className="module-status-subtitle">{calc.jeCompleted}/{titles.length} pozisyon değerlendirildi</div>
            </div>
          </div>
          <div className="module-stats-row">
            <div className="module-stat-pill"><span className="module-stat-val">{calc.jeCompleted}</span><span className="module-stat-label">Tamamlanan</span></div>
            <div className="module-stat-pill"><span className="module-stat-val">%{calc.jePct}</span><span className="module-stat-label">Oran</span></div>
          </div>
          <div className="mini-progress">
            <div className="mini-progress-fill green" style={{width:`${calc.jePct}%`}} />
          </div>
        </div>

        {/* Performans */}
        <div className="module-status-card">
          <div className="module-status-header">
            <div className="module-status-icon" style={{background:'#FEF3C7'}}>📈</div>
            <div>
              <div className="module-status-title">Performans Yönetimi</div>
              <div className="module-status-subtitle">{calc.perfEvals}/{calc.perfTotal} form tamamlandı</div>
            </div>
          </div>
          <div className="module-stats-row">
            <div className="module-stat-pill"><span className="module-stat-val">{performanceCampaigns.length}</span><span className="module-stat-label">Kampanya</span></div>
            <div className="module-stat-pill"><span className="module-stat-val">%{calc.perfPct}</span><span className="module-stat-label">Tamamlama</span></div>
          </div>
          <div className="mini-progress">
            <div className="mini-progress-fill amber" style={{width:`${calc.perfPct}%`}} />
          </div>
        </div>

        {/* Psikometri */}
        <div className="module-status-card">
          <div className="module-status-header">
            <div className="module-status-icon" style={{background:'#FAE8FF'}}>🧠</div>
            <div>
              <div className="module-status-title">Psikometrik Testler</div>
              <div className="module-status-subtitle">{calc.testCompleted}/{calc.testTotal} test tamamlandı</div>
            </div>
          </div>
          <div className="module-stats-row">
            <div className="module-stat-pill"><span className="module-stat-val">{calc.testTotal}</span><span className="module-stat-label">Atanan</span></div>
            <div className="module-stat-pill"><span className="module-stat-val">%{calc.testPct}</span><span className="module-stat-label">Tamamlama</span></div>
          </div>
          <div className="mini-progress">
            <div className="mini-progress-fill rose" style={{width:`${calc.testPct}%`}} />
          </div>
        </div>

        {/* Süreç Analizi */}
        <div className="module-status-card">
          <div className="module-status-header">
            <div className="module-status-icon" style={{background:'#FFF7ED'}}>⚙️</div>
            <div>
              <div className="module-status-title">Süreç Analizi</div>
              <div className="module-status-subtitle">{processes.length} süreç analiz edildi</div>
            </div>
          </div>
          <div className="module-stats-row">
            <div className="module-stat-pill"><span className="module-stat-val">{processes.length}</span><span className="module-stat-label">Süreç</span></div>
            <div className="module-stat-pill"><span className="module-stat-val">{calc.processAvg}</span><span className="module-stat-label">Ort. Skor</span></div>
          </div>
          <div className="mini-progress">
            <div className="mini-progress-fill blue" style={{width:`${calc.processAvg}%`}} />
          </div>
        </div>

        {/* SWOT */}
        <div className="module-status-card">
          <div className="module-status-header">
            <div className="module-status-icon" style={{background:'#ECFDF5'}}>🔍</div>
            <div>
              <div className="module-status-title">SWOT Analizi</div>
              <div className="module-status-subtitle">{swotEntries.length} girdi kaydedildi</div>
            </div>
          </div>
          <div className="swot-mini-grid">
            <div className="swot-mini-cell swot-s"><span className="swot-val">{calc.swot.S}</span><span className="swot-label">Güçlü</span></div>
            <div className="swot-mini-cell swot-w"><span className="swot-val">{calc.swot.W}</span><span className="swot-label">Zayıf</span></div>
            <div className="swot-mini-cell swot-o"><span className="swot-val">{calc.swot.O}</span><span className="swot-label">Fırsat</span></div>
            <div className="swot-mini-cell swot-t"><span className="swot-val">{calc.swot.T}</span><span className="swot-label">Tehdit</span></div>
          </div>
        </div>
      </div>

      {/* ═══ KATMAN 4: OPERATIONAL INTEL ═══ */}
      <div className="section-divider">
        <div className="section-divider-icon">🔔</div>
        <div><h3>Operasyonel İstihbarat</h3><p>Kritik durumlar, haftalık plan ve ekip yükü</p></div>
      </div>

      <div className="ops-grid">
        {/* Criticals */}
        <div className="ops-card">
          <div className="ops-title">🚨 Kritik Durumlar</div>
          <div className="critical-list">
            {calc.criticals.length===0 && <div className="empty-state">Acil durum yok. Harika! 🎉</div>}
            {calc.criticals.map((c,i) => (
              <div key={i} className="critical-item">
                <span>{c.title}</span>
                {c.type==='task' ? (
                  <small>Gecikme (Termin: {c.deadline}) — {employees.find(e=>e.id===c.owner)?.name||'?'}</small>
                ) : (
                  <small>Aksiyon atanmamış stratejik hedef</small>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Plan */}
        <div className="ops-card">
          <div className="ops-title">📅 Bu Hafta</div>
          <div className="weekly-list">
            {calc.weeklyTasks.length===0 && calc.weeklyMeetings.length===0 && <div className="empty-state">Bu hafta planlanmış iş yok.</div>}
            {calc.weeklyMeetings.map((m,i) => (
              <div key={`m${i}`} className="weekly-item meeting">
                <span>{m.title}</span>
                <small>Toplantı: {new Date(m.date).toLocaleDateString('tr-TR')}</small>
              </div>
            ))}
            {calc.weeklyTasks.map((t,i) => (
              <div key={`t${i}`} className="weekly-item">
                <span>{t.title}</span>
                <small>Termin: {t.deadline}</small>
              </div>
            ))}
          </div>
        </div>

        {/* Team Workload */}
        <div className="ops-card">
          <div className="ops-title">👥 Ekip İş Yükü</div>
          <div className="team-grid">
            {calc.empStats.slice(0,6).map((emp,i) => (
              <div className="team-item" key={emp.id}>
                <div className="t-name">
                  <div className="t-name-avatar" style={{background:AVATAR_COLORS[i%6]}}>{emp.name?.charAt(0)}</div>
                  {emp.name}
                </div>
                <div className="t-stats">
                  <span>{emp.activeCount} aktif</span>
                  {emp.delayedCount>0 && <span className="stat-tag danger">{emp.delayedCount} gecikmiş</span>}
                  {emp.completedCount>0 && <span className="stat-tag success">{emp.completedCount} ✔</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
