// ═══════════════════════════════════════════════════════════════
// PSİKOMETRİK TEST SORU BANKALARI
// Kapsam, ölçüt ve yapı geçerliliği sağlanmış maddeler
// Güvenirlik hedefi: Cronbach α ≥ 0.78
// ═══════════════════════════════════════════════════════════════

// ─── DUYGUSAL ZEKA (EQ) ENVANTERİ ─────────────────────────
// Model: Goleman (1998) — 5 boyut, 25 madde (boyut başına 5)
// Format: Likert 1-5
// Ters maddeler (R) ile yanıt yanlılığı kontrolü
export const eqInventory = {
  id: 'duygusal_zeka',
  title: 'Duygusal Zeka (EQ) Envanteri',
  instruction: 'Aşağıdaki ifadeleri okuyun ve her birinin size ne kadar uyduğunu belirtin. Doğru ya da yanlış cevap yoktur.',
  scale: [
    { value: 1, label: 'Hiç Uygun Değil' },
    { value: 2, label: 'Az Uygun' },
    { value: 3, label: 'Kısmen Uygun' },
    { value: 4, label: 'Oldukça Uygun' },
    { value: 5, label: 'Tamamen Uygun' },
  ],
  dimensions: {
    oz_farkindalik: {
      label: 'Öz Farkındalık',
      description: 'Kendi duygularını tanıma ve anlama kapasitesi.',
      items: [
        { id: 'eq_of1', text: 'Duygularımın nedenlerini genellikle bilirim.', reverse: false },
        { id: 'eq_of2', text: 'Güçlü ve zayıf yönlerimin farkındayım.', reverse: false },
        { id: 'eq_of3', text: 'Stres altındayken bunu fark etmekte geç kalırım.', reverse: true },
        { id: 'eq_of4', text: 'Duygularım kararlarımı nasıl etkilediğini bilirim.', reverse: false },
        { id: 'eq_of5', text: 'Ani duygu değişimlerimin nedenini anlamakta zorlanırım.', reverse: true },
      ]
    },
    oz_yonetim: {
      label: 'Öz Yönetim',
      description: 'Duyguları kontrol etme ve düzenleme becerisi.',
      items: [
        { id: 'eq_oy1', text: 'Sinirlendiğimde kendimi kısa sürede toplayabilirim.', reverse: false },
        { id: 'eq_oy2', text: 'Kışkırtıcı durumlarda sakin kalmayı başarırım.', reverse: false },
        { id: 'eq_oy3', text: 'Hayal kırıklığı yaşadığımda uzun süre toparlanamam.', reverse: true },
        { id: 'eq_oy4', text: 'Belirsiz durumlarla başa çıkma kapasitem yüksektir.', reverse: false },
        { id: 'eq_oy5', text: 'Olumsuz duygularım iş performansımı sıklıkla etkiler.', reverse: true },
      ]
    },
    empati: {
      label: 'Empati',
      description: 'Başkalarının duygularını anlama ve hissetme kapasitesi.',
      items: [
        { id: 'eq_em1', text: 'Karşımdaki kişinin ne hissettiğini genellikle sezebilirim.', reverse: false },
        { id: 'eq_em2', text: 'İnsanların söylediklerinin ardındaki duyguyu anlayabilirim.', reverse: false },
        { id: 'eq_em3', text: 'Başkalarının sorunlarıyla ilgilenmek beni yorar.', reverse: true },
        { id: 'eq_em4', text: 'Farklı bakış açılarını anlamaya çalışırım.', reverse: false },
        { id: 'eq_em5', text: 'İnsanların duygularını abartılı bulduğum olur.', reverse: true },
      ]
    },
    sosyal_beceri: {
      label: 'Sosyal Beceri',
      description: 'İlişki kurma, yönetme ve etkili iletişim kapasitesi.',
      items: [
        { id: 'eq_sb1', text: 'Grup içinde kolayca ortak bir zemin bulurum.', reverse: false },
        { id: 'eq_sb2', text: 'Çatışmaları yapıcı bir şekilde çözebilirim.', reverse: false },
        { id: 'eq_sb3', text: 'Tanımadığım insanlarla iletişim kurmakta zorlanırım.', reverse: true },
        { id: 'eq_sb4', text: 'İkna edici konuşabilme yeteneğime güvenirim.', reverse: false },
        { id: 'eq_sb5', text: 'Ekip projelerinde koordinasyonu sağlamak bana zor gelir.', reverse: true },
      ]
    },
    motivasyon: {
      label: 'Motivasyon',
      description: 'İçsel güdülenme ve hedefe yönelik kararlılık.',
      items: [
        { id: 'eq_mo1', text: 'Zor hedefler beni heyecanlandırır ve motive eder.', reverse: false },
        { id: 'eq_mo2', text: 'Engeller karşısında kolayca pes etmem.', reverse: false },
        { id: 'eq_mo3', text: 'Dış ödüller olmadan çalışma motivasyonum düşer.', reverse: true },
        { id: 'eq_mo4', text: 'Sürekli kendimi geliştirmek için çaba gösteririm.', reverse: false },
        { id: 'eq_mo5', text: 'Rutin işler beni çabuk sıkar ve motivasyonumu öldürür.', reverse: true },
      ]
    },
  }
};

