export const initialCompanyInfo = {
  name: 'Örnek KOBİ Yazılım A.Ş.', 
  title: 'Örnek KOBİ Teknoloji ve Yazılım Sanayi Ticaret A.Ş.', 
  foundationDate: '2015-05-12', 
  partnership: '%60 Ahmet Y., %40 Mehmet K.', 
  history: '2015: Şirket kuruldu.\n2018: İlk ihracat gerçekleşti.\n2022: Teknopark şubesi açıldı.'
};

export const initialDepartments = [
  { id: 'd1', name: 'Yönetim' },
  { id: 'd2', name: 'Finans' },
  { id: 'd3', name: 'Üretim' },
  { id: 'd4', name: 'Satış' },
];

export const initialTitles = [
  { id: 't1', name: 'Genel Müdür', departmentId: 'd1', reportsToTitleId: null, level: 1 },
  { id: 't2', name: 'Finans Müdürü', departmentId: 'd2', reportsToTitleId: 't1', level: 2 },
  { id: 't3', name: 'Üretim Yöneticisi', departmentId: 'd3', reportsToTitleId: 't1', level: 2 },
  { id: 't4', name: 'Satış Uzmanı', departmentId: 'd4', reportsToTitleId: 't1', level: 2 },
  { id: 't5', name: 'Vardiya Amiri', departmentId: 'd3', reportsToTitleId: 't3', level: 3 }
];

export const jobFamilies = [
  { id: 'jf_sales', name: 'Satış', isActive: true, isPreloaded: true },
  { id: 'jf_marketing', name: 'Pazarlama', isActive: true, isPreloaded: true },
  { id: 'jf_hr', name: 'İnsan Kaynakları', isActive: true, isPreloaded: true },
  { id: 'jf_finance', name: 'Finans', isActive: true, isPreloaded: true },
  { id: 'jf_procurement', name: 'Satınalma', isActive: true, isPreloaded: true },
  { id: 'jf_rnd', name: 'AR-GE', isActive: true, isPreloaded: true },
  { id: 'jf_production', name: 'Üretim', isActive: true, isPreloaded: true },
  { id: 'jf_it', name: 'Bilgi Teknolojileri', isActive: true, isPreloaded: true },
  { id: 'jf_logistics', name: 'Lojistik', isActive: true, isPreloaded: true },
  { id: 'jf_planning', name: 'Planlama', isActive: true, isPreloaded: true },
  { id: 'jf_quality', name: 'Kalite', isActive: true, isPreloaded: true },
  { id: 'jf_management', name: 'Yönetim', isActive: true, isPreloaded: true }
];

