import React from 'react';

export default function MetricCard({ title, value, unit, description, gradient, icon }) {
  return (
    <div style={{ background: gradient, padding: '1.5rem', borderRadius: '16px', color: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
      <div style={{ fontSize: '0.9rem', opacity: 0.8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {icon && <span>{icon}</span>}
        {title}
      </div>
      <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.5rem 0' }}>{value} <span style={{fontSize:'1.2rem', opacity:0.7}}>{unit}</span></div>
      {description && <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>{description}</div>}
    </div>
  );
}
