import React, { useState } from 'react';

export default function AnonymousSurveyView({ surveyType, questions, dimensions, onSubmit, onCancel }) {
  const [demographics, setDemographics] = useState({ seniority: '', department: '' });
  const [answers, setAnswers] = useState({});

  const handleLikert = (qId, val) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(Object.keys(answers).length < questions.length && !window.confirm("Cevaplanmamış sorular var. Yine de göndermek istiyor musunuz?")) return;

    // Calculate dimensions based on the defined parametrism
    const scores = {};
    dimensions.forEach(d => scores[d] = { total: 0, count: 0 });

    questions.forEach(q => {
      const ans = answers[q.id];
      if(ans) {
        const points = q.isReverse ? (6 - ans) : ans; // The 6-x reverse coding rule
        if(scores[q.dimension]) {
           scores[q.dimension].total += points;
           scores[q.dimension].count += 1;
        }
      }
    });

    const finalAverages = {};
    dimensions.forEach(d => {
      if(scores[d].count > 0) {
        finalAverages[d] = parseFloat((scores[d].total / scores[d].count).toFixed(2));
      }
    });

    const responsePayload = {
      id: 'res_' + Date.now(),
      date: new Date().toISOString(),
      demographics,
      rawAnswers: answers,
      dimensionScores: finalAverages
    };

    onSubmit(responsePayload);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '2rem 1rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto', background: 'white', padding: '3rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
           <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)', margin: 0, fontWeight: 800 }}>
             {surveyType === 'islevsellik' ? 'Kurumsal İşlevsellik Anketi' : 'Çalışan Memnuniyet Anketi'}
           </h1>
           <button onClick={onCancel} style={{ background: 'transparent', border: '1px solid #e2e8f0', padding: '0.4rem 1rem', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}>🔒 Danışman Paneline Kaydır</button>
         </div>
         <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
           Lütfen aşağıdaki soruları kurumunuzdaki genel hislerinize göre yanıtlayın. <strong>Bu anket tamamen anonimdir</strong>, sizin kimliğinizi tespit edecek herhangi bir bilgi (isim, soyisim, e-posta) arka plana kaydedilmemektedir. Dürüst katılımınız kurum kültürünü iyileştirmek için hayati önem taşır.
         </p>

         <div style={{ background: '#F1F5F9', padding: '2rem', borderRadius: '12px', marginBottom: '3rem', border: '1px solid #E2E8F0' }}>
           <h3 style={{ fontSize: '1.2rem', margin: '0 0 1.5rem 0', color: 'var(--text-main)' }}>Demografik Bilgileriniz (İsteğe Bağlı)</h3>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
             <div>
               <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>Departmanınız</label>
               <input type="text" placeholder="Örn: Saha Satış" value={demographics.department} onChange={e=>setDemographics({...demographics, department: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }} />
             </div>
             <div>
               <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>Kurumdaki Kıdeminiz</label>
               <input type="number" min="0" placeholder="Örn: 3 Yıl" value={demographics.seniority} onChange={e=>setDemographics({...demographics, seniority: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }} />
             </div>
           </div>
         </div>

         <form onSubmit={handleSubmit}>
           {questions.map((q, i) => (
             <div key={q.id} style={{ marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px dashed #e2e8f0' }}>
               <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>{i+1}. {q.text}</p>
               <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                 {[1,2,3,4,5].map(val => (
                   <label key={val} onClick={() => handleLikert(q.id, val)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', background: answers[q.id] === val ? '#E0E7FF' : '#f8fafc', padding: '1rem', borderRadius: '12px', border: answers[q.id] === val ? '2px solid var(--primary)' : '2px solid transparent', transition: 'all 0.2s ease' }}>
                     <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: answers[q.id] === val ? 'var(--primary)' : 'white', border: '2px solid', borderColor: answers[q.id] === val ? 'var(--primary)' : '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {answers[q.id] === val && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }}></div>}
                     </div>
                     <span style={{ fontWeight: 700, color: answers[q.id] === val ? 'var(--primary)' : 'var(--text-muted)', fontSize: '1.2rem' }}>{val}</span>
                   </label>
                 ))}
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.8rem', padding: '0 1rem', fontWeight: 600 }}>
                 <span>1: Kesinlikle Katılmıyorum</span>
                 <span>5: Tamamen Katılıyorum</span>
               </div>
             </div>
           ))}
           
           <button type="submit" style={{ background: 'var(--primary)', color: 'white', padding: '1.2rem', width: '100%', border: 'none', borderRadius: '12px', fontSize: '1.2rem', fontWeight: 800, cursor: 'pointer', marginTop: '1rem', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)' }}>
             Anketi Anonim Olarak Tamamla ve Gönder
           </button>
         </form>
       </div>
    </div>
  )
}
