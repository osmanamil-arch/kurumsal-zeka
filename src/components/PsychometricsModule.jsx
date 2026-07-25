import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import CandidateExamView from './CandidateExamView';
import TestAssignmentPanel from './TestAssignmentPanel';
import { questionBank } from '../data/testQuestionBank';
import { testCatalog, TEST_GROUPS, getTestsByGroup, getTestById } from '../data/testCatalog';
import { psikometrikTestBanks } from '../data/psikometrikTestBank';
import { pozisyonTestBanks } from '../data/pozisyonTestBank';
import { personalityBank } from '../data/personalityBank';
import { calculateRiskLevel } from '../utils/examSecurity';
import { getDimensionColor } from '../utils/examScoring';
import { competencyKeys, positionProfiles } from '../data/positionProfiles';

// Reusing same CSS classes used in HumanResourcesModule
import './HumanResourcesModule.css';

export default function PsychometricsModule({ employees, userRole, approvedPostings = [], jobAnalyses = [], companyId }) {
  const [activeTab, setActiveTab] = useState('test_ata');

  const p = `kobi_${companyId || 'default'}`;
  const [assignments, setAssignments] = useLocalStorage(`${p}_testAssignments`, []);
  const [showExamView, setShowExamView] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);

  const handleExamComplete = (result) => {
    setAssignments(prev => prev.map(a =>
      a.id === result.assignmentId
        ? { ...a, status: 'completed', completedAt: result.completedAt, result }
        : a
    ));
    setShowExamView(null);
  };

  const handlePreviewExam = (assignment) => {
    setShowExamView(assignment);
  };

  if (showExamView) {
    return (
      <CandidateExamView
        assignment={showExamView}
        onComplete={handleExamComplete}
        onCancel={() => setShowExamView(null)}
      />
    );
  }

  return (
    <div className="hr-module fade-in">
      <div className="profile-tabs glass" style={{ marginBottom: '1.5rem', background: '#F8FAFC', flexWrap: 'wrap' }}>
        <button className={`tab-btn ${activeTab === 'test_ata' ? 'active' : ''}`} onClick={() => setActiveTab('test_ata')}>📋 Test Ata</button>
        <button className={`tab-btn ${activeTab === 'sonuclar' ? 'active' : ''}`} onClick={() => setActiveTab('sonuclar')}>📊 Sonuçlar</button>
        <button className={`tab-btn ${activeTab === 'test_katalogu' ? 'active' : ''}`} onClick={() => setActiveTab('test_katalogu')}>🧪 Test Kataloğu</button>
      </div>

      <div className="profile-content glass fade-in" style={{ padding: '2rem' }}>
        {activeTab === 'test_ata' && (
          <TestAssignmentPanel
            assignments={assignments}
            setAssignments={setAssignments}
            onPreviewExam={handlePreviewExam}
            approvedPostings={approvedPostings}
            jobAnalyses={jobAnalyses}
          />
        )}
        {activeTab === 'sonuclar' && (
          <ResultsTab
            assignments={assignments}
            selectedResult={selectedResult}
            setSelectedResult={setSelectedResult}
          />
        )}
        {activeTab === 'test_katalogu' && <TestCatalogTab userRole={userRole} />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SONUÇLAR TAB — Puanlar + Grafik + AI Yorum
// ═══════════════════════════════════════════════════════════════
function ResultsTab({ assignments, selectedResult, setSelectedResult }) {
  const completed = assignments.filter(a => a.status === 'completed' && a.result);

  if (selectedResult) {
    const r = selectedResult.result;
    const risk = r?.riskLevel || calculateRiskLevel(r?.securityLog || {});
    const log = r?.securityLog || {};
    const scores = r?.testScores || {};

    return (
      <div>
        <button className="ct-btn ghost" style={{ marginBottom: '1.5rem' }} onClick={() => setSelectedResult(null)}>← Listeye Dön</button>
        <h3 style={{ marginBottom: '0.5rem' }}>📋 {selectedResult.candidateName} — Değerlendirme Raporu</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{new Date(selectedResult.completedAt).toLocaleString('tr-TR')}</p>

        {/* ── TEST SONUÇLARI ── */}
        {Object.keys(scores).length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1.25rem', fontSize: '1.1rem' }}>🎯 Test Sonuçları</h4>
            {Object.entries(scores).map(([testId, score]) => (
              <TestScoreCard key={testId} score={score} />
            ))}
          </div>
        )}

        {/* ── GÜVENLİK RAPORU ── */}
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', borderTop: `3px solid ${risk.color}` }}>
          <h4 style={{ marginBottom: '1rem' }}>🛡️ Güvenlik Raporu</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Risk Seviyesi</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: risk.color }}>{risk.icon} {risk.label}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sekme Değiştirme</div>
              <strong>{log.tabSwitches || 0} kez</strong>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tam Ekran Çıkışı</div>
              <strong>{log.fullscreenExits || 0} kez</strong>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Kopyalama Denemesi</div>
              <strong>{log.copyAttempts || 0} kez</strong>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Kamera Snapshot</div>
              <strong>{log.cameraSnapshots?.length || 0} adet</strong>
            </div>
          </div>
          {log.cameraSnapshots?.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>📸 Kamera Görüntüleri:</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {log.cameraSnapshots.map((snap, i) => (
                  <img key={i} src={snap.dataUrl} alt={`Snapshot ${i + 1}`}
                    style={{ width: 120, height: 90, borderRadius: 8, objectFit: 'cover', border: '2px solid #E2E8F0' }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── TEST BİLGİLERİ ── */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>📊 Genel Bilgiler</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Uygulanan Test</div>
              <strong>{selectedResult.selectedTests?.length || 0}</strong>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Harcanan Süre</div>
              <strong>{Math.floor((r.timeSpent || 0) / 60)} dk {(r.timeSpent || 0) % 60} sn</strong>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cevaplanan</div>
              <strong>{Object.keys(r.answers || {}).length} soru</strong>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Güvenlik Skoru</div>
              <strong style={{ color: risk.color }}>{risk.score}/100</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem' }}>📊 Değerlendirme Sonuçları</h3>
      {completed.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          <p>Henüz tamamlanmış değerlendirme bulunmuyor.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {completed.map(a => {
            const risk = a.result?.riskLevel || { icon: '🟢', label: 'Düşük', color: '#22C55E' };
            return (
              <div key={a.id} className="glass-card" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => setSelectedResult(a)}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#E0FBF0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>✅</div>
                <div style={{ flex: 1 }}>
                  <strong>{a.candidateName}</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(a.completedAt).toLocaleString('tr-TR')}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Testler</div>
                  <strong>{a.selectedTests.length}</strong>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Güvenlik</div>
                  <span style={{ fontSize: '1rem' }}>{risk.icon}</span>
                </div>
                <span style={{ color: '#94A3B8' }}>→</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── TEK TEST SONUÇ KARTI + GRAFİK ──────────────────────
function TestScoreCard({ score }) {
  if (!score) return null;
  const dims = score.dimensions ? Object.values(score.dimensions) : [];

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.25rem', borderLeft: '4px solid #6366F1' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>{score.testIcon}</span>
          <div>
            <strong style={{ fontSize: '1rem' }}>{score.testTitle}</strong>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              Tamamlanma: %{score.completionRate || 0}
              {score.type === 'mcq' && ` · Doğru: ${score.correct}/${score.total}`}
            </div>
          </div>
        </div>
        {/* Overall score badge */}
        {(score.type === 'mcq' || score.type === 'interactive') && (
          <div style={{
            padding: '0.4rem 1rem', borderRadius: 20, fontWeight: 700, fontSize: '0.9rem',
            background: score.percentage >= 70 ? '#DCFCE7' : score.percentage >= 50 ? '#FEF9C3' : '#FEE2E2',
            color: score.percentage >= 70 ? '#166534' : score.percentage >= 50 ? '#854D0E' : '#991B1B',
          }}>
            %{score.percentage} — {score.level}
          </div>
        )}
        {score.type === 'likert' && (
          <div style={{
            padding: '0.4rem 1rem', borderRadius: 20, fontWeight: 700, fontSize: '0.9rem',
            background: '#EEF2FF', color: '#4F46E5',
          }}>
            Genel: %{score.overallPercentage}
          </div>
        )}
      </div>

      {/* Boyut Grafikleri */}
      {dims.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '0.75rem' }}>Boyut Analizi</div>
          {dims.map((dim, i) => {
            const pct = dim.percentage || (dim.count !== undefined && score.total > 0 ? Math.round((dim.count / score.total) * 100) : 0);
            const barColor = getDimensionColor(i);
            return (
              <div key={dim.label} style={{ marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#334155' }}>
                    {dim.icon && <span style={{ marginRight: 4 }}>{dim.icon}</span>}
                    {dim.label}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: barColor }}>
                    {dim.average ? `${dim.average}/5` : dim.score !== undefined ? dim.score : dim.count !== undefined ? dim.count : ''}
                    {dim.level ? ` (${dim.level})` : ''}
                    {pct > 0 ? ` %${pct}` : ''}
                  </span>
                </div>
                <div style={{ height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${Math.min(pct, 100)}%`,
                    background: `linear-gradient(90deg, ${barColor}, ${barColor}CC)`,
                    borderRadius: 4, transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MCQ zorluk dağılımı */}
      {score.type === 'mcq' && score.difficultyBreakdown && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          {Object.entries(score.difficultyBreakdown).map(([diff, data]) => {
            if (data.total === 0) return null;
            const pct = Math.round((data.correct / data.total) * 100);
            const label = diff === 'kolay' ? 'Kolay' : diff === 'orta' ? 'Orta' : 'Zor';
            const bg = diff === 'kolay' ? '#DCFCE7' : diff === 'orta' ? '#FEF9C3' : '#FEE2E2';
            const fg = diff === 'kolay' ? '#166534' : diff === 'orta' ? '#854D0E' : '#991B1B';
            return (
              <div key={diff} style={{ flex: 1, padding: '0.5rem 0.75rem', background: bg, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: fg, fontWeight: 600 }}>{label}</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: fg }}>{data.correct}/{data.total}</div>
                <div style={{ fontSize: '0.7rem', color: fg }}>%{pct}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Forced Choice / Scenario results */}
      {score.primaryRole && (
        <div style={{ padding: '0.75rem', background: '#F0FDF4', borderRadius: 8, marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600 }}>
            Baskın Rol: {score.primaryRole.icon} {score.primaryRole.label}
            {score.secondaryRole && ` · İkincil: ${score.secondaryRole.icon} ${score.secondaryRole.label}`}
          </span>
        </div>
      )}

      {score.primaryStyle && (
        <div style={{ padding: '0.75rem', background: '#EEF2FF', borderRadius: 8, marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#4F46E5', fontWeight: 600 }}>
            Baskın Öğrenme Stili: {score.primaryStyle.icon} {score.primaryStyle.label}
          </span>
        </div>
      )}

      {/* Interactive Breakdown */}
      {score.type === 'interactive' && score.metrics && (
        <div style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: 8, marginBottom: '1rem', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600, marginBottom: '0.5rem' }}>Detaylı Performans Dağılımı</div>
          
          {score.testId === 'dikkat_reaksiyon' ? (
              // CPT Dashboard
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                    <div style={{ textAlign: 'center', background: 'white', padding: '0.5rem', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Doğru Hedef</div>
                      <div style={{ fontWeight: 700, color: '#10B981', fontSize: '1.1rem' }}>{score.metrics.hits || 0} <span style={{fontSize:'0.8rem', color:'#94A3B8'}}>/ 50</span></div>
                    </div>
                    <div style={{ textAlign: 'center', background: 'white', padding: '0.5rem', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Kaçırılan (Miss)</div>
                      <div style={{ fontWeight: 700, color: '#F59E0B', fontSize: '1.1rem' }}>{score.metrics.misses || 0}</div>
                    </div>
                    <div style={{ textAlign: 'center', background: 'white', padding: '0.5rem', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Hatalı Dürtü</div>
                      <div style={{ fontWeight: 700, color: '#EF4444', fontSize: '1.1rem' }}>{score.metrics.falseAlarms || 0}</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                    <div style={{ textAlign: 'center', background: 'white', padding: '0.5rem', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Ortalama Tepki Süresi</div>
                      <div style={{ fontWeight: 700, color: '#6366F1', fontSize: '1rem' }}>{score.metrics.avgRt ? `${score.metrics.avgRt} ms` : '-'}</div>
                    </div>
                    <div style={{ textAlign: 'center', background: 'white', padding: '0.5rem', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>En Hızlı Refleks</div>
                      <div style={{ fontWeight: 700, color: '#8B5CF6', fontSize: '1rem' }}>{score.metrics.minRt ? `${score.metrics.minRt} ms` : '-'}</div>
                    </div>
                  </div>
              </div>
          ) : score.testId === 'dikkat_stroop' ? (
              // Stroop Dashboard
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                    <div style={{ textAlign: 'center', background: 'white', padding: '0.5rem', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Nötr Hız / İsabet</div>
                      <div style={{ fontWeight: 700, color: '#94A3B8', fontSize: '1rem' }}>{score.metrics.neutralRt}ms <span style={{fontSize:'0.75rem', color:'#475569'}}>(%{score.metrics.neutralAcc})</span></div>
                    </div>
                    <div style={{ textAlign: 'center', background: 'white', padding: '0.5rem', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Uyumlu Hız</div>
                      <div style={{ fontWeight: 700, color: '#10B981', fontSize: '1rem' }}>{score.metrics.congruentRt}ms <span style={{fontSize:'0.75rem', color:'#475569'}}>(%{score.metrics.congruentAcc})</span></div>
                    </div>
                    <div style={{ textAlign: 'center', background: 'white', padding: '0.5rem', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Uyumumsuz Hız</div>
                      <div style={{ fontWeight: 700, color: '#EF4444', fontSize: '1rem' }}>{score.metrics.incongruentRt}ms <span style={{fontSize:'0.75rem', color:'#475569'}}>(%{score.metrics.incongruentAcc})</span></div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', background: 'white', padding: '0.75rem', borderRadius: 6, border: '2px solid #E2E8F0', marginTop: '0.25rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Stroop Girişim Gecikmesi (Stroop Effect)</div>
                    <div style={{ fontWeight: 800, color: '#6366F1', fontSize: '1.2rem', marginTop: '0.25rem' }}>+{score.metrics.interference} ms</div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.25rem' }}>* Uyumsuz kelimelerde beynin çelişkiyi çözme süresi (Düşük olması esnekliği gösterir)</div>
                  </div>
              </div>
          ) : (
              // Symbol Search Dashboard
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                   <div style={{ textAlign: 'center', background: 'white', padding: '0.5rem', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                     <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Başarı Skoru</div>
                     <div style={{ fontWeight: 700, color: '#10B981', fontSize: '1.1rem' }}>{score.metrics.baseScore || 0} / 60</div>
                   </div>
                   <div style={{ textAlign: 'center', background: 'white', padding: '0.5rem', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                     <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Çeviklik (Hız)</div>
                     <div style={{ fontWeight: 700, color: '#3B82F6', fontSize: '1.1rem' }}>{score.metrics.speedScore || 0} / 30</div>
                   </div>
                   <div style={{ textAlign: 'center', background: 'white', padding: '0.5rem', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                     <div style={{ fontSize: '0.7rem', color: '#64748B' }}>İsabet (Hatasızlık)</div>
                     <div style={{ fontWeight: 700, color: '#8B5CF6', fontSize: '1.1rem' }}>{score.metrics.precisionScore || 0} / 10</div>
                   </div>
                </div>
                {score.metrics.totalWrongs !== undefined && (
                   <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.75rem', color: '#EF4444', fontWeight: 500 }}>
                     Test boyunca toplam <strong>{score.metrics.totalWrongs}</strong> hatalı tıklama yapıldı.
                   </div>
                )}
              </>
          )}
        </div>
      )}

      {/* AI Yorum */}
      {score.aiComment && (
        <div style={{
          padding: '1rem', background: 'linear-gradient(135deg, #FAFBFF, #F0F1FF)',
          border: '1px solid #E0E4FF', borderRadius: 10, fontSize: '0.85rem', color: '#334155', lineHeight: 1.6,
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366F1', marginBottom: '0.5rem' }}>🤖 AI Değerlendirme Yorumu</div>
          {score.aiComment.split('\n').map((line, i) => (
            <p key={i} style={{ margin: '0.25rem 0' }} dangerouslySetInnerHTML={{
              __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TEST KATALOĞU TAB — Tıklanabilir Detay Sayfası
// ═══════════════════════════════════════════════════════════════
function TestCatalogTab({ userRole }) {
  const [activeGroup, setActiveGroup] = useState('psikometrik');
  const [selectedTest, setSelectedTest] = useState(null);
  const groupMeta = TEST_GROUPS[activeGroup];
  const tests = getTestsByGroup(activeGroup);

  const subGroups = {};
  tests.forEach(t => {
    const key = t.subGroup || 'Genel';
    if (!subGroups[key]) subGroups[key] = [];
    subGroups[key].push(t);
  });

  // ── TEST DETAY SAYFASI ──
  if (selectedTest) {
    return <TestDetailView test={selectedTest} onBack={() => setSelectedTest(null)} userRole={userRole} />;
  }

  return (
    <div>
      <h3 style={{ marginBottom: '1rem' }}>🧪 Test Kataloğu</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        5 grup, {testCatalog.length} test — tıklayarak detay sayfasını açın
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {Object.entries(TEST_GROUPS).map(([key, g]) => (
          <button
            key={key}
            onClick={() => setActiveGroup(key)}
            style={{
              padding: '0.6rem 1.2rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600,
              border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              background: activeGroup === key ? g.color : '#F1F5F9',
              color: activeGroup === key ? 'white' : '#64748B',
              boxShadow: activeGroup === key ? `0 4px 12px ${g.color}40` : 'none',
            }}
          >
            {g.icon} {g.title} ({getTestsByGroup(key).length})
          </button>
        ))}
      </div>

      <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', borderLeft: `4px solid ${groupMeta.color}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '2rem' }}>{groupMeta.icon}</span>
          <div>
            <h4 style={{ margin: 0 }}>{groupMeta.title}</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{groupMeta.description}</p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: groupMeta.color, fontWeight: 600 }}>Anahtar Soru: {groupMeta.question}</p>
          </div>
        </div>
      </div>

      {Object.entries(subGroups).map(([subName, subTests]) => (
        <div key={subName} style={{ marginBottom: '1.5rem' }}>
          {subName !== 'Genel' && (
            <h4 style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #E2E8F0' }}>
              {subName}
            </h4>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.75rem' }}>
            {subTests.map(t => (
              <div
                key={t.id}
                className="glass-card"
                onClick={() => setSelectedTest(t)}
                style={{ padding: '1.25rem', borderTop: `3px solid ${groupMeta.color}`, cursor: 'pointer', transition: 'all 0.2s' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{t.icon}</span>
                  <div>
                    <strong style={{ fontSize: '0.95rem' }}>{t.title}</strong>
                    {t.subtitle && <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{t.subtitle}</div>}
                  </div>
                  <span style={{ marginLeft: 'auto', color: '#94A3B8', fontSize: '1.2rem' }}>→</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.75rem', lineHeight: 1.5 }}>{t.description}</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ padding: '0.2rem 0.5rem', borderRadius: 6, background: '#EEF2FF', color: '#4F46E5', fontSize: '0.7rem', fontWeight: 600 }}>
                    {t.questionCount} soru
                  </span>
                  <span style={{ padding: '0.2rem 0.5rem', borderRadius: 6, background: '#F0FDF4', color: '#166534', fontSize: '0.7rem', fontWeight: 600 }}>
                    ~{t.estimatedMinutes || 5} dk
                  </span>
                  <span style={{ padding: '0.2rem 0.5rem', borderRadius: 6, background: '#FFF7ED', color: '#C2410C', fontSize: '0.7rem', fontWeight: 600 }}>
                    {t.format === 'mcq' ? 'Çoktan Seçmeli' : t.format === 'likert' ? 'Likert' : t.format === 'forced_choice' ? 'Zorunlu Tercih' : t.format === 'ranking' ? 'Sıralama' : t.format === 'interactive' ? 'İnteraktif' : t.format}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TEST DETAY SAYFASI — Boyut tablosu + Superadmin soru listesi
// ═══════════════════════════════════════════════════════════════
function TestDetailView({ test, onBack, userRole }) {
  const isSuperAdmin = userRole === 'superadmin';
  const groupMeta = TEST_GROUPS[test.group] || {};

  // Get bank data
  const bank = psikometrikTestBanks[test.id] || pozisyonTestBanks[test.id] ||
    (test.id === 'kisilik_big5' ? { dimensions: personalityBank, format: 'personality' } : null);

  // Build dimension table
  const dimTable = useMemo(() => {
    if (!bank) return [];

    if (bank.dimensions) {
      return Object.entries(bank.dimensions).map(([key, dim]) => ({
        key,
        label: dim.label || key,
        description: dim.description || '',
        itemCount: dim.items ? dim.items.length : 0,
        items: dim.items || [],
      }));
    }

    if (bank.roles) {
      return Object.entries(bank.roles).map(([key, role]) => ({
        key,
        label: role.label || key,
        description: role.description || '',
        icon: role.icon || '',
        itemCount: 0, items: [],
      }));
    }

    if (bank.styles) {
      return Object.entries(bank.styles).map(([key, style]) => ({
        key,
        label: style.label || key,
        description: style.description || '',
        icon: style.icon || '',
        itemCount: 0, items: [],
      }));
    }

    return [];
  }, [bank, test.id]);

  // Get questions for superadmin
  const questions = useMemo(() => {
    if (!isSuperAdmin || !bank) return [];
    if (bank.questions) return bank.questions;
    if (bank.scenarios) return bank.scenarios;
    // Flatten likert items
    if (bank.dimensions) {
      const all = [];
      Object.entries(bank.dimensions).forEach(([, dim]) => {
        if (dim.items) all.push(...dim.items.map(it => ({ ...it, dimension: dim.label })));
      });
      return all;
    }
    return [];
  }, [bank, isSuperAdmin]);

  const totalDimQuestions = dimTable.reduce((s, d) => s + d.itemCount, 0);

  return (
    <div className="fade-in">
      <button className="ct-btn ghost" style={{ marginBottom: '1.5rem' }} onClick={onBack}>← Kataloğa Dön</button>

      {/* Header */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem', borderTop: `4px solid ${groupMeta.color || '#6366F1'}`, background: 'linear-gradient(135deg, #FAFBFF, #F5F3FF)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '3rem' }}>{test.icon}</span>
          <div>
            <h2 style={{ margin: 0 }}>{test.title}</h2>
            {test.subtitle && <div style={{ fontSize: '0.9rem', color: '#94A3B8', marginTop: 2 }}>{test.subtitle}</div>}
          </div>
        </div>
        <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.25rem' }}>{test.description}</p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { icon: '📝', label: 'Soru Sayısı', value: test.questionCount },
            { icon: '⏱', label: 'Tahmini Süre', value: `${test.estimatedMinutes || 5} dk` },
            { icon: '📊', label: 'Format', value: test.format === 'mcq' ? 'Çoktan Seçmeli' : test.format === 'likert' ? 'Likert' : test.format === 'forced_choice' ? 'Zorunlu Tercih' : test.format === 'ranking' ? 'Sıralama' : test.format },
            { icon: '🎯', label: 'Güvenirlik', value: test.reliability ? `α = ${test.reliability}` : '—' },
            { icon: '🔄', label: 'Ters Madde', value: test.hasReverseItems ? 'Var' : 'Yok' },
          ].map(chip => (
            <div key={chip.label} style={{ padding: '0.5rem 0.9rem', background: 'white', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: '0.8rem' }}>
              <span style={{ marginRight: 4 }}>{chip.icon}</span>
              <span style={{ color: '#94A3B8' }}>{chip.label}: </span>
              <strong>{chip.value}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Boyut Tablosu */}
      {dimTable.length > 0 && (
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>📐 Boyut Yapısı ({dimTable.length} boyut{totalDimQuestions > 0 ? `, ${totalDimQuestions} madde` : ''})</h4>
          <table className="kobi-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Boyut</th>
                <th>Açıklama</th>
                <th style={{ textAlign: 'center' }}>Madde Sayısı</th>
              </tr>
            </thead>
            <tbody>
              {dimTable.map((d, i) => (
                <tr key={d.key}>
                  <td style={{ width: 40, textAlign: 'center', fontWeight: 700, color: getDimensionColor(i) }}>{i + 1}</td>
                  <td>
                    <strong>{d.icon && <span style={{ marginRight: 4 }}>{d.icon}</span>}{d.label}</strong>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: '#64748B' }}>{d.description}</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>{d.itemCount || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Superadmin: Soru Listesi */}
      {isSuperAdmin && questions.length > 0 && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>🔐 Soru Bankası (Superadmin)</h4>
          <div style={{ maxHeight: 500, overflowY: 'auto' }}>
            {questions.map((q, i) => (
              <div key={q.id} style={{ padding: '0.75rem', borderBottom: '1px solid #F1F5F9', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#94A3B8', fontWeight: 700, minWidth: 28 }}>{i + 1}.</span>
                  <div style={{ flex: 1 }}>
                    {/* MCQ */}
                    {q.q && <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{q.q}</div>}
                    {q.o && <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                      {q.o.map((opt, j) => (
                        <span key={j} style={{ marginRight: 8, color: j === q.a ? '#16A34A' : '#94A3B8', fontWeight: j === q.a ? 700 : 400 }}>
                          {String.fromCharCode(65 + j)}) {opt} {j === q.a ? '✓' : ''}
                        </span>
                      ))}
                    </div>}
                    {/* Likert */}
                    {q.text && <div style={{ fontWeight: 500 }}>{q.text} {q.reverse ? <span style={{ color: '#DC2626', fontSize: '0.7rem' }}>(R)</span> : ''}</div>}
                    {/* Scenario */}
                    {q.situation && <div style={{ fontWeight: 500 }}>{q.situation}</div>}
                    {q.prompt && !q.situation && <div style={{ fontWeight: 500 }}>{q.prompt}</div>}
                    {q.options && !q.o && <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: 4 }}>
                      {q.options.map((opt, j) => (
                        <span key={j} style={{ marginRight: 8 }}>{opt.text || opt.label}</span>
                      ))}
                    </div>}
                    {/* Metadata */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 4 }}>
                      {q.d && <span style={{ padding: '0.1rem 0.4rem', borderRadius: 4, fontSize: '0.65rem', fontWeight: 700,
                        background: q.d === 'kolay' ? '#DCFCE7' : q.d === 'orta' ? '#FEF9C3' : '#FEE2E2',
                        color: q.d === 'kolay' ? '#166534' : q.d === 'orta' ? '#854D0E' : '#991B1B' }}>{q.d}</span>}
                      {q.dimension && <span style={{ padding: '0.1rem 0.4rem', borderRadius: 4, fontSize: '0.65rem', fontWeight: 600, background: '#EEF2FF', color: '#4F46E5' }}>{q.dimension}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
