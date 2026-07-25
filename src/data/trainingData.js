export const initialTrainingCatalog = [
  {
    id: 'trn_001',
    title: 'Etkili İletişim ve Çatışma Yönetimi',
    description: 'İş ortamında profesyonel iletişim teknikleri ve zor insanlarla başa çıkma stratejileri.',
    category: 'behavioral',
    subCategory: 'İletişim',
    targetFamilyIds: [], // Boşsa tüm iş aileleri
    targetLevelIds: ['l1', 'l2', 'l3', 'l4'],
    format: 'workshop',
    duration: 16,
    provider: 'İç Eğitmen',
    cost: 0,
    maxParticipants: 15,
    prerequisites: [],
    linkedCompetencyIds: ['lib_c2_hr', 'lib_c1_ldr'],
    linkedSkillIds: [],
    tags: ['iletişim', 'soft-skill', 'çatışma'],
    isActive: true,
    isMandatory: false,
    renewalMonths: null,
  },
  {
    id: 'trn_002',
    title: 'B2B Satış Teknikleri ve İkna Psikolojisi',
    description: 'Kurumsal satış süreçlerinde ihtiyaç analizi, değer önerisi sunma ve itiraz karşılama teknikleri.',
    category: 'technical',
    subCategory: 'Satış',
    targetFamilyIds: ['jf_sales'],
    targetLevelIds: ['l1', 'l2', 'l3'],
    format: 'classroom',
    duration: 24,
    provider: 'SalesMaster Akademi',
    cost: 5000,
    maxParticipants: 20,
    prerequisites: [],
    linkedCompetencyIds: ['lib_c1_sales', 'lib_c2_sales'],
    linkedSkillIds: ['lib_s1_sales'],
    tags: ['satış', 'ikna', 'b2b', 'müşteri'],
    isActive: true,
    isMandatory: false,
    renewalMonths: null,
  },
  {
    id: 'trn_003',
    title: 'İleri Seviye Excel ve Raporlama',
    description: 'Makrolar, pivot tablolar ve veri görselleştirme teknikleri ile verimlilik artışı.',
    category: 'technical',
    subCategory: 'Bilişim / Finans',
    targetFamilyIds: ['jf_finance', 'jf_sales', 'jf_hr'],
    targetLevelIds: ['l2', 'l3'],
    format: 'e_learning',
    duration: 12,
    provider: 'DataCamp',
    cost: 2000,
    maxParticipants: 50,
    prerequisites: [],
    linkedCompetencyIds: [],
    linkedSkillIds: ['lib_s1_fin'],
    tags: ['excel', 'raporlama', 'analiz', 'veri'],
    isActive: true,
    isMandatory: false,
    renewalMonths: null,
  },
  {
    id: 'trn_004',
    title: 'Temel İş Sağlığı ve Güvenliği',
    description: 'Ofis ve üretim ortamlarında uyulması gereken temel İSG kuralları.',
    category: 'mandatory',
    subCategory: 'İSG',
    targetFamilyIds: [],
    targetLevelIds: ['l1', 'l2', 'l3', 'l4', 'l5'],
    format: 'online_live',
    duration: 8,
    provider: 'Sistem OSGB',
    cost: 1500,
    maxParticipants: 100,
    prerequisites: [],
    linkedCompetencyIds: [],
    linkedSkillIds: [],
    tags: ['isg', 'zorunlu', 'güvenlik', 'sağlık'],
    isActive: true,
    isMandatory: true,
    renewalMonths: 12, // Her yıl yenilenmeli
  },
  {
    id: 'trn_005',
    title: 'Stres Altında Kriz Yönetimi',
    description: 'Baskı altında doğru karar verme, duygu regülasyonu ve dayanıklılık (resilience).',
    category: 'behavioral',
    subCategory: 'Kişisel Gelişim',
    targetFamilyIds: [],
    targetLevelIds: ['l2', 'l3', 'l4'],
    format: 'e_learning',
    duration: 4,
    provider: 'İç Eğitmen',
    cost: 0,
    maxParticipants: 999,
    prerequisites: [],
    linkedCompetencyIds: ['lib_c2_prod'],
    linkedSkillIds: [],
    tags: ['stres', 'kriz', 'dayanıklılık'],
    isActive: true,
    isMandatory: false,
    renewalMonths: null,
  },
  {
    id: 'trn_006',
    title: 'Takım Liderliği ve Delegasyon',
    description: 'Yeni yöneticiler için görev dağılımı, geri bildirim verme ve ekip motivasyonu.',
    category: 'behavioral',
    subCategory: 'Liderlik',
    targetFamilyIds: [],
    targetLevelIds: ['l3', 'l4'],
    format: 'workshop',
    duration: 16,
    provider: 'Liderlik Enstitüsü',
    cost: 8000,
    maxParticipants: 12,
    prerequisites: [],
    linkedCompetencyIds: ['lib_c1_ldr', 'lib_c2_ldr'],
    linkedSkillIds: [],
    tags: ['liderlik', 'yönetim', 'delegasyon', 'geri-bildirim'],
    isActive: true,
    isMandatory: false,
    renewalMonths: null,
  }
];