export const jobFunctions = [
  // Satış Fonksiyonları
  { id: 'fn_sales_field', familyId: 'jf_sales', name: 'Saha Satış', isActive: true, isPreloaded: true },
  { id: 'fn_sales_inside', familyId: 'jf_sales', name: 'İç Satış', isActive: true, isPreloaded: true },
  { id: 'fn_sales_channel', familyId: 'jf_sales', name: 'Kanal Satış', isActive: true, isPreloaded: true },
  { id: 'fn_sales_corporate', familyId: 'jf_sales', name: 'Kurumsal Satış', isActive: true, isPreloaded: true },
  { id: 'fn_sales_account', familyId: 'jf_sales', name: 'Müşteri Yönetimi', isActive: true, isPreloaded: true },

  // Pazarlama Fonksiyonları
  { id: 'fn_mkt_digital', familyId: 'jf_marketing', name: 'Dijital Pazarlama', isActive: true, isPreloaded: true },
  { id: 'fn_mkt_brand', familyId: 'jf_marketing', name: 'Marka Yönetimi', isActive: true, isPreloaded: true },
  { id: 'fn_mkt_product', familyId: 'jf_marketing', name: 'Ürün Pazarlama', isActive: true, isPreloaded: true },
  { id: 'fn_mkt_comm', familyId: 'jf_marketing', name: 'Kurumsal İletişim', isActive: true, isPreloaded: true },
  { id: 'fn_mkt_research', familyId: 'jf_marketing', name: 'Pazar Araştırma', isActive: true, isPreloaded: true },

  // İnsan Kaynakları Fonksiyonları
  { id: 'fn_hr_recruit', familyId: 'jf_hr', name: 'İşe Alım', isActive: true, isPreloaded: true },
  { id: 'fn_hr_training', familyId: 'jf_hr', name: 'Eğitim ve Gelişim', isActive: true, isPreloaded: true },
  { id: 'fn_hr_talent', familyId: 'jf_hr', name: 'Performans ve Yetenek', isActive: true, isPreloaded: true },
  { id: 'fn_hr_payroll', familyId: 'jf_hr', name: 'Bordro ve Özlük', isActive: true, isPreloaded: true },
  { id: 'fn_hr_od', familyId: 'jf_hr', name: 'Organizasyonel Gelişim', isActive: true, isPreloaded: true },

  // Finans Fonksiyonları
  { id: 'fn_fin_accounting', familyId: 'jf_finance', name: 'Muhasebe', isActive: true, isPreloaded: true },
  { id: 'fn_fin_fpa', familyId: 'jf_finance', name: 'Finansal Planlama (FP&A)', isActive: true, isPreloaded: true },
  { id: 'fn_fin_budget', familyId: 'jf_finance', name: 'Bütçe ve Raporlama', isActive: true, isPreloaded: true },
  { id: 'fn_fin_treasury', familyId: 'jf_finance', name: 'Nakit Yönetimi', isActive: true, isPreloaded: true },
  { id: 'fn_fin_tax', familyId: 'jf_finance', name: 'Vergi ve Mevzuat', isActive: true, isPreloaded: true },

  // Satınalma Fonksiyonları
  { id: 'fn_proc_operational', familyId: 'jf_procurement', name: 'Operasyonel Satınalma', isActive: true, isPreloaded: true },
  { id: 'fn_proc_strategic', familyId: 'jf_procurement', name: 'Stratejik Satınalma', isActive: true, isPreloaded: true },
  { id: 'fn_proc_vendor', familyId: 'jf_procurement', name: 'Tedarikçi Yönetimi', isActive: true, isPreloaded: true },
  { id: 'fn_proc_contract', familyId: 'jf_procurement', name: 'Sözleşme Yönetimi', isActive: true, isPreloaded: true },

  // AR-GE Fonksiyonları
  { id: 'fn_rnd_product', familyId: 'jf_rnd', name: 'Ürün Geliştirme', isActive: true, isPreloaded: true },
  { id: 'fn_rnd_process', familyId: 'jf_rnd', name: 'Proses Geliştirme', isActive: true, isPreloaded: true },
  { id: 'fn_rnd_test', familyId: 'jf_rnd', name: 'Test ve Doğrulama', isActive: true, isPreloaded: true },
  { id: 'fn_rnd_innovation', familyId: 'jf_rnd', name: 'İnovasyon Yönetimi', isActive: true, isPreloaded: true },

  // Üretim Fonksiyonları
  { id: 'fn_prod_operations', familyId: 'jf_production', name: 'Üretim Operasyonları', isActive: true, isPreloaded: true },
  { id: 'fn_prod_line', familyId: 'jf_production', name: 'Hat Yönetimi', isActive: true, isPreloaded: true },
  { id: 'fn_prod_assembly', familyId: 'jf_production', name: 'Montaj', isActive: true, isPreloaded: true },
  { id: 'fn_prod_shift', familyId: 'jf_production', name: 'Vardiya Yönetimi', isActive: true, isPreloaded: true },
  { id: 'fn_prod_maintenance', familyId: 'jf_production', name: 'Bakım Onarım', isActive: true, isPreloaded: true },

  // Bilgi Teknolojileri Fonksiyonları
  { id: 'fn_it_software', familyId: 'jf_it', name: 'Yazılım Geliştirme', isActive: true, isPreloaded: true },
  { id: 'fn_it_systems', familyId: 'jf_it', name: 'Sistem ve Ağ Yönetimi', isActive: true, isPreloaded: true },
  { id: 'fn_it_support', familyId: 'jf_it', name: 'Teknik Destek', isActive: true, isPreloaded: true },
  { id: 'fn_it_apps', familyId: 'jf_it', name: 'İş Uygulamaları', isActive: true, isPreloaded: true },
  { id: 'fn_it_security', familyId: 'jf_it', name: 'Bilgi Güvenliği', isActive: true, isPreloaded: true },

  // Lojistik Fonksiyonları
  { id: 'fn_log_dispatch', familyId: 'jf_logistics', name: 'Sevkiyat', isActive: true, isPreloaded: true },
  { id: 'fn_log_warehouse', familyId: 'jf_logistics', name: 'Depo Yönetimi', isActive: true, isPreloaded: true },
  { id: 'fn_log_transport', familyId: 'jf_logistics', name: 'Taşıma Operasyonları', isActive: true, isPreloaded: true },
  { id: 'fn_log_inventory', familyId: 'jf_logistics', name: 'Stok ve Malzeme Akışı', isActive: true, isPreloaded: true },

  // Planlama Fonksiyonları
  { id: 'fn_plan_production', familyId: 'jf_planning', name: 'Üretim Planlama', isActive: true, isPreloaded: true },
  { id: 'fn_plan_demand', familyId: 'jf_planning', name: 'Talep Planlama', isActive: true, isPreloaded: true },
  { id: 'fn_plan_capacity', familyId: 'jf_planning', name: 'Kapasite Planlama', isActive: true, isPreloaded: true },
  { id: 'fn_plan_materials', familyId: 'jf_planning', name: 'Malzeme Planlama', isActive: true, isPreloaded: true },

  // Kalite Fonksiyonları
  { id: 'fn_qa_assurance', familyId: 'jf_quality', name: 'Kalite Güvence', isActive: true, isPreloaded: true },
  { id: 'fn_qa_control', familyId: 'jf_quality', name: 'Kalite Kontrol', isActive: true, isPreloaded: true },
  { id: 'fn_qa_docs', familyId: 'jf_quality', name: 'Dokümantasyon', isActive: true, isPreloaded: true },
  { id: 'fn_qa_audit', familyId: 'jf_quality', name: 'Uyum ve Denetim', isActive: true, isPreloaded: true },

  // Yönetim Fonksiyonları
  { id: 'fn_mgmt_general', familyId: 'jf_management', name: 'Genel Yönetim', isActive: true, isPreloaded: true },
  { id: 'fn_mgmt_division', familyId: 'jf_management', name: 'Bölüm Yönetimi', isActive: true, isPreloaded: true },
  { id: 'fn_mgmt_operations', familyId: 'jf_management', name: 'Operasyon Yönetimi', isActive: true, isPreloaded: true },
  { id: 'fn_mgmt_strategy', familyId: 'jf_management', name: 'Strateji ve İş Geliştirme', isActive: true, isPreloaded: true }
];

