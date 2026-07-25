import React, { useState } from 'react';

export default function ExitRecords({ records, setRecords, employees }) {
  const [filterType, setFilterType] = useState('all');

  const filteredRecords = records.filter(r => {
    if (filterType !== 'all' && r.exitType !== filterType) return false;
    return true;
  });

  // Pasife alınmış ama henüz çıkış kaydı oluşturulmamış çalışanlar
  const pendingExits = employees ? employees.filter(emp => emp.isActive === false && !records.some(r => r.employeeId === emp.id)) : [];

  const handleStartExitProcess = (emp) => {
    if (window.confirm(`${emp.name} için Çıkış Mülakatı ve anket sürecini başlatmak istiyor musunuz? Çalışana otomatik bir e-posta iletilecektir.`)) {
      const newRecord = {
        id: `exit_${Date.now()}`,
        employeeId: emp.id,
        employeeName: emp.name,
        departmentId: emp.departmentId || '',
        departmentName: emp.department || 'Bilinmiyor',
        roleId: emp.titleId || '',
        roleName: emp.title || 'Bilinmiyor',
        managerId: emp.managerId || '',
        managerName: employees.find(e => e.id === emp.managerId)?.name || '',
        exitType: 'voluntary', // Varsayılan, daha sonra admin düzeltebilir
        exitDate: new Date().toISOString().split('T')[0],
        reasonCategory: 'Süreç Bekliyor',
        reasonTags: [],
        status: 'pending',
        regrettableLoss: false,
        highPerformer: false
      };
      setRecords([...records, newRecord]);
      alert(`Çıkış süreci başlatıldı! ${emp.name} kişisine anket gönderildi ve kayıt taslağı "Süreç Bekliyor" olarak eklendi.`);
    }
  };

  return (
    <div className="exit-records fade-in">
      {pendingExits.length > 0 && (
        <div style={{ marginBottom: '2.5rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#b45309', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>⚠️</span> Pasife Alınanlar (Çıkış İşlemi Bekleyenler)
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#92400e', marginBottom: '1rem' }}>Çalışan rehberinde pasife aldığınız aşağıdaki personeller için çıkış mülakatı süreci henüz başlatılmadı.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {pendingExits.map(emp => (
              <div key={emp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '1rem', borderRadius: '6px', border: '1px solid #fef3c7' }}>
                <div>
                  <strong style={{ display: 'block', color: '#1e293b' }}>{emp.name}</strong>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{emp.department} - {emp.title}</span>
                </div>
                <button 
                  onClick={() => handleStartExitProcess(emp)}
                  style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', transition: 'background 0.2s' }}>
                  Çıkış Sürecini Başlat (Mülakat Gönder)
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: '#1e293b', margin: 0 }}>Ayrılma Kayıtları</h2>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Geçmiş personel çıkışları ve nedenleri</p>
        </div>
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
        >
          <option value="all">Tüm Çıkışlar</option>
          <option value="voluntary">Gönüllü (İstifa)</option>
          <option value="involuntary">Gönülsüz (İşten Çıkarma)</option>
        </select>
      </div>

      <div className="table-container glass" style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '1rem', color: '#475569', fontSize: '0.9rem' }}>Çalışan</th>
              <th style={{ padding: '1rem', color: '#475569', fontSize: '0.9rem' }}>Departman & Rol</th>
              <th style={{ padding: '1rem', color: '#475569', fontSize: '0.9rem' }}>Çıkış Türü</th>
              <th style={{ padding: '1rem', color: '#475569', fontSize: '0.9rem' }}>Tarih</th>
              <th style={{ padding: '1rem', color: '#475569', fontSize: '0.9rem' }}>Ana Neden / Statü</th>
              <th style={{ padding: '1rem', color: '#475569', fontSize: '0.9rem' }}>Regrettable Loss</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: '500', color: '#0f172a' }}>{r.employeeName}</div>
                  {r.highPerformer && <span style={{ fontSize: '0.7rem', color: '#b45309', background: '#fef3c7', padding: '0.1rem 0.4rem', borderRadius: '4px', marginTop: '0.25rem', display: 'inline-block' }}>High Performer</span>}
                </td>
                <td style={{ padding: '1rem', color: '#64748b' }}>
                  <div>{r.departmentName}</div>
                  <div style={{ fontSize: '0.8rem' }}>{r.roleName}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem', 
                    background: r.exitType === 'voluntary' ? '#fef3c7' : '#fee2e2', 
                    color: r.exitType === 'voluntary' ? '#b45309' : '#b91c1c',
                    fontWeight: '500'
                  }}>
                    {r.exitType === 'voluntary' ? 'Gönüllü' : 'Gönülsüz'}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: '#64748b' }}>{r.exitDate}</td>
                <td style={{ padding: '1rem', color: '#1e293b' }}>
                  {r.status === 'pending' ? (
                     <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>Süreç Bekliyor (Anket Gönderildi)</span>
                  ) : r.reasonCategory}
                </td>
                <td style={{ padding: '1rem' }}>
                  {r.regrettableLoss ? (
                    <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Evet (Kritik)</span>
                  ) : (
                    <span style={{ color: '#64748b' }}>Hayır</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredRecords.length === 0 && (
              <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Kayıt bulunamadı.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