export const initialDevelopmentPlans = [
  {
    id: 'idp_001',
    employeeId: 'e4', // Burak Ateş
    period: '2026-Q2',
    status: 'IN_PROGRESS',
    createdAt: '2026-04-01',
    approvedByManagerId: 'e1',
    goals: [
      {
        id: 'g1',
        title: 'İletişim ve Kriz Yönetimi Becerilerini Güçlendirme',
        source: 'performance',
        sourceRef: 'demo_camp_1', // 360 performans kampanya ID
        priority: 'HIGH',
        timeframe: 'short',
        trainings: ['trn_001', 'trn_005'],
        status: 'IN_PROGRESS',
        managerNote: 'Performans değerlendirmesinde akran ve yönetici geri bildirimleri stres altında iletişimin zayıf olduğunu gösterdi. Öncelikli gelişim alanı.',
        completionEvidence: null
      },
      {
        id: 'g2',
        title: 'Kurumsal Satış Kotalarını Aşma',
        source: 'manual',
        sourceRef: null,
        priority: 'MEDIUM',
        timeframe: 'medium',
        trainings: ['trn_002'],
        status: 'PLANNED',
        managerNote: 'Bu yılki büyük müşteri hedefleri için B2B ikna yeteneklerini keskinleştirmeliyiz.',
        completionEvidence: null
      }
    ],
    aiSuggestions: []
  },
  {
    id: 'idp_002',
    employeeId: 'e2', // Zeynep Çelik
    period: '2026-H1',
    status: 'COMPLETED',
    createdAt: '2026-01-15',
    approvedByManagerId: 'e1',
    goals: [
      {
        id: 'g3',
        title: 'İleri Raporlama Otomasyonu',
        source: 'gap_analysis',
        sourceRef: 'ja2', // İş Analizi ID
        priority: 'MEDIUM',
        timeframe: 'medium',
        trainings: ['trn_003'],
        status: 'COMPLETED',
        managerNote: 'Finansal raporların hızlanması için Excel makro bilgisi gerekiyor.',
        completionEvidence: 'Eğitim başarıyla tamamlandı, raporlama süresi %30 kısaldı.'
      }
    ],
    aiSuggestions: []
  }
];

export const initialTrainingSessions = [
  {
    id: 'sess_001',
    trainingId: 'trn_004', // İSG
    title: 'Şirket Geneli İSG Eğitimi - 1. Grup',
    scheduledDate: '2026-05-20',
    startTime: '09:00',
    endTime: '17:00',
    location: 'Büyük Toplantı Salonu',
    instructorName: 'Kemal Yılmaz (Sistem OSGB)',
    maxCapacity: 30,
    status: 'PLANNED', // PLANNED, IN_PROGRESS, COMPLETED, CANCELLED
    enrollments: [
      { employeeId: 'e1', status: 'ENROLLED', enrolledAt: '2026-05-10', completedAt: null, score: null, feedback: null },
      { employeeId: 'e2', status: 'ENROLLED', enrolledAt: '2026-05-10', completedAt: null, score: null, feedback: null },
      { employeeId: 'e3', status: 'ENROLLED', enrolledAt: '2026-05-10', completedAt: null, score: null, feedback: null },
      { employeeId: 'e4', status: 'ENROLLED', enrolledAt: '2026-05-10', completedAt: null, score: null, feedback: null },
      { employeeId: 'e5', status: 'ENROLLED', enrolledAt: '2026-05-10', completedAt: null, score: null, feedback: null }
    ]
  },
  {
    id: 'sess_002',
    trainingId: 'trn_001', // İletişim
    title: 'Etkili İletişim Workshop - Mayıs Grubu',
    scheduledDate: '2026-05-25',
    startTime: '13:00',
    endTime: '17:00',
    location: 'Eğitim Odası B',
    instructorName: 'Ayşe Danışman',
    maxCapacity: 15,
    status: 'PLANNED',
    enrollments: [
      { employeeId: 'e4', status: 'ENROLLED', enrolledAt: '2026-05-15', completedAt: null, score: null, feedback: null }
    ]
  },
  {
    id: 'sess_003',
    trainingId: 'trn_003', // Excel
    title: 'İleri Excel ve Raporlama (Online)',
    scheduledDate: '2026-04-10',
    startTime: '10:00',
    endTime: '12:00',
    location: 'Zoom',
    instructorName: 'DataCamp',
    maxCapacity: 50,
    status: 'COMPLETED',
    enrollments: [
      { employeeId: 'e2', status: 'COMPLETED', enrolledAt: '2026-04-01', completedAt: '2026-04-10', score: 95, feedback: 'Çok faydalı oldu, hemen uygulamaya başladım.' }
    ]
  }
];