export const jobLevels = [
  { id: 'l1', name: 'L1 - Operasyonel / Giriş', level: 1, isActive: true, isPreloaded: true },
  { id: 'l2', name: 'L2 - Uzman', level: 2, isActive: true, isPreloaded: true },
  { id: 'l3', name: 'L3 - Kıdemli Uzman', level: 3, isActive: true, isPreloaded: true },
  { id: 'l4', name: 'L4 - Müdür / Fonksiyonel Yönetici', level: 4, isActive: true, isPreloaded: true },
  { id: 'l5', name: 'L5 - Direktör / Stratejik Lider', level: 5, isActive: true, isPreloaded: true }
];

export const responsibilityLibrary = [
  // SATIŞ
  { id: 'lib_r1_sales', jobFamilyId: 'jf_sales', title: 'Gelir ve Ciro Hedeflerinin Gerçekleştirilmesi', description: 'Şirketin satış kotalarını ve bölgesel büyüme hedeflerini yakalamak.', isPreloaded: true, isActive: true },
  { id: 'lib_r2_sales', jobFamilyId: 'jf_sales', title: 'Müşteri Portföy Yönetimi', description: 'Mevcut müşterilerle ilişkileri geliştirmek ve müşteri kayıp oranını (churn) düşürmek.', isPreloaded: true, isActive: true },
  { id: 'lib_r3_sales', jobFamilyId: 'jf_sales', title: 'Pazar ve Rakip Analizi', description: 'Sektörel gelişmeleri takip ederek satış stratejilerine yön vermek.', isPreloaded: true, isActive: true },

  // İNSAN KAYNAKLARI
  { id: 'lib_r1_hr', jobFamilyId: 'jf_hr', title: 'Yetenek Kazanımı ve İşe Alım', description: 'Açık pozisyonların zamanında ve doğru yeteneklerle doldurulmasını sağlamak.', isPreloaded: true, isActive: true },
  { id: 'lib_r2_hr', jobFamilyId: 'jf_hr', title: 'Performans Yönetimi', description: 'Şirket geneli performans değerlendirme süreçlerini yürütmek.', isPreloaded: true, isActive: true },
  { id: 'lib_r3_hr', jobFamilyId: 'jf_hr', title: 'Organizasyonel Kültür ve Bağlılık', description: 'Çalışan memnuniyetini artırıcı aksiyonlar ve etkinlikler tasarlamak.', isPreloaded: true, isActive: true },

  // FİNANS
  { id: 'lib_r1_fin', jobFamilyId: 'jf_finance', title: 'Nakit Akışı ve Nakit Yönetimi', description: 'Şirketin günlük ve aylık nakit ihtiyaçlarını optimize etmek.', isPreloaded: true, isActive: true },
  { id: 'lib_r2_fin', jobFamilyId: 'jf_finance', title: 'Bütçe Planlama', description: 'Yıllık bütçe çalışmalarına liderlik etmek ve sapmaları raporlamak.', isPreloaded: true, isActive: true },

  // BİLGİ TEKNOLOJİLERİ
  { id: 'lib_r1_it', jobFamilyId: 'jf_it', title: 'Sistem Sürekliliği ve Altyapı Yönetimi', description: 'Sunucuların ve ağ altyapısının %99.9 çalışma süresiyle (uptime) ayakta kalmasını sağlamak.', isPreloaded: true, isActive: true },
  { id: 'lib_r2_it', jobFamilyId: 'jf_it', title: 'Bilgi Güvenliği Operasyonları', description: 'Şirket verilerinin siber tehditlere karşı korunması ve yedeklenmesi.', isPreloaded: true, isActive: true },

  // ÜRETİM
  { id: 'lib_r1_prod', jobFamilyId: 'jf_production', title: 'Üretim Planına Uyum', description: 'Günlük vardiya hedeflerinin firesiz ve zamanında tamamlanması.', isPreloaded: true, isActive: true },
  { id: 'lib_r2_prod', jobFamilyId: 'jf_production', title: 'İş Sağlığı ve Güvenliği Kural İhlali Önleme', description: 'Üretim hattında sıfır iş kazası hedefine uygun ortamı gözetmek.', isPreloaded: true, isActive: true },

  // SATINALMA
  { id: 'lib_r1_proc', jobFamilyId: 'jf_procurement', title: 'Tedarikçi Yönetimi ve Değerlendirmesi', description: 'Uygun kalitede ve fiyatta malzeme teminini sağlamak.', isPreloaded: true, isActive: true },
  
  // Lojistik
  { id: 'lib_r1_log', jobFamilyId: 'jf_logistics', title: 'Depo ve Stok Yönetimi', description: 'Depo düzeni ve optimum stok seviyesinin korunması.', isPreloaded: true, isActive: true },

  // Kalite
  { id: 'lib_r1_qa', jobFamilyId: 'jf_quality', title: 'Kalite Güvence Sistemi Yürütümü', description: 'Tüm üretimin standartlara ve kalite belgelerine uygun yapılması.', isPreloaded: true, isActive: true }
];

