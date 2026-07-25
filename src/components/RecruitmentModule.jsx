import React, { useState, useMemo } from 'react';
import './RecruitmentModule.css';

// ═══════════════════════════════════════════════════════════════
// İŞE ALIM MODÜLÜ — İlan Metni Oluşturma & Yönetimi
// ═══════════════════════════════════════════════════════════════

const POSTING_STATUS = {
  draft: { label: 'Taslak', color: '#F59E0B', icon: '📝', bg: '#FEF3C7' },
  approved: { label: 'Onaylı', color: '#10B981', icon: '✅', bg: '#DCFCE7' },
  paused: { label: 'Durduruldu', color: '#6366F1', icon: '⏸️', bg: '#E0E7FF' },
  closed: { label: 'Kapatıldı', color: '#94A3B8', icon: '🔒', bg: '#F1F5F9' },
};

export default function RecruitmentModule({
  jobAnalyses = [],
  departments = [],
  titles = [],
  families = [],
  functions: jobFunctions = [],
  levels = [],
  companyInfo = {},
  postings,
  setPostings,
}) {
  const [view, setView] = useState('list'); // list | create | edit
  const [selectedAnalysisId, setSelectedAnalysisId] = useState(null);
  const [editingPostingId, setEditingPostingId] = useState(null);
  const [postingText, setPostingText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sadece ACTIVE iş analizleri
  const activeAnalyses = useMemo(() =>
    jobAnalyses.filter(ja => ja.status === 'ACTIVE'),
    [jobAnalyses]
  );

  // Zaten ilan oluşturulmuş analizler
  const usedAnalysisIds = useMemo(() =>
    postings.map(p => p.jobAnalysisId),
    [postings]
  );

  // Filtrelenmiş ilanlar
  const filteredPostings = useMemo(() => {
    if (filterStatus === 'all') return postings;
    return postings.filter(p => p.status === filterStatus);
  }, [postings, filterStatus]);

  // ─── İŞ ANALİZİNDEN İLAN METNİ OLUŞTUR ───
  const generatePostingText = (analysis) => {
    const dept = departments.find(d => d.id === analysis.departmentId);
    const title = titles.find(t => t.id === analysis.titleId);
    const family = families.find(f => f.id === analysis.jobFamilyId);
    const func = jobFunctions.find(f => f.id === analysis.jobFunctionId);
    const level = levels.find(l => l.id === analysis.jobLevelId);

    let text = '';

    // Başlık
    text += `📌 ${title?.name || 'Pozisyon'} — ${dept?.name || ''} Departmanı\n\n`;

    // Şirket Hakkında
    text += `🏢 ŞİRKET HAKKINDA\n`;
    text += `${companyInfo?.name || 'Şirketimiz'}, sektöründe öncü bir kuruluş olarak büyüme yolculuğuna devam etmektedir. Dinamik ve yenilikçi ekibimize katılacak yeni takım arkadaşları arıyoruz.\n\n`;

    // Pozisyon Özeti
    text += `📋 POZİSYON ÖZETİ\n`;
    text += `${analysis.purpose || 'Bu pozisyon, organizasyonumuzda kritik bir rol üstlenmektedir.'}\n`;
    if (family || func || level) {
      text += `\nİş Ailesi: ${family?.name || '-'} | Fonksiyon: ${func?.name || '-'} | Seviye: ${level?.name || '-'}\n`;
    }
    text += '\n';

    // Sorumluluklar
    const resps = analysis.responsibilities || [];
    const tasks = analysis.tasks || [];
    if (resps.length > 0) {
      text += `🎯 SORUMLULUKLAR\n`;
      resps.forEach(r => {
        text += `\n• ${r.title || r.description || 'Sorumluluk'}`;
        if (r.description && r.title && r.description !== r.title) {
          text += `\n  ${r.description}`;
        }
        const relatedTasks = tasks.filter(t => t.refResponsibilityId === r.id);
        relatedTasks.forEach(t => {
          text += `\n  - ${t.title}`;
        });
      });
      text += '\n\n';
    }

    // Aranan Nitelikler
    text += `✅ ARANAN NİTELİKLER\n\n`;

    const comps = analysis.competencies || [];
    if (comps.length > 0) {
      text += `Davranışsal Yetkinlikler:\n`;
      comps.forEach(c => {
        const lvl = c.proficiencyLevel === 1 ? 'Temel' : c.proficiencyLevel === 2 ? 'Fonksiyonel' : 'Yönetsel';
        text += `• ${c.title} (${lvl}${c.isMandatory ? ' — Zorunlu' : ''})\n`;
      });
      text += '\n';
    }

    const skills = analysis.skills || [];
    if (skills.length > 0) {
      text += `Teknik Beceriler:\n`;
      skills.forEach(s => {
        const lvl = s.proficiencyLevel === 1 ? 'Temel' : s.proficiencyLevel === 2 ? 'Orta' : 'İleri';
        text += `• ${s.title} (${lvl}${s.isMandatory ? ' — Zorunlu' : ''})\n`;
      });
      text += '\n';
    }

    const knowledge = analysis.knowledge || [];
    if (knowledge.length > 0) {
      text += `Bilgi Alanları:\n`;
      knowledge.forEach(k => {
        text += `• ${k.title}${k.isMandatory ? ' (Zorunlu)' : ''}\n`;
      });
      text += '\n';
    }

    const certs = analysis.certifications || [];
    if (certs.length > 0) {
      text += `Sertifika ve Lisanslar:\n`;
      certs.forEach(c => {
        text += `• ${c.title}${c.issuingBody ? ` (${c.issuingBody})` : ''}${c.isMandatory ? ' — Zorunlu' : ' — Tercih Sebebi'}\n`;
      });
      text += '\n';
    }

    // KPI
    const kpis = analysis.kpiDefinitions || [];
    if (kpis.length > 0) {
      text += `📊 BAŞARI ÖLÇÜTLERİ (KPI)\n`;
      kpis.forEach(k => {
        text += `• ${k.title}: ${k.targetValue}${k.unit ? ' ' + k.unit : ''}${k.weight ? ` (Ağırlık: %${k.weight})` : ''}\n`;
      });
      text += '\n';
    }

    // Çalışma Koşulları
    const wc = analysis.workingConditions;
    if (wc && typeof wc === 'object' && Object.keys(wc).length > 0) {
      text += `🏗️ ÇALIŞMA KOŞULLARI\n`;
      if (wc.workingHours) text += `• Çalışma Saatleri: ${wc.workingHours}\n`;
      if (wc.travelFrequency) text += `• Seyahat: ${wc.travelFrequency}\n`;
      if (wc.workEnvironment) text += `• Çalışma Ortamı: ${wc.workEnvironment}\n`;
      if (wc.physicalEffort) text += `• Fiziksel Efor: ${wc.physicalEffort}\n`;
      if (wc.riskLevel) text += `• Risk Seviyesi: ${wc.riskLevel}\n`;
      if (wc.specialNotes) text += `• Not: ${wc.specialNotes}\n`;
      text += '\n';
    }

    text += `📧 Başvuru için lütfen özgeçmişinizi bize iletin.\n`;

    return text;
  };

  // ─── ADAY TESTLERİ İÇİN İŞ ANALİZİNDEN TEST EŞLEŞME ───
  const deriveRequiredTests = (analysis) => {
    // İş analizindeki yetkinlik/beceri alanlarına göre test kataloğu eşleşmesi
    // linkedTestId varsa doğrudan al, yoksa jobFamily bazlı öner
    const tests = new Set();
    
    const allItems = [
      ...(analysis.competencies || []),
      ...(analysis.skills || []),
      ...(analysis.knowledge || []),
    ];
    
    allItems.forEach(item => {
      if (item.linkedTestId) {
        tests.add(item.linkedTestId);
      }
    });

    // İş ailesi bazlı varsayılan testler
    const familyId = analysis.jobFamilyId;
    if (familyId) {
      // Psikometrik testler her pozisyon için
      tests.add('kisilik_big5');
      tests.add('duygusal_zeka');

      // İş ailesi bazlı pozisyon testleri
      const familyTestMap = {
        'jf_sales': ['pb_satis_pazarlama', 'sn_musteri_iletisim'],
        'jf_marketing': ['pb_pazarlama', 'pb_satis_pazarlama'],
        'jf_hr': ['pb_insan_kaynaklari', 'sn_ekip_catisma'],
        'jf_finance': ['pb_genel_muhasebe', 'pb_finans_yonetimi'],
        'jf_procurement': ['pb_satinalma', 'sn_onceliklendirme'],
        'jf_rnd': ['pb_arge', 'pb_urge'],
        'jf_production': ['pb_uretim_yonetimi', 'mb_isg', 'sn_is_guvenligi'],
        'jf_it': ['pb_bilgi_teknolojileri', 'sayisal_akil_yurutme'],
        'jf_logistics': ['pb_lojistik_sevkiyat', 'sn_onceliklendirme'],
        'jf_planning': ['pb_planlama', 'sayisal_akil_yurutme'],
        'jf_quality': ['pb_kalite_yonetimi', 'mb_kalite_kontrol'],
        'jf_management': ['sn_ekip_catisma', 'sn_etik_ikilem', 'stres_basa_cikma'],
      };
      (familyTestMap[familyId] || []).forEach(t => tests.add(t));
    }

    return Array.from(tests);
  };

  // ─── İLAN OLUŞTUR ───
  const handleSelectAnalysis = (analysisId) => {
    const analysis = jobAnalyses.find(ja => ja.id === analysisId);
    if (!analysis) return;
    setSelectedAnalysisId(analysisId);
    const text = generatePostingText(analysis);
    setPostingText(text);
  };

  const handleSavePosting = (status = 'draft') => {
    const analysis = jobAnalyses.find(ja => ja.id === selectedAnalysisId);
    if (!analysis) return;

    const dept = departments.find(d => d.id === analysis.departmentId);
    const title = titles.find(t => t.id === analysis.titleId);

    const newPosting = {
      id: editingPostingId || 'jp_' + Date.now(),
      jobAnalysisId: analysis.id,
      title: title?.name || 'Pozisyon',
      departmentName: dept?.name || '',
      departmentId: analysis.departmentId,
      titleId: analysis.titleId,
      jobFamilyId: analysis.jobFamilyId,
      status,
      postingText,
      requiredTests: deriveRequiredTests(analysis),
      createdAt: editingPostingId
        ? postings.find(p => p.id === editingPostingId)?.createdAt
        : new Date().toISOString(),
      approvedAt: status === 'approved' ? new Date().toISOString() : null,
      closedAt: status === 'closed' ? new Date().toISOString() : null,
    };

    setPostings(prev => {
      if (editingPostingId) {
        return prev.map(p => p.id === editingPostingId ? newPosting : p);
      }
      return [newPosting, ...prev];
    });

    const msg = status === 'approved' ? '✅ İlan onaylandı ve yayınlandı!' : '💾 İlan taslak olarak kaydedildi.';
    alert(msg);
    resetView();
  };

  const handleEditPosting = (posting) => {
    setEditingPostingId(posting.id);
    setSelectedAnalysisId(posting.jobAnalysisId);
    setPostingText(posting.postingText);
    setView('edit');
  };

  const handleChangeStatus = (postingId, newStatus) => {
    setPostings(prev => prev.map(p =>
      p.id === postingId
        ? {
            ...p,
            status: newStatus,
            approvedAt: newStatus === 'approved' ? new Date().toISOString() : p.approvedAt,
            closedAt: newStatus === 'closed' ? new Date().toISOString() : p.closedAt,
          }
        : p
    ));
  };

  const handleDeletePosting = (postingId) => {
    if (!confirm('Bu ilanı silmek istediğinize emin misiniz?')) return;
    setPostings(prev => prev.filter(p => p.id !== postingId));
  };

  const resetView = () => {
    setView('list');
    setSelectedAnalysisId(null);
    setEditingPostingId(null);
    setPostingText('');
  };

  // ═══════════════════════════════════════════════════════
  // İLAN LİSTESİ GÖRÜNÜMÜ
  // ═══════════════════════════════════════════════════════
  if (view === 'list') {
    const statusCounts = {
      all: postings.length,
      draft: postings.filter(p => p.status === 'draft').length,
      approved: postings.filter(p => p.status === 'approved').length,
      paused: postings.filter(p => p.status === 'paused').length,
      closed: postings.filter(p => p.status === 'closed').length,
    };

    return (
      <div className="recruit-module fade-in">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>👥 İşe Alım — İlan Yönetimi</h3>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              İş analizlerinden otomatik ilan metni oluşturun, düzenleyin ve onaylayın.
            </p>
          </div>
          <button className="rf-btn primary" onClick={() => setView('create')}>
            + İlan Metni Oluştur
          </button>
        </div>

        {/* Stats */}
        <div className="stats-hero" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {[
            { key: 'all', icon: '📋', label: 'Toplam İlan', color: '#4F46E5' },
            { key: 'draft', icon: '📝', label: 'Taslak', color: '#F59E0B' },
            { key: 'approved', icon: '✅', label: 'Onaylı', color: '#10B981' },
            { key: 'paused', icon: '⏸️', label: 'Durduruldu', color: '#6366F1' },
            { key: 'closed', icon: '🔒', label: 'Kapatıldı', color: '#94A3B8' },
          ].map(s => (
            <div
              key={s.key}
              className="stat-hero-card"
              style={{
                background: filterStatus === s.key
                  ? `linear-gradient(135deg, ${s.color}, ${s.color}CC)`
                  : '#F8FAFC',
                color: filterStatus === s.key ? 'white' : '#1E293B',
                cursor: 'pointer',
                border: filterStatus === s.key ? 'none' : '1px solid #E2E8F0',
              }}
              onClick={() => setFilterStatus(s.key)}
            >
              <div className="sh-icon">{s.icon}</div>
              <div className="sh-val">{statusCounts[s.key]}</div>
              <div className="sh-label" style={{ opacity: filterStatus === s.key ? 1 : 0.7 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* İlan Listesi */}
        {filteredPostings.length === 0 ? (
          <div className="recruit-empty">
            <div className="recruit-empty-icon">📭</div>
            <p>Henüz ilan oluşturulmadı. İş analizlerinden otomatik ilan metni oluşturabilirsiniz.</p>
            <button className="rf-btn primary" style={{ marginTop: '1rem' }} onClick={() => setView('create')}>
              İlk İlanı Oluştur
            </button>
          </div>
        ) : (
          <div className="posting-grid">
            {filteredPostings.map(posting => {
              const st = POSTING_STATUS[posting.status] || POSTING_STATUS.draft;
              return (
                <div key={posting.id} className={`posting-card status-${posting.status === 'approved' ? 'open' : posting.status === 'paused' ? 'paused' : 'completed'}`}>
                  <div className="posting-header">
                    <div>
                      <div className="posting-title">{posting.title}</div>
                      <div className="posting-dept">{posting.departmentName}</div>
                    </div>
                    <span className="posting-badge" style={{ background: st.bg, color: st.color }}>
                      {st.icon} {st.label}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '0.75rem', lineHeight: 1.5, maxHeight: '3.5em', overflow: 'hidden' }}>
                    {posting.postingText?.substring(0, 120)}...
                  </div>

                  <div className="posting-stats">
                    <div className="posting-stat">
                      <span className="posting-stat-val">{posting.requiredTests?.length || 0}</span>
                      <span className="posting-stat-label">Test</span>
                    </div>
                    <div className="posting-stat">
                      <span className="posting-stat-val">{new Date(posting.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })}</span>
                      <span className="posting-stat-label">Oluşturulma</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                    <button className="kc-btn" onClick={() => handleEditPosting(posting)}>✏️ Düzenle</button>
                    {posting.status === 'draft' && (
                      <button className="kc-btn advance" onClick={() => handleChangeStatus(posting.id, 'approved')}>✅ Onayla</button>
                    )}
                    {posting.status === 'approved' && (
                      <button className="kc-btn" style={{ borderColor: '#6366F1', color: '#6366F1' }} onClick={() => handleChangeStatus(posting.id, 'paused')}>⏸️ Durdur</button>
                    )}
                    {posting.status === 'paused' && (
                      <button className="kc-btn advance" onClick={() => handleChangeStatus(posting.id, 'approved')}>▶️ Devam</button>
                    )}
                    {posting.status !== 'closed' && (
                      <button className="kc-btn" style={{ borderColor: '#94A3B8', color: '#94A3B8' }} onClick={() => handleChangeStatus(posting.id, 'closed')}>🔒 Kapat</button>
                    )}
                    <button className="kc-btn reject" onClick={() => handleDeletePosting(posting.id)}>🗑️</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // İLAN OLUŞTURMA / DÜZENLEME GÖRÜNÜMÜ
  // ═══════════════════════════════════════════════════════
  return (
    <div className="recruit-module fade-in">
      <button className="kc-btn" style={{ marginBottom: '1.5rem' }} onClick={resetView}>← Listeye Dön</button>

      <h3 style={{ marginBottom: '0.5rem' }}>
        {view === 'edit' ? '✏️ İlan Düzenle' : '📝 İlan Metni Oluştur'}
      </h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
        {view === 'edit'
          ? 'İlan metnini düzenleyebilir ve durumunu değiştirebilirsiniz.'
          : 'Onaylanmış bir iş analizi seçin → otomatik ilan metni oluşturulacak → düzenleyip onaylayın.'
        }
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: view === 'edit' ? '1fr' : '320px 1fr', gap: '1.5rem' }}>
        {/* Sol: İş Analizi Seçimi (sadece create modunda) */}
        {view === 'create' && (
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem', color: '#475569' }}>
              📄 Onaylı İş Analizleri ({activeAnalyses.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '600px', overflowY: 'auto' }}>
              {activeAnalyses.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', background: '#F8FAFC', borderRadius: '10px', border: '2px dashed #E2E8F0' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
                  <p style={{ fontSize: '0.85rem' }}>Onaylanmış (ACTIVE) iş analizi bulunamadı.</p>
                  <p style={{ fontSize: '0.8rem' }}>Önce İş Analizi modülünden bir analiz oluşturup onaylayın.</p>
                </div>
              ) : (
                activeAnalyses.map(ja => {
                  const dept = departments.find(d => d.id === ja.departmentId);
                  const title = titles.find(t => t.id === ja.titleId);
                  const isUsed = usedAnalysisIds.includes(ja.id);
                  const isSelected = selectedAnalysisId === ja.id;

                  return (
                    <div
                      key={ja.id}
                      onClick={() => !isUsed && handleSelectAnalysis(ja.id)}
                      style={{
                        padding: '0.85rem',
                        background: isSelected ? '#EEF2FF' : isUsed ? '#F8FAFC' : 'white',
                        border: `1.5px solid ${isSelected ? '#818CF8' : isUsed ? '#E2E8F0' : '#E2E8F0'}`,
                        borderRadius: '10px',
                        cursor: isUsed ? 'not-allowed' : 'pointer',
                        opacity: isUsed ? 0.6 : 1,
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E293B' }}>
                        {title?.name || ja.titleId}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.15rem' }}>
                        {dept?.name || ja.departmentId} · v{ja.version}
                      </div>
                      {isUsed && (
                        <span style={{ fontSize: '0.68rem', color: '#94A3B8', fontStyle: 'italic' }}>
                          İlan zaten oluşturulmuş
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Sağ: İlan Metin Editörü */}
        <div>
          {!selectedAnalysisId && view === 'create' ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              minHeight: '400px', background: '#F8FAFC', borderRadius: '14px', border: '2px dashed #CBD5E1',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👈</div>
              <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>Soldaki listeden bir iş analizi seçin</p>
              <p style={{ color: '#CBD5E1', fontSize: '0.8rem' }}>Seçim yapıldığında otomatik ilan metni oluşturulacak</p>
            </div>
          ) : (
            <div className="recruit-form">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, color: '#0F172A' }}>📋 İlan Metni</h4>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                  {postingText.length} karakter
                </span>
              </div>

              <textarea
                value={postingText}
                onChange={e => setPostingText(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '500px',
                  padding: '1.25rem',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  lineHeight: 1.7,
                  fontFamily: "'Inter', -apple-system, sans-serif",
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'border 0.2s',
                  background: '#FAFBFF',
                }}
                onFocus={e => e.target.style.borderColor = '#818CF8'}
                onBlur={e => e.target.style.borderColor = '#E2E8F0'}
              />

              <div className="rf-actions" style={{ marginTop: '1.25rem' }}>
                <button className="rf-btn ghost" onClick={resetView}>İptal</button>
                <button className="rf-btn" style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }}
                  onClick={() => handleSavePosting('draft')}
                >
                  💾 Taslak Kaydet
                </button>
                <button className="rf-btn primary" onClick={() => handleSavePosting('approved')}>
                  ✅ Onayla & Yayınla
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
