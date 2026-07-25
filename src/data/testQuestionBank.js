// SELECTEST SORU BANKASI — TEMEL YETENEK (90 Soru)
// 6 alt boyut × 3 zorluk × 5 soru, her soru 5 şıklı

export const questionBank = {
  TEMEL_YETENEK: {
    genel_kultur: {
      label: 'Genel Kültür', description: 'Bireyin genel bilgi birikimi ve dünyayı anlama seviyesi.',
      kolay: [
        { id:'gk_k1', q:'TBMM hangi yılda açılmıştır?', o:['1919','1920','1921','1922','1923'], a:1 },
        { id:'gk_k2', q:'Dünyanın en büyük okyanusu?', o:['Atlantik','Hint','Pasifik','Arktik','Antarktik'], a:2 },
        { id:'gk_k3', q:'İnsan vücudundaki en büyük organ?', o:['Karaciğer','Beyin','Kalp','Deri','Akciğer'], a:3 },
        { id:'gk_k4', q:'Hangisi Akdeniz ülkesidir?', o:['Norveç','Polonya','İtalya','Almanya','İsveç'], a:2 },
        { id:'gk_k5', q:'Suyun kimyasal formülü?', o:['CO2','H2O','NaCl','O2','H2SO4'], a:1 },
      ],
      orta: [
        { id:'gk_o1', q:'BM merkezi hangi şehirdedir?', o:['Washington','Londra','Cenevre','New York','Paris'], a:3 },
        { id:'gk_o2', q:'Nutuk kime aittir?', o:['İsmet İnönü','M.K. Atatürk','K. Karabekir','F. Çakmak','R. Orbay'], a:1 },
        { id:'gk_o3', q:'Fotosentezde bitki havaya ne verir?', o:['CO2','Azot','Oksijen','Hidrojen','Metan'], a:2 },
        { id:'gk_o4', q:'Hangisi yenilenebilir değildir?', o:['Rüzgâr','Güneş','Doğalgaz','Dalga','Jeotermal'], a:2 },
        { id:'gk_o5', q:'NATO açılımındaki A?', o:['American','Allied','Atlantic','Armed','Association'], a:2 },
      ],
      zor: [
        { id:'gk_z1', q:'Kyoto Protokolü konusu?', o:['Nükleer silah','İnsan hakları','İklim değişikliği','Deniz ticareti','Sığınmacılar'], a:2 },
        { id:'gk_z2', q:'GSYH neyi ölçer?', o:['Nüfus','Toplam üretim','Dış borç','Enflasyon','İşsizlik'], a:1 },
        { id:'gk_z3', q:'Skorbüt hangi vitamin eksikliği?', o:['A','B12','C','D','E'], a:2 },
        { id:'gk_z4', q:'Stagflasyon nedir?', o:['Büyüme+düşük enflasyon','Durgunluk+yüksek enflasyon','Düşük faiz+istihdam','Yüksek ihracat','Bütçe fazlası'], a:1 },
        { id:'gk_z5', q:'BMGK daimi üyesi olmayan?', o:['Fransa','Çin','Almanya','Rusya','ABD'], a:2 },
      ]
    },
    temel_matematik: {
      label: 'Temel Matematik', description: 'Matematiksel kavramları anlama ve uygulama yeteneği.',
      kolay: [
        { id:'tm_k1', q:'240 TL ürüne %25 indirim = ?', o:['160','170','180','190','200'], a:2 },
        { id:'tm_k2', q:'Bir düzine kaç adet?', o:['6','8','10','12','24'], a:3 },
        { id:'tm_k3', q:'3/4 + 1/4 = ?', o:['1/2','2/4','1','4/4','3/4'], a:2 },
        { id:'tm_k4', q:'90 km/s hızla 2 saat = ? km', o:['160','170','180','190','200'], a:2 },
        { id:'tm_k5', q:'500 gram = ? kg', o:['0.05','0.5','5','50','0.005'], a:1 },
      ],
      orta: [
        { id:'tm_o1', q:'800 TL + %20 KDV = ?', o:['880','920','960','1000','1040'], a:2 },
        { id:'tm_o2', q:'A, B den 3 büyük. B, C den 5 küçük. C=30 ise A=?', o:['22','25','28','32','34'], a:2 },
        { id:'tm_o3', q:'8 saat/gün 12 günde biter. 6 saat/gün kaç gün?', o:['14','15','16','18','20'], a:2 },
        { id:'tm_o4', q:'%40 kârla 700 TL ye satılan ürün maliyeti?', o:['400','420','460','500','560'], a:3 },
        { id:'tm_o5', q:'Kısa kenar 5 cm, uzun kenar 3 katı. Çevre?', o:['30','35','40','45','50'], a:2 },
      ],
      zor: [
        { id:'tm_z1', q:'A 6 saat, B 3 saat doldurur. Birlikte?', o:['1','1.5','2','2.5','3'], a:2 },
        { id:'tm_z2', q:'1000 TL %12 bileşik faiz 2 yıl = ?', o:['1200','1210','1240','1254.40','1120'], a:3 },
        { id:'tm_z3', q:'40 kişi %60 kız, 10 erkek gelirse kız oranı?', o:['40','42','44','48','50'], a:3 },
        { id:'tm_z4', q:'Gidiş 80km/s dönüş 120km/s ort hız?', o:['90','92','96','100','104'], a:2 },
        { id:'tm_z5', q:'x²-5x+6=0 kökler toplamı?', o:['2','3','5','6','11'], a:2 },
      ]
    },
    sayisal_akil_yurutme: {
      label: 'Sayısal Akıl Yürütme', description: 'Sayılarla ilgili problemleri çözme yeteneği.',
      kolay: [
        { id:'sa_k1', q:'2, 4, 6, 8, ?', o:['9','10','11','12','14'], a:1 },
        { id:'sa_k2', q:'5, 10, 15, 20, ?', o:['22','24','25','30','35'], a:2 },
        { id:'sa_k3', q:'1, 3, 5, 7, ?', o:['8','9','10','11','12'], a:1 },
        { id:'sa_k4', q:'100, 90, 80, 70, ?', o:['50','55','60','65','75'], a:2 },
        { id:'sa_k5', q:'3, 6, 9, 12, ?', o:['13','14','15','16','18'], a:2 },
      ],
      orta: [
        { id:'sa_o1', q:'2, 6, 18, 54, ?', o:['72','108','162','216','144'], a:2 },
        { id:'sa_o2', q:'1, 4, 9, 16, ?', o:['20','21','24','25','36'], a:3 },
        { id:'sa_o3', q:'1, 1, 2, 3, 5, ?', o:['6','7','8','9','10'], a:2 },
        { id:'sa_o4', q:'3, 7, 15, 31, ?', o:['47','55','63','72','80'], a:2 },
        { id:'sa_o5', q:'2, 5, 11, 23, ?', o:['35','41','47','53','59'], a:2 },
      ],
      zor: [
        { id:'sa_z1', q:'1, 2, 6, 24, 120, ?', o:['240','480','600','720','840'], a:3 },
        { id:'sa_z2', q:'0, 1, 1, 2, 3, 5, 8, 13, ?', o:['18','19','20','21','26'], a:3 },
        { id:'sa_z3', q:'4, 9, 25, 49, 121, ?', o:['144','169','196','225','256'], a:1 },
        { id:'sa_z4', q:'2, 3, 5, 7, 11, 13, ?', o:['14','15','16','17','19'], a:3 },
        { id:'sa_z5', q:'1, 8, 27, 64, ?', o:['81','100','125','216','243'], a:2 },
      ]
    },
    oruntu_takibi: {
      label: 'Örüntü Takibi', description: 'Desenleri ve sıraları anlama ve devam ettirme becerisi.',
      kolay: [
        { id:'ot_k1', q:'▲ ● ▲ ● ▲ ? Sıradaki?', o:['▲','●','■','◆','★'], a:1 },
        { id:'ot_k2', q:'A B C A B C A B ? Sıradaki?', o:['A','B','C','D','E'], a:2 },
        { id:'ot_k3', q:'Kırmızı Mavi Kırmızı Mavi Kırmızı ? Sıradaki?', o:['Yeşil','Mavi','Kırmızı','Sarı','Beyaz'], a:1 },
        { id:'ot_k4', q:'1 A 2 B 3 C 4 ? Sıradaki?', o:['5','D','E','4','F'], a:1 },
        { id:'ot_k5', q:'↑ → ↓ ← ↑ → ↓ ? Sıradaki?', o:['↑','→','↓','←','↗'], a:3 },
      ],
      orta: [
        { id:'ot_o1', q:'A C E G ? Sıradaki harf?', o:['H','I','J','K','L'], a:1 },
        { id:'ot_o2', q:'1 2 4 7 11 ? Sıradaki?', o:['14','15','16','17','18'], a:2 },
        { id:'ot_o3', q:'Z Y X W V ? Sıradaki?', o:['S','T','U','R','Q'], a:2 },
        { id:'ot_o4', q:'AA BB CCC ? Sıradaki kaç D?', o:['3','4','5','6','7'], a:1 },
        { id:'ot_o5', q:'2 4 8 16 ? Sıradaki?', o:['20','24','28','32','36'], a:3 },
      ],
      zor: [
        { id:'ot_z1', q:'A1 B2 D4 G7 ? Sıradaki?', o:['I9','J10','K11','L12','H8'], a:2 },
        { id:'ot_z2', q:'2 3 5 8 13 21 ? Sıradaki?', o:['28','30','32','34','36'], a:3 },
        { id:'ot_z3', q:'AZ BY CX DW ? Sıradaki çift?', o:['EU','EV','FV','EW','FU'], a:1 },
        { id:'ot_z4', q:'1 4 2 5 3 6 4 ? Sıradaki?', o:['5','6','7','8','9'], a:2 },
        { id:'ot_z5', q:'Fibonacci+1: 2 2 3 4 6 9 ? Sıradaki?', o:['11','12','13','14','15'], a:3 },
      ]
    },
    sozel_akil_yurutme: {
      label: 'Sözel Akıl Yürütme', description: 'Dil ve kelime bilgisi kullanarak mantıksal çıkarımlar yapma.',
      kolay: [
        { id:'sy_k1', q:'Kalem:Yazmak :: Bıçak:?', o:['Çizmek','Kesmek','Silmek','Kazımak','Delmek'], a:1 },
        { id:'sy_k2', q:'Göz:Görmek :: Kulak:?', o:['Koklamak','Tatmak','Dokunmak','Duymak','Hissetmek'], a:3 },
        { id:'sy_k3', q:'Farklı olan? Elma Armut Havuç Üzüm Çilek', o:['Elma','Armut','Havuç','Üzüm','Çilek'], a:2 },
        { id:'sy_k4', q:'Kitap:Kütüphane :: Hasta:?', o:['Doktor','İlaç','Hastane','Ambulans','Hemşire'], a:2 },
        { id:'sy_k5', q:'Kuş:Yuva :: İnsan:?', o:['Ağaç','Ev','Araba','Yol','Park'], a:1 },
      ],
      orta: [
        { id:'sy_o1', q:'Terazi:Adalet :: Güvercin:?', o:['Özgürlük','Barış','Sevgi','Umut','Sadakat'], a:1 },
        { id:'sy_o2', q:'Tüm kediler memeli, memeliler canlı. Doğru olan?', o:['Tüm canlılar kedi','Tüm kediler canlı','Tüm memeliler kedi','Bazı canlılar kedi','Hiçbiri'], a:1 },
        { id:'sy_o3', q:'Farklı olan? Sandalye Masa Koltuk Dolap Çatı', o:['Sandalye','Masa','Koltuk','Dolap','Çatı'], a:4 },
        { id:'sy_o4', q:'Isı:Termometre :: Basınç:?', o:['Higrometre','Barometre','Voltmetre','Kronometre','Taksimetre'], a:1 },
        { id:'sy_o5', q:'A Bden uzun. C Adan kısa ama Bden uzun. En kısa?', o:['A','B','C','Eşit','Belirlenemez'], a:1 },
      ],
      zor: [
        { id:'sy_z1', q:'Bazı doktorlar müzisyen. Tüm müzisyenler yaratıcı. Kesin?', o:['Tüm doktorlar yaratıcı','Bazı doktorlar yaratıcı','Hiçbir doktor yaratıcı değil','Tüm yaratıcılar doktor','Belirlenemez'], a:1 },
        { id:'sy_z2', q:'Paradoks örneği?', o:['Hızlı koşmak','Yalancının hep yalan söylerim demesi','Erken kalkmak','Sınavda başarı','Kitap okumak'], a:1 },
        { id:'sy_z3', q:'Korelasyon nedensellik değildir. Doğru yorum?', o:['Aynı anda olan sebeptir','Birlikte değişenler etkilemeyebilir','İstatistik güvenilmez','Neden-sonuç hep var','Bilim gereksiz'], a:1 },
        { id:'sy_z4', q:'A>B, C<D, B>D ise kesin olan?', o:['A>C','C>A','D>A','B<C','C>B'], a:0 },
        { id:'sy_z5', q:'Her yenilik risk taşır ama her risk yenilik getirmez. Çıkarım?', o:['Risk gereksiz','Yenilik risk gerektirir','Risksiz yenilik var','Bağımsızlar','Yenilik başarısız'], a:1 },
      ]
    },
    yonerge_takibi: {
      label: 'Yönerge Takibi', description: 'Verilen talimatları doğru şekilde anlama ve uygulama yeteneği.',
      kolay: [
        { id:'yt_k1', q:'KALEM: ilk+son harfi birleştirin?', o:['KE','KM','KA','KL','ML'], a:1 },
        { id:'yt_k2', q:'5+3 sonucu 2 ile çarpın?', o:['11','13','16','21','26'], a:2 },
        { id:'yt_k3', q:'MERHABA 4. harf?', o:['R','H','A','B','E'], a:1 },
        { id:'yt_k4', q:'7,3,9,1 küçükten büyüğe 2. sıradaki?', o:['1','3','7','9','5'], a:1 },
        { id:'yt_k5', q:'ARABA tersten ortadaki harf?', o:['A','R','B','E','K'], a:0 },
      ],
      orta: [
        { id:'yt_o1', q:'ÇALIŞKAN sesli harfleri sırasıyla?', o:['AIA','AİA','AAI','ÇLŞ','AIAA'], a:1 },
        { id:'yt_o2', q:'12-4=? sonucu x3 sonucu +6 = ?', o:['24','26','28','30','32'], a:3 },
        { id:'yt_o3', q:'İlk 5 çift sayıyı toplayın?', o:['20','25','30','35','40'], a:2 },
        { id:'yt_o4', q:'A=1 B=2 C=3: BAC toplamı?', o:['4','5','6','7','8'], a:2 },
        { id:'yt_o5', q:'PROGRAMLAMA kelimesindeki A sayısı?', o:['2','3','4','5','6'], a:1 },
      ],
      zor: [
        { id:'yt_z1', q:'Haftanın günleri alfabetik sıralamayla 3. olan?', o:['Cumartesi','Cuma','Pazartesi','Perşembe','Salı'], a:2 },
        { id:'yt_z2', q:'100-7+3 sonucu /2 = ?', o:['46','48','50','52','54'], a:1 },
        { id:'yt_z3', q:'Güneşli=park değilse=müze. Bulutlu havada?', o:['Park','Sinema','Müze','Kafe','Ev'], a:2 },
        { id:'yt_z4', q:'Kırmızının solunda Mavi, Yeşilin sağında Kırmızı. Soldan sağa?', o:['M-K-Y','Y-K-M','K-M-Y','Y-M-K','M-Y-K'], a:1 },
        { id:'yt_z5', q:'DÖRT harflerini alfabetik sıralayın. İlk harf?', o:['D','R','T','Ö','Ü'], a:0 },
      ]
    },
  },
};
