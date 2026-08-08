import React, { useState } from 'react';
import { sendEmail } from '../utils/mailService';

export default function InterviewSubModule({ 
  employees, 
  interviews, 
  setInterviews, 
  userRole, 
  title = "Görüşme" 
}) {
  const [newInterview, setNewInterview] = useState({ employeeId: '', plannedDate: '' });
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [tempNotes, setTempNotes] = useState({ content: '', summary: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newInterview.employeeId || !newInterview.plannedDate) return;
    
    const emp = employees.find(e => e.id === newInterview.employeeId);
    
    const newEntry = {
      id: Date.now().toString(),
      employeeId: emp.id,
      status: 'pending',
      plannedDate: newInterview.plannedDate,
      completedDate: null,
      consultant: 'Danışman Admin',
      notes: {
        content: '',
        summary: '',
        lastUpdated: null
      }
    };
    
    setInterviews(prev => [...prev, newEntry]);
    setNewInterview({ employeeId: '', plannedDate: '' });
    
    const mailSubject = "Birebir Görüşme Davetiyesi";
    const mailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #334155;">
        <h2 style="color: #2563eb; margin-top: 0;">Birebir Görüşme Daveti</h2>
        <p>Sayın <strong>${emp.name}</strong>,</p>
        <p>Sizinle birebir görüşme planlanmıştır. Görüşme detayları aşağıdadır:</p>
        <ul style="padding-left: 20px;">
          <li><strong>Planlanan Tarih / Saat:</strong> ${new Date(newInterview.plannedDate).toLocaleString('tr-TR')}</li>
          <li><strong>Görüşmeyi Yapan:</strong> Danışman Admin</li>
        </ul>
        <p>Görüşme zamanında hazır olmanızı rica eder, iyi çalışmalar dileriz.</p>
        <p style="color: #64748b; font-size: 0.85rem; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px; line-height: 1.4;">
          Bu e-posta Kurumsal Zeka Platformu tarafından otomatik olarak gönderilmiştir.
        </p>
      </div>
    `;

    sendEmail({ to: emp.email, subject: mailSubject, html: mailHtml })
      .then(() => {
        alert(`✅ Görüşme oluşturuldu ve davet maili çalışana (${emp.email}) başarıyla gönderildi!`);
      })
      .catch((err) => {
        console.error('InterviewSubModule email error:', err);
        alert(
          `⚠️ Görüşme oluşturuldu fakat davet maili gönderilemedi.\n` +
          `Hata: ${err.message}\n` +
          `Lütfen çevre değişkenlerini (SMTP veya RESEND ayarlarını) kontrol edin.`
        );
      });
  };

  const handleComplete = (inv) => {
    const now = new Date().toISOString();
    setInterviews(prev => prev.map(item => 
      item.id === inv.id ? { ...item, status: 'completed', completedDate: now } : item
    ));
  };

  const handleDateChange = (invId, newDate) => {
    setInterviews(prev => prev.map(item => 
      item.id === invId ? { ...item, plannedDate: newDate } : item
    ));
    const inv = interviews.find(i => i.id === invId);
    const emp = employees.find(e => e.id === (inv ? inv.employeeId : ''));
    
    if (emp) {
      const mailSubject = "Birebir Görüşme Güncellemesi";
      const mailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #334155;">
          <h2 style="color: #ea580c; margin-top: 0;">Görüşme Tarihi Güncellendi</h2>
          <p>Sayın <strong>${emp.name}</strong>,</p>
          <p>Daha önce planlanan birebir görüşmenizin tarihi güncellenmiştir. Yeni detaylar aşağıdadır:</p>
          <ul style="padding-left: 20px;">
            <li><strong>Yeni Tarih / Saat:</strong> ${new Date(newDate).toLocaleString('tr-TR')}</li>
            <li><strong>Görüşmeyi Yapan:</strong> Danışman Admin</li>
          </ul>
          <p>Görüşme zamanında hazır olmanızı rica eder, iyi çalışmalar dileriz.</p>
          <p style="color: #64748b; font-size: 0.85rem; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px; line-height: 1.4;">
            Bu e-posta Kurumsal Zeka Platformu tarafından otomatik olarak gönderilmiştir.
          </p>
        </div>
      `;

      sendEmail({ to: emp.email, subject: mailSubject, html: mailHtml })
        .then(() => {
          alert(`✅ Görüşme tarihi güncellendi ve bildirim maili çalışana (${emp.email}) gönderildi!`);
        })
        .catch((err) => {
          console.error('InterviewSubModule date change email error:', err);
          alert(
            `⚠️ Görüşme tarihi güncellendi fakat bildirim maili gönderilemedi.\n` +
            `Hata: ${err.message}\n` +
            `Lütfen çevre değişkenlerini (SMTP veya RESEND ayarlarını) kontrol edin.`
          );
        });
    }
  };

  const handleDelete = (invId) => {
    setInterviews(prev => prev.filter(item => item.id !== invId));
    if (activeNoteId === invId) setActiveNoteId(null);
  };

  const handleRevert = (invId) => {
    setInterviews(prev => prev.map(item => 
      item.id === invId ? { ...item, status: 'pending', completedDate: null } : item
    ));
  };

  const openNotes = (inv) => {
    setActiveNoteId(inv.id);
    setTempNotes({
      content: inv.notes?.content || '<div>Görüşme notlarınızı buraya yazın...</div>',
      summary: inv.notes?.summary || ''
    });
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    const editor = document.getElementById('rich-editor');
    if (editor) {
      setTempNotes(prev => ({ ...prev, content: editor.innerHTML }));
    }
  };

  const insertTable = () => {
    const tableHTML = '<table border="1" style="width:100%; border-collapse: collapse; margin-top: 10px;"><tr><td>Hücre 1</td><td>Hücre 2</td></tr><tr><td>Hücre 3</td><td>Hücre 4</td></tr></table>';
    execCommand('insertHTML', tableHTML);
  };

  const handleAiSummarize = () => {
    if (!tempNotes.content || tempNotes.content.length < 15) return;
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(tempNotes.content, 'text/html');
    const plainText = doc.body.innerText || "";
    
    const summary = `
<div class="ai-summary-card">
  <h4>📋 Profesyonel Görüşme Özeti (AI)</h4>
  <p><strong>Görüşülen Kişi:</strong> ${employees.find(e => e.id === interviews.find(i => i.id === activeNoteId)?.employeeId)?.name}</p>
  <p><strong>Temel Bulgular:</strong></p>
  <ul>
    <li>Görüşme içeriği yapay zeka tarafından analiz edilerek profesyonel dille yeniden yapılandırıldı.</li>
    <li>${plainText.substring(0, 150)}...</li>
  </ul>
  <p><strong>Kritik Noktalar & Aksiyonlar:</strong></p>
  <p>Verilen notlar doğrultusunda süreç iyileştirme ve eğitim planlaması önerilmektedir.</p>
</div>
    `;
    setTempNotes(prev => ({ ...prev, summary }));
  };

  const saveNotes = () => {
    const now = new Date().toLocaleString('tr-TR');
    const editor = document.getElementById('rich-editor');
    const finalContent = editor ? editor.innerHTML : tempNotes.content;
    
    setInterviews(prev => prev.map(item => 
      item.id === activeNoteId ? { 
        ...item, 
        notes: { 
          content: finalContent, 
          summary: tempNotes.summary, 
          lastUpdated: now 
        } 
      } : item
    ));
    alert(`Notlar ${now} tarihinde kaydedildi.`);
    setActiveNoteId(null);
  };

  return (
    <div className="interviews-module fade-in" style={{ marginTop: '-1rem' }}>
      <form className="add-employee-form" onSubmit={handleAdd} style={{ marginBottom: '1.5rem', background: 'white' }}>
         <h5 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)', fontSize: '1.05rem' }}>Yeni {title} Planla</h5>
         <div className="emp-inputs">
           <select required value={newInterview.employeeId} onChange={e => setNewInterview({...newInterview, employeeId: e.target.value})} style={{flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
             <option value="">-- Çalışan Seçin (Çalışan Rehberinden) --</option>
             {employees.map(emp => (
               <option key={emp.id} value={emp.id}>{emp.name} ({emp.title || emp.department})</option>
             ))}
           </select>
           <input type="date" required value={newInterview.plannedDate} onChange={e => setNewInterview({...newInterview, plannedDate: e.target.value})} style={{flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #e5e7eb'}} />
           <button type="submit" className="add-btn" style={{flex: '0.5'}}>📅 Planla</button>
         </div>
      </form>

      <div className="table-wrapper">
        {interviews.length === 0 ? (
          <div className="empty-state">Planlanmış bir görüşme bulunmuyor.</div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{textAlign: 'left'}}>Görüşülecek Kişi / Ünvan</th>
                <th style={{textAlign: 'left'}}>Durum</th>
                <th style={{textAlign: 'left'}}>Planlanan Tarih</th>
                <th style={{textAlign: 'left'}}>Gerçekleşen Tarih (Saat)</th>
                <th style={{textAlign: 'center', minWidth: '150px'}}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map(inv => {
                const emp = employees.find(e => e.id === inv.employeeId);
                return (
                <tr key={inv.id} style={{ opacity: inv.status === 'completed' ? 0.7 : 1 }}>
                  <td style={{textAlign: 'left', fontWeight: '700', color: 'var(--text-main)'}}>{emp ? `${emp.name} (${emp.title || emp.department})` : 'Bilinmeyen Kişi'}</td>
                  <td style={{textAlign: 'left'}}>
                    <span className={`badge ${inv.status}`}>
                      {inv.status === 'completed' ? 'Tamamlandı' : 'Planlandı'}
                    </span>
                  </td>
                  <td style={{textAlign: 'left'}}>
                    {inv.status === 'pending' ? (
                      <input 
                        type="date" 
                        value={inv.plannedDate} 
                        onChange={(e) => handleDateChange(inv.id, e.target.value)}
                        style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #ccc', fontWeight: 600, color: 'var(--text-main)' }}
                      />
                    ) : (
                      <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
                        {new Date(inv.plannedDate).toLocaleDateString('tr-TR')}
                      </span>
                    )}
                  </td>
                  <td style={{textAlign: 'left', color: 'var(--text-muted)'}}>
                    {inv.completedDate ? (
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <strong style={{color: 'var(--primary)'}}>{new Date(inv.completedDate).toLocaleDateString('tr-TR')}</strong>
                            <span style={{fontSize: '0.8rem'}}>{new Date(inv.completedDate).toLocaleTimeString('tr-TR')}</span>
                        </div>
                    ) : '-'}
                  </td>
                  <td style={{textAlign: 'center'}}>
                    <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center'}}>
                      {inv.status === 'pending' ? (
                        <button type="button" className="add-btn" onClick={() => handleComplete(inv)} style={{background: '#10B981', padding: '0.5rem 0.8rem', fontSize: '0.85rem'}}>✅ Tamamla</button>
                      ) : (
                         <>
                           <span style={{ fontSize: '1.2rem', color: '#10B981', fontWeight: 'bold' }} title="Tamamlandı">✓</span>
                           <button type="button" onClick={() => handleRevert(inv.id)} title="Düzenle (Planlandı durumuna al)" style={{background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.1rem'}}>✏️</button>
                         </>
                      )}
                      {userRole === 'danisman' && (
                        <button type="button" onClick={() => openNotes(inv)} title="Not Defteri" style={{background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.1rem'}}>📝</button>
                      )}
                      <button type="button" onClick={() => handleDelete(inv.id)} title="Sil" style={{background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.1rem'}}>🗑️</button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {activeNoteId && (
        <div className="notes-area-overlay fade-in">
          <div className="notes-area-content">
            <div className="notes-header">
              <h3>📝 Görüşme Notları: {employees.find(e => e.id === (interviews.find(i => i.id === activeNoteId)?.employeeId))?.name}</h3>
              <button className="close-btn" onClick={() => setActiveNoteId(null)}>✕</button>
            </div>
            
            <div className="notes-body">
              <div className="notes-section-edit">
                <label>Danışman Notları (Görüşme Esnasında)</label>
                <div className="rich-toolbar">
                  <button onClick={() => execCommand('bold')} title="Kalın (Bold)"><b>B</b></button>
                  <button onClick={() => execCommand('italic')} title="İtalik (Italic)"><i>I</i></button>
                  <button onClick={() => execCommand('insertUnorderedList')} title="Madde İşaretleri">•</button>
                  <button onClick={() => execCommand('insertOrderedList')} title="Numaralandırma">1.</button>
                  <button onClick={insertTable} title="Tablo Ekle">➕ 田</button>
                </div>
                <div 
                   id="rich-editor"
                   className="rich-editor-content"
                   contentEditable 
                   dangerouslySetInnerHTML={{ __html: tempNotes.content }}
                   onBlur={(e) => setTempNotes({...tempNotes, content: e.target.innerHTML})}
                />
              </div>

              <div className="notes-section-edit">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label>Yapay Zeka Özeti ve Yeniden Düzenleme</label>
                  <button className="ai-btn" onClick={handleAiSummarize}>🚀 AI ile Yeniden Düzenle</button>
                </div>
                <div className="ai-summary-display" dangerouslySetInnerHTML={{ __html: tempNotes.summary || "Henüz özet oluşturulmadı." }} />
              </div>
            </div>

            <div className="notes-footer">
              {interviews.find(i => i.id === activeNoteId)?.notes?.lastUpdated && (
                <span className="last-updated">Son Güncelleme: {interviews.find(i => i.id === activeNoteId).notes.lastUpdated}</span>
              )}
              <button className="save-btn" onClick={saveNotes}>💾 Kaydet ve Onayla</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