export const taskLibrary = [
  // Satış Taskları
  { id: 'lib_t1_sales', responsibilityId: 'lib_r1_sales', title: 'Günlük rutin müşteri ziyaretlerini gerçekleştirmek', criticality: 1, isPreloaded: true, isActive: true },
  { id: 'lib_t2_sales', responsibilityId: 'lib_r1_sales', title: 'CRM sistemine günlük satış aktivitelerini girmek', criticality: 2, isPreloaded: true, isActive: true },
  { id: 'lib_t3_sales', responsibilityId: 'lib_r2_sales', title: 'Aylık müşteri memnuniyet anketlerini analiz etmek', criticality: 2, isPreloaded: true, isActive: true },
  { id: 'lib_t4_sales', responsibilityId: 'lib_r3_sales', title: 'Rakip fiyat analiz raporu hazırlamak', criticality: 3, isPreloaded: true, isActive: true },

  // İK Taskları
  { id: 'lib_t1_hr', responsibilityId: 'lib_r1_hr', title: 'Aday mülakatlarını organize etmek ve gerçekleştirmek', criticality: 1, isPreloaded: true, isActive: true },
  { id: 'lib_t2_hr', responsibilityId: 'lib_r1_hr', title: 'İş ilanlarını kariyer portallarında yayınlamak', criticality: 2, isPreloaded: true, isActive: true },
  { id: 'lib_t3_hr', responsibilityId: 'lib_r2_hr', title: 'Yöneticilere performans geri bildirim eğitimi vermek', criticality: 2, isPreloaded: true, isActive: true },
  { id: 'lib_t4_hr', responsibilityId: 'lib_r3_hr', title: 'Aylık şirket içi motivasyon etkinliklerini planlamak', criticality: 3, isPreloaded: true, isActive: true },

  // Finans Taskları
  { id: 'lib_t1_fin', responsibilityId: 'lib_r1_fin', title: 'Günlük banka hesap hareketleri mutabakatını yapmak', criticality: 1, isPreloaded: true, isActive: true },
  { id: 'lib_t2_fin', responsibilityId: 'lib_r2_fin', title: 'Departman bazlı gider sapma analizlerini hazırlamak', criticality: 2, isPreloaded: true, isActive: true },

  // IT Taskları
  { id: 'lib_t1_it', responsibilityId: 'lib_r1_it', title: 'Sunucu donanım ve yazılım güncellemelerini test edip uygulamak', criticality: 1, isPreloaded: true, isActive: true },
  { id: 'lib_t2_it', responsibilityId: 'lib_r2_it', title: 'Güvenlik loglarını (SIEM) günlük olarak incelemek', criticality: 1, isPreloaded: true, isActive: true },

  // Üretim Taskları
  { id: 'lib_t1_prod', responsibilityId: 'lib_r1_prod', title: 'Vardiya başı üretim parametrelerini makinelere girmek', criticality: 1, isPreloaded: true, isActive: true },
  { id: 'lib_t2_prod', responsibilityId: 'lib_r2_prod', title: 'Personele ait KKD (Kişisel Koruyucu Donanım) kullanımını denetlemek', criticality: 1, isPreloaded: true, isActive: true },

  // Satınalma Taskları
  { id: 'lib_t1_proc', responsibilityId: 'lib_r1_proc', title: 'Tedarikçilerden en az 3 teklif toplayıp karşılaştırma tablosu hazırlamak', criticality: 2, isPreloaded: true, isActive: true },

  // Lojistik Taskları
  { id: 'lib_t1_log', responsibilityId: 'lib_r1_log', title: 'Günlük irsaliye ve fatura girişlerini sisteme işlemek', criticality: 1, isPreloaded: true, isActive: true },

  // Kalite Taskları
  { id: 'lib_t1_qa', responsibilityId: 'lib_r1_qa', title: 'Üretim bandından çıkan ürünlerden rasgele numune alarak test etmek', criticality: 1, isPreloaded: true, isActive: true }
];

