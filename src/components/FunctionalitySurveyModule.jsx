import React, { useState, useMemo } from 'react';
import SurveyGrid from './common/SurveyGrid';
import BarChart from './common/BarChart';
import MetricCard from './common/MetricCard';
import DepartmentFilter from './common/DepartmentFilter';

const DIMENSION_DESCRIPTIONS = {
  "Sosyal Etkinlik": "İşletmenin çalışanlar için sağlamış olduğu sosyal faydaların tümünü ifade etmektedir.",
  "Kurum Kültürü ve Normlar": "Bir kuruluş ve bir işletmede biçimsel yapıyı karşılıklı olarak etkileme niteliğindeki kurum içi değerler, inançlar ve alışkanlıkları ifade etmektedir.",
  "Çatışma": "Bireyler ya da gruplar arasında fikir uyuşmazlığından dolayı ortaya çıkan zıtlıkları ifade etmektedir.",
  "Vizyon-Misyon-Hedefler": "İşletmenin varoluş nedeni ile gelecekte gelmek istediği nokta ve bu yolda izleyeceği adımlar ile sürdürülebilir bir firma olmasını ifade etmektedir.",
  "Üretkenlik ve Verimlilik": "Girdileri çıktıya dönüştürme ölçüsü. Verilmiş girdiler çıktıya ne ölçüde dönüştürülebilirse üretkenliğin de o ölçüde yüksek olduğu dile getirilmektedir.",
  "Kurallar ve Prosedürler": "Tipik olarak değişmez ve standartlaştırılmış ve tutarlı nihai sonuçlara ulaşmak için aynı sırayla gerçekleştirilen eylemler bütününü ifade etmektedir.",
  "İletişim": "İşletmenin amaç ve hedeflerine ulaşabilmek için bölüm ve unsurlar arasında bilgi akışını tanımlar.",
  "Liderlik": "Bir grup insanı belirli amaçlar etrafında toplayabilme ve onları harekete geçirme yeteneğidir.",
  "Üretkenlik Karşıtı Davranışlar": "Çalışanların bilinçli olarak örgüt ve örgüt üyelerine zarar vermeleridir.",
  "Kaynaklara Erişim Adaleti": "Tüm çalışanların işletme içerisindeki kaynaklara erişim hakkının aynı olmasını tanımlar.",
  "Kurumsal Bilgi Akışı": "Kurum içinde üretilen veya kuruma dışarıdan gelen her türlü bilgiyi ifade eder."
};

export default function FunctionalitySurveyModule({ 
  surveyData, 
  setSurveyData, 
  dimensions, 
  setDimensions, 
  employees, 
  onOpenAnonymousView, 
  functionalityResponses, 
  setFunctionalityResponses 
}) {
  const [activeTab, setActiveTab] = useState('islevsellik');
  
  return (
    <div className="satisfaction-module">
      <div className="profile-tabs glass" style={{ marginBottom: '1.5rem', background: '#F8FAFC' }}>
        <button className={`tab-btn ${activeTab==='islevsellik'?'active':''}`} onClick={()=>setActiveTab('islevsellik')}>🏢 Kurumsal İşlevsellik Anketi</button>
        <button className={`tab-btn ${activeTab==='raporlama'?'active':''}`} onClick={()=>setActiveTab('raporlama')}>📈 Dinamik Raporlama</button>
        <button className={`tab-btn ${activeTab==='yorumlar'?'active':''}`} onClick={()=>setActiveTab('yorumlar')}>💡 Yorumlar & İçgörüler</button>
      </div>
      
      <div className="profile-content glass fade-in" style={{ padding: '2rem' }}>
        {activeTab === 'islevsellik' && (
          <SurveyGrid 
            surveyData={surveyData} 
            setSurveyData={setSurveyData} 
            dimensions={dimensions} 
            setDimensions={setDimensions} 
            title="Kurumsal İşlevsellik" 
            description="İşletmenin kurumsal sistem ve süreçlerinin performansını ölçen anket havuzu."
            employees={employees} 
            onOpenAnonymousView={() => onOpenAnonymousView('islevsellik')} 
            primaryColor="#8B5CF6"
            accentBackground="#F5F3FF"
          />
        )}
        {activeTab === 'raporlama' && <SurveyReport surveyResponses={functionalityResponses} setSurveyResponses={setFunctionalityResponses} dimensions={dimensions} />}
        {activeTab === 'yorumlar' && <SurveyInterpretations surveyResponses={functionalityResponses} dimensions={dimensions} />}
      </div>
    </div>
  );
}

