// ═══════════════════════════════════════════════════════════════
// POZİSYON BAZLI TEST SORU BANKALARI
// Kapsam geçerliliği sağlanmış, alan uzmanı doğrulamalı maddeler
// Her test bağımsız bir birim — modüler yapıda
// ═══════════════════════════════════════════════════════════════

// ─── GENEL MUHASEBE (Tek Düzen Hesap Planı) ─────────────────
export const genelMuhasebeBank = {
  id: 'pb_genel_muhasebe',
  title: 'Genel Muhasebe Testi',
  instruction: 'Her soru için doğru cevabı işaretleyin.',
  difficulty_distribution: { kolay: 8, orta: 10, zor: 7 },
  questions: [
    // KOLAY
    { id:'gm1', q:'Tek Düzen Hesap Planı\'nda 100 numaralı hesap grubu neyi ifade eder?', o:['Hazır Değerler','Menkul Kıymetler','Ticari Alacaklar','Stoklar','Duran Varlıklar'], a:0, d:'kolay' },
    { id:'gm2', q:'Bilanço hangi muhasebe eşitliğini gösterir?', o:['Varlıklar = Borçlar','Gelir = Gider','Varlıklar = Kaynaklar','Aktif = Pasif','Kâr = Zarar'], a:2, d:'kolay' },
    { id:'gm3', q:'KDV hangi hesap grubunda izlenir?', o:['100-Hazır Değerler','190-Diğer Dönen Varlıklar','300-Mali Borçlar','360-ÖYK Karşılıkları','391-Hesaplanan KDV'], a:4, d:'kolay' },
    { id:'gm4', q:'Gelir tablosunda en üst satır hangisidir?', o:['Brüt Satışlar','Net Satışlar','Satışların Maliyeti','Faaliyet Kârı','Dönem Net Kârı'], a:0, d:'kolay' },
    { id:'gm5', q:'Amortisman hangi kavramın sonucudur?', o:['İhtiyatlılık','Süreklilik','Dönemsellik','Maliyet esası','Tam açıklama'], a:2, d:'kolay' },
    { id:'gm6', q:'Kasa hesabı (100) hangi tip hesaptır?', o:['Pasif hesap','Aktif hesap','Nazım hesap','Gelir hesabı','Gider hesabı'], a:1, d:'kolay' },
    { id:'gm7', q:'Yevmiye defterinde kayıtlar hangi sıraya göre yapılır?', o:['Hesap numarası','Tarih sırası','Tutar büyüklüğü','Hesap türü','Departman'], a:1, d:'kolay' },
    { id:'gm8', q:'Hangisi dönen varlık değildir?', o:['Kasa','Alacak Senetleri','Stoklar','Taşıtlar','Verilen Çekler'], a:3, d:'kolay' },
    // ORTA
    { id:'gm9', q:'321 hesap (Borç Senetleri) hangi tür hesaptır?', o:['Aktif','Pasif','Gelir','Gider','Nazım'], a:1, d:'orta' },
    { id:'gm10', q:'Mal satışında "620-SATILAN MALIN MALİYETİ" hesabı nasıl çalışır?', o:['Alacaklandırılır','Borçlandırılır','Kapatılır','Aktarılır','İptal edilir'], a:1, d:'orta' },
    { id:'gm11', q:'Amortisman yöntemi "Azalan Bakiyeler" ne anlama gelir?', o:['Sabit yıllık amortisman','İlk yıllarda az, son yıllarda çok','İlk yıllarda çok, son yıllarda az','Üretim miktarına göre','Artan bakiye yöntemi'], a:2, d:'orta' },
    { id:'gm12', q:'Dönem sonu kapanış kaydında gelir ve gider hesapları nereye aktarılır?', o:['100-Kasa','300-Banka Kredileri','590-Dönem Net Kârı','690-DNG/Z','770-Genel Yönetim'], a:3, d:'orta' },
    { id:'gm13', q:'İşletme vadeli bir senet aldığında hangi hesap borçlanır?', o:['100-Kasa','101-Alınan Çekler','121-Alacak Senetleri','300-Banka Kredileri','321-Borç Senetleri'], a:2, d:'orta' },
    { id:'gm14', q:'Hangisi "Muhasebenin Temel Kavramları" arasında YER ALMAZ?', o:['Sosyal sorumluluk','Kişilik','Parayla ölçülme','Rekabet','Dönemsellik'], a:3, d:'orta' },
    { id:'gm15', q:'Şüpheli alacak karşılığı hangi hesapta izlenir?', o:['120-Alıcılar','128-Şüpheli Ticari Alacaklar','129-Şüpheli T.A. Karşılığı','654-Karşılık Giderleri','Her ikisi'], a:2, d:'orta' },
    { id:'gm16', q:'Banka kredisi kullanıldığında hangi hesap alacaklanır?', o:['100-Kasa','102-Bankalar','300-Banka Kredileri','400-Uzun V. Krediler','780-Finansman'], a:2, d:'orta' },
    { id:'gm17', q:'Mizan dengesizliği ne anlama gelir?', o:['Kârlılık düşük','Kayıt hatası var','Vergi borcu var','Bütçe aşılmış','Normal durum'], a:1, d:'orta' },
    { id:'gm18', q:'Envanter çıkarmak ne demektir?', o:['Stok saymak','Tüm varlık ve borçları tespit etmek','Bilanço düzenlemek','Vergi beyanı vermek','Kasa sayımı'], a:1, d:'orta' },
    // ZOR
    { id:'gm19', q:'Reeskont işlemi hangi hesaplarla yapılır?', o:['120-122','121-122','647-657','322-122','121-657/647'], a:4, d:'zor' },
    { id:'gm20', q:'Maliyet muhasebesinde 7/A seçeneğinde giderler hangi hesaplarda izlenir?', o:['600-699','700-799','770-779','150-159','620-632'], a:1, d:'zor' },
    { id:'gm21', q:'Ertelenmiş vergi varlığı ne zaman doğar?', o:['Zarar edildiğinde','Geçici farklar lehte olduğunda','Kalıcı farkların olduğu dönemde','Her yıl otomatik','Vergi ertelendiğinde'], a:1, d:'zor' },
    { id:'gm22', q:'Konsolidasyon eliminasyonu nedir?', o:['Grup içi işlemlerin iptal edilmesi','Borçların silinmesi','Kâr dağıtımı','Vergi planlaması','Amortisman iptali'], a:0, d:'zor' },
    { id:'gm23', q:'TFRS 15 hangi konuyu düzenler?', o:['Kiralamalar','Finansal araçlar','Müşteri sözleşmelerinden hasılat','Çalışanlara sağlanan faydalar','Hisse bazlı ödemeler'], a:2, d:'zor' },
    { id:'gm24', q:'Özkaynak yönteminde bağlı ortaklık karı nasıl muhasebeleşir?', o:['Gelir tablosunda faaliyet geliri','242 hesap borç, 640 alacak','İştirak payı oranında gelir kaydı','Kasa hesabına tahsil','İştirak değerinde değişiklik yok'], a:2, d:'zor' },
    { id:'gm25', q:'Nakit akış tablosunda amortisman neden eklenir?', o:['Nakit çıkışı olduğu için','Gider olduğu için','Nakit çıkışı olmayan gider olduğu için','Yatırım faaliyeti olduğu için','Eklenmez'], a:2, d:'zor' },
  ]
};

