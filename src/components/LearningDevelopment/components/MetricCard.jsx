import React from 'react';

export default function MetricCard({ title, value, subtitle, icon, trend, colorClass = "blue" }) {
  return (
    <div className={`metric-card glass fade-in border-l-4 border-${colorClass}-500`} style={{ padding: '1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#fff' }}>
      <div className={`icon-wrapper bg-${colorClass}-100 text-${colorClass}-600`} style={{ fontSize: '2rem', padding: '1rem', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {icon}
      </div>
      <div className="metric-info">
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>{title}</h4>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0f172a' }}>{value}</span>
          {trend && (
            <span style={{ fontSize: '0.85rem', color: trend > 0 ? '#10b981' : '#ef4444', fontWeight: '500' }}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
        {subtitle && <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>{subtitle}</p>}
      </div>
    </div>
  );
}
