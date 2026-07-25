import React, { useState, useMemo } from 'react';
import SurveyGrid from './common/SurveyGrid';
import BarChart from './common/BarChart';
import MetricCard from './common/MetricCard';
import DepartmentFilter from './common/DepartmentFilter';

export default function SatisfactionSurveyModule({ 
  surveyData, 
  setSurveyData, 
  dimensions, 
  setDimensions, 
  employees, 
  onOpenAnonymousView, 
  maviYakaSurvey, 
  setMaviYakaSurvey, 
  maviYakaDimensions, 
  setMaviYakaDimensions, 
  surveyResponses, 
  setSurveyResponses 
}) {
  const [activeTab, setActiveTab] = useState('beyaz_yaka');
  
  return (
    <div className="satisfaction-module">
      <div className="profile-tabs glass" style={{ marginBottom: '1.5rem', background: '#F8FAFC' }}>
        <button className={`tab-btn ${activeTab==='beyaz_yaka'?'active':''}`} onClick={()=>setActiveTab('beyaz_yaka')}>📄 Beyaz Yaka Anketi</button>
        <button className={`tab-btn ${activeTab==='mavi_yaka'?'active':''}`} onClick={()=>setActiveTab('mavi_yaka')}>👷 Mavi Yaka Anketi</button>
        <button className={`tab-btn ${activeTab==='raporlama'?'active':''}`} onClick={()=>setActiveTab('raporlama')}>📈 Dinamik Raporlama</button>
        <button className={`tab-btn ${activeTab==='yorumlar'?'active':''}`} onClick={()=>setActiveTab('yorumlar')}>💡 Yorumlar & İçgörüler</button>
      </div>
      
      <div className="profile-content glass fade-in" style={{ padding: '2rem' }}>
        {activeTab === 'beyaz_yaka' && (
          <SurveyGrid 
            surveyData={surveyData} 
            setSurveyData={setSurveyData} 
            dimensions={dimensions} 
            setDimensions={setDimensions} 
            title="Beyaz Yaka Memnuniyeti" 
            description="Soruları varsayılan havuzdan silebilir, metinleri değiştirebilir veya yepyeni boyut/sorular tanımlayabilirsiniz."
            employees={employees} 
            onOpenAnonymousView={() => onOpenAnonymousView('beyaz')} 
          />
        )}
        {activeTab === 'mavi_yaka' && (
          <SurveyGrid 
            surveyData={maviYakaSurvey} 
            setSurveyData={setMaviYakaSurvey} 
            dimensions={maviYakaDimensions} 
            setDimensions={setMaviYakaDimensions} 
            title="Mavi Yaka Memnuniyeti" 
            description="Mavi yaka çalışanlar için özelleştirilmiş anket havuzu."
            employees={employees} 
            onOpenAnonymousView={() => onOpenAnonymousView('mavi')} 
            isBlueCollar={true}
          />
        )}
        {activeTab === 'raporlama' && <SurveyReport surveyResponses={surveyResponses} setSurveyResponses={setSurveyResponses} whiteDimensions={dimensions} blueDimensions={maviYakaDimensions} />}
        {activeTab === 'yorumlar' && <SurveyInterpretations surveyResponses={surveyResponses} whiteDimensions={dimensions} blueDimensions={maviYakaDimensions} />}
      </div>
    </div>
  );
}