export const competencyLibrary = [
  // Liderlik (Genel)
  { id: 'lib_c1_ldr', familyId: null, title: 'Stratejik Düşünme', description: 'Uzun vadeli vizyon oluşturma.', category: 'Leadership', isActive: true, isPreloaded: true },
  { id: 'lib_c2_ldr', familyId: null, title: 'Ekip Yönetimi ve Geliştirme', description: 'Takım üyelerine ilham verme.', category: 'Leadership', isActive: true, isPreloaded: true },

  // Satış Core
  { id: 'lib_c1_sales', familyId: 'jf_sales', title: 'İkna ve Müzakere', description: 'Müşteri ile kazan-kazan ilişkisi kurma.', category: 'Core', isActive: true, isPreloaded: true },
  { id: 'lib_c2_sales', familyId: 'jf_sales', title: 'Sonuç Odaklılık', description: 'Kotalara ulaşmada kararlılık.', category: 'Core', isActive: true, isPreloaded: true },

  // İK Core
  { id: 'lib_c1_hr', familyId: 'jf_hr', title: 'Empati ve Çatışma Çözümü', description: 'Çalışan sorunlarında tarafsız yaklaşım.', category: 'Core', isActive: true, isPreloaded: true },
  { id: 'lib_c2_hr', familyId: 'jf_hr', title: 'İletişim ve Etkileme', description: 'Kurum genelinde etkili diyalog kurma.', category: 'Core', isActive: true, isPreloaded: true },

  // IT Core
  { id: 'lib_c1_it', familyId: 'jf_it', title: 'Analitik ve Sayısal Problem Çözme', description: 'Sistem hatalarını kök-neden temelli çözme.', category: 'Core', isActive: true, isPreloaded: true },
  { id: 'lib_c2_it', familyId: 'jf_it', title: 'Sürekli Öğrenme ve Adaptasyon', description: 'Yeni teknolojilere hızlı entegrasyon.', category: 'Core', isActive: true, isPreloaded: true },

  // Üretim Core
  { id: 'lib_c1_prod', familyId: 'jf_production', title: 'Detay Odaklılık', description: 'Montaj veya işleme sırasındaki kaliteyi bozmamaya özen gösterme.', category: 'Core', isActive: true, isPreloaded: true },
  { id: 'lib_c2_prod', familyId: 'jf_production', title: 'Kriz Anında Soğukkanlılık', description: 'Hatta oluşan arızalarda acil ve doğru müdahale edebilme.', category: 'Core', isActive: true, isPreloaded: true }
];

