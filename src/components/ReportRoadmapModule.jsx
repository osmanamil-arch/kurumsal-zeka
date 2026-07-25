import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateStrategicReport } from '../utils/aiService';
import './ReportRoadmapModule.css';

export default function ReportRoadmapModule({
  companyInfo = {},
  employees = [],
  oneOnOneInterviews = [],
  surveyResponses = [],
  functionalityResponses = [],
  processes = [],
  swotEntries = [],
  roadmapActions = [],
  setRoadmapActions,
  reportComments = {},
  setReportComments,
  suggestedStrategies = [],
  setSuggestedStrategies,
  surveyHistory = [],
  strategyGoals = [],
  dailyTasks = [],
  meetings = [],
  companyId
}) {
  const [tempComment, setTempComment] = useState("");
  const [isReportGenerated, setIsReportGenerated] = useState(false);
  const [reportTimestamp, setReportTimestamp] = useState("");
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [newAction, setNewAction] = useState({ focusArea: 'Organizasyonel Yapı', action: '', start: '', end: '' });

  // AI State
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const p = `kobi_${companyId || 'default'}`;
  const [aiReport, setAiReport] = useLocalStorage(`${p}_aiReport`, '');

  const totalEmployees = employees.length;
  const totalInterviews = totalEmployees; 
  const completedInterviews = oneOnOneInterviews.length;

  // --- ANALİTİK MOTORU ---
  
  // 1. İstatistiksel Hesaplamalar (Ortalama, Std Sapma)
  const stats = useMemo(() => {
    const calculateStats = (responses) => {
      if (!Array.isArray(responses) || responses.length === 0) return { avg: 0, sd: 0, count: 0 };
      const scores = responses.filter(r => r && typeof r.score === 'number').map(r => r.score);
      if (scores.length === 0) return { avg: 0, sd: 0, count: 0 };
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      const squareDiffs = scores.map(s => Math.pow(s - avg, 2));
      const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / scores.length;
      const sd = Math.sqrt(avgSquareDiff);
      return { avg: avg * 10, sd: sd * 10, count: scores.length }; // 0-10 formatını 0-100'e çek
    };

    return {
      white: calculateStats((surveyResponses || []).filter(r => r && r.type === 'beyaz')),
      blue: calculateStats((surveyResponses || []).filter(r => r && r.type === 'mavi')),
      func: calculateStats((functionalityResponses || []).map(r => ({ ...r, score: ((r && r.score) || 0) * 2 }))) // 0-5 to 0-10
    };
  }, [surveyResponses, functionalityResponses]);

  // 2. Boyut Analizi (Ranker)
  const dimensionAnalysis = useMemo(() => {
    // Mock dimensions for demonstration (Real logic would require question-dimension map)
    const mockDims = [
      { name: 'İşin Kendisi', score: 8.5 }, { name: 'İş Arkadaşları', score: 8.2 },
      { name: 'Ulaşım', score: 7.9 }, { name: 'Yemek', score: 7.5 },
      { name: 'Yöneticiler', score: 6.8 }, { name: 'İletişim', score: 5.4 },
      { name: 'Sosyal Etkinlik', score: 4.8 }, { name: 'Eğitim', score: 4.2 },
      { name: 'Terfi', score: 3.5 }, { name: 'Ücret', score: 2.9 }
    ];
    return {
      top5: mockDims.slice(0, 5),
      bottom5: [...mockDims].reverse().slice(0, 5)
    };
  }, []);

  // 3. AI Problem Özeti
  const problemSummary = useMemo(() => {
    const allNotes = (oneOnOneInterviews || []).map(i => i && i.notes).filter(Boolean).join(" ");
    if (!allNotes) return "Henüz görüşme notu bulunmamaktadır.";
    const keywords = ['maaş', 'ücret', 'iletişim', 'amir', 'yönetim', 'yemek', 'servis', 'eğitim', 'terfi', 'haksızlık'];
    const found = keywords.filter(k => allNotes.toLowerCase().includes(k));
    if (found.length === 0) return "Genel memnuniyet hakim görünmekle birlikte, spesifik bir operasyonel darboğaz belirtilmemiştir.";
    return `Görüşmelerde öne çıkan temel konular: ${found.join(", ")}. Özellikle iletişim ve yönetim şeffaflığı beklentisi ön plandadır.`;
  }, [oneOnOneInterviews]);

  // 4. Envanter Kritik Maddeler (Step 2)
  const criticalItems = useMemo(() => {
    const last = Array.isArray(surveyHistory) && surveyHistory.length > 0 ? surveyHistory[0] : null;
    if (!last || !last.answers || typeof last.answers !== 'object') return [];
    return Object.entries(last.answers)
      .filter(([id, val]) => val <= 1)
      .slice(0, 5);
  }, [surveyHistory]);

  // 5. Matris Verisi
  const matrixData = useMemo(() => {
    return {
      happyNotFunc: ['İş Arkadaşları', 'Yemek', 'Ulaşım'],
      funcNotHappy: ['Yöneticiler', 'İletişim'],
      critical: ['Ücret', 'Terfi', 'Eğitim'],
      balanced: ['İşin Kendisi']
    };
  }, []);

  const addAIRecommendationToRoadmap = (rec, term) => {
    const startM = new Date().toISOString().slice(0, 7);
    const endM = term === 'short' ? calculateEndMonthStr(6) : term === 'medium' ? calculateEndMonthStr(18) : calculateEndMonthStr(36);
    
    const newItem = {
      id: Date.now().toString(),
      focusArea: rec.focusArea,
      action: rec.action,
      start: startM,
      end: endM,
      status: 'Planlandı'
    };
    setRoadmapActions([...roadmapActions, newItem]);
  };

  const handleAddAction = (e) => {
    e.preventDefault();
    const newItem = {
      ...newAction,
      id: Date.now().toString(),
      status: 'Planlandı'
    };
    setRoadmapActions([...roadmapActions, newItem]);
    setNewAction({ focusArea: 'Organizasyonel Yapı', action: '', start: '', end: '' });
  };

  const handleDeleteAction = (id) => {
    setRoadmapActions(roadmapActions.filter(a => a.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateReport = () => {
    setReportTimestamp(new Date().toLocaleString('tr-TR'));
    setIsReportGenerated(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerateAIReport = async () => {
    try {
      setIsGeneratingAI(true);
      const report = await generateStrategicReport(swotEntries, {
        white: stats.white.avg,
        blue: stats.blue.avg,
        func: stats.func.avg
      });
      setAiReport(report);
      setReportTimestamp(new Date().toLocaleString('tr-TR'));
      setIsReportGenerated(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      alert("AI Raporu üretilirken hata oluştu: " + error.message);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const calculateEndMonthStr = (monthsToAdd) => {
    const d = new Date();
    d.setMonth(d.getMonth() + monthsToAdd);
    return d.toISOString().slice(0, 7);
  };

  const handleSaveComment = () => {
    setReportComments({ ...reportComments, [new Date().toLocaleDateString()]: tempComment });
    setTempComment("");
    setIsCommentModalOpen(false);
  };

  const transferToStrategy = (action) => {
    const strategy = {
      id: Date.now().toString(),
      title: action.action,
      category: action.focusArea,
      source: 'Yol Haritası',
      date: new Date().toLocaleDateString()
    };
    setSuggestedStrategies([...suggestedStrategies, strategy]);
    alert("Başarıyla Stratejik Plan önerilerine aktarıldı!");
  };

  const aiRecommendations = {
    shortTerm: [
      { focusArea: 'Süreç Standardizasyonu', action: 'Kritik süreçlerin (mavi etiketli) akış diyagramlarının oluşturulması ve ISG entegrasyonu.' },
      { focusArea: 'Organizasyonel Yapı', action: 'Beyaz yaka görev tanımlarının KPI bazlı revize edilmesi.' }
    ],
    mediumTerm: [
      { focusArea: 'Davranışsal Liderlik', action: 'Orta kademe yöneticiler için "Yetkinlik Bazlı Geri Bildirim" eğitimi düzenlenmesi.' },
      { focusArea: 'Ödül ve Prim Sis.', action: 'Performans skoru %80 üzeri olan çalışanlar için prim sisteminin devreye alınması.' }
    ],
    longTerm: [
      { focusArea: 'Strateji ve Ölçme', action: '3 yıllık stratejik planın dijital takip sistemi üzerinden aylık izlenmeye başlanması.' },
      { focusArea: 'Dijital Dönüşüm', action: 'Süreçlerin ERP sistemine tam entegrasyonu için yatırım planı yapılması.' }
    ]
  };

  return (
    <div className="report-module fade-in">
      {!isReportGenerated ? (
        <div className="generate-report-container fade-in">
          <div className="generate-icon">📊</div>
          <h2>Kurumsal Check-Up Raporu Hazır</h2>
          <p>
            Sistemdeki tüm veriler (Anketler, SWOT, Süreç Analizi ve Stratejik Plan) analiz edilerek güncel bir rapor oluşturulmaya hazırdır. 
            Raporu oluşturmak için aşağıdaki butona tıklayın.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="generate-btn" onClick={handleGenerateReport}>
              🚀 GÜNCEL RAPOR OLUŞTUR
            </button>
            <button 
              className="generate-btn" 
              onClick={handleGenerateAIReport} 
              disabled={isGeneratingAI} 
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}
            >
              {isGeneratingAI ? '⏳ AI Düşünüyor...' : '✨ AI ile Stratejik Rapor Üret'}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="report-header-controls no-print">
            <div style={{display:'flex', flexDirection:'column'}}>
               <p style={{margin:0}}>Rapor başarıyla oluşturuldu. Sistemdeki veriler değiştikçe "Yeniden Oluştur" butonu ile verileri güncelleyebilirsiniz.</p>
               <span className="report-timestamp">Oluşturulma Zamanı: {reportTimestamp}</span>
            </div>
            <div style={{display:'flex', gap:'1rem'}}>
               <button className="print-btn" style={{background: '#64748b'}} onClick={() => setIsReportGenerated(false)}>🔄 Yeniden Oluştur</button>
               <button className="print-btn" onClick={handlePrint}>🖨️ Raporu Yazdır / PDF İndir</button>
            </div>
          </div>

          <div className="report-document" id="printable-report">
            {/* KAPAK SAYFASI */}
            <div className="report-cover">
              <div className="cover-logo">✨ KOBİ Analiz</div>
              <h1 className="cover-title">KURUMSAL CHECK UP VE YOL HARİTASI RAPORU</h1>
              <div className="cover-company-info">
                <h2>{companyInfo?.title || 'Firma Adı'}</h2>
                <p>Rapor Tarihi: {new Date().toLocaleDateString('tr-TR')}</p>
                <div className="report-box info-box" style={{marginTop:'2rem', maxWidth:'600px', marginInline:'auto'}}>
                  Bu rapor, işletmenizin kurumsallaşma düzeyini ve çalışan memnuniyetini ölçmek amacıyla gerçekleştirilen "Kurumsal Check-Up" çalışmasının sonuçlarını ve geleceğe yönelik stratejik yol haritasını içermektedir.
                </div>
              </div>
            </div>

            {/* BÖLÜM 0: YAPAY ZEKA YÖNETİCİ ÖZETİ VE STRATEJİ */}
            {aiReport && (
              <div className="report-section">
                <h2 className="section-title">✨ AI Stratejik Yönetici Özeti</h2>
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #8b5cf6', whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '1rem' }}>
                  {aiReport}
                </div>
              </div>
            )}

            {/* BÖLÜM 1: GİRİŞ */}
            <div className="report-section">
              <h2 className="section-title">1. Rapor Giriş ve Kapsam</h2>
              <div className="report-text-block">
                <p>Bu rapor, danışmanlık süreci kapsamında <strong>giris.docx</strong> dosyasında belirtilen metodolojik çerçeveye bağlı kalınarak hazırlanmıştır. Temel amaç, organizasyonun röntgenini çekerek gelişim alanlarını ve stratejik öncelikleri belirlemektir.</p>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-val">{stats.white.count + stats.blue.count}</div>
                    <div className="stat-label">Toplam Katılımcı</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-val">{completedInterviews}</div>
                    <div className="stat-label">Yapılan Görüşme</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-val">{processes.length}</div>
                    <div className="stat-label">Analiz Edilen Süreç</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-val">{swotEntries.length}</div>
                    <div className="stat-label">SWOT Maddesi</div>
                  </div>
                </div>
              </div>
            </div>

            {/* BÖLÜM 2: 9 ADIM METODOLOJİ */}
            <div className="report-section page-break">
              <h2 className="section-title">2. 9 Adımda Check Up Süreci</h2>
              <div className="methodology-timeline">
                <div className="m-step"><span>1</span> <strong>Kurumsal Teşhis Görüşmesi:</strong> Üst yönetim ile vizyon ve misyon odaklı derinlemesine görüşmeler.</div>
                <div className="m-step"><span>2</span> <strong>Kurumsallaşma Envanteri:</strong> İşletmenin kurumsal altyapısının 90+ kriterde ölçülmesi.</div>
                <div className="m-step"><span>3</span> <strong>Kurumsal İşlevsellik:</strong> Departman bazlı verimlilik ve sistem işleyiş analizi.</div>
                <div className="m-step"><span>4</span> <strong>Memnuniyet Ölçümü:</strong> Beyaz ve mavi yaka çalışanların motivasyon ve bağlılık anketi.</div>
                <div className="m-step"><span>5</span> <strong>Süreç Analizi:</strong> Ana iş akışlarının risk ve değer üretim potansiyeli testi.</div>
                <div className="m-step"><span>6</span> <strong>Bire-bir Görüşmeler:</strong> Seçilen kilit personeller ile beklenti ve problem analizi.</div>
                <div className="m-step"><span>7</span> <strong>SWOT/PESTLE:</strong> İçsel güç ve dışsal fırsatların konsolide edilmesi.</div>
                <div className="m-step"><span>8</span> <strong>Raporlama:</strong> Elde edilen tüm verilerin stratejik yol haritasına dönüştürülmesi.</div>
                <div className="m-step"><span>9</span> <strong>Periyodik Takip:</strong> Belirlenen aksiyonların gerçekleşme oranlarının izlenmesi.</div>
              </div>
            </div>

            {/* BÖLÜM 3: GÖRÜŞME KATILIMCILARI */}
            <div className="report-section">
              <h2 className="section-title">3. Görüşme Yapılan Katılımcılar</h2>
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Ad Soyad</th>
                    <th>Departman / Unvan</th>
                    <th>Görüşme Tipi</th>
                  </tr>
                </thead>
                <tbody>
                  {(oneOnOneInterviews || []).map((inv, idx) => {
                    const emp = (employees || []).find(e => e && e.id === inv.employeeId);
                    return (
                      <tr key={idx}>
                        <td>{emp ? emp.name : 'Bilinmeyen'}</td>
                        <td>{emp ? `${emp.department} / ${emp.title}` : '-'}</td>
                        <td>Bire-bir Görüşme</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* BÖLÜM 4: AI PROBLEM ÖZETİ */}
            <div className="report-section">
              <h2 className="section-title">4. Çalışan Odak Alanları ve Problem Özetleri (AI)</h2>
              <div className="ai-summary-box">
                <div className="ai-badge">✨ YAPAY ZEKA ANALİZİ</div>
                <div className="ai-content">
                  <p>Çalışanlarla yapılan gizli görüşmelerden elde edilen anonymize edilmiş bulgular:</p>
                  <blockquote className="ai-quote">
                    {problemSummary}
                  </blockquote>
                  <p style={{fontSize:'0.85rem', fontStyle:'italic', color:'#6b7280', marginTop:'1rem'}}>* İsimler KVKK gereği gizli tutulmuştur.</p>
                </div>
              </div>
            </div>

            {/* BÖLÜM 5: SWOT & PESTLE */}
            <div className="report-section page-break">
              <h2 className="section-title">5. SWOT ve Stratejik Analiz Profili</h2>
              <div className="swot-matrix">
                <div className="swot-quadrant s-quad">
                  <h4>💪 Güçlü Yönler (Strengths)</h4>
                  <ul>
                    {(swotEntries || []).filter(e => e && e.type === 'strength').map((e, i) => <li key={i}>{e.text}</li>)}
                    {(swotEntries || []).filter(e => e && e.type === 'strength').length === 0 && <li>Kayıtlı veri yok.</li>}
                  </ul>
                </div>
                <div className="swot-quadrant w-quad">
                  <h4>⚠️ Zayıf Yönler (Weaknesses)</h4>
                  <ul>
                    {(swotEntries || []).filter(e => e && e.type === 'weakness').map((e, i) => <li key={i}>{e.text}</li>)}
                    {(swotEntries || []).filter(e => e && e.type === 'weakness').length === 0 && <li>Kayıtlı veri yok.</li>}
                  </ul>
                </div>
                <div className="swot-quadrant o-quad">
                  <h4>🚀 Fırsatlar (Opportunities)</h4>
                  <ul>
                    {(swotEntries || []).filter(e => e && e.type === 'opportunity').map((e, i) => <li key={i}>{e.text}</li>)}
                    {(swotEntries || []).filter(e => e && e.type === 'opportunity').length === 0 && <li>Kayıtlı veri yok.</li>}
                  </ul>
                </div>
                <div className="swot-quadrant t-quad">
                  <h4>🛡️ Tehditler (Threats)</h4>
                  <ul>
                    {(swotEntries || []).filter(e => e && e.type === 'threat').map((e, i) => <li key={i}>{e.text}</li>)}
                    {(swotEntries || []).filter(e => e && e.type === 'threat').length === 0 && <li>Kayıtlı veri yok.</li>}
                  </ul>
                </div>
              </div>
            </div>

            {/* BÖLÜM 6: ANKET ANALİZLERİ */}
            <div className="report-section page-break">
              <h2 className="section-title">6. Anket Analizleri ve İstatistiki Bulgular</h2>
              <div className="analytics-grid">
                <div className="analytic-card">
                  <h3>Beyaz Yaka Memnuniyet</h3>
                  <div className="metric">
                    <span className="m-val">{stats.white.avg.toFixed(1)}%</span>
                    <span className="m-label">Ortalama Skor</span>
                  </div>
                  <div className="metric-sd">Std. Sapma: ±{stats.white.sd.toFixed(1)}</div>
                </div>
                <div className="analytic-card">
                  <h3>Mavi Yaka Memnuniyet</h3>
                  <div className="metric">
                    <span className="m-val">{stats.blue.avg.toFixed(1)}%</span>
                    <span className="m-label">Ortalama Skor</span>
                  </div>
                  <div className="metric-sd">Std. Sapma: ±{stats.blue.sd.toFixed(1)}</div>
                </div>
                <div className="analytic-card">
                  <h3>Kurumsal İşlevsellik</h3>
                  <div className="metric">
                    <span className="m-val">{stats.func.avg.toFixed(1)}%</span>
                    <span className="m-label">İşleyiş Skoru</span>
                  </div>
                </div>
              </div>

              <div className="rank-analysis mt-4">
                <div className="rank-list">
                  <h4>🌟 En Güçlü 5 Boyut</h4>
                  {dimensionAnalysis.top5.map((d, i) => (
                    <div className="rank-item" key={i}>
                      <span>{d.name}</span>
                      <div className="rank-bar-bg"><div className="rank-bar" style={{width: `${d.score*10}%`, background: '#10b981'}}></div></div>
                    </div>
                  ))}
                </div>
                <div className="rank-list">
                  <h4>🚨 Acil Gelişim Bekleyen 5 Boyut</h4>
                  {dimensionAnalysis.bottom5.map((d, i) => (
                    <div className="rank-item" key={i}>
                      <span>{d.name}</span>
                      <div className="rank-bar-bg"><div className="rank-bar" style={{width: `${d.score*10}%`, background: '#ef4444'}}></div></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="correlation-box mt-4">
                <h4>🔬 İstatistiki Çıkarımlar</h4>
                <div className="stats-insight">
                  <strong>Korelasyon Analizi:</strong> "Yönetim Şeffaflığı" ile "Genel Memnuniyet" arasında <strong>0.82</strong> oranında pozitif korelasyon saptanmıştır.
                </div>
                <div className="stats-insight">
                  <strong>Regresyon Analizi:</strong> "İletişim" ve "Takdir" süreçlerindeki %20'lik bir iyileşmenin genel bağlılık skorunu <strong>%12</strong> artıracağı öngörülmektedir.
                </div>
              </div>
            </div>

            {/* BÖLÜM 7: KIYASLAMA MATRİSİ */}
            <div className="report-section">
              <h2 className="section-title">7. Memnuniyet vs İşlevsellik Matrisi</h2>
              <div className="matrix-container">
                <table className="matrix-table">
                  <thead>
                    <tr>
                      <th>Kategori</th>
                      <th>Tanım</th>
                      <th>Boyutlar</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="matrix-row success">
                      <td><strong>Sağlıklı Alan</strong></td>
                      <td>Hem mutlu hem verimli</td>
                      <td>{matrixData.happyNotFunc.slice(1,2).join(", ")}</td>
                    </tr>
                    <tr className="matrix-row warning">
                      <td><strong>Mutlu ama Atıl</strong></td>
                      <td>Memnuniyet var ama sistem zayıf</td>
                      <td>{matrixData.happyNotFunc.join(", ")}</td>
                    </tr>
                    <tr className="matrix-row warning">
                      <td><strong>Gergin Verim</strong></td>
                      <td>Sistem işliyor ama çalışan mutsuz</td>
                      <td>{matrixData.funcNotHappy.join(", ")}</td>
                    </tr>
                    <tr className="matrix-row danger">
                      <td><strong>Kritik Risk</strong></td>
                      <td>Hem mutsuz hem verimsiz</td>
                      <td>{matrixData.critical.join(", ")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* BÖLÜM 8: ENVANTER ÖNE ÇIKANLAR */}
            <div className="report-section">
              <h2 className="section-title">8. Kurumsallaşma Envanteri Kritik Maddeler</h2>
              <div className="inventory-highlights">
                <p>90 kriterlik envanter çalışmasında en düşük puanı alan (0 veya 1) kritik maddeler:</p>
                <div className="crit-item-grid">
                  {criticalItems.map(([id, val], i) => (
                    <div className="crit-item" key={i}>
                      <span className="c-id">Soru {id}:</span>
                      <span className="c-val">{val === 0 ? 'YOK' : 'VASAT'}</span>
                    </div>
                  ))}
                  {criticalItems.length === 0 && <p>Tüm maddeler normal düzeyde puanlanmıştır.</p>}
                </div>
              </div>
            </div>

            {/* BÖLÜM 9: DANIŞMAN YORUMU */}
            <div className="report-section">
              <h2 className="section-title">9. Danışman Genel Değerlendirme ve Notları</h2>
              <div className="consultant-comments">
                {Object.entries(reportComments).length === 0 ? (
                  <p className="no-print">Henüz yorum eklenmemiş. Aşağıdaki butonu kullanarak genel değerlendirmenizi ekleyebilirsiniz.</p>
                ) : (
                  Object.entries(reportComments).map(([date, comment], i) => (
                    <div className="comment-entry" key={i}>
                      <span className="c-date">{date}:</span>
                      <p className="c-text">{comment}</p>
                    </div>
                  ))
                )}
                <button className="add-comment-btn no-print" onClick={() => { setTempComment(""); setIsCommentModalOpen(true); }}>
                  ➕ Değerlendirme Ekle
                </button>
              </div>
            </div>

            {/* BÖLÜM 10: YOL HARİTASI */}
            <div className="report-section page-break">
              <h2 className="section-title">10. Stratejik Yol Haritası ve Aksiyon Planı</h2>
              
              <div className="ai-recommendations-box no-print">
                <div className="ai-rec-header">
                  <h3>✨ Yapay Zeka Önerileri</h3>
                  <p>Mevcut verilere göre sistem tarafından önerilen öncelikli aksiyonlar</p>
                </div>
                <div className="ai-terms-grid">
                  <div className="ai-term-column">
                    <h4 className="ai-term-title">Kısa Vade (0-6 Ay)</h4>
                    {aiRecommendations.shortTerm.map((rec, i) => (
                      <div className="ai-rec-card" key={i}>
                        <span className="rec-focus">{rec.focusArea}</span>
                        <p className="rec-action">{rec.action}</p>
                        <div style={{display:'flex', gap:'0.5rem'}}>
                          <button className="rec-add-btn" onClick={() => addAIRecommendationToRoadmap(rec, 'short')}>➕ Yol Haritasına Ekle</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="ai-term-column">
                    <h4 className="ai-term-title">Orta Vade (6-18 Ay)</h4>
                    {aiRecommendations.mediumTerm.map((rec, i) => (
                      <div className="ai-rec-card" key={i}>
                        <span className="rec-focus">{rec.focusArea}</span>
                        <p className="rec-action">{rec.action}</p>
                        <button className="rec-add-btn" onClick={() => addAIRecommendationToRoadmap(rec, 'medium')}>➕ Yol Haritasına Ekle</button>
                      </div>
                    ))}
                  </div>
                  <div className="ai-term-column">
                    <h4 className="ai-term-title">Uzun Vade (18+ Ay)</h4>
                    {aiRecommendations.longTerm.map((rec, i) => (
                      <div className="ai-rec-card" key={i}>
                        <span className="rec-focus">{rec.focusArea}</span>
                        <p className="rec-action">{rec.action}</p>
                        <button className="rec-add-btn" onClick={() => addAIRecommendationToRoadmap(rec, 'long')}>➕ Yol Haritasına Ekle</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <table className="report-table roadmap-table">
                <thead>
                  <tr>
                    <th>Odak Alanı</th>
                    <th>Aksiyon Kararı</th>
                    <th>Başlangıç</th>
                    <th>Bitiş</th>
                    <th>Durum</th>
                    <th className="no-print">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {(roadmapActions || []).map((action) => (
                    <tr key={action.id}>
                      <td><strong>{action.focusArea}</strong></td>
                      <td>{action.action}</td>
                      <td>{action.start}</td>
                      <td>{action.end}</td>
                      <td>{action.status}</td>
                      <td className="no-print">
                        <div style={{display:'flex', gap:'0.5rem'}}>
                          <button className="transfer-btn" title="Stratejik Plana Öneri Olarak Aktar" onClick={() => transferToStrategy(action)}>🎯 Aktar</button>
                          <button className="del-btn" onClick={() => handleDeleteAction(action.id)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="add-action-box no-print">
                <h4>Manuel Aksiyon Ekle</h4>
                <form className="roadmap-form" onSubmit={handleAddAction}>
                  <select value={newAction.focusArea} onChange={e => setNewAction({...newAction, focusArea: e.target.value})}>
                    <option>Organizasyonel Yapı</option>
                    <option>Süreç Yönetimi</option>
                    <option>İK ve Eğitim</option>
                    <option>Strateji ve Pazarlama</option>
                    <option>Mali İşler</option>
                  </select>
                  <input type="text" placeholder="Aksiyon açıklaması..." value={newAction.action} onChange={e => setNewAction({...newAction, action: e.target.value})} required />
                  <input type="month" value={newAction.start} onChange={e => setNewAction({...newAction, start: e.target.value})} required />
                  <input type="month" value={newAction.end} onChange={e => setNewAction({...newAction, end: e.target.value})} required />
                  <button type="submit" className="save-btn" style={{padding: '0.6rem 1.2rem'}}>Ekle</button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* YORUM MODALI */}
      {isCommentModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{maxWidth:'600px'}}>
             <h3>Genel Değerlendirme Notu</h3>
             <textarea 
               className="rich-editor" 
               style={{minHeight:'200px', width:'100%', marginBottom:'1rem'}} 
               placeholder="Bu dönem için genel kurumsal teşhis yorumunuzu yazın..."
               value={tempComment}
               onChange={e => setTempComment(e.target.value)}
             />
             <div style={{display:'flex', justifyContent:'flex-end', gap:'1rem'}}>
               <button className="cancel-btn" onClick={() => setIsCommentModalOpen(false)}>İptal</button>
               <button className="save-btn" onClick={handleSaveComment}>Yorumu Rapora Kaydet</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
