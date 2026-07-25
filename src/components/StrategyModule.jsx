import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './StrategyModule.css';

const defaultDimensions = [
  { id: 'finance', title: 'Finans', icon: '💰', color: '#10B981' },
  { id: 'customer', title: 'Müşteri', icon: '🤝', color: '#3B82F6' },
  { id: 'process', title: 'Süreçler', icon: '⚙️', color: '#F59E0B' },
  { id: 'learning', title: 'Gelişim', icon: '🧠', color: '#8B5CF6' }
];

const intentLabels = [
  'Artırmak', 'Azaltmak', 'İyileştirmek', 'Genişletmek', 
  'Optimize Etmek', 'Geliştirmek', 'Standartlaştırmak', 'Hızlandırmak', 
  'Önlemek', 'Korumak', 'Sürdürmek', 'Dijitalleştirmek'
];

const mockAI = {
  finance: {
    subjects: [
      'Gelir / Ciro', 'Karlılık', 'Nakit Akışı', 'Pazar Payı', 'Operasyonel Maliyetler', 
      'Giderler', 'Borç Yükü', 'Kurumsal Değer', 'ROI (Yatırım Getirisi)', 'Tahsilat Süresi', 
      'Yeni Gelir Kanalları', 'Yatırım Portföyü', 'Brüt Kar Marjı', 'FAVÖK', 
      'İşletme Sermayesi', 'Müşteri Yaşam Boyu Değeri (LTV)', 'Stok Devir Hızı', 
      'Birim Başına Maliyet', 'Satış Giderleri', 'Sermaye Maliyeti'
    ],
    kpis: [
      'Aylık Toplam Ciro (TL)', 'Yeni Müşteri Geliri Oranı (%)', 'Büyüme Hızı (%)',
      'Brüt Kar Marjı (%)', 'Net Kar (%)', 'FAVÖK Değeri (TL)', 'Aylık Sabit Giderler (TL)',
      'Birim Başına Maliyet Oranı', 'Nakit Akış Pozitiflik Süresi (Ay)', 'Yıllık ROI Oranı (%)',
      'Ortalama Tahsilat Süresi (Gün)', 'Özkaynak Karlılığı (%)', 'İşletme Sermayesi Devir Hızı',
      'İhracat Gelir Oranı (%)', 'Aktif Karlılık (%)'
    ]
  },
  customer: {
    subjects: [
      'Müşteri Memnuniyeti', 'Müşteri Sadakati', 'Yeni Müşteri Edinimi', 'NPS Skoru', 
      'Müşteri Kayıp Oranı (Churn)', 'Şikayet Sayısı', 'Müşteri Deneyimi', 'Destek Yanıt Süresi', 
      'Marka Algısı / İtibarı', 'Pazar Erişimi', 'Hedef Kitle Segmenti', 'Tekrar Satın Alma Oranı', 
      'Marka Bilinirliği', 'Organik Trafik', 'Sosyal Medya Etkileşimi', 'Sepet Ortalaması',
      'Referans Müşteri Sayısı', 'Kullanıcı Bağlılığı (Retention)'
    ],
    kpis: [
      'NPS (Net Promoter Score)', 'CSAT (Müşteri Memnuniyet Skoru)', 'Olumlu Yorum Oranı (%)',
      'Aylık Churn Oranı (%)', 'İptal Edilen Abonelik Sayısı', 'Yenileme Oranı (%)',
      'Müşteri Başına Ortalama Sepet Tutarı (TL)', 'Yeni Kazanılan Müşteri Sayısı',
      'Destek Talebi Çözüm Süresi (Saat)', 'Şikayet Çözüm Oranı (%)', 'Marka Bilinirlik İndeksi',
      'Sosyal Medya Engagement Oranı (%)', 'Müşteri Edinme Maliyeti (CAC)', 'Aylık Aktif Kullanıcı (MAU)'
    ]
  },
  process: {
    subjects: [
      'Üretim / Hizmet Kapasitesi', 'Otomasyon Oranı', 'Hata / Fire Oranı', 'Teslimat Süresi', 
      'Kalite Standartları', 'Tedarik Zinciri Verimliliği', 'Hizmet Ağı', 'Üretim Tesisleri', 
      'Süreç Standartizasyonu', 'Kapasite Kullanım Oranı', 'Operasyonel Çeviklik', 
      'Dijital Adaptasyon', 'İş Sağlığı ve Güvenliği', 'Atık Yönetimi', 'Stok Yönetimi',
      'Lojistik Maliyetleri', 'Enerji Verimliliği', 'Sistem Kesinti Süreleri'
    ],
    kpis: [
      'Üretim Fire Oranı (%)', 'İade Edilen Ürün Oranı (%)', 'Süreç Verimliliği İndeksi',
      'Ortalama Teslimat Süresi (Gün)', 'Zamanında Teslimat Oranı (OTIF) (%)',
      'Kapasite Kullanım Oranı (%)', 'Operasyonel Maliyet Tasarrufu (TL)', 'Otomasyon Kapsama Oranı (%)',
      'Stok Doğruluk Oranı (%)', 'Sıfır Hata Gerçekleşme Oranı (%)', 'Enerji Tüketim Yüzdesi (%)',
      'Sistem Uptime Oranı (%)', 'Arıza Müdahale Süresi (MTTR)', 'İş Süreci Çevrim Süresi (Saat)'
    ]
  },
  learning: {
    subjects: [
      'Çalışan Memnuniyeti', 'Eğitim Saatleri', 'Personel Devir Hızı (Turnover)', 'İş Kazaları', 
      'Kurum Kültürü ve Değerler', 'Teknolojik Altyapı', 'Ar-Ge Kapasitesi', 'Yetenek Havuzu', 
      'Liderlik Gelişimi', 'Yenilikçilik İndeksi', 'Oryantasyon Süresi', 'İç İletişim',
      'Çalışan Bağlılığı', 'Performans Yönetim Skoru', 'Patent/Faydalı Model Sayısı',
      'Kurumsal Check Up Skoru', 'Ekipler Arası İşbirliği', 'Çalışan Öneri Sayısı'
    ],
    kpis: [
      'eNPS (Çalışan Tavsiye Skoru)', 'Yıllık Turnover Oranı (%)', 'İş Kazası Sıklık Oranı',
      'Kişi Başı Yıllık Eğitim (Saat)', 'Eğitim Bütçesi Gerçekleşme Oranı (%)',
      'Yetenek Elde Tutma Oranı (%)', 'İçeriden Terfi Oranı (%)', 'Yeni Ürün/Hizmet Gelir Oranı (%)',
      'Ar-Ge Harcamalarının Ciroya Oranı (%)', 'Patente Dönüşen Fikir Sayısı',
      'Oryantasyon Memnuniyet Skoru', 'Çalışan Öneri Uygulanma Oranı (%)', 'Dijital Araç Kullanım Oranı (%)'
    ]
  }
};

