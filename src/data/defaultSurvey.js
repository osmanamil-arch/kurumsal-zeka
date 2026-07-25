export const defaultDimensions = [
  'Ücret', 'Yükselme', 'Yöneticiler', 'Ek İmkanlar', 'Olası Ödüller', 'Prosedürler', 
  'İş Arkadaşları', 'İşin Kendisi', 'İletişim', 'Ulaşım', 'Yemek', 'Sosyal Etkinlik', 
  'Eğitim', 'Kişisel Gelişim', 'İş Güvenliği', 'Sağlık', 'Tavsiye'
];

export const defaultSurvey = [
  { id: 'q1', text: 'Yaptığım işe göre aldığım paranın adil olduğunu düşünüyorum.', dimension: 'Ücret', isReverse: false },
  { id: 'q2', text: 'İşimde ilerleme olanakları gerçekten çok zor.', dimension: 'Yükselme', isReverse: true },
  { id: 'q3', text: 'Amirim gerçekten işinin ehli.', dimension: 'Yöneticiler', isReverse: false },
  { id: 'q4', text: 'Aldığım ek ödemelerden memnun değilim.', dimension: 'Ek İmkanlar', isReverse: true },
  { id: 'q5', text: 'İyi bir iş yapınca bu iş için almam gereken takdiri alırım.', dimension: 'Olası Ödüller', isReverse: false },
  { id: 'q6', text: 'Kural ve prosedürlerimizin çoğu, iyi bir iş yapmamızı zorlaştırıyor.', dimension: 'Prosedürler', isReverse: true },
  { id: 'q7', text: 'Birlikte çalıştığım arkadaşlarımı severim.', dimension: 'İş Arkadaşları', isReverse: false },
  { id: 'q8', text: 'Bazen işimin anlamsız olduğunu hissediyorum.', dimension: 'İşin Kendisi', isReverse: true },
  { id: 'q9', text: 'Çalıştığım örgüt içerisindeki iletişim iyi gibi görünüyor.', dimension: 'İletişim', isReverse: false },
  { id: 'q10', text: 'Ücret artışları çok az ve çok seyrek yapılıyor.', dimension: 'Ücret', isReverse: true },
  { id: 'q11', text: 'İşini iyi yapanların yükselme şansı iyi görünüyor.', dimension: 'Yükselme', isReverse: false },
  { id: 'q12', text: 'Amirim bana karşı adil değil.', dimension: 'Yöneticiler', isReverse: true },
  { id: 'q13', text: 'Aldığım ek ödemeler diğer örgütlerin verdiği kadar iyi.', dimension: 'Ek İmkanlar', isReverse: false },
  { id: 'q14', text: 'Yaptığım iş takdir ediliyormuş gibi geliyor.', dimension: 'Olası Ödüller', isReverse: false },
  { id: 'q15', text: 'İyi bir iş yapmak için olan çabalarımın kırtasiyecilik işleriyle sekteye uğradığını düşünüyorum.', dimension: 'Prosedürler', isReverse: true },
  { id: 'q16', text: 'Birlikte çalıştığım kişilerin yetersizliği dolayısıyla kendimi daha fazla çalışmak zorunda hissediyorum.', dimension: 'İş Arkadaşları', isReverse: true },
  { id: 'q17', text: 'İşte yaptığım şeyleri yapmaktan hoşlanıyorum.', dimension: 'İşin Kendisi', isReverse: false },
  { id: 'q18', text: 'Bu kurumun amaçlarının ne olduğu bana pek açık gelmiyor.', dimension: 'İletişim', isReverse: true },
  { id: 'q19', text: 'Bana verilen ücreti düşündüğümde bu kurum tarafından takdir edilmiyormuşum gibi hissediyorum.', dimension: 'Ücret', isReverse: true },
  { id: 'q20', text: 'İnsan burada diğer kurumlarda olduğu kadar hızlı yükselebiliyor.', dimension: 'Yükselme', isReverse: true },
  { id: 'q21', text: 'Amirim astlarının duygularına çok az ilgi gösteriyor.', dimension: 'Yöneticiler', isReverse: false },
  { id: 'q22', text: 'Ek ödeme bakımından çalışanlara sunulan imkânlar birbirine denktir.', dimension: 'Ek İmkanlar', isReverse: false },
  { id: 'q23', text: 'Bu kurumda çalışanlar için çok az ödül imkânı var.', dimension: 'Olası Ödüller', isReverse: true },
  { id: 'q24', text: 'İşte yapmam gereken çok az şey var.', dimension: 'Prosedürler', isReverse: true },
  { id: 'q25', text: 'Birlikte çalıştığım insanlardan hoşlanıyorum.', dimension: 'İş Arkadaşları', isReverse: false },
  { id: 'q26', text: 'Çoğunlukla, bu kurumda ne olup bittiğinden haberim olmadığını hissediyorum.', dimension: 'İşin Kendisi', isReverse: true },
  { id: 'q27', text: 'İşimi yapmaktan gurur duyuyorum.', dimension: 'İletişim', isReverse: false },
  { id: 'q28', text: 'Ücret artış şansımın iyi olduğunu düşünüyorum.', dimension: 'Ücret', isReverse: false },
  { id: 'q29', text: 'Olması gereken fakat yararlanmadığımız bazı ek imkânlar olduğunu düşünüyorum.', dimension: 'Ek İmkanlar', isReverse: true },
  { id: 'q30', text: 'Amirimi seviyorum.', dimension: 'Yöneticiler', isReverse: false },
  { id: 'q31', text: 'Çok fazla kırtasiyecilik niteliğinde işim var.', dimension: 'Prosedürler', isReverse: true },
  { id: 'q32', text: 'Çabalarımın karşılığı olarak yeterince ödüllendirilmediğimi düşünüyorum.', dimension: 'Olası Ödüller', isReverse: true },
  { id: 'q33', text: 'İlerleme şansımın iyi olduğunu düşünüyorum.', dimension: 'Yükselme', isReverse: false },
  { id: 'q34', text: 'İş arkadaşlarım arasında çok fazla çatışma ve kavga var.', dimension: 'İş Arkadaşları', isReverse: true },
  { id: 'q35', text: 'Yaptığım iş zevklidir.', dimension: 'İşin Kendisi', isReverse: false },
  { id: 'q36', text: 'Bize verilen görevler tam olarak açıklanmıyor.', dimension: 'İletişim', isReverse: true },
  { id: 'q37', text: 'Kurumun sağladığı ulaşım imkanlarından memnunum.', dimension: 'Ulaşım', isReverse: false },
  { id: 'q38', text: 'Kurumda çıkan yemeklerden memnunum.', dimension: 'Yemek', isReverse: false },
  { id: 'q39', text: 'Kurumun düzenlediği sosyal etkinlikler yeterlidir.', dimension: 'Sosyal Etkinlik', isReverse: false },
  { id: 'q40', text: 'Kurumda sağlanan eğitim olanakları yeterlidir.', dimension: 'Eğitim', isReverse: false },
  { id: 'q41', text: 'Kişisel gelişimim için kurum tarafından destekleniyorum.', dimension: 'Kişisel Gelişim', isReverse: false },
  { id: 'q42', text: 'Çalışma ortamında iş güvenliği kurallarına uyulmaktadır.', dimension: 'İş Güvenliği', isReverse: false },
  { id: 'q43', text: 'Kurumun sağladığı sağlık hizmetleri yeterlidir.', dimension: 'Sağlık', isReverse: false },
  { id: 'q44', text: 'Bu kurumu çalışılacak bir yer olarak başkalarına tavsiye ederim.', dimension: 'Tavsiye', isReverse: false }
];

