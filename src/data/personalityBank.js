// SELECTEST — KİŞİLİK TESTİ (Big Five modeli)
// 5 boyut × 6 ifade = 30 Likert ölçekli ifade
// Puanlama: 1=Kesinlikle Katılmıyorum ... 5=Kesinlikle Katılıyorum
// (R) = Ters puanlama

export const personalityBank = {
  duygusal_dengelilik: {
    label: 'Duygusal Dengelilik',
    description: 'Stres altında sakin kalma ve duygusal dengeyi koruma yeteneği.',
    items: [
      { id:'dd1', text:'Stresli durumlarda sakin kalmayı başarırım.', reverse: false },
      { id:'dd2', text:'Beklenmedik sorunlar karşısında panik yaparım.', reverse: true },
      { id:'dd3', text:'Eleştirildiğimde duygusal tepki vermeden düşünebilirim.', reverse: false },
      { id:'dd4', text:'Küçük aksaklıklar bile beni sinirlendirir.', reverse: true },
      { id:'dd5', text:'Zor zamanlarda bile olumlu düşünmeyi sürdürebilirim.', reverse: false },
      { id:'dd6', text:'Hata yaptığımda uzun süre kendimi suçlarım.', reverse: true },
    ]
  },
  disa_donukluk: {
    label: 'Dışa Dönüklük',
    description: 'Sosyal etkileşimlerden hoşlanma ve enerjiyi dış dünyadan alma eğilimi.',
    items: [
      { id:'di1', text:'Yeni insanlarla tanışmaktan keyif alırım.', reverse: false },
      { id:'di2', text:'Kalabalık ortamlarda enerjim düşer.', reverse: true },
      { id:'di3', text:'Toplantılarda fikirlerimi rahatlıkla paylaşırım.', reverse: false },
      { id:'di4', text:'Yalnız çalışmayı tercih ederim.', reverse: true },
      { id:'di5', text:'Sosyal etkinliklere katılmak beni mutlu eder.', reverse: false },
      { id:'di6', text:'Tanımadığım insanlarla sohbet etmek beni tedirgin eder.', reverse: true },
    ]
  },
  deneyime_aciklik: {
    label: 'Deneyime Açıklık',
    description: 'Yeni deneyimlere ve fikirlere açık olma durumu.',
    items: [
      { id:'da1', text:'Farklı kültürleri ve yaşam biçimlerini keşfetmek isterim.', reverse: false },
      { id:'da2', text:'Rutinlerimden çıkmak beni rahatsız eder.', reverse: true },
      { id:'da3', text:'Yaratıcı çözümler bulmayı severim.', reverse: false },
      { id:'da4', text:'Kanıtlanmış yöntemleri yeni fikirlere tercih ederim.', reverse: true },
      { id:'da5', text:'Sanat ve estetik beni derinden etkiler.', reverse: false },
      { id:'da6', text:'Hayal kurmayı zaman kaybı olarak görürüm.', reverse: true },
    ]
  },
  yumusak_baslilik: {
    label: 'Yumuşak Başlılık',
    description: 'Uyumlu, uzlaşmacı ve başkalarına karşı anlayışlı olma eğilimi.',
    items: [
      { id:'yb1', text:'Tartışmalarda karşı tarafı önce dinlerim.', reverse: false },
      { id:'yb2', text:'Haklı olduğumda taviz vermem.', reverse: true },
      { id:'yb3', text:'Ekip arkadaşlarımın ihtiyaçlarını önemserim.', reverse: false },
      { id:'yb4', text:'Rekabetçi ortamları işbirliğine tercih ederim.', reverse: true },
      { id:'yb5', text:'Başkalarının hatalarına anlayışla yaklaşırım.', reverse: false },
      { id:'yb6', text:'İnsanların niyetlerine şüpheyle yaklaşırım.', reverse: true },
    ]
  },
  sorumluluk: {
    label: 'Sorumluluk',
    description: 'Görev ve yükümlülükleri ciddiye alma ve yerine getirme becerisi.',
    items: [
      { id:'sr1', text:'İşlerimi planlayarak ve organize bir şekilde yaparım.', reverse: false },
      { id:'sr2', text:'Son dakikaya bırakmak benim tarzımdır.', reverse: true },
      { id:'sr3', text:'Verdiğim sözleri mutlaka tutarım.', reverse: false },
      { id:'sr4', text:'Detaylara dikkat etmek yerine büyük resme odaklanırım.', reverse: true },
      { id:'sr5', text:'Zamanında teslim etmek benim için çok önemlidir.', reverse: false },
      { id:'sr6', text:'Kurallara uymak yerine esnek davranmayı tercih ederim.', reverse: true },
    ]
  },
};

// Likert ölçeği seçenekleri
export const likertScale = [
  { value: 1, label: 'Kesinlikle Katılmıyorum' },
  { value: 2, label: 'Katılmıyorum' },
  { value: 3, label: 'Kararsızım' },
  { value: 4, label: 'Katılıyorum' },
  { value: 5, label: 'Kesinlikle Katılıyorum' },
];