export default function StrategyModule({ employees = [], userRole = 'danisman', goals, setGoals, suggestedStrategies = [], setSuggestedStrategies, companyId }) {
  const p = `kobi_${companyId || 'default'}`;
  const [dimensions, setDimensions] = useLocalStorage(`${p}_strategy_dims`, defaultDimensions);
  
  const [view, setView] = useState(goals.length === 0 ? 'wizard' : 'dashboard');
  const [isSuggestionsModalOpen, setIsSuggestionsModalOpen] = useState(false);
  const [expandedDims, setExpandedDims] = useState({});
  
  const defaultOrientation = {
    vizyon: '',
    misyon: '',
    degerler: '',
    ilkeler: '',
    oncelikler: '',
    durus: '',
    degerOnermesi: '',
    anaYetkinlikler: ''
  };
  const [orientation, setOrientation] = useLocalStorage(`${p}_strategic_orientation`, defaultOrientation);
  const [editingCard, setEditingCard] = useState(null);
  const [mainTab, setMainTab] = useState('orientation'); // 'orientation' | 'planning'

  const orientationCards = [
    { id: 'vizyon', title: 'Vizyon', icon: '🔭', placeholder: 'Örn: Sektörümüzde teknoloji ve inovasyonla yön veren, global çapta en çok tercih edilen ilk 3 markadan biri olmak.' },
    { id: 'misyon', title: 'Misyon', icon: '🎯', placeholder: 'Örn: Müşterilerimizin hayatını kolaylaştıran, çevreye duyarlı ve sürdürülebilir hizmetleri en yüksek kalite standartlarında sunmak.' },
    { id: 'degerler', title: 'Değerler', icon: '💎', placeholder: 'Örn:\n• Şeffaflık\n• İnsana ve Çevreye Saygı\n• Sürekli Gelişim\n• Yenilikçilik' },
    { id: 'ilkeler', title: 'İlkeler', icon: '⚖️', placeholder: 'Örn:\n• Çalışanlarımızın fikirlerine değer veririz.\n• Kaliteden hiçbir koşulda taviz vermeyiz.\n• Etik kurallara sıkı sıkıya bağlı kalırız.' },
    { id: 'oncelikler', title: 'Stratejik Öncelikler', icon: '🚀', placeholder: 'Örn:\n• Karlılığı artırmak\n• Operasyonel maliyetleri düşürmek\n• Kurumsallaşmayı sağlamak\n• Yeni pazarlara açılmak' },
    { id: 'durus', title: 'Kurumsal Duruş', icon: '🏛️', placeholder: 'Örn: Toplumun gelişimine katkıda bulunan, adil rekabeti savunan ve paydaşlarına güven veren saygın bir kurumsal vatandaş.' },
    { id: 'degerOnermesi', title: 'Değer Önermesi', icon: '🌟', placeholder: 'Örn: Rakiplerimizden farklı olarak, çözümlerimizi 5 yıl garanti ve 7/24 kesintisiz yerinde servis desteğiyle uçtan uca sunuyoruz.' },
    { id: 'anaYetkinlikler', title: 'Ana Yetkinlikler', icon: '🔑', placeholder: 'Örn:\n• Çevik ve esnek üretim altyapımız\n• Yüksek mühendislik ve Ar-Ge kapasitemiz\n• Güçlü ve optimize edilmiş tedarik ağımız' }
  ];
  
  // Toasts
  const [toasts, setToasts] = useState([]);
  
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // --- WIZARD STATE ---
  const [step, setStep] = useState(1);
  const [wDimSelectionType, setWDimSelectionType] = useState('none');
  const [wCustomDimName, setWCustomDimName] = useState('');
  const [wDim, setWDim] = useState(null);
  const [wIntent, setWIntent] = useState(null);
  const [wSubjectSelectionType, setWSubjectSelectionType] = useState('none');
  const [wSubject, setWSubject] = useState('');
  
  // KPI Options
  const [wKpiSelectionType, setWKpiSelectionType] = useState('none');
  const [wKpi, setWKpi] = useState('');
  const [wKpiTarget, setWKpiTarget] = useState('');
  
  // Action state
  const [wActions, setWActions] = useState([]);
  const [actionTitle, setActionTitle] = useState('');
  const [actionOwner, setActionOwner] = useState('');
  const [actionDeadline, setActionDeadline] = useState('');

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => {
    if (step === 3) {
      setWKpiSelectionType('none');
      setWKpi('');
    }
    if (step === 2) {
      setWSubjectSelectionType('none');
      setWSubject('');
      setWDimSelectionType('none');
      setWCustomDimName('');
    }
    setStep(prev => prev - 1);
  };

  const handleAddDimension = () => {
    if (dimensions.length >= 6) {
      alert("En fazla 6 stratejik boyut ekleyebilirsiniz.");
      return;
    }
    const newDimName = prompt("Eklemek istediğiniz yeni stratejik boyutun adını girin:");
    if (newDimName && newDimName.trim() !== '') {
      const newDim = {
        id: `custom_${Date.now()}`,
        title: newDimName,
        icon: '📌',
        color: '#64748B' // slate-500
      };
      setDimensions([...dimensions, newDim]);
    }
  };

  const handleAddAction = () => {
    if (!actionTitle || !actionOwner || !actionDeadline) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }
    const newAction = {
      id: Date.now().toString(),
      title: actionTitle,
      owner: actionOwner,
      deadline: actionDeadline,
      status: 'bekliyor'
    };
    setWActions([...wActions, newAction]);
    
    // Mock Notification
    const employeeObj = employees.find(e => e.id === actionOwner);
    const empName = employeeObj ? employeeObj.name : actionOwner;
    showToast(`📧 E-posta Gönderildi: ${empName} kişisine yeni görev atandı.`);
    
    setActionTitle('');
    setActionOwner('');
    setActionDeadline('');
  };

  const saveGoal = () => {
    if (wActions.length === 0) {
      alert('Lütfen en az bir aksiyon ekleyin.');
      return;
    }
    const finalGoal = {
      id: Date.now().toString(),
      dimension: wDim,
      intent: wIntent,
      subject: wSubject,
      title: `${wSubject} - ${wIntent}`,
      kpi: {
        name: wKpi,
        targetValue: wKpiTarget
      },
      actions: wActions,
      createdAt: new Date().toISOString()
    };
    setGoals([...goals, finalGoal]);
    showToast(`✅ Hedef ve Aksiyonlar Stratejik Plana eklendi.`);
    resetWizard();
    setView('dashboard');
  };

  const resetWizard = () => {
    setStep(1);
    setWDimSelectionType('none');
    setWCustomDimName('');
    setWDim(null);
    setWIntent(null);
    setWSubjectSelectionType('none');
    setWSubject('');
    setWKpiSelectionType('none');
    setWKpi('');
    setWKpiTarget('');
    setWActions([]);
  };

  const convertToGoal = (suggestion) => {
    // Mapping focusArea to dimension
    let dim = 'process';
    if (suggestion.category.includes('Organizasyon')) dim = 'learning';
    if (suggestion.category.includes('Mali')) dim = 'finance';
    if (suggestion.category.includes('Pazarlama')) dim = 'customer';

    const newGoal = {
      id: Date.now().toString(),
      dimension: dim,
      intent: 'Geliştirmek',
      subject: 'Kurumsal Sistem',
      title: suggestion.title,
      kpi: {
        name: 'Tamamlanma Oranı',
        targetValue: '%100'
      },
      actions: [
        {
          id: Date.now().toString() + "_1",
          title: suggestion.title,
          owner: 'Dış Kaynak',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'bekliyor'
        }
      ],
      createdAt: new Date().toISOString()
    };
    setGoals([...goals, newGoal]);
    setSuggestedStrategies(suggestedStrategies.filter(s => s.id !== suggestion.id));
    showToast("✅ Öneri stratejik hedefe dönüştürüldü.");
    if (suggestedStrategies.length <= 1) setIsSuggestionsModalOpen(false);
  };

  // --- MANAGEMENT COMMANDS (Only for 'danisman') ---
  const handleEditActionDeadline = (goalId, actionId, currentDeadline) => {
    if (userRole !== 'danisman') return;
    const newDate = prompt('Yeni Termin Tarihi (YYYY-MM-DD):', currentDeadline);
    if (newDate) {
      const updatedGoals = goals.map(g => {
        if (g.id === goalId) {
          return {
            ...g,
            actions: g.actions.map(a => a.id === actionId ? {...a, deadline: newDate} : a)
          }
        }
        return g;
      });
      setGoals(updatedGoals);
      showToast('📅 Aksiyon tarihi güncellendi.', 'info');
    }
  };

  const handleDeleteAction = (goalId, actionId) => {
    if (userRole !== 'danisman') return;
    if (window.confirm('Bu aksiyonu silmek istediğinize emin misiniz?')) {
      const updatedGoals = goals.map(g => {
        if (g.id === goalId) {
          return { ...g, actions: g.actions.filter(a => a.id !== actionId) };
        }
        return g;
      });
      setGoals(updatedGoals);
      showToast('❌ Aksiyon silindi.', 'error');
    }
  };

  const handleToggleActionComplete = (goalId, actionId) => {
    if (userRole !== 'danisman') return;
    const updatedGoals = goals.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          actions: g.actions.map(a => {
            if (a.id === actionId) {
              return { ...a, status: a.status === 'tamamlandi' ? 'bekliyor' : 'tamamlandi' };
            }
            return a;
          })
        };
      }
      return g;
    });
    setGoals(updatedGoals);
  };

  const handleDeleteGoal = (goalId) => {
    if (userRole !== 'danisman') return;
    if (window.confirm('Bu stratejik hedefi ve altındaki tüm aksiyonları KALICI olarak silmek istediğinize emin misiniz?')) {
      setGoals(goals.filter(g => g.id !== goalId));
      showToast('❌ Hedef silindi.', 'error');
    }
  };

  // Health Score Calculation
  const healthScore = Math.min(100, Math.max(0, 
    (goals.length > 0 ? 40 : 0) + 
    (goals.reduce((acc, g) => acc + g.actions.length, 0) > 0 ? 30 : 0) + 
    (goals.every(g => g.kpi.targetValue) ? 30 : 0)
  ));

  // WIZARD RENDERS
  const renderWizardStep1 = () => {
    return (
      <div className="fade-in">
        <h2 className="question-text">Hangi alanda hedef belirlemek istiyorsunuz?</h2>
        
        {wDimSelectionType === 'none' && (
          <div className="options-grid">
            {dimensions.map(dim => (
              <div 
                key={dim.id} 
                className={`option-card ${wDim === dim.id ? 'selected' : ''}`}
                onClick={() => { setWDim(dim.id); setTimeout(() => nextStep(), 300); }}
              >
                <div className="o-icon">{dim.icon}</div>
                <div className="o-title">{dim.title}</div>
              </div>
            ))}
            <div 
              className="option-card"
              onClick={() => { setWDimSelectionType('manual'); setWCustomDimName(''); }}
              style={{padding: '1rem', minHeight: '80px', borderStyle: 'dashed', borderColor: '#94a3b8', background: '#f8fafc', justifyContent: 'center'}}
            >
              <div className="o-title" style={{fontSize: '0.9rem', color: '#475569'}}>✍️ Kendim Gireceğim...</div>
            </div>
          </div>
        )}

        {wDimSelectionType === 'manual' && (
          <div style={{maxWidth: '500px', margin: '0 auto', textAlign: 'left', marginBottom: '2rem'}}>
            <div className="input-group" style={{marginBottom: '1rem'}}>
              <label>Yeni Alan / Boyut Adı:</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Örn: İnovasyon, Sürdürülebilirlik..."
                value={wCustomDimName}
                onChange={(e) => setWCustomDimName(e.target.value)}
                autoFocus
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
              <button 
                className="secondary-btn" 
                onClick={() => { setWDimSelectionType('none'); setWCustomDimName(''); }}
              >
                Geri Dön (Listeden Seç)
              </button>
              <button 
                className="primary-btn" 
                onClick={() => {
                  const newDim = {
                    id: `custom_${Date.now()}`,
                    title: wCustomDimName,
                    icon: '📌',
                    color: '#64748B'
                  };
                  setDimensions([...dimensions, newDim]);
                  setWDim(newDim.id);
                  setWDimSelectionType('none');
                  setTimeout(() => nextStep(), 300);
                }}
                disabled={!wCustomDimName || wCustomDimName.trim() === ''}
              >
                Ekle ve İleri
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderWizardStep2 = () => {
    const dimAI = mockAI[wDim] || mockAI.finance; 
    
    if (!wIntent) {
      return (
        <div className="fade-in">
          <h2 className="question-text">Bu alanda neyi başarmak istiyorsunuz?</h2>
          <div className="options-grid">
            {intentLabels.map(intent => (
              <div 
                key={intent} 
                className="option-card"
                onClick={() => setWIntent(intent)}
                style={{padding: '1rem', minHeight: '80px'}}
              >
                <div className="o-title" style={{fontSize: '1rem'}}>{intent}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    const possibleSubjects = dimAI.subjects || mockAI.finance.subjects;
    
    return (
      <div className="fade-in">
        <h2 className="question-text">Hangi metrik/alan üzerinde "{wIntent}" hedefine odaklanacaksınız?</h2>
        
        {wSubjectSelectionType === 'none' && (
          <div className="options-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))'}}>
            {possibleSubjects.map((sub, idx) => (
              <div 
                key={idx} 
                className={`option-card ${wSubject === sub ? 'selected' : ''}`}
                onClick={() => { setWSubjectSelectionType('list'); setWSubject(sub); setTimeout(() => nextStep(), 300); }}
                style={{padding: '1rem', minHeight: '80px'}}
              >
                <div className="o-title" style={{fontSize: '0.9rem'}}>{sub}</div>
              </div>
            ))}
            <div 
              className="option-card"
              onClick={() => { setWSubjectSelectionType('manual'); setWSubject(''); }}
              style={{padding: '1rem', minHeight: '80px', borderStyle: 'dashed', borderColor: '#94a3b8', background: '#f8fafc'}}
            >
              <div className="o-title" style={{fontSize: '0.9rem', color: '#475569'}}>✍️ Kendim Gireceğim...</div>
            </div>
          </div>
        )}

        {wSubjectSelectionType === 'manual' && (
          <div style={{maxWidth: '500px', margin: '0 auto', textAlign: 'left', marginBottom: '2rem'}}>
            <div className="input-group" style={{marginBottom: '1rem'}}>
              <label>Hedef Alanı / Konusu:</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Örn: Yeni Pazar Girişi, Dijital Pazarlama Dönüşümü..."
                value={wSubject}
                onChange={(e) => setWSubject(e.target.value)}
                autoFocus
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
              <button 
                className="secondary-btn" 
                onClick={() => { setWSubjectSelectionType('none'); setWSubject(''); }}
              >
                Geri Dön (Listeden Seç)
              </button>
              <button 
                className="primary-btn" 
                onClick={() => nextStep()}
                disabled={!wSubject || wSubject.trim() === ''}
              >
                İleri
              </button>
            </div>
          </div>
        )}

        {wSubjectSelectionType === 'none' && (
          <button className="secondary-btn" onClick={() => setWIntent(null)}>Hedef Türünü Değiştir</button>
        )}
      </div>
    );
  };

  const renderWizardStep3 = () => {
    const dimAI = mockAI[wDim] || mockAI.finance;
    const recommendedKpis = dimAI.kpis || mockAI.finance.kpis;
    
    return (
      <div className="fade-in">
        <h2 className="question-text">Bu hedefi nasıl ölçümleyeceksiniz? (KPI Seçimi)</h2>
        
        {wKpiSelectionType === 'none' && (
          <div className="options-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))'}}>
            {recommendedKpis.map((kpi, idx) => (
              <div 
                key={idx} 
                className={`option-card`}
                onClick={() => { setWKpiSelectionType('ai'); setWKpi(kpi); }}
                style={{padding: '1rem', minHeight: '80px'}}
              >
                <div className="o-title" style={{fontSize: '0.9rem'}}>{kpi}</div>
              </div>
            ))}
            <div 
              className="option-card"
              onClick={() => { setWKpiSelectionType('manual'); setWKpi(''); }}
              style={{padding: '1rem', minHeight: '80px', borderStyle: 'dashed', borderColor: '#94a3b8', background: '#f8fafc'}}
            >
              <div className="o-title" style={{fontSize: '0.9rem', color: '#475569'}}>✍️ Kendim Gireceğim...</div>
            </div>
          </div>
        )}

        {wKpiSelectionType !== 'none' && (
           <div style={{maxWidth: '500px', margin: '0 auto', textAlign: 'left'}}>
              
              {wKpiSelectionType === 'manual' ? (
                <div className="input-group" style={{marginBottom: '1rem'}}>
                  <label>KPI Adı (Örn: Verimlilik Oranı):</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ölçüm metriğinizi yazın"
                    value={wKpi}
                    onChange={(e) => setWKpi(e.target.value)}
                  />
                </div>
              ) : (
                <div style={{marginBottom: '1.5rem', background: '#eff6ff', padding: '1rem', borderRadius: '8px', border: '1px solid #bfdbfe'}}>
                  <strong>Seçilen Metrik: </strong> {wKpi}
                  <button 
                    onClick={() => setWKpiSelectionType('none')} 
                    style={{marginLeft: '1rem', background: 'transparent', border:'none', color:'#2563eb', cursor:'pointer', textDecoration: 'underline'}}
                  >
                    Değiştir
                  </button>
                </div>
              )}

              <div className="input-group">
                <label>Ulaşılmak İstenen Hedef Değer:</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Örn: 100, %20, 5000 TL"
                  value={wKpiTarget}
                  onChange={(e) => setWKpiTarget(e.target.value)}
                />
              </div>
           </div>
        )}
      </div>
    );
  };

  const renderWizardStep4 = () => (
    <div className="fade-in">
      <h2 className="question-text">Bu hedefe ulaşmak için hangi aksiyonlar alınacak?</h2>
      <p style={{marginBottom: '2rem', color: '#6b7280'}}>Hedefe ({wSubject}) ve KPI'ya ({wKpi}) ulaşmak için faaliyet adımlarını tanımlayın.</p>
      
      <div className="action-builder-container">
        <div className="action-form">
          <div className="input-group">
            <label>Aksiyon/Faaliyet Başlığı</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Örn: Yeni CRM sisteminin kurulması"
              value={actionTitle}
              onChange={(e) => setActionTitle(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Sorumlu Kişi</label>
            <select 
              className="form-control"
              value={actionOwner}
              onChange={(e) => setActionOwner(e.target.value)}
            >
              <option value="">Seçiniz</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} ({emp.title})</option>
              ))}
              <option value="Dış Kaynak">Dış Kaynak / Ajans</option>
            </select>
          </div>
          <div className="input-group">
            <label>Termin Tarihi (Deadline)</label>
            <input 
              type="date" 
              className="form-control"
              value={actionDeadline}
              onChange={(e) => setActionDeadline(e.target.value)}
            />
          </div>
          <button className="add-action-btn" onClick={handleAddAction}>+ Aksiyon Ekle</button>
        </div>
        
        {wActions.length > 0 && (
          <div className="added-actions">
            <h4>Eklenen Aksiyonlar:</h4>
            {wActions.map(act => {
              const emp = employees.find(e => e.id === act.owner);
              const ownerName = emp ? emp.name : act.owner;
              return (
                <div key={act.id} className="added-action-tag">
                  <span>{act.title} - <strong>{ownerName}</strong> ({act.deadline})</span>
                  <button onClick={() => setWActions(wActions.filter(a => a.id !== act.id))} style={{background:'transparent', border:'none', color:'#ef4444', cursor:'pointer', fontWeight: 'bold'}}>✖</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // DASHBOARD RENDER
  const renderDashboard = () => (
    <div className="fade-in">
      <div className="dashboard-header">
        <div>
          <h2 className="h-title-main">Stratejik Plan Paneli</h2>
          <p className="h-subtitle">Strateji haritanızın genel durumu ve aksiyon ilerlemeleri</p>
        </div>
        <div style={{display:'flex', gap:'1rem'}}>
          {suggestedStrategies.length > 0 && (
            <button className="secondary-btn" style={{borderColor:'#f59e0b', color:'#d97706', position:'relative'}} onClick={() => setIsSuggestionsModalOpen(true)}>
              🔔 Önerilen Hedefler ({suggestedStrategies.length})
              <span className="pulse-dot"></span>
            </button>
          )}
          <button className="primary-btn" onClick={() => { resetWizard(); setView('wizard'); }}>+ Yeni Stratejik Hedef</button>
        </div>
      </div>

      <div className="health-cards">
        <div className="health-card">
          <span className="h-title">Plan Sağlık Skoru</span>
          <span className="h-value" style={{color: healthScore > 75 ? '#10b981' : healthScore > 40 ? '#f59e0b' : '#ef4444'}}>
            {healthScore}/100
          </span>
        </div>
        <div className="health-card">
          <span className="h-title">Aktif Hedefler</span>
          <span className="h-value">{goals.length}</span>
        </div>
        <div className="health-card">
          <span className="h-title">Toplam Aksiyon</span>
          <span className="h-value">{goals.reduce((acc, g) => acc + g.actions.length, 0)}</span>
        </div>
      </div>

      {goals.length === 0 ? (
         <div className="empty-dashboard">
           <div className="empty-icon">🌱</div>
           <h3>Henüz stratejik planınız oluşmadı</h3>
           <p>Kolay yönlendirme sihirbazımız ile dakikalar içinde stratejinizi oluşturun.</p>
           <button className="primary-btn mt-4" onClick={() => { resetWizard(); setView('wizard'); }}>Sihirbazı Başlat</button>
         </div>
      ) : (
        <div className="dashboard-content">
          {dimensions.map(dim => {
            const dimGoals = goals.filter(g => g.dimension === dim.id);
            if (dimGoals.length === 0) return null;
            
            return (
              <div key={dim.id} className="dimension-section" style={{borderTopColor: dim.color || '#94a3b8'}}>
                <div 
                  className="dim-header" 
                  onClick={() => setExpandedDims(prev => ({...prev, [dim.id]: !prev[dim.id]}))}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span>{dim.icon}</span> {dim.title} Boyutu
                  </div>
                  <div className="accordion-icon">
                    {expandedDims[dim.id] ? '▲' : '▼'}
                  </div>
                </div>
                
                {expandedDims[dim.id] && (
                  <div className="dim-body fade-in">
                    {dimGoals.map(goal => (
                  <div key={goal.id} className="goal-card">
                    <div className="g-header">
                      <div className="g-title">{goal.title}</div>
                      <div className="g-controls">
                        <span className="kpi-tag">KPI: {goal.kpi.name} ({goal.kpi.targetValue})</span>
                        {userRole === 'danisman' && (
                          <button 
                            className="delete-goal-btn" 
                            title="Hedefi Sil"
                            onClick={() => handleDeleteGoal(goal.id)}
                          >
                            Sil
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="action-list">
                      {goal.actions.map(act => {
                        const emp = employees.find(e => e.id === act.owner);
                        const ownerName = emp ? emp.name : act.owner;
                        
                        let statusClass = 'status-devamediyor';
                        let statusText = 'Devam Ediyor';
                        
                        if (act.status === 'tamamlandi') {
                          statusClass = 'status-tamamlandi';
                          statusText = 'Tamamlandı';
                        } else if (new Date(act.deadline) < new Date(new Date().setHours(0,0,0,0))) {
                          statusClass = 'status-gecikmis';
                          statusText = 'Gecikmiş';
                        }
                        
                        return (
                          <div key={act.id} className="action-item">
                            <div className="a-info">
                              <span className="a-title" style={{textDecoration: act.status === 'tamamlandi' ? 'line-through' : 'none', opacity: act.status === 'tamamlandi' ? 0.6 : 1}}>
                                {act.title}
                              </span>
                              <span className="a-meta">
                                <span>👤 {ownerName}</span>
                                <span>📅 Termin: {act.deadline}</span>
                              </span>
                            </div>
                            
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                              <div className={`status-badge ${statusClass}`}>
                                {statusText}
                              </div>
                              {userRole === 'danisman' && (
                                <div className="action-controls">
                                  <button title="Durumu Değiştir (Tamamlandı/Bekliyor)" className="icon-btn btn-complete" onClick={() => handleToggleActionComplete(goal.id, act.id)}>
                                    {act.status === 'tamamlandi' ? '↩️' : '✅'}
                                  </button>
                                  <button title="Termini Düzenle" className="icon-btn btn-edit" onClick={() => handleEditActionDeadline(goal.id, act.id, act.deadline)}>
                                    ✏️
                                  </button>
                                  <button title="Aksiyonu Sil" className="icon-btn btn-delete" onClick={() => handleDeleteAction(goal.id, act.id)}>
                                    🗑️
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* SUGGESTIONS MODAL */}
      {isSuggestionsModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{maxWidth:'700px'}}>
             <h3>🎯 Yol Haritasından Gelen Öneriler</h3>
             <p>Kurumsal Check-Up Raporu'ndan "Stratejik Plana Aktar" ile gönderilen aksiyonlar aşağıda listelenmiştir. Bunları trackable hedeflere dönüştürebilirsiniz.</p>
             
             <div className="suggestions-list" style={{maxHeight:'400px', overflowY:'auto', margin:'1.5rem 0'}}>
                {suggestedStrategies.map(s => (
                  <div key={s.id} className="suggestion-item" style={{background:'#f8fafc', padding:'1rem', borderRadius:'8px', border:'1px solid #e2e8f0', marginBottom:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div>
                      <span style={{fontSize:'0.7rem', fontWeight:'800', color:'#2563eb', textTransform:'uppercase'}}>{s.category}</span>
                      <h4 style={{margin:'0.2rem 0'}}>{s.title}</h4>
                      <span style={{fontSize:'0.75rem', color:'#64748b'}}>{s.date} tarihinde eklendi</span>
                    </div>
                    <button className="primary-btn" style={{padding:'0.5rem 1rem', fontSize:'0.8rem'}} onClick={() => convertToGoal(s)}>Hedefe Dönüştür</button>
                  </div>
                ))}
             </div>

             <div style={{display:'flex', justifyContent:'flex-end'}}>
               <button className="secondary-btn" onClick={() => setIsSuggestionsModalOpen(false)}>Kapat</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );

  // ORIENTATION RENDER
  const renderOrientationTab = () => (
    <div className="fade-in">
      <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h2 className="h-title-main">Stratejik Yönelim</h2>
          <p className="h-subtitle">Kurumun kalbini ve geleceğe yönelik pusulasını tanımlayın.</p>
        </div>
      </div>
      
      <div className="orientation-grid">
        {orientationCards.map(card => (
          <div key={card.id} className="orientation-card glass">
            <div className="o-card-left">
              <span className="o-card-icon">{card.icon}</span>
              <h3>{card.title}</h3>
            </div>
            
            <div className="o-card-right">
              <div className="o-card-actions">
                <button className="icon-btn btn-edit-card" onClick={() => setEditingCard(card)}>
                  ✏️ Düzenle
                </button>
              </div>
              <div className="o-card-body">
                {orientation[card.id] ? (
                  <p style={{ whiteSpace: 'pre-wrap' }}>{orientation[card.id]}</p>
                ) : (
                  <p className="o-placeholder">{card.placeholder}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingCard && (
        <div className="modal-overlay">
          <div className="modal-content glass slide-up" style={{ maxWidth: '600px' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: 'var(--text-main)' }}>
                {editingCard.icon} {editingCard.title} Düzenle
              </h4>
              <button className="btn-close" onClick={() => setEditingCard(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>{editingCard.placeholder}</p>
              <textarea 
                style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--primary)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-main)', resize: 'vertical', fontSize: '0.95rem' }}
                rows="6"
                value={orientation[editingCard.id]}
                onChange={(e) => setOrientation({...orientation, [editingCard.id]: e.target.value})}
                placeholder="İçeriği buraya girin..."
                autoFocus
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button className="secondary-btn" onClick={() => setEditingCard(null)}>İptal</button>
                <button className="primary-btn" onClick={() => { setEditingCard(null); showToast('✅ Değişiklikler kaydedildi.'); }}>Kaydet</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="strategy-module">
      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className="toast">
            <span className="toast-icon">{toast.message.includes('E-posta') ? '📩' : '✅'}</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      <div className="main-tabs glass" style={{ display: 'flex', gap: '1rem', padding: '0.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem', width: 'fit-content' }}>
        <button 
          className={`tab-btn ${mainTab === 'orientation' ? 'active' : ''}`}
          onClick={() => setMainTab('orientation')}
        >
          🧭 Stratejik Yönelim
        </button>
        <button 
          className={`tab-btn ${mainTab === 'planning' ? 'active' : ''}`}
          onClick={() => setMainTab('planning')}
        >
          📊 Hedefler ve Aksiyonlar
        </button>
      </div>

      <div className="tab-content">
        {mainTab === 'orientation' && renderOrientationTab()}
        
        {mainTab === 'planning' && (
          <>
            {view === 'wizard' && (
              <div className="wizard-container fade-in">
                <div className="wizard-progress">
                  <div className={`step-indicator ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                    <div className="step-circle">1</div> Seçim
                  </div>
                  <div className={`step-indicator ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                    <div className="step-circle">2</div> Hedef
                  </div>
                  <div className={`step-indicator ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
                    <div className="step-circle">3</div> Ölçüm (KPI)
                  </div>
                  <div className={`step-indicator ${step >= 4 ? 'active' : ''} ${step > 4 ? 'completed' : ''}`}>
                    <div className="step-circle">4</div> Aksiyonlar
                  </div>
                </div>
                
                <div className="wizard-body">
                  {step === 1 && renderWizardStep1()}
                  {step === 2 && renderWizardStep2()}
                  {step === 3 && renderWizardStep3()}
                  {step === 4 && renderWizardStep4()}
                </div>
                
                <div className="wizard-footer">
                  <button 
                    className="secondary-btn" 
                    onClick={step === 1 ? () => goals.length > 0 && setView('dashboard') : prevStep}
                    disabled={step === 1 && goals.length === 0}
                  >
                    İptal / Geri
                  </button>
                  <button 
                    className="primary-btn"
                    onClick={step === 4 ? saveGoal : (step === 3 && wKpi && wKpiTarget ? nextStep : null)}
                    disabled={
                      (step === 1 && !wDim) || 
                      (step === 2 && !wSubject) || 
                      (step === 3 && (!wKpi || !wKpiTarget)) ||
                      (step === 4 && wActions.length === 0)
                    }
                  >
                    {step === 4 ? 'Hedefi Stratejiye Ekle' : 'İleri'}
                  </button>
                </div>
              </div>
            )}

            {view === 'dashboard' && renderDashboard()}
          </>
        )}
      </div>
      
    </div>
  );
}
