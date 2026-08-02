import React, { useState, useMemo } from 'react';
import { testCatalog, TEST_GROUPS, getTestsByGroup, getSubGroups } from '../data/testCatalog';
import { generateExamToken, SECURITY_LEVELS } from '../utils/examSecurity';
import { sendEmail } from '../utils/mailService';

// ═══════════════════════════════════════════════════════════════
// TEST ATAMA PANELİ — Yönetici Tarafı
// Aday bilgileri, test seçimi, süre, güvenlik, link oluşturma
// ═══════════════════════════════════════════════════════════════

export default function TestAssignmentPanel({ assignments, setAssignments, onPreviewExam, approvedPostings = [], jobAnalyses = [] }) {
  const [view, setView] = useState('list'); // list | create
  const [form, setForm] = useState({
    candidateName: '',
    candidateEmail: '',
    postingId: '',
    selectedTests: [],
    testDuration: 45,
    deadlineDays: 3,
    securityLevel: 'standard',
    notes: '',
  });
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [filterGroup, setFilterGroup] = useState('all');

  // Aday statü tanımları
  const CANDIDATE_STATUSES = {
    basvuru: { label: 'Başvuru', icon: '📩', color: '#94A3B8', bg: '#F1F5F9' },
    on_eleme: { label: 'Ön Eleme', icon: '🔍', color: '#3B82F6', bg: '#DBEAFE' },
    mulakat: { label: 'Mülakat', icon: '🎤', color: '#8B5CF6', bg: '#EDE9FE' },
    test: { label: 'Test', icon: '🧪', color: '#F59E0B', bg: '#FEF3C7' },
    teklif: { label: 'Teklif', icon: '📋', color: '#10B981', bg: '#DCFCE7' },
    ise_alindi: { label: 'İşe Alındı', icon: '✅', color: '#059669', bg: '#D1FAE5' },
    reddedildi: { label: 'Reddedildi', icon: '❌', color: '#EF4444', bg: '#FEE2E2' },
  };

  const groupEntries = Object.entries(TEST_GROUPS);

  // Filtered test list
  const filteredTests = useMemo(() => {
    if (filterGroup === 'all') return testCatalog;
    return testCatalog.filter(t => t.group === filterGroup);
  }, [filterGroup]);

  // Group tests by subGroup or group
  const groupedTests = useMemo(() => {
    const groups = {};
    filteredTests.forEach(t => {
      const key = t.subGroup || TEST_GROUPS[t.group]?.title || 'Diğer';
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
    return groups;
  }, [filteredTests]);

  const toggleTest = (testId) => {
    setForm(prev => ({
      ...prev,
      selectedTests: prev.selectedTests.includes(testId)
        ? prev.selectedTests.filter(id => id !== testId)
        : [...prev.selectedTests, testId],
    }));
  };

  const selectAllInGroup = (groupTests) => {
    const ids = groupTests.map(t => t.id);
    const allSelected = ids.every(id => form.selectedTests.includes(id));
    setForm(prev => ({
      ...prev,
      selectedTests: allSelected
        ? prev.selectedTests.filter(id => !ids.includes(id))
        : [...new Set([...prev.selectedTests, ...ids])],
    }));
  };

  const totalEstimated = useMemo(() => {
    return form.selectedTests.reduce((sum, id) => {
      const t = testCatalog.find(tc => tc.id === id);
      return sum + (t?.estimatedMinutes || 5);
    }, 0);
  }, [form.selectedTests]);

  const totalQuestions = useMemo(() => {
    return form.selectedTests.reduce((sum, id) => {
      const t = testCatalog.find(tc => tc.id === id);
      return sum + (t?.questionCount || 0);
    }, 0);
  }, [form.selectedTests]);

  // ─── İLAN SEÇİLDİĞİNDE OTOMATİK TEST EŞLEŞME ───
  const handlePostingSelect = (postingId) => {
    if (!postingId) {
      // "İlan yok" seçildi — testleri temizle
      setForm(prev => ({ ...prev, postingId: '', selectedTests: [] }));
      return;
    }
    const posting = approvedPostings.find(p => p.id === postingId);
    if (!posting) return;

    // İlana bağlı testleri otomatik seç
    const autoTests = posting.requiredTests || [];
    // Sadece test kataloğunda bulunanları filtrele
    const validTests = autoTests.filter(id => testCatalog.find(tc => tc.id === id));
    setForm(prev => ({ ...prev, postingId, selectedTests: validTests }));
  };

  const handleCreate = () => {
    if (!form.candidateName.trim() || !form.candidateEmail.trim()) {
      alert('Lütfen aday adı ve e-posta adresini girin.');
      return;
    }
    if (form.selectedTests.length === 0) {
      alert('En az bir test seçin.');
      return;
    }

    const token = generateExamToken();
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + form.deadlineDays);

    const assignment = {
      id: Date.now().toString(),
      ...form,
      token,
      deadline: deadline.toISOString(),
      status: 'pending', // pending | completed | expired
      candidateStatus: form.postingId ? 'basvuru' : 'test', // İlan varsa başvuru, yoksa direkt test
      postingId: form.postingId || null,
      postingTitle: form.postingId ? (approvedPostings.find(p => p.id === form.postingId)?.title || '') : null,
      createdAt: new Date().toISOString(),
      completedAt: null,
      result: null,
      examLink: `${window.location.origin}/exam/${token}`,
    };

    setAssignments(prev => [assignment, ...prev]);

    const mailSubject = "Aday Değerlendirme Sınavı Davetiyesi";
    const mailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #334155;">
        <h2 style="color: #2563eb; margin-top: 0;">Aday Değerlendirme Daveti</h2>
        <p>Sayın <strong>${form.candidateName}</strong>,</p>
        <p>Değerlendirme sınavınız hazırlanmıştır. Sınavınızı başlatmak için aşağıdaki bağlantıyı kullanabilirsiniz:</p>
        <div style="margin: 24px 0; text-align: center;">
          <a href="${assignment.examLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Sınava Başla</a>
        </div>
        <p><strong>Sınav Detayları:</strong></p>
        <ul style="padding-left: 20px;">
          <li><strong>Toplam Süre:</strong> ${form.testDuration} dakika</li>
          <li><strong>Test Sayısı:</strong> ${form.selectedTests.length} adet</li>
          <li><strong>Son Erişim Tarihi:</strong> ${deadline.toLocaleDateString('tr-TR')}</li>
        </ul>
        <p style="color: #64748b; font-size: 0.85rem; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px; line-height: 1.4;">
          * Sınavı bölünmeden tamamlayabileceğiniz sessiz bir ortamda başlatmanızı öneririz.<br/>
          * Lütfen sınav penceresini kapatmayın veya sayfayı yenilemeyin.
        </p>
      </div>
    `;

    sendEmail({ to: form.candidateEmail, subject: mailSubject, html: mailHtml })
      .then(() => {
        alert(`✅ Sınav ataması yapıldı ve davet maili adayın e-posta adresine (${form.candidateEmail}) başarıyla gönderildi!`);
      })
      .catch((err) => {
        console.error('TestAssignmentPanel email error:', err);
        alert(
          `⚠️ Sınav ataması yapıldı ancak davet maili gönderilemedi.\n` +
          `Hata: ${err.message}\n` +
          `Lütfen çevre değişkenlerini (SMTP veya RESEND ayarlarını) kontrol edin.\n\n` +
          `Aday Sınav Linki: ${assignment.examLink}`
        );
      });

    setForm({ candidateName: '', candidateEmail: '', postingId: '', selectedTests: [], testDuration: 45, deadlineDays: 3, securityLevel: 'standard', notes: '' });
    setView('list');
  };

  // ─── LIST VIEW ────────────────────────────────────────
  if (view === 'list') {
    const pending = assignments.filter(a => a.status === 'pending');
    const completed = assignments.filter(a => a.status === 'completed');

    return (
      <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h3>📋 Test Atamaları</h3>
            <p style={{ color: 'var(--text-muted)' }}>Adaylara test atayın, takip edin ve sonuçları görüntüleyin.</p>
          </div>
          <button className="primary-btn" onClick={() => setView('create')}>+ Yeni Test Ata</button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { icon: '📊', label: 'Toplam Atama', value: assignments.length, color: '#4F46E5' },
            { icon: '⏳', label: 'Bekleyen', value: pending.length, color: '#F59E0B' },
            { icon: '✅', label: 'Tamamlanan', value: completed.length, color: '#22C55E' },
            { icon: '🧪', label: 'Mevcut Test', value: testCatalog.length, color: '#8B5CF6' },
          ].map(s => (
            <div key={s.label} className="glass-card" style={{ padding: '1.25rem', borderTop: `3px solid ${s.color}` }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Assignment list */}
        {assignments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <p>Henüz test ataması yapılmadı.</p>
            <button className="primary-btn" style={{ marginTop: '1rem' }} onClick={() => setView('create')}>İlk Atamayı Yap</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {assignments.map(a => {
              const isExpired = a.status === 'pending' && new Date(a.deadline) < new Date();
              const statusColor = a.status === 'completed' ? '#22C55E' : isExpired ? '#EF4444' : '#F59E0B';
              const statusText = a.status === 'completed' ? 'Tamamlandı' : isExpired ? 'Süresi Doldu' : 'Bekliyor';
              const cStatus = CANDIDATE_STATUSES[a.candidateStatus] || CANDIDATE_STATUSES.basvuru;

              return (
                <div key={a.id} className="glass-card" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: a.status === 'completed' ? 'pointer' : 'default' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700, color: '#4F46E5' }}>
                    {a.candidateName?.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong>{a.candidateName}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{a.candidateEmail}</div>
                    {a.postingTitle && (
                      <div style={{ fontSize: '0.72rem', color: '#6366F1', marginTop: '0.15rem' }}>📌 {a.postingTitle}</div>
                    )}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Testler</div>
                    <strong>{a.selectedTests.length}</strong>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Son Tarih</div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{new Date(a.deadline).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <span style={{ padding: '0.3rem 0.8rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, background: `${statusColor}15`, color: statusColor }}>
                    {statusText}
                  </span>
                  {/* Aday Statüsü */}
                  <select
                    value={a.candidateStatus || 'basvuru'}
                    onChange={e => {
                      const newStatus = e.target.value;
                      setAssignments(prev => prev.map(item =>
                        item.id === a.id ? { ...item, candidateStatus: newStatus } : item
                      ));
                    }}
                    style={{
                      padding: '0.3rem 0.5rem',
                      borderRadius: 8,
                      border: `1.5px solid ${cStatus.color}`,
                      background: cStatus.bg,
                      color: cStatus.color,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                    title="Aday statüsünü değiştir"
                  >
                    {Object.entries(CANDIDATE_STATUSES).map(([key, val]) => (
                      <option key={key} value={key}>{val.icon} {val.label}</option>
                    ))}
                  </select>
                  {a.status === 'pending' && !isExpired && (
                    <button
                      className="primary-btn"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                      onClick={() => onPreviewExam && onPreviewExam(a)}
                    >
                      ▶ Önizle
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ─── CREATE VIEW ──────────────────────────────────────
  return (
    <div className="fade-in">
      <button className="ct-btn ghost" style={{ marginBottom: '1.5rem' }} onClick={() => setView('list')}>← Listeye Dön</button>
      <h3 style={{ marginBottom: '0.5rem' }}>📝 Yeni Test Ataması</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Aday bilgilerini girin, testleri seçin ve sınav bağlantısını oluşturun.</p>

      {/* Step 1: Candidate Info */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h4 style={{ marginBottom: '1rem', color: '#4F46E5' }}>1️⃣ Aday Bilgileri</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Ad Soyad*</label>
            <input
              value={form.candidateName}
              onChange={e => setForm({ ...form, candidateName: e.target.value })}
              placeholder="Adayın adı soyadı..."
              style={{ width: '100%', padding: '0.65rem', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: '0.95rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>E-posta*</label>
            <input
              type="email"
              value={form.candidateEmail}
              onChange={e => setForm({ ...form, candidateEmail: e.target.value })}
              placeholder="aday@email.com"
              style={{ width: '100%', padding: '0.65rem', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: '0.95rem' }}
            />
          </div>
        </div>

        {/* Başvurulan İlan Seçimi */}
        <div style={{ marginTop: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>📌 Başvurulan İlan</label>
          <select
            value={form.postingId}
            onChange={e => handlePostingSelect(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem',
              borderRadius: 8,
              border: `1.5px solid ${form.postingId ? '#818CF8' : '#E2E8F0'}`,
              fontSize: '0.9rem',
              background: form.postingId ? '#EEF2FF' : 'white',
              outline: 'none',
            }}
          >
            <option value="">İlan yok (Bağımsız test ataması)</option>
            {approvedPostings.map(p => (
              <option key={p.id} value={p.id}>{p.title} — {p.departmentName}</option>
            ))}
          </select>
          {form.postingId && (
            <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', background: '#F0FDF4', borderRadius: 8, border: '1px solid #BBF7D0', fontSize: '0.8rem', color: '#166534' }}>
              ✅ İlana tanımlı <strong>{form.selectedTests.length}</strong> test otomatik olarak seçildi. İsterseniz aşağıdan değiştirebilirsiniz.
            </div>
          )}
        </div>
      </div>

      {/* Step 2: Test Selection */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h4 style={{ color: '#4F46E5', margin: 0 }}>2️⃣ Test Seçimi</h4>
          <span style={{ fontSize: '0.85rem', color: '#4F46E5', fontWeight: 700 }}>
            {form.selectedTests.length} test seçili · ~{totalEstimated} dk · {totalQuestions} soru
          </span>
        </div>

        {/* Group filter tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <button
            onClick={() => setFilterGroup('all')}
            style={{
              padding: '0.4rem 0.8rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, border: 'none', cursor: 'pointer',
              background: filterGroup === 'all' ? '#4F46E5' : '#F1F5F9',
              color: filterGroup === 'all' ? 'white' : '#64748B',
            }}
          >
            Tümü ({testCatalog.length})
          </button>
          {groupEntries.map(([key, g]) => {
            const count = getTestsByGroup(key).length;
            const selectedInGroup = form.selectedTests.filter(id => testCatalog.find(t => t.id === id)?.group === key).length;
            return (
              <button
                key={key}
                onClick={() => setFilterGroup(key)}
                style={{
                  padding: '0.4rem 0.8rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                  background: filterGroup === key ? g.color : '#F1F5F9',
                  color: filterGroup === key ? 'white' : '#64748B',
                }}
              >
                {g.icon} {g.title.replace(' Testleri', '').replace(' Testler', '')} ({count})
                {selectedInGroup > 0 && <span style={{ marginLeft: 4, background: 'rgba(255,255,255,0.3)', padding: '0 4px', borderRadius: 8 }}>✓{selectedInGroup}</span>}
              </button>
            );
          })}
        </div>

        {/* Test cards */}
        <div style={{ maxHeight: 420, overflowY: 'auto', paddingRight: '0.5rem' }}>
          {Object.entries(groupedTests).map(([groupName, tests]) => (
            <div key={groupName} style={{ marginBottom: '1rem' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer' }}
                onClick={() => selectAllInGroup(tests)}
              >
                <input
                  type="checkbox"
                  checked={tests.every(t => form.selectedTests.includes(t.id))}
                  onChange={() => {}}
                  style={{ accentColor: '#4F46E5' }}
                />
                <strong style={{ fontSize: '0.85rem', color: '#475569' }}>{groupName}</strong>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>({tests.length} test)</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.5rem', paddingLeft: '1.5rem' }}>
                {tests.map(t => {
                  const isSelected = form.selectedTests.includes(t.id);
                  return (
                    <div
                      key={t.id}
                      onClick={() => toggleTest(t.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.9rem',
                        background: isSelected ? '#EEF2FF' : 'white',
                        border: `1.5px solid ${isSelected ? '#818CF8' : '#E2E8F0'}`,
                        borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      <input type="checkbox" checked={isSelected} onChange={() => {}} style={{ accentColor: '#4F46E5' }} />
                      <span style={{ fontSize: '1.1rem' }}>{t.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B' }}>{t.title}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{t.questionCount} soru · ~{t.estimatedMinutes || 5} dk</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 3: Settings */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h4 style={{ marginBottom: '1rem', color: '#4F46E5' }}>3️⃣ Süre ve Güvenlik Ayarları</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Test Süresi (dakika)</label>
            <input
              type="number"
              value={form.testDuration}
              onChange={e => setForm({ ...form, testDuration: parseInt(e.target.value) || 45 })}
              min={10}
              max={180}
              style={{ width: '100%', padding: '0.65rem', borderRadius: 8, border: '1px solid #E2E8F0' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Son Tarih (gün)</label>
            <input
              type="number"
              value={form.deadlineDays}
              onChange={e => setForm({ ...form, deadlineDays: parseInt(e.target.value) || 3 })}
              min={1}
              max={30}
              style={{ width: '100%', padding: '0.65rem', borderRadius: 8, border: '1px solid #E2E8F0' }}
            />
            <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>En geç {form.deadlineDays} gün içinde uygulamalı</span>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Güvenlik Seviyesi</label>
            <select
              value={form.securityLevel}
              onChange={e => setForm({ ...form, securityLevel: e.target.value })}
              style={{ width: '100%', padding: '0.65rem', borderRadius: 8, border: '1px solid #E2E8F0' }}
            >
              {Object.entries(SECURITY_LEVELS).map(([key, level]) => (
                <option key={key} value={key}>{level.icon} {level.label} — {level.description}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary & Create */}
      <div className="glass-card" style={{ padding: '1.5rem', background: '#EEF2FF', borderColor: '#C7D2FE' }}>
        <h4 style={{ marginBottom: '1rem', color: '#4F46E5' }}>📊 Atama Özeti</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div><div style={{ fontSize: '0.75rem', color: '#64748B' }}>Aday</div><strong>{form.candidateName || '—'}</strong></div>
          <div><div style={{ fontSize: '0.75rem', color: '#64748B' }}>Seçilen Test</div><strong>{form.selectedTests.length}</strong></div>
          <div><div style={{ fontSize: '0.75rem', color: '#64748B' }}>Tahmini Süre</div><strong>~{totalEstimated} dk</strong></div>
          <div><div style={{ fontSize: '0.75rem', color: '#64748B' }}>Toplam Soru</div><strong>{totalQuestions}</strong></div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="primary-btn" onClick={handleCreate} disabled={!form.candidateName.trim() || !form.candidateEmail.trim() || form.selectedTests.length === 0}>
            📧 Linki Oluştur ve Gönder
          </button>
          <button className="ct-btn ghost" onClick={() => setView('list')}>İptal</button>
        </div>
      </div>
    </div>
  );
}
