import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialTrainingCatalog, initialDevelopmentPlans } from '../data/trainingData';
import { initialLearningPaths, initialCertifications, initialAssessments, initialEmployeeLearningProfiles } from './LearningDevelopment/data/mockLearningData';

// Import Pages
import LearningDashboard from './LearningDevelopment/pages/LearningDashboard';
import LearningCatalog from './LearningDevelopment/pages/LearningCatalog';
import LearningPaths from './LearningDevelopment/pages/LearningPaths';
import SkillMatrix from './LearningDevelopment/pages/SkillMatrix';
import DevelopmentPlans from './LearningDevelopment/pages/DevelopmentPlans';
import Assessments from './LearningDevelopment/pages/Assessments';
import Certifications from './LearningDevelopment/pages/Certifications';
import CareerDevelopment from './LearningDevelopment/pages/CareerDevelopment';
import LearningAnalytics from './LearningDevelopment/pages/LearningAnalytics';
import AIRecommendations from './LearningDevelopment/pages/AIRecommendations';
import ContentManagement from './LearningDevelopment/pages/ContentManagement';

import './TrainingModule.css';

export default function TrainingModule({ employees, userRole, jobAnalyses, skillLib, performanceCampaigns, companyId }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const p = `kobi_${companyId || 'default'}`;

  // Persisted state for this module
  const [catalog, setCatalog] = useLocalStorage(`${p}_training_catalog`, initialTrainingCatalog);
  const [plans, setPlans] = useLocalStorage(`${p}_training_plans`, initialDevelopmentPlans);
  const [learningPaths, setLearningPaths] = useLocalStorage(`${p}_learning_paths`, initialLearningPaths);
  const [certifications, setCertifications] = useLocalStorage(`${p}_certifications`, initialCertifications);
  const [assessments, setAssessments] = useLocalStorage(`${p}_assessments`, initialAssessments);
  const [employeeProfiles, setEmployeeProfiles] = useLocalStorage(`${p}_employee_learning_profiles`, initialEmployeeLearningProfiles);

  const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'catalog', label: 'Akademi / Katalog', icon: '📚' },
    { id: 'paths', label: 'Öğrenme Yolları', icon: '🛣️' },
    { id: 'matrix', label: 'Skill Matrix', icon: '🧩' },
    { id: 'idp', label: 'Gelişim Planları', icon: '🎯' },
    { id: 'assessments', label: 'Değerlendirmeler', icon: '📝' },
    { id: 'certifications', label: 'Sertifikasyon', icon: '📜' },
    { id: 'career', label: 'Kariyer Gelişimi', icon: '🚀' },
    { id: 'analytics', label: 'Organizasyonel Analitik', icon: '📈' },
    { id: 'ai', label: 'AI Önerileri', icon: '✨' },
    { id: 'content', label: 'İçerik Yönetimi', icon: '⚙️' }
  ];

  return (
    <div className="learning-development-module fade-in" style={{ display: 'flex', height: 'calc(100vh - 80px)', background: '#f8fafc' }}>
      
      {/* Sub-Sidebar Navigasyon */}
      <div className="sub-sidebar glass" style={{ width: '260px', padding: '1rem', borderRight: '1px solid #e2e8f0', background: '#fff', overflowY: 'auto' }}>
        <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b', fontSize: '1.1rem', padding: '0 0.5rem' }}>Eğitim ve Gelişim</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {TABS.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                width: '100%', padding: '0.75rem 1rem', 
                border: 'none', borderRadius: '8px', 
                background: activeTab === tab.id ? '#e0f2fe' : 'transparent',
                color: activeTab === tab.id ? '#0284c7' : '#475569',
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

      {/* İçerik Alanı */}
      <div className="content-area" style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {activeTab === 'dashboard' && <LearningDashboard employees={employees} employeeProfiles={employeeProfiles} catalog={catalog} certifications={certifications} userRole={userRole} setTab={setActiveTab} />}
        {activeTab === 'catalog' && <LearningCatalog catalog={catalog} userRole={userRole} employees={employees} />}
        {activeTab === 'paths' && <LearningPaths paths={learningPaths} setPaths={setLearningPaths} catalog={catalog} userRole={userRole} employees={employees} />}
        {activeTab === 'matrix' && <SkillMatrix employees={employees} employeeProfiles={employeeProfiles} jobAnalyses={jobAnalyses} skillLibrary={skillLib} />}
        {activeTab === 'idp' && <DevelopmentPlans plans={plans} setPlans={setPlans} employees={employees} catalog={catalog} userRole={userRole} />}
        {activeTab === 'assessments' && <Assessments assessments={assessments} catalog={catalog} />}
        {activeTab === 'certifications' && <Certifications certifications={certifications} employees={employees} />}
        {activeTab === 'career' && <CareerDevelopment employees={employees} employeeProfiles={employeeProfiles} skillLibrary={skillLib} />}
        {activeTab === 'analytics' && <LearningAnalytics />}
        {activeTab === 'ai' && <AIRecommendations employees={employees} employeeProfiles={employeeProfiles} catalog={catalog} certifications={certifications} />}
        {activeTab === 'content' && <ContentManagement catalog={catalog} setCatalog={setCatalog} />}
      </div>

    </div>
  );
}
