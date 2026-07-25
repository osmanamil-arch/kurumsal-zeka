export const jobFamilies = [
  { id: 'F01', name: 'Satış & Pazarlama', icon: '📈' },
  { id: 'F02', name: 'İnsan Kaynakları', icon: '👥' },
  { id: 'F03', name: 'Bilgi Teknolojileri', icon: '💻' },
  { id: 'F04', name: 'Üretim & Operasyon', icon: '🏭' },
  { id: 'F05', name: 'Finans & Muhasebe', icon: '📊' }
];

export const jobDescriptions = [
  {
    id: 'pos_satis_uzmani',
    title: 'Satış Uzmanı',
    familyId: 'F01',
    level: 'Uzman Başlangıç - L2',
    reportsTo: 'Satış Müdürü',
    description: 'Şirketin stratejik satış hedefleri doğrultusunda müşteri portföyünü yönetmek ve yeni pazar fırsatları yaratarak ciro hedeflerini gerçekleştirmek.',
    responsibilities: [
      'Bölgesel satış hedeflerine ulaşmak için günlük müşteri ziyaretleri planlamak ve gerçekleştirmek',
      'Mevcut müşteri ilişkilerini derinleştirmek ve up-sell/cross-sell fırsatlarını değerlendirmek',
      'Müşteri şikayet ve taleplerini CRM üzerinden yöneterek hızlı çözüm sağlamak',
      'Aylık ve çeyreklik satış raporlarını yönetime sunmak'
    ],
    requirements: {
      education: 'Lisans Mezunu (İşletme, İktisat, Mühendislik vb.)',
      experience: '2-4 Yıl Saha Satış Deneyimi',
      languages: ['İngilizce (Orta-İleri)'],
      certifications: ['B Sınıfı Ehliyet (Aktif Sürüş)']
    },
    workConditions: 'Aktif Saha / %70 Dışarıda, %30 Ofis',
    competencies: [
      { name: 'İletişim ve Etki', value: 95 },
      { name: 'İkna Kabiliyeti', value: 90 },
      { name: 'Müşteri Odaklılık', value: 85 },
      { name: 'Sonuç Odaklılık', value: 80 },
      { name: 'Problem Çözme', value: 70 },
      { name: 'Esneklik ve Uyum', value: 75 }
    ],
    kpis: [
      'Satış Kotası Gerçekleşme Oranı (%)',
      'Yeni Kazanılan Müşteri Sayısı',
      'Müşteri Elde Tutma Skoru (Retention)',
      'Sales Pipeline Dönüşüm Oranı'
    ],
    recommendedTests: ['dikkat_reaksiyon', 'ikna_satis', 'kisilik_big5']
  },
  {
    id: 'pos_ik_uzmani',
    title: 'İnsan Kaynakları Uzmanı',
    familyId: 'F02',
    level: 'Uzman - L3',
    reportsTo: 'İnsan Kaynakları Direktörü',
    description: 'Şirketin işe alım, eğitim, performans yönetimi ve çalışan bağlılığı süreçlerini yürüterek genel İK stratejilerine katkıda bulunmak.',
    responsibilities: [
      'Norm kadro planı doğrultusunda uçtan uca işe alım süreçlerini (ilan, mülakat, teklif) yönetmek',
      'Aday değerlendirme testlerini (Psikometrik/Genel Yetenek) organize etmek',
      'Çalışan memnuniyeti ve eNPS anketlerini düzenleyerek aksiyon planları oluşturmak',
      'Performans değerlendirme sisteminin periyodik işleyişini sağlamak'
    ],
    requirements: {
      education: 'Lisans Mezunu (Psikoloji, Sosyoloji, İK veya İİBF)',
      experience: '3-5 Yıl İK Operasyonları',
      languages: ['İngilizce (İleri seviye)']
    },
    workConditions: 'Ofis Merkezi / Hibrit (%40 Remote)',
    competencies: [
      { name: 'Empati ve Duygusal Zeka', value: 90 },
      { name: 'Gizlilik ve Etik', value: 95 },
      { name: 'Problem Çözme', value: 80 },
      { name: 'Analitik Düşünme', value: 75 },
      { name: 'Planlama/Organize Etme', value: 85 },
      { name: 'Çatışma Yönetimi', value: 80 }
    ],
    kpis: [
      'Pozisyon Kapatma Süresi (Time-to-Hire)',
      'Yeni İşe Alınanların 1 Yıllık Elde Tutulma Oranı (Retention)',
      'Çalışan Memnuniyet Skoru (eNPS)'
    ],
    recommendedTests: ['kisilik_big5', 'duygusal_zeka', 'dikkat_stroop']
  },
  {
    id: 'pos_frontend_dev',
    title: 'Frontend Geliştirici (React)',
    familyId: 'F03',
    level: 'Kıdemli (Senior) - L4',
    reportsTo: 'Yazılım Mimarı',
    description: 'Kullanıcı dostu, modern ve yüksek performanslı web arayüzleri geliştirmek ve kullanıcı deneyimini optimize etmek.',
    responsibilities: [
      'UI/UX tasarımlarını (Figma) React ve modern CSS yaklaşımları ile kodlamak',
      'RESTful ve GraphQL API entegrasyonlarını sorunsuz gerçekleştirmek',
      'Kod kalitesini yüksek tutmak için Unit/Integration testleri yazmak',
      'Junior geliştiricilere kod incelemesi (Code Review) yapmak ve mentorluk vermek'
    ],
    requirements: {
      education: 'Bilgisayar/Yazılım Mühendisliği, veya ilgili teknik alan',
      experience: '5+ Yıl Frontend Geliştirme (En az 3 yıl React)',
      languages: ['İngilizce (Teknik döküman/iletişim)'],
      certifications: []
    },
    workConditions: 'Uzaktan (Tam Remote)',
    competencies: [
      { name: 'Teknik Uzmanlık', value: 95 },
      { name: 'Analitik Düşünme', value: 90 },
      { name: 'Detay Odaklılık', value: 85 },
      { name: 'Takım Çalışması', value: 80 },
      { name: 'Öğrenme Çevikliği', value: 90 },
      { name: 'Problem Çözme', value: 90 }
    ],
    kpis: [
      'Sprint Hedeflerine Ulaşma Oranı',
      'Bugsız (Zero-Defect) Kod Dağıtımı / Hata Oranı',
      'Performans (Lighthouse) Skorları',
      'Code Review Geri Dönüş Süresi'
    ],
    recommendedTests: ['kodlama_react', 'algoritma_analitik', 'dikkat_farkindalik']
  },
  {
    id: 'pos_üretim_op',
    title: 'Üretim Hattı Operatörü',
    familyId: 'F04',
    level: 'Teknisyen / Operatör - L1',
    reportsTo: 'Vardiya Amiri',
    description: 'Üretim bandında belirlenen standartlara ve kalite kurallarına uygun şekilde, güvenlik protokollerini izleyerek üretim faaliyetlerini sürdürmek.',
    responsibilities: [
      'Üretim makinelerini standart kullanım (SOP) talimatlarına göre çalıştırmak',
      'Rutin bakım ve temizlik prosedürlerini uygulamak',
      'ISG (İş Sağlığı ve Güvenliği) kurallarına eksiksiz uymak',
      'Hatalı veya kusurlu ürünleri tespit edip raporlamak'
    ],
    requirements: {
      education: 'Meslek Lisesi veya Ön Lisans Mekatronik, Makine vb.',
      experience: '0-2 Yıl Fabrika/Üretim deneyimi',
      languages: [],
      certifications: ['ISG Temel Eğitimi Semineri Katılımı']
    },
    workConditions: 'Fabrika Üretim Sahası / Vardiyalı Çalışma',
    competencies: [
      { name: 'Kurallara Uyum', value: 95 },
      { name: 'Dikkat ve Odaklanma', value: 90 },
      { name: 'Fiziksel Dayanıklılık', value: 85 },
      { name: 'Takım Çalışması', value: 80 },
      { name: 'Stres Yönetimi', value: 70 },
      { name: 'Zaman Yönetimi', value: 75 }
    ],
    kpis: [
      'İş Kazası Yaşamama Süresi',
      'Üretim Fire (Hurdalık) Oranı',
      'Vardiya Başına Hedef Adet Üretimi'
    ],
    recommendedTests: ['dikkat_surekli', 'motor_beceri', 'isg_farkindalik']
  }
];
