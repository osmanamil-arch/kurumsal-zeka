import React, { useState, useEffect } from 'react';
import { useMetadataStorage } from '../../hooks/useMetadataStorage';
import './JI_Styles.css';

function GeminiStreamer({ text }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    setDisplayed('');
    if (!text) return;
    const t = setInterval(() => {
      setDisplayed(prev => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(t);
    }, 15);
    return () => clearInterval(t);
  }, [text]);

  const parseToHtml = (str) => {
    return str.split('\n').map((line, idx) => {
      let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      if (line.startsWith('### ')) return <h3 key={idx} style={{ color: '#334155', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem', marginTop: '1.5rem', marginBottom: '1rem' }} dangerouslySetInnerHTML={{__html: formatted.replace('### ', '')}}></h3>;
      if (line.startsWith('- ')) return <li key={idx} style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '0.5rem', marginLeft: '1.5rem' }} dangerouslySetInnerHTML={{__html: formatted.replace('- ', '')}}></li>;
      if (line.trim() === '') return <div key={idx} style={{height: '0.5rem'}}></div>;
      return <p key={idx} style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{__html: formatted}}></p>;
    });
  };

  return (
    <div>
       {parseToHtml(displayed)}
       {displayed.length < text.length && <span style={{ display: 'inline-block', width: '8px', height: '18px', background: '#8B5CF6', animation: 'blink 1s step-end infinite', verticalAlign: 'middle', marginLeft: '5px' }}></span>}
       <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </div>
  );
}

