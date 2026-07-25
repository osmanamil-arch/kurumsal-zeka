import React, { useState } from 'react';
import './CompanyProfileModule.css';
import DepartmentAndTitleModule from './DepartmentAndTitleModule';
import OrgChart from './OrgChart';
import HRLibraryModule from './HRLibraryModule';

export default function CompanyProfileModule({ 
  companyInfo, setCompanyInfo, employees, setEmployees, 
  departments, setDepartments, titles, setTitles,
  families, setFamilies, functions, setFunctions, levels, setLevels
}) {
  const [activeSubTab, setActiveSubTab] = useState('company'); // 'company' | 'masterData' | 'library' | 'employees' | 'orgchart'
  
  // States for new employee form
  const [newEmployee, setNewEmployee] = useState({ name: '', departmentId: '', titleId: '', email: '', managerId: '' });

  // Bulk Upload / Excel Import State
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkText, setBulkText] = useState('');

  // States for editing an employee
  const [editingEmpId, setEditingEmpId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo(prev => ({ ...prev, [name]: value }));
  };

  const addEmployee = (e) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.email || !newEmployee.titleId) return;
    
    const selectedTitle = titles.find(t => t.id === newEmployee.titleId);
    const selectedDept = departments.find(d => d.id === selectedTitle?.departmentId) || departments.find(d => d.id === newEmployee.departmentId);

    setEmployees(prev => [...prev, { 
       id: Date.now().toString(), 
       ...newEmployee,
       department: selectedDept?.name || '',
       title: selectedTitle?.name || '',
       departmentId: selectedDept?.id || '',
       managerId: newEmployee.managerId || ''
    }]);
    setNewEmployee({ name: '', departmentId: '', titleId: '', email: '', managerId: '' });
  };

  const processBulkUpload = () => {
    if (!bulkText.trim()) {
      alert('Lütfen Excel veya tablodan kopyaladığınız veriyi yapıştırın.');
      return;
    }

    const lines = bulkText.split('\n');
    let addedCount = 0;
    const importedEmps = [];

    lines.forEach(line => {
      const parts = line.split('\t');
      if (parts.length >= 2 && parts[0].trim() !== '') {
         // Varsayılan Sütun Sırası: Ad Soyad | E-Posta | Departman | Ünvan | Yöneticisi
         const name = parts[0].trim();
         if (name.toLowerCase() === 'ad soyad' || name === '') return; // Başlık satırını atla

         const email = parts[1] ? parts[1].trim() : '';
         const deptStr = parts[2] ? parts[2].trim() : '';
         const titleStr = parts[3] ? parts[3].trim() : '';
         const managerStr = parts[4] ? parts[4].trim() : '';

         // Mevcut kütüphanede eşleştirme dene
         const matchedTitle = titles.find(t => t.name.toLowerCase() === titleStr.toLowerCase());
         const matchedDept = departments.find(d => d.name.toLowerCase() === deptStr.toLowerCase()) || (matchedTitle ? departments.find(d => d.id === matchedTitle.departmentId) : undefined);
         const matchedManager = employees.find(e => e.name.toLowerCase() === managerStr.toLowerCase()) || importedEmps.find(e => e.name.toLowerCase() === managerStr.toLowerCase());

         const newId = 'emp_' + Date.now().toString() + Math.random().toString(36).substring(2, 6);
         
         importedEmps.push({
            id: newId,
            name,
            email,
            titleId: matchedTitle ? matchedTitle.id : '',
            departmentId: matchedDept ? matchedDept.id : '',
            title: titleStr || (matchedTitle ? matchedTitle.name : ''),
            department: deptStr || (matchedDept ? matchedDept.name : ''),
            managerId: matchedManager ? matchedManager.id : ''
         });
         addedCount++;
      }
    });

    if (addedCount > 0) {
       setEmployees(prev => [...prev, ...importedEmps]);
       setBulkText('');
       setShowBulkUpload(false);
       alert(`${addedCount} adet çalışan başarıyla sisteme aktarıldı!`);
    } else {
       alert('Okunabilir veri bulunamadı. Sütunların "Sekme (Tab)" ile ayrıldığından emin olun. Excelden direkt kopyalayabilirsiniz.');
    }
  };

  const deleteEmployee = (id) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  const toggleActive = (id) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, isActive: emp.isActive === false ? true : false } : emp));
  };

  const handleEditClick = (emp) => {
    setEditingEmpId(emp.id);
    setEditFormData(emp);
  };

  const saveEdit = (e) => {
    e.preventDefault();
    setEmployees(prev => prev.map(emp => emp.id === editingEmpId ? editFormData : emp));
    setEditingEmpId(null);
  };

  // Build Tree for Org Chart
  const orgTreeRoots = React.useMemo(() => {
    let map = {};
    let roots = [];
    employees.forEach(emp => { map[emp.id] = { ...emp, children: [] }; });
    employees.forEach(emp => {
      if (emp.managerId && map[emp.managerId]) {
        map[emp.managerId].children.push(map[emp.id]);
      } else {
        roots.push(map[emp.id]);
      }
    });
    return roots;
  }, [employees]);

  return (
    <div className="company-profile-module fade-in">
      <div className="profile-tabs glass">
        <button 
          className={`tab-btn ${activeSubTab === 'company' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('company')}
        >
          🏢 Şirket Bilgileri
        </button>
        <button 
          className={`tab-btn ${activeSubTab === 'employees' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('employees')}
        >
          👥 Çalışan Rehberi
        </button>
        <button 
          className={`tab-btn ${activeSubTab === 'orgchart' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('orgchart')}
        >
          📊 Organizasyon Şeması
        </button>
      </div>

      <div className="profile-content glass mt-4">
        {activeSubTab === 'company' && (
          <div className="company-info-form fade-in">
            <h3 className="section-title">Şirket Künyesi</h3>
            <p className="section-desc">Danışmanlığını yürüttüğünüz şirketin temel vizyonel ve yasal bilgilerini buraya tanımlayın.</p>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Şirket Adı:</label>
                <input type="text" name="name" value={companyInfo.name || ''} onChange={handleCompanyChange} placeholder="Örn: ABC Teknoloji A.Ş." />
              </div>
              <div className="form-group">
                <label>Ticari Ünvan:</label>
                <input type="text" name="title" value={companyInfo.title || ''} onChange={handleCompanyChange} placeholder="Örn: ABC Teknoloji ve Yazılım San. Tic. A.Ş." />
              </div>
              <div className="form-group">
                <label>Kuruluş Tarihi:</label>
                <input type="date" name="foundationDate" value={companyInfo.foundationDate || ''} onChange={handleCompanyChange} />
              </div>
              <div className="form-group">
                <label>Ortaklık Yapısı:</label>
                <input type="text" name="partnership" value={companyInfo.partnership || ''} onChange={handleCompanyChange} placeholder="Örn: %60 Ahmet Y., %40 Mehmet K." />
              </div>
              <div className="form-group full-width">
                <label>Tarihçe ve Kilometretaşları:</label>
                <textarea rows="4" name="history" value={companyInfo.history || ''} onChange={handleCompanyChange} placeholder="Şirketin geçmişine dair önemli dönüm noktaları..." />
              </div>
            </div>
          </div>
        )}



        {activeSubTab === 'employees' && (
          <div className="employees-section fade-in">
            <div className="employees-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 className="section-title">Çalışan Rehberi</h3>
                <p className="section-desc">Sisteme tanımlı aktif çalışan sayısı: {employees.length}</p>
              </div>
              <button 
                onClick={() => setShowBulkUpload(!showBulkUpload)} 
                style={{ padding: '0.6rem 1.2rem', background: showBulkUpload ? '#64748b' : '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
              >
                {showBulkUpload ? 'İptal Et' : '📥 Toplu Excel İçe Aktar'}
              </button>
            </div>

            {showBulkUpload && (
              <div className="fade-in" style={{ padding: '1.5rem', background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '8px', marginBottom: '2rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#0f172a' }}>Excel'den Kopyala / Yapıştır</h4>
                <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem', lineHeight: '1.5' }}>
                  Excel dosyanızdaki satırları kopyalayıp aşağıdaki kutuya doğrudan yapıştırabilirsiniz. Sütunların soldan sağa sırasıyla şu formatta olması gereklidir:<br/>
                  <strong style={{ background: '#e2e8f0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Ad Soyad</strong> | <strong style={{ background: '#e2e8f0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>E-Posta</strong> | <strong style={{ background: '#e2e8f0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Departman</strong> | <strong style={{ background: '#e2e8f0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Ünvan</strong> | <strong style={{ background: '#e2e8f0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Yöneticisi (Varsa Adı Soyadı)</strong>
                </p>
                
                <textarea 
                  value={bulkText}
                  onChange={e => setBulkText(e.target.value)}
                  placeholder={`Örnek:\nAhmet Yılmaz\tahmet@mail.com\tSatış\tBölge Müdürü\tMehmet Kaya\nAyşe Kural\tayse@mail.com\tIK\tIK Uzmanı\t\n...`}
                  style={{ width: '100%', height: '150px', padding: '1rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontSize: '0.85rem', whiteSpace: 'pre' }}
                />
                
                <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                  <button onClick={processBulkUpload} style={{ padding: '0.6rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                    Verileri Eşleştir ve Yükle
                  </button>
                </div>
              </div>
            )}

            <form className="add-employee-form" onSubmit={addEmployee}>
               <h4>Yeni Çalışan Ekle</h4>
               <div className="emp-inputs">
                 <input type="text" placeholder="Ad Soyad *" required value={newEmployee.name} onChange={e => setNewEmployee({...newEmployee, name: e.target.value})} />
                 <input type="email" placeholder="E-Posta *" required value={newEmployee.email} onChange={e => setNewEmployee({...newEmployee, email: e.target.value})} />
                 <select value={newEmployee.titleId} onChange={e => setNewEmployee({...newEmployee, titleId: e.target.value})} required>
                   <option value="">-- Ünvan / Pozisyon Seçin --</option>
                   {titles && titles.map(t => (
                     <option key={t.id} value={t.id}>
                       {t.name} ({(departments && departments.find(d => d.id === t.departmentId) || {}).name || 'Departmansız'})
                     </option>
                   ))}
                 </select>
                 <select value={newEmployee.managerId} onChange={e => setNewEmployee({...newEmployee, managerId: e.target.value})}>
                   <option value="">-- Yönetici Seçimi (Bağlı Olduğu Kişi) --</option>
                   {employees.map(emp => (
                     <option key={emp.id} value={emp.id}>{emp.name}</option>
                   ))}
                 </select>
                 <button type="submit" className="add-btn">➕ Ekle</button>
               </div>
               <p style={{fontSize: '0.75rem', marginTop: '0.5rem', color: '#64748b'}}>Departman ve yönetici ilişkisi Ünvan seçiminden otomatik kurgulanmaktadır.</p>
            </form>

            <div className="employees-table-container">
              {employees.length === 0 ? (
                <div className="empty-state">Henüz hiç çalışan eklenmemiş.</div>
              ) : (
                <table className="custom-table employees-table">
                  <thead>
                    <tr>
                      <th style={{textAlign: 'left'}}>Ad Soyad</th>
                      <th style={{textAlign: 'left'}}>Departman</th>
                      <th style={{textAlign: 'left'}}>Ünvan</th>
                      <th style={{textAlign: 'left'}}>Yöneticisi</th>
                      <th style={{textAlign: 'left'}}>E-Posta</th>
                      <th style={{textAlign: 'center'}}>Durum</th>
                      <th style={{textAlign: 'center'}}>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => {
                      const manager = employees.find(e => e.id === emp.managerId);
                      if (editingEmpId === emp.id) {
                        return (
                          <tr key={emp.id} className="edit-row">
                            <td><input type="text" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} className="edit-input" /></td>
                            <td><input type="text" value={editFormData.department || ''} onChange={e => setEditFormData({...editFormData, department: e.target.value})} className="edit-input" /></td>
                            <td><input type="text" value={editFormData.title || ''} onChange={e => setEditFormData({...editFormData, title: e.target.value})} className="edit-input" /></td>
                            <td>
                              <select value={editFormData.managerId || ''} onChange={e => setEditFormData({...editFormData, managerId: e.target.value})} className="edit-input">
                                <option value="">-- Yok --</option>
                                {employees.map(m => m.id !== emp.id && <option key={m.id} value={m.id}>{m.name}</option>)}
                              </select>
                            </td>
                            <td><input type="email" value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} className="edit-input" /></td>
                            <td style={{textAlign: 'center'}}>-</td>
                            <td style={{textAlign: 'center', minWidth: '110px'}}>
                              <button className="action-btn save" onClick={saveEdit} title="Kaydet">💾</button>
                              <button className="action-btn cancel" onClick={() => setEditingEmpId(null)} title="İptal">❌</button>
                            </td>
                          </tr>
                        );
                      }
                      return (
                      <tr key={emp.id} style={{ opacity: emp.isActive === false ? 0.5 : 1 }}>
                        <td style={{textAlign: 'left', textDecoration: emp.isActive === false ? 'line-through' : 'none'}}><strong>{emp.name}</strong></td>
                        <td style={{textAlign: 'left'}}>{emp.department || '-'}</td>
                        <td style={{textAlign: 'left'}}>{emp.title || '-'}</td>
                        <td style={{textAlign: 'left'}}>
                          {manager ? <span className="manager-badge">{manager.name}</span> : <span className="no-manager">-</span>}
                        </td>
                        <td style={{textAlign: 'left'}}>{emp.email}</td>
                        <td style={{textAlign: 'center'}}>
                          {emp.isActive === false ? <span style={{color: '#ef4444', fontWeight: 'bold', fontSize: '0.8rem'}}>Pasif</span> : <span style={{color: '#10b981', fontWeight: 'bold', fontSize: '0.8rem'}}>Aktif</span>}
                        </td>
                        <td style={{textAlign: 'center', minWidth: '130px'}}>
                          <button className="action-btn" style={{ background: 'transparent', border: 'none', cursor: 'pointer', filter: 'grayscale(0)', opacity: 1 }} onClick={() => toggleActive(emp.id)} title={emp.isActive === false ? "Personeli Aktifleştir" : "Personeli Pasife Al"}>{emp.isActive === false ? '🟢' : '🔴'}</button>
                          <button className="action-btn edit" onClick={() => handleEditClick(emp)} title="Düzenle">✏️</button>
                          <button className="action-btn del" onClick={() => deleteEmployee(emp.id)} title="Sil">🗑️</button>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeSubTab === 'orgchart' && (
          <div className="orgchart-section fade-in">
             <div className="employees-header">
                <div>
                  <h3 className="section-title">Organizasyon Şeması</h3>
                  <p className="section-desc">Çalışan rehberine girilen hiyerarşik bağlara göre otomatik oluşturulmuştur.</p>
                </div>
             </div>
             
             <div className="org-tree-wrapper">
               {!employees || employees.length === 0 ? (
                 <div className="empty-state">Şema çizilemiyor. Çalışan eklemediniz.</div>
               ) : (
                 <OrgChart titles={titles} departments={departments} employees={employees} />
               )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Recursive Tree Node Component
const OrgTreeNode = ({ node }) => (
  <li>
    <div className="org-node glass">
      <div className="org-name">{node.name}</div>
      <div className="org-title">{node.title || node.department || 'Bilinmiyor'}</div>
    </div>
    {node.children && node.children.length > 0 && (
      <ul>
        {node.children.map(child => <OrgTreeNode key={child.id} node={child} />)}
      </ul>
    )}
  </li>
);
