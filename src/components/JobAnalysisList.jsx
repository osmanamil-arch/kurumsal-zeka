import React, { useState, useMemo } from 'react';

export default function JobAnalysisList({ 
  departments, titles, families, functions, levels, 
  jobAnalyses, userRole, onOpenWizard, onApprove, onReject, onDelete 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterFamily, setFilterFamily] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Sadece yetkili rollere göre buton gösterimi
  const isConsultant = userRole === 'danisman' || userRole === 'superadmin';
  const isClient = userRole === 'musteri' || userRole === 'superadmin';

  // Veriyi zenginleştirerek tabloya hazırlama
  const enrichedData = useMemo(() => {
    return jobAnalyses.map(ja => {
      const title = titles.find(t => t.id === ja.titleId) || { name: 'Bilinmeyen Ünvan' };
      const dept = departments.find(d => d.id === ja.departmentId) || { name: 'Bilinmeyen Departman' };
      const family = families.find(f => f.id === ja.jobFamilyId) || { name: '-' };
      const fn = functions.find(f => f.id === ja.jobFunctionId) || { name: '-' };
      const level = levels.find(l => l.id === ja.jobLevelId) || { name: '-' };

      return {
        ...ja,
        titleName: title.name,
        deptName: dept.name,
        familyName: family.name,
        functionName: fn.name,
        levelName: level.name,
        searchStr: `${title.name} ${dept.name} ${family.name}`.toLowerCase()
      };
    });
  }, [jobAnalyses, titles, departments, families, functions, levels]);

  // Filtreleme
  const filteredData = useMemo(() => {
    return enrichedData.filter(item => {
      const matchSearch = item.searchStr.includes(searchTerm.toLowerCase());
      const matchDept = filterDept ? item.departmentId === filterDept : true;
      const matchFamily = filterFamily ? item.jobFamilyId === filterFamily : true;
      const matchStatus = filterStatus ? item.status === filterStatus : true;
      return matchSearch && matchDept && matchFamily && matchStatus;
    }).sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [enrichedData, searchTerm, filterDept, filterFamily, filterStatus]);

  // Rozet (Badge) stilleri
  const getStatusBadge = (status) => {
    switch(status) {
      case 'DRAFT': return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', background: '#fef08a', color: '#854d0e', fontWeight: 'bold' }}>Tasarım / Taslak</span>;
      case 'IN_REVIEW': return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', background: '#bfdbfe', color: '#1e40af', fontWeight: 'bold' }}>İncelemede</span>;
      case 'ACTIVE': return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', background: '#bbf7d0', color: '#166534', fontWeight: 'bold' }}>Yayında (Aktif)</span>;
      case 'REJECTED': return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', background: '#fecaca', color: '#991b1b', fontWeight: 'bold' }}>Reddedildi</span>;
      case 'ARCHIVED': return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', background: '#e2e8f0', color: '#475569', fontWeight: 'bold' }}>Arşiv (Eski Sürüm)</span>;
      default: return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', background: '#e2e8f0' }}>Bilinmiyor</span>;
    }
  };

  const formInputStyle = { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box', fontSize: '0.9rem', background: 'var(--bg-main)', color: 'var(--text-main)' };

  const handleRejectClick = (id) => {
    const reason = window.prompt("Lütfen ret nedenini giriniz (Bu bilgi danışmana iletilecektir):");
    if (reason && reason.trim()) {
       onReject(id, reason.trim());
    } else if (reason !== null) {
       alert("Ret nedeni boş bırakılamaz!");
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--text-main)' }}>İş Analizleri Ana Yönetim Tablosu</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Şirketteki tüm pozisyonların aktif görev tanımlarını, seviyelerini ve versiyon tarihçesini yönetin.</p>
        </div>
        {isConsultant && (
          <button onClick={() => onOpenWizard(null)} className="save-btn" style={{ background: '#2563eb' }}>
            + Yeni İş Analizi Oluştur
          </button>
        )}
      </div>

      <div className="filters-container glass" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'var(--bg-card)' }}>
         <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px', display:'block'}}>Pozisyon Ara</label>
            <input type="text" placeholder="Ünvan veya Departman girin..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={formInputStyle} />
         </div>
         <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px', display:'block'}}>Departman</label>
            <select value={filterDept} onChange={e => setFilterDept(e.target.value)} style={formInputStyle}>
              <option value="">Tümü</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
         </div>
         <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px', display:'block'}}>İş Ailesi</label>
            <select value={filterFamily} onChange={e => setFilterFamily(e.target.value)} style={formInputStyle}>
              <option value="">Tümü</option>
              {families.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
         </div>
         <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px', display:'block'}}>Durum (Statü)</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={formInputStyle}>
              <option value="">Tümü</option>
              <option value="DRAFT">Tasarım / Taslak</option>
              <option value="IN_REVIEW">İncelemede</option>
              <option value="ACTIVE">Yayında (Aktif)</option>
              <option value="ARCHIVED">Arşiv (Eski Sürüm)</option>
            </select>
         </div>
      </div>

      <div className="table-responsive">
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '2px solid var(--border-color)', color: 'var(--text-main)' }}>
              <th style={{ padding: '1rem' }}>Pozisyon (Departman)</th>
              <th style={{ padding: '1rem' }}>Sınıflandırma Alanları</th>
              <th style={{ padding: '1rem' }}>Sürüm / Statü</th>
              <th style={{ padding: '1rem' }}>Son Güncelleme</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Aksiyonlar</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(row => {
              return (
                <tr key={row.id} style={{ borderBottom: '1px solid var(--border-color)', background: row.status === 'ARCHIVED' ? 'rgba(0,0,0,0.3)' : 'var(--bg-main)', opacity: row.status === 'ARCHIVED' ? 0.7 : 1 }}>
                  <td style={{ padding: '1rem' }}>
                     <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1rem' }}>{row.titleName}</div>
                     <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>{row.deptName}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.75rem', background: '#e0e7ff', color: '#3730a3', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', width: 'fit-content' }}>🏭 {row.familyName}</span>
                        <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', width: 'fit-content' }}>⚙️ {row.functionName}</span>
                        <span style={{ fontSize: '0.75rem', background: '#ffedd5', color: '#9a3412', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', width: 'fit-content' }}>📈 {row.levelName}</span>
                     </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                     <div style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '4px' }}>v{Number(row.version).toFixed(1)}</div>
                     {getStatusBadge(row.status)}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                     <div style={{ color: 'var(--text-main)', fontWeight: 500 }}>{new Date(row.updatedAt).toLocaleDateString('tr-TR')}</div>
                     <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                       <span style={{ fontSize: '1rem' }}>👤</span> {row.updatedBy}
                     </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: '150px' }}>
                     <button className="action-btn" title="Görüntüle" onClick={() => alert('Görüntüleme ekranı')} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '0.4rem', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', cursor: 'pointer', padding: '0.4rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>👁️ Görüntüle</button>
                     
                     {isConsultant && (row.status === 'DRAFT' || row.status === 'REJECTED') && (
                       <button className="action-btn" title="Düzenlemeye Devam Et" onClick={() => onOpenWizard(row.id, 'edit')} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '0.4rem', background: '#fef08a', border: '1px solid #fde047', color: '#854d0e', cursor: 'pointer', padding: '0.4rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>✏️ Düzenle</button>
                     )}
                     
                     {isConsultant && row.status === 'ACTIVE' && (
                       <button className="action-btn" title="Revize Et (Yeni Taslak Çıkar)" onClick={() => onOpenWizard(row.id, 'revise')} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '0.4rem', background: '#bfdbfe', border: '1px solid #93c5fd', color: '#1e3a8a', cursor: 'pointer', padding: '0.4rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>🔄 Revize Et</button>
                     )}

                     {isConsultant && row.status === 'DRAFT' && (
                        <button className="action-btn" title="Müşteri Onayına Gönder" onClick={() => alert('Onaya Gönderildi (Gerçek fonksiyon bağlanacak)')} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '0.4rem', background: '#ddd6fe', border: '1px solid #c4b5fd', color: '#4c1d95', cursor: 'pointer', padding: '0.4rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>📤 Onaya Gönder</button>
                     )}

                     {isClient && row.status === 'IN_REVIEW' && (
                        <>
                           <button className="action-btn" title="Onayla (Yayınla)" onClick={() => { if(window.confirm('Bu görev tanımını aktif yayına almak istediğinize emin misiniz?')) { onApprove(row.id); } }} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '0.4rem', background: '#dcfce7', border: '1px solid #bbf7d0', color: '#14532d', cursor: 'pointer', padding: '0.4rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>✅ Onayla</button>
                           <button className="action-btn" title="Reddet (Revizyon İste)" onClick={() => handleRejectClick(row.id)} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '0.4rem', background: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', cursor: 'pointer', padding: '0.4rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>❌ Reddet</button>
                        </>
                     )}

                     <button className="action-btn" title="Sil" onClick={() => { if(window.confirm('Bu iş analizini kalıcı olarak silmek istediğinize emin misiniz?')) { onDelete(row.id); } }} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '0.4rem', background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', cursor: 'pointer', padding: '0.4rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>🗑️ Sil</button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Veri bulunamadı. Lütfen filtreleri değiştirin veya yeni bir analiz oluşturun.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