export const skillLibrary = [
  // IT Skills
  { id: 'lib_s1_it', familyId: 'jf_it', title: 'Python / JavaScript Programlama', isActive: true, isPreloaded: true },
  { id: 'lib_s2_it', familyId: 'jf_it', title: 'AWS / Azure Cloud Yönetimi', isActive: true, isPreloaded: true },
  
  // Sales Skills
  { id: 'lib_s1_sales', familyId: 'jf_sales', title: 'B2B/B2C Satış Teknikleri', isActive: true, isPreloaded: true },
  { id: 'lib_s2_sales', familyId: 'jf_sales', title: 'CRM Sistemleri (Salesforce/Hubspot)', isActive: true, isPreloaded: true },
  
  // Finance Skills
  { id: 'lib_s1_fin', familyId: 'jf_finance', title: 'İleri Seviye Excel ve Makrolar', isActive: true, isPreloaded: true },
  { id: 'lib_s2_fin', familyId: 'jf_finance', title: 'SAP FI / CO Modülü Kullanımı', isActive: true, isPreloaded: true },

  // Satınalma & Lojistik Skills
  { id: 'lib_s1_proc', familyId: 'jf_procurement', title: 'Sözleşme Hazırlama ve İnceleme', isActive: true, isPreloaded: true },
  { id: 'lib_s1_log', familyId: 'jf_logistics', title: 'ERP Barkod ve El Terminali Sistemleri', isActive: true, isPreloaded: true }
];

export const knowledgeLibrary = [
  // Finans
  { id: 'lib_k1_fin', familyId: 'jf_finance', title: 'UFRS ve Yerel Vergi Mevzuatı', isActive: true, isPreloaded: true },
  // İK
  { id: 'lib_k1_hr', familyId: 'jf_hr', title: '4857 Sayılı İş Kanunu', isActive: true, isPreloaded: true },
  // Satış
  { id: 'lib_k1_sales', familyId: 'jf_sales', title: 'Sektörel Dinamikler ve Hedef Pazar Bilgisi', isActive: true, isPreloaded: true },
  // Kalite / Üretim
  { id: 'lib_k1_qa', familyId: 'jf_quality', title: 'TS EN ISO 9001:2015 Kalite Yönetim Sistemi', isActive: true, isPreloaded: true },
  // Satınalma
  { id: 'lib_k1_proc', familyId: 'jf_procurement', title: 'Uluslararası Ticaret ve Gümrük Mevzuatı (Incoterms)', isActive: true, isPreloaded: true }
];