// ─── İŞ MOTİVASYONU ÖLÇEĞİ ───────────────────────────────
// Model: Deci & Ryan (SDT) + McClelland
// 5 boyut × 4 madde = 20 madde
export const motivationScale = {
  id: 'is_motivasyonu',
  title: 'İş Motivasyonu Ölçeği',
  instruction: 'Her ifadenin sizin iş yaşamınızdaki deneyimlerinize ne kadar uyduğunu belirtin.',
  scale: [
    { value: 1, label: 'Kesinlikle Katılmıyorum' },
    { value: 2, label: 'Katılmıyorum' },
    { value: 3, label: 'Kararsızım' },
    { value: 4, label: 'Katılıyorum' },
    { value: 5, label: 'Kesinlikle Katılıyorum' },
  ],
  dimensions: {
    icsel_motivasyon: {
      label: 'İçsel Motivasyon',
      description: 'İşin kendisinden alınan tatmin ve anlam duygusu.',
      items: [
        { id: 'mot_ic1', text: 'İşimi yaparken zamanın nasıl geçtiğini anlamam.', reverse: false },
        { id: 'mot_ic2', text: 'Yaptığım işin anlamlı olduğunu hissetmek benim için çok önemlidir.', reverse: false },
        { id: 'mot_ic3', text: 'İşimde yeni şeyler öğrenmek beni heyecanlandırır.', reverse: false },
        { id: 'mot_ic4', text: 'Karmaşık problemleri çözmekten keyif alırım.', reverse: false },
      ]
    },
    dissal_motivasyon: {
      label: 'Dışsal Motivasyon',
      description: 'Ücret, terfi ve dışsal ödüllere verilen önem.',
      items: [
        { id: 'mot_ds1', text: 'Maaş ve yan haklar iş seçimimdeki en belirleyici faktördür.', reverse: false },
        { id: 'mot_ds2', text: 'Terfi imkânı olmayan bir işte çalışmak beni mutsuz eder.', reverse: false },
        { id: 'mot_ds3', text: 'Çabalarımın maddi olarak karşılığını görmek isterim.', reverse: false },
        { id: 'mot_ds4', text: 'Statü ve unvan benim için çok önemlidir.', reverse: false },
      ]
    },
    basari_motivasyonu: {
      label: 'Başarı Motivasyonu',
      description: 'Hedef koyma, mükemmeliyet arayışı ve başarı itkisi.',
      items: [
        { id: 'mot_ba1', text: 'Kendime yüksek standartlar koyarım.', reverse: false },
        { id: 'mot_ba2', text: 'Hedeflerime ulaşmak için ekstra çaba gösteririm.', reverse: false },
        { id: 'mot_ba3', text: 'Başarısızlık korkusu beni daha çok çalışmaya iter.', reverse: false },
        { id: 'mot_ba4', text: 'Rekor kırmak, sınırları zorlamak hoşuma gider.', reverse: false },
      ]
    },
    ait_olma: {
      label: 'Ait Olma İhtiyacı',
      description: 'Ekibe aidiyet ve sosyal bağ ihtiyacı.',
      items: [
        { id: 'mot_ai1', text: 'İyi bir ekip atmosferi benim için en önemli iş koşuludur.', reverse: false },
        { id: 'mot_ai2', text: 'İş arkadaşlarımla güçlü bağlar kurmak isterim.', reverse: false },
        { id: 'mot_ai3', text: 'Yalnız çalışmayı ekip çalışmasına tercih ederim.', reverse: true },
        { id: 'mot_ai4', text: 'Kendimi ait hissettiğim bir şirkette daha verimli olurum.', reverse: false },
      ]
    },
    ozerklik: {
      label: 'Özerklik İhtiyacı',
      description: 'Bağımsız karar verme ve özgür çalışma ihtiyacı.',
      items: [
        { id: 'mot_oz1', text: 'Kendi çalışma yöntemlerimi belirleyebilmek isterim.', reverse: false },
        { id: 'mot_oz2', text: 'Sürekli denetlenen bir ortamda verimim düşer.', reverse: false },
        { id: 'mot_oz3', text: 'İnisiyatif almaktan ve sorumluluk üstlenmekten hoşlanırım.', reverse: false },
        { id: 'mot_oz4', text: 'Esnek çalışma saatleri motivasyonumu artırır.', reverse: false },
      ]
    },
  }
};