function SurveyReport({ surveyResponses, setSurveyResponses, dimensions }) {
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
        if(selectedDept !== 'all' && r.demographics?.department !== selectedDept) return false;
        return true;
     });
     const dataMap = {};
     dimensions.forEach(d => { dataMap[d] = { total: 0, count: 0 }; });
     filtered.forEach(r => {
        const scores = r.dimensionScores || {};
        Object.keys(scores).forEach(dim => {
           if(dataMap[dim]) { dataMap[dim].total += scores[dim]; dataMap[dim].count += 1; }
        });
     });
     return Object.keys(dataMap).map(dim => {
        const d = dataMap[dim];
        return { dimension: dim, score: d.count > 0 ? (d.total / d.count) : 0 };
     }).filter(d => d.score > 0).sort((a,b) => b.score - a.score);
  }, [surveyResponses, selectedDept, dimensions]);

  const generateMockData = () => {
     const mocks = [];
     const depts = ['Saha Satış', 'Üretim', 'Finans', 'Kalite Kontrol', 'Lojistik'];
     for(let i=0; i<30; i++) {
        let scores = {};
        dimensions.forEach(d => {
           let base = Math.random() * 2 + 2.5;
           if(d === 'Üretkenlik Karşıtı Davranışlar') base = Math.random() * 2 + 1.5; 
           scores[d] = parseFloat(base.toFixed(2));
        });
        mocks.push({
           id: 'mock_'+Date.now()+'_'+i,
           date: new Date().toISOString(),
           type: 'islevsellik',
           demographics: { department: depts[Math.floor(Math.random() * depts.length)] },
           dimensionScores: scores
        });
     }
     setSurveyResponses(prev => [...prev, ...mocks]);
  };

  return (
    <div className="survey-report fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
       <div className="filters-glass" style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <DepartmentFilter selectedDept={selectedDept} setSelectedDept={setSelectedDept} availableDepts={availableDepts} />
          <button onClick={generateMockData} style={{ marginLeft: 'auto', background: '#8B5CF6', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>⚡ 30 Rastgele Yanıt Üret</button>
       </div>
       {surveyResponses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', background: 'white', borderRadius: '12px', border: '1px dashed #CBD5E1' }}><h3>Veri Yok</h3></div>
       ) : (
          <BarChart data={chartData} title="İşlevsellik Boyut Dağılımı" primaryLabel="İşlevsellik Skoru" primaryColor="linear-gradient(to top, #8B5CF6, #C4B5FD)" showSecondary={false} />
       )}
    </div>
  );
}

function SurveyInterpretations({ surveyResponses, dimensions }) {
  const chartData = useMemo(() => {
     const dataMap = {};
     dimensions.forEach(d => { dataMap[d] = { total: 0, count: 0 }; });
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
  }, [surveyResponses, dimensions]);

  if(surveyResponses.length === 0 || chartData.length === 0) return null;

  const averageScore = Number((chartData.reduce((acc, curr) => acc + curr.score, 0) / chartData.length).toFixed(2));
  const belowLimit = chartData.filter(d => d.score < 3.5);

  return (
    <div className="survey-interpretations fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
         <MetricCard title="Genel İşlevsellik" value={averageScore} unit="/ 5.0" gradient="linear-gradient(135deg, #1E1B4B 0%, #4338CA 100%)" />
         <MetricCard title="Riskli Alanlar" value={belowLimit.length} unit="adet" gradient="linear-gradient(135deg, #7F1D1D 0%, #DC2626 100%)" description="Kritik seviye" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        {chartData.map(d => (
          <div key={d.dimension} style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '10px', padding: '1rem' }}>
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#0369A1' }}>{d.dimension}</h5>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#0C4A6E' }}>{DIMENSION_DESCRIPTIONS[d.dimension] || 'Açıklama yok.'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
