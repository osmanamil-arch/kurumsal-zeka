import React from 'react';
import { getSatisfactionAverages } from '../services/exitAnalyticsEngine';

export default function SatisfactionAnalytics({ surveys }) {
  const avgs = getSatisfactionAverages(surveys);
  
  const renderBar = (label, score, color) => (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#1e293b' }}>
        <span>{label}</span>
        <strong>{score} / 10</strong>
      </div>
      <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '5px' }}>
        <div style={{ width: `${(score / 10) * 100}%`, height: '100%', background: color, borderRadius: '5px' }}></div>
      </div>
    </div>
  );

  return (
    <div className="satisfaction-analytics fade-in">
      <div className="header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Memnuniyet Analizi (Boyut Bazlı)</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Ayrılan çalışanların boyut bazında şirket algısı</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="glass" style={{ background: '#fff', borderRadius: '8px', padding: '2rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>Organizasyonel Memnuniyet Ortalamaları</h3>
          {renderBar('Genel Şirket Kültürü', avgs.cultureSatisfaction, '#3b82f6')}
          {renderBar('Yönetici İlişkisi', avgs.managerSatisfaction, avgs.managerSatisfaction < 5 ? '#ef4444' : '#f59e0b')}
          {renderBar('Kariyer ve Gelişim Fırsatları', avgs.careerOpportunitySatisfaction, avgs.careerOpportunitySatisfaction < 5 ? '#ef4444' : '#10b981')}
          {renderBar('İş Yükü ve Stres', avgs.workloadSatisfaction, avgs.workloadSatisfaction < 5 ? '#ef4444' : '#f59e0b')}
          {renderBar('Ücret ve Yan Haklar', avgs.compensationSatisfaction, '#3b82f6')}
          {renderBar('İş - Yaşam Dengesi', avgs.workLifeBalance, '#f59e0b')}
          {renderBar('Psikolojik Güvenlik', avgs.psychologicalSafety, '#10b981')}
        </div>
        
        <div className="glass" style={{ background: '#fff', borderRadius: '8px', padding: '2rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>Zayıf Yönler ve Eylem Planı</h3>
          <div style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#b91c1c' }}>1. İş Yükü Dağılımı ve Stres</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#7f1d1d' }}>Ayrılan çalışanların çoğu, mesai dengesizliği sebebiyle ayrıldığını belirtti. Norm kadro planlaması ve iş analizi süreçlerinin acilen gözden geçirilmesi önerilir.</p>
          </div>
          <div style={{ padding: '1rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#b45309' }}>2. Kariyer Şeffaflığı</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#92400e' }}>Performans sistemi iyi çalışsa da, terfi süreçleri (Succession Planning) çalışanlara iyi aktarılmıyor. Kariyer yolu matrislerinin şeffaflaştırılması gerekiyor.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
