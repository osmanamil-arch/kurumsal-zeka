import React, { useState, useMemo } from 'react';
import PerformanceEvaluationForm from './PerformanceEvaluationForm';

export default function PerformanceMyEvaluations({ 
  mockLoginId, 
  campaigns, 
  employees, 
  jobAnalyses,
  titles,
  departments,
  onCompleteTask 
}) {
  const [selectedTask, setSelectedTask] = useState(null);

  // Bana atanan görevleri bul
  const pendingTasks = useMemo(() => {
    if (!mockLoginId) return [];
    
    let tasks = [];
    
    campaigns.filter(c => c.status === 'ACTIVE').forEach(camp => {
       camp.matrix.forEach(row => {
          // Bu satırın değerlendiricileri arasında mıyım?
          const myRoleObj = row.raters.find(r => r.employeeId === mockLoginId);
          if (myRoleObj) {
            const taskId = `${camp.id}_${row.subjectId}_${myRoleObj.role}`;
            const isCompleted = camp.evaluations?.some(e => e.taskId === taskId) || false;

            // Task objesi yarat
            tasks.push({
               taskId,
               campaignBase: camp,
               subjectId: row.subjectId,
               subjectName: row.subjectName,
               subjectDepartment: row.department,
               myRole: myRoleObj.role, // 'self' | 'peer' | 'manager' | 'directReport'
               isCompleted 
            });
          }
       });
    });
    return tasks;
  }, [mockLoginId, campaigns]);

  if (!mockLoginId) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #cbd5e1' }}>
        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>👋</span>
        <h3 style={{ color: '#334155', marginBottom: '0.5rem' }}>Lütfen bir çalışan seçin!</h3>
        <p style={{ color: '#64748b' }}>
          Değerlendirme panelini görebilmek için üstteki menüden teste katılacak bir şirket çalışanını seçin.
        </p>
      </div>
    );
  }

  const getRoleLabel = (role) => {
    switch(role) {
      case 'self': return 'Özdeğerlendirme';
      case 'manager': return 'Ast Değerlendirmesi'; // Ben yöneticiysem o benim astımdır
      case 'directReport': return 'Yönetici Değerlendirmesi'; // Ben astsam, onu yönetici olarak değerlendiriyorum
      case 'peer': return 'Akran Değerlendirmesi';
      default: return 'Değerlendirme';
    }
  };

  const getRoleIcon = (role) => {
     switch(role) {
      case 'self': return '🪞';
      case 'manager': return '👇';
      case 'directReport': return '👆';
      case 'peer': return '🤝';
      default: return '📝';
     }
  };

  return (
    <div className="fade-in">
       {selectedTask ? (
         <PerformanceEvaluationForm 
           evalTask={selectedTask}
           jobAnalyses={jobAnalyses}
           employees={employees}
           onBack={() => setSelectedTask(null)}
           onSave={(data) => {
              onCompleteTask(selectedTask.campaignBase.id, selectedTask.taskId, data);
              setSelectedTask(null);
           }}
         />
       ) : (
         <div>
           <div style={{ marginBottom: '2rem' }}>
             <h2 style={{ color: '#1e293b', margin: '0 0 0.5rem 0' }}>Bana Atanan Değerlendirmeler</h2>
             <p style={{ color: '#64748b', margin: 0 }}>Gerçekçi, iş analizine dayalı 360-derece formlarınızı buradan tamamlayabilirsiniz.</p>
           </div>
           
           {pendingTasks.length === 0 ? (
             <div style={{ padding: '3rem', background: '#f1f5f9', borderRadius: '12px', textAlign: 'center' }}>
               <h3 style={{ color: '#475569', margin: '0 0 0.5rem 0' }}>Şu an bekleyen herhangi bir göreviniz yok.</h3>
               <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Aktif bir kampanya bulunduğunda değerlendirmeler buraya düşecektir.</p>
             </div>
           ) : (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pendingTasks.map(task => (
                  <div key={task.taskId} style={{ background: task.isCompleted ? '#f8fafc' : '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem 1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: task.isCompleted ? 0.7 : 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                       <div style={{ width: '48px', height: '48px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid #e2e8f0' }}>
                         {getRoleIcon(task.myRole)}
                       </div>
                       <div>
                         <h4 style={{ margin: '0 0 0.2rem 0', color: '#1e293b', fontSize: '1.1rem' }}>{task.myRole === 'self' ? 'Kendiniz' : task.subjectName}</h4>
                         <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
                            <span><strong>Birim:</strong> {task.subjectDepartment}</span>
                            <span>•</span>
                            <span><strong>Rol:</strong> {getRoleLabel(task.myRole)}</span>
                            <span>•</span>
                            <span><strong>Kampanya:</strong> {task.campaignBase.name}</span>
                         </div>
                       </div>
                    </div>
                    
                    <div>
                       {task.isCompleted ? (
                         <span style={{ display: 'inline-block', background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', padding: '0.5rem 1.5rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>Tamamlandı ✓</span>
                       ) : (
                         <button onClick={() => setSelectedTask(task)} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.6rem 2rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 4px rgba(59,130,246,0.3)' }}>Görüntüle</button>
                       )}
                    </div>
                  </div>
                ))}
             </div>
           )}
         </div>
       )}
    </div>
  );
}
