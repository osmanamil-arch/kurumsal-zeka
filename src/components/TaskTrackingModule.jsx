import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './TaskTrackingModule.css';

export default function TaskTrackingModule({ employees = [], userRole = 'calisan', dailyTasks, setDailyTasks, goals, setGoals }) {
  
  // Views: 'all', 'mine', 'delayed'
  const [viewFilter, setViewFilter] = useState('all');
  
  // Filters
  const [filterOwner, setFilterOwner] = useState('');
  
  // Modal State
  const [showWizard, setShowWizard] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', owner: '', deadline: '', linkedGoalId: '' });

  // Currently logged in mock mapping (since we don't have real auth, pretend user is e1 if calisan)
  const currentUserId = userRole === 'danisman' ? 'ADMIN' : 'e1'; // Using 'e1' as mock for "Bana Atananlar"

  // Combine and map tasks
  const combinedTasks = useMemo(() => {
    let sTasks = [];
    goals.forEach(g => {
      g.actions.forEach(a => {
        sTasks.push({
          ...a,
          source: 'strategy',
          goalId: g.id,
          goalTitle: g.title,
          kpiName: g.kpi?.name
        });
      });
    });
    
    let dTasks = dailyTasks.map(t => {
      const linkedGoal = goals.find(g => g.id === t.linkedGoalId);
      return {
        ...t,
        source: 'daily',
        goalTitle: linkedGoal ? linkedGoal.title : null
      };
    });
    
    return [...sTasks, ...dTasks];
  }, [goals, dailyTasks]);

  // Process Statuses dynamically
  const processedTasks = useMemo(() => {
    return combinedTasks.map(t => {
      let isDelayed = new Date(t.deadline) < new Date(new Date().setHours(0,0,0,0));
      let currentStatus = 'progress';
      let statusText = 'Devam Ediyor';
      
      if (t.status === 'tamamlandi') {
        currentStatus = 'completed';
        statusText = 'Tamamlandı';
      } else if (isDelayed) {
        currentStatus = 'delayed';
        statusText = 'Gecikmiş';
      }

      return { ...t, currentStatus, statusText };
    }).sort((a, b) => new Date(a.deadline) - new Date(b.deadline)); // Sort closest first
  }, [combinedTasks]);

  // Filter logic
  const filteredTasks = useMemo(() => {
    return processedTasks.filter(t => {
      // 1. View Filter
      if (viewFilter === 'mine' && t.owner !== currentUserId && userRole !== 'danisman') return false; 
      if (viewFilter === 'delayed' && t.currentStatus !== 'delayed') return false;
      
      // 2. Select Filter
      if (filterOwner && t.owner !== filterOwner) return false;
      
      return true;
    });
  }, [processedTasks, viewFilter, filterOwner, currentUserId, userRole]);

  // Handlers
  const handleCreateTask = () => {
    if (!newTask.title || !newTask.owner || !newTask.deadline) {
      alert("Lütfen başlık, sorumlu ve termin tarihini doldurun.");
      return;
    }
    
    const taskRecord = {
      id: `daily_${Date.now()}`,
      title: newTask.title,
      owner: newTask.owner,
      deadline: newTask.deadline,
      linkedGoalId: newTask.linkedGoalId || null,
      status: 'bekliyor'
    };
    
    setDailyTasks([...dailyTasks, taskRecord]);
    setShowWizard(false);
    setNewTask({ title: '', owner: '', deadline: '', linkedGoalId: '' });
  };

  const handleToggleComplete = (task) => {
    if (task.source === 'strategy') {
      // Very crude update to nested strategy goal actions
      const updatedGoals = goals.map(g => {
        if (g.id === task.goalId) {
          return {
            ...g,
            actions: g.actions.map(a => a.id === task.id ? {...a, status: a.status === 'tamamlandi' ? 'bekliyor' : 'tamamlandi'} : a)
          }
        }
        return g;
      });
      setGoals(updatedGoals);
    } else {
      // Daily task update
      const updatedTasks = dailyTasks.map(t => 
        t.id === task.id ? {...t, status: t.status === 'tamamlandi' ? 'bekliyor' : 'tamamlandi'} : t
      );
      setDailyTasks(updatedTasks);
    }
  };

  const handleDelete = (task) => {
    if (task.source === 'strategy') {
      // Only danisman can delete strategy goals usually, but keeping it simple
      const updatedGoals = goals.map(g => {
        if (g.id === task.goalId) {
          return { ...g, actions: g.actions.filter(a => a.id !== task.id) }
        }
        return g;
      });
      setGoals(updatedGoals);
    } else {
      setDailyTasks(dailyTasks.filter(t => t.id !== task.id));
    }
  };

  return (
    <div className="task-tracking-module fade-in">
      <div className="module-header">
        <h2>Görev ve Takip Masası</h2>
        <button className="primary-btn" onClick={() => setShowWizard(true)}>+ Yeni Günlük Görev</button>
      </div>

      <div className="guide-box">
        <p><strong>💡 Rehber: </strong> Stratejik plandan üretilen aksiyonlar ile size/ekibe atanan günlük görevleri buradan tek ekranda takip edebilirsiniz.</p>
        <p>Görevi ilgili hedefe bağlayarak takibi kolaylaştırabilirsiniz. Geciken görevler otomatik olarak öne çıkarılır.</p>
      </div>

      <div className="filter-bar">
        <div className="view-tabs">
          <button className={`view-tab ${viewFilter === 'all' ? 'active' : ''}`} onClick={() => setViewFilter('all')}>Tüm Görevler</button>
          <button className={`view-tab ${viewFilter === 'mine' ? 'active' : ''}`} onClick={() => setViewFilter('mine')}>Bana Atananlar</button>
          <button className={`view-tab ${viewFilter === 'delayed' ? 'active' : ''}`} onClick={() => setViewFilter('delayed')}>Gecikenler ⚠️</button>
        </div>
        
        <select className="filter-select" value={filterOwner} onChange={(e) => setFilterOwner(e.target.value)}>
          <option value="">Tüm Sorumlular</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
      </div>

      <div className="tasks-grid">
        {filteredTasks.length === 0 ? (
          <div style={{textAlign:'center', padding: '3rem', color: '#64748b'}}>
            Bu filtrelere uygun görev bulunmuyor.
          </div>
        ) : (
          filteredTasks.map(task => {
            const empName = employees.find(e => e.id === task.owner)?.name || task.owner;
            return (
              <div key={task.id} className={`task-card source-${task.source}`}>
                <div className="t-info">
                  <div className="t-title">
                    <span className={`t-badge badge-${task.source}`}>{task.source === 'strategy' ? 'STRATEJİK' : 'GÜNLÜK'}</span>
                    <span style={{textDecoration: task.currentStatus === 'completed' ? 'line-through' : 'none', opacity: task.currentStatus === 'completed' ? 0.6 : 1}}>{task.title}</span>
                  </div>
                  <div className="t-meta">
                    <span>👤 Sorumlu: <strong>{empName}</strong></span>
                    <span>📅 Termin: <strong>{task.deadline}</strong></span>
                    {task.goalTitle && <span className="t-link">🔗 Bağlı Hedef: {task.goalTitle}</span>}
                  </div>
                </div>
                
                <div className="t-status">
                  <div className={`s-badge s-${task.currentStatus}`}>
                    {task.statusText}
                  </div>
                  <div className="t-controls">
                     <button title="Durumu Değiştir" onClick={() => handleToggleComplete(task)}>
                        {task.currentStatus === 'completed' ? '↩️ Geri Al' : '✅ Tamamla'}
                     </button>
                     {task.source === 'daily' && (
                       <button title="Görevi Sil" onClick={() => handleDelete(task)} style={{color: '#ef4444'}}>🗑️</button>
                     )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* CREATE WIZARD MODAL */}
      {showWizard && (
        <div className="modal-overlay">
          <div className="modal-content fade-in">
            <div className="modal-header">Yeni Görev Oluştur</div>
            
            <div className="form-group">
              <label>Görev Tanımı</label>
              <input type="text" className="form-input" placeholder="Örn: Pazarlama veri raporlarının hazırlanması" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
            </div>
            
            <div className="form-group">
              <label>Sorumlu Kişi</label>
              <select className="form-input" value={newTask.owner} onChange={e => setNewTask({...newTask, owner: e.target.value})}>
                <option value="">Rehberden Seçiniz...</option>
                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name} ({emp.title})</option>)}
              </select>
            </div>
            
            <div className="form-group">
              <label>Termin Tarihi</label>
              <input type="date" className="form-input" value={newTask.deadline} onChange={e => setNewTask({...newTask, deadline: e.target.value})} />
            </div>
            
            <div className="form-group" style={{background: '#f8fafc', padding: '1rem', borderRadius: '8px'}}>
              <label>Bağlı Stratejik Hedef (İsteğe Bağlı)</label>
              <p style={{fontSize: '0.8rem', color: '#64748b', margin: '0 0 0.5rem 0'}}>Bu günlük görevin şirketin majör hedeflerinden birine hizmet ettiğini düşünüyorsanız seçin.</p>
              <select className="form-input" value={newTask.linkedGoalId} onChange={e => setNewTask({...newTask, linkedGoalId: e.target.value})}>
                <option value="">-- Bağımsız Görev --</option>
                {goals.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
              </select>
            </div>
            
            <div className="modal-actions">
              <button className="secondary-btn" onClick={() => setShowWizard(false)}>İptal</button>
              <button className="primary-btn" onClick={handleCreateTask}>Görevi Oluştur</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
