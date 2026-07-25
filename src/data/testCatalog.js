// ═══════════════════════════════════════════════════════════════
// ADAY DEĞERLENDİRME SİSTEMİ — ANA TEST KATALOGU
// 5 Grup, 67 Test — Tüm test tanımları ve metadata
// ═══════════════════════════════════════════════════════════════

export const TEST_GROUPS = {
  psikometrik: {
    id: 'psikometrik',
    title: 'Psikometrik Testler',
    icon: '🎭',
    color: '#7C3AED',
    description: 'Adayın kişiliğini, psikolojik özelliklerini ve eğilimlerini ölçer.',
    question: '"Bu kişi KİM?"',
  },
  yetenek: {
    id: 'yetenek',
    title: 'Yetenek Testleri',
    icon: '🧠',
    color: '#2563EB',
    description: 'Bilişsel kapasite, algısal hız ve mental performansı ölçer.',
    question: '"Bu kişi NE KADAR yapabilir?"',
  },
  mesleki_bilgi: {
    id: 'mesleki_bilgi',
    title: 'Mesleki Bilgi Testleri',
    icon: '📚',
    color: '#059669',
    description: 'Pozisyona özel teknik bilgi ve mesleki yeterliliği ölçer.',
    question: '"Bu kişi NE BİLİR?"',
  },
  senaryo: {
    id: 'senaryo',
    title: 'Senaryo & Simülasyon Testleri',
    icon: '🎬',
    color: '#DC2626',
    description: 'Gerçek iş durumlarında karar verme ve davranışı ölçer.',
    question: '"Bu kişi NE YAPAR?"',
  },
  pozisyon_bazli: {
    id: 'pozisyon_bazli',
    title: 'Pozisyon Bazlı Testler',
    icon: '🏢',
    color: '#D97706',
    description: 'Fonksiyonel alan uzmanlığını ve pozisyona özel bilgiyi ölçer.',
    question: '"Alan uzmanlığı ne düzeyde?"',
  },
};

