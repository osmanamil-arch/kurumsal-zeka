import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Zenginleştirilmiş Varsayılan Kütüphane Verileri (Cold Start - Master Data)
const initialLibrary = [
  // Yetkinlikler (COMPETENCY)
  { id: 'lib_c1', type: 'COMPETENCY', name: 'Liderlik ve Yönetim', category: 'Yönetsel', description: 'Ekiplere yön verme ve motive etme', isActive: true },
  { id: 'lib_c2', type: 'COMPETENCY', name: 'Analitik Düşünme', category: 'Bilişsel', description: 'Karmaşık verileri analiz edip sonuç çıkarma', isActive: true },
  { id: 'lib_c3', type: 'COMPETENCY', name: 'İkna ve Müzakere', category: 'İletişim', description: 'Başkalarını etkileme ve ortak yol bulma', isActive: true },
  { id: 'lib_c4', type: 'COMPETENCY', name: 'Kriz Yönetimi', category: 'Yönetsel', description: 'Baskı altında soğukkanlı ve doğru karar alma', isActive: true },
  { id: 'lib_c5', type: 'COMPETENCY', name: 'Müşteri Odaklılık', category: 'Davranışsal', description: 'Müşteri istek ve ihtiyaçlarına öncelik verme', isActive: true },
  { id: 'lib_c6', type: 'COMPETENCY', name: 'Sonuç Odaklılık', category: 'Davranışsal', description: 'Hedeflenen sonuçlara ulaşmek için azim gösterme', isActive: true },
  
  // Beceriler (SKILL)
  { id: 'lib_s1', type: 'SKILL', name: 'B2B Satış', category: 'Ticari', description: 'Kurumsal satış süreçlerine hakimiyet', isActive: true },
  { id: 'lib_s2', type: 'SKILL', name: 'Google Analytics', category: 'Pazarlama', description: 'Web trafik analizi ve raporlama', isActive: true },
  { id: 'lib_s3', type: 'SKILL', name: 'React.js', category: 'Yazılım', description: 'Modern web uygulama geliştirme', isActive: true },
  { id: 'lib_s4', type: 'SKILL', name: 'Bordrolama', category: 'İK', description: 'Personel özlük ve bordro işlemleri', isActive: true },
  { id: 'lib_s5', type: 'SKILL', name: 'UFRS Raporlama', category: 'Finans', description: 'Uluslararası finansal raporlama standartları', isActive: true },
  { id: 'lib_s6', type: 'SKILL', name: 'SEO/SEM', category: 'Pazarlama', description: 'Arama motoru optimizasyonu ve pazarlaması', isActive: true },
  
  // Görevler (TASK)
  { id: 'lib_t1', type: 'TASK', name: 'Aylık Cihaz ve Sunucu Bakımları', category: 'IT', description: 'Sistemlerin düzenli kontrolü', isActive: true },
  { id: 'lib_t2', type: 'TASK', name: 'Aylık Satış Raporu Hazırlamak', category: 'Satış', description: 'Satış hedeflerinin ve gerçekleşenlerin raporlanması', isActive: true },
  { id: 'lib_t3', type: 'TASK', name: 'Personel Performans Değerlendirmeleri', category: 'İK', description: 'Çalışanların 3 aylık değerlendirmelerinin koordine edilmesi', isActive: true },
  { id: 'lib_t4', type: 'TASK', name: 'Yıllık Bütçe Planlaması', category: 'Finans', description: 'Şirket yıllık bütçe ve nakit akış planlaması', isActive: true },
  { id: 'lib_t5', type: 'TASK', name: 'Sosyal Medya İçerik Takvimi', category: 'Pazarlama', description: 'Haftalık/Aylık gönderi ve kampanya planlaması', isActive: true },
  { id: 'lib_t6', type: 'TASK', name: 'Müşteri İtirazlarının Yönetilmesi', category: 'Müşteri Hizmetleri', description: 'Zorlu müşteri şikayetlerinin çözüme kavuşturulması', isActive: true },
  
  // KPI (Performans Göstergeleri)
  { id: 'lib_k1', type: 'KPI', name: 'Satış Kotası Gerçekleşme Oranı (%)', category: 'Satış', description: 'Aylık satış hedefi tamamlama yüzdesi', isActive: true },
  { id: 'lib_k2', type: 'KPI', name: 'NPS (Net Promoter Score)', category: 'Pazarlama', description: 'Müşteri tavsiye skoru', isActive: true },
  { id: 'lib_k3', type: 'KPI', name: 'Çalışan Bağlılığı Skoru', category: 'İK', description: 'Yıllık anket sonucu skoru', isActive: true },
  { id: 'lib_k4', type: 'KPI', name: 'Uptimes (%)', category: 'IT', description: 'Sistemlerin ayakta kalma süresi yüzdesi', isActive: true }
];