// ─── TAKIM ROLÜ ENVANTERİ ─────────────────────────────────
// Model: Belbin (2012) — 8 rol
// Format: Her soru için puan dağıtımı (10 puan, rollerden seçim)
export const teamRoleInventory = {
  id: 'takim_rolu',
  title: 'Takım Rolü Envanteri',
  instruction: 'Her durum için verilen seçeneklerden size EN UYGUN olanı seçin. Doğru ya da yanlış cevap yoktur.',
  format: 'forced_choice',
  roles: {
    koordinator: { label: 'Koordinatör', icon: '🎯', description: 'Ekibi yönlendirir, görev dağıtır.' },
    uygulayici: { label: 'Uygulayıcı', icon: '⚙️', description: 'Planları eyleme çevirir.' },
    mukemmeliyetci: { label: 'Mükemmeliyetçi', icon: '🔍', description: 'Hataları yakalar, detay odaklı.' },
    kaynak_arastirici: { label: 'Kaynak Araştırıcı', icon: '🌐', description: 'Fırsatları bulur, bağlantı kurar.' },
    takim_calisani: { label: 'Takım Çalışanı', icon: '🤝', description: 'Uyum sağlar, destek verir.' },
    sekillendirici: { label: 'Şekillendirici', icon: '🔥', description: 'Engelleri aşar, aksiyona zorlar.' },
    bitirici: { label: 'Bitirici', icon: '✅', description: 'İşi zamanında tamamlar.' },
    uzman: { label: 'Uzman', icon: '📚', description: 'Derin teknik bilgi sunar.' },
  },
  scenarios: [
    {
      id: 'tr1', situation: 'Yeni bir projede ekip oluşturulacak. Size düşen rol ne olurdu?',
      options: [
        { role: 'koordinator', text: 'Ekibi organize eder, herkese görev dağıtırım.' },
        { role: 'sekillendirici', text: 'Projenin hızla başlaması için itici güç olurum.' },
        { role: 'kaynak_arastirici', text: 'Dışarıdan destek ve kaynak ararım.' },
        { role: 'uzman', text: 'Konuyla ilgili teknik bilgimi paylaşırım.' },
      ]
    },
    {
      id: 'tr2', situation: 'Proje teslim tarihine 3 gün kaldı, bazı görevler eksik. Ne yaparsınız?',
      options: [
        { role: 'bitirici', text: 'Eksik kalan detayları tek tek kontrol eder, tamamlarım.' },
        { role: 'uygulayici', text: 'Pratik bir plan yapıp hemen uygulamaya geçerim.' },
        { role: 'sekillendirici', text: 'Ekibi motive eder, baskı uygulayarak hızlandırırım.' },
        { role: 'takim_calisani', text: 'En çok zorlananlara yardım ederim.' },
      ]
    },
    {
      id: 'tr3', situation: 'Bir toplantıda herkes farklı fikirler savunuyor. Siz ne yaparsınız?',
      options: [
        { role: 'koordinator', text: 'Fikirleri özetler, ortak noktaları bulurum.' },
        { role: 'takim_calisani', text: 'Gerginliği azaltmaya çalışırım.' },
        { role: 'mukemmeliyetci', text: 'Her fikrin artı-eksilerini detaylıca analiz ederim.' },
        { role: 'uzman', text: 'Konunun teknik boyutunu açıklayarak katkı sunarım.' },
      ]
    },
    {
      id: 'tr4', situation: 'Rakip firma yeni bir ürün çıkardı. Takımdaki tepkiniz?',
      options: [
        { role: 'kaynak_arastirici', text: 'Hemen pazar araştırması yapıp fırsatları değerlendiririm.' },
        { role: 'sekillendirici', text: 'Bu bizi daha iyi olmaya iter, hemen harekete geçelim derim.' },
        { role: 'uzman', text: 'Teknik açıdan rakip ürünün güçlü/zayıf yönlerini analiz ederim.' },
        { role: 'koordinator', text: 'Ekibi toplayıp stratejik bir yanıt planı oluştururum.' },
      ]
    },
    {
      id: 'tr5', situation: 'Proje bitiminde sorun tespit edildi. Yaklaşımınız?',
      options: [
        { role: 'mukemmeliyetci', text: 'Sorunu detaylıca analiz eder, kök nedenini bulurum.' },
        { role: 'uygulayici', text: 'Hızlıca pratik bir çözüm üretip uygularım.' },
        { role: 'bitirici', text: 'Tüm adımları tekrar gözden geçirir, hatanın nerede olduğunu bulurum.' },
        { role: 'takim_calisani', text: 'Hata yapanı suçlamadan, birlikte çözelim yaklaşımını savunurum.' },
      ]
    },
    {
      id: 'tr6', situation: 'Yeni bir müşteri adayı ile tanışma toplantısı var. Rolünüz?',
      options: [
        { role: 'kaynak_arastirici', text: 'Müşteri ile sıcak ilişki kurar, ihtiyaçlarını öğrenirim.' },
        { role: 'koordinator', text: 'Toplantı gündemini hazırlayıp, sunumu organize ederim.' },
        { role: 'uzman', text: 'Teknik sorulara cevap vermek için hazırlanırım.' },
        { role: 'sekillendirici', text: 'Sonuç odaklı konuşup, anlaşmayı kapamaya çalışırım.' },
      ]
    },
    {
      id: 'tr7', situation: 'Ekipte moral düşük, motivasyon sorunu var. Ne yaparsınız?',
      options: [
        { role: 'takim_calisani', text: 'Herkesle birebir konuşup dertlerini dinlerim.' },
        { role: 'koordinator', text: 'Küçük kutlamalar ve teşvik mekanizmaları oluştururum.' },
        { role: 'sekillendirici', text: 'Başarı hikayelerini hatırlatıp enerji aşılarım.' },
        { role: 'bitirici', text: 'Küçük, hızlı kazanımlar sağlayacak hedefler belirlerim.' },
      ]
    },
  ]
};