// ═══════════════════════════════════════════════════════════════
// GRUP 1: PSİKOMETRİK TESTLER
// ═══════════════════════════════════════════════════════════════
const psikometrikTests = [
  {
    id: 'kisilik_big5',
    group: 'psikometrik',
    title: 'Kişilik Envanteri (Big Five)',
    subtitle: '5 Faktör Kişilik Modeli',
    icon: '🎭',
    questionCount: 30,
    estimatedMinutes: 8,
    format: 'likert',
    dimensions: ['Duygusal Dengelilik', 'Dışa Dönüklük', 'Deneyime Açıklık', 'Yumuşak Başlılık', 'Sorumluluk'],
    reliability: 0.85,
    description: 'Big Five kişilik modeline dayalı 5 boyutlu kişilik değerlendirmesi.',
    hasReverseItems: true,
  },
  {
    id: 'duygusal_zeka',
    group: 'psikometrik',
    title: 'Duygusal Zeka (EQ) Envanteri',
    subtitle: 'Goleman Modeli',
    icon: '💡',
    questionCount: 25,
    estimatedMinutes: 7,
    format: 'likert',
    dimensions: ['Öz Farkındalık', 'Öz Yönetim', 'Empati', 'Sosyal Beceri', 'Motivasyon'],
    reliability: 0.82,
    description: 'Duygusal zeka düzeyini 5 boyutta ölçen envanter.',
    hasReverseItems: true,
  },
  {
    id: 'is_motivasyonu',
    group: 'psikometrik',
    title: 'İş Motivasyonu Ölçeği',
    subtitle: 'Motivasyon Profili',
    icon: '🔥',
    questionCount: 20,
    estimatedMinutes: 5,
    format: 'likert',
    dimensions: ['İçsel Motivasyon', 'Dışsal Motivasyon', 'Başarı Motivasyonu', 'Ait Olma İhtiyacı', 'Özerklik İhtiyacı'],
    reliability: 0.80,
    description: 'Adayın motivasyon kaynaklarını ve iş bağlılık potansiyelini ölçer.',
    hasReverseItems: true,
  },
  {
    id: 'stres_basa_cikma',
    group: 'psikometrik',
    title: 'Stresle Başa Çıkma Ölçeği',
    subtitle: 'Coping Stratejileri',
    icon: '😰',
    questionCount: 20,
    estimatedMinutes: 5,
    format: 'likert',
    dimensions: ['Problem Odaklı Çözüm', 'Sosyal Destek Arama', 'Kaçınma/Erteleme', 'Duygusal Tepki', 'Olumlu Yeniden Yorumlama'],
    reliability: 0.78,
    description: 'Baskı altında hangi başa çıkma stratejilerinin kullanıldığını ölçer.',
    hasReverseItems: false,
  },
  {
    id: 'takim_rolu',
    group: 'psikometrik',
    title: 'Takım Rolü Envanteri',
    subtitle: 'Belbin Modeli',
    icon: '🤝',
    questionCount: 28,
    estimatedMinutes: 8,
    format: 'forced_choice',
    dimensions: ['Koordinatör', 'Uygulayıcı', 'Mükemmeliyetçi', 'Kaynak Araştırıcı', 'Takım Çalışanı', 'Şekillendirici', 'Bitirici', 'Uzman'],
    reliability: 0.79,
    description: 'Ekip içinde üstlenilen doğal rolü belirler.',
    hasReverseItems: false,
  },
  {
    id: 'is_guvenligi_tutum',
    group: 'psikometrik',
    title: 'İş Güvenliği Tutum Ölçeği',
    subtitle: 'Güvenlik Kültürü',
    icon: '🛡️',
    questionCount: 20,
    estimatedMinutes: 5,
    format: 'likert',
    dimensions: ['Risk Algısı', 'Kural Uyumu', 'Güvenlik Sorumluluğu', 'Raporlama İstekliliği'],
    reliability: 0.81,
    description: 'İş güvenliği kültürüne uyum ve güvenlik bilinç düzeyini ölçer.',
    hasReverseItems: true,
  },
  {
    id: 'is_degerleri',
    group: 'psikometrik',
    title: 'İş Değerleri Envanteri',
    subtitle: 'Kariyer Değerleri',
    icon: '💎',
    questionCount: 24,
    estimatedMinutes: 6,
    format: 'ranking',
    dimensions: ['Güvenlik', 'Başarı', 'Bağımsızlık', 'Sosyal Fayda', 'Çalışma Koşulları', 'Yaratıcılık'],
    reliability: 0.77,
    description: 'Kariyer kararlarını yönlendiren temel değerleri ortaya koyar.',
    hasReverseItems: false,
  },
  {
    id: 'ogrenme_stili',
    group: 'psikometrik',
    title: 'Öğrenme Stili Testi',
    subtitle: 'VARK Modeli',
    icon: '📖',
    questionCount: 16,
    estimatedMinutes: 4,
    format: 'scenario_choice',
    dimensions: ['Görsel', 'İşitsel', 'Kinestetik', 'Okuma/Yazma'],
    reliability: 0.76,
    description: 'En verimli öğrenme yöntemini belirler.',
    hasReverseItems: false,
  },
];