export default function SetupWizard() {
  const db = useMetadataStorage();
  
  const [activeTab, setActiveTab] = useState('ai_generator');
  
  // AI Generator States
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // AI Enricher States
  const [enrichPrompt, setEnrichPrompt] = useState('');
  const [enrichType, setEnrichType] = useState('ALL');
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichResult, setEnrichResult] = useState(null);

  // Manual Entry States
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemType, setNewItemType] = useState('COMPETENCY');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemTags, setNewItemTags] = useState('');
  
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('TEXT');

  const getPlaceholders = () => {
    switch (newItemType) {
      case 'JOB_FAMILY': return { title: 'Örn: Satış & Pazarlama', category: 'Örn: Ticari', desc: 'Ailenin ana odak noktası...', tags: 'Örn: satis, pazarlama' };
      case 'JOB_FUNCTION': return { title: 'Örn: Dijital Pazarlama', category: 'Örn: Pazarlama', desc: 'Fonksiyonun temel işlevi...', tags: 'Örn: dijital, kampanya' };
      case 'JOB_LEVEL': return { title: 'Örn: Kıdemli Uzman (Senior)', category: 'Örn: Bireysel Katılımcı', desc: 'Sorumluluk kapsamı...', tags: 'Örn: senior, kidemli' };
      case 'COMPETENCY': return { title: 'Örn: Stratejik Düşünme', category: 'Örn: Liderlik', desc: 'Nasıl davranışlar sergiler...', tags: 'Örn: strateji, vizyon' };
      case 'SKILL': return { title: 'Örn: Veri Analizi (Python)', category: 'Örn: Teknik', desc: 'Hangi araçlarla yapılır...', tags: 'Örn: teknik, python' };
      case 'KNOWLEDGE': return { title: 'Örn: İş Hukuku Mevzuatı', category: 'Örn: Hukuk', desc: 'Hangi kanunları içerir...', tags: 'Örn: hukuk, yasa' };
      case 'RESPONSIBILITY': return { title: 'Örn: Bütçe Yönetimi', category: 'Örn: Finansal', desc: 'Nelerden sorumludur...', tags: 'Örn: bütçe, finans' };
      case 'TASK': return { title: 'Örn: Haftalık Rapor Hazırlamak', category: 'Örn: Operasyonel', desc: 'Ne sıklıkla, nasıl yapılır...', tags: 'Örn: rapor, günlük' };
      case 'KPI': return { title: 'Örn: Müşteri Memnuniyeti (NPS)', category: 'Örn: Kalite', desc: 'Nasıl ölçülür? Formülü nedir...', tags: 'Örn: nps, kalite' };
      case 'WORK_CONDITION': return { title: 'Örn: Yoğun Seyahat Gerektirir', category: 'Örn: Fiziksel', desc: 'Yol / Konaklama detayları...', tags: 'Örn: seyahat, ofis' };
      case 'CERTIFICATION': return { title: 'Örn: PMP Sertifikası', category: 'Örn: Proje Yönetimi', desc: 'Veren kurum...', tags: 'Örn: pmp, proje' };
      default: return { title: '', category: '', desc: '', tags: '' };
    }
  };

  const placeholders = getPlaceholders();

  const handleAiGenerate = () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setAiResult(null);

    // Mock AI Generation Delay for "thinking"
    setTimeout(() => {
      setIsGenerating(false);

      let objective = '';
      let tasksArr = [];
      let skillsArr = [];
      let fullText = '';
      
      const lowerPrompt = aiPrompt.toLowerCase();
      
      if (lowerPrompt.includes('e-ticaret') || lowerPrompt.includes('e ticaret')) {
          objective = `Bir ${aiPrompt}, bir şirketin dijital dünyadaki mağaza müdürüdür; ancak sorumluluk alanı fiziksel bir dükkandan çok daha geniştir. Temel amacı, dijital kanallar üzerinden satışları artırmak, müşteri deneyimini optimize etmek ve markanın online görünürlüğünü yönetmektir.\n\n${aiPrompt}, şirketin online satış platformlarının (web sitesi, mobil uygulama ve pazaryerleri) uçtan uca yönetiminden sorumludur. Satış stratejileri geliştirir, dijital pazarlama faaliyetlerini koordine eder ve operasyonel süreçlerin (stok, lojistik, ödeme sistemleri) sorunsuz işlemesini sağlar.`;
          
          tasksArr = [
              "Yıllık ve aylık satış hedeflerini belirlemek ve bu hedeflere ulaşmak için stratejiler geliştirmek.",
              "Pazar trendlerini, rakip faaliyetlerini ve müşteri davranışlarını analiz ederek aksiyon almak.",
              "Pazaryeri yönetimi (Trendyol, Hepsiburada, Amazon vb.) süreçlerini yürütmek.",
              "SEO, SEM, Google Ads ve sosyal medya reklam süreçlerini pazarlama ekibiyle koordine etmek.",
              "Web sitesi trafiğini analiz ederek Dönüşüm Oranı Optimizasyonu (CRO) çalışmaları yapmak.",
              "Kampanya kurguları hazırlamak (Black Friday, bayram indirimleri vb.) ve performanslarını ölçümlemek.",
              "Ürünlerin sisteme doğru fiyat, açıklama ve görsellerle girilmesini sağlamak.",
              "Stok seviyelerini takip etmek ve satın alma departmanı ile koordineli çalışarak stoksuz kalma riskini yönetmek.",
              "Lojistik ve kargo süreçlerini denetleyerek müşteri memnuniyetini en üst düzeyde tutmak.",
              "Web sitesinin hızı, ödeme altyapısı ve mobil uyumluluğu gibi teknik süreçleri takip etmek.",
              "Yazılım ve tasarım ekiplerine kullanıcı deneyimini iyileştirecek geliştirmeler için feedback vermek."
          ];
          
          skillsArr = [
              "Analiz Araçları: Google Analytics 4, Search Console, Hotjar vb. ileri seviye kullanım",
              "Pazarlama Ekosistemi: Meta Ads Manager, Google Ads, E-posta Pazarlama (Insider vb.)",
              "Teknik Altyapı ve Platformlar: Shopify, Magento, T-Soft veya Ticimax bilgisi",
              "Yönetim ve Entegrasyon: ERP / Pazaryeri Entegrasyon yazılımları (StockMount, Akinon vb.)",
              "Veri odaklı karar verme, analitik düşünme ve kriz anında çözüm üretme kabiliyeti"
          ];

          fullText = `### 📋 Genel Özet\nBir ${aiPrompt}, bir şirketin dijital dünyadaki mağaza müdürüdür; ancak sorumluluk alanı fiziksel bir dükkandan çok daha geniştir. Temel amacı, dijital kanallar üzerinden satışları artırmak, müşteri deneyimini optimize etmek ve markanın online görünürlüğünü yönetmektir.\n\n**${aiPrompt}**, şirketin online satış platformlarının (web sitesi, mobil uygulama ve pazaryerleri) uçtan uca yönetiminden sorumludur. Satış stratejileri geliştirir, dijital pazarlama faaliyetlerini koordine eder ve operasyonel süreçlerin (stok, lojistik, ödeme sistemleri) sorunsuz işlemesini sağlar.\n\n### ✅ Temel Görev ve Sorumluluklar\n**1. Stratejik Planlama ve Satış Yönetimi**\n- Yıllık ve aylık satış hedeflerini belirlemek ve bu hedeflere ulaşmak için stratejiler geliştirmek.\n- Pazar trendlerini, rakip faaliyetlerini ve müşteri davranışlarını analiz ederek aksiyon almak.\n- Pazaryeri yönetimi (Trendyol, Hepsiburada, Amazon vb.) süreçlerini yürütmek.\n\n**2. Dijital Pazarlama ve Dönüşüm Optimizasyonu**\n- SEO, SEM, Google Ads ve sosyal medya reklam süreçlerini pazarlama ekibiyle koordine etmek.\n- Web sitesi trafiğini analiz ederek Dönüşüm Oranı Optimizasyonu (CRO) çalışmaları yapmak.\n- Kampanya kurguları hazırlamak (Black Friday, bayram indirimleri vb.) ve performanslarını ölçümlemek.\n\n**3. Operasyon ve Stok Yönetimi**\n- Ürünlerin sisteme doğru fiyat, açıklama ve görsellerle girilmesini sağlamak.\n- Stok seviyelerini takip etmek ve satın alma departmanı ile koordineli çalışarak "stoksuz kalma" riskini yönetmek.\n- Lojistik ve kargo süreçlerini denetleyerek müşteri memnuniyetini en üst düzeyde tutmak.\n\n**4. Teknik Yönetim ve Kullanıcı Deneyimi (UX)**\n- Web sitesinin hızı, ödeme altyapısı ve mobil uyumluluğu gibi teknik süreçleri takip etmek.\n- Yazılım ve tasarım ekiplerine kullanıcı deneyimini iyileştirecek geliştirmeler için feedback vermek.\n\n### 🛠 Gerekli Yetkinlikler ve Araçlar\n- **Analiz:** Google Analytics 4, Search Console, Hotjar\n- **Pazarlama:** Meta Ads Manager, Google Ads, E-posta Pazarlama (Insider vb.)\n- **Teknik Altyapı:** Shopify, Magento, T-Soft veya Ticimax bilgisi\n- **Yönetim:** ERP/Pazaryeri Entegrasyon yazılımları (StockMount, Akinon vb.)\n\n### 🎓 Aranan Nitelikler\n- Üniversitelerin İşletme, İktisat, Endüstri Mühendisliği veya Pazarlama bölümlerinden mezun.\n- E-ticaret ekosisteminde (operasyon, satış ve pazarlama) en az 5 yıl deneyim.\n- Veri odaklı karar verme yeteneğine sahip ve raporlama becerisi yüksek.\n- Ekip yönetimi ve farklı departmanlar arası koordinasyon yeteneği.\n\n*Küçük bir not: E-ticaret müdürlüğü sadece "ürün yüklemek" değildir; günün sonunda rakamlarla konuşan, analitik düşünen ve kriz anında hızlı çözüm üreten bir "dijital orkestra şefi" olmaktır.*`;
      } else {
          // Çok zengin generik şablon
          objective = `**${aiPrompt}**, şirketin uzun vadeli büyüme stratejisinin tam merkezinde yer alır. Klasik idari sınırların ötesinde, bu rol ilgili ekosistemdeki süreçleri modern araçlarla optimize eden, verimliliğe değer katan ve kurumsal hafızayı şekillendiren temel sütunlardan biridir. Kendi alanının orkestrasyonunu üstlenerek sadece operasyonel yürütmeyi değil, aynı zamanda iyileştirici dönüşümü (optimizing transformation) yönetir.`;
          
          tasksArr = [
              "Birim bazlı orta ve uzun vadeli stratejilerin çizilmesi ve KPI temelli eylem planlarının oluşturulması.",
              "Çapraz fonksiyonel (cross-functional) birimlerle uyumlanarak operasyonel takılmaları önlemek adına günlük iş akışlarını tasarlamak.",
              "C-Level yöneticiler için düzenli olarak içgörü (insight) üretebilecek veri odaklı pazar veya süreç analizleri raporlamak.",
              "Şirketin temel değerlerine sadık kalarak, süreçlerdeki dijitalleşme ve otomasyon fırsatlarını sahada uygulamak.",
              "Paydaş beklentilerini karşılayacak iyileştirilmiş bir Kullanıcı/İç-Müşteri deneyimi tasarlamak ve ölçümlemek."
          ];
          
          skillsArr = [
              "Ekosistemin gerektirdiği güncel yazılımlara, CRM ERP veya Endüstriyel panel çözümlerine tam entegre çalışabilme pratikliği.",
              "Verileri soyut bir rakam yığını olarak görmeyip, onlardan şirketin alacağı aksiyonları (actionable data) damıtma metodolojisi.",
              "Çevik (Agile) ve Yalın (Lean) prensipler bağlamında karmaşık projeleri yönetebilme.",
              "Zorlu kriz anlarında sükuneti sağlayarak proaktif (önleyici) inisiyatif alma becerisi."
          ];

          fullText = `### 📋 Genel Özet\n**${aiPrompt}**, şirketin uzun vadeli büyüme stratejisinin tam merkezinde yer alır. Klasik idari sınırların ötesinde, bu rol ilgili ekosistemdeki süreçleri modern araçlarla optimize eden, verimliliğe değer katan ve kurumsal hafızayı şekillendiren temel sütunlardan biridir. Kendi alanının orkestrasyonunu üstlenerek sadece operasyonel yürütmeyi değil, aynı zamanda departmanlar arası iyileştirici dönüşümü yönetir.\n\n### ✅ Temel Görev ve Sorumluluklar\n**1. Stratejik Hizalama ve Planlama**\n- Birim bazlı orta ve uzun vadeli stratejilerin çizilmesi ve organizasyonel hedeflerle eşlendiğinden emin olunması.\n- Performans metriklerini ve piyasa verilerini sürekli yorumlayarak aksiyon planları oluşturmak.\n\n**2. Operasyonel Mükemmellik**\n- Çapraz fonksiyonel (cross-functional) birimlerle koordineli şekilde çalışarak, süreçlerdeki potansiyel darboğazları önceden analiz etmek.\n- Kurumsal süreçlerdeki dijitalleşme ve teknoloji adaptasyonu fırsatlarını sahada bizzat uygulamak.\n\n**3. Paydaş/Müşteri Deneyimi**\n- Paydaş beklentilerini karşılayacak olan iyileştirilmiş bir ekosistem yaratmak, iletişim kanallarını açık ve çift yönlü tutmak.\n- Yöneticiler için içgörü (insight) yaratan analizler sunarak sağlıklı karar alma mekanizmasını beslemek.\n\n### 🛠 Gerekli Yetkinlikler ve Araçlar\n- **Teknoloji Eğilimi:** Sektörün standartı haline gelmiş güncel yazılımlara hızla adapte olup ileri seviyede kullanabilme.\n- **Analitik İnceleme:** Verileri soyut rakamlar olarak değil, iş stratejisi olarak okuma disiplini.\n- **Çevik Yönetim:** Dinamik iş ortamında Agile ve Lean (Yalın) pratikleri benimseme.\n\n### 🎓 Aranan Nitelikler\n- İlgili lisans programlarından mezuniyet ve sektör dinamiklerinde uzmanlık seviyesine erişim sağlayacak iş tecrübesi.\n- Bağımsız, otonom çalışabilme yetisine karşın; gerektiğinde bir takım oyuncusu ve "orkestra şefi" olabilme zekası.\n- Karar ağaçları tasarlamada ve kriz algoritmalarında stratejik yetkinlik.\n\n*Not: Bu rol, yalnızca atanmış görevleri icra etmekle kalmayıp statükoyu sürekli olarak sorgulayan inovatif bir ruh gerektirir.*`;
      }

      const mockResult = {
         prompt: aiPrompt,
         objective: objective,
         tasks: tasksArr,
         skills: skillsArr,
         fullText: fullText
      };
      setAiResult(mockResult);
    }, 1500);
  };

  const handleSaveAiTemplate = () => {
      if (!aiResult) return;
      // 1. Save items to master library
      let taskItems = [];
      let skillItems = [];
      aiResult.tasks.forEach(t => {
          taskItems.push(db.addLibraryItem({ type: 'TASK', name: t.substring(0, 45)+'...', description: t, category: 'Operasyon', isActive: true, tags: ['ai-generated'] }));
      });
      aiResult.skills.forEach(s => {
          skillItems.push(db.addLibraryItem({ type: 'SKILL', name: s.substring(0, 45)+'...', description: s, category: 'Teknik', isActive: true, tags: ['ai-generated'] }));
      });

      // 2. Save role template
      const template = {
        name: `AI Profil: ${aiResult.prompt}`,
        jobFamily: 'Merkez Operasyon',
        level: 'Uzman',
        experience: 'Minimum 2 Yıl İlgili Alan',
        education: 'Lisans Mezunu',
        jobSummary: aiResult.objective,
        items: [
          ...taskItems.map(t => ({ libraryItemId: t.id, weight: 25 })),
          ...skillItems.map(s => ({ libraryItemId: s.id, weight: 0, isRequired: true })),
        ]
      };
      
      db.saveRoleTemplate(template);
      alert('Tebrikler! Belge başarıyla okunup Sisteme (Master Veri & Şablon) kaydedildi.');
      setActiveTab('library');
  };

  const handleAiEnrich = () => {
    if (!enrichPrompt.trim()) return;
    setIsEnriching(true);
    setEnrichResult(null);

    setTimeout(() => {
      setIsEnriching(false);
      let count = 0;
      
      if (enrichType === 'ALL' || enrichType === 'COMPETENCY') {
          db.addLibraryItem({ type: 'COMPETENCY', name: `${enrichPrompt} Yönetimi (AI)`, category: 'Yönetsel', description: 'Alanla ilgili süreçleri başarıyla yönetme', isActive: true, tags: ['ai-enriched'] });
          db.addLibraryItem({ type: 'COMPETENCY', name: `${enrichPrompt} Stratejileri (AI)`, category: 'Strateji', description: 'Uzun vadeli ve kapsamlı analiz yeteneği', isActive: true, tags: ['ai-enriched'] });
          count += 2;
      }
      if (enrichType === 'ALL' || enrichType === 'SKILL') {
          db.addLibraryItem({ type: 'SKILL', name: `${enrichPrompt} Metrikleri Analizi (AI)`, category: 'Teknik', description: 'Alanla ilgili verilere hakimiyet', isActive: true, tags: ['ai-enriched'] });
          db.addLibraryItem({ type: 'SKILL', name: `${enrichPrompt} Dinamikleri Okuma (AI)`, category: 'Araştırma', description: 'Sektör ve pazar dinamiklerini okuma', isActive: true, tags: ['ai-enriched'] });
          count += 2;
      }
      if (enrichType === 'ALL' || enrichType === 'TASK') {
          db.addLibraryItem({ type: 'TASK', name: `${enrichPrompt} Süreç Toplantısı Yönetimi (AI)`, category: 'Operasyon', description: 'İlgili alanda periyodik senkronizasyon', isActive: true, tags: ['ai-enriched'] });
          db.addLibraryItem({ type: 'TASK', name: `${enrichPrompt} Standartlarının Belirlenmesi (AI)`, category: 'Kalite', description: 'İlgili dikeyde kalite regülasyonlarını oturtma', isActive: true, tags: ['ai-enriched'] });
          count += 2;
      }
      if (enrichType === 'KPI') {
          db.addLibraryItem({ type: 'KPI', name: `${enrichPrompt} Başarı Oranı (AI)`, category: 'Genel', description: 'Aylık hedef tutturma yüzdesi', isActive: true, tags: ['ai-enriched'] });
          count += 1;
      }
      
      setEnrichResult({ message: `Toplam ${count} adet yeni kayıt "${enrichPrompt}" odağında başarıyla üretilip kütüphaneye eklendi!` });
    }, 2000);
  };

  const handleAddLibraryItem = () => {
    if (!newItemTitle.trim()) return;
    db.addLibraryItem({
      type: newItemType,
      name: newItemTitle,
      description: newItemDesc,
      category: newItemCategory || 'Genel',
      tags: newItemTags.split(',').map(t => t.trim()).filter(t => t),
      isActive: true,
      version: '1.0'
    });
    setNewItemTitle('');
    setNewItemDesc('');
    setNewItemTags('');
    setNewItemCategory('');
  };

  const handleAddField = () => {
    if (!newFieldName.trim()) return;
    db.addMetadataField({
      entityType: 'ROLE_TEMPLATE',
      name: newFieldName,
      type: newFieldType,
      required: false,
      options: newFieldType === 'LOOKUP' ? ['Seçenek 1', 'Seçenek 2'] : undefined
    });
    setNewFieldName('');
  };

  return (
    <div className="fade-in ji-container">
      <div className="glass-card ji-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>🤖 AI Profil & Kurulum Sihirbazı</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', margin: '0.5rem 0 0' }}>
            Manuel veri girmek yerine, KOBİ'nizin ihtiyaç duyduğu profilleri yapay zekaya ürettirin.
          </p>
        </div>
        <button className="ji-btn ghost" onClick={() => {
           if(window.confirm('Emin misiniz? Tüm verileriniz fabrika ayarlarına (Varsayılan şablonlara) dönecektir.')) {
              window.localStorage.removeItem('ji_library');
              window.localStorage.removeItem('ji_templates');
              window.localStorage.removeItem('ji_analyses');
              window.localStorage.removeItem('ji_metadata');
              window.location.reload();
           }
        }}>🔄 Reset Factory Defaults</button>
      </div>

      <div className="ji-tabs" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', borderBottom: '2px solid #E2E8F0' }}>
        <button 
          className={`ji-tab-btn ${activeTab === 'ai_generator' ? 'active' : ''}`} 
          onClick={() => setActiveTab('ai_generator')}
          style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'ai_generator' ? '3px solid #8B5CF6' : '3px solid transparent', fontWeight: 600, cursor: 'pointer', color: activeTab === 'ai_generator' ? '#8B5CF6' : '#64748B' }}
        >✨ AI Otonom Üretim</button>
        <button 
          className={`ji-tab-btn ${activeTab === 'library' ? 'active' : ''}`} 
          onClick={() => setActiveTab('library')}
          style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'library' ? '3px solid #4F46E5' : '3px solid transparent', fontWeight: 600, cursor: 'pointer', color: activeTab === 'library' ? '#4F46E5' : '#64748B' }}
        >📚 Mevcut Kütüphane</button>
        <button 
          className={`ji-tab-btn ${activeTab === 'metadata' ? 'active' : ''}`} 
          onClick={() => setActiveTab('metadata')}
          style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'metadata' ? '3px solid #4F46E5' : '3px solid transparent', fontWeight: 600, cursor: 'pointer', color: activeTab === 'metadata' ? '#4F46E5' : '#64748B' }}
        >⚙️ Manuel Ekleme (İleri Seviye)</button>
      </div>

      <div className="ji-content-grid" style={{ display: 'grid', gridTemplateColumns: activeTab === 'ai_generator' ? '1fr' : '1fr 1fr', gap: '2rem' }}>
        
        {/* TAB: AI GENERATOR */}
        {activeTab === 'ai_generator' && (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', gridColumn: 'span 2' }}>
             <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', background: 'linear-gradient(to bottom right, #F8FAFC, #EEF2FF)' }}>
               {!aiResult ? (
                 <>
                   <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
                   <h2 style={{ color: '#1E293B' }}>Hangi pozisyona ihtiyacınız var?</h2>
                   <p style={{ color: '#64748B', marginBottom: '2rem' }}>Şirketiniz için aradığınız pozisyonu yazın. Gelişmiş yapay zekamız sizin için mükemmel bir görev tanımı kaleme alsın.</p>
                   
                   <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                      <input 
                        className="ji-input" 
                        style={{ width: '400px', fontSize: '1.2rem', padding: '1rem', borderRadius: '12px', border: '2px solid #C4B5FD', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
                        value={aiPrompt} 
                        onChange={e => setAiPrompt(e.target.value)} 
                        placeholder="Örn: E-Ticaret Müdürü" 
                        disabled={isGenerating}
                      />
                      <button 
                        className="ji-btn primary" 
                        style={{ background: '#8B5CF6', fontSize: '1.1rem', padding: '0 2rem', borderRadius: '12px' }} 
                        onClick={handleAiGenerate}
                        disabled={isGenerating}
                      >
                        {isGenerating ? 'Yazılıyor...' : 'Taslak Üret'}
                      </button>
                   </div>
                 </>
               ) : (
                 <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                   <button className="ji-btn ghost" onClick={() => setAiResult(null)}>⬅️ Yeni Arama</button>
                   <button className="ji-btn primary" style={{ background: '#10B981', fontSize: '1.1rem', padding: '0.75rem 2rem' }} onClick={handleSaveAiTemplate}>
                     💾 Bunu Şablon Olarak Kütüphaneme Kaydet
                   </button>
                 </div>
               )}

               {isGenerating && (
                  <div className="fade-in" style={{ marginTop: '2rem' }}>
                     <div className="spinner" style={{ margin: '0 auto 1rem', width: '40px', height: '40px', border: '4px solid #E2E8F0', borderTop: '4px solid #8B5CF6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                     <h4 style={{ color: '#8B5CF6', margin: 0 }}>Yapay Zeka görev tanımını kaleme alıyor...</h4>
                     <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Sektörel trendler ve standartlar derleniyor.</p>
                     <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                  </div>
               )}
             </div>

             {/* GENERATIVE METİN ALANI */}
             {aiResult && !isGenerating && (
                <div className="glass-card fade-in" style={{ padding: '3rem', margin: '0 auto', width: '100%', maxWidth: '900px', background: '#FFFFFF', textAlign: 'left', borderTop: '6px solid #8B5CF6', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                   <h1 style={{ color: '#1E293B', fontSize: '2.5rem', marginBottom: '0.5rem', marginTop: 0 }}>{aiResult.prompt} <span style={{ color: '#8B5CF6' }}>Görev Tanımı</span></h1>
                   <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '2rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem' }}>
                      Bu doküman yapay zeka tarafından <strong>{new Date().toLocaleDateString('tr-TR')}</strong> tarihinde oluşturulmuştur.
                   </p>
                   
                   <GeminiStreamer text={aiResult.fullText} />
                </div>
             )}
           </div>
        )}

        {/* TAB: MANUAL METADATA */}
        {activeTab === 'metadata' && (
          <>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3>🔧 Manuel Veri Ekleme</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.5rem' }}>Tekil görev veya yetkinlikleri manuel olarak havuza ekleyin.</p>
              
              <div style={{ marginBottom: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Veri Tipi</label>
                  <select className="ji-input" value={newItemType} onChange={e => setNewItemType(e.target.value)}>
                    <option value="JOB_FAMILY">İş Ailesi (Job Family)</option>
                    <option value="JOB_FUNCTION">İş Fonksiyonu</option>
                    <option value="JOB_LEVEL">İş Seviyesi (Level)</option>
                    <option value="COMPETENCY">Yetkinlik (Competency)</option>
                    <option value="SKILL">Beceri (Skill)</option>
                    <option value="KNOWLEDGE">Bilgi Alanı (Knowledge)</option>
                    <option value="RESPONSIBILITY">Sorumluluk</option>
                    <option value="TASK">Görev (Task)</option>
                    <option value="KPI">KPI Tanımı</option>
                    <option value="WORK_CONDITION">Çalışma Koşulu</option>
                    <option value="CERTIFICATION">Sertifika</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Kategori</label>
                  <input className="ji-input" value={newItemCategory} onChange={e => setNewItemCategory(e.target.value)} placeholder={placeholders.category} />
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Ad (Başlık)</label>
                <input className="ji-input" value={newItemTitle} onChange={e => setNewItemTitle(e.target.value)} placeholder={placeholders.title} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Açıklama (Description)</label>
                <textarea className="ji-input" style={{ resize: 'vertical', minHeight: '60px' }} value={newItemDesc} onChange={e => setNewItemDesc(e.target.value)} placeholder={placeholders.desc}></textarea>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Etiketler (Tags - Virgülle ayırın)</label>
                <input className="ji-input" value={newItemTags} onChange={e => setNewItemTags(e.target.value)} placeholder={placeholders.tags} />
              </div>
              <button className="ji-btn primary" onClick={handleAddLibraryItem}>Kütüphaneye Ekle</button>
              
              <hr style={{ margin: '2rem 0', borderColor: '#E2E8F0' }}/>
              
              <h3>Yeni Dinamik Alan (Custom Field) Oluştur</h3>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Veri Tipi</label>
                <select className="ji-input" value={newFieldType} onChange={e => setNewFieldType(e.target.value)}>
                  <option value="TEXT">Metin (Text)</option>
                  <option value="NUMBER">Sayı (Number)</option>
                  <option value="LOOKUP">Açılır Liste (Dropdown)</option>
                </select>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Alan Adı (Field Name)</label>
                <input className="ji-input" value={newFieldName} onChange={e => setNewFieldName(e.target.value)} placeholder="Örn: Çalışma Modeli" />
              </div>
              <button className="ji-btn primary" onClick={handleAddField}>Metadata'ya Ekle</button>
            </div>

            <div className="glass-card" style={{ padding: '2rem', maxHeight: '500px', overflowY: 'auto' }}>
               <h3 style={{ marginTop: 0 }}>Özel Veri Alanları</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 {db.metadataFields.map(field => (
                   <div key={field.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                     <strong>{field.name}</strong>
                     <div style={{ display: 'flex', gap: '0.5rem' }}>
                       {field.required && <span style={{ fontSize: '0.7rem', color: '#EF4444', fontWeight: 700 }}>*ZORUNLU</span>}
                       <span style={{ fontSize: '0.75rem', background: '#FEF08A', color: '#854D0E', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{field.type}</span>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </>
        )}

        {/* TAB: LIBRARY VIEWER */}
        {activeTab === 'library' && (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', gridColumn: 'span 2' }}>
             
             {/* AI ENRICHER PANEL */}
             <div className="glass-card fade-in" style={{ padding: '2rem', background: 'linear-gradient(to right, #F8FAFC, #F3F4F6)' }}>
                <h3 style={{ marginTop: 0, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✨ AI Kütüphane Zenginleştirici (Bulk Generator)</h3>
                <p style={{ color: '#64748B', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Profil oluşturmadan, sadece kütüphanenizin sözlüğünü (Ontoloji) toplu olarak zenginleştirmek için bir alan girin.</p>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                   <div style={{ flex: 1 }}>
                     <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Hangi departman veya uzmanlık için veri üretelim?</label>
                     <input className="ji-input" value={enrichPrompt} onChange={e => setEnrichPrompt(e.target.value)} placeholder="Örn: E-Ticaret, Finans, Siber Güvenlik" disabled={isEnriching} />
                   </div>
                   <div style={{ width: '250px' }}>
                     <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Hangi Tipler Üretilsin?</label>
                     <select className="ji-input" value={enrichType} onChange={e => setEnrichType(e.target.value)} disabled={isEnriching}>
                       <option value="ALL">Tümü (Karma)</option>
                       <option value="COMPETENCY">Sadece Yetkinlikler</option>
                       <option value="SKILL">Sadece Beceriler</option>
                       <option value="TASK">Sadece Görevler</option>
                       <option value="KPI">Sadece KPI</option>
                     </select>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'flex-end', height: '62px' }}>
                     <button className="ji-btn primary" style={{ background: '#4F46E5' }} onClick={handleAiEnrich} disabled={isEnriching}>
                       {isEnriching ? 'Üretiliyor...' : 'Kütüphaneyi Besle'}
                     </button>
                   </div>
                </div>
                {enrichResult && (
                   <div className="fade-in" style={{ background: '#D1FAE5', color: '#065F46', padding: '1rem', borderRadius: '8px', marginTop: '1rem', fontSize: '0.9rem' }}>
                      ✅ {enrichResult.message}
                   </div>
                )}
             </div>

             {/* GROUPED LIBRARY LIST */}
             <div className="glass-card fade-in" style={{ padding: '2rem', maxHeight: '700px', overflowY: 'auto' }}>
               <h3 style={{ marginTop: 0, display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                  Kütüphane Verileri (Tipe Göre Gruplandırılmış)
                  <span style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 'normal' }}>Toplam {db.library.length} kayıt var</span>
               </h3>
               
               {['COMPETENCY', 'SKILL', 'TASK', 'KPI', 'JOB_FAMILY', 'JOB_FUNCTION', 'JOB_LEVEL', 'KNOWLEDGE', 'RESPONSIBILITY', 'WORK_CONDITION', 'CERTIFICATION'].map(type => {
                  const items = db.library.filter(item => item.type === type);
                  if (items.length === 0) return null;
                  
                  const typeNames = {
                    COMPETENCY: 'Yetkinlikler', SKILL: 'Beceriler', TASK: 'Görevler', KPI: 'KPI Tanımları', 
                    JOB_FAMILY: 'İş Ailesi', JOB_FUNCTION: 'İş Fonksiyonu', JOB_LEVEL: 'İş Seviyesi', 
                    KNOWLEDGE: 'Bilgi Alanları', RESPONSIBILITY: 'Sorumluluklar', WORK_CONDITION: 'Çalışma Koşulları', CERTIFICATION: 'Sertifikalar'
                  };

                  return (
                    <div key={type} style={{ marginBottom: '2.5rem' }}>
                      <h4 style={{ color: '#334155', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                         <span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.9rem' }}>{typeNames[type] || type}</span>
                         <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 'normal' }}>({items.length} kayıt)</span>
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                        {items.map(item => (
                          <div key={item.id} style={{ display: 'flex', flexDirection: 'column', padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: item.tags?.includes('ai-enriched') ? '2px solid #8B5CF6' : '1px solid #E2E8F0', position: 'relative' }}>
                            {(item.tags?.includes('ai-generated') || item.tags?.includes('ai-enriched')) && <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#8B5CF6', color: 'white', fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '10px', fontWeight: 'bold' }}>AI Üretimi</div>}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                              <strong style={{ color: '#1E293B' }}>{item.name}</strong>
                            </div>
                            {item.description && <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '0.5rem' }}>{item.description}</div>}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                               <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Kat: {item.category}</span>
                               <button onClick={() => { if(window.confirm('Bu veriyi kütüphaneden silmek istediğinize emin misiniz?')) db.removeLibraryItem(item.id); }} style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '1rem' }} title="Kalıcı Olarak Sil">🗑️</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
               })}
             </div>
           </div>
        )}

      </div>
    </div>
  );
}
