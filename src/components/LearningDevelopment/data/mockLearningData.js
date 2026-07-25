// src/components/LearningDevelopment/data/mockLearningData.js

export const initialLearningPaths = [
  {
    id: 'lp_001',
    title: 'Yeni Yönetici Gelişim Yolu',
    targetRole: 'l4', // L4 - Müdür
    targetGrade: 'M1',
    steps: [
      { stepId: 's1', trainingId: 'trn_006', isMandatory: true, order: 1 }, // Takım Liderliği
      { stepId: 's2', trainingId: 'trn_001', isMandatory: true, order: 2 }, // İletişim
      { stepId: 's3', trainingId: 'trn_005', isMandatory: false, order: 3 }, // Kriz Yönetimi
    ],
    estimatedDuration: 36, // saat
    linkedSkills: [],
    completionRate: 0
  },
  {
    id: 'lp_002',
    title: 'Satış Uzmanı Onboarding (B2B)',
    targetRole: 't4', // Satış Uzmanı
    targetGrade: 'S1',
    steps: [
      { stepId: 's1', trainingId: 'trn_004', isMandatory: true, order: 1 }, // İSG
      { stepId: 's2', trainingId: 'trn_002', isMandatory: true, order: 2 }, // B2B Satış
    ],
    estimatedDuration: 32, // saat
    linkedSkills: ['lib_s1_sales'],
    completionRate: 0
  }
];

export const initialCertifications = [
  {
    id: 'cert_001',
    employeeId: 'e2', // Zeynep Çelik
    title: 'SMMM',
    linkedSkill: 'lib_cert1_fin',
    validUntil: '2026-12-31',
    renewalRequired: true,
    complianceRisk: 'low'
  },
  {
    id: 'cert_002',
    employeeId: 'e5', // Elif Ay
    title: 'Yalın Üretim Uzmanlığı / 6 Sigma',
    linkedSkill: 'lib_cert1_prod',
    validUntil: '2026-06-15',
    renewalRequired: true,
    complianceRisk: 'high' // Sona ermeye çok az kalmış (yaklaşık 1 ay)
  },
  {
    id: 'cert_003',
    employeeId: 'e4', // Burak Ateş
    title: 'İleri B2B Müzakere',
    linkedSkill: 'lib_s1_sales',
    validUntil: '2028-01-01',
    renewalRequired: false,
    complianceRisk: 'low'
  }
];

export const initialAssessments = [
  {
    id: 'ass_001',
    title: 'B2B Satış Teknikleri Sınavı',
    linkedTraining: 'trn_002',
    questionCount: 20,
    passingScore: 70,
    attemptsAllowed: 3,
    averageScore: 78,
    employeeResults: [
      { employeeId: 'e4', score: 85, status: 'PASSED', attempt: 1 },
      { employeeId: 'e1', score: 65, status: 'FAILED', attempt: 1 }
    ]
  },
  {
    id: 'ass_002',
    title: 'İSG Değerlendirmesi',
    linkedTraining: 'trn_004',
    questionCount: 15,
    passingScore: 80,
    attemptsAllowed: 2,
    averageScore: 92,
    employeeResults: [
      { employeeId: 'e2', score: 100, status: 'PASSED', attempt: 1 },
      { employeeId: 'e3', score: 95, status: 'PASSED', attempt: 1 }
    ]
  }
];

// Employee Learning Profile (Extends Employee model)
export const initialEmployeeLearningProfiles = [
  {
    employeeId: 'e1', // Ahmet Yılmaz (Genel Müdür)
    currentSkills: [
      { id: 'lib_s1_it', level: 3 },
      { id: 'lib_s1_sales', level: 5 }
    ],
    targetSkills: [
      { id: 'lib_s1_it', level: 4 }
    ],
    activePathIds: [],
    completedTrainings: ['trn_001', 'trn_006'],
    averageDevelopmentScore: 88
  },
  {
    employeeId: 'e4', // Burak Ateş (Satış Uzmanı)
    currentSkills: [
      { id: 'lib_s1_sales', level: 3 },
      { id: 'lib_s2_sales', level: 4 }
    ],
    targetSkills: [
      { id: 'lib_s1_sales', level: 5 } // Hedef: İleri seviye B2B
    ],
    activePathIds: ['lp_002'],
    completedTrainings: ['trn_004'],
    averageDevelopmentScore: 65 // Soft skill (iletişim) sorunlarından ötürü düşük
  },
  {
    employeeId: 'e2', // Zeynep Çelik
    currentSkills: [
      { id: 'lib_s1_fin', level: 4 }, // Excel
      { id: 'lib_s2_fin', level: 3 }
    ],
    targetSkills: [
      { id: 'lib_s1_fin', level: 5 } // Makro / Otomasyon hedefi
    ],
    activePathIds: [],
    completedTrainings: ['trn_003', 'trn_004'],
    averageDevelopmentScore: 92
  }
];
