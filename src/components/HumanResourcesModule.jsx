import React, { useState } from 'react';
import JobAnalysisList from './JobAnalysisList';
import JobAnalysisWizard from './JobAnalysisWizard';
import './HumanResourcesModule.css';

export default function HumanResourcesModule({ 
  departments, titles, families, functions, levels, 
  respLib, taskLib, compLib, skillLib, knowLib, certLib,
  jobAnalyses, setJobAnalyses, userRole 
}) {
  // Main routing inside HR Modul: 'list' or 'wizard'
  const [currentView, setCurrentView] = useState('list'); // 'list' | 'wizard'
  const [selectedAnalysisId, setSelectedAnalysisId] = useState(null);
  const [wizardMode, setWizardMode] = useState('create'); // 'create' | 'edit' | 'revise'

  const handleOpenWizard = (analysisId = null, mode = 'create') => {
    setSelectedAnalysisId(analysisId);
    setWizardMode(mode);
    setCurrentView('wizard');
  };

  const handleSaveDraft = (draftData) => {
    setJobAnalyses(prev => {
      let newData = [...prev];

      // Eğer ACTIVE olarak geliyorsa ve previousVersionId varsa, eski versiyonu ARCHIVED yap.
      if (draftData.status === 'ACTIVE' && draftData.previousVersionId) {
         const oldIndex = newData.findIndex(item => item.id === draftData.previousVersionId);
         if (oldIndex !== -1) {
            newData[oldIndex] = { ...newData[oldIndex], status: 'ARCHIVED' };
         }
      }

      const existsIndex = newData.findIndex(item => item.id === draftData.id);
      if (existsIndex !== -1) {
        newData[existsIndex] = draftData;
      } else {
        newData.unshift(draftData);
      }
      return newData;
    });
    handleBackToList();
  };

  const handleApprove = (analysisId) => {
    setJobAnalyses(prev => {
      let newData = [...prev];
      const targetIndex = newData.findIndex(item => item.id === analysisId);
      if (targetIndex === -1) return prev;
      
      const target = { ...newData[targetIndex] };
      target.status = 'ACTIVE';

      // Eski sürümü arşivle
      if (target.previousVersionId) {
         const oldIndex = newData.findIndex(item => item.id === target.previousVersionId);
         if (oldIndex !== -1) {
            newData[oldIndex] = { ...newData[oldIndex], status: 'ARCHIVED' };
         }
      }

      newData[targetIndex] = target;
      return newData;
    });
  };

  const handleReject = (analysisId, reason) => {
    setJobAnalyses(prev => {
      let newData = [...prev];
      const targetIndex = newData.findIndex(item => item.id === analysisId);
      if (targetIndex === -1) return prev;
      
      const target = { ...newData[targetIndex] };
      target.status = 'REJECTED';
      target.rejectionReason = reason;
      target.rejectedBy = userRole; // idealde gerçek kullanıcı adı
      target.rejectedAt = new Date().toISOString();

      newData[targetIndex] = target;
      return newData;
    });
  };

  const handleDelete = (analysisId) => {
    setJobAnalyses(prev => prev.filter(item => item.id !== analysisId));
  };

  const handleBackToList = () => {
    setSelectedAnalysisId(null);
    setCurrentView('list');
  };

  return (
    <div className="hr-module fade-in">
      <div className="profile-content glass fade-in" style={{ padding: '2rem' }}>
        {currentView === 'list' && (
          <JobAnalysisList 
            departments={departments}
            titles={titles}
            families={families}
            functions={functions}
            levels={levels}
            respLib={respLib}
            taskLib={taskLib}
            compLib={compLib}
            skillLib={skillLib}
            knowLib={knowLib}
            certLib={certLib}
            jobAnalyses={jobAnalyses}
            userRole={userRole}
            onOpenWizard={handleOpenWizard}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
          />
        )}
        {currentView === 'wizard' && (
          <JobAnalysisWizard 
            departments={departments}
            titles={titles}
            families={families}
            functions={functions}
            levels={levels}
            respLib={respLib}
            taskLib={taskLib}
            compLib={compLib}
            skillLib={skillLib}
            knowLib={knowLib}
            certLib={certLib}
            jobAnalyses={jobAnalyses}
            initialAnalysisId={selectedAnalysisId}
            wizardMode={wizardMode}
            onClose={handleBackToList}
            onSaveDraft={handleSaveDraft}
          />
        )}
      </div>
    </div>
  );
}
