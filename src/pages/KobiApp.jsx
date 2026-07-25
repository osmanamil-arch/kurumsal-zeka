import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useKobiState } from '../hooks/useKobiState';
import '../App.css';
import CheckUpModule from '../components/CheckUpModule';
import StrategyModule from '../components/StrategyModule';
import CompanyProfileModule from '../components/CompanyProfileModule';
import AnonymousSurveyView from '../components/AnonymousSurveyView';
import TaskTrackingModule from '../components/TaskTrackingModule';
import MeetingsModule from '../components/MeetingsModule';
import ManagementSummaryModule from '../components/ManagementSummaryModule';
import HumanResourcesModule from '../components/HumanResourcesModule';
import PsychometricsModule from '../components/PsychometricsModule';
import PerformanceModule from '../components/PerformanceModule';
import RecruitmentModule from '../components/RecruitmentModule';
import EmployeeExitAnalyticsModule from '../components/EmployeeExitAnalyticsModule';
import TrainingModule from '../components/TrainingModule';
import EngagementModule from '../components/EngagementModule/EngagementModule';

import { defaultSurvey, defaultDimensions, defaultMaviYakaSurvey, defaultMaviYakaDimensions } from '../data/defaultSurvey';
import { defaultFunctionalitySurvey, defaultFunctionalityDimensions } from '../data/functionalitySurvey';
import { initialCompanyInfo, initialEmployees, initialSurveyHistory, initialInterviews, initialRoadmapActions, initialMeetings, initialDepartments, initialTitles, jobFamilies, jobFunctions, jobLevels, initialJobAnalyses, responsibilityLibrary, taskLibrary, competencyLibrary, skillLibrary, knowledgeLibrary, certificationLibrary } from '../data/mockData';
import MasterDataModule from '../components/MasterDataModule';
import JobEvaluationModule from '../components/JobEvaluationModule';
import { hierarchicalFactors, initialJobEvaluations } from '../data/jobEvaluationData';
import SalaryManagementModule from '../components/SalaryManagementModule';
import AISettingsModal from '../components/AISettingsModal';

// ─── Firma başına izole panel ─────────────────────────────────────────────────
// KobiAppShell: firma seçimini yönetir ve KobiApp'i key={companyId} ile
// render ederek firma değişince tamamen yeniden yükler.
export default function KobiAppShell() {
  const { currentUser, companies, logout } = useAuth();
  const navigate = useNavigate();

  const [selectedCompanyId, setSelectedCompanyId] = React.useState(() => {
    if (currentUser?.role === 'danisman' && currentUser?.assignedCompanies?.length > 0) {
      return currentUser.assignedCompanies[0];
    }
    return currentUser?.companyId || null;
  });

  useEffect(() => {
    if (currentUser && !selectedCompanyId) {
      if (currentUser.role === 'danisman' && currentUser.assignedCompanies?.length > 0) {
        setSelectedCompanyId(currentUser.assignedCompanies[0]);
      } else if (currentUser.companyId) {
        setSelectedCompanyId(currentUser.companyId);
      }
    }
  }, [currentUser, selectedCompanyId]);

  if (!selectedCompanyId) {
    const isConsultant = currentUser?.role === 'danisman';
    const hasAssignedCompanies = currentUser?.assignedCompanies?.length > 0;

    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', color: 'var(--text-color)', padding: '2rem' }}>
        <div className="glass" style={{ maxWidth: '450px', width: '100%', padding: '2.5rem', borderRadius: '16px', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🏢</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Firma Seçimi</h2>
          
          {isConsultant ? (
            hasAssignedCompanies ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>Lütfen yönetmek istediğiniz firmayı seçin:</p>
                <select 
                  onChange={e => setSelectedCompanyId(e.target.value)} 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-color)', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="">-- Firma Seçin --</option>
                  {(currentUser.assignedCompanies || []).map(compId => {
                    const comp = companies.find(c => c.id === compId);
                    return <option key={compId} value={compId}>{comp?.name || compId}</option>;
                  })}
                </select>
              </div>
            ) : (
              <p style={{ color: '#ef4444', background: '#fee2e2', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '2rem', textAlign: 'left', lineHeight: '1.4' }}>
                ⚠️ Henüz size atanmış bir firma bulunmuyor. Lütfen Sistem Yöneticisi (Superadmin) ile iletişime geçin.
              </p>
            )
          ) : (
            <p style={{ color: '#ef4444', background: '#fee2e2', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '2rem', textAlign: 'left', lineHeight: '1.4' }}>
              ⚠️ Hesabınız herhangi bir firma ile ilişkilendirilmemiş. Lütfen yetkili veya yöneticiniz ile iletişime geçin.
            </p>
          )}

          <button 
            onClick={() => { logout(); navigate('/'); }} 
            className="primary-button" 
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#ef4444', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <KobiPanelMain
      key={selectedCompanyId}
      companyId={selectedCompanyId}
      onCompanyChange={setSelectedCompanyId}
    />
  );
}

