// src/components/EngagementModule/data/mockEngagementData.js

// Extension model for psychometric profiles (DISC based)
export const initialPsychometricProfiles = [
  {
    employeeId: 'e1', // Ahmet Yılmaz (Manager)
    discType: 'D', // Dominant
    discName: 'Dominant (Kırmızı)',
    color: '#ef4444',
    traits: ['Sonuç odaklı', 'Kararlı', 'Doğrudan', 'Rekabetçi'],
    communicationAdvice: 'Hedeflerden ve sonuçlardan bahsedin. Kısa ve net konuşun. Detaylarda boğulmayın.',
    conflictRisk: 'Aşırı baskıcı algılanabilir. Karşıt görüşlere tahammülü düşük olabilir.',
    motivators: ['Güç', 'Başarı', 'Otorite']
  },
  {
    employeeId: 'e2', // Zeynep Çelik (Satış Müdürü)
    discType: 'I', // Influence
    discName: 'İz Bırakan / Etkileyici (Sarı)',
    color: '#f59e0b',
    traits: ['Dışa dönük', 'İkna edici', 'İyimser', 'Sosyal'],
    communicationAdvice: 'Sohbet havasında iletişim kurun. Fikirlerini takdir edin ve dinleyin. Katı kurallarla sıkmayın.',
    conflictRisk: 'Detayları atlayabilir, dağınık görünebilir. Odaklanma sorunları yaşayabilir.',
    motivators: ['Sosyal Takdir', 'Popülarite', 'Esneklik']
  },
  {
    employeeId: 'e3', // Can Kaya (Yazılım)
    discType: 'C', // Compliance
    discName: 'Ciddi / Analitik (Mavi)',
    color: '#3b82f6',
    traits: ['Detaycı', 'Analitik', 'Sistematik', 'Mükemmeliyetçi'],
    communicationAdvice: 'Veri ve mantıkla yaklaşın. Yazılı iletişim tercih edin. Sürprizlerden kaçının.',
    conflictRisk: 'Aşırı eleştirel olabilir. Risk almaktan kaçınır.',
    motivators: ['Kesinlik', 'Kalite', 'Uzmanlık']
  },
  {
    employeeId: 'e4', // Burak Ateş (Satış Uzmanı)
    discType: 'I', 
    discName: 'İz Bırakan / Etkileyici (Sarı)',
    color: '#f59e0b',
    traits: ['İletişimi güçlü', 'Enerjik', 'Girişken'],
    communicationAdvice: 'Motivasyonunu yüksek tutmak için sık sık övün.',
    conflictRisk: 'E2(Zeynep) ile iyi anlaşır ancak C tipi kişilerle çatışabilir.',
    motivators: ['Esneklik', 'Yeni insanlarla tanışma']
  },
  {
    employeeId: 'e5', // Elif Ay (Üretim)
    discType: 'S', // Steadiness
    discName: 'Sadık / İstikrarlı (Yeşil)',
    color: '#10b981',
    traits: ['Sabırlı', 'Uyumlu', 'Takım oyuncusu', 'Destekleyici'],
    communicationAdvice: 'Güven verin ve ani değişikliklerden kaçının. Samimi ve sıcak bir dil kullanın.',
    conflictRisk: 'Hayır demekte zorlanır. Değişime direnç gösterebilir.',
    motivators: ['Güvenlik', 'Ekip Ruhu', 'Rutin']
  }
];

export const initialPulseSurveys = [
  {
    id: 'ps_1',
    title: 'Nisan Ayı Motivasyon Nabzı',
    date: '2026-04-20',
    participationRate: 85,
    eNps: 42, // eNPS score (-100 to 100)
    avgScore: 7.8, // out of 10
    topArea: 'Ekip İçi Dayanışma',
    bottomArea: 'İş Yükü Dağılımı'
  },
  {
    id: 'ps_2',
    title: 'Mart Ayı Motivasyon Nabzı',
    date: '2026-03-20',
    participationRate: 92,
    eNps: 38,
    avgScore: 7.5,
    topArea: 'Yönetici İletişimi',
    bottomArea: 'Kariyer Olanakları'
  }
];

export const initialKudosFeed = [
  {
    id: 'k1',
    fromEmployeeId: 'e1',
    fromEmployeeName: 'Ahmet Yılmaz',
    toEmployeeId: 'e3',
    toEmployeeName: 'Can Kaya',
    valueTag: 'Sürekli Gelişim',
    message: 'Yeni ERP entegrasyonu projesinde gösterdiğin analitik derinlik ve sıfır hata odaklı çalışman için çok teşekkürler! Ekipe büyük değer kattın.',
    likes: 12,
    comments: 2,
    date: '2 Saat Önce',
    badge: '🏆'
  },
  {
    id: 'k2',
    fromEmployeeId: 'e4',
    fromEmployeeName: 'Burak Ateş',
    toEmployeeId: 'e2',
    toEmployeeName: 'Zeynep Çelik',
    valueTag: 'Müşteri Odaklılık',
    message: 'Bugünkü müşteri sunumunda harika bir enerji yakaladın, satış kapatmamızda etkin büyük. Desteklerin için sağol Zeynep!',
    likes: 24,
    comments: 5,
    date: 'Dün',
    badge: '🤝'
  },
  {
    id: 'k3',
    fromEmployeeId: 'e5',
    fromEmployeeName: 'Elif Ay',
    toEmployeeId: 'e4',
    toEmployeeName: 'Burak Ateş',
    valueTag: 'Ekip Ruhu',
    message: 'Dünkü üretim krizinde sahaya inip bize destek verdiğin için teşekkürler. Harika bir dayanışma örneğiydi.',
    likes: 8,
    comments: 0,
    date: '2 Gün Önce',
    badge: '❤️'
  }
];

export const initialClubs = [
  { id: 'c1', name: 'KOBİ Doğa Yürüyüşü Kulübü', targetDisc: ['I', 'S'], memberCount: 15, nextEvent: 'Belgrad Ormanı Trekking (Cumartesi)' },
  { id: 'c2', name: 'Satranç ve Strateji', targetDisc: ['C', 'D'], memberCount: 8, nextEvent: 'Çevrimiçi Turnuva (Cuma)' },
  { id: 'c3', name: 'İnovasyon ve Fikir Atölyesi', targetDisc: ['D', 'I'], memberCount: 12, nextEvent: 'Aylık Fikir Maratonu (Haftaya)' }
];
