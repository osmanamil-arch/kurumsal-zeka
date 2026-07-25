export const hierarchicalFactors = [
  {
    id: 'cat1',
    name: 'Donanım ve Gereklilikler',
    weight: 20,
    subFactors: [
      {
        id: 'f1_1',
        name: 'Öğrenim',
        weight: 25,
        description: 'İşin icrası için gereken minimum akademik eğitim düzeyi.',
        levels: [
          { level: 1, points: 20, description: 'Lise veya dengi okul.' },
          { level: 2, points: 40, description: 'Ön Lisans / Meslek Yüksek Okulu.' },
          { level: 3, points: 60, description: 'Lisans derecesi.' },
          { level: 4, points: 80, description: 'Yüksek Lisans / Uzmanlık.' },
          { level: 5, points: 100, description: 'Doktora veya çok spesifik akademik uzmanlık.' }
        ]
      },
      {
        id: 'f1_2',
        name: 'Yabancı Dil',
        weight: 15,
        description: 'İşin icrası için gereken dil yetkinliği düzeyi.',
        levels: [
          { level: 1, points: 0, description: 'Gerekmiyor.' },
          { level: 2, points: 30, description: 'Okuma ve basit yazışma.' },
          { level: 3, points: 60, description: 'Mesleki literatürü takip.' },
          { level: 4, points: 80, description: 'Akıcı konuşma / Teknik raporlama.' },
          { level: 5, points: 100, description: 'Simültane / Üst düzey müzakere.' }
        ]
      },
      {
        id: 'f1_3',
        name: 'Deneyim',
        weight: 30,
        description: 'İşe başlamadan önceki uzmanlık ve sektör tecrübesi süresi.',
        levels: [
          { level: 1, points: 20, description: '0-1 yıl.' },
          { level: 2, points: 40, description: '1-3 yıl.' },
          { level: 3, points: 60, description: '3-5 yıl.' },
          { level: 4, points: 80, description: '5-10 yıl.' },
          { level: 5, points: 100, description: '10 yıl üzeri.' }
        ]
      },
      {
        id: 'f1_4',
        name: 'Uzmanlık Derinliği (Know-how)',
        weight: 30,
        description: 'Teknik/mesleki derinlik ve uzmanlık nadirliği (Yıldan bağımsız).',
        levels: [
          { level: 1, points: 20, description: 'Temel düzey operasyonel bilgi.' },
          { level: 2, points: 40, description: 'Geniş kapsamlı standart süreç bilgisi.' },
          { level: 3, points: 60, description: 'Kritik süreçlerde uzmanlık derinliği.' },
          { level: 4, points: 80, description: 'Karmaşık sistemlerin tasarımı / ileri uzmanlık.' },
          { level: 5, points: 100, description: 'Uluslararası / Sektörel otorite düzeyinde derinlik.' }
        ]
      }
    ]
  },
  {
    id: 'cat2',
    name: 'Zihinsel Süreçler ve Yetkinlik',
    weight: 20,
    subFactors: [
      {
        id: 'f2_1',
        name: 'Sorun Çözme ve Yaratıcılık',
        weight: 30,
        description: 'Karşılaşılan engellerin zorluğu ve yeni çözüm üretme gereği.',
        levels: [
          { level: 1, points: 20, description: 'Rutin ve tanımlı işler.' },
          { level: 2, points: 40, description: 'Operasyonel sorun analizi.' },
          { level: 3, points: 60, description: 'Teknik sentez ve çözüm üretme.' },
          { level: 4, points: 80, description: 'Stratejik ve belirsiz sorun yönetimi.' },
          { level: 5, points: 100, description: 'Kurumsal vizyon yaratan inovasyon.' }
        ]
      },
      {
        id: 'f2_2',
        name: 'İnsiyatif ve Karar Özgürlüğü',
        weight: 25,
        description: 'Onay almadan karar alabilme ve uygulama özgürlüğü düzeyi.',
        levels: [
          { level: 1, points: 20, description: 'Sadece icra yöntemi kararları.' },
          { level: 2, points: 40, description: 'Bölüm içi sınırlı operasyonel yetki.' },
          { level: 3, points: 60, description: 'Departman hedeflerini etkileyen taktiksel yetki.' },
          { level: 4, points: 80, description: 'Geniş fonksiyonel yetki ve politika belirleme.' },
          { level: 5, points: 100, description: 'Tam kurumsal temsil ve nihai karar yetkisi.' }
        ]
      },
      {
        id: 'f2_3',
        name: 'Zihinsel Çaba',
        weight: 20,
        description: 'Odaklanma, analiz ve dikkat yoğunluğu gereği.',
        levels: [
          { level: 1, points: 20, description: 'Düşük konsantrasyon.' },
          { level: 2, points: 40, description: 'Sürekli operasyonel takip.' },
          { level: 3, points: 60, description: 'Yoğun veri ve raporlama.' },
          { level: 4, points: 80, description: 'Çoklu karmaşık değişken yönetimi.' },
          { level: 5, points: 100, description: 'Aşırı baskı altında kritik analiz.' }
        ]
      },
      {
        id: 'f2_4',
        name: 'Proje / Değişim Yönetimi',
        weight: 25,
        description: 'Belirsizlik altında proje yürütme ve organizasyonel dönüşüm kapasitesi.',
        levels: [
          { level: 1, points: 20, description: 'Küçük ölçekli rutin görev takibi.' },
          { level: 2, points: 40, description: 'Departman içi proje ekiplerinde rol alma.' },
          { level: 3, points: 60, description: 'Kritik projelerin yönetimi / Değişim öncülüğü.' },
          { level: 4, points: 80, description: 'Çoklu/Kompleks proje portföy yönetimi.' },
          { level: 5, points: 100, description: 'Organizasyonel dönüşümün tasarımı ve liderliği.' }
        ]
      }
    ]
  },
  {
    id: 'cat3',
    name: 'Sorumluluklar',
    weight: 40,
    subFactors: [
      {
        id: 'f3_1',
        name: 'Gözetim (Operasyon/Süreç)',
        weight: 15,
        description: 'İş süreçlerinin operasyonel takibi ve sürekliliği (Sonuç etkisi hariç).',
        levels: [
          { level: 1, points: 20, description: 'Kendi görev takibi.' },
          { level: 2, points: 40, description: 'Alt birim süreç takibi.' },
          { level: 3, points: 60, description: 'Departman süreç sorumluluğu.' },
          { level: 4, points: 80, description: 'Fonksiyonel süreç tasarımı.' },
          { level: 5, points: 100, description: 'Kurum genel süreç mimarisi sorumluluğu.' }
        ]
      },
      {
        id: 'f3_2',
        name: 'Liderlik ve Yönetim Karmaşıklığı',
        weight: 20,
        description: 'Ekip büyüklüğü, liderlik kapsamı ve yönetimsel karmaşıklık.',
        levels: [
          { level: 1, points: 0, description: 'Yönetim sorumluluğu yok.' },
          { level: 2, points: 40, description: 'Operasyonel ekip liderliği.' },
          { level: 3, points: 60, description: 'Yöneticileri yönetme / Departman liderliği.' },
          { level: 4, points: 80, description: 'Geniş/Çok fonksiyonlu organizasyon yönetimi.' },
          { level: 5, points: 100, description: 'Kurumsal liderlik / Çoklu lokasyon / Stratejik yönetim.' }
        ]
      },
      {
        id: 'f3_3',
        name: 'Paydaş Karmaşıklığı ve İlişkiler',
        weight: 15,
        description: 'Çatışma yönetimi, çoklu paydaş ve üst yönetim etkileşim gereği.',
        levels: [
          { level: 1, points: 20, description: 'Rutin birim içi iletişim.' },
          { level: 2, points: 40, description: 'Bölümler arası koordinasyon / Çözüm odaklılık.' },
          { level: 3, points: 60, description: 'Kritik müşteri/tedarikçi yönetimi / İkna süreçleri.' },
          { level: 4, points: 80, description: 'Resmi makamlar / Kurul düzeyinde temsil ve etkileşim.' },
          { level: 5, points: 100, description: 'Üst düzey diplomatik / stratejik paydaş yönetimi.' }
        ]
      },
      {
        id: 'f3_4',
        name: 'Sonuç Etkisi (Impact)',
        weight: 20,
        description: 'Rolün finansal sonuçlara, operasyonel çıktılara ve kurumsal performansa etkisi.',
        levels: [
          { level: 1, points: 20, description: 'Lokal/Kısıtlı etki.' },
          { level: 2, points: 40, description: 'Bölüm hedefleri üzerinde belirgin etki.' },
          { level: 3, points: 60, description: 'Departman/Fonksiyon başarısında kritik rol.' },
          { level: 4, points: 80, description: 'Kurumsal stratejik hedefler üzerinde doğrudan etki.' },
          { level: 5, points: 100, description: 'Kurumun varlığı ve geleceği üzerinde hayati etki.' }
        ]
      },
      {
        id: 'f3_5',
        name: 'Finansal Sorumluluk',
        weight: 15,
        description: 'Bütçe yönetimi, P&L etkisi ve yatırım karar yetkisi.',
        levels: [
          { level: 1, points: 0, description: 'Finansal yetki yok.' },
          { level: 2, points: 40, description: 'Küçük operasyonel bütçe takibi.' },
          { level: 3, points: 60, description: 'Birim/Departman bütçe yönetimi ve onayı.' },
          { level: 4, points: 80, description: 'Geniş bütçe/yatırım portföy yönetimi.' },
          { level: 5, points: 100, description: 'Şirket genel finansal vizyonu ve P&L yönetimi.' }
        ]
      },
      {
        id: 'f3_6',
        name: 'Regülasyon ve Risk Sorumluluğu',
        weight: 15,
        description: 'Yasal uyum, denetim yükü ve hata durumunda doğacak kurumsal riskler.',
        levels: [
          { level: 1, points: 20, description: 'Düşük riskli standart işler.' },
          { level: 2, points: 40, description: 'Hatanın telafi edilebildiği operasyonel riskler.' },
          { level: 3, points: 60, description: 'Yasal uyum ve denetim gerektiren süreçler.' },
          { level: 4, points: 80, description: 'Kritik finansal/hukuki/itibari risk yönetimi.' },
          { level: 5, points: 100, description: 'Yüksek stratejik/yasal risk ve tam uyum sorumluluğu.' }
        ]
      }
    ]
  },
  {
    id: 'cat4',
    name: 'Zorluklar ve Çaba',
    weight: 10,
    subFactors: [
      {
        id: 'f4_1',
        name: 'Bedensel Çaba',
        weight: 20,
        levels: [
          { level: 1, points: 20, description: 'Hafif ofis.' },
          { level: 2, points: 40, description: 'Yarı hareketli.' },
          { level: 3, points: 60, description: 'Sürekli ayakta.' },
          { level: 4, points: 80, description: 'Ağır bedensel.' },
          { level: 5, points: 100, description: 'Aşırı güç.' }
        ]
      },
      {
        id: 'f4_2',
        name: 'Duygusal Çaba',
        weight: 50,
        levels: [
          { level: 1, points: 20, description: 'Düşük stres.' },
          { level: 2, points: 40, description: 'Dönemsel baskı.' },
          { level: 3, points: 60, description: 'Sürekli kriz/temas.' },
          { level: 4, points: 80, description: 'Yüksek risk/stres.' },
          { level: 5, points: 100, description: 'Aşırı psikolojik baskı.' }
        ]
      },
      {
        id: 'f4_3',
        name: 'Çalışma Ortamı',
        weight: 30,
        levels: [
          { level: 1, points: 20, description: 'Konforlu ofis.' },
          { level: 2, points: 40, description: 'Gürültü/Seyahat.' },
          { level: 3, points: 60, description: 'Riskli saha.' },
          { level: 4, points: 80, description: 'Uç sıcaklık/tehlike.' },
          { level: 5, points: 100, description: 'Can güvenliği riski.' }
        ]
      }
    ]
  },
  {
    id: 'cat5',
    name: 'Stratejik Değer',
    weight: 10,
    subFactors: [
      {
        id: 'f5_1',
        name: 'İkame Güçlüğü (Piyasa)',
        weight: 100,
        description: 'Piyasa nadirliği ve yetiştirme süresi (Uzmanlık derinliği hariç).',
        levels: [
          { level: 1, points: 20, description: 'Kolay bulunur / Yetişir.' },
          { level: 2, points: 40, description: '3-6 ayda yetişebilir.' },
          { level: 3, points: 60, description: 'Nadir aday / 1 yıl yetiştirme.' },
          { level: 4, points: 80, description: 'Çok nadir / Kritik piyasa kıtlığı.' },
          { level: 5, points: 100, description: 'Global nadirlik / Stratejik kıtlık.' }
        ]
      }
    ]
  }
];

export const initialJobEvaluations = [];