// ─── İNSAN KAYNAKLARI ──────────────────────────────────────
export const insanKaynaklariBank = {
  id: 'pb_insan_kaynaklari',
  title: 'İnsan Kaynakları Testi',
  instruction: 'Her soru için doğru cevabı işaretleyin.',
  difficulty_distribution: { kolay: 8, orta: 10, zor: 7 },
  questions: [
    // KOLAY
    { id:'ik1', q:'İş Kanunu\'na göre deneme süresi en fazla kaç aydır?', o:['1','2','3','4','6'], a:1, d:'kolay' },
    { id:'ik2', q:'SGK bildirimi en geç ne zaman yapılmalıdır?', o:['İşe başladığı gün','İşe başlamadan önce','İlk maaş gününde','İlk ay sonunda','İlk hafta'], a:1, d:'kolay' },
    { id:'ik3', q:'Yıllık izin hakkı en az kaç gündür (1-5 yıl arası)?', o:['7','10','14','20','21'], a:2, d:'kolay' },
    { id:'ik4', q:'Kıdem tazminatı hak etmek için asgari çalışma süresi?', o:['6 ay','1 yıl','2 yıl','3 yıl','5 yıl'], a:1, d:'kolay' },
    { id:'ik5', q:'İhbar süresi 6 ay-1.5 yıl arası çalışan için kaç haftadır?', o:['2','4','6','8','10'], a:1, d:'kolay' },
    { id:'ik6', q:'Bordro hazırlamada brüt ücretten düşülen ilk kalem?', o:['Gelir vergisi','Damga vergisi','SGK primi','İşsizlik sigortası','Sendika aidatı'], a:2, d:'kolay' },
    { id:'ik7', q:'Performans değerlendirmenin temel amacı nedir?', o:['Ceza vermek','İşten çıkarmak','Gelişim ve geri bildirim','Maaş düşürmek','Sadece kayıt tutmak'], a:2, d:'kolay' },
    { id:'ik8', q:'İşe alım sürecinde hangisi ilk adımdır?', o:['Mülakat','İş ilanı yayınlama','Referans kontrolü','İş analizi ve pozisyon tanımı','Teklif hazırlama'], a:3, d:'kolay' },
    // ORTA
    { id:'ik9', q:'360 derece geri bildirim nedir?', o:['Sadece yöneticiden','Sadece astlardan','Çok kaynaklı (yönetici+ast+eşdüzey+müşteri)','Sadece eşdüzeylerden','Otomatik sistem puanı'], a:2, d:'orta' },
    { id:'ik10', q:'KPI açılımı nedir?', o:['Knowledge Performance Index','Key Position Indicator','Key Performance Indicator','Knowledge Process Innovation','Key Person Interview'], a:2, d:'orta' },
    { id:'ik11', q:'Yetkinlik bazlı mülakat tekniğinde hangi yöntem kullanılır?', o:['Serbest sohbet','STAR tekniği','Grup tartışması','Portfolyo inceleme','Test uygulama'], a:1, d:'orta' },
    { id:'ik12', q:'İş Kanunu\'na göre fazla mesai ücreti normal saat ücretinin yüzde kaçı fazlasıdır?', o:['%25','%50','%75','%100','%150'], a:1, d:'orta' },
    { id:'ik13', q:'Employer Branding (İşveren Markası) neyi amaçlar?', o:['Ürün satışı','Şirketin iş arayanlar gözündeki çekiciliği','Müşteri sadakati','Maliyet düşürme','Pazar payı artırma'], a:1, d:'orta' },
    { id:'ik14', q:'Toplu iş sözleşmesi kimler arasında yapılır?', o:['İşçi-işveren','Sendika-işveren sendikası','İşçi-devlet','İşveren-bakanlık','Sendika-bakanlık'], a:1, d:'orta' },
    { id:'ik15', q:'Oryantasyon programının amacı nedir?', o:['Sınav yapmak','Yeni çalışanın adaptasyonunu sağlamak','Eski çalışanları eğitmek','Terfi kararı vermek','Performans ölçmek'], a:1, d:'orta' },
    { id:'ik16', q:'Hangisi dolaylı ücrettir?', o:['Temel maaş','Yemek kartı','Fazla mesai','Prim','Komisyon'], a:1, d:'orta' },
    { id:'ik17', q:'Norm kadro ne anlama gelir?', o:['Mevcut çalışan sayısı','Optimal çalışan sayısı ve dağılımı','Yıllık izin planı','Maaş cetveli','Organizasyon şeması'], a:1, d:'orta' },
    { id:'ik18', q:'KVKK kapsamında çalışan özlük dosyalarına erişim nasıl olmalıdır?', o:['Herkes erişebilir','Yalnızca yetkili İK personeli','Tüm yöneticiler','Tüm çalışanlar','Sendika temsilcileri'], a:1, d:'orta' },
    // ZOR
    { id:'ik19', q:'Balanced Scorecard\'ın İK perspektifi hangisidir?', o:['Mali','Müşteri','İç Süreçler','Öğrenme ve Gelişme','Pazarlama'], a:3, d:'zor' },
    { id:'ik20', q:'Assessment Center yöntemi hangi amaçla kullanılır?', o:['Bordro hesaplama','Yönetici adaylarının çok yönlü değerlendirmesi','Çalışan memnuniyeti','İş analizi','Mevzuat takibi'], a:1, d:'zor' },
    { id:'ik21', q:'Turnover Rate %20 olan bir firma için ne söylenebilir?', o:['Düşük, ideal','Sektöre göre değerlendirilmeli','Kesinlikle çok yüksek','Normal','Önemsiz'], a:1, d:'zor' },
    { id:'ik22', q:'OKR metodolojisi neyi ifade eder?', o:['Operational Key Results','Objectives and Key Results','Organizational Knowledge Review','Optimized KPI Reporting','Output Quantified Results'], a:1, d:'zor' },
    { id:'ik23', q:'İş değerlemesinde hangi yöntem işleri puanlayarak sınıflandırır?', o:['Sıralama','Sınıflandırma','Puan Yöntemi','Faktör Karşılaştırma','Piyasa Araştırması'], a:2, d:'zor' },
    { id:'ik24', q:'Succession Planning (Yedekleme Planlaması) hangi pozisyonlar için kritiktir?', o:['Tüm pozisyonlar','Sadece üst yönetim','Kilit ve stratejik pozisyonlar','Sadece mavi yaka','Sadece yeni pozisyonlar'], a:2, d:'zor' },
    { id:'ik25', q:'Psikolojik sözleşme kavramı neyi ifade eder?', o:['Yazılı iş sözleşmesi','İşçi-işveren arasındaki karşılıklı beklentiler','Toplu sözleşme','Gizlilik anlaşması','Rekabet yasağı'], a:1, d:'zor' },
  ]
};