const initialMetadataFields = [
  { id: 'mf_1', entityType: 'ROLE_TEMPLATE', name: 'Tehlike Sınıfı', type: 'LOOKUP', options: ['Az Tehlikeli', 'Tehlikeli', 'Çok Tehlikeli'], required: true },
  { id: 'mf_2', entityType: 'ROLE_TEMPLATE', name: 'Uzaktan Çalışma Uyumluluğu (%)', type: 'NUMBER', required: false },
];

const initialRoleTemplates = [
  {
    id: 'rt_sales_rep',
    name: 'B2B Satış Temsilcisi',
    jobFamily: 'Satış',
    level: 'Uzman',
    version: 1,
    createdAt: new Date().toISOString(),
    experience: 'Min. 2 Yıl',
    education: 'Lisans',
    items: [
      { libraryItemId: 'lib_t2', weight: 30 },
      { libraryItemId: 'lib_t6', weight: 20 },
      { libraryItemId: 'lib_s1', weight: 0 },
      { libraryItemId: 'lib_c3', weight: 40, isRequired: true },
      { libraryItemId: 'lib_c6', weight: 10, isRequired: true },
      { libraryItemId: 'lib_k1', weight: 0 }
    ]
  },
  {
    id: 'rt_hr_specialist',
    name: 'İnsan Kaynakları Uzmanı',
    jobFamily: 'İnsan Kaynakları',
    level: 'Uzman',
    version: 1,
    createdAt: new Date().toISOString(),
    experience: 'Min. 3 Yıl',
    education: 'Lisans (İİBF/Psikoloji)',
    items: [
      { libraryItemId: 'lib_t3', weight: 40 },
      { libraryItemId: 'lib_s4', weight: 0, isRequired: true },
      { libraryItemId: 'lib_c5', weight: 30, isRequired: true },
      { libraryItemId: 'lib_c3', weight: 30, isRequired: false },
      { libraryItemId: 'lib_k3', weight: 0 }
    ]
  },
  {
    id: 'rt_marketing_lead',
    name: 'Dijital Pazarlama Lideri',
    jobFamily: 'Pazarlama',
    level: 'Yönetici',
    version: 1,
    createdAt: new Date().toISOString(),
    experience: 'Min. 5 Yıl',
    education: 'Lisans',
    items: [
      { libraryItemId: 'lib_t5', weight: 50 },
      { libraryItemId: 'lib_s2', weight: 0, isRequired: true },
      { libraryItemId: 'lib_s6', weight: 0, isRequired: true },
      { libraryItemId: 'lib_c1', weight: 20, isRequired: true },
      { libraryItemId: 'lib_c2', weight: 30, isRequired: true },
      { libraryItemId: 'lib_k2', weight: 0 }
    ]
  }
];