// ═══════════════════════════════════════════════════════════════
// GRUP 2: YETENEK TESTLERİ
// ═══════════════════════════════════════════════════════════════
const yetenekTests = [
  // Bilişsel
  { id: 'genel_kultur', group: 'yetenek', subGroup: 'Bilişsel', title: 'Genel Kültür', icon: '🌍', questionCount: 15, estimatedMinutes: 5, format: 'mcq', description: 'Genel bilgi birikimi ve dünyayı anlama.' },
  { id: 'temel_matematik', group: 'yetenek', subGroup: 'Bilişsel', title: 'Temel Matematik', icon: '🔢', questionCount: 15, estimatedMinutes: 6, format: 'mcq', description: 'Matematiksel kavramları anlama ve uygulama.' },
  { id: 'sayisal_akil_yurutme', group: 'yetenek', subGroup: 'Bilişsel', title: 'Sayısal Akıl Yürütme', icon: '📐', questionCount: 15, estimatedMinutes: 6, format: 'mcq', description: 'Sayısal problemleri çözme yeteneği.' },
  { id: 'oruntu_takibi', group: 'yetenek', subGroup: 'Bilişsel', title: 'Örüntü Takibi', icon: '🧩', questionCount: 15, estimatedMinutes: 5, format: 'mcq', description: 'Desenleri ve sıraları anlama.' },
  { id: 'sozel_akil_yurutme', group: 'yetenek', subGroup: 'Bilişsel', title: 'Sözel Akıl Yürütme', icon: '📝', questionCount: 15, estimatedMinutes: 5, format: 'mcq', description: 'Dil kullanarak mantıksal çıkarımlar.' },
  { id: 'yonerge_takibi', group: 'yetenek', subGroup: 'Bilişsel', title: 'Yönerge Takibi', icon: '📋', questionCount: 15, estimatedMinutes: 5, format: 'mcq', description: 'Talimatları anlama ve uygulama.' },
  // Dikkat
  { id: 'dikkat_sembol', group: 'yetenek', subGroup: 'Dikkat', title: 'Sembol Arama', icon: '🔍', questionCount: 9, estimatedMinutes: 4, format: 'interactive', description: 'Hedef sembolü hızla bulma.' },
  { id: 'dikkat_stroop', group: 'yetenek', subGroup: 'Dikkat', title: 'Stroop Testi', icon: '🎨', questionCount: 9, estimatedMinutes: 4, format: 'interactive', description: 'Renk-kelime uyumsuzluğunda odaklanma.' },
  { id: 'dikkat_reaksiyon', group: 'yetenek', subGroup: 'Dikkat', title: 'Reaksiyon Zamanı', icon: '⚡', questionCount: 9, estimatedMinutes: 4, format: 'interactive', description: 'Tepki hızı ölçümü.' },
  { id: 'dikkat_gonogo', group: 'yetenek', subGroup: 'Dikkat', title: 'Go / No-Go', icon: '🚦', questionCount: 9, estimatedMinutes: 4, format: 'interactive', description: 'Dürtü kontrolü ve inhibisyon.' },
  // Görsel-Uzaysal
  { id: 'gorsel_farkli', group: 'yetenek', subGroup: 'Görsel-Uzaysal', title: 'Farklı Olanı Bul', icon: '👁️', questionCount: 9, estimatedMinutes: 4, format: 'interactive', description: 'Görsel ayırt edicilik.' },
  { id: 'gorsel_dondurme', group: 'yetenek', subGroup: 'Görsel-Uzaysal', title: 'Zihinsel Döndürme', icon: '🔄', questionCount: 9, estimatedMinutes: 4, format: 'interactive', description: 'Uzaysal düşünme yeteneği.' },
  // Mekanik Yetenek
  { id: 'mekanik_disli', group: 'yetenek', subGroup: 'Mekanik Yetenek', title: 'Dişli & Kasnak', icon: '⚙️', questionCount: 10, estimatedMinutes: 4, format: 'visual_mcq', description: 'Mekanik prensipleri anlama.' },
  { id: 'mekanik_kaldirac', group: 'yetenek', subGroup: 'Mekanik Yetenek', title: 'Kaldıraç & Denge', icon: '⚖️', questionCount: 10, estimatedMinutes: 4, format: 'visual_mcq', description: 'Fizik prensipleri uygulama.' },
  { id: 'mekanik_devre', group: 'yetenek', subGroup: 'Mekanik Yetenek', title: 'Devre Tamamlama', icon: '🔌', questionCount: 10, estimatedMinutes: 4, format: 'visual_mcq', description: 'Elektrik devresi anlama.' },
];

