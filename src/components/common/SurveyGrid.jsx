import React, { useState } from 'react';

export default function SurveyGrid({ 
  surveyData, 
  setSurveyData, 
  dimensions, 
  setDimensions, 
  title, 
  description,
  employees, 
  onOpenAnonymousView, 
  isBlueCollar = false,
  primaryColor = 'var(--primary)',
  accentBackground = '#F0FDF4'
}) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [newQuestion, setNewQuestion] = useState({ text: '', dimension: dimensions[0] || '', isReverse: false });
  const [newDim, setNewDim] = useState('');
  const [selectedEmps, setSelectedEmps] = useState(employees ? employees.map(e => e.id) : []);
  const [isDeptExpanded, setIsDeptExpanded] = useState({});

  const handleEditClick = (q) => {
    setEditingId(q.id);
    setEditForm(q);
  };
  
  const saveEdit = () => {
    setSurveyData(prev => prev.map(q => q.id === editingId ? editForm : q));
    setEditingId(null);
  };
  
  const delQuestion = (id) => {
    if(window.confirm('Bu soruyu silmek istediğinizden emin misiniz?')) {
        setSurveyData(prev => prev.filter(q => q.id !== id));
    }
  };
  
  const addQuestion = (e) => {
    e.preventDefault();
    if(!newQuestion.text) return;
    setSurveyData(prev => [...prev, { id: 'q'+Date.now(), ...newQuestion }]);
    setNewQuestion({ text: '', dimension: dimensions[0], isReverse: false });
  };

  const addDimension = (e) => {
    e.preventDefault();
    if(!newDim || dimensions.includes(newDim)) return;
    setDimensions([...dimensions, newDim]);
    setNewDim('');
  };

  const toggleDept = (dept) => setIsDeptExpanded(prev => ({...prev, [dept]: !prev[dept]}));
  
  const handleEmpToggle = (id) => {
    setSelectedEmps(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSend = () => {
    if(selectedEmps.length === 0) return alert('Lütfen en az bir çalışan seçin.');
    alert(`${selectedEmps.length} adet çalışanın e-posta adresine anket katılım daveti ve anonim link gönderildi!`);
  };

  const groupedEmployees = employees ? employees.reduce((acc, emp) => {
    acc[emp.department] = acc[emp.department] || [];
    acc[emp.department].push(emp);
    return acc;
  }, {}) : {};

  return (
    <div className="survey-editor fade-in">
       <h4 style={{ fontSize: '1.25rem', color:'var(--text-main)', marginBottom:'0.5rem' }}>{title} - Anket Tasarımcısı</h4>
       <p className="section-desc" style={{ marginBottom: '2rem' }}>{description}</p>
       
       <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr', gap: '1.5rem', marginBottom: '2rem' }}>
         <form className="add-employee-form" onSubmit={addDimension} style={{ margin: 0, background: 'white' }}>
           <h5>✨ Yeni Boyut/Kategori Ekle</h5>
           <div className="emp-inputs" style={{display:'flex', gap:'0.5rem'}}>
             <input type="text" placeholder="Örn: Yenilikçilik" value={newDim} onChange={e=>setNewDim(e.target.value)} required style={{flex:1, minWidth:0}}/>
             <button className="add-btn" style={{padding:'0.6rem 1rem', background: primaryColor}}>Ekle</button>
           </div>
         </form>

         <form className="add-employee-form" onSubmit={addQuestion} style={{ margin: 0, background: 'white' }}>
           <h5>➕ Yeni Soru Ekle</h5>
           <div className="emp-inputs" style={{flexDirection: 'column', gap: '0.8rem'}}>
             <input type="text" placeholder="Soru metnini yazın..." value={newQuestion.text} onChange={e=>setNewQuestion({...newQuestion, text:e.target.value})} required style={{width:'100%'}}/>
             <div style={{display:'flex', gap:'1rem', alignItems:'center', flexWrap: 'wrap'}}>
               <select value={newQuestion.dimension} onChange={e=>setNewQuestion({...newQuestion, dimension: e.target.value})} style={{padding:'0.6rem', borderRadius:'6px', border:'1px solid #ccc', minWidth:'200px'}}>
                 {dimensions.map(d => <option key={d} value={d}>{d}</option>)}
               </select>
               <label className="checkbox-label" style={{display:'flex', alignItems:'center', gap:'0.5rem', fontWeight:'600', color:'var(--text-muted)', cursor:'pointer'}}>
                 <input type="checkbox" checked={newQuestion.isReverse} onChange={e=>setNewQuestion({...newQuestion, isReverse: e.target.checked})} style={{transform:'scale(1.2)'}}/>
                 Ters Kodlama (1=5, 5=1 Puan)
               </label>
               <button className="add-btn" style={{ marginLeft:'auto', background: primaryColor }}>Soru Ekle</button>
             </div>
           </div>
         </form>
       </div>

       <div className="table-wrapper">
         <table className="custom-table" style={{ fontSize: '0.95rem' }}>
           <thead style={{position: 'sticky', top: 0, background: '#f9fafb', zIndex: 1}}>
             <tr>
               <th style={{width: '60px'}}>No</th>
               <th style={{textAlign:'left'}}>Soru Metni (5'li Likert)</th>
               <th style={{textAlign:'left', width: '200px'}}>Boyut Kategorisi</th>
               <th style={{width: '120px'}}>Kodlama Tipi</th>
               <th style={{textAlign:'center', width: '100px'}}>İşlem</th>
             </tr>
           </thead>
           <tbody>
             {surveyData.map((q, idx) => {
               if(editingId === q.id) {
                 return (
                   <tr key={q.id} className="edit-row">
                     <td>{idx+1}</td>
                     <td><input type="text" className="edit-input" value={editForm.text} onChange={e=>setEditForm({...editForm, text: e.target.value})} style={{width:'100%'}}/></td>
                     <td>
                        <select className="edit-input" value={editForm.dimension} onChange={e=>setEditForm({...editForm, dimension: e.target.value})} style={{width:'100%'}}>
                          {dimensions.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                     </td>
                     <td style={{textAlign: 'center'}}>
                        <label style={{cursor:'pointer', fontWeight: 600}}>
                          <input type="checkbox" checked={editForm.isReverse} onChange={e=>setEditForm({...editForm, isReverse: e.target.checked})} /> Ters
                        </label>
                     </td>
                     <td style={{textAlign:'center', minWidth:'90px'}}>
                        <button className="action-btn save" onClick={saveEdit} title="Kaydet">💾</button>
                        <button className="action-btn cancel" onClick={()=>setEditingId(null)} title="İptal">❌</button>
                     </td>
                   </tr>
                 )
               }
               return (
                 <tr key={q.id}>
                    <td><strong>{idx+1}</strong></td>
                    <td style={{textAlign:'left', color:'var(--text-main)'}}>{q.text}</td>
                    <td style={{textAlign:'left'}}><span className="badge pending" style={{background:'#E0E7FF', color: primaryColor}}>{q.dimension}</span></td>
                    <td style={{fontWeight:'700', fontSize:'0.85rem', color: q.isReverse ? 'var(--danger)' : 'var(--success)'}}>{q.isReverse ? 'Ters (6-puan)' : 'Düz (1-5)'}</td>
                    <td style={{textAlign:'center'}}>
                      <button className="action-btn edit" onClick={()=>handleEditClick(q)} title="Düzenle">✏️</button>
                      <button className="action-btn del" onClick={()=>delQuestion(q.id)} title="Sil">🗑️</button>
                    </td>
                 </tr>
               )
             })}
           </tbody>
         </table>
       </div>

       {isBlueCollar ? (
         <div className="distribute-section glass fade-in" style={{ marginTop: '4rem', padding: '2.5rem', borderRadius: '16px', background: 'white', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
           <h4 style={{ fontSize: '1.4rem', color:'var(--text-main)', margin: '0 0 0.5rem 0' }}>Mavi Yaka Dağıtım ve Veri Toplama</h4>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
              <div className="dept-card" style={{ border: '2px dashed #CBD5E1', borderRadius: '12px', padding: '2rem', textAlign: 'center', background: '#F8FAFC' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
                <h5 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.8rem' }}>1. Dijital QR (Karekod) Afişi</h5>
                <button onClick={() => alert('PDF İndirildi!')} style={{ background: primaryColor, color: 'white', padding: '0.8rem', width: '100%', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>⏬ QR Afişini PDF Olarak İndir</button>
                <button onClick={onOpenAnonymousView} style={{ display: 'block', margin: '1rem auto 0 auto', background: 'transparent', color: primaryColor, border: 'none', textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}>👁️ Tıklandı Temsili (Anketi Gör)</button>
              </div>

              <div className="dept-card" style={{ border: '2px solid #E2E8F0', borderRadius: '12px', padding: '2rem', background: 'white' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>📄</div>
                <h5 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.8rem', textAlign: 'center' }}>2. Kağıt Anketler İçin Hızlı Giriş</h5>
                <textarea disabled placeholder="Örn (Birinci İşçinin Cevapları yanyana): 5, 4, 3, 2, 5, 5, 4..." style={{ width: '100%', minHeight: '80px', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '1rem', resize: 'none', opacity: 0.5 }}></textarea>
                <button onClick={() => alert('Kağıt form başarıyla kaydedildi!')} style={{ background: '#10B981', color: 'white', padding: '0.8rem', width: '100%', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>💾 Bu Formu Havuza Ekle ve Temizle</button>
              </div>
           </div>
         </div>
       ) : (
         employees && employees.length > 0 && (
          <div className="distribute-section glass fade-in" style={{ marginTop: '4rem', padding: '2.5rem', borderRadius: '16px', background: 'white', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <h4 style={{ fontSize: '1.4rem', color:'var(--text-main)', margin: '0 0 0.5rem 0' }}>Anket Dağıtımı ve E-Posta Gönderimi</h4>
            <p className="section-desc" style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>Anketi göndermek istediğiniz çalışanları departman veya pozisyonlarına göre kontrol edin.</p>
            
            <div className="dept-groups" style={{ margin: '2rem 0', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'1.5rem' }}>
              {Object.keys(groupedEmployees).map(dept => (
                <div key={dept} className="dept-card" style={{ border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden' }}>
                   <div onClick={() => toggleDept(dept)} style={{ background: '#F8FAFC', padding: '1.2rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1.05rem' }}>🏢 {dept} ({groupedEmployees[dept].length} Personel)</span>
                     <span style={{ color: primaryColor, fontSize: '1.2rem' }}>{isDeptExpanded[dept] ? '▲' : '▼'}</span>
                   </div>
                   {isDeptExpanded[dept] && (
                     <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', background: 'white' }}>
                       {groupedEmployees[dept].map(emp => (
                         <label key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '6px', background: selectedEmps.includes(emp.id) ? accentBackground : 'transparent', transition: 'background 0.2s' }}>
                           <input type="checkbox" checked={selectedEmps.includes(emp.id)} onChange={() => handleEmpToggle(emp.id)} style={{ transform: 'scale(1.3)' }} />
                           <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>{emp.name}</span>
                           <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: '#F1F5F9', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>{emp.title}</span>
                         </label>
                       ))}
                     </div>
                   )}
                </div>
              ))}
            </div>
   
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button onClick={handleSend} style={{ background: primaryColor, color: 'white', padding: '1.2rem 3rem', fontSize: '1.2rem', fontWeight: 800, border: 'none', borderRadius: '12px', cursor: 'pointer', boxShadow: `0 4px 15px ${primaryColor}66` }}>
                🚀 Seçili Kişilere Davet Gönder ({selectedEmps.length})
              </button>
              
              <button onClick={onOpenAnonymousView} style={{ background: '#F1F5F9', color: '#0F172A', fontWeight: 700, padding: '1.2rem 2rem', border: '2px dashed #94A3B8', borderRadius: '12px', cursor: 'pointer', fontSize: '1.05rem', transition: 'all 0.2s' }}>
                👁️ Çalışan Gözünden Anketi Gör / Doldur
              </button>
            </div>
          </div>
         )
       )}
    </div>
  );
}