export function useMetadataStorage(companyId) {
  const { currentUser } = useAuth() || {};
  const effectiveCompanyId = companyId || currentUser?.companyId || 'default';
  const prefix = `kobi_${effectiveCompanyId}`;

  const [library, setLibrary] = useState(() => {
    try {
      const item = window.localStorage.getItem(`${prefix}_ji_library`);
      const parsed = item ? JSON.parse(item) : [];
      return parsed.length > 0 ? parsed : initialLibrary;
    } catch (error) {
      return initialLibrary;
    }
  });

  const [metadataFields, setMetadataFields] = useState(() => {
    try {
      const item = window.localStorage.getItem(`${prefix}_ji_metadata`);
      const parsed = item ? JSON.parse(item) : [];
      return parsed.length > 0 ? parsed : initialMetadataFields;
    } catch (error) {
      return initialMetadataFields;
    }
  });

  const [roleTemplates, setRoleTemplates] = useState(() => {
    try {
      const item = window.localStorage.getItem(`${prefix}_ji_templates`);
      const parsed = item ? JSON.parse(item) : [];
      return parsed.length > 0 ? parsed : initialRoleTemplates;
    } catch (error) {
      return initialRoleTemplates;
    }
  });

  const [jobAnalyses, setJobAnalyses] = useState(() => {
    try {
      const item = window.localStorage.getItem(`${prefix}_ji_analyses`);
      return item ? JSON.parse(item) : [];
    } catch (error) {
      return [];
    }
  });

  // DB Sync
  useEffect(() => {
    window.localStorage.setItem(`${prefix}_ji_library`, JSON.stringify(library));
  }, [library, prefix]);

  useEffect(() => {
    window.localStorage.setItem(`${prefix}_ji_metadata`, JSON.stringify(metadataFields));
  }, [metadataFields, prefix]);

  useEffect(() => {
    window.localStorage.setItem(`${prefix}_ji_templates`, JSON.stringify(roleTemplates));
  }, [roleTemplates, prefix]);

  useEffect(() => {
    window.localStorage.setItem(`${prefix}_ji_analyses`, JSON.stringify(jobAnalyses));
  }, [jobAnalyses, prefix]);

  // Operations
  const addLibraryItem = (item) => {
    const newItem = { ...item, id: `lib_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` };
    setLibrary(prev => [...prev, newItem]);
    return newItem;
  };

  const removeLibraryItem = (id) => {
    setLibrary(prev => prev.filter(item => item.id !== id));
  };

  const addMetadataField = (field) => {
    setMetadataFields(prev => [...prev, { ...field, id: `mf_${Date.now()}` }]);
  };

  const saveRoleTemplate = (template) => {
    setRoleTemplates(prev => {
      const existing = prev.findIndex(t => t.id === template.id);
      if (existing >= 0) {
        // Version bump logic
        const updated = [...prev];
        updated[existing] = { ...template, version: (updated[existing].version || 1) + 1, updatedAt: new Date().toISOString() };
        return updated;
      }
      return [...prev, { ...template, id: `rt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, version: 1, createdAt: new Date().toISOString() }];
    });
  };

  const saveJobAnalysis = (analysis) => {
    setJobAnalyses(prev => {
      const existing = prev.findIndex(a => a.id === analysis.id);
      if(existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...analysis, updatedAt: new Date().toISOString() };
        return updated;
      }
      return [...prev, { ...analysis, id: `ja_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, createdAt: new Date().toISOString() }];
    });
  };

  // Utility functions for Setup and UI reset
  const resetToFactoryDefault = () => {
    setLibrary(initialLibrary);
    setMetadataFields(initialMetadataFields);
    setRoleTemplates(initialRoleTemplates);
    setJobAnalyses([]);
  };

  const db = {
    library, addLibraryItem, removeLibraryItem,
    metadataFields, addMetadataField,
    roleTemplates, saveRoleTemplate,
    jobAnalyses, saveJobAnalysis,
    resetToFactoryDefault // Added to allow user to reset localstorage to new defaults easily
  };

  return db;
}
