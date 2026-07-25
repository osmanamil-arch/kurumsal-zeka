import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './MeetingsModule.css';

export default function MeetingsModule({ employees = [], meetings, setMeetings, dailyTasks, setDailyTasks }) {

  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, past
  const [showWizard, setShowWizard] = useState(false);
  const [activeMeetingId, setActiveMeetingId] = useState(null);

  // New Meeting Form
  const [newMeeting, setNewMeeting] = useState({ title: '', date: '', agenda: '', participants: [] });
  // New Decision Form inside meeting
  const [newDecision, setNewDecision] = useState({ title: '', desc: '', owner: '' });

  const activeMeeting = useMemo(() => meetings.find(m => m.id === activeMeetingId), [meetings, activeMeetingId]);

  const upcomingMeetings = useMemo(() => {
    return meetings.filter(m => new Date(m.date) >= new Date(new Date().setHours(0,0,0,0))).sort((a,b) => new Date(a.date) - new Date(b.date));
  }, [meetings]);
  
  const pastMeetings = useMemo(() => {
    return meetings.filter(m => new Date(m.date) < new Date(new Date().setHours(0,0,0,0))).sort((a,b) => new Date(b.date) - new Date(a.date));
  }, [meetings]);

  const displayedList = activeTab === 'upcoming' ? upcomingMeetings : pastMeetings;

  // Handlers
  const handleCreateMeeting = () => {
    if (!newMeeting.title || !newMeeting.date) return alert("Başlık ve tarih zorunludur.");
    const m = {
      ...newMeeting,
      id: `meet_${Date.now()}`,
      notes: '',
      decisions: []
    };
    setMeetings([...meetings, m]);
    setShowWizard(false);
    setNewMeeting({ title: '', date: '', agenda: '', participants: [] });
  };

  const toggleParticipant = (empId) => {
    if (newMeeting.participants.includes(empId)) {
      setNewMeeting({...newMeeting, participants: newMeeting.participants.filter(id => id !== empId)});
    } else {
      setNewMeeting({...newMeeting, participants: [...newMeeting.participants, empId]});
    }
  };

  const handleUpdateNotes = (e) => {
    const text = e.target.value;
    const updated = meetings.map(m => m.id === activeMeetingId ? {...m, notes: text} : m);
    setMeetings(updated);
  };

  const handleAddDecision = () => {
    if(!newDecision.title) return;
    const decId = `dec_${Date.now()}`;
    const updated = meetings.map(m => {
      if (m.id === activeMeetingId) {
        return {
          ...m, 
          decisions: [...(m.decisions||[]), { 
            id: decId, 
            title: newDecision.title, 
            desc: newDecision.desc, 
            owner: newDecision.owner, 
            date: new Date().toISOString().split('T')[0],
            convertedToTask: false
          }]
        }
      }
      return m;
    });
    setMeetings(updated);
    setNewDecision({ title: '', desc: '', owner: '' });
  };

  const convertToTask = (decision) => {
    if(!decision.owner) {
      alert("Görev oluşturmak için bu karara bir sorumlu atamalısınız (Çalışan rehberini kullanın).");
      return;
    }
    // Create Task
    const taskRecord = {
      id: `daily_${Date.now()}`,
      title: decision.title,
      owner: decision.owner,
      deadline: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0], // 1 hafta süre by default
      linkedGoalId: null,
      status: 'bekliyor',
      linkedMeetingParam: activeMeeting.title
    };
    setDailyTasks([...dailyTasks, taskRecord]);

    // Mark decision as converted
    const updated = meetings.map(m => {
      if (m.id === activeMeetingId) {
        return {
          ...m,
          decisions: m.decisions.map(d => d.id === decision.id ? {...d, convertedToTask: true} : d)
        }
      }
      return m;
    });
    setMeetings(updated);
    alert("Karar, 'Görev ve Takip' sekmesine yeni bir görev olarak aktarıldı! ✨");
  };


  /** VIEW MODE - LIST LISTINGS */
  if (activeMeetingId === null) {
    return (
      <div className="meetings-module fade-in">
        <div className="meetings-header">
           <h2>Toplantı ve Karar Yönetimi</h2>
           <button className="primary-btn" onClick={() => setShowWizard(true)}>+ Yeni Toplantı Planla</button>
        </div>

        <div className="guide-box">
          <p><strong>💡 Rehber: </strong> Şirket içi tüm toplantıları ve alınan kararları buradan kayıt altına alıp takip edebilirsiniz.</p>
          <p>Toplantı sonunda alınan kararları kaydedin. Daha sonra bu kararları direkt olarak göreve dönüştürerek günlük çalışma sisteminize entegre edebilirsiniz.</p>
        </div>

        <div className="view-tabs">
          <button className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>Yaklaşan Toplantılar</button>
          <button className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`} onClick={() => setActiveTab('past')}>Geçmiş Toplantılar</button>
        </div>

        <div className="meetings-grid">
           {displayedList.length === 0 && <p style={{color: '#64748b', padding: '1rem'}}>Bu kriterde toplantı bulunamadı.</p>}
           {displayedList.map(m => (
             <div className="meeting-card fade-in" key={m.id} onClick={() => setActiveMeetingId(m.id)}>
                <div className="m-title">{m.title}</div>
                <div className="m-date">📅 {m.date}</div>
                <div style={{fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem'}}>Gündem: {m.agenda || 'Belirtilmedi'}</div>
                <div className="m-tags">
                  {m.participants.slice(0, 3).map(pId => {
                     const emp = employees.find(e => e.id === pId);
                     return <span key={pId} className="m-tag">{emp ? emp.name : 'Unknown'}</span>
                  })}
                  {m.participants.length > 3 && <span className="m-tag">+{m.participants.length - 3} Diğer</span>}
                </div>
                {m.decisions && m.decisions.length > 0 && (
                  <div style={{marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem', fontSize: '0.8rem', color: '#10b981', fontWeight: 600}}>
                    ✓ {m.decisions.length} Alınan Karar
                  </div>
                )}
             </div>
           ))}
        </div>

        {/* CREATE MODAL */}
        {showWizard && (
          <div className="modal-overlay">
            <div className="modal-content fade-in">
              <div className="modal-header">Yeni Toplantı Planla</div>
              
              <div className="form-group">
                <label>Toplantı Başlığı</label>
                <input type="text" className="form-input" value={newMeeting.title} onChange={e => setNewMeeting({...newMeeting, title: e.target.value})} placeholder="Örn: Haftalık Satış Değerlendirmesi" />
              </div>
              
              <div className="form-group">
                <label>Tarih & Saat</label>
                <input type="datetime-local" className="form-input" value={newMeeting.date} onChange={e => setNewMeeting({...newMeeting, date: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Gündem Özeti</label>
                <input type="text" className="form-input" value={newMeeting.agenda} onChange={e => setNewMeeting({...newMeeting, agenda: e.target.value})} placeholder="Örn: 3. Çeyrek ciro hedefleri incelenecek" />
              </div>

              <div className="form-group" style={{background: '#f8fafc', padding: '1rem', borderRadius: '8px'}}>
                <label>Katılımcılar (Çalışan Rehberinden Seçiniz)</label>
                <select className="form-input" onChange={e => toggleParticipant(e.target.value)} value="">
                   <option value="">Kişi Ekle...</option>
                   {employees.filter(e => !newMeeting.participants.includes(e.id)).map(e => (
                     <option key={e.id} value={e.id}>{e.name} ({e.title})</option>
                   ))}
                </select>
                <div className="multi-select-wrap">
                  {newMeeting.participants.map(pid => {
                     const e = employees.find(emp => emp.id === pid);
                     return <span key={pid} className="emp-pill">{e?.name} <button onClick={() => toggleParticipant(pid)}>×</button></span>
                  })}
                </div>
              </div>

              <div className="modal-actions">
                <button className="secondary-btn" onClick={() => setShowWizard(false)}>İptal</button>
                <button className="primary-btn" onClick={handleCreateMeeting}>Toplantıyı Planla</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /** DETAILED MEETING VIEW */
  return (
    <div className="meetings-module fade-in">
       <button className="back-btn" onClick={() => setActiveMeetingId(null)}>← Tüm Toplantılara Dön</button>
       
       <div className="guide-box">
          <p><strong>💡 İpucu: </strong> Toplantı notlarındaki eyleme geçilmesi gereken tartışmaları "Kararlar" tablosuna ekleyin. Her karar metnini daha sonra bir Görev kartına tek tıkla dönüştürebilirsiniz.</p>
       </div>

       <div className="meeting-detail-view">
          <div className="detail-main">
             <h1 style={{margin: '0 0 0.5rem 0', color: '#0f172a'}}>{activeMeeting.title}</h1>
             <p style={{color: '#64748b', margin: '0 0 2rem 0', display: 'flex', gap:'1rem'}}>
               <span>📅 {new Date(activeMeeting.date).toLocaleString('tr-TR')}</span>
               <span>📋 Gündem: {activeMeeting.agenda || '-'}</span>
             </p>

             <div className="info-block">
                <h3>Toplantı Notları</h3>
                <textarea 
                  className="form-input" 
                  style={{width: '100%', minHeight: '150px', resize: 'vertical'}} 
                  placeholder="Toplantı esnasında alınan genel notları buraya yazabilirsiniz..."
                  value={activeMeeting.notes || ''}
                  onChange={handleUpdateNotes}
                />
             </div>

             <div className="info-block">
                <h3>Alınan Kararlar ({(activeMeeting.decisions || []).length})</h3>
                {!(activeMeeting.decisions?.length > 0) && <p>Henüz karar kaydedilmemiş.</p>}
                
                {(activeMeeting.decisions || []).map(dec => {
                   const ownerObj = employees.find(e => e.id === dec.owner);
                   return (
                     <div className="decision-card" key={dec.id}>
                        <div style={{display:'flex', justifyContent: 'space-between'}}>
                          <h4>{dec.title}</h4>
                          <span style={{fontSize: '0.8rem', color: '#64748b'}}>{dec.date}</span>
                        </div>
                        <p>{dec.desc}</p>
                        <div style={{display:'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                          <span className="m-tag">👤 Sorumlu: {ownerObj ? ownerObj.name : 'Belirtilmedi'}</span>
                          <button 
                             className="task-convert-btn" 
                             disabled={dec.convertedToTask}
                             onClick={() => convertToTask(dec)}
                          >
                             {dec.convertedToTask ? '✓ Göreve Dönüştürüldü' : '⚡ Göreve Dönüştür (Takibe Al)'}
                          </button>
                        </div>
                     </div>
                   )
                })}
             </div>
          </div>

          <div className="detail-sidebar">
             <div className="quick-form">
                <div className="qf-title">Katılımcılar</div>
                <div className="multi-select-wrap" style={{marginTop: 0}}>
                  {activeMeeting.participants.map(pid => {
                     const e = employees.find(emp => emp.id === pid);
                     return <span key={pid} className="emp-pill" style={{background: '#f1f5f9', color: '#475569'}}>{e?.name}</span>
                  })}
                  {activeMeeting.participants.length === 0 && <span style={{fontSize: '0.85rem', color: '#94a3b8'}}>Eklenmedi.</span>}
                </div>
             </div>

             <div className="quick-form" style={{borderColor: '#10b981', background: '#f0fdf4'}}>
                <div className="qf-title" style={{color: '#065f46'}}>Yeni Karar Ekle</div>
                <input type="text" className="form-input" placeholder="Karar Başlığı" value={newDecision.title} onChange={e => setNewDecision({...newDecision, title: e.target.value})} />
                <textarea className="form-input" placeholder="Açıklama (Opsiyonel)" rows={2} value={newDecision.desc} onChange={e => setNewDecision({...newDecision, desc: e.target.value})} />
                <select className="form-input" value={newDecision.owner} onChange={e => setNewDecision({...newDecision, owner: e.target.value})}>
                  <option value="">Sorumlu Seç...</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
                <button className="primary-btn" style={{padding: '0.5rem', width: '100%'}} onClick={handleAddDecision}>Kararı Kaydet</button>
             </div>
          </div>
       </div>
    </div>
  );
}