function SurveyReport({ surveyResponses, setSurveyResponses, whiteDimensions, blueDimensions }) {
  const [filterType, setFilterType] = useState('both');
  const [selectedDept, setSelectedDept] = useState('all');

  const availableDepts = useMemo(() => {
     const depts = new Set();
     surveyResponses.forEach(r => {
        if(r.demographics && r.demographics.department) depts.add(r.demographics.department);
     });
     return Array.from(depts);
  }, [surveyResponses]);

  const chartData = useMemo(() => {
     const filtered = surveyResponses.filter(r => {
        if(filterType !== 'both' && r.type !== filterType) return false;
        if(selectedDept !== 'all' && r.demographics?.department !== selectedDept) return false;
        return true;
     });

     const allDims = new Set([...whiteDimensions, ...blueDimensions]);
     const dataMap = {};
     allDims.forEach(d => {
        dataMap[d] = { beyazTotal: 0, beyazCount: 0, maviTotal: 0, maviCount: 0, combinedTotal: 0, combinedCount: 0 };
     });

     filtered.forEach(r => {
        const scores = r.dimensionScores || {};
        Object.keys(scores).forEach(dim => {
           if(dataMap[dim]) {
              const val = scores[dim];
              if(r.type === 'beyaz') { dataMap[dim].beyazTotal += val; dataMap[dim].beyazCount += 1; }
              if(r.type === 'mavi') { dataMap[dim].maviTotal += val; dataMap[dim].maviCount += 1; }
              dataMap[dim].combinedTotal += val;
              dataMap[dim].combinedCount += 1;
           }
        });
     });

     return Object.keys(dataMap).map(dim => {
        const d = dataMap[dim];
        return {
           dimension: dim,
           beyaz: d.beyazCount > 0 ? (d.beyazTotal / d.beyazCount) : 0,
           mavi: d.maviCount > 0 ? (d.maviTotal / d.maviCount) : 0,
           combined: d.combinedCount > 0 ? (d.combinedTotal / d.combinedCount) : 0
        };
     }).filter(d => d.combined > 0).sort((a,b) => b.combined - a.combined);
  }, [surveyResponses, filterType, selectedDept, whiteDimensions, blueDimensions]);

  const generateMockData = () => {
     const mocks = [];
     const types = ['beyaz', 'mavi'];
     const depts = ['Saha Satış', 'Üretim', 'Finans', 'Kalite Kontrol', 'Lojistik'];
     for(let i=0; i<30; i++) {
        const t = types[Math.floor(Math.random() * 2)];
        const dims = t === 'beyaz' ? whiteDimensions : blueDimensions;
        let scores = {};
        dims.forEach(d => {
           let base = Math.random() * 2 + 2;
           if(d === 'Ücret') base = Math.random() * 1.5 + 1.5; 
           if(d === 'İş Arkadaşları' || d === 'İSG') base = Math.random() * 1 + 4;
           scores[d] = parseFloat(base.toFixed(2));
        });
        mocks.push({
           id: 'mock_'+Date.now()+'_'+i,
           date: new Date().toISOString(),
           type: t,
           demographics: { department: depts[Math.floor(Math.random() * depts.length)], seniority: Math.floor(Math.random()*10) },
           dimensionScores: scores
        });
     }
     setSurveyResponses(prev => [...prev, ...mocks]);
  };

  const top3 = chartData.slice(0, 3);
  const bottom3 = [...chartData].sort((a,b)=>a.combined - b.combined).slice(0, 3);

  return (
    <div className="survey-report fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
       <div className="filters-glass" style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Anket Hedef Kitlesi</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
               <button onClick={()=>setFilterType('both')} style={{ padding:'0.5rem 1rem', borderRadius:'6px', border:'none', background: filterType==='both'?'var(--primary)':'#E2E8F0', color: filterType==='both'?'white':'var(--text-main)', cursor:'pointer', fontWeight:600 }}>Tümü</button>
               <button onClick={()=>setFilterType('beyaz')} style={{ padding:'0.5rem 1rem', borderRadius:'6px', border:'none', background: filterType==='beyaz'?'#3B82F6':'#E2E8F0', color: filterType==='beyaz'?'white':'var(--text-main)', cursor:'pointer', fontWeight:600 }}>Beyaz Yaka</button>
               <button onClick={()=>setFilterType('mavi')} style={{ padding:'0.5rem 1rem', borderRadius:'6px', border:'none', background: filterType==='mavi'?'#10B981':'#E2E8F0', color: filterType==='mavi'?'white':'var(--text-main)', cursor:'pointer', fontWeight:600 }}>Mavi Yaka</button>
            </div>
          </div>
          <DepartmentFilter selectedDept={selectedDept} setSelectedDept={setSelectedDept} availableDepts={availableDepts} />
          <div style={{ marginLeft: 'auto' }}>
            <button onClick={generateMockData} style={{ background: '#eab308', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>⚡ 30 Rastgele Yanıt Üret</button>
          </div>
       </div>

       {surveyResponses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', background: 'white', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
             <h3>Sistemde Henüz Anket Verisi Yok</h3>
          </div>
       ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
               <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '12px', padding: '1.5rem' }}>
                  <h4 style={{ color: '#166534', margin: '0 0 1.2rem 0' }}>🟢 Güçlü Yönler</h4>
                  {top3.map(t => <div key={t.dimension} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><strong>{t.dimension}</strong> <span>{t.combined.toFixed(2)}</span></div>)}
               </div>
               <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '12px', padding: '1.5rem' }}>
                  <h4 style={{ color: '#991B1B', margin: '0 0 1.2rem 0' }}>🔴 Gelişim Alanları</h4>
                  {bottom3.map(t => <div key={t.dimension} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><strong>{t.dimension}</strong> <span>{t.combined.toFixed(2)}</span></div>)}
               </div>
            </div>
            <BarChart data={chartData} title={filterType === 'both' ? 'Beyaz vs Mavi Yaka Kıyaslaması' : 'Boyut Bazlı Memnuniyet Dağılımı'} filterType={filterType} />
          </>
       )}
    </div>
  );
}

