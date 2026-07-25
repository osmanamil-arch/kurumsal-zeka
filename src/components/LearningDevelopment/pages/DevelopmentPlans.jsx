import React, { useState } from 'react';

export default function DevelopmentPlans({ plans, setPlans, employees, catalog, userRole }) {
  const isAdmin = userRole === 'danisman' || userRole === 'superadmin' || userRole === 'musteri';
  
  const [activePlanId, setActivePlanId] = useState(null);
  const [goalData, setGoalData] = useState({ title: '', source: 'Performans Görüşmesi', managerNote: '', trainings: [] });

  const handleToggleTraining = (tId) => {
    if (goalData.trainings.includes(tId)) {
      setGoalData({ ...goalData, trainings: goalData.trainings.filter(id => id !== tId) });
    } else {
      setGoalData({ ...goalData, trainings: [...goalData.trainings, tId] });
    }
  };

  const handleSaveGoal = () => {
    if (!goalData.title) {
      alert('Lütfen hedefe bir başlık verin.');
      return;
    }

    const newGoal = {
      id: `g_${Date.now()}`,
      title: goalData.title,
      source: goalData.source,
      managerNote: goalData.managerNote,
      priority: 'HIGH', // default demo
      trainings: goalData.trainings
    };

    const updatedPlans = plans.map(p => {
      if (p.id === activePlanId) {
        return { ...p, goals: [...p.goals, newGoal] };
      }
      return p;
    });

    setPlans(updatedPlans);
    alert('Hedef ve eğitim ataması başarıyla plana eklendi!');
    setActivePlanId(null);
    setGoalData({ title: '', source: 'Performans Görüşmesi', managerNote: '', trainings: [] });
  };

  return (
    <div className="development-plans fade-in" style={{ position: 'relative' }}>
      <div className="header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Bireysel Gelişim Planları (IDP)</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Performans, psikometri ve rol analizi kaynaklı kişisel gelişim aksiyonları</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {plans.map(plan => {
          const emp = employees.find(e => e.id === plan.employeeId);
          return (
            <div key={plan.id} className="plan-card glass" style={{ padding: '1.5rem', borderRadius: '8px', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', background: '#e0f2fe', color: '#0284c7', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
                    {emp?.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: '#0f172a' }}>{emp?.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{plan.period} Dönemi</span>
                  </div>
                </div>
                <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', background: plan.status === 'IN_PROGRESS' ? '#dbeafe' : '#dcfce3', color: plan.status === 'IN_PROGRESS' ? '#1d4ed8' : '#15803d' }}>
                  {plan.status === 'IN_PROGRESS' ? 'DEVAM EDİYOR' : 'TAMAMLANDI'}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                {plan.goals.map(goal => (
                  <div key={goal.id} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '6px', borderLeft: `3px solid ${goal.priority === 'HIGH' ? '#ef4444' : '#3b82f6'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <h5 style={{ margin: 0, fontSize: '0.95rem' }}>{goal.title}</h5>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>{goal.source}</span>
                    </div>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#475569' }}>{goal.managerNote}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {goal.trainings.map(tId => {
                        const t = catalog.find(x => x.id === tId);
                        return <span key={tId} style={{ fontSize: '0.75rem', background: '#fff', border: '1px solid #cbd5e1', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>🎓 {t?.title || 'Eğitim'}</span>
                      })}
                    </div>
                  </div>
                ))}
                {plan.goals.length === 0 && <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>Henüz bir hedef atanmamış.</p>}
              </div>

              {isAdmin && (
                <button 
                  onClick={() => setActivePlanId(plan.id)}
                  style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', background: '#f1f5f9', color: '#3b82f6', border: '1px dashed #3b82f6', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}>
                  + Yeni Hedef ve Eğitim Ata
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Hedef Ekleme Modalı */}
      {activePlanId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass fade-in" style={{ background: '#fff', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#1e293b' }}>Yeni Gelişim Hedefi Ekle</h3>
              <button onClick={() => setActivePlanId(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>×</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Gelişim Hedefi Adı</label>
                <input 
                  type="text" 
                  value={goalData.title}
                  onChange={e => setGoalData({...goalData, title: e.target.value})}
                  placeholder="Örn: Müzakere Tekniklerinin Geliştirilmesi"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Hedef Kaynağı</label>
                <select 
                  value={goalData.source}
                  onChange={e => setGoalData({...goalData, source: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}>
                  <option value="Performans Görüşmesi">Performans Görüşmesi</option>
                  <option value="Yönetici Gözlemi">Yönetici Gözlemi</option>
                  <option value="Kariyer Hedefi">Kariyer Hedefi (Terfi)</option>
                  <option value="Yetkinlik Açığı">Yetkinlik Açığı Tespiti</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Yönetici Notu</label>
                <textarea 
                  value={goalData.managerNote}
                  onChange={e => setGoalData({...goalData, managerNote: e.target.value})}
                  placeholder="Gelişimin neden gerekli olduğu ve beklenen sonuçlar..."
                  rows="3"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical' }}
                />
              </div>
            </div>

            <h4 style={{ fontSize: '0.95rem', color: '#334155', marginBottom: '0.5rem' }}>Bu Hedefe Bağlı Eğitimler Ata</h4>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '1rem', maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
              {catalog.map(training => (
                <label key={training.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox"
                    checked={goalData.trainings.includes(training.id)}
                    onChange={() => handleToggleTraining(training.id)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '0.9rem' }}>{training.title} <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>({training.category.toUpperCase()})</span></span>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button onClick={() => setActivePlanId(null)} style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>İptal</button>
              <button onClick={handleSaveGoal} style={{ padding: '0.75rem 1.5rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Plana Ekle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
