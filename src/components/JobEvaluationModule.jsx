import React, { useState } from 'react';
import JobEvaluationFactors from './JobEvaluationFactors';
import GuidedJobEvaluation from './GuidedJobEvaluation';
import EvaluationMatrix from './EvaluationMatrix';
import './JobEvaluationModule.css';

const JobEvaluationModule = ({ factors, setFactors, titles, evaluations, setEvaluations, jobAnalyses }) => {
  const [activeSubTab, setActiveSubTab] = useState('factors');

  return (
    <div className="job-evaluation-module">
      <div className="job-evaluation-tabs glass">
        <button className={`tab-btn ${activeSubTab === 'factors' ? 'active' : ''}`} onClick={() => setActiveSubTab('factors')}>⚙️ Faktör & Ağırlık Yönetimi</button>
        <button className={`tab-btn ${activeSubTab === 'guided' ? 'active' : ''}`} onClick={() => setActiveSubTab('guided')}>🧭 Rehberli İş Değerleme</button>
        <button className={`tab-btn ${activeSubTab === 'matrix' ? 'active' : ''}`} onClick={() => setActiveSubTab('matrix')}>📊 Değerleme Matrisi</button>
      </div>

      <div className="job-evaluation-content">
        {activeSubTab === 'factors' && (
          <JobEvaluationFactors factors={factors} setFactors={setFactors} />
        )}
        {activeSubTab === 'guided' && (
          <GuidedJobEvaluation 
            factors={factors} 
            titles={titles} 
            evaluations={evaluations} 
            setEvaluations={setEvaluations}
            jobAnalyses={jobAnalyses}
          />
        )}
        {activeSubTab === 'matrix' && (
          <EvaluationMatrix
            factors={factors}
            titles={titles}
            evaluations={evaluations}
            setEvaluations={setEvaluations}
          />
        )}
      </div>
    </div>
  );
};

export default JobEvaluationModule;