// ─── İŞ SAĞLIĞI VE GÜVENLİĞİ (İSG) ───────────────────────
export const isgBank = {
  id: 'mb_isg',
  title: 'İş Sağlığı ve Güvenliği Testi',
  instruction: 'Her soru için doğru cevabı işaretleyin.',
  difficulty_distribution: { kolay: 8, orta: 10, zor: 7 },
  questions: [
    { id:'isg1', q:'İş kazası tanımı hangisidir?', o:['Sadece yaralanma','Sadece ölüm','İşyerinde veya iş nedeniyle meydana gelen her türlü olay','Sadece meslek hastalığı','Sadece uzuv kaybı'], a:2, d:'kolay' },
    { id:'isg2', q:'KKD açılımı nedir?', o:['Kurumsal Kalite Denetimi','Kişisel Koruyucu Donanım','Kalite Kontrol Departmanı','Kasıtlı Kimyasal Denetim','Kritik Kontrol Değeri'], a:1, d:'kolay' },
    { id:'isg3', q:'Yangın söndürücünün kontrolü ne sıklıkla yapılmalıdır?', o:['Ayda bir','3 ayda bir','6 ayda bir','Yılda bir','İhtiyaç olduğunda'], a:2, d:'kolay' },
    { id:'isg4', q:'İş kazası Sgk\'ya en geç kaç gün içinde bildirilmelidir?', o:['1 gün','2 gün','3 gün','7 gün','15 gün'], a:2, d:'kolay' },
    { id:'isg5', q:'Tehlikeli madde etiketinde kafatası sembolü neyi ifade eder?', o:['Korozif','Patlayıcı','Toksik/Zehirli','Yanıcı','Oksitleyici'], a:2, d:'kolay' },
    { id:'isg6', q:'İlk yardımda ABC kuralının A\'sı ne anlama gelir?', o:['Ambulans','Airway (Hava yolu)','Alert (Uyarı)','Assessment','Aid'], a:1, d:'kolay' },
    { id:'isg7', q:'Risk = ?', o:['Tehlike × Olasılık','Olasılık × Şiddet','Tehlike × Frekans','Maliyet × Süre','Tehlike × Şiddet'], a:1, d:'kolay' },
    { id:'isg8', q:'Hangisi KKD değildir?', o:['Baret','Koruyucu gözlük','Kulak tıkacı','İlk yardım çantası','Eldiven'], a:3, d:'kolay' },
    { id:'isg9', q:'Risk değerlendirmesinde "5x5 matrisi" neyi ifade eder?', o:['5 risk × 5 çözüm','5 olasılık × 5 şiddet','5 departman × 5 kişi','5 tehlike × 5 önlem','5 soru × 5 cevap'], a:1, d:'orta' },
    { id:'isg10', q:'MSDS (Güvenlik Bilgi Formu) hangi bilgileri içerir?', o:['Çalışan bilgileri','Makine teknik özellikleri','Kimyasalın tüm güvenlik bilgileri','Üretim planı','Maliyet tablosu'], a:2, d:'orta' },
    { id:'isg11', q:'Kaza kök neden analizi yöntemi hangisidir?', o:['SWOT','5 Neden (5 Why)','PEST','BCG','ABC'], a:1, d:'orta' },
    { id:'isg12', q:'İSG kurulu hangi işyerlerinde zorunludur?', o:['10+','20+','30+','50+','100+'], a:3, d:'orta' },
    { id:'isg13', q:'Kimyasal risk etmenleriyle çalışmada LSE nedir?', o:['Limit Sıcaklık Eşiği','Mesleki Maruziyet Sınır Değeri','Lojistik Süreç Eşiği','Lokal Sıhhi Emir','Levha Standart Eki'], a:1, d:'orta' },
    { id:'isg14', q:'Ergonomik risklerin sonucu hangi hastalık grubuna girer?', o:['Solunum','Kas-iskelet sistemi','Cilt','Nörolojik','Kardiyovasküler'], a:1, d:'orta' },
    { id:'isg15', q:'Ramak kala olay nedir?', o:['Ölümlü kaza','Yaralanmalı kaza','Kaza oluşmamış ama olabilecek olay','Meslek hastalığı','Ekipman arızası'], a:2, d:'orta' },
    { id:'isg16', q:'Gürültü maruziyetinde kulak koruyucu sınırı kaç dB\'dir?', o:['55','65','75','80','85'], a:4, d:'orta' },
    { id:'isg17', q:'Acil durum eylem planı neleri kapsar?', o:['Sadece yangın','Sadece deprem','Tüm olası acil durumlar ve müdahale prosedürleri','Sadece kimyasal sızıntı','Sadece iş kazası'], a:2, d:'orta' },
    { id:'isg18', q:'İSG eğitimi az tehlikeli işyerinde kaç saattir?', o:['4','8','12','16','20'], a:1, d:'orta' },
    { id:'isg19', q:'Heinrich Piramidi neyi gösterir?', o:['Organizasyon şeması','Kaza oranları piramidi','Risk matrisi','İlk yardım adımları','Eğitim planı'], a:1, d:'zor' },
    { id:'isg20', q:'LOTO (Lock Out Tag Out) prosedürü ne amaçla uygulanır?', o:['Kapı kilitleme','Bakım sırasında enerji kaynaklarını izole etme','Stok kilitleme','Personel giriş-çıkışı','Belge kilitleme'], a:1, d:'zor' },
    { id:'isg21', q:'Bow-Tie analizi ne amaçla kullanılır?', o:['Finansal risk','Tehlike senaryolarını görselleştirme','Müşteri analizi','Performans ölçüm','Maliyet analizi'], a:1, d:'zor' },
    { id:'isg22', q:'HAZOP analizi hangi sektörde yaygındır?', o:['Perakende','Kimya ve proses endüstrisi','Eğitim','Turizm','Tarım'], a:1, d:'zor' },
    { id:'isg23', q:'ISO 45001 neyin standardıdır?', o:['Kalite Yönetimi','Çevre Yönetimi','İş Sağlığı ve Güvenliği Yönetim Sistemi','Bilgi Güvenliği','Gıda Güvenliği'], a:2, d:'zor' },
    { id:'isg24', q:'Proaktif güvenlik göstergesi (leading indicator) hangisidir?', o:['Kaza sayısı','Kayıp iş günü','Güvenlik eğitimi tamamlanma oranı','Ölüm oranı','Tazminat maliyeti'], a:2, d:'zor' },
    { id:'isg25', q:'SDS\'in (Güvenlik Bilgi Formu) 2. bölümü neyi içerir?', o:['Bileşim bilgisi','Tehlike tanımlaması','İlk yardım','Yangınla mücadele','Taşıma bilgisi'], a:1, d:'zor' },
  ]
};

