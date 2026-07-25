import React, { useState, useMemo } from 'react';
import './CheckUpModule.css';
import SurveyModule from './SurveyModule';
import SatisfactionSurveyModule from './SatisfactionSurveyModule';
import FunctionalitySurveyModule from './FunctionalitySurveyModule';
import ProcessAnalysisModule from './ProcessAnalysisModule';
import SwotAnalysisModule from './SwotAnalysisModule';
import ReportRoadmapModule from './ReportRoadmapModule';
import InterviewSubModule from './InterviewSubModule';

// Static base steps configuration
const baseSteps = [
  { id: 1, title: 'Kurumsal Teşhis Görüşmesi', type: 'meeting' },
  { id: 2, title: 'Kurumsallaşma Skoru Envanteri', type: 'survey' },
  { id: 3, title: 'Kurumsal İşlevsellik Ölçeği', type: 'survey' },
  { id: 4, title: 'Çalışan Memnuniyet Ölçümü', type: 'survey' },
  { id: 5, title: 'Süreç ve İş Akış Analizleri', type: 'analysis' },
  { id: 6, title: 'Bire-bir Çalışan Görüşmeleri', type: 'meeting' },
  { id: 7, title: 'SWOT, PEST, PESTLE Analizleri', type: 'analysis' },
  { id: 8, title: 'Raporlama ve Yol Haritası', type: 'report' },
  { id: 9, title: 'Periyodik Değerlendirmeler', type: 'evaluation' },
];

export default function CheckUpModule(props) {
  const [activeStepId, setActiveStepId] = useState(1);
  const { 
    interviews, surveyHistory, processes, oneOnOneInterviews, 
    employees, setInterviews, onSaveSurvey, 
    functionalitySurvey, setFunctionalitySurvey, functionalityDimensions, setFunctionalityDimensions, functionalityResponses, setFunctionalityResponses,
    satisfactionSurvey, setSatisfactionSurvey, satisfactionDimensions, setSatisfactionDimensions, maviYakaSurvey, setMaviYakaSurvey, maviYakaDimensions, setMaviYakaDimensions,
    onOpenAnonymousView, surveyResponses, setSurveyResponses,
    setProcesses, swotEntries, setSwotEntries, setOneOnOneInterviews,
    companyInfo, roadmapActions, setRoadmapActions, reportComments, setReportComments, suggestedStrategies, setSuggestedStrategies,
    userRole, strategyGoals, dailyTasks, meetings
  } = props;

  const steps = useMemo(() => {
    return baseSteps.map(step => {
      let status = 'pending';
      if (step.id === 1) status = (interviews.length > 0 && interviews.every(i => i.status === 'completed')) ? 'completed' : 'in-progress';
      else if (step.id === 2) {
        const lastSurvey = surveyHistory.length > 0 ? surveyHistory[0] : null;
        status = (lastSurvey && (new Date() - new Date(lastSurvey.date)) / (1000 * 60 * 60 * 24) < 90) ? 'completed' : 'in-progress';
      }
      else if (step.id === 3) status = (functionalityResponses.length > 0) ? 'completed' : 'in-progress';
      else if (step.id === 4) status = (surveyResponses.length > 0) ? 'completed' : 'in-progress';
      else if (step.id === 5) status = (processes && processes.length > 0) ? 'completed' : 'in-progress';
      else if (step.id === 6) status = (oneOnOneInterviews && oneOnOneInterviews.length > 0 && oneOnOneInterviews.every(i => i.status === 'completed')) ? 'completed' : 'in-progress';
      else if (step.id === 7) status = (swotEntries && swotEntries.length > 0) ? 'completed' : 'pending';
      else if (step.id === 8) status = 'in-progress';
      
      return { ...step, status };
    });
  }, [interviews, surveyHistory, processes, oneOnOneInterviews, functionalityResponses, surveyResponses, swotEntries]);

  const activeStep = steps.find(s => s.id === activeStepId);

  const renderStepDetails = () => {
    if (!activeStep) return null;
    const { id, title, status } = activeStep;

    return (
      <div className="step-details fade-in" key={id}>
        <header className="details-header">
          <div className="step-number">Adım {id}</div>
          <h2>{title}</h2>
          <p className="details-meta">Durum: <span className={`status-text ${status}`}>{status === 'completed' ? 'Tamamlandı' : status === 'in-progress' ? 'Devam Ediyor' : 'Henüz Başlamadı'}</span></p>
        </header>

        <div className="details-body">
          {id === 1 && <InterviewSubModule employees={employees} interviews={interviews} setInterviews={setInterviews} userRole={userRole} title="Kurumsal Teşhis Görüşmesi" />}
          {id === 2 && <SurveyModule surveyHistory={surveyHistory} onSaveSurvey={onSaveSurvey} />}
          {id === 3 && <FunctionalitySurveyModule surveyData={functionalitySurvey} setSurveyData={setFunctionalitySurvey} dimensions={functionalityDimensions} setDimensions={setFunctionalityDimensions} employees={employees} onOpenAnonymousView={onOpenAnonymousView} functionalityResponses={functionalityResponses} setFunctionalityResponses={setFunctionalityResponses} />}
          {id === 4 && <SatisfactionSurveyModule surveyData={satisfactionSurvey} setSurveyData={setSatisfactionSurvey} dimensions={satisfactionDimensions} setDimensions={setSatisfactionDimensions} employees={employees} maviYakaSurvey={maviYakaSurvey} setMaviYakaSurvey={setMaviYakaSurvey} maviYakaDimensions={maviYakaDimensions} setMaviYakaDimensions={setMaviYakaDimensions} onOpenAnonymousView={onOpenAnonymousView} surveyResponses={surveyResponses} setSurveyResponses={setSurveyResponses} />}
          {id === 5 && <ProcessAnalysisModule processes={processes} setProcesses={setProcesses} employees={employees} />}
          {id === 6 && <InterviewSubModule employees={employees} interviews={oneOnOneInterviews} setInterviews={setOneOnOneInterviews} userRole={userRole} title="Bire-bir Çalışan Görüşmesi" />}
          {id === 7 && <SwotAnalysisModule employees={employees} swotEntries={swotEntries} setSwotEntries={setSwotEntries} />}
          {id === 8 && <ReportRoadmapModule {...props} />}
          
          {[9].includes(id) && (
             <div className="empty-state">
               <div className="empty-icon">⏳</div>
               <p>Bu modül geliştirme aşamasındadır.</p>
             </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="checkup-module fade-in">
      <div className="timeline-container glass">
        <h3 className="section-title">9 Adımlı Check-Up Süreci</h3>
        <div className="timeline">
          {steps.map((step) => (
            <div key={step.id} className={`timeline-item ${step.status} ${activeStepId === step.id ? 'active' : ''}`} onClick={() => setActiveStepId(step.id)}>
              <div className="timeline-marker">{step.status === 'completed' ? '✓' : step.id}</div>
              <div className="timeline-content">
                <h4>{step.title}</h4>
                <span className={`badge ${step.status}`}>{step.status === 'completed' ? 'Tamamlandı' : step.status === 'in-progress' ? 'Devam Ediyor' : 'Bekliyor'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="step-details-container glass">{renderStepDetails()}</div>
    </div>
  );
}
