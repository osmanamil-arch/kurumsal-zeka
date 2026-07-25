import React from 'react';

export default function Certifications({ certifications, employees }) {
  return (
    <div className="certifications fade-in">
      <div className="header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Sertifikasyon ve Uyum Takibi</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Geçerlilik süreleri ve zorunlu sertifika yenilemeleri</p>
      </div>

      <div className="table-container" style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '1rem', color: '#475569' }}>Sertifika Adı</th>
              <th style={{ padding: '1rem', color: '#475569' }}>Çalışan</th>
              <th style={{ padding: '1rem', color: '#475569' }}>Geçerlilik Tarihi</th>
              <th style={{ padding: '1rem', color: '#475569' }}>Risk Durumu</th>
              <th style={{ padding: '1rem', color: '#475569', textAlign: 'right' }}>Aksiyon</th>
            </tr>
          </thead>
          <tbody>
            {certifications.map(cert => {
              const emp = employees.find(e => e.id === cert.employeeId);
              return (
                <tr key={cert.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem', fontWeight: '500', color: '#0f172a' }}>{cert.title}</td>
                  <td style={{ padding: '1rem', color: '#64748b' }}>{emp?.name}</td>
                  <td style={{ padding: '1rem', color: '#64748b' }}>{cert.validUntil}</td>
                  <td style={{ padding: '1rem' }}>
                    {cert.complianceRisk === 'high' ? 
                      <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '500' }}>Kritik Risk (Süresi Yaklaştı)</span> : 
                      <span style={{ background: '#dcfce3', color: '#15803d', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '500' }}>Geçerli</span>
                    }
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                     <button style={{ background: 'transparent', border: '1px solid #cbd5e1', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Yenileme Ata</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
