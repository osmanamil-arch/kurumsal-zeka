// src/components/LearningDevelopment/services/learningEngine.js

/**
 * Calculates skill gap for a given employee based on their current skills vs role required skills
 */
export const calculateSkillGap = (employeeId, employeeProfiles, jobAnalyses, employees, skillLibrary) => {
  const employee = employees.find(e => e.id === employeeId);
  const profile = employeeProfiles.find(p => p.employeeId === employeeId);
  if (!employee || !profile) return [];

  // Find active job analysis for employee's role
  const analysis = jobAnalyses.find(ja => ja.titleId === employee.titleId && ja.isActiveVersion);
  if (!analysis) return [];

  const gaps = [];
  
  // Note: in a real scenario, analysis.skills would have expected levels. We simulate here.
  const expectedSkills = analysis.skills || []; // format: { skillId: 'x', expectedLevel: 4 }
  
  // For demo purposes, if analysis doesn't have expected skills, we derive some from job family
  // Mock data fix: ja1 has jf4 but skill library has jf_sales
  const mappedFamilyId = analysis.jobFamilyId === 'jf4' ? 'jf_sales' : analysis.jobFamilyId;
  const mockExpectedSkills = expectedSkills.length > 0 ? expectedSkills : 
    skillLibrary.filter(s => s.familyId === mappedFamilyId).map(s => ({ skillId: s.id, expectedLevel: 5 }));

  mockExpectedSkills.forEach(req => {
    const current = profile.currentSkills.find(s => s.id === req.skillId);
    const currentLevel = current ? current.level : 0;
    
    if (currentLevel < req.expectedLevel) {
      gaps.push({
        skillId: req.skillId,
        skillName: skillLibrary.find(s => s.id === req.skillId)?.title || 'Bilinmeyen Yetkinlik',
        currentLevel,
        expectedLevel: req.expectedLevel,
        gap: req.expectedLevel - currentLevel,
        risk: (req.expectedLevel - currentLevel) >= 2 ? 'Kritik' : 'Orta'
      });
    }
  });

  return gaps;
};

/**
 * Generates mock AI recommendations for an employee
 */
export const generateAIRecommendations = (employeeId, employeeProfiles, employees, performanceCampaigns, catalog, certifications) => {
  const recommendations = [];
  const employee = employees.find(e => e.id === employeeId);
  if (!employee) return recommendations;

  const profile = employeeProfiles.find(p => p.employeeId === employeeId);
  
  // 1. Check Certification expirations
  const userCerts = certifications.filter(c => c.employeeId === employeeId);
  const expiringCerts = userCerts.filter(c => {
    if (!c.validUntil) return false;
    const daysUntil = (new Date(c.validUntil) - new Date()) / (1000 * 60 * 60 * 24);
    return daysUntil < 60; // Expiring in 60 days
  });

  if (expiringCerts.length > 0) {
    recommendations.push({
      id: `ai_cert_${employeeId}`,
      type: 'compliance',
      title: 'Sertifika Yenileme Yaklaşıyor',
      description: `${expiringCerts.length} adet sertifikanızın süresi 60 günden az kaldı. Yenileme eğitimi veya sınavı planlanmalı.`,
      suggestedAction: 'Yenileme Eğitimi Ata',
      severity: 'high'
    });
  }

  // 2. Check Performance Reviews
  // In demo data, performance evaluation notes might hint at soft skill needs (like communication for Burak Ateş e4)
  if (employeeId === 'e4') {
    recommendations.push({
      id: `ai_perf_${employeeId}`,
      type: 'performance',
      title: 'Performans Geri Bildirimi: İletişim Eksikliği',
      description: 'Son 360 performans değerlendirmesinde "Stres altında iletişim" alanında düşük puanlar alındı. İlgili eğitim yolları önerilir.',
      suggestedAction: 'İletişim Eğitimine Ekle',
      suggestedTrainingId: 'trn_001',
      severity: 'high'
    });
  }

  // 3. Check skill targets
  if (profile && profile.targetSkills && profile.targetSkills.length > 0) {
    const target = profile.targetSkills[0];
    recommendations.push({
      id: `ai_skill_${employeeId}`,
      type: 'development',
      title: 'Kariyer Hedefi: Yetkinlik Gelişimi',
      description: `Hedef yetkinliklerinizden olan yetkinliği geliştirmek için kataloğumuzdaki eğitimlere göz atın.`,
      suggestedAction: 'Kataloğu İncele',
      severity: 'medium'
    });
  }

  return recommendations;
};

/**
 * Calculates organizational training metrics
 */
export const calculateOrgMetrics = (employees, employeeProfiles, catalog, certs) => {
  const totalEmployees = employees.length;
  const trainedEmployees = employeeProfiles.filter(p => p.completedTrainings.length > 0).length;
  
  const complianceRiskCount = certs.filter(c => c.complianceRisk === 'high').length;
  
  // Calculate average development score
  const avgDevScore = employeeProfiles.reduce((acc, curr) => acc + (curr.averageDevelopmentScore || 0), 0) / (employeeProfiles.length || 1);

  return {
    totalTrainings: catalog.length,
    trainedRatio: (trainedEmployees / totalEmployees) * 100,
    complianceRisks: complianceRiskCount,
    avgDevScore: avgDevScore.toFixed(1)
  };
};