// ═══════════════════════════════════════════════════════════════
// GRUP 3: MESLEKİ BİLGİ TESTLERİ (Mavi Yaka)
// ═══════════════════════════════════════════════════════════════
const meslekiBilgiTests = [
  { id: 'mb_mekanik', group: 'mesleki_bilgi', title: 'Mekanik Bilgi Testi', icon: '🔧', questionCount: 25, estimatedMinutes: 10, format: 'mcq', description: 'Motor, fren, şanzıman, bakım prosedürleri.', targetPositions: ['Mekanik Teknisyen', 'Mekanik Formen'] },
  { id: 'mb_elektrik', group: 'mesleki_bilgi', title: 'Elektrik-Elektronik Bilgi', icon: '⚡', questionCount: 25, estimatedMinutes: 10, format: 'mcq', description: 'Devre şemaları, sensörler, OBD kodları.', targetPositions: ['Elektrik Teknisyeni'] },
  { id: 'mb_kaporta', group: 'mesleki_bilgi', title: 'Kaporta Bilgi Testi', icon: '🛠️', questionCount: 25, estimatedMinutes: 10, format: 'mcq', description: 'Panel onarım, kaynak, yapısal hasar.', targetPositions: ['Kaporta Teknisyeni', 'Kaporta Formeni'] },
  { id: 'mb_boya', group: 'mesleki_bilgi', title: 'Boya Bilgi Testi', icon: '🎨', questionCount: 25, estimatedMinutes: 10, format: 'mcq', description: 'Renk karışımı, yüzey hazırlık, uygulama.', targetPositions: ['Boya Teknisyeni', 'Boya Formeni'] },
  { id: 'mb_yedek_parca', group: 'mesleki_bilgi', title: 'Yedek Parça Yönetimi', icon: '📦', questionCount: 20, estimatedMinutes: 8, format: 'mcq', description: 'Katalog, parça numaralandırma, stok.', targetPositions: ['Yedek Parça Elemanı'] },
  { id: 'mb_isg', group: 'mesleki_bilgi', title: 'İş Sağlığı ve Güvenliği', icon: '⛑️', questionCount: 25, estimatedMinutes: 10, format: 'mcq', description: 'İSG kuralları, KKD, acil durum.', targetPositions: ['Tüm Pozisyonlar'] },
  { id: 'mb_kalite_kontrol', group: 'mesleki_bilgi', title: 'Kalite Kontrol', icon: '✅', questionCount: 20, estimatedMinutes: 8, format: 'mcq', description: 'Ölçüm aletleri, kontrol noktaları.', targetPositions: ['Teknisyen', 'Formen'] },
  { id: 'mb_teknik_dokuman', group: 'mesleki_bilgi', title: 'Teknik Doküman Okuma', icon: '📄', questionCount: 20, estimatedMinutes: 8, format: 'visual_mcq', description: 'Teknik şema, çizim, iş emri okuma.', targetPositions: ['Tüm Teknik Pozisyonlar'] },
];

// ═══════════════════════════════════════════════════════════════
// GRUP 4: SENARYO & SİMÜLASYON TESTLERİ
// ═══════════════════════════════════════════════════════════════
const senaryoTests = [
  { id: 'sn_ariza_teshis', group: 'senaryo', title: 'Arıza Teşhis Senaryoları', icon: '🔎', questionCount: 8, estimatedMinutes: 10, format: 'scenario_decision', description: 'Belirtilerden arızayı tespit etme.' },
  { id: 'sn_musteri_iletisim', group: 'senaryo', title: 'Müşteri İletişim Senaryoları', icon: '💬', questionCount: 8, estimatedMinutes: 8, format: 'scenario_choice', description: 'Zor müşteri durumlarında tepki.' },
  { id: 'sn_onceliklendirme', group: 'senaryo', title: 'Önceliklendirme Görevi', icon: '📊', questionCount: 5, estimatedMinutes: 6, format: 'ranking', description: 'Acil iş emirlerini doğru sıralama.' },
  { id: 'sn_is_guvenligi', group: 'senaryo', title: 'İş Güvenliği Simülasyonu', icon: '🚨', questionCount: 6, estimatedMinutes: 6, format: 'scenario_visual', description: 'Tehlike tanıma ve doğru aksiyon.' },
  { id: 'sn_ekip_catisma', group: 'senaryo', title: 'Ekip Çatışma Senaryosu', icon: '⚔️', questionCount: 6, estimatedMinutes: 6, format: 'scenario_choice', description: 'Çatışma durumunda yaklaşım.' },
  { id: 'sn_etik_ikilem', group: 'senaryo', title: 'Etik İkilem Senaryoları', icon: '⚖️', questionCount: 6, estimatedMinutes: 6, format: 'scenario_choice', description: 'İş etiği kararları.' },
];

