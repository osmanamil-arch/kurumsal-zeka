import React from 'react';

export default function BarChart({ 
  data, 
  title, 
  filterType = 'both', 
  primaryLabel = 'Beyaz Yaka', 
  secondaryLabel = 'Mavi Yaka',
  primaryColor = 'linear-gradient(to top, #2563EB, #60A5FA)',
  secondaryColor = 'linear-gradient(to top, #059669, #34D399)',
  showSecondary = true
}) {
  return (
    <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '2.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.02)' }}>
      {title && <h3 style={{ margin: '0 0 2rem 0', color: 'var(--text-main)', fontSize: '1.4rem' }}>{title}</h3>}
      
      <div style={{ height: '350px', display: 'flex', alignItems: 'flex-end', gap: '12px', paddingBottom: '1.5rem', borderBottom: '2px solid #94A3B8', position: 'relative' }}>
        {/* Y-Axis scale lines */}
        {[0, 25, 50, 75].map(v => (
          <div key={v} style={{ position: 'absolute', top: `${v}%`, left: 0, right: 0, height: '1px', background: '#F1F5F9' }}></div>
        ))}

        {data.map(d => (
          <div key={d.dimension} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            
            <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'flex-end', justifyContent: 'center', gap: '4px' }}>
              {(filterType === 'both' || filterType === 'beyaz' || !showSecondary) && (d.beyaz > 0 || d.score > 0) && (
                <div style={{ 
                  width: filterType === 'both' ? '40%' : '70%', 
                  height: `${((d.beyaz || d.score) / 5) * 100}%`, 
                  background: primaryColor, 
                  borderRadius: '6px 6px 0 0', 
                  position: 'relative', 
                  transition: 'height 0.8s cubic-bezier(0.16, 1, 0.3, 1)', 
                  boxShadow: '0 -2px 10px rgba(0,0,0,0.05)' 
                }} title={`${primaryLabel}: ${(d.beyaz || d.score).toFixed(2)}`}>
                  <div style={{ position: 'absolute', top: '-28px', width: '100%', textAlign: 'center', fontSize: '0.8rem', fontWeight: 800 }}>{(d.beyaz || d.score).toFixed(1)}</div>
                </div>
              )}
              
              {showSecondary && (filterType === 'both' || filterType === 'mavi') && d.mavi > 0 && (
                <div style={{ 
                  width: filterType === 'both' ? '40%' : '70%', 
                  height: `${(d.mavi / 5) * 100}%`, 
                  background: secondaryColor, 
                  borderRadius: '6px 6px 0 0', 
                  position: 'relative', 
                  transition: 'height 0.8s cubic-bezier(0.16, 1, 0.3, 1)', 
                  boxShadow: '0 -2px 10px rgba(0,0,0,0.05)' 
                }} title={`${secondaryLabel}: ${d.mavi.toFixed(2)}`}>
                  <div style={{ position: 'absolute', top: '-28px', width: '100%', textAlign: 'center', fontSize: '0.8rem', fontWeight: 800 }}>{d.mavi.toFixed(1)}</div>
                </div>
              )}
            </div>
            
            <div style={{ position: 'absolute', bottom: '-130px', width: '110px', transform: 'rotate(-45deg)', transformOrigin: 'top left', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', textAlign: 'right', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {d.dimension}
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div style={{ marginTop: '140px', display: 'flex', justifyContent: 'center', gap: '3rem', padding: '1.5rem', background: '#F8FAFC', borderRadius: '12px' }}>
        {(filterType === 'both' || filterType === 'beyaz' || !showSecondary) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
             <div style={{ width: '20px', height: '20px', background: primaryColor, borderRadius: '6px' }}></div>
             <span style={{ fontSize: '1rem', fontWeight: 700 }}>{primaryLabel} (Max 5.0)</span>
          </div>
        )}
        {showSecondary && (filterType === 'both' || filterType === 'mavi') && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
             <div style={{ width: '20px', height: '20px', background: secondaryColor, borderRadius: '6px' }}></div>
             <span style={{ fontSize: '1rem', fontWeight: 700 }}>{secondaryLabel} (Max 5.0)</span>
          </div>
        )}
      </div>
    </div>
  );
}