export const certificationLibrary = [
  { id: 'lib_cert1_it', familyId: 'jf_it', title: 'AWS Certified Solutions Architect', issuingBody: 'Amazon', isActive: true, isPreloaded: true },
  { id: 'lib_cert1_hr', familyId: 'jf_hr', title: 'Profesyonel Koçluk Sertifikası', issuingBody: 'ICF', isActive: true, isPreloaded: true },
  { id: 'lib_cert1_fin', familyId: 'jf_finance', title: 'SMMM (Serbest Muhasebeci Mali Müşavirlik)', issuingBody: 'TÜRMOB', isActive: true, isPreloaded: true },
  { id: 'lib_cert1_prod', familyId: 'jf_production', title: 'Yalın Üretim Uzmanlığı / 6 Sigma Green Belt', issuingBody: 'ASQ', isActive: true, isPreloaded: true },
  { id: 'lib_cert2_prod', familyId: 'jf_production', title: 'Tehlikeli Madde Güvenlik Danışmanlığı (TMGD)', issuingBody: 'Udhb', isActive: true, isPreloaded: true }
];

export const initialJobAnalyses = [
  {
    id: 'ja1',
    positionId: 'd4_t4', // Satış Uzmanı (Satış)
    departmentId: 'd4',
    titleId: 't4',
    jobFamilyId: 'jf4',
    jobFunctionId: 'fn4',
    jobLevelId: 'l3',
    status: 'ACTIVE',
    version: 2.0,
    isActiveVersion: true,
    previousVersionId: 'ja0', // V1 referansı
    createdBy: 'Danışman Admin',
    createdAt: '2025-10-01T10:00:00Z',
    updatedBy: 'Müşteri Yöneticisi',
    updatedAt: '2025-10-05T14:30:00Z',
    changeLog: 'KPI hedefleri revize edildi, yayınlandı.',
    purpose: 'Şirketin satış hedefleri doğrultusunda müşteri portföyünü yönetmek ve yeni müşteri kazanımı sağlamak.',
    responsibilities: [
      { id: 'r1', category: 'Satış Operasyonları', description: 'Bölgesel satış hedeflerinin gerçekleştirilmesi', timePercentage: 60 },
      { id: 'r2', category: 'Raporlama', description: 'Haftalık satış faaliyetlerinin raporlanması', timePercentage: 40 }
    ],
    tasks: [],
    competencies: [],
    skills: [],
    knowledge: [],
    certifications: [],
    kpiDefinitions: [],
    workingConditions: []
  },
  {
    id: 'ja0',
    positionId: 'd4_t4', // Satış Uzmanı V1.0 (Arşivlenmiş versiyon)
    departmentId: 'd4',
    titleId: 't4',
    jobFamilyId: 'jf4',
    jobFunctionId: 'fn4',
    jobLevelId: 'l3',
    status: 'ARCHIVED',
    version: 1.0,
    isActiveVersion: false,
    previousVersionId: null,
    createdBy: 'Danışman Admin',
    createdAt: '2025-01-01T10:00:00Z',
    updatedBy: 'Sistem Yöneticisi',
    updatedAt: '2025-10-05T14:29:00Z', // V2 yayına girdiği an arşivlenmiş
    changeLog: 'İlk sürüm.',
    purpose: 'Satış hedeflerinin gerçekleştirilmesi.',
    responsibilities: [],
    tasks: [],
    competencies: [],
    skills: [],
    knowledge: [],
    certifications: [],
    kpiDefinitions: [],
    workingConditions: []
  },
  {
    id: 'ja2',
    positionId: 'd2_t2', // Finans Müdürü
    departmentId: 'd2',
    titleId: 't2',
    jobFamilyId: 'jf2',
    jobFunctionId: 'fn2',
    jobLevelId: 'l2',
    status: 'DRAFT',
    version: 1.0,
    isActiveVersion: false,
    previousVersionId: null,
    createdBy: 'Danışman Admin',
    createdAt: '2026-02-10T10:00:00Z',
    updatedBy: 'Danışman Admin',
    updatedAt: '2026-02-12T14:30:00Z',
    changeLog: '',
    purpose: 'Şirket finansal varlıklarının optimizasyonu.',
    responsibilities: [],
    tasks: [],
    competencies: [],
    skills: [],
    knowledge: [],
    certifications: [],
    kpiDefinitions: [],
    workingConditions: []
  },
  {
    id: 'ja3',
    positionId: 'd3_t3', // Üretim Yöneticisi
    departmentId: 'd3',
    titleId: 't3',
    jobFamilyId: 'jf3',
    jobFunctionId: 'fn3',
    jobLevelId: 'l2',
    status: 'REJECTED',
    version: 1.0,
    isActiveVersion: false,
    previousVersionId: null,
    createdBy: 'Danışman Elif',
    createdAt: '2026-03-01T10:00:00Z',
    updatedBy: 'Müşteri CEO',
    updatedAt: '2026-03-05T09:15:00Z',
    changeLog: 'Müşteri reddetti: KPI metrikleri hatalı kurgulanmış.',
    purpose: 'Üretim bandının verimliliğini sağlamak.',
    responsibilities: [],
    tasks: [],
    competencies: [],
    skills: [],
    knowledge: [],
    certifications: [],
    kpiDefinitions: [],
    workingConditions: []
  }
];

