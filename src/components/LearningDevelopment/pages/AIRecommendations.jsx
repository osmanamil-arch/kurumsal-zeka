import React from 'react';
import { generateAIRecommendations } from '../services/learningEngine';

export default function AIRecommendations({ employees, employeeProfiles, catalog, certifications }) {
  // Demo for 'e4' (Burak)
  const recs = generateAIRecommendations('e4', employeeProfiles, employees, [], catalog, certifications);

  return (
    <div className="ai-recommendations fade-in">
      <div className="header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>✨</span> Akıllı Gelişim Asistanı
        </h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Performans, rol ve yetkinlik verilerinize dayalı kişiselleştirilmiş öneriler</p>
      </div>

      <div className="recs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {recs.map(rec => (
          <div key={rec.id} className="rec-card glass" style={{ 
            padding: '1.5rem', 
            borderRadius: '12px', 
            background: 'linear-gradient(145deg, #ffffff, #f8fafc)', 
            border: '1px solid #e2e8f0',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: rec.severity === 'high' ? '#ef4444' : '#f59e0b' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', color: '#475569', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                {rec.type}
              </span>
              {rec.severity === 'high' && <span style={{ color: '#ef4444', fontSize: '1.2rem' }}>⚠️</span>}
            </div>

            <h3 style={{ margin: '0 0 0.75rem 0', color: '#0f172a', fontSize: '1.1rem' }}>{rec.title}</h3>
            <p style={{ margin: '0 0 1.5rem 0', color: '#475569', fontSize: '0.9rem', lineHeight: '1.5' }}>{rec.description}</p>
            
            <button style={{ 
              width: '100%', 
              padding: '0.75rem', 
              background: '#0f172a', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '6px', 
              fontWeight: '500', 
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}>
              {rec.suggestedAction}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