// ═══════════════════════════════════════════════════════════════
// GRUP 5: POZİSYON BAZLI TESTLER (Beyaz Yaka)
// ═══════════════════════════════════════════════════════════════
const pozisyonBazliTests = [
  // A. Finans & Muhasebe
  { id: 'pb_genel_muhasebe', group: 'pozisyon_bazli', subGroup: 'Finans & Muhasebe', title: 'Genel Muhasebe', subtitle: 'Tek Düzen Hesap Planı', icon: '📒', questionCount: 25, estimatedMinutes: 12, format: 'mcq', description: 'Hesap sınıfları, muhasebe ilkeleri, mizan, bilanço, gelir tablosu, yevmiye kayıtları.' },
  { id: 'pb_on_muhasebe', group: 'pozisyon_bazli', subGroup: 'Finans & Muhasebe', title: 'Ön Muhasebe', subtitle: 'Günlük Muhasebe İşlemleri', icon: '🧾', questionCount: 20, estimatedMinutes: 10, format: 'mcq', description: 'Fatura, cari hesap, banka mutabakatı, KDV, e-fatura.' },
  { id: 'pb_finans_yonetimi', group: 'pozisyon_bazli', subGroup: 'Finans & Muhasebe', title: 'Finans Yönetimi', subtitle: 'Stratejik Finans', icon: '💰', questionCount: 25, estimatedMinutes: 12, format: 'mcq', description: 'Nakit akış, bütçeleme, finansal analiz, risk yönetimi.' },
  { id: 'pb_operasyonel_finans', group: 'pozisyon_bazli', subGroup: 'Finans & Muhasebe', title: 'Operasyonel Finans', subtitle: 'Günlük Finans', icon: '🏦', questionCount: 20, estimatedMinutes: 10, format: 'mcq', description: 'Ödeme/tahsilat, çek/senet, banka işlemleri.' },
  { id: 'pb_yatirim_yonetimi', group: 'pozisyon_bazli', subGroup: 'Finans & Muhasebe', title: 'Yatırım Yönetimi', subtitle: 'Yatırım Analizi', icon: '📈', questionCount: 20, estimatedMinutes: 10, format: 'mcq', description: 'Yatırım analizi, fizibilite, geri dönüş, portföy.' },
  { id: 'pb_ic_denetim', group: 'pozisyon_bazli', subGroup: 'Finans & Muhasebe', title: 'İç Denetim', subtitle: 'Denetim & Kontrol', icon: '🔍', questionCount: 20, estimatedMinutes: 10, format: 'mcq', description: 'Denetim standartları, risk değerlendirme, kontrol süreçleri.' },

  // B. Ticaret & Pazarlama
  { id: 'pb_satis_pazarlama', group: 'pozisyon_bazli', subGroup: 'Ticaret & Pazarlama', title: 'Satış ve Pazarlama', subtitle: 'Satış Süreçleri', icon: '🎯', questionCount: 25, estimatedMinutes: 12, format: 'mcq', description: 'Satış teknikleri, müşteri analizi, teklif, pipeline.' },
  { id: 'pb_pazarlama', group: 'pozisyon_bazli', subGroup: 'Ticaret & Pazarlama', title: 'Pazarlama', subtitle: 'Pazarlama Stratejisi', icon: '📣', questionCount: 25, estimatedMinutes: 12, format: 'mcq', description: 'Strateji, 4P/7P, marka, segmentasyon, dijital.' },
  { id: 'pb_halka_iliskiler', group: 'pozisyon_bazli', subGroup: 'Ticaret & Pazarlama', title: 'Halkla İlişkiler', subtitle: 'Kurumsal İletişim', icon: '📰', questionCount: 20, estimatedMinutes: 10, format: 'mcq', description: 'Kurumsal iletişim, medya, kriz iletişimi, etkinlik.' },
  { id: 'pb_is_gelistirme', group: 'pozisyon_bazli', subGroup: 'Ticaret & Pazarlama', title: 'İş Geliştirme', subtitle: 'Büyüme Stratejileri', icon: '🚀', questionCount: 20, estimatedMinutes: 10, format: 'mcq', description: 'Pazar analizi, ortaklıklar, iş modeli, büyüme.' },
  { id: 'pb_e_ticaret', group: 'pozisyon_bazli', subGroup: 'Ticaret & Pazarlama', title: 'Temel E-Ticaret', subtitle: 'Online Satış', icon: '🛒', questionCount: 20, estimatedMinutes: 10, format: 'mcq', description: 'Platform yönetimi, dijital satış, SEO/SEM, ödeme.' },
  { id: 'pb_musteri_iliskileri', group: 'pozisyon_bazli', subGroup: 'Ticaret & Pazarlama', title: 'Müşteri İlişkileri Yönetimi', subtitle: 'CRM', icon: '💝', questionCount: 20, estimatedMinutes: 10, format: 'mcq', description: 'CRM süreçleri, yaşam döngüsü, memnuniyet, sadakat.' },
  { id: 'pb_magaza_bayi', group: 'pozisyon_bazli', subGroup: 'Ticaret & Pazarlama', title: 'Mağaza ve Bayi Yönetimi', subtitle: 'Perakende Yönetimi', icon: '🏪', questionCount: 20, estimatedMinutes: 10, format: 'mcq', description: 'Stok, görsel mağazacılık, bayi ilişkileri, hedefler.' },

  // C. Dış Ticaret
  { id: 'pb_ihracat', group: 'pozisyon_bazli', subGroup: 'Dış Ticaret', title: 'İhracat', subtitle: 'İhracat Operasyonları', icon: '🚢', questionCount: 25, estimatedMinutes: 12, format: 'mcq', description: 'İhracat prosedürleri, Incoterms, akreditif, belgeler.' },
  { id: 'pb_ithalat', group: 'pozisyon_bazli', subGroup: 'Dış Ticaret', title: 'İthalat', subtitle: 'İthalat Operasyonları', icon: '📥', questionCount: 25, estimatedMinutes: 12, format: 'mcq', description: 'İthalat mevzuatı, gümrük tarifeleri, menşe.' },
  { id: 'pb_dis_ticaret_gumruk', group: 'pozisyon_bazli', subGroup: 'Dış Ticaret', title: 'Dış Ticaret Operasyon & Gümrükleme', subtitle: 'Gümrük İşlemleri', icon: '🌐', questionCount: 25, estimatedMinutes: 12, format: 'mcq', description: 'Gümrük beyannamesi, GTIP, serbest bölge, transit.' },

  // D. Üretim & Operasyon
  { id: 'pb_planlama', group: 'pozisyon_bazli', subGroup: 'Üretim & Operasyon', title: 'Planlama', subtitle: 'Üretim Planlama', icon: '📅', questionCount: 25, estimatedMinutes: 12, format: 'mcq', description: 'MRP/ERP, kapasite planlama, talep tahmini, stok.' },
  { id: 'pb_uretim_yonetimi', group: 'pozisyon_bazli', subGroup: 'Üretim & Operasyon', title: 'Üretim Yönetimi', subtitle: 'Üretim Süreçleri', icon: '🏭', questionCount: 25, estimatedMinutes: 12, format: 'mcq', description: 'Verimlilik, OEE, iş emirleri, vardiya yönetimi.' },
  { id: 'pb_kalite_yonetimi', group: 'pozisyon_bazli', subGroup: 'Üretim & Operasyon', title: 'Kalite Yönetimi', subtitle: 'ISO & Kalite Araçları', icon: '🏅', questionCount: 25, estimatedMinutes: 12, format: 'mcq', description: 'ISO 9001, SPC, FMEA, 8D, istatistiksel kalite.' },
  { id: 'pb_bakim_onarim', group: 'pozisyon_bazli', subGroup: 'Üretim & Operasyon', title: 'Bakım ve Onarım', subtitle: 'TPM & Bakım Yönetimi', icon: '🔩', questionCount: 20, estimatedMinutes: 10, format: 'mcq', description: 'Önleyici/kestirimci bakım, TPM, arıza analizi.' },
  { id: 'pb_yalin_uretim', group: 'pozisyon_bazli', subGroup: 'Üretim & Operasyon', title: 'Yalın Üretim Teknikleri', subtitle: 'Lean Manufacturing', icon: '♻️', questionCount: 25, estimatedMinutes: 12, format: 'mcq', description: '5S, Kaizen, Kanban, SMED, değer akış haritalama.' },

  // E. Tedarik & Lojistik
  { id: 'pb_satinalma', group: 'pozisyon_bazli', subGroup: 'Tedarik & Lojistik', title: 'Satınalma', subtitle: 'Tedarik Yönetimi', icon: '🛍️', questionCount: 25, estimatedMinutes: 12, format: 'mcq', description: 'Tedarikçi değerlendirme, teklif analizi, sözleşme.' },
  { id: 'pb_lojistik_sevkiyat', group: 'pozisyon_bazli', subGroup: 'Tedarik & Lojistik', title: 'Lojistik ve Sevkiyat', subtitle: 'Depo & Dağıtım', icon: '🚛', questionCount: 25, estimatedMinutes: 12, format: 'mcq', description: 'Depo yönetimi, rut planlama, navlun, WMS.' },

  // F. Ar-Ge & Ürün
  { id: 'pb_arge', group: 'pozisyon_bazli', subGroup: 'Ar-Ge & Ürün', title: 'Ar-Ge', subtitle: 'Araştırma & Geliştirme', icon: '🔬', questionCount: 20, estimatedMinutes: 10, format: 'mcq', description: 'Proje yönetimi, araştırma metodolojisi, TÜBİTAK.' },
  { id: 'pb_urge', group: 'pozisyon_bazli', subGroup: 'Ar-Ge & Ürün', title: 'Ür-Ge (Ürün Geliştirme)', subtitle: 'Ürün Geliştirme', icon: '💡', questionCount: 20, estimatedMinutes: 10, format: 'mcq', description: 'Prototipleme, ürün yaşam döngüsü, APQP.' },
  { id: 'pb_urun_yonetimi', group: 'pozisyon_bazli', subGroup: 'Ar-Ge & Ürün', title: 'Ürün Yönetimi', subtitle: 'Product Management', icon: '📱', questionCount: 20, estimatedMinutes: 10, format: 'mcq', description: 'Ürün stratejisi, yol haritası, fiyatlandırma.' },

  // G. Teknoloji & Destek
  { id: 'pb_bilgi_teknolojileri', group: 'pozisyon_bazli', subGroup: 'Teknoloji & Destek', title: 'Temel Bilgi Teknolojileri', subtitle: 'IT Temelleri', icon: '💻', questionCount: 25, estimatedMinutes: 12, format: 'mcq', description: 'Donanım, yazılım, ağ, güvenlik, Office, ERP.' },
  { id: 'pb_yonetici_asistani', group: 'pozisyon_bazli', subGroup: 'Teknoloji & Destek', title: 'Yönetici Asistanı', subtitle: 'Ofis Yönetimi', icon: '📎', questionCount: 20, estimatedMinutes: 10, format: 'mcq', description: 'Ajanda, toplantı, yazışma, protokol, sunum.' },
  { id: 'pb_idari_isler', group: 'pozisyon_bazli', subGroup: 'Teknoloji & Destek', title: 'İdari İşler', subtitle: 'Genel İdari Yönetim', icon: '🗂️', questionCount: 20, estimatedMinutes: 10, format: 'mcq', description: 'Ofis yönetimi, sözleşme, demirbaş, filo, sigorta.' },

  // H. İnsan Kaynakları
  { id: 'pb_insan_kaynaklari', group: 'pozisyon_bazli', subGroup: 'İnsan Kaynakları', title: 'İnsan Kaynakları', subtitle: 'İK Yönetimi', icon: '👥', questionCount: 25, estimatedMinutes: 12, format: 'mcq', description: 'İşe alım, performans, özlük, İş Kanunu, SGK, bordro.' },
];

// ═══════════════════════════════════════════════════════════════
// BİRLEŞİK KATALOG
// ═══════════════════════════════════════════════════════════════
export const testCatalog = [
  ...psikometrikTests,
  ...yetenekTests,
  ...meslekiBilgiTests,
  ...senaryoTests,
  ...pozisyonBazliTests,
];

// Helper: get tests by group
export function getTestsByGroup(groupId) {
  return testCatalog.filter(t => t.group === groupId);
}

// Helper: get test by id
export function getTestById(testId) {
  return testCatalog.find(t => t.id === testId);
}

// Helper: get unique sub-groups within a group
export function getSubGroups(groupId) {
  const tests = getTestsByGroup(groupId);
  const subs = [...new Set(tests.map(t => t.subGroup).filter(Boolean))];
  return subs;
}

// Total test count
export const TOTAL_TEST_COUNT = testCatalog.length;

// Total question count
export const TOTAL_QUESTION_COUNT = testCatalog.reduce((s, t) => s + t.questionCount, 0);
