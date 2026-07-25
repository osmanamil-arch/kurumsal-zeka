/**
 * Akıllı İş Değerleme Eşleştirme Motoru (AI-Assisted)
 * İş analizi verilerini metin analizi ile değerlendirip puan önerileri üretir.
 */

const KEYWORDS = {
  f1_1: { // Öğrenim
    L1: ['lise', 'dengi', 'ortaöğretim'],
    L2: ['ön lisans', 'myo', 'meslek yüksek'],
    L3: ['lisans', 'üniversite', 'mezun'],
    L4: ['yüksek lisans', 'master', 'uzmanlık'],
    L5: ['doktora', 'phd', 'akademik']
  },
  f1_2: { // Yabancı Dil
    L2: ['okuma', 'yazışma', 'basit'],
    L3: ['mesleki literatür', 'anlama', 'iletişim'],
    L4: ['akıcı', 'teknik raporlama', 'sunum'],
    L5: ['simültane', 'müzakere', 'ana dil']
  },
  f1_4: { // Uzmanlık Derinliği
    L3: ['derinlik', 'teknik uzmanlık', 'kritik süreç'],
    L4: ['tasarım', 'mimar', 'ileri uzman'],
    L5: ['otorite', 'global uzman', 'sektörel lider']
  },
  f2_4: { // Proje / Değişim
    L3: ['proje yönetimi', 'değişim', 'pmp'],
    L4: ['portföy', 'program yönetimi', 'kompleks proje'],
    L5: ['organizasyonel dönüşüm', 'liderlik', 'stratejik değişim']
  },
  f3_4: { // Sonuç Etkisi
    L3: ['kritik rol', 'çıktı', 'performans etkisi'],
    L4: ['stratejik hedef', 'doğrudan etki', 'kurumsal başarı'],
    L5: ['hayati', 'gelecek', 'varlık sebebi']
  },
  f3_5: { // Finansal Sorumluluk
    L3: ['bütçe yönetimi', 'onay yetkisi', 'gider'],
    L4: ['yatırım', 'portföy', 'p&l'],
    L5: ['finansal vizyon', 'şirket karlılığı', 'tüm bütçe']
  },
  f3_6: { // Regülasyon ve Risk
    L3: ['yasal uyum', 'mevzuat', 'denetim'],
    L4: ['hukuki risk', 'itibar', 'kritik risk'],
    L5: ['tam uyum', 'stratejik risk', 'yasal sorumluluk']
  },
  f3_3: { // Paydaş Karmaşıklığı
    L3: ['müşteri yönetimi', 'ikna', 'çatışma'],
    L4: ['kurul', 'temsil', 'paydaş', 'üst yönetim'],
    L5: ['stratejik paydaş', 'diplomatik', 'ceo']
  },
  f3_2: { // Kişi Yönetimi (Liderlik odaklı)
    L1: ['ekip yönetimi bulunmuyor', 'bireysel katkı'],
    L2: ['yönetir', 'ekip', 'bağlı', '5 kişi', 'vardiya amiri'],
    L3: ['departman', 'şef', 'yönetici', '20 kişi', 'birim müdürü'],
    L4: ['fonksiyon', 'direktör', 'geniş ekip', 'yöneticisi'],
    L5: ['genel müdür', 'lokasyon', 'tüm şirket', 'icra kurulu']
  },
  f2_1: { // Sorun Çözme
    L1: ['rutin', 'talimat', 'basit'],
    L2: ['operasyonel sorun', 'analiz'],
    L3: ['teknik problem', 'sentez', 'uzman'],
    L4: ['stratejik çözüm', 'belirsiz', 'karmaşık'],
    L5: ['vizyoner', 'inovasyon', 'öncü']
  },
  f4_3: { // Çalışma Ortamı
    L3: ['seyahat', 'saha', 'ziyaret', 'şehir dışı'],
    L4: ['şantiye', 'toz', 'gürültü', 'tehlike'],
    L5: ['can güvenliği', 'riskli', 'aşırı']
  }
};

export const smartMapAnalysisToEvaluation = (analysis, factors) => {
  if (!analysis) return null;

  const results = {}; // factorId: { level, isAutoFilled, hasEvidence }
  
  // Tüm metin verilerini birleştirerek analiz et
  const fullText = [
    analysis.purpose,
    ...(analysis.responsibilities?.map(r => r.description) || []),
    ...(analysis.tasks?.map(t => t.title) || []),
    ...(analysis.knowledge?.map(k => k.title) || [])
  ].join(' ').toLowerCase();

  factors.forEach(mainCat => {
    mainCat.subFactors.forEach(subFactor => {
      let suggestedLevel = null;
      let hasEvidence = false;

      // 1. Keyword-based AI Analysis (Simüle edilmiş NLP)
      const factorKeywords = KEYWORDS[subFactor.id];
      if (factorKeywords) {
        for (let lv = 5; lv >= 1; lv--) {
          const keys = factorKeywords[`L${lv}`];
          if (keys && keys.some(k => fullText.includes(k))) {
            suggestedLevel = lv;
            hasEvidence = true;
            break;
          }
        }
      }

      // 2. Logic-based Mapping (Job Level vb.)
      if (!suggestedLevel) {
        if (subFactor.id === 'f1_1') { // Öğrenim
           if (analysis.jobLevelId === 'l5') suggestedLevel = 4;
           else if (analysis.jobLevelId === 'l4') suggestedLevel = 3;
           else suggestedLevel = 2;
           hasEvidence = true;
        }
      }

      results[subFactor.id] = {
        level: suggestedLevel || 1, // Bulunamazsa 1 (veya null bırakılıp uyarı verilecek)
        isAutoFilled: !!suggestedLevel,
        hasEvidence: hasEvidence || !!suggestedLevel
      };
    });
  });

  return results;
};

export const getEvidenceForFactor = (analysis, factorId) => {
  if (!analysis) return [];

  const evidence = [];
  const textSource = [
    { label: 'Pozisyon Amacı', val: analysis.purpose },
    ...(analysis.responsibilities?.map(r => ({ label: 'Sorumluluk', val: r.description })) || []),
    ...(analysis.tasks?.map(t => ({ label: 'Görev', val: t.title })) || [])
  ];

  const factorKeywords = KEYWORDS[factorId];
  if (factorKeywords) {
    const allKeys = Object.values(factorKeywords).flat();
    textSource.forEach(src => {
        if (src.val && allKeys.some(k => src.val.toLowerCase().includes(k))) {
            evidence.push(`${src.label}: ${src.val}`);
        }
    });
  }

  // Özel durumlar
  if (factorId === 'f3_2' && analysis.responsibilities) {
      const mgmt = analysis.responsibilities.filter(r => r.description.toLowerCase().includes('yönetim') || r.description.toLowerCase().includes('ekip'));
      evidence.push(...mgmt.map(m => `Yönetim Kanıtı: ${m.description}`));
  }

  return [...new Set(evidence)].slice(0, 3); // Max 3 kanıt
};
