import React, { useState } from 'react';

export default function TrainingCalendar({ sessions, setSessions, catalog, employees, userRole }) {
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const selectedSession = sessions.find(s => s.id === selectedSessionId);
  const trainingInfo = selectedSession ? catalog.find(c => c.id === selectedSession.trainingId) : null;

  const getStatusColor = (status) => {
    switch(status) {
      case 'PLANNED': return '#3b82f6';
      case 'IN_PROGRESS': return '#f59e0b';
      case 'COMPLETED': return '#10b981';
      case 'CANCELLED': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'PLANNED': return 'Planlandı';
      case 'IN_PROGRESS': return 'Devam Ediyor';
      case 'COMPLETED': return 'Tamamlandı';
      case 'CANCELLED': return 'İptal Edildi';
      default: return status;
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', gap: '2rem', height: '100%' }}>
      {/* SOL: Takvim Listesi */}
      <div style={{ width: '400px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
           <h4 style={{ margin: 0, color: '#1e293b' }}>Planlanan Oturumlar</h4>
           {(userRole === 'superadmin' || userRole === 'danisman') && (
              <button style={{ background: 'transparent', border: '1px solid #cbd5e1', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
                 + Oturum Aç
              </button>
           )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
          {sessions.sort((a,b) => new Date(a.scheduledDate) - new Date(b.scheduledDate)).map(session => {
            const tInfo = catalog.find(c => c.id === session.trainingId);
            const isSelected = selectedSessionId === session.id;
            const occupancy = session.enrollments.length;
            const dateObj = new Date(session.scheduledDate);
            const isPast = dateObj < new Date();

            return (
              <div 
                key={session.id} 
                onClick={() => setSelectedSessionId(session.id)}
                style={{ 
                   padding: '1rem', border: `1px solid ${isSelected ? '#3b82f6' : '#e2e8f0'}`, borderRadius: '8px', 
                   background: isSelected ? '#eff6ff' : '#fff', cursor: 'pointer', transition: 'all 0.2s',
                   borderLeft: `4px solid ${getStatusColor(session.status)}`, opacity: session.status === 'CANCELLED' ? 0.6 : 1
                }}
              >
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: getStatusColor(session.status) }}>{getStatusLabel(session.status)}</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{dateObj.toLocaleDateString('tr-TR')}</span>
                 </div>
                 <h5 style={{ margin: '0 0 0.3rem 0', color: '#1e293b', fontSize: '1rem' }}>{session.title}</h5>
                 <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>{tInfo?.title}</div>
                 
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#475569' }}>📍 {session.location}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: occupancy >= session.maxCapacity ? '#ef4444' : '#10b981' }}>
                       👤 {occupancy} / {session.maxCapacity}
                    </span>
                 </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SAĞ: Oturum ve Atama Detayı */}
      <div style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2rem', overflowY: 'auto' }}>
        {!selectedSession ? (
           <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', flexDirection: 'column' }}>
              <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</span>
              <h3>Detayları görmek için soldan bir oturum seçin</h3>
           </div>
        ) : (
          <div className="fade-in">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                <div>
                  <h2 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>{selectedSession.title}</h2>
                  <div style={{ display: 'flex', gap: '1rem', color: '#64748b', fontSize: '0.9rem' }}>
                     <span><strong>Tarih:</strong> {new Date(selectedSession.scheduledDate).toLocaleDateString('tr-TR')}</span>
                     <span><strong>Saat:</strong> {selectedSession.startTime} - {selectedSession.endTime}</span>
                     <span><strong>Eğitmen:</strong> {selectedSession.instructorName}</span>
                  </div>
                </div>
                {(userRole === 'superadmin' || userRole === 'danisman') && (
                  <button style={{ padding: '0.6rem 1.2rem', background: '#fff', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                    Oturumu Düzenle
                  </button>
                )}
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                
                {/* Katılımcı Listesi */}
                <div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ margin: 0, color: '#1e293b' }}>Katılımcılar ({selectedSession.enrollments.length})</h3>
                      {(userRole === 'superadmin' || userRole === 'danisman') && selectedSession.status !== 'COMPLETED' && (
                         <button style={{ background: '#e0e7ff', color: '#4f46e5', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                            + Katılımcı Ata
                         </button>
                      )}
                   </div>

                   {selectedSession.enrollments.length === 0 ? (
                      <div style={{ padding: '2rem', background: '#fff', borderRadius: '8px', border: '1px dashed #cbd5e1', color: '#64748b', textAlign: 'center' }}>
                         Bu oturuma henüz kimse atanmamış.
                      </div>
                   ) : (
                      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                         <thead>
                            <tr style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.85rem', textAlign: 'left' }}>
                               <th style={{ padding: '0.8rem 1rem' }}>Personel</th>
                               <th style={{ padding: '0.8rem 1rem' }}>Birim</th>
                               <th style={{ padding: '0.8rem 1rem' }}>Durum</th>
                               <th style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>Skor</th>
                            </tr>
                         </thead>
                         <tbody>
                            {selectedSession.enrollments.map((enr, idx) => {
                               const emp = employees.find(e => e.id === enr.employeeId);
                               if (!emp) return null;
                               return (
                                  <tr key={idx} style={{ borderTop: '1px solid #e2e8f0', fontSize: '0.9rem' }}>
                                     <td style={{ padding: '0.8rem 1rem', fontWeight: 500, color: '#334155' }}>{emp.name}</td>
                                     <td style={{ padding: '0.8rem 1rem', color: '#64748b' }}>{emp.department}</td>
                                     <td style={{ padding: '0.8rem 1rem' }}>
                                        <span style={{ 
                                           padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                                           background: enr.status === 'COMPLETED' ? '#dcfce7' : '#f1f5f9',
                                           color: enr.status === 'COMPLETED' ? '#166534' : '#475569'
                                        }}>
                                           {enr.status === 'COMPLETED' ? 'Eğitimi Aldı' : 'Kayıtlı'}
                                        </span>
                                     </td>
                                     <td style={{ padding: '0.8rem 1rem', textAlign: 'center', fontWeight: 'bold', color: enr.score ? '#10b981' : '#cbd5e1' }}>
                                        {enr.score ? `${enr.score}/100` : '-'}
                                     </td>
                                  </tr>
                               );
                            })}
                         </tbody>
                      </table>
                   )}
                </div>

                {/* Eğitim Meta Bilgileri */}
                <div>
                   <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>Eğitim Detayı</h3>
                   {trainingInfo ? (
                      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.2rem' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '1.5rem' }}>🎓</span>
                            <strong style={{ color: '#1e293b' }}>{trainingInfo.title}</strong>
                         </div>
                         <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem', lineHeight: '1.4' }}>
                            {trainingInfo.description}
                         </p>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                               <span style={{ color: '#64748b' }}>Format:</span>
                               <strong style={{ color: '#334155' }}>{trainingInfo.format}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                               <span style={{ color: '#64748b' }}>Süre:</span>
                               <strong style={{ color: '#334155' }}>{trainingInfo.duration} Saat</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                               <span style={{ color: '#64748b' }}>Kategori:</span>
                               <strong style={{ color: '#334155' }}>{trainingInfo.subCategory}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                               <span style={{ color: '#64748b' }}>Zorunlu Mu:</span>
                               <strong style={{ color: trainingInfo.isMandatory ? '#ef4444' : '#10b981' }}>{trainingInfo.isMandatory ? 'Evet' : 'Hayır'}</strong>
                            </div>
                         </div>
                      </div>
                   ) : (
                      <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Eğitim bilgisi bulunamadı.</div>
                   )}
                </div>

             </div>
          </div>
        )}
      </div>
    </div>
  );
}