function SurveyInterpretations({ surveyResponses, whiteDimensions, blueDimensions }) {
  const chartData = useMemo(() => {
     const allDims = new Set([...whiteDimensions, ...blueDimensions]);
     const dataMap = {};
     allDims.forEach(d => { dataMap[d] = { total: 0, count: 0 }; });
     surveyResponses.forEach(r => {
        const scores = r.dimensionScores || {};
        Object.keys(scores).forEach(dim => {
           if(dataMap[dim]) { dataMap[dim].total += scores[dim]; dataMap[dim].count += 1; }
        });
     });
     return Object.keys(dataMap).map(dim => {
        const d = dataMap[dim];
        return { dimension: dim, score: d.count > 0 ? (d.total / d.count) : 0 };
     }).filter(d => d.score > 0).sort((a,b) => b.score - a.score);
  }, [surveyResponses, whiteDimensions, blueDimensions]);

  if(surveyResponses.length === 0 || chartData.length === 0) return null;

  const averageScore = Number((chartData.reduce((acc, curr) => acc + curr.score, 0) / chartData.length).toFixed(2));
  const belowLimit = chartData.filter(d => d.score < 3.5);

  return (
    <div className="survey-interpretations fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
         <MetricCard title="Ölçek Genel Ortalaması" value={averageScore} unit="/ 5.0" gradient="linear-gradient(135deg, #1E1B4B 0%, #4338CA 100%)" />
         <MetricCard title="Kritik Alanlar" value={belowLimit.length} unit="adet" gradient="linear-gradient(135deg, #7F1D1D 0%, #DC2626 100%)" description="%70 sınırının altında" />
         <MetricCard title="En Güçlü Yön" value={chartData[0]?.dimension || '-'} unit="" gradient="linear-gradient(135deg, #064E3B 0%, #059669 100%)" description={`Skor: ${chartData[0]?.score.toFixed(2)}`} />
      </div>
      <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', border: '1px solid #E2E8F0' }}>
         <h3>📊 Memnuniyet Sınırı Analizi (%70 Alt Sınır)</h3>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
            {belowLimit.map(bl => (
               <div key={bl.dimension} style={{ background: '#FEF2F2', borderLeft: '4px solid #EF4444', padding: '1rem', borderRadius: '0 8px 8px 0' }}>
                  <strong>{bl.dimension}</strong>
                  <div style={{ fontSize: '1.6rem', color: '#DC2626', fontWeight: 800 }}>{bl.score.toFixed(2)}</div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