// ─── KALİTE YÖNETİMİ ──────────────────────────────────────
export const kaliteYonetimiBank = {
  id: 'pb_kalite_yonetimi',
  title: 'Kalite Yönetimi Testi',
  instruction: 'Her soru için doğru cevabı işaretleyin.',
  questions: [
    { id:'ky1', q:'ISO 9001\'in temel prensibi hangisidir?', o:['Maliyet minimizasyonu','Müşteri odaklılık','Gelir maksimizasyonu','Personel azaltma','Üretim hızı'], a:1, d:'kolay' },
    { id:'ky2', q:'PDCA döngüsünün açılımı nedir?', o:['Plan-Do-Check-Act','Produce-Deliver-Control-Analyze','Plan-Design-Create-Apply','Process-Data-Control-Action','None'], a:0, d:'kolay' },
    { id:'ky3', q:'Kontrol diyagramı (Control Chart) neyi izler?', o:['Maliyet','Süreç değişkenliği','Personel devamı','Satış','Stok'], a:1, d:'kolay' },
    { id:'ky4', q:'Kalite kontrol ile kalite güvence arasındaki fark nedir?', o:['Aynı şeyler','KK ürünü, KG sistemi kontrol eder','KG ürünü, KK sistemi denetler','Fark yok','Biri mavi, diğeri beyaz yaka'], a:1, d:'kolay' },
    { id:'ky5', q:'Pareto analizi hangi ilkeye dayanır?', o:['50-50','60-40','70-30','80-20','90-10'], a:3, d:'kolay' },
    { id:'ky6', q:'FMEA açılımı nedir?', o:['Failure Mode and Effects Analysis','Financial Monitoring and Enterprise Audit','Final Manufacturing Excellence Award','First Method Evaluation Assessment','Functional Model Engineering Analysis'], a:0, d:'orta' },
    { id:'ky7', q:'Cpk değeri 1.33 ise süreç yeterliliği nasıldır?', o:['Yetersiz','Kabul edilebilir','İyi','Mükemmel','Ölçülemez'], a:2, d:'orta' },
    { id:'ky8', q:'8D problem çözme yönteminde D4 ne anlama gelir?', o:['Kök neden analizi','Düzeltici eylem','Geçici önlem','Ekip oluşturma','Doğrulama'], a:0, d:'orta' },
    { id:'ky9', q:'İstatistiksel Proses Kontrol (SPC) hangi aracı en çok kullanır?', o:['Gantt şeması','SWOT analizi','Kontrol kartları','PERT şeması','Akış diyagramı'], a:2, d:'orta' },
    { id:'ky10', q:'Kalibrasyon ne demektir?', o:['Ürün boyama','Ölçü aletinin doğruluğunun referansa göre ayarlanması','Makine yağlama','Envanter sayımı','Bakım planı'], a:1, d:'orta' },
    { id:'ky11', q:'Six Sigma\'da DMAIC\'in M\'si neyi temsil eder?', o:['Monitor','Measure','Manage','Maintain','Manufacture'], a:1, d:'orta' },
    { id:'ky12', q:'Gage R&R analizi neyi ölçer?', o:['Üretim hızı','Ölçüm sistemi yeterliliği','Çalışan performansı','Makine kapasitesi','Hammadde kalitesi'], a:1, d:'orta' },
    { id:'ky13', q:'Neden-Sonuç (Ishikawa/Balık Kılçığı) diyagramında standart 6 kategori hangisidir?', o:['5S kategorileri','6M: Man, Machine, Method, Material, Measurement, Mother Nature','6 Sigma seviyeleri','6 kalite prensibi','6 üretim aşaması'], a:1, d:'orta' },
    { id:'ky14', q:'TQM açılımı nedir?', o:['Total Quality Monitoring','Toplam Kalite Yönetimi','Technical Quality Manual','Tool Quality Matrix','Time Quality Management'], a:1, d:'orta' },
    { id:'ky15', q:'APQP hangi sektörde zorunludur?', o:['Gıda','Otomotiv','İlaç','Tekstil','İnşaat'], a:1, d:'orta' },
    { id:'ky16', q:'Six Sigma\'da 3.4 DPMO hangi sigma seviyesine karşılık gelir?', o:['3 Sigma','4 Sigma','5 Sigma','6 Sigma','7 Sigma'], a:3, d:'zor' },
    { id:'ky17', q:'PPAP amacı nedir?', o:['Üretim planlama','Tedarikçinin ürün onay süreci','Personel performansı','Proje planı','Patent başvurusu'], a:1, d:'zor' },
    { id:'ky18', q:'Taguchi Metodu neyi optimize eder?', o:['Maliyet','Parametre tasarımı (varyansı minimize)','Personel','Hız','Hammadde'], a:1, d:'zor' },
    { id:'ky19', q:'IATF 16949 hangi standardın uzantısıdır?', o:['ISO 14001','ISO 27001','ISO 9001','ISO 45001','ISO 22000'], a:2, d:'zor' },
    { id:'ky20', q:'Poka-Yoke kavramı neyi ifade eder?', o:['Hata yapma olanağını ortadan kaldırma','Hata tespiti','Hata cezalandırma','Hata raporlama','Hata ölçümü'], a:0, d:'zor' },
    { id:'ky21', q:'Cp ile Cpk arasındaki fark nedir?', o:['Aynı şey','Cp potansiyeli, Cpk gerçek yeterliliği gösterir','Cp küçük, Cpk büyük','Biri kalite, diğeri maliyet','Biri ürün, diğeri süreç'], a:1, d:'zor' },
    { id:'ky22', q:'MSA (Measurement System Analysis) hangi 5 kaynağı inceler?', o:['5S kaynakları','Tekrarlanabilirlik, Yeniden Üretilebilirlik, Doğrusallık, Kararlılık, Sapma','5M kaynakları','DMAIC adımları','PDCA döngüsü'], a:1, d:'zor' },
    { id:'ky23', q:'QFD (Kalite Fonksiyon Yayılımı) neyin aracıdır?', o:['Üretim planlama','Müşteri sesini tasarıma aktarma','Maliyet analizi','Performans ölçümü','Tedarikçi değerlendirme'], a:1, d:'zor' },
    { id:'ky24', q:'COQ (Cost of Quality) içindeki önleme maliyeti örneği?', o:['Hurda maliyeti','Garanti maliyeti','Eğitim ve kalibrasyon maliyeti','İade maliyeti','Denetim maliyeti'], a:2, d:'zor' },
    { id:'ky25', q:'PPAP\'ın 18 gereksiniminden biri hangisidir?', o:['İş planı','Kontrol planı','Pazarlama planı','Finansal plan','İK planı'], a:1, d:'zor' },
  ]
};

