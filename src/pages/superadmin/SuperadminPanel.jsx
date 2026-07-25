import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, LayoutDashboard, LogOut, Plus, Shield, Briefcase } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import '../../App.css';

export default function SuperadminPanel() {
  const { currentUser, logout, companies, users, addCompany, addUser, updateCompany, updateUser, adminUpdateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLightMode, setIsLightMode] = useState(false); // Just local state for now

  // Check auth
  if (!currentUser || currentUser.role !== 'superadmin') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Yetkisiz Erişim</h2>
        <button className="primary-button" onClick={() => navigate('/')}>Giriş Ekranına Dön</button>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const consultants = users.filter(u => u.role === 'danisman');
  const clients = users.filter(u => u.role === 'firma_yetkilisi');

  return (
    <div className="app-container" data-theme={isLightMode ? 'light' : 'dark'}>
      <aside className="sidebar glass">
        <div className="sidebar-logo">
          <div className="logo-icon" style={{background: 'linear-gradient(135deg, #f43f5e, #f97316)'}}>👑</div>
          <h2>Kurumsal Zeka<br/><span style={{fontSize: '0.7rem', opacity: 0.8}}>Süperadmin</span></h2>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-category">
            <div className="nav-group-title">YÖNETİM PANeli</div>
            <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <LayoutDashboard size={18} /> Özet Durum
            </button>
            <button className={`nav-item ${activeTab === 'companies' ? 'active' : ''}`} onClick={() => setActiveTab('companies')}>
              <Building2 size={18} /> Müşteri Firmalar
            </button>
            <button className={`nav-item ${activeTab === 'consultants' ? 'active' : ''}`} onClick={() => setActiveTab('consultants')}>
              <Users size={18} /> Danışman Yönetimi
            </button>
            <button className={`nav-item ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>
              <Shield size={18} /> Sistem Günlükleri
            </button>
          </div>
        </nav>
      </aside>

      <div className="main-content">
        <header className="topbar glass">
          <div className="header-title">
            <h1>
              {activeTab === 'dashboard' && 'Sistem Özeti'}
              {activeTab === 'companies' && 'Müşteri (Firma) Yönetimi'}
              {activeTab === 'consultants' && 'Danışman Yönetimi'}
              {activeTab === 'logs' && 'Sistem Günlükleri'}
            </h1>
          </div>
          
          <div className="header-actions">
            <button className={`theme-toggle ${isLightMode ? 'light' : ''}`} onClick={() => setIsLightMode(!isLightMode)}>
              <div className="toggle-track">
                <span className="toggle-icon sun">☀️</span>
                <span className="toggle-icon moon">🌙</span>
                <div className="toggle-thumb" />
              </div>
            </button>

            <div className="user-profile">
              <div className="avatar" style={{background: '#f43f5e'}}>{currentUser.name.charAt(0)}</div>
              <span>{currentUser.name}</span>
              <button onClick={handleLogout} className="icon-button" style={{marginLeft: '0.5rem', color: '#ef4444'}} title="Çıkış Yap">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <main className="page-container" style={{ padding: '2rem' }}>
          {activeTab === 'dashboard' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div className="module-card glass" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '12px' }}><Building2 size={32} /></div>
                <div><h3 style={{ fontSize: '2rem', margin: 0 }}>{companies.length}</h3><p style={{ margin: 0, color: 'var(--text-light)' }}>Aktif Firma</p></div>
              </div>
              <div className="module-card glass" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '12px' }}><Shield size={32} /></div>
                <div><h3 style={{ fontSize: '2rem', margin: 0 }}>{consultants.length}</h3><p style={{ margin: 0, color: 'var(--text-light)' }}>Aktif Danışman</p></div>
              </div>
              <div className="module-card glass" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '12px' }}><Briefcase size={32} /></div>
                <div><h3 style={{ fontSize: '2rem', margin: 0 }}>{clients.length}</h3><p style={{ margin: 0, color: 'var(--text-light)' }}>Firma Yetkilisi</p></div>
              </div>
            </div>
          )}

          {activeTab === 'companies' && (
             <CompanyManagementTab companies={companies} addCompany={addCompany} updateCompany={updateCompany} users={users} addUser={addUser} adminUpdateUser={adminUpdateUser} />
          )}

          {activeTab === 'consultants' && (
             <ConsultantManagementTab consultants={consultants} addUser={addUser} companies={companies} updateUser={updateUser} adminUpdateUser={adminUpdateUser} />
          )}

          {activeTab === 'logs' && (
             <SystemLogsTab />
          )}
        </main>
      </div>
    </div>
  );
}

// Alt Bileşenler (Şimdilik aynı dosyada, sonra ayrılabilir)

function CompanyManagementTab({ companies, addCompany, updateCompany, users, addUser, adminUpdateUser }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [formData, setFormData] = useState({ name: '', employeeLimit: 50, modules: [] });
  const [adminData, setAdminData] = useState({ name: '', email: '', password: '' });
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [editAdminData, setEditAdminData] = useState({ name: '', email: '', password: '' });
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [editCompanyFormData, setEditCompanyFormData] = useState({ name: '', employeeLimit: 50, modules: [] });

  // Tam hiyerarşik modül yapısı — KobiApp sidebar ile birebir eşleşir
  const moduleHierarchy = [
    {
      id: 'strategim', label: 'STRATEJİM', color: '#6366f1',
      items: [
        { id: 'checkup', icon: '📊', label: 'Kurumsal Check Up' },
        { id: 'strategy', icon: '🎯', label: 'Stratejik Plan' },
        { id: 'tasks', icon: '✅', label: 'Görev ve Takip' },
        { id: 'meetings', icon: '🤝', label: 'Toplantılar' },
        { id: 'summary', icon: '📈', label: 'Yönetim Özeti' },
      ]
    },
    {
      id: 'ik', label: 'İNSAN KAYNAKLARI', color: '#3b82f6',
      items: [
        { id: 'hr', icon: '📝', label: 'İş Analizi ve Görev Tanımları' },
        { id: 'recruitment', icon: '👥', label: 'İşe Alım' },
        { id: 'jobEvaluation', icon: '⚖️', label: 'İş Değleme' },
        { id: 'salaryManagement', icon: '💰', label: 'Üret Yönetimi' },
        { id: 'psychometrics', icon: '🧠', label: 'Psikometri & Değlendirme' },
        { id: 'performance', icon: '📈', label: 'Performans & Hedefler' },
        { id: 'training', icon: '🎓', label: 'Eğitim ve Gelişim' },
        { id: 'exitAnalytics', icon: '🚩', label: 'Çalışan Ayrılma Analizi' },
        { id: 'engagement', icon: '❤️', label: 'Bağlılık ve İç İletişim' },
      ]
    }
  ];

  // Tüm seçilebilir modül ID'leri (flat liste)
  const allSelectableIds = moduleHierarchy.flatMap(g => g.items.map(i => i.id));

  const handleToggleModule = (modId) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.includes(modId)
        ? prev.modules.filter(m => m !== modId)
        : [...prev.modules, modId]
    }));
  };

  const handleEditToggleModule = (modId, isActive) => {
    const confirmed = window.confirm(
      `Bu modül şu an ${isActive ? 'Aktif' : 'Pasif'}. Durumunu ${isActive ? 'Pasif' : 'Aktif'} olarak değiştirmek istediğinize emin misiniz?`
    );
    if (confirmed) {
      setEditCompanyFormData(prev => ({
        ...prev,
        modules: prev.modules.includes(modId)
          ? prev.modules.filter(m => m !== modId)
          : [...prev.modules, modId]
      }));
    }
  };

  const handleToggleGroup = (groupItems) => {
    const ids = groupItems.map(i => i.id);
    const allSelected = ids.every(id => formData.modules.includes(id));
    setFormData(prev => ({
      ...prev,
      modules: allSelected
        ? prev.modules.filter(m => !ids.includes(m))
        : [...new Set([...prev.modules, ...ids])]
    }));
  };

  const handleSave = async () => {
    try {
      const newComp = await addCompany({
        name: formData.name,
        employeeLimit: formData.employeeLimit,
        activeModules: formData.modules
      });
      
      // Log event
      try {
        await supabase.rpc('log_system_event', {
          event_type: 'Firma Ekleme',
          description: `"${formData.name}" firması ${formData.employeeLimit} çalışan limitiyle oluşturuldu.`,
          target_id: newComp.id
        });
      } catch (e) { console.warn(e); }

      if (adminData.email && newComp) {
        const newUser = await addUser({ 
          email: adminData.email, 
          password: adminData.password, 
          name: adminData.name, 
          role: 'firma_yetkilisi', 
          companyId: newComp.id 
        });

        // Log event
        try {
          await supabase.rpc('log_system_event', {
            event_type: 'Kullanıcı Kaydı',
            description: `"${adminData.name}" (${adminData.email}) adlı kullanıcı firma yetkilisi olarak oluşturuldu ve "${formData.name}" firması ile ilişkilendirildi.`,
            target_id: newUser.id
          });
        } catch (e) { console.warn(e); }
      }
      setShowModal(false);
      setFormData({ name: '', employeeLimit: 50, modules: [] });
      setAdminData({ name: '', email: '', password: '' });
    } catch (err) {
      alert("Firma kaydedilirken bir hata oluştu: " + err.message);
    }
  };

  const handleSaveCompanyUpdates = async (compId, oldName) => {
    try {
      await updateCompany(compId, {
        name: editCompanyFormData.name,
        employeeLimit: editCompanyFormData.employeeLimit,
        activeModules: editCompanyFormData.modules
      });
      setIsEditingCompany(false);
      
      // Log event
      try {
        await supabase.rpc('log_system_event', {
          event_type: 'Firma Güncelleme',
          description: `"${oldName}" firması güncellendi. Yeni isim: "${editCompanyFormData.name}", Yeni limit: ${editCompanyFormData.employeeLimit}. Modüller: [${editCompanyFormData.modules.join(', ')}]`,
          target_id: compId
        });
      } catch (e) { console.warn(e); }
      
      alert('Firma bilgileri başarıyla güncellendi.');
    } catch (err) {
      alert('Güncelleme sırasında hata oluştu: ' + err.message);
    }
  };

  if (selectedCompany) {
    const comp = companies.find(c => c.id === selectedCompany.id) || selectedCompany;
    const compAdmin = users.find(u => u.companyId === comp.id && u.role === 'firma_yetkilisi');
    const compConsultant = users.find(u => u.role === 'danisman' && u.assignedCompanies?.includes(comp.id));
    const activeMods = comp.activeModules || [];
    const totalSelectable = allSelectableIds.length;

    return (
      <div>
        <button onClick={() => { setSelectedCompany(null); setIsEditingCompany(false); }} style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1rem' }}>
          ← Tüm Firmalar
        </button>

        {isEditingCompany ? (
          <div className="module-card glass" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1.5rem 0' }}>Firmayı Düzenle: {comp.name}</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Firma Adı</label>
                <input 
                  type="text" 
                  value={editCompanyFormData.name} 
                  onChange={e => setEditCompanyFormData(prev => ({ ...prev, name: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-color)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Çalışan Limiti</label>
                <input 
                  type="number" 
                  value={editCompanyFormData.employeeLimit} 
                  onChange={e => setEditCompanyFormData(prev => ({ ...prev, employeeLimit: parseInt(e.target.value) || 50 }))}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-color)' }}
                />
              </div>
            </div>

            <h4 style={{ marginBottom: '1rem' }}>Modül İzinleri</h4>
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden', marginBottom: '1.5rem' }}>
              {moduleHierarchy.map(group => {
                return (
                  <div key={group.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', fontWeight: 'bold', color: group.color, fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                      {group.label}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                      {group.items.map(m => {
                        const isCurrentlyActive = editCompanyFormData.modules.includes(m.id);
                        return (
                          <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', cursor: 'pointer', background: isCurrentlyActive ? `${group.color}08` : 'transparent', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                            <input 
                              type="checkbox" 
                              checked={isCurrentlyActive}
                              onChange={() => handleEditToggleModule(m.id, isCurrentlyActive)}
                              style={{ width: '16px', height: '16px', accentColor: group.color }}
                            />
                            <span>{m.icon}</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: isCurrentlyActive ? 'bold' : 'normal' }}>{m.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="secondary-button" onClick={() => setIsEditingCompany(false)}>İptal</button>
              <button className="primary-button" onClick={() => handleSaveCompanyUpdates(comp.id, comp.name)}>Değişiklikleri Kaydet</button>
            </div>
          </div>
        ) : (
          <>
            <div className="module-card glass" style={{ padding: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🏢</div>
                <div>
                  <h2 style={{ margin: '0 0 0.5rem 0' }}>{comp.name}</h2>
                  <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.9rem' }}>
                    👤 Firma Yetkilisi: <strong style={{ color: 'var(--text-color)' }}>{compAdmin?.name || 'Atanmadı'}</strong>
                    <span style={{ margin: '0 0.75rem', color: 'var(--border-color)' }}>|</span>
                    💼 Danışman: <strong style={{ color: 'var(--text-color)' }}>{compConsultant?.name || 'Atanmadı'}</strong>
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Çalışan Paketi</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)', lineHeight: 1 }}>{comp.employeeLimit}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>kişiye kadar</div>
                </div>
                <button 
                  onClick={() => {
                    setEditCompanyFormData({ name: comp.name, employeeLimit: comp.employeeLimit, modules: activeMods });
                    setIsEditingCompany(true);
                  }}
                  className="primary-button"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  Firmayı Düzenle
                </button>
              </div>
            </div>

            <h3 style={{ marginBottom: '1.5rem' }}>Modül Durumu <span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: 'var(--text-light)' }}>({activeMods.length}/{totalSelectable} aktif modül)</span></h3>
            {moduleHierarchy.map(group => {
              const groupActive = group.items.filter(i => activeMods.includes(i.id));
              return (
                <div key={group.id} style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: `2px solid ${group.color}44` }}>
                    <span style={{ fontWeight: 'bold', color: group.color, fontSize: '0.85rem', letterSpacing: '0.05em' }}>{group.label}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{groupActive.length}/{group.items.length} aktif</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '0.75rem' }}>
                    {group.items.map(m => {
                      const isActive = activeMods.includes(m.id);
                      return (
                        <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', border: isActive ? `2px solid ${group.color}` : '1px solid var(--border-color)', background: isActive ? `${group.color}0d` : 'transparent', opacity: isActive ? 1 : 0.45, transition: 'all 0.2s' }}>
                          <span style={{ fontSize: '1.1rem' }}>{m.icon}</span>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{m.label}</div>
                            <div style={{ fontSize: '0.7rem', color: isActive ? group.color : 'var(--text-light)', marginTop: '0.1rem' }}>{isActive ? '✓ Aktif' : '✗ Pasif'}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {compAdmin ? (
              <div className="module-card glass" style={{ padding: '1.5rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ margin: 0 }}>Firma Yetkilisi Bilgileri</h4>
                  {!isEditingAdmin ? (
                    <button 
                      onClick={() => { 
                        setEditAdminData({ name: compAdmin.name || '', email: compAdmin.email || '', password: '' });
                        setIsEditingAdmin(true);
                      }}
                      className="primary-button" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      Bilgileri Düzenle
                    </button>
                  ) : null}
                </div>

                {isEditingAdmin ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Ad Soyad</label>
                        <input 
                          type="text" 
                          value={editAdminData.name} 
                          onChange={(e) => setEditAdminData(prev => ({ ...prev, name: e.target.value }))}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-color)' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>E-posta</label>
                        <input 
                          type="email" 
                          value={editAdminData.email} 
                          onChange={(e) => setEditAdminData(prev => ({ ...prev, email: e.target.value }))}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-color)' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Yeni Şifre (Değiştirmek için)</label>
                        <input 
                          type="password" 
                          placeholder="Değiştirmek için yazın"
                          value={editAdminData.password} 
                          onChange={(e) => setEditAdminData(prev => ({ ...prev, password: e.target.value }))}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-color)' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                      <button 
                        onClick={() => setIsEditingAdmin(false)}
                        className="secondary-button"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-color)', cursor: 'pointer', borderRadius: '4px' }}
                      >
                        Vazgeç
                      </button>
                      <button 
                        onClick={async () => {
                          try {
                            await adminUpdateUser(compAdmin.id, {
                              name: editAdminData.name,
                              email: editAdminData.email,
                              password: editAdminData.password || undefined,
                              role: 'firma_yetkilisi'
                            });
                            setIsEditingAdmin(false);
                            
                            // Log event
                            try {
                              await supabase.rpc('log_system_event', {
                                event_type: 'Kullanıcı Güncelleme',
                                description: `"${comp.name}" firmasının yetkilisi "${compAdmin.name}" bilgileri güncellendi.`,
                                target_id: compAdmin.id
                              });
                            } catch (e) { console.warn(e); }

                            alert('Bilgiler başarıyla güncellendi.');
                          } catch (err) {
                            alert('Güncelleme sırasında hata oluştu: ' + err.message);
                          }
                        }}
                        className="primary-button"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                      >
                        Kaydet
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                    <div><div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Ad Soyad</div><div style={{ fontWeight: 'bold' }}>{compAdmin.name}</div></div>
                    <div><div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>E-posta</div><div style={{ fontWeight: 'bold' }}>{compAdmin.email}</div></div>
                    <div><div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Şifre</div><div style={{ fontWeight: 'bold', letterSpacing: '0.15em' }}>{'•'.repeat(compAdmin.password?.length || 6)}</div></div>
                  </div>
                )}
              </div>
            ) : (
              <div className="module-card glass" style={{ padding: '1.5rem', marginTop: '1rem', border: '1px dashed #f59e0b', background: 'rgba(245, 158, 11, 0.03)' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#f59e0b' }}>⚠️ Firma Yetkilisi Atanmadı</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                  Bu firmaya henüz bağlı bir yetkili hesap bulunmamaktadır. Aşağıdaki formdan ilk yetkiliyi tanımlayabilirsiniz.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Ad Soyad</label>
                    <input 
                      type="text" 
                      placeholder="Yöneticinin adı soyadı"
                      value={adminData.name} 
                      onChange={(e) => setAdminData(prev => ({ ...prev, name: e.target.value }))}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-color)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>E-posta</label>
                    <input 
                      type="email" 
                      placeholder="Giriş e-posta adresi"
                      value={adminData.email} 
                      onChange={(e) => setAdminData(prev => ({ ...prev, email: e.target.value }))}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-color)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Şifre (Min 6 Karakter)</label>
                    <input 
                      type="password" 
                      placeholder="Giriş şifresi"
                      value={adminData.password} 
                      onChange={(e) => setAdminData(prev => ({ ...prev, password: e.target.value }))}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-color)' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button 
                    onClick={async () => {
                      if (!adminData.email || !adminData.password || !adminData.name) {
                        alert('Lütfen tüm alanları doldurun.');
                        return;
                      }
                      try {
                        const newUser = await addUser({ 
                          email: adminData.email, 
                          password: adminData.password, 
                          name: adminData.name, 
                          role: 'firma_yetkilisi', 
                          companyId: comp.id 
                        });
                        
                        // Log event
                        try {
                          await supabase.rpc('log_system_event', {
                            event_type: 'Kullanıcı Kaydı',
                            description: `"${adminData.name}" (${adminData.email}) adlı kullanıcı "${comp.name}" firmasına yetkili olarak atandı.`,
                            target_id: newUser.id
                          });
                        } catch (e) { console.warn(e); }

                        setAdminData({ name: '', email: '', password: '' });
                        alert('Firma yetkilisi başarıyla tanımlandı.');
                      } catch (err) {
                        alert('Yetkili tanımlanırken hata oluştu: ' + err.message);
                      }
                    }}
                    className="primary-button"
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    Yetkili Hesabı Oluştur
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>Sistemdeki Firmalar</h2>
        <button className="primary-button" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Yeni Firma Ekle
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {companies.map(c => {
          const compAdmin = users.find(u => u.companyId === c.id && u.role === 'firma_yetkilisi');
          const compConsultant = users.find(u => u.role === 'danisman' && u.assignedCompanies?.includes(c.id));
          const activeMods = c.activeModules || [];
          return (
            <div key={c.id} className="module-card glass" onClick={() => setSelectedCompany(c)}
              style={{ padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', borderTop: '4px solid #6366f1' }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.25)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>🏢</div>
                <span style={{ background: 'rgba(99,102,241,0.12)', color: '#6366f1', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  {activeMods.length} alt modül
                </span>
              </div>
              <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.1rem' }}>{c.name}</h3>
              <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-light)', fontSize: '0.85rem' }}>👤 Yetkili: {compAdmin?.name || 'Yetkili atanmadı'}</p>
              <p style={{ margin: '0 0 1rem 0', color: 'var(--text-light)', fontSize: '0.85rem' }}>💼 Danışman: {compConsultant?.name || 'Danışman atanmadı'}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-light)' }}>Çalışan Limiti</span>
                <strong>{c.employeeLimit} kişi</strong>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {activeMods.slice(0, 5).map(modId => {
                  const allItems = moduleHierarchy.flatMap(g => g.items.map(i => ({ ...i, color: g.color })));
                  const mod = allItems.find(m => m.id === modId);
                  return mod ? <span key={modId} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: `${mod.color}18`, color: mod.color, borderRadius: '8px', fontWeight: 600 }}>{mod.icon} {mod.label}</span> : null;
                })}
                {activeMods.length > 5 && <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(99,102,241,0.1)', color: '#6366f1', borderRadius: '8px' }}>+{activeMods.length - 5} daha</span>}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', color: '#1f2937', padding: '2rem', borderRadius: '16px', width: '100%', maxWidth: '680px', boxShadow: '0 20px 50px rgba(0,0,0,0.25)', maxHeight: '92vh', overflowY: 'auto' }}>
            <h2 style={{ marginTop: 0, color: '#111827', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>Yeni Firma ve Yetkili Tanımla</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <h4 style={{ marginBottom: '0.5rem', color: '#374151' }}>Firma Bilgileri</h4>
                <input type="text" placeholder="Firma Adı" style={{ marginBottom: '0.75rem', width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', color: '#111827', background: '#f9fafb', boxSizing: 'border-box' }}
                  value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                <input type="number" placeholder="Çalışan Limiti" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', color: '#111827', background: '#f9fafb', boxSizing: 'border-box' }}
                  value={formData.employeeLimit} onChange={e => setFormData({ ...formData, employeeLimit: parseInt(e.target.value) })} />
              </div>
              <div>
                <h4 style={{ marginBottom: '0.5rem', color: '#374151' }}>Yetkili Bilgileri</h4>
                <input type="text" placeholder="Ad Soyad" style={{ marginBottom: '0.75rem', width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', color: '#111827', background: '#f9fafb', boxSizing: 'border-box' }}
                  value={adminData.name} onChange={e => setAdminData({ ...adminData, name: e.target.value })} />
                <input type="email" placeholder="E-posta" style={{ marginBottom: '0.75rem', width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', color: '#111827', background: '#f9fafb', boxSizing: 'border-box' }}
                  value={adminData.email} onChange={e => setAdminData({ ...adminData, email: e.target.value })} />
                <input type="text" placeholder="Şifre" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', color: '#111827', background: '#f9fafb', boxSizing: 'border-box' }}
                  value={adminData.password} onChange={e => setAdminData({ ...adminData, password: e.target.value })} />
              </div>
            </div>

            {/* Hiyerarşik Modül Seçimi */}
            <h4 style={{ color: '#374151', marginBottom: '1rem' }}>Aktif Modüller</h4>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden', marginBottom: '2rem' }}>
              {/* Sabit: Şerket Profili + Ayarlar */}
              <div style={{ padding: '0.75rem 1rem', background: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#6b7280', letterSpacing: '0.05em' }}>HER ZAMAN AKİF</span>
              </div>
              <div style={{ padding: '0.75rem 1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid #e5e7eb', background: '#fafafa' }}>
                {[{ id: 'companyProfile', icon: '🏢', label: 'Şerket Profili' }, { id: 'masterData', icon: '⚙️', label: 'Veri ve Kütüphane Yönetimi' }].map(m => (
                  <span key={m.id} style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', background: '#d1fae5', color: '#065f46', borderRadius: '20px', fontWeight: '600' }}>✓ {m.icon} {m.label}</span>
                ))}
              </div>

              {/* Seçilebilir gruplar */}
              {moduleHierarchy.map((group, gi) => {
                const groupIds = group.items.map(i => i.id);
                const allGroupSelected = groupIds.every(id => formData.modules.includes(id));
                return (
                  <div key={group.id}>
                    {/* Grup Başlığı */}
                    <div style={{ padding: '0.75rem 1rem', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: gi > 0 ? '1px solid #e5e7eb' : 'none' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: group.color, letterSpacing: '0.05em' }}>{group.label}</span>
                      <button type="button" onClick={() => handleToggleGroup(group.items)}
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '12px', border: `1px solid ${group.color}`, background: allGroupSelected ? group.color : 'transparent', color: allGroupSelected ? '#fff' : group.color, cursor: 'pointer', fontWeight: '600' }}>
                        {allGroupSelected ? 'Tamamını Kaldır' : 'Tamamını Seç'}
                      </button>
                    </div>
                    {/* Alt modüller */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid #f3f4f6' }}>
                      {group.items.map((m, idx) => {
                        const isSelected = formData.modules.includes(m.id);
                        return (
                          <label key={m.id}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 1rem', cursor: 'pointer', background: isSelected ? `${group.color}0d` : '#fff', borderBottom: '1px solid #f3f4f6', borderRight: idx % 2 === 0 ? '1px solid #f3f4f6' : 'none', transition: 'background 0.15s' }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleModule(m.id)}
                              style={{ width: '16px', height: '16px', accentColor: group.color, cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '1rem' }}>{m.icon}</span>
                            <span style={{ fontSize: '0.85rem', color: isSelected ? '#111827' : '#4b5563', fontWeight: isSelected ? '600' : '400' }}>{m.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{formData.modules.length} modül seçildi</span>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', color: '#374151', cursor: 'pointer' }} onClick={() => setShowModal(false)}>İptal</button>
                <button style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: '#6366f1', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }} onClick={handleSave}>Firmayı Kaydet</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ConsultantManagementTab({ consultants, addUser, companies, updateUser, adminUpdateUser }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', assignedCompanies: [] });
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [editAssignedCompanies, setEditAssignedCompanies] = useState([]);
  const [isEditingConsultant, setIsEditingConsultant] = useState(false);
  const [editConsultantData, setEditConsultantData] = useState({ name: '', email: '', password: '' });

  const handleToggleCompany = (compId) => {
    setFormData(prev => ({
      ...prev,
      assignedCompanies: prev.assignedCompanies.includes(compId) 
        ? prev.assignedCompanies.filter(c => c !== compId)
        : [...prev.assignedCompanies, compId]
    }));
  };

  const handleSave = async () => {
    try {
      const newUser = await addUser({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: 'danisman',
        assignedCompanies: formData.assignedCompanies
      });
      
      // Log event
      try {
        await supabase.rpc('log_system_event', {
          event_type: 'Danışman Ekleme',
          description: `"${formData.name}" (${formData.email}) adlı danışman oluşturuldu. Sorumlu firmalar: [${formData.assignedCompanies.map(id => companies.find(c=>c.id===id)?.name || id).join(', ')}]`,
          target_id: newUser.id
        });
      } catch (e) { console.warn(e); }

      setShowModal(false);
      setFormData({ name: '', email: '', password: '', assignedCompanies: [] });
      alert('Danışman başarıyla oluşturuldu.');
    } catch (err) {
      alert("Danışman kaydedilirken bir hata oluştu: " + err.message);
    }
  };

  const openConsultantDetail = (consultant) => {
    setSelectedConsultant(consultant);
    setEditAssignedCompanies(consultant.assignedCompanies || []);
  };

  const toggleEditCompany = (compId) => {
    const isAssigned = editAssignedCompanies.includes(compId);
    const comp = companies.find(c => c.id === compId);
    const confirmed = window.confirm(
      `Bu danışmanı "${comp.name}" firmasına ${isAssigned ? 'çıkarmak' : 'atamak'} istediğinize emin misiniz?`
    );
    if (confirmed) {
      setEditAssignedCompanies(prev => 
        prev.includes(compId) ? prev.filter(c => c !== compId) : [...prev, compId]
      );
    }
  };

  const saveConsultantUpdates = async () => {
    try {
      await updateUser(selectedConsultant.id, { assignedCompanies: editAssignedCompanies });
      
      // Log event
      try {
        await supabase.rpc('log_system_event', {
          event_type: 'Danışman İş Yükü Güncelleme',
          description: `"${selectedConsultant.name}" danışmanının sorumlu olduğu firmalar güncellendi. Yeni liste: [${editAssignedCompanies.map(id => companies.find(c => c.id === id)?.name || id).join(', ')}]`,
          target_id: selectedConsultant.id
        });
      } catch (e) { console.warn(e); }

      setSelectedConsultant(null);
      alert('İş yükü başarıyla güncellendi.');
    } catch (err) {
      alert("Güncelleme kaydedilirken bir hata oluştu: " + err.message);
    }
  };

  if (selectedConsultant) {
    return (
      <div className="module-card glass" style={{ padding: '2rem' }}>
        <button onClick={() => setSelectedConsultant(null)} style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
          ← Geri Dön
        </button>
        
        <div className="module-card glass" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h4 style={{ margin: 0 }}>Danışman Profil Bilgileri</h4>
            {!isEditingConsultant ? (
              <button 
                onClick={() => {
                  setEditConsultantData({ name: selectedConsultant.name || '', email: selectedConsultant.email || '', password: '' });
                  setIsEditingConsultant(true);
                }}
                className="primary-button"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              >
                Bilgileri Düzenle
              </button>
            ) : null}
          </div>

          {isEditingConsultant ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Ad Soyad</label>
                  <input 
                    type="text" 
                    value={editConsultantData.name} 
                    onChange={(e) => setEditConsultantData(prev => ({ ...prev, name: e.target.value }))}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-color)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>E-posta</label>
                  <input 
                    type="email" 
                    value={editConsultantData.email} 
                    onChange={(e) => setEditConsultantData(prev => ({ ...prev, email: e.target.value }))}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-color)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Yeni Şifre (Değiştirmek için)</label>
                  <input 
                    type="password" 
                    placeholder="Değiştirmek için yazın"
                    value={editConsultantData.password} 
                    onChange={(e) => setEditConsultantData(prev => ({ ...prev, password: e.target.value }))}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-color)' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button 
                  onClick={() => setIsEditingConsultant(false)}
                  className="secondary-button"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-color)', cursor: 'pointer', borderRadius: '4px' }}
                >
                  Vazgeç
                </button>
                <button 
                  onClick={async () => {
                    try {
                      await adminUpdateUser(selectedConsultant.id, {
                        name: editConsultantData.name,
                        email: editConsultantData.email,
                        password: editConsultantData.password || undefined,
                        role: 'danisman'
                      });
                      setIsEditingConsultant(false);
                      
                      // Log event
                      try {
                        await supabase.rpc('log_system_event', {
                          event_type: 'Danışman Güncelleme',
                          description: `Danışman "${selectedConsultant.name}" profil bilgileri güncellendi. Yeni isim: "${editConsultantData.name}".`,
                          target_id: selectedConsultant.id
                        });
                      } catch (e) { console.warn(e); }

                      setSelectedConsultant(prev => ({ ...prev, name: editConsultantData.name, email: editConsultantData.email }));
                      alert('Danışman bilgileri başarıyla güncellendi.');
                    } catch (err) {
                      alert('Güncelleme sırasında hata oluştu: ' + err.message);
                    }
                  }}
                  className="primary-button"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                >
                  Kaydet
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div className="avatar" style={{width: '64px', height: '64px', fontSize: '2rem'}}>{selectedConsultant.name.charAt(0)}</div>
              <div>
                <h2 style={{ margin: '0 0 0.25rem 0' }}>{selectedConsultant.name}</h2>
                <p style={{ margin: 0, color: 'var(--text-light)' }}>{selectedConsultant.email}</p>
              </div>
            </div>
          )}
        </div>

        <h3 style={{ marginBottom: '1rem' }}>Sorumlu Olduğu Firmalar (İş Yükü)</h3>
        <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Aşağıdaki listeden danışmana atanmış firmaları görebilir veya yeni firma atayabilirsiniz.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {companies.map(comp => {
             const isAssigned = editAssignedCompanies.includes(comp.id);
             return (
               <label key={comp.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: isAssigned ? '2px solid #3b82f6' : '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', background: isAssigned ? 'rgba(59, 130, 246, 0.05)' : 'transparent', transition: 'all 0.2s' }}>
                 <input type="checkbox" checked={isAssigned} onChange={() => toggleEditCompany(comp.id)} style={{ width: '18px', height: '18px' }} />
                 <span style={{ fontWeight: isAssigned ? 'bold' : 'normal', color: 'var(--text-color)' }}>{comp.name}</span>
               </label>
             );
          })}
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="primary-button" onClick={saveConsultantUpdates}>Değişiklikleri Kaydet</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2>Danışmanlar</h2>
        <button className="primary-button" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Yeni Danışman Ekle
        </button>
      </div>

      <div className="grid-layout">
        {consultants.map(c => (
           <div key={c.id} onClick={() => openConsultantDetail(c)} className="module-card glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
             <div className="avatar" style={{width: '50px', height: '50px', fontSize: '1.5rem', flexShrink: 0}}>{c.name.charAt(0)}</div>
             <div>
               <h3 style={{ margin: '0 0 0.25rem 0' }}>{c.name}</h3>
               <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.9rem' }}>{c.email}</p>
               <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <span style={{ background: 'var(--primary-color)', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '12px' }}>{c.assignedCompanies?.length || 0} Firma</span>
                 <span style={{ color: 'var(--text-light)' }}>Yönetiyor (Detay için tıkla)</span>
               </div>
             </div>
           </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ background: '#ffffff', color: '#1f2937', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h2 style={{marginTop: 0, color: '#111827', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem'}}>Yeni Danışman Ekle</h2>
            
            <div style={{ marginTop: '1.5rem' }}>
              <input type="text" placeholder="Ad Soyad" className="text-input" style={{marginBottom: '1rem', width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', color: '#111827', background: '#f9fafb'}} 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              
              <input type="email" placeholder="E-posta" className="text-input" style={{marginBottom: '1rem', width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', color: '#111827', background: '#f9fafb'}} 
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              
              <input type="text" placeholder="Şifre" className="text-input" style={{marginBottom: '1.5rem', width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', color: '#111827', background: '#f9fafb'}} 
                value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>

            <h4 style={{marginBottom: '0.5rem', color: '#374151'}}>Sorumlu Olacağı Firmalar</h4>
            <div style={{ maxHeight: '150px', overflowY: 'auto', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
              {companies.map(comp => (
                 <label key={comp.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', color: '#4b5563', padding: '0.5rem', borderRadius: '4px', background: formData.assignedCompanies.includes(comp.id) ? '#eff6ff' : 'transparent' }}>
                   <input type="checkbox" checked={formData.assignedCompanies.includes(comp.id)} onChange={() => handleToggleCompany(comp.id)} style={{ width: '16px', height: '16px' }} />
                   {comp.name}
                 </label>
              ))}
            </div>

            <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
              <button style={{ padding: '0.75rem 1.5rem', borderRadius: '6px', border: '1px solid #d1d5db', background: '#ffffff', color: '#374151', cursor: 'pointer' }} onClick={() => setShowModal(false)}>İptal</button>
              <button style={{ padding: '0.75rem 1.5rem', borderRadius: '6px', border: 'none', background: '#3b82f6', color: '#ffffff', cursor: 'pointer', fontWeight: 'bold' }} onClick={handleSave}>Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SystemLogsTab() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data, error } = await supabase
          .from('system_logs')
          .select('*')
          .order('created_at', { ascending: false });
        if (data && !error) {
          setLogs(data);
        }
      } catch (e) {
        console.error('Logs fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) {
    return <div style={{ color: 'var(--text-light)', padding: '2rem', textAlign: 'center' }}>Yükleniyor...</div>;
  }

  return (
    <div className="module-card glass" style={{ padding: '2rem' }}>
      <h3 style={{ marginBottom: '1.5rem' }}>Sistem Günlükleri (Log Kayıtları)</h3>
      {logs.length === 0 ? (
        <p style={{ color: 'var(--text-light)' }}>Henüz kaydedilmiş bir işlem bulunmuyor.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-light)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Tarih</th>
                <th style={{ padding: '0.75rem 1rem' }}>İşlemi Yapan</th>
                <th style={{ padding: '0.75rem 1rem' }}>İşlem Türü</th>
                <th style={{ padding: '0.75rem 1rem' }}>Açıklama</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                    {new Date(log.created_at).toLocaleString('tr-TR')}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: '500' }}>
                    {log.operator_email}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem', 
                      fontWeight: 'bold',
                      background: log.event_type.includes('Ekleme') ? 'rgba(16, 185, 129, 0.12)' : 'rgba(59, 130, 246, 0.12)',
                      color: log.event_type.includes('Ekleme') ? '#10b981' : '#3b82f6'
                    }}>
                      {log.event_type}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-light)' }}>
                    {log.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
