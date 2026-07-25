import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { getTestById } from '../data/testCatalog';
import { psikometrikTestBanks } from '../data/psikometrikTestBank';
import { pozisyonTestBanks } from '../data/pozisyonTestBank';
import { questionBank } from '../data/testQuestionBank';
import { attentionTests, visualTests } from '../data/interactiveTests';
import { personalityBank, likertScale } from '../data/personalityBank';
import {
  createSecurityLog, addSecurityEvent, calculateRiskLevel,
  setupTabDetection, setupFullscreenDetection, setupCopyPrevention,
  requestFullscreen, initCamera, captureSnapshot, setupRandomSnapshots,
  stopCamera, getDeviceFingerprint, formatTimeRemaining,
  SECURITY_LEVELS,
} from '../utils/examSecurity';
import { scoreAllTests } from '../utils/examScoring';
import './CandidateExamView.css';

// ═══════════════════════════════════════════════════════════════
// ADAY SINAV SAYFASI
// Tam ekran, güvenli, KVKK uyumlu sınav ortamı
// ═══════════════════════════════════════════════════════════════

export default function CandidateExamView({ assignment, onComplete, onCancel }) {
  const [phase, setPhase] = useState('consent'); // consent → exam → complete | expired
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(assignment?.testDuration * 60 || 2700);
  const [consentChecked, setConsentChecked] = useState(false);
  const [securityLog] = useState(() => createSecurityLog());
  const [warnings, setWarnings] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const cleanupRefs = useRef([]);

  const secLevel = SECURITY_LEVELS[assignment?.securityLevel || 'standard'];
  const hasCamera = secLevel.features.includes('camera_verification');

  // Build question list from assignment's selected tests
  const examQuestions = useMemo(() => {
    if (!assignment?.selectedTests) return [];
    const questions = [];

    for (const testId of assignment.selectedTests) {
      const testMeta = getTestById(testId);
      if (!testMeta) continue;

      let bank = null;

      // Check all question banks
      if (psikometrikTestBanks[testId]) bank = psikometrikTestBanks[testId];
      else if (pozisyonTestBanks[testId]) bank = pozisyonTestBanks[testId];
      else if (testId === 'kisilik_big5') bank = { id: 'kisilik_big5', format: 'personality_likert' };
      else if (questionBank.TEMEL_YETENEK && questionBank.TEMEL_YETENEK[testId]) {
        const qData = questionBank.TEMEL_YETENEK[testId];
        bank = { id: testId, format: 'mcq', questions: [...(qData.kolay || []), ...(qData.orta || []), ...(qData.zor || [])], instruction: qData.description };
      } else if (attentionTests[testId.replace('dikkat_', '')]) {
        bank = attentionTests[testId.replace('dikkat_', '')];
        bank.format = 'interactive';
      } else if (visualTests[testId.replace('gorsel_', '')]) {
        bank = visualTests[testId.replace('gorsel_', '')];
        bank.format = 'interactive';
      }

      if (!bank) {
        console.warn(`Test data not found for: ${testId}`);
        continue;
      }

      // Format-specific question building
      if (bank.dimensions && (bank.scale || bank.format === 'likert')) {
        // Likert-type test
        const items = Object.entries(bank.dimensions).flatMap(([dimKey, dim]) =>
          dim.items.map(item => ({
            ...item,
            testId,
            testTitle: testMeta.title,
            testIcon: testMeta.icon,
            type: 'likert',
            scale: bank.scale,
            dimKey,
            dimLabel: dim.label,
          }))
        );
        // Shuffle items
        const shuffled = [...items].sort(() => Math.random() - 0.5);
        questions.push({
          testId,
          testTitle: testMeta.title,
          testIcon: testMeta.icon,
          type: 'likert_batch',
          items: shuffled,
          scale: bank.scale,
          instruction: bank.instruction,
        });
      } else if (bank.scenarios && bank.format === 'forced_choice') {
        // Forced choice (team roles, etc.)
        questions.push({
          testId,
          testTitle: testMeta.title,
          testIcon: testMeta.icon,
          type: 'forced_choice',
          scenarios: bank.scenarios,
          instruction: bank.instruction,
        });
      } else if (bank.scenarios && bank.format === 'ranking') {
        // Ranking (work values, etc.)
        questions.push({
          testId,
          testTitle: testMeta.title,
          testIcon: testMeta.icon,
          type: 'ranking',
          scenarios: bank.scenarios,
          instruction: bank.instruction,
        });
      } else if (bank.scenarios && bank.format === 'scenario_choice') {
        // Scenario choice (learning style, etc.)
        questions.push({
          testId,
          testTitle: testMeta.title,
          testIcon: testMeta.icon,
          type: 'scenario_choice',
          scenarios: bank.scenarios,
          instruction: bank.instruction,
        });
      } else if (bank.questions || bank.format === 'mcq') {
        // MCQ test — shuffle questions
        const qList = bank.questions || [];
        const shuffledQ = [...qList].sort(() => Math.random() - 0.5);
        questions.push({
          testId,
          testTitle: testMeta.title,
          testIcon: testMeta.icon,
          type: 'mcq',
          questions: shuffledQ.map(q => ({
            ...q,
            testId,
            // Shuffle options and adjust answer index
            ...shuffleOptions(q),
          })),
          instruction: bank.instruction,
        });
      } else if (bank.format === 'personality_likert') {
        // Existing personality bank
        const items = Object.entries(personalityBank).flatMap(([dimKey, dim]) =>
          dim.items.map(item => ({
            ...item,
            testId,
            testTitle: 'Kişilik Envanteri',
            testIcon: '🎭',
            type: 'likert',
            scale: likertScale,
            dimKey,
            dimLabel: dim.label,
          }))
        );
        questions.push({
          testId,
          testTitle: 'Kişilik Envanteri (Big Five)',
          testIcon: '🎭',
          type: 'likert_batch',
          items: items.sort(() => Math.random() - 0.5),
          scale: likertScale,
          instruction: 'Her ifade için size en uygun seçeneği işaretleyin.',
        });
      } else if (bank.format === 'interactive') {
        // Interactive tests (Attention/Visual)
        questions.push({
          testId,
          testTitle: testMeta.title,
          testIcon: testMeta.icon,
          type: 'interactive',
          config: bank.config,
          instruction: bank.config.instruction,
        });
      }
    }
    return questions;
  }, [assignment?.selectedTests, shuffleOptions]);

  // Timer
  useEffect(() => {
    if ((phase !== 'exam' && phase !== 'test_transition') || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  // Start exam
  const handleStartExam = useCallback(async () => {
    securityLog.startTime = new Date().toISOString();
    securityLog.deviceInfo = getDeviceFingerprint();
    addSecurityEvent(securityLog, 'exam_started');

    // Setup security measures
    const c1 = setupTabDetection(securityLog, (dir, count) => {
      if (dir === 'away' || dir === 'blur') {
        setWarnings(prev => [...prev, `Sekme değiştirme algılandı (${count}. kez)`]);
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
      }
    });
    cleanupRefs.current.push(c1);

    const c2 = setupCopyPrevention(securityLog);
    cleanupRefs.current.push(c2);

    // Try fullscreen
    try {
      await requestFullscreen();
      const c3 = setupFullscreenDetection(securityLog, (count) => {
        setWarnings(prev => [...prev, `Tam ekran çıkışı algılandı (${count}. kez)`]);
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
      });
      cleanupRefs.current.push(c3);
    } catch (e) {
      // Fullscreen not available
    }

    // Camera
    if (hasCamera && videoRef.current) {
      const stream = await initCamera(videoRef.current);
      streamRef.current = stream;
      if (stream) {
        const snap = captureSnapshot(videoRef.current);
        if (snap) {
          securityLog.cameraSnapshots.push(snap);
          addSecurityEvent(securityLog, 'initial_snapshot');
        }
        if (secLevel.features.includes('random_snapshot')) {
          const c4 = setupRandomSnapshots(videoRef.current, securityLog);
          cleanupRefs.current.push(c4);
        }
      }
    }

    setPhase('exam');
  }, [securityLog, secLevel, hasCamera]);

  // Submit
  const handleSubmit = useCallback(() => {
    securityLog.endTime = new Date().toISOString();
    addSecurityEvent(securityLog, 'exam_completed');

    // Final camera snapshot
    if (hasCamera && videoRef.current) {
      const snap = captureSnapshot(videoRef.current);
      if (snap) securityLog.cameraSnapshots.push(snap);
    }

    // Cleanup
    cleanupRefs.current.forEach(fn => fn && fn());
    if (streamRef.current) stopCamera(streamRef.current);

    const riskLevel = calculateRiskLevel(securityLog);

    // Score all tests
    const testScores = scoreAllTests(answers, assignment?.selectedTests || []);

    const result = {
      assignmentId: assignment?.id,
      candidateName: assignment?.candidateName,
      candidateEmail: assignment?.candidateEmail,
      answers: { ...answers },
      securityLog: { ...securityLog },
      riskLevel,
      testScores,
      completedAt: new Date().toISOString(),
      timeSpent: assignment.testDuration * 60 - timeLeft,
    };

    setPhase('complete');
    if (onComplete) onComplete(result);
  }, [answers, securityLog, assignment, timeLeft, hasCamera, onComplete]);

  // Answer handler
  const handleAnswer = useCallback((qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  }, []);

  // Timer style
  const timerClass = timeLeft > 300 ? 'normal' : timeLeft > 60 ? 'warning' : 'danger';

  // ─── Scroll to top when test changes ──────────────────
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const wrapper = document.querySelector('.exam-wrapper');
    if (wrapper) wrapper.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentQ, phase]);

  // Check deadline
  if (assignment?.deadline) {
    const dl = new Date(assignment.deadline);
    if (dl < new Date() && phase === 'consent') {
      return (
        <div className="exam-wrapper">
          <div className="exam-card intro exam-expired exam-fade-in">
            <div className="exam-expired-icon">⏰</div>
            <h1>Süre Doldu</h1>
            <p className="exam-subtitle">Bu test için belirlenen son tarih geçmiştir. Lütfen İK departmanıyla iletişime geçin.</p>
          </div>
        </div>
      );
    }
  }

  // ─── CONSENT / KVKK ───────────────────────────────────
  if (phase === 'consent') {
    return (
      <div className="exam-wrapper">
        <div className="exam-card exam-consent exam-fade-in">
          <div className="exam-consent-header">
            <div className="shield-icon">🛡️</div>
            <h1>Aday Değerlendirme Sınavı</h1>
            <p className="exam-subtitle">
              <strong>{assignment?.candidateName}</strong> için hazırlanmış {assignment?.selectedTests?.length || 0} test içeren değerlendirme
            </p>
          </div>

          <div className="exam-info-chips">
            <div className="exam-info-chip"><span className="chip-icon">📝</span>{assignment?.selectedTests?.length || 0} Test</div>
            <div className="exam-info-chip"><span className="chip-icon">⏱</span>{assignment?.testDuration || 45} Dakika</div>
            <div className="exam-info-chip"><span className="chip-icon">{secLevel.icon}</span>{secLevel.label} Güvenlik</div>
            {hasCamera && <div className="exam-info-chip"><span className="chip-icon">📷</span>Kamera Açık</div>}
          </div>

          <div className="exam-consent-body">
            <h4>📋 Sınav Kuralları</h4>
            <ul>
              <li>Test süreniz <strong>{assignment?.testDuration || 45} dakika</strong> olarak belirlenmiştir.</li>
              <li>Teste başladıktan sonra süre geri sayımı başlayacaktır.</li>
              <li>Doğru ya da yanlış cevap olmayan bölümlerde en doğal tepkinizi seçin.</li>
            </ul>

            <h4>🔒 Güvenlik Önlemleri</h4>
            <ul>
              <li>Test sırasında <strong>sekme değiştirme</strong> ve <strong>pencere değiştirme</strong> tespit edilecektir.</li>
              <li>Test <strong>tam ekran modunda</strong> uygulanacaktır.</li>
              <li>Kopyalama, yapıştırma ve sağ-tıklama işlemleri engellenecektir.</li>
              {hasCamera && <li>Kamera izni vermeniz ve test boyunca <strong>kameranızın açık</strong> kalması gerekmektedir.</li>}
              {secLevel.features.includes('random_snapshot') && (
                <li>Test sırasında <strong>rastgele anlık görüntüler</strong> alınacaktır.</li>
              )}
            </ul>

            <h4>📜 KVKK Aydınlatma Metni</h4>
            <p>
              Test sürecinde toplanan kişisel verileriniz (ad-soyad, e-posta, test yanıtları
              {hasCamera && ', kamera görüntüleri'}) 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında, 
              yalnızca işe alım değerlendirmesi amacıyla işlenecektir. Verileriniz değerlendirme 
              sürecinin tamamlanmasından itibaren 6 ay içinde silinecektir.
            </p>
          </div>

          <div
            className={`exam-consent-check ${consentChecked ? 'checked' : ''}`}
            onClick={() => setConsentChecked(!consentChecked)}
          >
            <input type="checkbox" checked={consentChecked} onChange={() => {}} />
            <label>
              Yukarıdaki kuralları ve KVKK aydınlatma metnini okudum, anladım ve kişisel verilerimin işlenmesini kabul ediyorum.
            </label>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="exam-btn primary" disabled={!consentChecked} onClick={handleStartExam}>
              Sınava Başla →
            </button>
            {onCancel && <button className="exam-btn ghost" onClick={onCancel}>İptal</button>}
          </div>
        </div>

        {/* Hidden video element for camera */}
        {hasCamera && (
          <video ref={videoRef} style={{ display: 'none' }} muted playsInline />
        )}
      </div>
    );
  }

  // ─── INTER-TEST TRANSITION PHASE ────────────────────────
  if (phase === 'test_transition') {
    const totalTests = examQuestions.length;
    const nextIdx = currentQ + 1;
    const completedTests = examQuestions.slice(0, nextIdx);
    const nextTest = examQuestions[nextIdx];

    return (
      <div className="exam-wrapper">
        <div className="exam-card intro exam-fade-in" style={{ maxWidth: 600, textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ marginBottom: '0.5rem' }}>Test Tamamlandı!</h2>
          <p style={{ color: '#64748B', marginBottom: '2rem' }}>
            <strong>{examQuestions[currentQ]?.testTitle}</strong> testini başarıyla bitirdiniz.
          </p>

          {/* Progress bar */}
          <div style={{ margin: '0 auto 2rem', maxWidth: 400 }}>
            <div className="exam-progress-bar" style={{ height: 12, borderRadius: 6 }}>
              <div className="exam-progress-fill" style={{ width: `${Math.round(((nextIdx) / totalTests) * 100)}%`, borderRadius: 6 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.85rem', color: '#64748B' }}>
              <span>{nextIdx} / {totalTests} test tamamlandı</span>
              <span>%{Math.round(((nextIdx) / totalTests) * 100)}</span>
            </div>
          </div>

          {/* Completed tests checklist */}
          <div style={{ textAlign: 'left', margin: '0 auto 2rem', maxWidth: 360, padding: '1rem', background: '#F8FAFC', borderRadius: 12 }}>
            {examQuestions.map((q, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.5rem 0', borderBottom: i < totalTests - 1 ? '1px solid #E2E8F0' : 'none',
                opacity: i <= currentQ ? 1 : 0.5,
              }}>
                <span style={{
                  width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700,
                  background: i < nextIdx ? '#DCFCE7' : i === nextIdx ? '#EEF2FF' : '#F1F5F9',
                  color: i < nextIdx ? '#16A34A' : i === nextIdx ? '#4F46E5' : '#94A3B8',
                }}>
                  {i < nextIdx ? '✓' : i + 1}
                </span>
                <span style={{ flex: 1, fontSize: '0.9rem', fontWeight: i === nextIdx ? 600 : 400, color: i < nextIdx ? '#16A34A' : '#334155' }}>
                  {q.testIcon} {q.testTitle}
                </span>
                {i < nextIdx && <span style={{ fontSize: '0.75rem', color: '#16A34A' }}>Tamamlandı</span>}
                {i === nextIdx && <span style={{ fontSize: '0.75rem', color: '#4F46E5', fontWeight: 600 }}>Sıradaki</span>}
              </div>
            ))}
          </div>

          {/* Timer remaining */}
          <div style={{ marginBottom: '2rem', padding: '0.75rem', background: '#FEF9C3', borderRadius: 8, fontSize: '0.85rem', color: '#854D0E' }}>
            ⏱ Kalan toplam süre: <strong>{formatTimeRemaining(timeLeft)}</strong>
          </div>

          {/* Next test button */}
          {nextTest ? (
            <button
              className="exam-btn primary"
              style={{ fontSize: '1.1rem', padding: '1rem 3rem', borderRadius: 12, width: '100%', maxWidth: 360 }}
              onClick={() => {
                setCurrentQ(nextIdx);
                setPhase('exam');
              }}
            >
              {nextTest.testIcon} Sonraki Teste Geç →
            </button>
          ) : (
            <button
              className="exam-btn success"
              style={{ fontSize: '1.1rem', padding: '1rem 3rem', borderRadius: 12, width: '100%', maxWidth: 360 }}
              onClick={handleSubmit}
            >
              ✅ Tüm Testler Tamamlandı — Sınavı Bitir
            </button>
          )}

          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#94A3B8' }}>
            {nextTest ? `Sonraki: ${nextTest.testTitle} (${nextTest.items?.length || nextTest.questions?.length || nextTest.scenarios?.length || '?'} soru)` : 'Tüm testler tamamlanmıştır.'}
          </p>
        </div>
      </div>
    );
  }

  // ─── EXAM PHASE ───────────────────────────────────────
  if (phase === 'exam') {
    if (examQuestions.length === 0) {
      return (
        <div className="exam-wrapper">
          <div className="exam-card intro">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h1>Yükleme Hatası</h1>
            <p className="exam-subtitle">Seçilen testlerin içerikleri yüklenemedi. Lütfen yöneticiyle iletişime geçin.</p>
            {onCancel && <button className="exam-btn primary" onClick={onCancel}>Geri Dön</button>}
          </div>
        </div>
      );
    }

    const currentTest = examQuestions[currentQ];
    if (!currentTest) {
      handleSubmit();
      return null;
    }

    const totalTests = examQuestions.length;

    // Calculate answered count for current test
    const getAnsweredForTest = (test) => {
      if (test.type === 'likert_batch') return test.items.filter(it => answers[it.id] !== undefined).length;
      if (test.type === 'mcq') return test.questions.filter(q => answers[q.id] !== undefined).length;
      if (test.type === 'forced_choice' || test.type === 'ranking' || test.type === 'scenario_choice')
        return test.scenarios.filter(s => answers[s.id] !== undefined).length;
      if (test.type === 'interactive') return answers[test.testId] ? 1 : 0;
      return 0;
    };
    const getTotalForTest = (test) => {
      if (test.type === 'likert_batch') return test.items.length;
      if (test.type === 'mcq') return test.questions.length;
      if (test.type === 'forced_choice' || test.type === 'ranking' || test.type === 'scenario_choice')
        return test.scenarios.length;
      if (test.type === 'interactive') return 1;
      return 0;
    };

    const currentAnswered = getAnsweredForTest(currentTest);
    const currentTotal = getTotalForTest(currentTest);

    // Handler for finishing/navigating tests
    const handleNextTest = () => {
      if (currentQ < totalTests - 1) {
        setPhase('test_transition');
      } else {
        handleSubmit();
      }
    };

    return (
      <div className="exam-wrapper">
        {showWarning && (
          <div className="exam-security-warning">
            ⚠️ Güvenlik: Sekme değiştirme veya tam ekran çıkışı algılandı. Bu hareket kayıt altına alınmıştır.
          </div>
        )}

        <div className="exam-card wide exam-fade-in">
          {/* Top bar */}
          <div className="exam-topbar">
            <div className="exam-test-title">
              <div className="test-icon" style={{ background: '#EEF2FF' }}>{currentTest.testIcon}</div>
              <div>
                <h3>{currentTest.testTitle}</h3>
                <div className="test-sub">Test {currentQ + 1} / {totalTests} · {currentAnswered}/{currentTotal} cevaplandı</div>
              </div>
            </div>
            <div className={`exam-timer ${timerClass}`}>
              ⏱ {formatTimeRemaining(timeLeft)}
            </div>
          </div>

          {/* Multi-test progress strip */}
          {totalTests > 1 && (
            <div style={{ display: 'flex', gap: '0.4rem', margin: '0 0 1.5rem', padding: '0.6rem', background: '#F1F5F9', borderRadius: 12 }}>
              {examQuestions.map((q, i) => {
                const isCurrent = i === currentQ;
                const isDone = i < currentQ;
                return (
                  <div key={i} style={{
                    flex: 1, height: 6, borderRadius: 3,
                    background: isCurrent ? '#6366F1' : isDone ? '#10B981' : '#CBD5E1',
                    transition: 'all 0.3s'
                  }} title={q.testTitle} />
                );
              })}
            </div>
          )}

          <div className="exam-body" style={{ minHeight: '400px' }}>
            {currentTest.instruction && (
              <p style={{ color: '#64748B', marginBottom: '1.5rem', fontSize: '0.9rem', fontStyle: 'italic' }}>
                {currentTest.instruction}
              </p>
            )}

            {currentTest.type === 'mcq' && (
              <MCQSection
                questions={currentTest.questions}
                answers={answers}
                onAnswer={handleAnswer}
              />
            )}

            {currentTest.type === 'likert_batch' && (
              <LikertBatchSection
                items={currentTest.items}
                scale={currentTest.scale}
                answers={answers}
                onAnswer={handleAnswer}
              />
            )}

            {currentTest.type === 'forced_choice' && (
              <ForcedChoiceSection
                scenarios={currentTest.scenarios}
                answers={answers}
                onAnswer={handleAnswer}
              />
            )}

            {currentTest.type === 'ranking' && (
              <RankingSection
                scenarios={currentTest.scenarios}
                answers={answers}
                onAnswer={handleAnswer}
              />
            )}

            {currentTest.type === 'scenario_choice' && (
              <ScenarioChoiceSection
                scenarios={currentTest.scenarios}
                answers={answers}
                onAnswer={handleAnswer}
              />
            )}

            {currentTest.type === 'interactive' && (
              <InteractiveSection
                testId={currentTest.testId}
                config={currentTest.config}
                onFinish={(result) => handleAnswer(currentTest.testId, result)}
                savedResult={answers[currentTest.testId]}
              />
            )}
          </div>

          {/* Sticky Bottom Nav */}
          <div className="exam-nav" style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingTop: '1.5rem', marginTop: '2rem', borderTop: '1px solid #E2E8F0'
          }}>
            <div style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
              {currentAnswered} / {currentTotal} yanıtlandı
            </div>
            
            <button
              className={`exam-btn ${currentQ < totalTests - 1 ? 'primary' : 'success'}`}
              style={{ padding: '0.75rem 2rem', minWidth: 200 }}
              onClick={handleNextTest}
              disabled={currentAnswered < currentTotal * 0.5 && currentTest.type !== 'interactive'} // Allow skip/next if half answered
            >
              {currentQ < totalTests - 1
                ? `Testi Bitir & Sonraki Teste Geç →`
                : '✅ Sınavı Tamamla'
              }
            </button>
          </div>
        </div>

        {/* Camera preview */}
        {hasCamera && (
          <div className="exam-camera-preview">
            <video ref={videoRef} muted playsInline autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
            <div className="cam-indicator" />
          </div>
        )}
      </div>
    );
  }

  // ─── COMPLETE ─────────────────────────────────────────
  if (phase === 'complete') {
    const totalTime = assignment.testDuration * 60 - timeLeft;
    return (
      <div className="exam-wrapper">
        <div className="exam-card intro exam-complete exam-fade-in">
          <div className="exam-complete-icon">✅</div>
          <h1>Sınav Tamamlandı!</h1>
          <p>Yanıtlarınız başarıyla kaydedildi. Değerlendirme sonuçları ilgili birim tarafından incelenecektir.</p>
          <div className="exam-complete-info">
            <div className="exam-complete-info-row">
              <span className="label">Aday</span>
              <span className="value">{assignment?.candidateName}</span>
            </div>
            <div className="exam-complete-info-row">
              <span className="label">Tamamlanan Test</span>
              <span className="value">{examQuestions.length} test</span>
            </div>
            <div className="exam-complete-info-row">
              <span className="label">Harcanan Süre</span>
              <span className="value">{Math.floor(totalTime / 60)} dk {totalTime % 60} sn</span>
            </div>
            <div className="exam-complete-info-row">
              <span className="label">Tamamlanma</span>
              <span className="value">{new Date().toLocaleString('tr-TR')}</span>
            </div>
          </div>
          <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#94A3B8' }}>
            Bu sayfayı güvenle kapatabilirsiniz.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

// ─── MCQ Section ─────────────────────────────────────────
function MCQSection({ questions, answers, onAnswer }) {
  const [idx, setIdx] = useState(0);
  const q = questions[idx];
  if (!q) return null;

  const diffLabels = { kolay: 'Kolay', orta: 'Orta', zor: 'Zor' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Soru {idx + 1} / {questions.length}</span>
        {q.d && <span className={`exam-q-badge ${q.d}`}>{diffLabels[q.d] || q.d}</span>}
      </div>

      <div className="exam-question-card" key={q.id}>
        <div className="exam-q-text">{q.q}</div>
        <div className="exam-options">
          {q.o.map((opt, i) => (
            <button
              key={i}
              className={`exam-option ${answers[q.id] === i ? 'selected' : ''}`}
              onClick={() => onAnswer(q.id, i)}
            >
              <span className="exam-opt-letter">{String.fromCharCode(65 + i)}</span>
              <span>{opt}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <button className="exam-btn ghost" disabled={idx === 0} onClick={() => setIdx(i => i - 1)}>← Önceki</button>
        <span style={{ fontSize: '0.8rem', color: '#94A3B8', alignSelf: 'center' }}>
          {questions.filter(qq => answers[qq.id] !== undefined).length} / {questions.length} cevaplanmış
        </span>
        <button className="exam-btn primary" disabled={idx === questions.length - 1} onClick={() => setIdx(i => i + 1)}>Sonraki →</button>
      </div>
    </div>
  );
}

// ─── Likert Batch ────────────────────────────────────────
function LikertBatchSection({ items, scale, answers, onAnswer }) {
  const scaleToUse = scale || [
    { value: 1, label: 'Kesinlikle Katılmıyorum' },
    { value: 2, label: 'Katılmıyorum' },
    { value: 3, label: 'Kararsızım' },
    { value: 4, label: 'Katılıyorum' },
    { value: 5, label: 'Kesinlikle Katılıyorum' },
  ];

  const answeredCount = items.filter(it => answers[it.id] !== undefined).length;

  return (
    <div>
      <div style={{ marginBottom: '1rem', fontSize: '0.8rem', color: '#94A3B8' }}>
        {answeredCount} / {items.length} ifade cevaplanmış
      </div>
      <div className="exam-likert-list" style={{ maxHeight: '480px', overflowY: 'auto', paddingRight: '0.5rem' }}>
        {items.map((item, i) => (
          <div key={item.id} className={`exam-likert-item ${answers[item.id] !== undefined ? 'answered' : ''}`}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, minWidth: 24, marginTop: 2 }}>{i + 1}.</span>
              <div style={{ flex: 1 }}>
                <div className="exam-likert-text">{item.text}</div>
                <div className="exam-likert-scale">
                  {scaleToUse.map(s => (
                    <button
                      key={s.value}
                      className={`exam-likert-btn ${answers[item.id] === s.value ? 'selected' : ''}`}
                      onClick={() => onAnswer(item.id, s.value)}
                      title={s.label}
                    >
                      {s.value}
                    </button>
                  ))}
                </div>
                <div className="exam-likert-labels">
                  <span>{scaleToUse[0].label}</span>
                  <span>{scaleToUse[scaleToUse.length - 1].label}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Forced Choice (Team Roles) ──────────────────────────
function ForcedChoiceSection({ scenarios, answers, onAnswer }) {
  const [idx, setIdx] = useState(0);
  const s = scenarios[idx];
  if (!s) return null;

  return (
    <div>
      <div style={{ marginBottom: '0.5rem', fontSize: '0.8rem', color: '#94A3B8' }}>
        Durum {idx + 1} / {scenarios.length}
      </div>
      <div className="exam-scenario-card" key={s.id}>
        <div className="exam-scenario-situation">{s.situation}</div>
        <div className="exam-scenario-options">
          {s.options.map((opt, i) => (
            <button
              key={i}
              className={`exam-scenario-opt ${answers[s.id] === i ? 'selected' : ''}`}
              onClick={() => onAnswer(s.id, i)}
            >
              <div className="opt-radio" />
              <span>{opt.text}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <button className="exam-btn ghost" disabled={idx === 0} onClick={() => setIdx(i => i - 1)}>←</button>
        <button className="exam-btn primary" disabled={idx === scenarios.length - 1} onClick={() => setIdx(i => i + 1)}>→</button>
      </div>
    </div>
  );
}

// ─── Ranking ─────────────────────────────────────────────
function RankingSection({ scenarios, answers, onAnswer }) {
  const [idx, setIdx] = useState(0);
  const s = scenarios[idx];
  if (!s) return null;

  const currentOrder = answers[s.id] || s.options.map((_, i) => i);

  const moveItem = (from, direction) => {
    const to = from + direction;
    if (to < 0 || to >= currentOrder.length) return;
    const newOrder = [...currentOrder];
    [newOrder[from], newOrder[to]] = [newOrder[to], newOrder[from]];
    onAnswer(s.id, newOrder);
  };

  return (
    <div>
      <div style={{ marginBottom: '0.5rem', fontSize: '0.8rem', color: '#94A3B8' }}>
        Sıralama {idx + 1} / {scenarios.length}
      </div>
      <div className="exam-scenario-card" key={s.id}>
        <div className="exam-ranking-prompt">{s.prompt}</div>
        <div className="exam-ranking-list">
          {currentOrder.map((optIdx, rank) => (
            <div key={optIdx} className="exam-ranking-item">
              <div className="exam-ranking-num">{rank + 1}</div>
              <span style={{ flex: 1, fontSize: '0.9rem', color: '#334155' }}>{s.options[optIdx].text}</span>
              <div className="exam-ranking-arrows">
                <button onClick={() => moveItem(rank, -1)} disabled={rank === 0}>▲</button>
                <button onClick={() => moveItem(rank, 1)} disabled={rank === currentOrder.length - 1}>▼</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <button className="exam-btn ghost" disabled={idx === 0} onClick={() => setIdx(i => i - 1)}>←</button>
        <button className="exam-btn primary" disabled={idx === scenarios.length - 1} onClick={() => setIdx(i => i + 1)}>→</button>
      </div>
    </div>
  );
}

// ─── Scenario Choice (Learning Style) ────────────────────
function ScenarioChoiceSection({ scenarios, answers, onAnswer }) {
  const [idx, setIdx] = useState(0);
  const s = scenarios[idx];
  if (!s) return null;

  return (
    <div>
      <div style={{ marginBottom: '0.5rem', fontSize: '0.8rem', color: '#94A3B8' }}>
        Senaryo {idx + 1} / {scenarios.length}
      </div>
      <div className="exam-scenario-card" key={s.id}>
        <div className="exam-scenario-situation">{s.situation || s.prompt}</div>
        <div className="exam-scenario-options">
          {s.options.map((opt, i) => (
            <button
              key={i}
              className={`exam-scenario-opt ${answers[s.id] === i ? 'selected' : ''}`}
              onClick={() => onAnswer(s.id, i)}
            >
              <div className="opt-radio" />
              <span>{opt.text}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <button className="exam-btn ghost" disabled={idx === 0} onClick={() => setIdx(i => i - 1)}>←</button>
        <button className="exam-btn primary" disabled={idx === scenarios.length - 1} onClick={() => setIdx(i => i + 1)}>→</button>
      </div>
    </div>
  );
}

// ─── Interactive Section (Attention/Visual) ──────────────
function InteractiveSection({ testId, config, onFinish, savedResult }) {
  const [round, setRound] = useState(0); // 0 to 8
  const [phase, setPhase] = useState('intro'); // intro -> level_start -> play -> round_end -> finished
  const [roundResults, setRoundResults] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentStimulus, setCurrentStimulus] = useState(null);
  const [showTarget, setShowTarget] = useState(false);
  const [score, setScore] = useState(0);
  const [foundTargets, setFoundTargets] = useState([]);
  const [wrongClicks, setWrongClicks] = useState(0);

  const currentLevel = config.rounds[round] || config.rounds[0];
  const isLastRound = round === config.rounds.length - 1;

  // Global Timer
  useEffect(() => {
    let timer;
    if (phase === 'play' && showTarget && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (phase === 'play' && showTarget && timeLeft === 0) {
      handleAnswer(null, true); // Timeout
    }
    return () => clearInterval(timer);
  }, [phase, showTarget, timeLeft]);

  const [cptState, setCptState] = useState({ index: 0, activeEvent: null, hits: 0, misses: 0, falseAlarms: 0, rt: [], hasClicked: false });
  const [stroopState, setStroopState] = useState({ index: 0, activeEvent: null, isFixation: true, results: { neutral: [], congruent: [], incongruent: [] }, hasClicked: false });

  // Stroop Engine
  useEffect(() => {
    if (phase !== 'play' || testId.replace('dikkat_', '') !== 'stroop') return;
    if (!currentStimulus?.sequence || !showTarget) return;

    if (stroopState.index > 0 && stroopState.index >= currentStimulus.sequence.length) {
       endRound(true, (Date.now() - startTime) / 1000); 
       return;
    }

    if (stroopState.index >= currentStimulus.sequence.length) return;

    let fixTimer;
    let wordTimer;

    if (stroopState.isFixation) {
       fixTimer = setTimeout(() => {
          setStroopState(prev => ({ ...prev, isFixation: false, hasClicked: false, activeEvent: currentStimulus.sequence[prev.index] }));
          setStartTime(Date.now());
       }, 500);
    } else {
       wordTimer = setTimeout(() => {
          setStroopState(prev => {
             const missedType = prev.activeEvent.type;
             const newResults = { ...prev.results };
             newResults[missedType] = [...newResults[missedType], { rt: currentLevel.maxWaitMs || 4000, correct: false, isMiss: true }];
             return { ...prev, isFixation: true, activeEvent: null, index: prev.index + 1 };
          });
       }, currentLevel.maxWaitMs || 4000);
    }

    return () => { clearTimeout(fixTimer); clearTimeout(wordTimer); };
  }, [phase, showTarget, testId, currentStimulus, stroopState.index, stroopState.isFixation, currentLevel]);

  // CPT Runner
  useEffect(() => {
    if (phase !== 'play' || testId.replace('dikkat_', '') !== 'reaksiyon') return;
    if (!currentStimulus?.sequence || !showTarget) return;
    if (cptState.index >= currentStimulus.sequence.length) return;

    const currentItem = currentStimulus.sequence[cptState.index];
    const displayDur = currentLevel.displayDurationMs || 800;
    const intervalGap = (currentLevel.intervalMs || 1200) - displayDur;
    const gapStart = intervalGap * 0.5 + Math.random() * (intervalGap * 0.5);

    let showTimer;
    let hideTimer;

    showTimer = setTimeout(() => {
       setCptState(prev => ({ ...prev, activeEvent: currentItem, hasClicked: false }));
       setStartTime(Date.now());
       
       hideTimer = setTimeout(() => {
           setCptState(prev => {
              let newMisses = prev.misses;
              if (currentItem.isTarget && !prev.hasClicked) newMisses++;
              return { ...prev, activeEvent: null, misses: newMisses, index: prev.index + 1 };
           });
       }, displayDur);
    }, gapStart);

    return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
  }, [phase, showTarget, testId, currentStimulus, cptState.index, currentLevel]);

  const startLevel = () => {
    setPhase('play');
    setShowTarget(false);
    setFoundTargets([]);
    setWrongClicks(0);
    setCptState({ index: 0, activeEvent: null, hits: 0, misses: 0, falseAlarms: 0, rt: [], hasClicked: false });
    setStroopState({ index: 0, activeEvent: null, isFixation: true, results: { neutral: [], congruent: [], incongruent: [] }, hasClicked: false });
    setStartTime(Date.now());
    setTimeLeft(currentLevel.timeLimit || 10);
    const stim = generateStimulus();
    if (stim.delay) {
      setTimeout(() => {
        setShowTarget(true);
        setStartTime(Date.now()); // Reset start time to when they actually see the target
      }, stim.delay);
    } else {
      setShowTarget(true);
    }
  };

  const generateStimulus = () => {
    const type = testId.replace('dikkat_', '');
    let stim = {};

    if (type === 'sembol') {
      const total = currentLevel.gridSize;
      const tCount = currentLevel.targetCount;
      
      const allSyms = currentLevel.distractors;
      const targetIdx = Math.floor(Math.random() * allSyms.length);
      const targetSymbol = allSyms[targetIdx];
      const distractors = allSyms.filter((_, i) => i !== targetIdx);

      const cells = Array(total).fill(null).map((_, i) => ({ 
        id: i, 
        val: distractors[Math.floor(Math.random() * distractors.length)],
        isTarget: false 
      }));
      
      const indices = [];
      while(indices.length < tCount) {
        let r = Math.floor(Math.random() * total);
        if(indices.indexOf(r) === -1) indices.push(r);
      }
      
      indices.forEach(idx => {
        cells[idx].val = targetSymbol;
        cells[idx].isTarget = true;
      });
      
      let maxErrors = total === 25 ? 1 : total === 49 ? 2 : 3;
      stim = { cells, targetsToFind: tCount, maxErrors, delay: 2000, targetSymbol };
    } else if (type === 'reaksiyon') {
      if (currentLevel.mode === 'continuous') {
         const tCount = currentLevel.totalTargets || 50;
         const dCount = currentLevel.totalDistractors || 100;
         let seq = [];
         for(let i=0; i<tCount; i++) seq.push({ isTarget: true, color: currentLevel.targetColor });
         for(let i=0; i<dCount; i++) {
            seq.push({ isTarget: false, color: currentLevel.distractorColors[Math.floor(Math.random() * currentLevel.distractorColors.length)] });
         }
         seq = seq.sort(() => Math.random() - 0.5);
         stim = { sequence: seq };
      } else if (currentLevel.mode === 'simple') {
        stim = { target: currentLevel.targetColor, delay: 1000 + Math.random() * 2000 };
      } else if (currentLevel.mode === 'go_nogo') {
        const isGo = Math.random() > 0.4;
        stim = { color: isGo ? currentLevel.targetColor : currentLevel.distractorColor, isGo };
      } else if (currentLevel.mode === 'choice') {
        stim = { target: currentLevel.targetColor, options: currentLevel.options };
      }
    } else if (type === 'stroop') {
      if (currentLevel.mode === 'academic_stroop') {
         const colors = config.colors;
         let seq = [];
         for(let i=0; i<(currentLevel.neutralCount||20); i++) {
            const colorIdx = Math.floor(Math.random() * colors.length);
            seq.push({ type: 'neutral', text: 'XXXX', colorName: colors[colorIdx], colorHex: config.colorCodes[colors[colorIdx]] });
         }
         for(let i=0; i<(currentLevel.congruentCount||20); i++) {
            const colorIdx = Math.floor(Math.random() * colors.length);
            seq.push({ type: 'congruent', text: colors[colorIdx], colorName: colors[colorIdx], colorHex: config.colorCodes[colors[colorIdx]] });
         }
         for(let i=0; i<(currentLevel.incongruentCount||20); i++) {
            const textIdx = Math.floor(Math.random() * colors.length);
            const colorIdx = (textIdx + 1 + Math.floor(Math.random() * (colors.length - 1))) % colors.length;
            seq.push({ type: 'incongruent', text: colors[textIdx], colorName: colors[colorIdx], colorHex: config.colorCodes[colors[colorIdx]] });
         }
         seq = seq.sort(() => Math.random() - 0.5);
         stim = { sequence: seq };
      } else {
         const colors = config.colors;
         const textIdx = Math.floor(Math.random() * colors.length);
         let colorIdx;
         if (currentLevel.mode === 'congruent') colorIdx = textIdx;
         else colorIdx = (textIdx + 1 + Math.floor(Math.random() * (colors.length - 1))) % colors.length;
         stim = { text: colors[textIdx], color: config.colorCodes[colors[colorIdx]], target: colors[colorIdx] };
      }
    } else if (type === 'gonogo') {
      const isGo = Math.random() > 0.3;
      if (currentLevel.mode === 'conflict') {
        const text = isGo ? 'GİT' : 'DUR';
        const color = isGo ? '#EF4444' : '#22C55E'; 
        stim = { text, color, isGo };
      } else {
        stim = { val: isGo ? currentLevel.go : currentLevel.nogo, isGo };
      }
    } else if (type === 'farkli') {
      const total = currentLevel.gridSize;
      const oddIdx = Math.floor(Math.random() * total);
      const baseRotation = Math.floor(Math.random() * 4) * 90;
      const oddRotation = baseRotation + 90;
      const cells = Array(total).fill(null).map((_, i) => ({
        id: i,
        isOdd: i === oddIdx,
        rotation: i === oddIdx ? oddRotation : baseRotation
      }));
      stim = { cells };
    } else if (type === 'dondurme') {
      const baseRotation = Math.floor(Math.random() * 360);
      const targetRotation = (baseRotation + currentLevel.rotation) % 360;
      const options = [];
      const correctIdx = Math.floor(Math.random() * currentLevel.options);
      
      for(let i=0; i<currentLevel.options; i++) {
        if(i === correctIdx) {
          options.push({ id: i, rotation: targetRotation, isCorrect: true, isMirrored: false });
        } else {
          const isMirrored = Math.random() > 0.5;
          options.push({ id: i, rotation: Math.floor(Math.random() * 360), isCorrect: false, isMirrored });
        }
      }
      stim = { baseRotation, options };
    }
    setCurrentStimulus(stim);
    return stim;
  };

  const endRound = (isCorrect, timeSpentParam) => {
    const type = testId.replace('dikkat_', '');
    let extraData = {};
    
    if (type === 'sembol') {
      extraData = {
        isCorrect,
        timeLimit: currentLevel.timeLimit,
        wrongClicksMade: wrongClicks,
        targetsFound: isCorrect ? currentStimulus.targetsToFind : foundTargets.length,
        targetsTotal: currentStimulus.targetsToFind,
        gridSize: currentLevel.gridSize
      };
    } else if (type === 'reaksiyon' && currentStimulus?.sequence) {
      const avgRt = cptState.rt.length ? Math.round(cptState.rt.reduce((a,b)=>a+b,0)/cptState.rt.length) : 0;
      extraData = {
         isCorrect: true,
         timeLimit: currentLevel.timeLimit,
         hits: cptState.hits,
         misses: cptState.misses,
         falseAlarms: cptState.falseAlarms,
         avgRt,
         minRt: cptState.rt.length ? Math.min(...cptState.rt) : 0
      };
    } else if (type === 'stroop' && currentStimulus?.sequence) {
      extraData = {
         isCorrect: true, 
         timeLimit: currentLevel.timeLimit,
         stroopResults: stroopState.results
      };
    }

    const result = {
      round: round + 1,
      level: currentLevel.level,
      accuracy: isCorrect ? 100 : 0,
      timeSpent: timeSpentParam,
      score: isCorrect ? (currentLevel.level === 'Zor' ? 15 : currentLevel.level === 'Orta' ? 10 : 5) : 0,
      ...extraData
    };

    const newResults = [...roundResults, result];
    setRoundResults(newResults);
    
    if (isLastRound) {
      setPhase('finished');
      
      let finalReport = { rounds: newResults };
      
      if (type === 'sembol') {
        let baseScore = 0; // Max 60
        let speedScore = 0; // Max 30
        let totalWrongs = 0;
        let totalTimeLimitCorrect = 0;
        let totalTimeSavedCorrect = 0;
        
        newResults.forEach(r => {
           totalWrongs += r.wrongClicksMade || 0;
           if (r.isCorrect) {
              if (r.level === 'Kolay') baseScore += 2;
              if (r.level === 'Orta') baseScore += 4;
              if (r.level === 'Zor') baseScore += 6;
              totalTimeLimitCorrect += r.timeLimit;
              totalTimeSavedCorrect += Math.max(0, r.timeLimit - r.timeSpent);
           }
        });
        
        if (totalTimeLimitCorrect > 0) {
           speedScore = (totalTimeSavedCorrect / totalTimeLimitCorrect) * 30;
        }
        
        let precisionScore = Math.max(0, 10 - (totalWrongs * 2));
        const totalScore = Math.round(baseScore + speedScore + precisionScore);

        finalReport = {
          rounds: newResults,
          performanceScore100: totalScore,
          metrics: {
             baseScore,
             speedScore: Math.round(speedScore),
             precisionScore,
             totalWrongs
          }
        };
      } else if (type === 'reaksiyon' && currentStimulus?.sequence) {
         const resultItem = newResults[0];
         const targets = currentLevel.totalTargets || 50;
         
         let accScore = ((resultItem.hits - resultItem.falseAlarms) / targets) * 60;
         accScore = Math.max(0, Math.min(60, accScore));
         
         let spdScore = 0;
         if (resultItem.hits > 0 && resultItem.avgRt > 0) {
             const spd = ((800 - resultItem.avgRt) / 500) * 40;
             spdScore = Math.max(0, Math.min(40, spd));
         }
         
         const totalScore = Math.round(accScore + spdScore);

         finalReport = {
            rounds: newResults,
            performanceScore100: totalScore,
            metrics: {
               baseScore: Math.round(accScore),
               speedScore: Math.round(spdScore),
               precisionScore: 0,
               hits: resultItem.hits,
               misses: resultItem.misses,
               falseAlarms: resultItem.falseAlarms,
               avgRt: resultItem.avgRt,
               minRt: resultItem.minRt
            }
         };
      } else if (type === 'stroop' && currentStimulus?.sequence) {
         const resultItem = newResults[0];
         const stroopRounds = resultItem.stroopResults;

         // Helper: Gecikme Sınırları ve Doğruluk (Accuracy) için array bazlı hesaplama
         const countCorrect = (arr) => {
             if (!arr) return 0;
             return arr.filter(x => x.correct).length;
         };

         const calcAvgRt = (arr) => {
             if (!arr) return 0;
             const corrects = arr.filter(x => x.correct);
             return corrects.length > 0 ? (corrects.reduce((a, b) => a + b.rt, 0) / corrects.length) : 0;
         };

         // 1. Doğruluk (Accuracy) Raporu
         const notrHesap = countCorrect(stroopRounds.neutral);
         const uyumluHesap = countCorrect(stroopRounds.congruent);
         const uyumsuzHesap = countCorrect(stroopRounds.incongruent);

         const neutralTotal = currentLevel.neutralCount || 20;
         const congruentTotal = currentLevel.congruentCount || 20;
         const incongruentTotal = currentLevel.incongruentCount || 20;

         const totalSorular = neutralTotal + congruentTotal + incongruentTotal;
         const totalDogrular = notrHesap + uyumluHesap + uyumsuzHesap;

         const overallAccuracyRate = totalSorular > 0 ? (totalDogrular / totalSorular) : 0;
         const accScore = Math.round(overallAccuracyRate * 60);

         // 2. Ortalama Hız (Reaction Time - Sadece doğru bilinenler üzerinden)
         const n_rt = calcAvgRt(stroopRounds.neutral);
         const c_rt = calcAvgRt(stroopRounds.congruent);
         const i_rt = calcAvgRt(stroopRounds.incongruent);

         // Beynin "Yavaşlama" süresi (Uyumsuz - Uyumlu Hız Farkı / Ms)
         const interference = (i_rt > 0 && c_rt > 0) ? Math.round(i_rt - c_rt) : 0;

         // 3. Hız Skorlaması (Max 40 Puan)
         let spdScore = 0;
         if (overallAccuracyRate > 0) {
             if (interference > 0) {
                 // Her 50ms gecikme puan düşürür, tahammül sınırı 500ms
                 const calculatedSpeedScore = 40 - (interference / 500) * 40;
                 spdScore = Math.max(0, Math.min(40, calculatedSpeedScore));
             } else if (i_rt > 0) {
                 // Yavaşlama hiç olmadıysa tam hız puanı alır
                 spdScore = 40;
             }
         }

         const totalScore = Math.round(accScore + spdScore);

         // 4. Nihai İK Raporuna Veri Basımı
         finalReport = {
            rounds: newResults,
            performanceScore100: totalScore,
            metrics: {
               neutralRt: Math.round(n_rt),
               congruentRt: Math.round(c_rt),
               incongruentRt: Math.round(i_rt),
               neutralAcc: Math.round((notrHesap / neutralTotal) * 100),
               congruentAcc: Math.round((uyumluHesap / congruentTotal) * 100),
               incongruentAcc: Math.round((uyumsuzHesap / incongruentTotal) * 100),
               interference: interference,
               baseScore: accScore,
               speedScore: Math.round(spdScore)
            }
         };
      } else if (type === 'farkli' || type === 'dondurme') {
         // Visual basic scoring fallback
         let accScore = 0;
         let speedScore = 0;
         newResults.forEach(r => {
             if (r.accuracy > 0) {
                 accScore += 20;
                 const expectedTime = r.timeLimit || 20;
                 if (r.timeSpent < expectedTime) {
                     speedScore += (1 - (r.timeSpent / expectedTime)) * 13;
                 }
             }
         });
         accScore = Math.min(60, accScore);
         speedScore = Math.min(40, speedScore);
         const totalScore = Math.round(accScore + speedScore);

         finalReport = {
             rounds: newResults,
             performanceScore100: totalScore,
             metrics: {
                 baseScore: Math.round(accScore),
                 speedScore: Math.round(speedScore),
                 precisionScore: 0
             }
         };
      }
      
      onFinish(finalReport);
    } else {
      setRound(r => r + 1);
      setPhase('round_end');
    }
  };

  const handleAnswer = (answer, isTimeout = false) => {
    if (phase !== 'play' || (currentStimulus.delay && !showTarget && !isTimeout)) return; 

    const timeSpent = (Date.now() - startTime) / 1000;
    const type = testId.replace('dikkat_', '');

    if (type === 'reaksiyon' && currentStimulus?.sequence) {
        if (isTimeout) {
           endRound(true, currentLevel.timeLimit * 1000); 
           return;
        }
        if (cptState.hasClicked || !cptState.activeEvent) return;
        
        const rtMs = Date.now() - startTime;
        setCptState(prev => {
           const isHit = prev.activeEvent.isTarget;
           return {
              ...prev,
              hasClicked: true,
              hits: isHit ? prev.hits + 1 : prev.hits,
              falseAlarms: !isHit ? prev.falseAlarms + 1 : prev.falseAlarms,
              rt: isHit ? [...prev.rt, rtMs] : prev.rt
           };
        });
        return; // Don't end round, wait for next circle
    }

    if (type === 'stroop' && currentStimulus?.sequence) {
       if (stroopState.isFixation || stroopState.hasClicked || !stroopState.activeEvent) return;
       const rtMs = Date.now() - startTime;
       const isCorrect = answer === stroopState.activeEvent.colorName;
       
       setStroopState(prev => {
          const answeredType = prev.activeEvent.type;
          const newResults = { ...prev.results };
          newResults[answeredType] = [...newResults[answeredType], { rt: rtMs, correct: isCorrect, isMiss: false }];
          return { ...prev, hasClicked: true, isFixation: true, activeEvent: null, index: prev.index + 1 };
       });
       return;
    }

    if (type === 'sembol' && !isTimeout) {
        if (answer.isTarget) {
            if (!foundTargets.includes(answer.id)) {
                const newFound = [...foundTargets, answer.id];
                setFoundTargets(newFound);
                if (newFound.length >= currentStimulus.targetsToFind) {
                    endRound(true, timeSpent);
                }
            }
        } else {
            const newWrongs = wrongClicks + 1;
            setWrongClicks(newWrongs);
            if (newWrongs > currentStimulus.maxErrors) {
                endRound(false, timeSpent);
            }
        }
        return;
    }

    let isCorrect = false;

    if (!isTimeout) {
      if (type === 'reaksiyon') {
         if (currentLevel.mode === 'simple') isCorrect = true;
         else if (currentLevel.mode === 'go_nogo') isCorrect = currentStimulus.isGo;
         else if (currentLevel.mode === 'choice') isCorrect = answer === currentStimulus.target;
      } else if (type === 'stroop') isCorrect = answer === currentStimulus.target;
      else if (type === 'gonogo') isCorrect = currentStimulus.isGo;
      else if (type === 'farkli') isCorrect = answer.isOdd;
      else if (type === 'dondurme') isCorrect = answer.isCorrect;
    } else {
      if (type === 'reaksiyon' && currentLevel.mode === 'go_nogo') isCorrect = !currentStimulus.isGo;
      if (type === 'gonogo') isCorrect = !currentStimulus.isGo;
    }

    endRound(isCorrect, timeSpent);
  };

  if (savedResult || phase === 'finished') {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <h3>Test Tamamlandı</h3>
        <p style={{ color: '#64748B' }}>Performansınız kaydedildi.</p>
      </div>
    );
  }

  return (
    <div className="exam-interactive-container" style={{ padding: '1.5rem', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
      {phase === 'intro' && (
        <div style={{ textAlign: 'center', margin: 'auto' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎯</div>
          <h3 style={{ marginBottom: '1rem' }}>{config.label || 'Dikkat Testi'}</h3>
          <p style={{ color: '#64748B', maxWidth: '400px', margin: '0 auto 2rem' }}>{config.instruction}</p>
          <button className="exam-btn primary" style={{ px: '3rem' }} onClick={() => setPhase('level_start')}>Teste Başla</button>
        </div>
      )}

      {(phase === 'level_start' || phase === 'round_end') && (
        <div style={{ textAlign: 'center', margin: 'auto' }}>
          <div style={{ fontSize: '1rem', color: '#6366F1', fontWeight: 600, marginBottom: '0.5rem' }}>
            SEVİYE: {currentLevel.level}
          </div>
          <h2 style={{ marginBottom: '2rem' }}>Round {round + 1} / {config.rounds.length}</h2>
          <button className="exam-btn primary" onClick={startLevel}>
            {phase === 'round_end' ? 'Sıradaki Round' : 'Başla'}
          </button>
        </div>
      )}

      {phase === 'play' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 600 }}>Round {round + 1}/{config.rounds.length} ({currentLevel.level})</span>
            <span style={{ color: timeLeft < 5 ? '#EF4444' : '#64748B' }}>⏱ {timeLeft}s</span>
          </div>

          <div style={{ flex: 1, background: '#F8FAFC', borderRadius: 16, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid #E2E8F0' }}>
             {/* SYMBOL SEARCH */}
             {testId.includes('sembol') && (
               !showTarget && currentStimulus?.targetSymbol ? (
                 <div style={{ textAlign: 'center', margin: 'auto' }}>
                    <div style={{ color: '#64748B', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 600 }}>BUNU BULACAKSINIZ</div>
                    <div style={{ fontSize: '6rem', fontWeight: 800, color: '#0F172A', background: 'white', padding: '2rem 4rem', borderRadius: 24, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                      {currentStimulus.targetSymbol}
                    </div>
                 </div>
               ) : currentStimulus?.cells ? (
                 <div style={{ width: '100%', maxWidth: currentLevel.gridSize >= 49 ? '620px' : '400px' }}>
                   <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.9rem', fontWeight: 600 }}>
                      <span>Hedefler: <span style={{color:'#22C55E'}}>{foundTargets.length}</span> / {currentStimulus.targetsToFind}</span>
                      <span style={{ color: wrongClicks > 0 ? '#EF4444' : 'inherit' }}>Kalan Hata Hakkı: {currentStimulus.maxErrors - wrongClicks}</span>
                   </div>
                   <div style={{ 
                     display: 'grid', 
                     gridTemplateColumns: `repeat(${Math.sqrt(currentLevel.gridSize)}, 1fr)`, 
                     gap: currentLevel.gridSize === 100 ? '4px' : '8px',
                     width: '100%'
                   }}>
                     {currentStimulus.cells.map(cell => {
                       const isFound = foundTargets.includes(cell.id);
                       return (
                         <button 
                           key={cell.id} 
                           disabled={isFound}
                           className={`exam-btn ghost ${isFound ? 'success' : ''}`} 
                           style={{ 
                             aspectRatio: '1/1', 
                             padding: 0, 
                             fontSize: currentLevel.gridSize === 100 ? '1rem' : '1.3rem', 
                             background: isFound ? '#22C55E' : 'white',
                             color: isFound ? 'white' : '#1E293B',
                             borderColor: isFound ? '#22C55E' : '#E2E8F0',
                             cursor: isFound ? 'default' : 'pointer',
                             fontWeight: 600
                           }}
                           onClick={() => handleAnswer(cell)}
                         >
                           {cell.val}
                         </button>
                       );
                     })}
                   </div>
                 </div>
               ) : null
             )}

             {/* REACTION TIME / GO-NOGO */}
             {(testId.includes('reaksiyon') || testId.includes('gonogo')) && (
               <div style={{ textAlign: 'center', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                 {currentStimulus?.sequence ? (
                    // CPT MARATON MODE UI
                    <div 
                      onClick={() => handleAnswer(true)}
                      style={{ 
                        width: '200px', height: '200px', borderRadius: '50%', margin: '0 auto', cursor: 'crosshair',
                        background: cptState.activeEvent ? cptState.activeEvent.color : 'transparent',
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        transition: 'none',
                        boxShadow: cptState.activeEvent ? '0 10px 15px -3px rgba(0,0,0,0.1)' : 'none'
                      }}
                    />
                 ) : currentStimulus?.mode === 'choice' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '300px', margin: '0 auto' }}>
                      {currentStimulus.options.map(c => (
                        <div 
                          key={c} 
                          onClick={() => handleAnswer(c)}
                          style={{ height: '80px', background: c, borderRadius: 12, cursor: 'pointer', border: '4px solid white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                        />
                      ))}
                    </div>
                 ) : (
                    <div 
                      onClick={() => handleAnswer(true)}
                      style={{ 
                        width: '200px', height: '200px', borderRadius: '50%', margin: '0 auto', cursor: 'pointer',
                        background: currentStimulus?.color || currentStimulus?.target || (currentStimulus?.val === '🟢' ? '#22C55E' : currentStimulus?.val === '🔴' ? '#EF4444' : '#CBD5E1'),
                        display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3rem', color: 'white',
                        transition: 'all 0.2s', transform: 'scale(1)',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                      }}
                    >
                      {currentStimulus?.text || ''}
                    </div>
                 )}
                 <p style={{ marginTop: '2rem', color: '#64748B' }}>
                   {currentStimulus?.sequence ? 'Yalnızca YEŞİL dairelere tıklayın. Diğer renkleri es geçin.' : currentLevel.mode === 'conflict' ? 'Sadece kelime anlamına odaklanın!' : 'Tetikleyiciye hızla tepki verin.'}
                 </p>
               </div>
             )}

             {/* STROOP */}
             {testId.includes('stroop') && (
               <div style={{ textAlign: 'center', width: '100%' }}>
                 {currentStimulus?.sequence ? (
                   // Academic Block Mode
                   <div style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ fontSize: '1rem', color: '#64748B', marginBottom: '1rem' }}>
                        {Math.min(stroopState.index + 1, currentStimulus.sequence.length)} / {currentStimulus.sequence.length}
                      </div>

                      <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {stroopState.isFixation ? (
                           <div style={{ fontSize: '5rem', fontWeight: 300, color: '#94A3B8' }}>+</div>
                        ) : stroopState.activeEvent ? (
                           <div style={{ fontSize: '5rem', fontWeight: 900, color: stroopState.activeEvent.colorHex }}>
                             {stroopState.activeEvent.text.toUpperCase()}
                           </div>
                        ) : null}
                      </div>
                   </div>
                 ) : (
                   // Fallback visual
                   <div style={{ fontSize: '4rem', fontWeight: 800, color: currentStimulus?.color, marginBottom: '3rem' }}>
                     {currentStimulus?.text.toUpperCase()}
                   </div>
                 )}
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', maxWidth: '600px', margin: '2rem auto 0' }}>
                   {config.colors.map(colorName => (
                     <button 
                       key={colorName} 
                       className="exam-btn ghost" 
                       style={{ background: 'white', fontWeight: 700, border: '2px solid #E2E8F0', padding: '1.2rem', fontSize: '1.1rem' }}
                       onClick={() => handleAnswer(colorName)}
                     >
                       {colorName}
                     </button>
                   ))}
                 </div>
               </div>
             )}

             {/* ODD ONE OUT / MENTAL ROTATION */}
             {(testId.includes('farkli') || testId.includes('dondurme')) && (
               <div style={{ textAlign: 'center', width: '100%' }}>
                 {testId.includes('farkli') ? (
                   <div style={{ 
                     display: 'grid', gridTemplateColumns: `repeat(${Math.sqrt(currentLevel.gridSize)}, 1fr)`, 
                     gap: '12px', width: '100%', maxWidth: '360px', margin: '0 auto' 
                   }}>
                     {currentStimulus?.cells.map(cell => (
                       <button 
                         key={cell.id} 
                         onClick={() => handleAnswer(cell)}
                         style={{ 
                            aspectRatio: '1/1', background: 'white', border: '1px solid #E2E8F0', borderRadius: 8,
                            display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
                            transform: `rotate(${cell.rotation}deg)`
                         }}
                       >
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.5">
                            <path d="M5 21l14-14M19 21l-14-14" />
                         </svg>
                       </button>
                     ))}
                   </div>
                 ) : (
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                      <div style={{ 
                        padding: '1rem', background: 'white', borderRadius: 12, border: '2px solid #6366F1',
                        transform: `rotate(${currentStimulus?.baseRotation}deg)`
                      }}>
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2">
                           <path d="M3 3h18v18H3zM9 9l6 6M15 9l-6 6" />
                        </svg>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        {currentStimulus?.options.map(opt => (
                          <button 
                            key={opt.id} 
                            onClick={() => handleAnswer(opt)}
                            style={{ 
                              padding: '1rem', background: 'white', border: '1px solid #E2E8F0', borderRadius: 8,
                              transform: `rotate(${opt.rotation}deg) ${opt.isMirrored ? 'scaleX(-1)' : ''}`,
                              cursor: 'pointer'
                            }}
                          >
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
                               <path d="M3 3h18v18H3zM9 9l6 6M15 9l-6 6" />
                            </svg>
                          </button>
                        ))}
                      </div>
                   </div>
                 )}
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── HELPERS ──────────────────────────────────────────────
function shuffleOptions(q) {
  if (!q.o || q.o.length === 0) return q;
  const indices = q.o.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const newO = indices.map(i => q.o[i]);
  const newA = indices.indexOf(q.a);
  return { ...q, o: newO, a: newA };
}