// ─── SATINALMA TESTİ ───────────────────────────────────────
export const satinalmaBank = {
  id: 'pb_satinalma',
  title: 'Satınalma Testi',
  instruction: 'Her soru için doğru cevabı işaretleyin.',
  questions: [
    { id:'sa1', q:'Tedarikçi değerlendirmesinde en önemli 3 kriter genellikle hangileridir?', o:['Renk, boyut, ağırlık','Kalite, fiyat, teslimat','Mesafe, yaş, sektör','Logo, web sitesi, referans','Sermaye, kâr, ciro'], a:1, d:'kolay' },
    { id:'sa2', q:'RFQ açılımı nedir?', o:['Request for Qualification','Request for Quotation','Ready for Quality','Report for Quantity','Return for Quality'], a:1, d:'kolay' },
    { id:'sa3', q:'Satınalma siparişi (PO) ne anlama gelir?', o:['Teklif istenmesi','Kesinleşmiş satın alma emri','Ödeme bildirimi','Teslimat onayı','Kalite raporu'], a:1, d:'kolay' },
    { id:'sa4', q:'Minimum stok seviyesi neden belirlenir?', o:['Fazla stok için','Stoksuz kalma riskini önlemek','Depo alanı planı','Fiyat indirimi almak','Vergi avantajı'], a:1, d:'kolay' },
    { id:'sa5', q:'ABC analizi stok yönetiminde neyi sınıflandırır?', o:['Tedarikçileri','Ürünleri değerine göre (A:yüksek, B:orta, C:düşük)','Depo bölgelerini','Personeli','Müşterileri'], a:1, d:'kolay' },
    { id:'sa6', q:'TCO (Total Cost of Ownership) neyi ifade eder?', o:['Birim fiyat','Toplam sahip olma maliyeti','Taşıma maliyeti','Depo maliyeti','İşçilik maliyeti'], a:1, d:'orta' },
    { id:'sa7', q:'Tedarik zinciri yönetiminde JIT ne anlama gelir?', o:['Job In Training','Just In Time','Joint Investment Team','Junior Information Technology','Job Improvement Technique'], a:1, d:'orta' },
    { id:'sa8', q:'Hammadde alımında fiyat kırılımı (price break) nedir?', o:['Fiyat artışı','Belirli miktardan sonra birim fiyat indirimi','Fiyat sabitleme','Fiyat dondurma','Fiyat teklifi'], a:1, d:'orta' },
    { id:'sa9', q:'Vendor Managed Inventory (VMI) sisteminde stoku kim yönetir?', o:['Müşteri','Tedarikçi','Lojistik firması','Gümrük','ERP'], a:1, d:'orta' },
    { id:'sa10', q:'İhale sürecinde en ekonomik teklif her zaman en iyi midir?', o:['Evet','Hayır, TCO ve kalite de değerlendirilmeli','Evet, bütçe en önemli','Fark etmez','Yasal zorunluluk'], a:1, d:'orta' },
    { id:'sa11', q:'Blanket order (çerçeve sipariş) ne amaçla kullanılır?', o:['Tek seferlik alım','Uzun vadeli sabit fiyat ve miktar anlaşması','Acil alım','İade işlemi','Numune talebi'], a:1, d:'orta' },
    { id:'sa12', q:'EOQ (Economic Order Quantity) formülü neyi optimize eder?', o:['Toplam sipariş ve stok tutma maliyetini','Sadece birim fiyatı','Teslimat süresini','Tedarikçi sayısını','Depo kapasitesini'], a:0, d:'orta' },
    { id:'sa13', q:'Tedarikçi denetimi (audit) amacı nedir?', o:['Ceza kesmek','Tedarikçinin kalite ve süreç yeterliliğini doğrulamak','İlişkiyi sonlandırmak','Fiyat düşürmek','Sipariş vermek'], a:1, d:'orta' },
    { id:'sa14', q:'SRM açılımı nedir?', o:['Standard Risk Management','Supplier Relationship Management','Sales Revenue Model','Strategic Resource Mapping','Supply Route Monitor'], a:1, d:'orta' },
    { id:'sa15', q:'Incoterms hangi kurum tarafından yayınlanır?', o:['ISO','WTO','ICC','UN','OECD'], a:2, d:'orta' },
    { id:'sa16', q:'Strategic sourcing ile geleneksel satınalma arasındaki temel fark nedir?', o:['Fiyat odaklılık','Uzun vadeli ilişki ve değer odaklı yaklaşım','Hız','Tedarikçi sayısı','Kalite farkı'], a:1, d:'zor' },
    { id:'sa17', q:'Kraljic matrisi tedarik stratejisinde neyi sınıflandırır?', o:['Ürünleri risk ve kâr etkisine göre','Tedarikçileri ciro büyüklüğüne göre','Stokları lokasyona göre','Personeli deneyime göre','Müşterileri segmente göre'], a:0, d:'zor' },
    { id:'sa18', q:'Dual sourcing stratejisi neden tercih edilir?', o:['Maliyet artırmak','Tedarik riskini azaltmak','Stok artırmak','Kalite düşürmek','Hız azaltmak'], a:1, d:'zor' },
    { id:'sa19', q:'Spend analysis (harcama analizi) neyi amaçlar?', o:['Bütçe hazırlamak','Tedarik harcamalarını kategorize ederek tasarruf fırsatlarını bulmak','Maaş hesaplamak','Satış planlamak','Üretim maliyeti hesaplamak'], a:1, d:'zor' },
    { id:'sa20', q:'Maverick spending ne demektir?', o:['Planlı harcama','Satınalma politikası dışı yapılan yetkisiz alımlar','Stratejik alım','Toplu alım','Acil alım'], a:1, d:'zor' },
    { id:'sa21', q:'e-Procurement sisteminin en büyük avantajı nedir?', o:['Kâğıt tasarrufu','Süreç otomasyonu, şeffaflık ve hız','Personel azaltma','Stok artırma','Fiyat artışı'], a:1, d:'zor' },
    { id:'sa22', q:'P2P (Procure-to-Pay) süreci hangi adımları kapsar?', o:['Planlama-Üretim','İhtiyaç belirleme → Sipariş → Teslim alma → Ödeme','Satış-Tahsilat','Pazarlama-Satış','Üretim-Sevkiyat'], a:1, d:'zor' },
    { id:'sa23', q:'Reverse auction (ters açık artırma) nasıl çalışır?', o:['Fiyat yukarı gider','Tedarikçiler birbirleriyle rekabet ederek fiyat düşürür','Müşteri fiyat belirler','Sabit fiyat','Rastgele seçim'], a:1, d:'zor' },
    { id:'sa24', q:'COGS (Cost of Goods Sold) ile satınalma ilişkisi nedir?', o:['İlişki yok','Satınalma doğrudan COGS\'u etkiler','Sadece dolaylı','COGS satış ile ilgili','Satınalma COGS\'a dahil değil'], a:1, d:'zor' },
    { id:'sa25', q:'Green procurement (yeşil satınalma) kavramı neyi ifade eder?', o:['Yeşil renkli ürün alımı','Çevresel kriterleri de dikkate alan sürdürülebilir satınalma','Organik gıda alımı','Yenilenebilir enerji','Geri dönüşüm satışı'], a:1, d:'zor' },
  ]
};

// ─── TÜM POZİSYON BAZLI BANKALAR ─────────────────────────
export const pozisyonTestBanks = {
  pb_genel_muhasebe: genelMuhasebeBank,
  pb_insan_kaynaklari: insanKaynaklariBank,
  mb_isg: isgBank,
  pb_kalite_yonetimi: kaliteYonetimiBank,
  pb_satinalma: satinalmaBank,
};

export function getPozisyonBank(testId) {
  return pozisyonTestBanks[testId] || null;
}