// ─── Asıl panel bileşeni ───────────────────────────────────────────────────────
function KobiPanelMain({ companyId, onCompanyChange }) {
  const { currentUser, companies, logout } = useAuth();
  const navigate = useNavigate();
  const activeCompany = companies?.find(c => c.id === companyId);

  // Her firma
  const [activeTab, setActiveTab] = useKobiState(companyId, 'activeTab', 'companyProfile');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);
  const [isLightMode, setIsLightMode] = useLocalStorage('kobi_lightMode', false); // tema global kalabilir

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isLightMode ? 'light' : 'dark');
  }, [isLightMode]);
  const [isAnonymousView, setIsAnonymousView] = useState(null);
  
  // ── Firma bazında izole state ──────────────────────────────────────────────
  const [surveyHistory, setSurveyHistory] = useKobiState(companyId, 'surveyHistory', () => initialSurveyHistory);
  const [surveyResponses, setSurveyResponses] = useKobiState(companyId, 'surveyResponses', []);
  const [companyInfo, setCompanyInfo] = useKobiState(companyId, 'companyInfo', () => ({
    ...initialCompanyInfo,
    name: activeCompany?.name || initialCompanyInfo.name,
    title: activeCompany?.name || initialCompanyInfo.title,
  }));
  const [departments, setDepartments] = useKobiState(companyId, 'departments', initialDepartments);
  const [titles, setTitles] = useKobiState(companyId, 'titles', initialTitles);
  const [employees, setEmployees] = useKobiState(companyId, 'employees', initialEmployees);
  const [families, setFamilies] = useKobiState(companyId, 'jobFamilies', jobFamilies);
  const [functions, setFunctions] = useKobiState(companyId, 'jobFunctions', jobFunctions);
  const [levels, setLevels] = useKobiState(companyId, 'jobLevels', jobLevels);
  const [respLib, setRespLib] = useKobiState(companyId, 'respLib', responsibilityLibrary);
  const [taskLib, setTaskLib] = useKobiState(companyId, 'taskLib', taskLibrary);
  const [compLib, setCompLib] = useKobiState(companyId, 'compLib', competencyLibrary);
  const [skillLib, setSkillLib] = useKobiState(companyId, 'skillLib', skillLibrary);
  const [knowLib, setKnowLib] = useKobiState(companyId, 'knowLib', knowledgeLibrary);
  const [certLib, setCertLib] = useKobiState(companyId, 'certLib', certificationLibrary);
  const [jobAnalyses, setJobAnalyses] = useKobiState(companyId, 'jobAnalyses', initialJobAnalyses);
  const [interviews, setInterviews] = useKobiState(companyId, 'interviews', initialInterviews);
  const [oneOnOneInterviews, setOneOnOneInterviews] = useKobiState(companyId, 'oneOnOneInterviews', []);
  const [swotEntries, setSwotEntries] = useKobiState(companyId, 'swotEntries', []);
  const [reportComments, setReportComments] = useKobiState(companyId, 'reportComments', {});
  const [suggestedStrategies, setSuggestedStrategies] = useKobiState(companyId, 'suggestedStrategies', []);
  const [satisfactionSurvey, setSatisfactionSurvey] = useKobiState(companyId, 'satSurvey', defaultSurvey);
  const [satisfactionDimensions, setSatisfactionDimensions] = useKobiState(companyId, 'satDims', defaultDimensions);
  const [maviYakaSurvey, setMaviYakaSurvey] = useKobiState(companyId, 'maviSurvey', defaultMaviYakaSurvey);
  const [maviYakaDimensions, setMaviYakaDimensions] = useKobiState(companyId, 'maviDims', defaultMaviYakaDimensions);
  const [functionalitySurvey, setFunctionalitySurvey] = useKobiState(companyId, 'funcSurvey', defaultFunctionalitySurvey);
  const [functionalityDimensions, setFunctionalityDimensions] = useKobiState(companyId, 'funcDims', defaultFunctionalityDimensions);
  const [functionalityResponses, setFunctionalityResponses] = useKobiState(companyId, 'funcResponses', []);
  const [processes, setProcesses] = useKobiState(companyId, 'processes', []);
  const [jobPostings, setJobPostings] = useKobiState(companyId, 'jobPostings', []);
  const [strategyGoals, setStrategyGoals] = useKobiState(companyId, 'strategyGoals', []);
  const [dailyTasks, setDailyTasks] = useKobiState(companyId, 'dailyTasks', []);
  const [meetings, setMeetings] = useKobiState(companyId, 'meetings', initialMeetings);
  const [roadmapActions, setRoadmapActions] = useKobiState(companyId, 'roadmapActions', initialRoadmapActions);
  const [performanceCampaigns, setPerformanceCampaigns] = useKobiState(companyId, 'perfCampaigns', []);
  const [evalFactors, setEvalFactors] = useKobiState(companyId, 'evalFactors', hierarchicalFactors);
  const [jobEvaluations, setJobEvaluations] = useKobiState(companyId, 'jobEvaluations', initialJobEvaluations);

  // Sanitized array guards to prevent crashes if Supabase returns null or non-array states
  const sanitizedSurveyHistory = Array.isArray(surveyHistory) ? surveyHistory : [];
  const sanitizedSurveyResponses = Array.isArray(surveyResponses) ? surveyResponses : [];
  const sanitizedEvalFactors = Array.isArray(evalFactors) ? evalFactors : hierarchicalFactors;
  const sanitizedJobEvaluations = Array.isArray(jobEvaluations) ? jobEvaluations : [];
  const sanitizedJobPostings = Array.isArray(jobPostings) ? jobPostings : [];
  const sanitizedStrategyGoals = Array.isArray(strategyGoals) ? strategyGoals : [];
  const sanitizedDailyTasks = Array.isArray(dailyTasks) ? dailyTasks : [];
  const sanitizedMeetings = Array.isArray(meetings) ? meetings : [];
  const sanitizedRoadmapActions = Array.isArray(roadmapActions) ? roadmapActions : [];
  const sanitizedPerformanceCampaigns = Array.isArray(performanceCampaigns) ? performanceCampaigns : [];
  const sanitizedCompanyInfo = companyInfo && typeof companyInfo === 'object' ? companyInfo : initialCompanyInfo;
  
  // Yeni 18 faktörlü yapıya geçiş için zorunlu kontrol
  useEffect(() => {
    const currentSubFactorCount = sanitizedEvalFactors?.reduce((acc, cat) => acc + (cat.subFactors?.length || 0), 0);
    if (currentSubFactorCount !== 18) {
      console.warn(`Faktör sayısı uyuşmazlığı (${currentSubFactorCount} vs 18), model güncelleniyor...`);
      setEvalFactors(hierarchicalFactors);
    }
  }, [sanitizedEvalFactors, setEvalFactors]);

  const handleSaveSurvey = (payload) => {
    setSurveyHistory(prev => [
      { id: Date.now().toString(), date: new Date().toISOString(), score: payload.score, answers: payload.answers },
      ...(Array.isArray(prev) ? prev : [])
    ]);
  };

  const sortedHistory = useMemo(() => {
    return [...sanitizedSurveyHistory].sort((a,b) => new Date(b.date) - new Date(a.date));
  }, [sanitizedSurveyHistory]);

  const notifications = useMemo(() => {
    const lastSurvey = sortedHistory.length > 0 ? sortedHistory[0] : null;
    const daysSinceLast = lastSurvey ? (new Date() - new Date(lastSurvey.date)) / (1000 * 60 * 60 * 24) : Infinity;
    return daysSinceLast >= 90 ? [{ id: 'n1', text: 'Kurumsallaşma Skoru Envanterini doldurmanız gerekiyor.', type: 'warning' }] : [];
  }, [sortedHistory]);

  const handleSurveySubmit = (payload) => {
    const finalPayload = { ...payload, type: isAnonymousView || 'beyaz' };
    if (isAnonymousView === 'islevsellik') {
      setFunctionalityResponses(prev => [...prev, finalPayload]);
    } else {
      setSurveyResponses(prev => [...prev, finalPayload]);
    }
    setIsAnonymousView(null);
    alert('✅ Anket başarıyla gönderildi!');
  };

  if (isAnonymousView) {
    let renderQuestions = satisfactionSurvey;
    let renderDimensions = satisfactionDimensions;
    if (isAnonymousView === 'mavi') { renderQuestions = maviYakaSurvey; renderDimensions = maviYakaDimensions; }
    if (isAnonymousView === 'islevsellik') { renderQuestions = functionalitySurvey; renderDimensions = functionalityDimensions; }
    
    return (
      <AnonymousSurveyView 
        surveyType={isAnonymousView}
        questions={renderQuestions} 
        dimensions={renderDimensions} 
        onSubmit={handleSurveySubmit} 
        onCancel={() => setIsAnonymousView(null)} 
      />
    );
  }

  const menuGroupsRaw = [
    {
      title: 'STRATEJİM',
      items: [
        { id: 'companyProfile', icon: '🏢', label: 'Şirket Profili' },
        { id: 'checkup', icon: '📊', label: 'Kurumsal Check Up' },
        { id: 'strategy', icon: '🎯', label: 'Stratejik Plan' },
        { id: 'tasks', icon: '✅', label: 'Görev ve Takip' },
        { id: 'meetings', icon: '🤝', label: 'Toplantılar' },
        { id: 'summary', icon: '📈', label: 'Yönetim Özeti' }
      ]
    },
    {
      title: 'İNSAN KAYNAKLARI',
      items: [
        { id: 'hr', icon: '📝', label: 'İş Analizi ve Görev Tanımları' },
        { id: 'recruitment', icon: '👥', label: 'İşe Alım' },
        { id: 'jobEvaluation', icon: '⚖️', label: 'İş Değerleme' },
        { id: 'salaryManagement', icon: '💰', label: 'Ücret Yönetimi' },
        { id: 'psychometrics', label: 'Psikometri & Değerlendirme', icon: '🧠' },
        { id: 'performance', label: 'Performans & Hedefler', icon: '📈' },
        { id: 'training', label: 'Eğitim ve Gelişim', icon: '🎓' },
        { id: 'exitAnalytics', label: 'Çalışan Ayrılma Analizi', icon: '🚪' },
        { id: 'engagement', label: 'Bağlılık ve İç İletişim', icon: '❤️' }
      ]
    },
    {
      title: 'AYARLAR',
      items: [
        { id: 'masterData', icon: '⚙️', label: 'Veri ve Kütüphane Yönetimi' }
      ]
    }
  ];

  const menuGroups = useMemo(() => {
    if (!activeCompany) return menuGroupsRaw;

    // activeModules artık doğrudan sidebar ID'leri içeriyor (checkup, hr, performance vs.)
    // Şirket Profili ve Ayarlar her zaman açık
    const activeMods = Array.isArray(activeCompany.activeModules) ? activeCompany.activeModules : [];
    const allowedItems = new Set(['companyProfile', 'masterData', ...activeMods]);

    return menuGroupsRaw.map(group => ({
      ...group,
      items: group.items.filter(item => allowedItems.has(item.id))
    })).filter(group => group.items.length > 0);
  }, [activeCompany]);

  const activeItem = useMemo(() => {
    for (const group of menuGroups) {
      const item = group.items.find(i => i.id === activeTab);
      if (item) return item;
    }
    return null;
  }, [activeTab]);

  return (
    <div className="app-container">
      <aside className="sidebar glass">
        <div className="sidebar-logo">
          <div className="logo-icon">✨</div>
          <h2>{activeCompany?.name || 'Kurumsal Zeka'}</h2>
        </div>
        <nav className="sidebar-nav">
          {menuGroups.map(group => (
            <div key={group.title} className="nav-category">
              <div className="nav-group-title">{group.title}</div>
              {group.items.map(item => (
                <button 
                  key={item.id} 
                  className={`nav-item ${activeTab === item.id ? 'active' : ''} ${item.disabled ? 'disabled' : ''}`} 
                  onClick={() => !item.disabled && setActiveTab(item.id)}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="main-content">
        <header className="topbar glass">
          <div className="header-title">
            <h1>{activeItem?.label || 'Yönetim Özeti'}</h1>
          </div>
          
          <div className="header-actions">
            <button
              className={`theme-toggle ${isLightMode ? 'light' : ''}`}
              onClick={() => setIsLightMode(!isLightMode)}
              title={isLightMode ? 'Koyu Moda Geç' : 'Açık Moda Geç'}
              aria-label="Tema Değiştir"
            >
              <div className="toggle-track">
                <span className="toggle-icon sun">☀️</span>
                <span className="toggle-icon moon">🌙</span>
                <div className="toggle-thumb" />
              </div>
            </button>

            <div className="notification-bell" onClick={() => setShowNotifications(!showNotifications)}>
              <span className="bell-icon">🔔</span>
              {notifications.length > 0 && <span className="notif-badge">{notifications.length}</span>}
              {showNotifications && (
                <div className="notif-dropdown glass slide-down">
                   <h4 className="notif-title">Bildirimler</h4>
                   {notifications.length === 0 ? <p className="notif-empty">Yeni bildirim bulunmuyor.</p> : 
                     notifications.map(n => <div className={`notif-item ${n.type}`} key={n.id}>⚠️ <p>{n.text}</p></div>)
                   }
                </div>
              )}
            </div>

            <button
              onClick={() => setShowAISettings(true)}
              style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', marginLeft: '0.5rem', marginRight: '0.5rem' }}
              title="AI Ayarları"
            >
              ✨
            </button>

            <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {currentUser?.role === 'danisman' && (
                <select
                  value={companyId || ''}
                  onChange={e => onCompanyChange(e.target.value)}
                  className="role-selector"
                  style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-color)', maxWidth: '200px' }}
                >
                  <option value="" disabled>Firma Seçin</option>
                  {(currentUser.assignedCompanies || []).map(compId => {
                    const comp = companies.find(c => c.id === compId);
                    return <option key={compId} value={compId}>{comp?.name || 'Bilinmeyen Firma'}</option>;
                  })}
                </select>
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="avatar" style={{background: 'var(--primary-color)'}}>{currentUser?.name?.charAt(0) || 'U'}</div>
                <span style={{ fontWeight: 'bold' }}>{currentUser?.name || 'Kullanıcı'}</span>
                <button onClick={() => { logout(); navigate('/'); }} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }} title="Çıkış Yap">
                  Çıkış
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="page-container">
          {activeTab === 'companyProfile' && <CompanyProfileModule companyInfo={sanitizedCompanyInfo} setCompanyInfo={setCompanyInfo} employees={employees} setEmployees={setEmployees} departments={departments} setDepartments={setDepartments} titles={titles} setTitles={setTitles} families={families} setFamilies={setFamilies} functions={functions} setFunctions={setFunctions} levels={levels} setLevels={setLevels} />}
          {activeTab === 'checkup' && (
            <CheckUpModule 
              {...{surveyHistory: sortedHistory, onSaveSurvey: handleSaveSurvey, employees, interviews, setInterviews, oneOnOneInterviews, setOneOnOneInterviews, swotEntries, setSwotEntries, reportComments, setReportComments, suggestedStrategies, setSuggestedStrategies, userRole: currentUser?.role, satisfactionSurvey, setSatisfactionSurvey, satisfactionDimensions, setSatisfactionDimensions, maviYakaSurvey, setMaviYakaSurvey, maviYakaDimensions, setMaviYakaDimensions, onOpenAnonymousView: (type) => setIsAnonymousView(type), surveyResponses: sanitizedSurveyResponses, setSurveyResponses, functionalitySurvey, setFunctionalitySurvey, functionalityDimensions, setFunctionalityDimensions, functionalityResponses, setFunctionalityResponses, processes, setProcesses, companyInfo: sanitizedCompanyInfo, roadmapActions: sanitizedRoadmapActions, setRoadmapActions, strategyGoals: sanitizedStrategyGoals, setStrategyGoals, dailyTasks: sanitizedDailyTasks, setDailyTasks, meetings: sanitizedMeetings, setMeetings, companyId}}
            />
          )}
          {activeTab === 'strategy' && <StrategyModule employees={employees} userRole={currentUser?.role} goals={sanitizedStrategyGoals} setGoals={setStrategyGoals} suggestedStrategies={suggestedStrategies} setSuggestedStrategies={setSuggestedStrategies} companyId={companyId} />}
          {activeTab === 'tasks' && <TaskTrackingModule employees={employees} userRole={currentUser?.role} dailyTasks={sanitizedDailyTasks} setDailyTasks={setDailyTasks} goals={sanitizedStrategyGoals} setGoals={setStrategyGoals} />}
          {activeTab === 'meetings' && <MeetingsModule employees={employees} userRole={currentUser?.role} meetings={sanitizedMeetings} setMeetings={setMeetings} dailyTasks={sanitizedDailyTasks} setDailyTasks={setDailyTasks} />}
          {activeTab === 'summary' && <ManagementSummaryModule employees={employees} userRole={currentUser?.role} goals={sanitizedStrategyGoals} dailyTasks={sanitizedDailyTasks} meetings={sanitizedMeetings} companyInfo={sanitizedCompanyInfo} departments={departments} titles={titles} surveyHistory={sortedHistory} surveyResponses={sanitizedSurveyResponses} functionalityResponses={functionalityResponses} processes={processes} swotEntries={swotEntries} jobAnalyses={jobAnalyses} jobEvaluations={sanitizedJobEvaluations} performanceCampaigns={sanitizedPerformanceCampaigns} roadmapActions={sanitizedRoadmapActions} interviews={interviews} oneOnOneInterviews={oneOnOneInterviews} companyId={companyId} />}
          {activeTab === 'hr' && <HumanResourcesModule employees={employees} userRole={currentUser?.role} departments={departments} titles={titles} families={families} functions={functions} levels={levels} respLib={respLib} taskLib={taskLib} compLib={compLib} skillLib={skillLib} knowLib={knowLib} certLib={certLib} jobAnalyses={jobAnalyses} setJobAnalyses={setJobAnalyses} />}
          {activeTab === 'jobEvaluation' && <JobEvaluationModule factors={sanitizedEvalFactors} setFactors={setEvalFactors} titles={titles} evaluations={sanitizedJobEvaluations} setEvaluations={setJobEvaluations} jobAnalyses={jobAnalyses} />}
          {activeTab === 'salaryManagement' && <SalaryManagementModule factors={sanitizedEvalFactors} titles={titles} evaluations={sanitizedJobEvaluations} setEvaluations={setJobEvaluations} />}
          {activeTab === 'psychometrics' && <PsychometricsModule employees={employees} userRole={currentUser?.role} approvedPostings={sanitizedJobPostings.filter(p => p.status === 'approved')} jobAnalyses={jobAnalyses} companyId={companyId} />}
          { activeTab === 'performance' && <PerformanceModule employees={employees} departments={departments} titles={titles} jobAnalyses={jobAnalyses} campaigns={sanitizedPerformanceCampaigns} setCampaigns={setPerformanceCampaigns} userRole={currentUser?.role} /> }
          { activeTab === 'training' && <TrainingModule employees={employees} userRole={currentUser?.role} jobAnalyses={jobAnalyses} skillLib={skillLib} performanceCampaigns={sanitizedPerformanceCampaigns} companyId={companyId} /> }
          { activeTab === 'recruitment' && <RecruitmentModule jobAnalyses={jobAnalyses} departments={departments} titles={titles} families={families} functions={functions} levels={levels} companyInfo={sanitizedCompanyInfo} postings={sanitizedJobPostings} setPostings={setJobPostings} /> }
          { activeTab === 'exitAnalytics' && <EmployeeExitAnalyticsModule employees={employees} departments={departments} roles={titles} userRole={currentUser?.role} companyId={companyId} /> }
          { activeTab === 'engagement' && <EngagementModule employees={employees} departments={departments} userRole={currentUser?.role} /> }
          {activeTab === 'masterData' && (
            <MasterDataModule 
              families={families} setFamilies={setFamilies}
              functions={functions} setFunctions={setFunctions}
              levels={levels} setLevels={setLevels}
              respLib={respLib} setRespLib={setRespLib}
              taskLib={taskLib} setTaskLib={setTaskLib}
              compLib={compLib} setCompLib={setCompLib}
              skillLib={skillLib} setSkillLib={setSkillLib}
              knowLib={knowLib} setKnowLib={setKnowLib}
              certLib={certLib} setCertLib={setCertLib}
              departments={departments} setDepartments={setDepartments}
              titles={titles} setTitles={setTitles}
              userRole={currentUser?.role}
            />
          )}
        </main>
      </div>
      {showAISettings && <AISettingsModal onClose={() => setShowAISettings(false)} />}
    </div>
  );
}