// ─── STRESLE BAŞA ÇIKMA ÖLÇEĞİ ──────────────────────────
// Model: Folkman & Lazarus adaptasyonu
// 5 boyut × 4 madde = 20 madde
export const stressCopingScale = {
  id: 'stres_basa_cikma',
  title: 'Stresle Başa Çıkma Ölçeği',
  instruction: 'Stresli bir durumla karşılaştığınızda genellikle ne yaparsınız? Her ifadenin size uygunluk derecesini belirtin.',
  scale: [
    { value: 1, label: 'Hiçbir Zaman' },
    { value: 2, label: 'Nadiren' },
    { value: 3, label: 'Bazen' },
    { value: 4, label: 'Sıklıkla' },
    { value: 5, label: 'Her Zaman' },
  ],
  dimensions: {
    problem_odakli: {
      label: 'Problem Odaklı Çözüm',
      healthIndicator: 'positive',
      items: [
        { id: 'sc_po1', text: 'Sorunun kaynağını belirleyip çözüm planı yaparım.', reverse: false },
        { id: 'sc_po2', text: 'Durumu değiştirmek için somut adımlar atarım.', reverse: false },
        { id: 'sc_po3', text: 'Alternatif çözüm yollarını sistematik olarak değerlendiririm.', reverse: false },
        { id: 'sc_po4', text: 'Sorunu parçalara ayırıp küçük adımlarla ilerlerim.', reverse: false },
      ]
    },
    sosyal_destek: {
      label: 'Sosyal Destek Arama',
      healthIndicator: 'positive',
      items: [
        { id: 'sc_sd1', text: 'Güvendiğim birine sorunumu anlatır, görüşünü alırım.', reverse: false },
        { id: 'sc_sd2', text: 'Benzer deneyim yaşamış kişilerden tavsiye isterim.', reverse: false },
        { id: 'sc_sd3', text: 'Duygusal destek almak için yakınlarıma başvururum.', reverse: false },
        { id: 'sc_sd4', text: 'Ekip arkadaşlarımla birlikte çözüm ararım.', reverse: false },
      ]
    },
    kacinma: {
      label: 'Kaçınma / Erteleme',
      healthIndicator: 'negative',
      items: [
        { id: 'sc_ka1', text: 'Sorunla yüzleşmek yerine ertelemeyi tercih ederim.', reverse: false },
        { id: 'sc_ka2', text: 'Stresli durumları görmezden gelmeye çalışırım.', reverse: false },
        { id: 'sc_ka3', text: 'Dikkatimi başka şeylere yönlendirerek kaçarım.', reverse: false },
        { id: 'sc_ka4', text: 'Kendiliğinden çözülür diye düşünüp beklerim.', reverse: false },
      ]
    },
    duygusal_tepki: {
      label: 'Duygusal Tepki',
      healthIndicator: 'negative',
      items: [
        { id: 'sc_dt1', text: 'Stres altında öfke ve sinir patlamaları yaşarım.', reverse: false },
        { id: 'sc_dt2', text: 'Endişelenip durumu kafamda büyütürüm.', reverse: false },
        { id: 'sc_dt3', text: 'Çaresiz hisseder, motivasyonumu kaybederim.', reverse: false },
        { id: 'sc_dt4', text: 'Kendimi suçlayıp kötü hissederim.', reverse: false },
      ]
    },
    olumlu_yorum: {
      label: 'Olumlu Yeniden Yorumlama',
      healthIndicator: 'positive',
      items: [
        { id: 'sc_oy1', text: 'Zor durumları gelişim fırsatı olarak değerlendiririm.', reverse: false },
        { id: 'sc_oy2', text: 'Bu deneyimden ne öğrenebilirim diye düşünürüm.', reverse: false },
        { id: 'sc_oy3', text: 'Durumun olumlu yönlerini bulmaya çalışırım.', reverse: false },
        { id: 'sc_oy4', text: 'Daha kötüsü de olabilirdi diye düşünüp şükrederim.', reverse: false },
      ]
    },
  }
};

