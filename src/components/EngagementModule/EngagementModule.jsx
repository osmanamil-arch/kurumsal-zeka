import React, { useState } from 'react';
import { initialPsychometricProfiles, initialPulseSurveys, initialKudosFeed, initialClubs } from './data/mockEngagementData';

import EngagementDashboard from './pages/EngagementDashboard';
import CommunicationGuide from './pages/CommunicationGuide';
import TeamSynergy from './pages/TeamSynergy';
import KudosWall from './pages/KudosWall';
import PulseSurveys from './pages/PulseSurveys';
import InternalEvents from './pages/InternalEvents';

export default function EngagementModule({ employees, departments, userRole }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Use state for mock data to allow interactions (likes, comments, new surveys)
  const [profiles] = useState(initialPsychometricProfiles);
  const [surveys, setSurveys] = useState(initialPulseSurveys);
  const [kudosFeed, setKudosFeed] = useState(initialKudosFeed);
  const [clubs, setClubs] = useState(initialClubs);

  const menuItems = [
    { id: 'dashboard', label: '📊 Bağlılık Özeti' },
    { id: 'kudos', label: '🏆 Takdir (Kudos)' },
    { id: 'guide', label: '🗣️ İletişim Rehberi' },
    { id: 'synergy', label: '🧩 Ekip Sinerjisi' },
    { id: 'pulse', label: '📈 Nabız Anketleri' },
    { id: 'events', label: '🎉 Kulüpler & Etkinlikler' }
  ];

  return (
    <div className="engagement-module" style={{ display: 'flex', height: '100%' }}>
      {/* Sidebar Navigation */}
      <div className="sidebar glass" style={{ width: '260px', padding: '1.5rem', borderRight: '1px solid rgba(255,255,255,0.2)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#1e293b', margin: 0 }}>Bağlılık ve İç İletişim</h2>
          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>Kültür & Psikometri Motoru</p>
        </div>
        
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === item.id ? '#3b82f6' : 'transparent',
              color: activeTab === item.id ? '#ffffff' : '#475569',
              textAlign: 'left',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="content-area" style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {activeTab === 'dashboard' && <EngagementDashboard surveys={surveys} />}
        {activeTab === 'kudos' && <KudosWall kudosFeed={kudosFeed} employees={employees} setKudosFeed={setKudosFeed} />}
        {activeTab === 'guide' && <CommunicationGuide employees={employees} profiles={profiles} />}
        {activeTab === 'synergy' && <TeamSynergy departments={departments} employees={employees} profiles={profiles} />}
        {activeTab === 'pulse' && <PulseSurveys surveys={surveys} setSurveys={setSurveys} />}
        {activeTab === 'events' && <InternalEvents clubs={clubs} setClubs={setClubs} />}
      </div>
    </div>
  );
}
