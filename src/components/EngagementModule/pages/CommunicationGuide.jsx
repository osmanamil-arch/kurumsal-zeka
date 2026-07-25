import React, { useState } from 'react';
import { getEmployeeProfile } from '../services/engagementEngine';

export default function CommunicationGuide({ employees, profiles }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredEmployees = employees.filter(e => e.isActive !== false && e.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="communication-guide fade-in">
      <div className="header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>İletişim ve Etkileşim Rehberi</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Yöneticiler için Psikometrik DISC profillerine dayalı iletişim tüyoları</p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <input 
          type="text" 
          placeholder="Çalışan Ara..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: '100%', maxWidth: '400px', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {filteredEmployees.map(emp => {
          const profile = getEmployeeProfile(emp.id, profiles);
          
          return (
            <div key={emp.id} className="glass" style={{ background: '#fff', borderRadius: '8px', border: `1px solid #e2e8f0`, borderTop: `4px solid ${profile.color}`, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: '#0f172a' }}>{emp.name}</h3>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{emp.department} - {emp.title}</span>
                </div>
                <div style={{ 
                  background: `${profile.color}20`, 
                  color: profile.color, 
                  width: '40px', height: '40px', 
                  borderRadius: '50%', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontWeight: 'bold', fontSize: '1.2rem',
                  border: `2px solid ${profile.color}`
                }}>
                  {profile.discType}
                </div>
              </div>

              <div>
                <span style={{ fontWeight: '600', color: profile.color, fontSize: '0.9rem' }}>{profile.discName}</span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {profile.traits.map((t, idx) => <span key={idx} style={{ fontSize: '0.75rem', background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{t}</span>)}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '6px', fontSize: '0.85rem', color: '#334155' }}>
                <strong style={{ color: '#1e293b', display: 'block', marginBottom: '0.25rem' }}>🗣️ Nasıl İletişim Kurulmalı?</strong>
                {profile.communicationAdvice}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ flex: 1, border: '1px solid #fecaca', background: '#fef2f2', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                  <strong style={{ color: '#b91c1c', display: 'block', marginBottom: '0.25rem' }}>⚠️ Çatışma Riski</strong>
                  <span style={{ color: '#7f1d1d' }}>{profile.conflictRisk}</span>
                </div>
                <div style={{ flex: 1, border: '1px solid #bfdbfe', background: '#eff6ff', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                  <strong style={{ color: '#1d4ed8', display: 'block', marginBottom: '0.25rem' }}>🚀 Temel Motivatör</strong>
                  <span style={{ color: '#1e3a8a' }}>{profile.motivators.join(', ')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