export const defaultMaviYakaDimensions = [
  'İşin Kendisi', 'İş Arkadaşları', 'Yöneticiler', 'Prosedürler', 'İletişim', 
  'Yükselme', 'Takdir', 'Mesai ve Şartlar', 'Çalışma Saatleri', 'Ücret', 
  'Ulaşım', 'Yemek', 'Sosyal Etkinlik', 'Eğitim', 'İş Güvenliği', 'Sağlık', 'Tavsiye'
];

export const defaultMaviYakaSurvey = [
  { id: 'm1', text: 'Genel olarak yaptığım işten memnunum.', dimension: 'İşin Kendisi', isReverse: false },
  { id: 'm2', text: 'Birlikte çalıştığım iş arkadaşlarımdan memnunum.', dimension: 'İş Arkadaşları', isReverse: false },
  { id: 'm3', text: 'Bir üst amirimden memnunum.', dimension: 'Yöneticiler', isReverse: false },
  { id: 'm4', text: 'Uygulanan kurallardan memnunum.', dimension: 'Prosedürler', isReverse: false },
  { id: 'm5', text: 'İş arkadaşlarımla iletişimim iyidir.', dimension: 'İletişim', isReverse: false },
  { id: 'm6', text: 'İyi çalıştığımda yükselme olanağım vardır.', dimension: 'Yükselme', isReverse: false },
  { id: 'm7', text: 'Yaptığım iş takdir edilir.', dimension: 'Takdir', isReverse: false },
  { id: 'm8', text: 'Ek mesai yapılmasından memnunum.', dimension: 'Mesai ve Şartlar', isReverse: false },
  { id: 'm9', text: 'Giriş ve çıkış saatlerinden memnunum.', dimension: 'Çalışma Saatleri', isReverse: false },
  { id: 'm10', text: 'Yaptığım işe göre aldığım ücret yeterlidir.', dimension: 'Ücret', isReverse: false },
  { id: 'm11', text: 'Servis ve ulaşım imkanları yeterlidir.', dimension: 'Ulaşım', isReverse: false },
  { id: 'm12', text: 'Bu işyerinin yemek hizmetinden memnunum.', dimension: 'Yemek', isReverse: false },
  { id: 'm13', text: 'İşyerinde gezi, piknik gibi sosyal aktiviteler yeterlidir.', dimension: 'Sosyal Etkinlik', isReverse: false },
  { id: 'm14', text: 'İşyerinde düzenlenen mesleki eğitimlerden memnunum.', dimension: 'Eğitim', isReverse: false },
  { id: 'm15', text: 'Bu işyerinde iş sağlığı ve güvenliği (İSG) hizmetleri yeterlidir.', dimension: 'İş Güvenliği', isReverse: false },
  { id: 'm16', text: 'İşyerindeki sağlık hizmetleri (doktor, hemşire) yeterlidir.', dimension: 'Sağlık', isReverse: false },
  { id: 'm17', text: 'Bu işyerini başkalarına da tavsiye ederim.', dimension: 'Tavsiye', isReverse: false }
];
