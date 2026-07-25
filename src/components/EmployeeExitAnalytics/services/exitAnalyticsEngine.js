// src/components/EmployeeExitAnalytics/services/exitAnalyticsEngine.js

export const calculateDashboardMetrics = (records, surveys) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthExits = records.filter(r => {
    const d = new Date(r.exitDate);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const voluntaryExits = records.filter(r => r.exitType === 'voluntary');
  const voluntaryRate = records.length > 0 ? Math.round((voluntaryExits.length / records.length) * 100) : 0;
  
  const regrettableLosses = records.filter(r => r.regrettableLoss).length;
  
  let avgSatisfaction = 0;
  if (surveys.length > 0) {
    avgSatisfaction = surveys.reduce((acc, curr) => acc + curr.overallSatisfaction, 0) / surveys.length;
  }

  // Find top reason
  const reasonCounts = {};
  records.forEach(r => {
    reasonCounts[r.reasonCategory] = (reasonCounts[r.reasonCategory] || 0) + 1;
  });
  const topReason = Object.keys(reasonCounts).sort((a,b) => reasonCounts[b] - reasonCounts[a])[0] || 'Veri Yok';

  return {
    thisMonthExitsCount: thisMonthExits.length,
    voluntaryRate,
    regrettableLosses,
    avgSatisfaction: avgSatisfaction.toFixed(1),
    topReason
  };
};

export const calculateDepartmentRisks = (records) => {
  const deptCounts = {};
  records.forEach(r => {
    deptCounts[r.departmentName] = (deptCounts[r.departmentName] || 0) + 1;
  });
  
  return Object.keys(deptCounts).map(dept => ({
    department: dept,
    exitCount: deptCounts[dept],
    risk: deptCounts[dept] >= 2 ? 'high' : 'medium'
  })).sort((a,b) => b.exitCount - a.exitCount);
};

export const getSatisfactionAverages = (surveys) => {
  if (surveys.length === 0) return {};
  
  const dims = ['managerSatisfaction', 'compensationSatisfaction', 'workloadSatisfaction', 'careerOpportunitySatisfaction', 'cultureSatisfaction', 'workLifeBalance', 'psychologicalSafety'];
  const avgs = {};
  
  dims.forEach(dim => {
    avgs[dim] = (surveys.reduce((acc, curr) => acc + curr[dim], 0) / surveys.length).toFixed(1);
  });
  
  return avgs;
};

export const calculatePredictiveRisks = (activeEmployees, signals) => {
  // Combine active employees with their risk signals
  return signals.map(sig => {
    const emp = activeEmployees.find(e => e.id === sig.employeeId);
    return {
      ...sig,
      employeeName: emp ? emp.name : 'Bilinmeyen Çalışan',
      department: emp ? emp.department : '',
      title: emp ? emp.title : ''
    };
  });
};
