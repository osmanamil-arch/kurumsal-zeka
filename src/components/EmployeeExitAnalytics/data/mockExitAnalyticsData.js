// src/components/EmployeeExitAnalytics/data/mockExitAnalyticsData.js

// Extension model for employees who have exited
export const initialExitRecords = [
  {
    id: 'exit_1',
    employeeId: 'e_exit_1', // Mevcut e1,e2 vb. dışında, "ayrılmış" olarak mocklanmış çalışanlar
    employeeName: 'Selim Akın',
    departmentId: 'd4',
    departmentName: 'Satış',
    roleId: 't4',
    roleName: 'Satış Uzmanı',
    managerId: 'e2', 
    managerName: 'Zeynep Çelik',
    exitType: 'voluntary',
    exitDate: '2026-04-15',
    reasonCategory: 'Kariyer Fırsatı Eksikliği',
    reasonTags: ['terfi_yok', 'maaş_beklentisi'],
    status: 'completed',
    regrettableLoss: true,
    highPerformer: true
  },
  {
    id: 'exit_2',
    employeeId: 'e_exit_2',
    employeeName: 'Ayşe Yılmaz',
    departmentId: 'd2',
    departmentName: 'Üretim',
    roleId: 't2',
    roleName: 'Üretim Operatörü',
    managerId: 'e5',
    managerName: 'Elif Ay',
    exitType: 'voluntary',
    exitDate: '2026-03-10',
    reasonCategory: 'İş Yükü ve Stres',
    reasonTags: ['mesai', 'tükenmişlik'],
    status: 'completed',
    regrettableLoss: false,
    highPerformer: false
  },
  {
    id: 'exit_3',
    employeeId: 'e_exit_3',
    employeeName: 'Mehmet Can',
    departmentId: 'd5',
    departmentName: 'Finans',
    roleId: 't5',
    roleName: 'Finans Analisti',
    managerId: 'e1',
    managerName: 'Ahmet Yılmaz',
    exitType: 'involuntary',
    exitDate: '2026-02-05',
    reasonCategory: 'Performans Düşüklüğü',
    reasonTags: ['hedef_tutmadı', 'kültür_uyumsuzluğu'],
    status: 'completed',
    regrettableLoss: false,
    highPerformer: false
  }
];

export const initialExitSurveys = [
  {
    id: 'surv_1',
    exitRecordId: 'exit_1',
    surveyDate: '2026-04-10',
    overallSatisfaction: 6,
    managerSatisfaction: 8,
    compensationSatisfaction: 5,
    workloadSatisfaction: 7,
    careerOpportunitySatisfaction: 3,
    cultureSatisfaction: 8,
    workLifeBalance: 7,
    psychologicalSafety: 9,
    recommendationScore: 7,
    rehireWillingness: 'yes',
    openFeedback: 'Ekip ve yöneticimden memnundum ancak şirket içi yükselme şansı göremediğim için dışarıdan gelen teklifi değerlendirdim.'
  },
  {
    id: 'surv_2',
    exitRecordId: 'exit_2',
    surveyDate: '2026-03-05',
    overallSatisfaction: 4,
    managerSatisfaction: 3,
    compensationSatisfaction: 5,
    workloadSatisfaction: 2,
    careerOpportunitySatisfaction: 5,
    cultureSatisfaction: 4,
    workLifeBalance: 3,
    psychologicalSafety: 4,
    recommendationScore: 4,
    rehireWillingness: 'no',
    openFeedback: 'Çok fazla mesai ve dengesiz iş dağılımı vardı.'
  }
];

export const initialExitReasons = [
  { id: 'r1', category: 'Yönetici İlişkisi', weight: 8, relatedDimension: 'managerSatisfaction' },
  { id: 'r2', category: 'Ücret / Yan Hak Algısı', weight: 9, relatedDimension: 'compensationSatisfaction' },
  { id: 'r3', category: 'Kariyer Gelişimi Eksikliği', weight: 9, relatedDimension: 'careerOpportunitySatisfaction' },
  { id: 'r4', category: 'İş Yükü ve Stres', weight: 7, relatedDimension: 'workloadSatisfaction' },
  { id: 'r5', category: 'Kültür Uyumsuzluğu', weight: 6, relatedDimension: 'cultureSatisfaction' },
  { id: 'r6', category: 'Rol Belirsizliği', weight: 6, relatedDimension: 'psychologicalSafety' }
];

export const initialRiskSignals = [
  {
    id: 'rs_1',
    employeeId: 'e4', // Burak Ateş
    source: 'performance_dev',
    signal: 'Performans iyi, gelişim yetersiz',
    riskLevel: 'high',
    explanation: 'Çalışan yüksek performans sergiliyor ancak kariyer hedefi için gerekli yetkinliklerde eksikliği var ve gelişim planı ilerlemiyor.'
  },
  {
    id: 'rs_2',
    employeeId: 'e3', // Can Kaya
    source: 'workload_tenure',
    signal: 'İlk yıl yüksek iş yükü',
    riskLevel: 'medium',
    explanation: 'İşe gireli 6 aydan kısa süre olmasına rağmen fazla mesai oranları yüksek, erken ayrılma riski barındırıyor.'
  }
];
