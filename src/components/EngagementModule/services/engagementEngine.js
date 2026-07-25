// src/components/EngagementModule/services/engagementEngine.js

export const getEmployeeProfile = (employeeId, profiles) => {
  return profiles.find(p => p.employeeId === employeeId) || {
    discType: 'Bilinmiyor',
    discName: 'Analiz Bekliyor',
    color: '#cbd5e1',
    traits: ['Veri Yok'],
    communicationAdvice: 'Psikometri testi atanmamış veya tamamlanmamış.',
    conflictRisk: 'Veri Yok',
    motivators: []
  };
};

export const calculateDepartmentSynergy = (departmentId, employees, profiles) => {
  const deptEmps = employees.filter(e => e.departmentId === departmentId);
  const deptProfiles = deptEmps.map(e => ({
    employee: e,
    profile: getEmployeeProfile(e.id, profiles)
  }));

  const typeCounts = { D: 0, I: 0, S: 0, C: 0, Bilinmiyor: 0 };
  deptProfiles.forEach(dp => {
    typeCounts[dp.profile.discType] = (typeCounts[dp.profile.discType] || 0) + 1;
  });

  let synergyNote = '';
  let riskNote = '';
  
  // Basic Synergy Logic
  if (typeCounts['D'] > typeCounts['S'] + typeCounts['C']) {
    synergyNote = 'Ekip hızlı karar alıyor ancak uygulama ve detaylarda zayıflık olabilir.';
    riskNote = 'Birden fazla baskın (Dominant) karakter liderlik çatışmalarına yol açabilir.';
  } else if (typeCounts['I'] > typeCounts['C']) {
    synergyNote = 'İletişimi yüksek, neşeli ve dışa dönük bir ekip.';
    riskNote = 'Analitik ve kuralcı yapılar eksik. Hata oranı yüksek olabilir.';
  } else if (typeCounts['S'] + typeCounts['C'] > typeCounts['D'] + typeCounts['I']) {
    synergyNote = 'İstikrarlı, uyumlu ve kalite odaklı bir ekip.';
    riskNote = 'Risk almaktan kaçınılabilir. Hız gerektiren durumlarda yavaş kalabilirler.';
  } else {
    synergyNote = 'Farklı karakter tiplerinin dengeli dağıldığı homojen bir ekip.';
    riskNote = 'Farklı diller konuşan profillerin iletişimine dikkat edilmeli.';
  }

  return { deptProfiles, typeCounts, synergyNote, riskNote };
};