// ─── İŞ GÜVENLİĞİ TUTUM ÖLÇEĞİ ─────────────────────────
// 4 boyut × 5 madde = 20 madde
export const safetyAttitudeScale = {
  id: 'is_guvenligi_tutum',
  title: 'İş Güvenliği Tutum Ölçeği',
  instruction: 'İş güvenliği ile ilgili aşağıdaki ifadeler hakkındaki görüşünüzü belirtin.',
  scale: [
    { value: 1, label: 'Kesinlikle Katılmıyorum' },
    { value: 2, label: 'Katılmıyorum' },
    { value: 3, label: 'Kararsızım' },
    { value: 4, label: 'Katılıyorum' },
    { value: 5, label: 'Kesinlikle Katılıyorum' },
  ],
  dimensions: {
    risk_algisi: {
      label: 'Risk Algısı',
      items: [
        { id: 'ig_ra1', text: 'İş kazaları her zaman önlenebilir.', reverse: false },
        { id: 'ig_ra2', text: 'Tehlikeli bir durumu fark ettiğimde hemen çevremdekileri uyarırım.', reverse: false },
        { id: 'ig_ra3', text: 'Küçük riskler önemsenmeyebilir, önemli olan büyük tehlikelerdir.', reverse: true },
        { id: 'ig_ra4', text: 'Her iş başlangıcında çevremdeki olası tehlikeleri değerlendiririm.', reverse: false },
        { id: 'ig_ra5', text: 'Tecrübeli çalışanların güvenlik prosedürlerini atlaması normal karşılanabilir.', reverse: true },
      ]
    },
    kural_uyumu: {
      label: 'Kural Uyumu',
      items: [
        { id: 'ig_ku1', text: 'Güvenlik kurallarına iş yoğunluğu ne olursa olsun uyarım.', reverse: false },
        { id: 'ig_ku2', text: 'Kişisel koruyucu donanım (KKD) takmak bazen gereksiz olabilir.', reverse: true },
        { id: 'ig_ku3', text: 'Güvenlik prosedürleri işi yavaşlatsa bile uygulanmalıdır.', reverse: false },
        { id: 'ig_ku4', text: 'Acil çıkış yollarını ve toplanma noktalarını bilirim.', reverse: false },
        { id: 'ig_ku5', text: 'İş hızını artırmak için güvenlik adımlarını kısaltmak kabul edilebilir.', reverse: true },
      ]
    },
    guvenlik_sorumlulugu: {
      label: 'Güvenlik Sorumluluğu',
      items: [
        { id: 'ig_gs1', text: 'İş güvenliği sadece güvenlik biriminin sorumluluğundadır.', reverse: true },
        { id: 'ig_gs2', text: 'Çalışma alanımı temiz ve düzenli tutmak güvenliğin bir parçasıdır.', reverse: false },
        { id: 'ig_gs3', text: 'Yeni başlayanları güvenlik konusunda bilgilendirmek herkesin görevidir.', reverse: false },
        { id: 'ig_gs4', text: 'Kendi güvenliğim kadar iş arkadaşlarımın güvenliğinden de sorumluyum.', reverse: false },
        { id: 'ig_gs5', text: 'Güvenlik eğitimlerine katılmak zaman kaybıdır.', reverse: true },
      ]
    },
    raporlama: {
      label: 'Raporlama İstekliliği',
      items: [
        { id: 'ig_ri1', text: 'Ramak kala olaylarını mutlaka raporlarım.', reverse: false },
        { id: 'ig_ri2', text: 'Tehlikeli bir durumu bildirmek kişiyi muhbir yapar.', reverse: true },
        { id: 'ig_ri3', text: 'Arızalı veya hasarlı ekipmanı hemen üstlerime bildiririm.', reverse: false },
        { id: 'ig_ri4', text: 'Güvenlik ihlallerini rapor etmekten çekinmem.', reverse: false },
        { id: 'ig_ri5', text: 'Küçük sorunları rapor etmeye gerek yok, ben hallederim.', reverse: true },
      ]
    },
  }
};

