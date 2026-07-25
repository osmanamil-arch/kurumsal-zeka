import React, { useState } from 'react';
import PerformanceConfigView from './PerformanceConfigView';
import PerformanceMyEvaluations from './PerformanceMyEvaluations';
import PerformanceResultDashboard from './PerformanceResultDashboard';
import './HumanResourcesModule.css'; // Stil paylaşımı için

export default function PerformanceModule({ 
  employees, 
  departments, 
  titles, 
  jobAnalyses, 
  campaigns, 
  setCampaigns, 
  userRole 
}) {
  const [activeMajorTab, setActiveMajorTab] = useState('admin'); // 'admin' | 'employee'
  const [mockLoginId, setMockLoginId] = useState(''); // Sistemde kim olarak geziyoruz

  const [currentView, setCurrentView] = useState('list'); // 'list' | 'config' | 'evaluate'
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);

  const handleOpenConfig = (campaignId = null) => {
    setSelectedCampaignId(campaignId);
    setCurrentView('config');
  };

  const handleOpenDashboard = (campaignId) => {
    setSelectedCampaignId(campaignId);
    setCurrentView('dashboard');
  };

  const handleCloseConfig = () => {
    setSelectedCampaignId(null);
    setCurrentView('list');
  };

  const handleSaveCampaign = (campaignData) => {
    setCampaigns(prev => {
      let newData = [...prev];
      const existsIndex = newData.findIndex(c => c.id === campaignData.id);
      if (existsIndex !== -1) {
        newData[existsIndex] = campaignData;
      } else {
        newData.unshift(campaignData);
      }
      return newData;
    });
    handleCloseConfig();
  };

  const handleDeleteCampaign = (id) => {
    if (window.confirm('Bu kampanyayı tamamen silmek istediğinize emin misiniz? Puanlanmış tüm anketler silinebilir!')) {
      setCampaigns(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleCompleteTask = (campaignId, taskId, evalData) => {
    setCampaigns(prev => prev.map(camp => {
      if (camp.id === campaignId) {
        const existingEvals = camp.evaluations || [];
        return {
          ...camp,
          evaluations: [...existingEvals.filter(e => e.taskId !== taskId), { taskId, ...evalData }]
        };
      }
      return camp;
    }));
  };

  return (
    <div className="performance-module fade-in">
      
      {/* MOCK LOGIN & TOP TABS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: '#fff', padding: '1rem 1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
         <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => setActiveMajorTab('admin')} 
              style={{ padding: '0.6rem 1.2rem', background: activeMajorTab === 'admin' ? '#1e293b' : 'transparent', color: activeMajorTab === 'admin' ? '#fff' : '#64748b', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
            >
              ⚙️ İK Yönetim Paneli
            </button>
            <button 
              onClick={() => setActiveMajorTab('employee')} 
              style={{ padding: '0.6rem 1.2rem', background: activeMajorTab === 'employee' ? '#3b82f6' : 'transparent', color: activeMajorTab === 'employee' ? '#fff' : '#64748b', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
            >
              🎯 Değerlendirmelerim
            </button>
         </div>

         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Test İçin Oturum Aç:</span>
            <select 
               value={mockLoginId} 
               onChange={e => setMockLoginId(e.target.value)}
               style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', minWidth: '200px' }}
            >
               <option value="">-- Danışman / Admin --</option>
               {employees.filter(e => e.isActive !== false).map(e => <option key={e.id} value={e.id}>{e.name} ({e.title || e.department})</option>)}
            </select>
         </div>
      </div>

      <div className="profile-content glass fade-in" style={{ padding: '2rem' }}>
        
        {activeMajorTab === 'admin' && currentView === 'list' && (
          <div className="campaign-list">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>
              <div>
                <h2 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>360-Derece Performans Kampanyaları</h2>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Şirketinizin performans döngülerini ve 360-derece matrislerini buradan yönetin.</p>
              </div>
              <button 
                onClick={() => handleOpenConfig()} 
                style={{ padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)' }}
              >
                + Yeni Kampanya Başlat
              </button>
            </div>

            {campaigns.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #cbd5e1' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🎯</span>
                <h3 style={{ color: '#334155', marginBottom: '0.5rem' }}>Buralar henüz çok sessiz!</h3>
                <p style={{ color: '#64748b', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
                  Çalışanlarınızın görev ve yetkinlik skorlarını ölçmek için bir 360-derece değerlendirme periyodu yapılandırın. Mimarimiz Excel hamallığını bitirecek otonom matris özellikleriyle doludur.
                </p>
                <button onClick={() => handleOpenConfig()} style={{ padding: '0.6rem 1.5rem', background: 'transparent', color: '#3b82f6', border: '2px solid #3b82f6', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                  Hemen Yapılandır
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {campaigns.map(camp => (
                  <div key={camp.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', position: 'relative', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                      <span style={{ background: camp.status === 'ACTIVE' ? '#dcfce7' : '#f1f5f9', color: camp.status === 'ACTIVE' ? '#15803d' : '#64748b', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                        {camp.status === 'ACTIVE' ? 'YAYINDA' : 'TASLAK'}
                      </span>
                    </div>
                    
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', paddingRight: '70px' }}>{camp.name}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 1.5rem 0' }}>Periyot: {camp.periodStart} - {camp.periodEnd}</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                       <div>
                         <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Kapsam</span>
                         <strong style={{ color: '#334155', fontSize: '0.85rem' }}>{camp.filters?.departments?.length === 0 ? 'Tüm Şirket' : `${camp.filters?.departments?.length} Departman`}</strong>
                       </div>
                       <div>
                         <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Tamamlanan</span>
                         <strong style={{ color: '#334155', fontSize: '0.85rem' }}>{camp.evaluations?.length || 0} / {camp.matrix?.reduce((acc, row) => acc + row.raters.length, 0) || 0} form</strong>
                       </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleOpenConfig(camp.id)} style={{ flex: 1, padding: '0.6rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>Ayarları İncele</button>
                        <button onClick={() => handleDeleteCampaign(camp.id)} style={{ padding: '0.6rem', background: 'transparent', border: '1px solid #fca5a5', color: '#ef4444', borderRadius: '6px', cursor: 'pointer' }} title="Sil">🗑️</button>
                      </div>
                      {(camp.status === 'ACTIVE' || camp.status === 'COMPLETED') && (
                        <button onClick={() => handleOpenDashboard(camp.id)} style={{ padding: '0.6rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 4px rgba(59,130,246,0.3)', marginTop: '0.2rem' }}>
                           📊 Sonuçları Analiz Et
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeMajorTab === 'admin' && currentView === 'config' && (
          <PerformanceConfigView 
            employees={employees}
            departments={departments}
            titles={titles}
            jobAnalyses={jobAnalyses}
            initialCampaignId={selectedCampaignId}
            existingCampaigns={campaigns}
            onSave={handleSaveCampaign}
            onClose={handleCloseConfig}
          />
        )}

        {activeMajorTab === 'admin' && currentView === 'dashboard' && (
          <PerformanceResultDashboard 
             campaign={campaigns.find(c => c.id === selectedCampaignId)}
             employees={employees}
             departments={departments}
             onBack={() => setCurrentView('list')}
          />
        )}

        {activeMajorTab === 'employee' && (
           <PerformanceMyEvaluations 
             mockLoginId={mockLoginId}
             campaigns={campaigns}
             employees={employees}
             jobAnalyses={jobAnalyses}
             titles={titles}
             departments={departments}
             onCompleteTask={handleCompleteTask}
           />
        )}

      </div>
    </div>
  );
}
