import React, { useMemo } from 'react';
import MetricCard from '../components/MetricCard';
import { calculateOrgMetrics, generateAIRecommendations } from '../services/learningEngine';

export default function LearningDashboard({ employees, employeeProfiles, catalog, certifications, userRole, setTab }) {
  const metrics = useMemo(() => calculateOrgMetrics(employees, employeeProfiles, catalog, certifications), [employees, employeeProfiles, catalog, certifications]);
  
  // Pick an employee for demo AI recommendations (e.g. current user, or an employee with gaps)
  // Here we use Burak Ateş ('e4') as a demo since he has gaps.
  const aiRecs = useMemo(() => generateAIRecommendations('e4', employeeProfiles, employees, [], catalog, certifications), [employeeProfiles, employees, catalog, certifications]);

  return (
    <div className="learning-dashboard fade-in">
      <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Eğitim ve Gelişim Özeti</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Organizasyonel gelişim metrikleri ve yapay zeka destekli öneriler</p>
      </div>

      <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <MetricCard title="Katalogdaki Eğitimler" value={metrics.totalTrainings} icon="📚" colorClass="blue" />
        <MetricCard title="Eğitim Alan Çalışan Oranı" value={`%${metrics.trainedRatio.toFixed(0)}`} icon="👥" colorClass="green" trend={5} />
        <MetricCard title="Ortalama Gelişim Skoru" value={metrics.avgDevScore} icon="⭐" colorClass="purple" trend={2.4} />
        <MetricCard title="Riskli Sertifikalar" value={metrics.complianceRisks} icon="⚠️" colorClass="red" subtitle="60 günden az kalanlar" />
      </div>

      <div className="dashboard-content" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        <div className="chart-section glass" style={{ padding: '1.5rem', borderRadius: '8px', background: '#fff' }}>
          <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>Departman Bazlı Eğitim Tamamlanma Oranı</h3>
          <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
            {/* Mock Bar Chart */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '100%', height: '80%', background: 'linear-gradient(to top, #3b82f6, #93c5fd)', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                 <span style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontWeight: 'bold' }}>%80</span>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>Satış</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '100%', height: '65%', background: 'linear-gradient(to top, #10b981, #6ee7b7)', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                 <span style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontWeight: 'bold' }}>%65</span>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>Üretim</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '100%', height: '95%', background: 'linear-gradient(to top, #8b5cf6, #c4b5fd)', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                 <span style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontWeight: 'bold' }}>%95</span>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>Finans</span>
            </div>
          </div>
        </div>

        <div className="ai-section glass" style={{ padding: '1.5rem', borderRadius: '8px', background: 'linear-gradient(145deg, #f8fafc, #f1f5f9)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🤖</span> AI Önerileri
          </h3>
          <div className="recommendations-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {aiRecs.map(rec => (
              <div key={rec.id} className="ai-card" style={{ padding: '1rem', background: '#fff', borderRadius: '6px', borderLeft: `4px solid ${rec.severity === 'high' ? '#ef4444' : '#f59e0b'}`, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}>{rec.title}</h4>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#64748b' }}>{rec.description}</p>
                <button 
                  onClick={() => setTab(rec.type === 'compliance' ? 'certifications' : 'catalog')}
                  style={{ background: '#f1f5f9', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '500', color: '#334155' }}>
                  {rec.suggestedAction}
                </button>
              </div>
            ))}
            {aiRecs.length === 0 && <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>Şu an için yeni bir öneri bulunmuyor.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}
