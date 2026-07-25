import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialExitRecords, initialExitSurveys, initialExitReasons, initialRiskSignals } from './EmployeeExitAnalytics/data/mockExitAnalyticsData';

// Import Pages
import ExitDashboard from './EmployeeExitAnalytics/pages/ExitDashboard';
import ExitRecords from './EmployeeExitAnalytics/pages/ExitRecords';
import ExitInterviews from './EmployeeExitAnalytics/pages/ExitInterviews';
import SatisfactionAnalytics from './EmployeeExitAnalytics/pages/SatisfactionAnalytics';
import ExitReasons from './EmployeeExitAnalytics/pages/ExitReasons';
import RiskSegments from './EmployeeExitAnalytics/pages/RiskSegments';
import DepartmentManagerAnalytics from './EmployeeExitAnalytics/pages/DepartmentManagerAnalytics';
import PredictiveAttrition from './EmployeeExitAnalytics/pages/PredictiveAttrition';
import ExitReports from './EmployeeExitAnalytics/pages/ExitReports';
import ExitSettings from './EmployeeExitAnalytics/pages/ExitSettings';

export default function EmployeeExitAnalyticsModule({ employees, departments, roles, userRole, companyId }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const p = `kobi_${companyId || 'default'}`;

  // Module Persisted State
  const [exitRecords, setExitRecords] = useLocalStorage(`${p}_exit_records`, initialExitRecords);
  const [exitSurveys, setExitSurveys] = useLocalStorage(`${p}_exit_surveys`, initialExitSurveys);
  const [exitReasons, setExitReasons] = useLocalStorage(`${p}_exit_reasons`, initialExitReasons);
  const [riskSignals, setRiskSignals] = useLocalStorage(`${p}_risk_signals`, initialRiskSignals);

  const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'records', label: 'Ayrılma Kayıtları', icon: '📋' },
    { id: 'interviews', label: 'Exit Interview', icon: '🗣️' },
    { id: 'satisfaction', label: 'Memnuniyet Analizi', icon: '😊' },
    { id: 'reasons', label: 'Ayrılma Nedenleri', icon: '🔍' },
    { id: 'segments', label: 'Risk Segmentleri', icon: '🧩' },
    { id: 'manager', label: 'Yönetici & Departman', icon: '🏢' },
    { id: 'predictive', label: 'Tahminsel Risk (AI)', icon: '✨' },
    { id: 'reports', label: 'Raporlar', icon: '📈' },
    { id: 'settings', label: 'Ayarlar', icon: '⚙️' }
  ];

  return (
    <div className="exit-analytics-module fade-in" style={{ display: 'flex', height: 'calc(100vh - 80px)', background: '#f8fafc' }}>
      
      {/* Sub-Sidebar Navigation */}
      <div className="sub-sidebar glass" style={{ width: '280px', padding: '1rem', borderRight: '1px solid #e2e8f0', background: '#fff', overflowY: 'auto' }}>
        <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b', fontSize: '1.1rem', padding: '0 0.5rem', lineHeight: '1.4' }}>Çalışan Ayrılma ve Memnuniyet Analizi</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {TABS.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                width: '100%', padding: '0.75rem 1rem', 
                border: 'none', borderRadius: '8px', 
                background: activeTab === tab.id ? '#fef2f2' : 'transparent',
                color: activeTab === tab.id ? '#dc2626' : '#475569',
                fontWeight: activeTab === tab.id ? '600' : '500',
                cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="content-area" style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {activeTab === 'dashboard' && <ExitDashboard records={exitRecords} surveys={exitSurveys} />}
        {activeTab === 'records' && <ExitRecords records={exitRecords} setRecords={setExitRecords} employees={employees} />}
        {activeTab === 'interviews' && <ExitInterviews surveys={exitSurveys} records={exitRecords} />}
        {activeTab === 'satisfaction' && <SatisfactionAnalytics surveys={exitSurveys} records={exitRecords} />}
        {activeTab === 'reasons' && <ExitReasons records={exitRecords} reasons={exitReasons} />}
        {activeTab === 'segments' && <RiskSegments records={exitRecords} />}
        {activeTab === 'manager' && <DepartmentManagerAnalytics records={exitRecords} surveys={exitSurveys} />}
        {activeTab === 'predictive' && <PredictiveAttrition activeEmployees={employees} signals={riskSignals} />}
        {activeTab === 'reports' && <ExitReports records={exitRecords} surveys={exitSurveys} />}
        {activeTab === 'settings' && <ExitSettings reasons={exitReasons} setReasons={setExitReasons} userRole={userRole} />}
      </div>

    </div>
  );
}
