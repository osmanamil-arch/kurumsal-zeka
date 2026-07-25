import React from 'react';
import { calculateDashboardMetrics } from '../services/exitAnalyticsEngine';

export default function ExitDashboard({ records, surveys }) {
  const metrics = calculateDashboardMetrics(records, surveys);

  return (
    <div className="exit-dashboard fade-in">
      <div className="header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Yönetici Özeti: Ayrılma ve Memnuniyet</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Organizasyonel sirkülasyon (turnover) ve risk sinyalleri</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="metric-card glass" style={{ padding: '1.5rem', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Bu Ay Ayrılanlar</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>{metrics.thisMonthExitsCount}</div>
        </div>
        <div className="metric-card glass" style={{ padding: '1.5rem', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Gönüllü Ayrılma Oranı</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>%{metrics.voluntaryRate}</div>
        </div>
        <div className="metric-card glass" style={{ padding: '1.5rem', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Regrettable Loss (Kritik Kayıp)</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>{metrics.regrettableLosses}</div>
        </div>
        <div className="metric-card glass" style={{ padding: '1.5rem', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Ortalama Exit Memnuniyeti</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: metrics.avgSatisfaction > 6 ? '#10b981' : '#f59e0b' }}>{metrics.avgSatisfaction} <span style={{fontSize:'1rem', color:'#94a3b8'}}>/ 10</span></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="chart-section glass" style={{ padding: '2rem', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>En Sık Görülen Ayrılma Nedenleri</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '6px', borderLeft: '4px solid #ef4444' }}>
              <div style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 'bold', marginBottom: '0.25rem' }}>#1 ANA NEDEN</div>
              <div style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '500' }}>{metrics.topReason}</div>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>Ayrılan çalışanların mülakatlarında en çok bu neden öne çıktı.</p>
            </div>
            
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '6px', borderLeft: '4px solid #f59e0b' }}>
              <div style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 'bold', marginBottom: '0.25rem' }}>#2 ANA NEDEN</div>
              <div style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '500' }}>İş Yükü ve Stres</div>
            </div>
          </div>
        </div>

        <div className="alerts-section glass" style={{ padding: '2rem', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>✨</span> AI Uyarıları
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px' }}>
              <strong style={{ color: '#b91c1c', display: 'block', marginBottom: '0.25rem' }}>Yüksek Performanslı Kayıp Riski</strong>
              <span style={{ fontSize: '0.85rem', color: '#7f1d1d' }}>Satış departmanında "Kariyer Gelişimi" nedeniyle ayrılmalar artışta. Yüksek performanslı yetenekler için acil IDP (Gelişim Planı) gözden geçirmesi önerilir.</span>
            </div>
            <div style={{ padding: '1rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px' }}>
              <strong style={{ color: '#b45309', display: 'block', marginBottom: '0.25rem' }}>Yönetici Memnuniyeti Düşük</strong>
              <span style={{ fontSize: '0.85rem', color: '#92400e' }}>Üretim departmanında son çıkış mülakatlarında yönetici memnuniyeti ortalama 3/10 olarak ölçüldü.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
