import React from 'react';
import { calculatePredictiveRisks } from '../services/exitAnalyticsEngine';

export default function PredictiveAttrition({ activeEmployees, signals }) {
  const predictiveRisks = calculatePredictiveRisks(activeEmployees, signals);

  return (
    <div className="predictive-attrition fade-in">
      <div className="header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>✨</span> Tahminsel Ayrılma Riski (Predictive AI)
        </h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Sistemdeki performans, psikometri ve rol verilerinden türetilmiş erken uyarı sinyalleri (Aktif Çalışanlar)</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {predictiveRisks.map(risk => (
          <div key={risk.id} className="glass" style={{ background: '#fff', borderRadius: '8px', padding: '1.5rem', border: `1px solid ${risk.riskLevel === 'high' ? '#fecaca' : '#fde68a'}`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: risk.riskLevel === 'high' ? '#ef4444' : '#f59e0b' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', color: '#0f172a' }}>{risk.employeeName}</h3>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{risk.department} - {risk.title}</span>
              </div>
              <span style={{ 
                padding: '0.25rem 0.5rem', 
                borderRadius: '4px', 
                fontSize: '0.75rem', 
                fontWeight: 'bold', 
                background: risk.riskLevel === 'high' ? '#fee2e2' : '#fef3c7', 
                color: risk.riskLevel === 'high' ? '#b91c1c' : '#b45309',
                textTransform: 'uppercase'
              }}>
                {risk.riskLevel === 'high' ? 'Yüksek Risk' : 'Orta Risk'}
              </span>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Tetikleyici Sinyal</div>
              <strong style={{ color: '#1e293b', fontSize: '0.95rem' }}>{risk.signal}</strong>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 1.5rem 0', lineHeight: '1.5' }}>
              {risk.explanation}
            </p>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '500' }}>
                Görüşme Planla
              </button>
              <button style={{ padding: '0.5rem 1rem', background: 'transparent', color: '#3b82f6', border: '1px solid #3b82f6', borderRadius: '4px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '500' }}>
                Profili İncele
              </button>
            </div>
          </div>
        ))}

        {predictiveRisks.length === 0 && (
          <div style={{ padding: '2rem', background: '#fff', borderRadius: '8px', color: '#64748b', textAlign: 'center', gridColumn: '1 / -1' }}>
            Şu an için sistemde yüksek riskli bir ayrılma sinyali tespit edilmedi.
          </div>
        )}
      </div>
    </div>
  );
}