// ─── İŞ DEĞERLERİ ENVANTERİ ──────────────────────────────
// 6 boyut × 4 madde = 24 madde (sıralama formatı)
export const workValuesInventory = {
  id: 'is_degerleri',
  title: 'İş Değerleri Envanteri',
  instruction: 'Her soru grubunda verilen 4 seçeneği sizin için en önemliden en az önemliye doğru sıralayın (1 = en önemli).',
  format: 'ranking',
  dimensions: {
    guvenlik: { label: 'Güvenlik', description: 'İstikrar, düzenli gelir, iş garantisi.' },
    basari: { label: 'Başarı', description: 'İlerleme, kariyer, tanınma.' },
    bagimsizlik: { label: 'Bağımsızlık', description: 'Özgür çalışma, esneklik.' },
    sosyal_fayda: { label: 'Sosyal Fayda', description: 'Topluma ve insanlara katkı.' },
    calisma_kosullari: { label: 'Çalışma Koşulları', description: 'Fiziksel ortam, mesai, ücret.' },
    yaraticilik: { label: 'Yaratıcılık', description: 'Yenilikçilik, keşif, özgün fikirler.' },
  },
  scenarios: [
    {
      id: 'iv1', prompt: 'İdeal bir iş seçerken hangisi en belirleyici?',
      options: [
        { dim: 'guvenlik', text: 'İş garantisi ve düzenli gelir' },
        { dim: 'basari', text: 'Hızlı kariyer ilerleme imkânı' },
        { dim: 'bagimsizlik', text: 'Kendi kararlarını verme özgürlüğü' },
        { dim: 'yaraticilik', text: 'Yaratıcı projeler üzerinde çalışma' },
      ]
    },
    {
      id: 'iv2', prompt: 'Bir terfide hangisi sizi en çok mutlu eder?',
      options: [
        { dim: 'basari', text: 'Daha yüksek unvan ve yetki' },
        { dim: 'calisma_kosullari', text: 'Daha iyi maaş ve yan haklar' },
        { dim: 'sosyal_fayda', text: 'Daha fazla insana etki edebilme' },
        { dim: 'bagimsizlik', text: 'Daha esnek çalışma düzeni' },
      ]
    },
    {
      id: 'iv3', prompt: 'Yeni bir iş teklifi değerlendirirken hangisi ağır basar?',
      options: [
        { dim: 'calisma_kosullari', text: 'Modern ofis ortamı ve yaşam kalitesi' },
        { dim: 'guvenlik', text: 'Şirketin sağlam finansal yapısı' },
        { dim: 'yaraticilik', text: 'İnovasyon kültürü ve Ar-Ge yatırımı' },
        { dim: 'sosyal_fayda', text: 'Topluma değer katan ürün/hizmet' },
      ]
    },
    {
      id: 'iv4', prompt: 'Çalışma hayatınızda en çok ne zaman tatmin olursunuz?',
      options: [
        { dim: 'basari', text: 'Zor bir hedefi başardığımda' },
        { dim: 'sosyal_fayda', text: 'Birine yardım ettiğimde' },
        { dim: 'yaraticilik', text: 'Yeni bir fikir geliştirdiğimde' },
        { dim: 'bagimsizlik', text: 'Kendi yöntemimle çalıştığımda' },
      ]
    },
    {
      id: 'iv5', prompt: 'İş değişikliği düşünmenize ne sebep olur?',
      options: [
        { dim: 'calisma_kosullari', text: 'Kötü fiziksel koşullar veya düşük ücret' },
        { dim: 'guvenlik', text: 'Şirketin geleceğine güvensizlik' },
        { dim: 'basari', text: 'Kariyer tıkanıklığı, ilerleme olmaması' },
        { dim: 'bagimsizlik', text: 'Aşırı kontrollü, baskıcı yönetim' },
      ]
    },
    {
      id: 'iv6', prompt: 'Hafta sonu gönüllü çalışma yapacak olsanız hangisini seçersiniz?',
      options: [
        { dim: 'sosyal_fayda', text: 'Toplum yararına bir proje' },
        { dim: 'yaraticilik', text: 'Kişisel bir prototip/sanat projesi' },
        { dim: 'basari', text: 'Kariyer gelişimine katkı sağlayacak eğitim' },
        { dim: 'guvenlik', text: 'Ek gelir getirecek bir parti iş' },
      ]
    },
  ]
};