export const initialEmployees = [
  { id: 'e1', name: 'Ahmet Yılmaz', department: 'Yönetim', departmentId: 'd1', title: 'Genel Müdür', titleId: 't1', email: 'ahmet@sirket.com', managerId: '' },
  { id: 'e2', name: 'Zeynep Çelik', department: 'Finans', departmentId: 'd2', title: 'Finans Müdürü', titleId: 't2', email: 'zeynep@sirket.com', managerId: 'e1' },
  { id: 'e3', name: 'Canan Güneş', department: 'Üretim', departmentId: 'd3', title: 'Üretim Yöneticisi', titleId: 't3', email: 'canan@sirket.com', managerId: 'e1' },
  { id: 'e4', name: 'Burak Ateş', department: 'Satış', departmentId: 'd4', title: 'Satış Uzmanı', titleId: 't4', email: 'burak@sirket.com', managerId: 'e1' },
  { id: 'e5', name: 'Elif Ay', department: 'Üretim', departmentId: 'd3', title: 'Vardiya Amiri', titleId: 't5', email: 'elif@sirket.com', managerId: 'e3' }
];

export const initialSurveyHistory = [
  { id: 'h1', date: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(), score: 61.20 },
  { id: 'h2', date: new Date(Date.now() - 190 * 24 * 60 * 60 * 1000).toISOString(), score: 58.50 },
  { id: 'h3', date: new Date(Date.now() - 280 * 24 * 60 * 60 * 1000).toISOString(), score: 55.00 },
  { id: 'h4', date: new Date(Date.now() - 370 * 24 * 60 * 60 * 1000).toISOString(), score: 50.10 }
];

export const initialInterviews = [
  { id: 'i1', employeeId: 'e2', status: 'pending', plannedDate: '2026-10-15', completedDate: null, consultant: 'Danışman Admin' }
];

export const initialRoadmapActions = [
  { id: '1', focusArea: 'Organizasyonel Yapı', action: 'Görev tanımlarının netleştirilmesi', start: '2025-10', end: '2025-12', status: 'Planlandı' },
  { id: '2', focusArea: 'Strateji ve Ölçme', action: '3 yıllık stratejik planın yapılması', start: '2025-11', end: '2026-02', status: 'Planlandı' }
];

export const initialMeetings = [
  { 
    id: 'm1', 
    title: 'Giriş Kokteyli ve Tanışma', 
    date: new Date().toISOString(), 
    agenda: 'Danışmanlık süreci başlangıcı ve ekip tanışması', 
    participants: ['e1', 'e2', 'e3'],
    notes: 'Tüm birim amirleri katılım sağladı.',
    decisions: []
  }
];