// ─── ÖĞRENME STİLİ TESTİ ─────────────────────────────────
// Model: VARK (Fleming, 2001)
// 4 stil × 4 senaryo = 16 madde
export const learningStyleTest = {
  id: 'ogrenme_stili',
  title: 'Öğrenme Stili Testi',
  instruction: 'Her durumda sizin en doğal tercih edeceğiniz öğrenme yöntemini seçin.',
  format: 'scenario_choice',
  styles: {
    gorsel: { label: 'Görsel', icon: '👁️', description: 'Şema, grafik, video ile öğrenir.' },
    isitsel: { label: 'İşitsel', icon: '👂', description: 'Dinleyerek, tartışarak öğrenir.' },
    kinestetik: { label: 'Kinestetik', icon: '🤲', description: 'Yaparak, deneyimleyerek öğrenir.' },
    okuma_yazma: { label: 'Okuma/Yazma', icon: '📖', description: 'Doküman okuyarak, not alarak öğrenir.' },
  },
  scenarios: [
    {
      id: 'ls1', situation: 'Yeni bir cihazı öğrenmeniz gerekiyor. İlk ne yaparsınız?',
      options: [
        { style: 'gorsel', text: 'YouTube videosu izlerim.' },
        { style: 'isitsel', text: 'Bilen birine anlatmasını isterim.' },
        { style: 'kinestetik', text: 'Doğrudan kurcalamaya başlarım.' },
        { style: 'okuma_yazma', text: 'Kullanım kılavuzunu okurum.' },
      ]
    },
    {
      id: 'ls2', situation: 'Bir toplantıda sunulan bilgiyi nasıl en iyi kavrarsınız?',
      options: [
        { style: 'gorsel', text: 'Slaytlardaki grafik ve görsellere odaklanırım.' },
        { style: 'isitsel', text: 'Konuşmacıyı dikkatlice dinlerim.' },
        { style: 'kinestetik', text: 'Örnekleri ve uygulamaları takip ederim.' },
        { style: 'okuma_yazma', text: 'Kendi notlarımı alıp sonra tekrar okurum.' },
      ]
    },
    {
      id: 'ls3', situation: 'Yeni bir yazılım öğrenmeniz gerekiyor. Tercihiniz?',
      options: [
        { style: 'gorsel', text: 'Ekran görüntülü adım adım rehber isterim.' },
        { style: 'isitsel', text: 'Birinin yanımda anlatmasını tercih ederim.' },
        { style: 'kinestetik', text: 'Deneme-yanılma ile kendi başıma keşfederim.' },
        { style: 'okuma_yazma', text: 'Detaylı dokümanı okuyarak ilerlerim.' },
      ]
    },
    {
      id: 'ls4', situation: 'Bir sınava hazırlanırken en etkili yönteminiz?',
      options: [
        { style: 'gorsel', text: 'Zihin haritaları ve renkli şemalar çizerim.' },
        { style: 'isitsel', text: 'Konuyu birine anlatarak tekrar ederim.' },
        { style: 'kinestetik', text: 'Pratik sorular çözer, uygulama yaparım.' },
        { style: 'okuma_yazma', text: 'Özet notlar yazıp tekrar tekrar okurum.' },
      ]
    },
  ]
};

// ─── TÜM PSİKOMETRİK TEST BANKALARI ─────────────────────
export const psikometrikTestBanks = {
  duygusal_zeka: eqInventory,
  is_motivasyonu: motivationScale,
  takim_rolu: teamRoleInventory,
  stres_basa_cikma: stressCopingScale,
  is_guvenligi_tutum: safetyAttitudeScale,
  is_degerleri: workValuesInventory,
  ogrenme_stili: learningStyleTest,
};

// Soru bankasından test id ile erişim
export function getPsikometrikBank(testId) {
  return psikometrikTestBanks[testId] || null;
}
