// ═══════════════════════════════════════════════════════════════
// SINAV GÜVENLİK MODÜLÜ
// Katmanlı güvenlik: Tab algılama, Fullscreen, Kamera, Kopyalama engeli
// ═══════════════════════════════════════════════════════════════

// Güvenlik seviye tanımları
export const SECURITY_LEVELS = {
  standard: {
    id: 'standard',
    label: 'Standart',
    icon: '🔒',
    description: 'Tab algılama + tam ekran zorunluluğu',
    features: ['tab_detection', 'fullscreen', 'copy_prevention', 'time_tracking'],
  },
  medium: {
    id: 'medium',
    label: 'Orta',
    icon: '🔐',
    description: 'Standart + kamera doğrulama',
    features: ['tab_detection', 'fullscreen', 'copy_prevention', 'time_tracking', 'camera_verification'],
  },
  high: {
    id: 'high',
    label: 'Yüksek',
    icon: '🛡️',
    description: 'Orta + random ekran görüntüsü',
    features: ['tab_detection', 'fullscreen', 'copy_prevention', 'time_tracking', 'camera_verification', 'random_snapshot', 'device_fingerprint'],
  },
};

// ─── GÜVENLİK OLAY LOGU ──────────────────────────────────
export function createSecurityLog() {
  return {
    events: [],
    tabSwitches: 0,
    totalTabAwayTime: 0,
    fullscreenExits: 0,
    copyAttempts: 0,
    rightClickAttempts: 0,
    cameraSnapshots: [],
    faceDetections: [],
    questionTimes: {},
    startTime: null,
    endTime: null,
    deviceInfo: null,
    ipConsistency: true,
  };
}

export function addSecurityEvent(log, type, details = {}) {
  log.events.push({
    type,
    timestamp: new Date().toISOString(),
    time: Date.now(),
    ...details,
  });
  return log;
}

// ─── RISK SEVİYESİ HESAPLAMA ──────────────────────────────
export function calculateRiskLevel(log) {
  let riskScore = 0;

  // Tab switches
  if (log.tabSwitches > 5) riskScore += 30;
  else if (log.tabSwitches > 2) riskScore += 15;
  else if (log.tabSwitches > 0) riskScore += 5;

  // Total away time
  if (log.totalTabAwayTime > 60000) riskScore += 25; // > 1 min
  else if (log.totalTabAwayTime > 30000) riskScore += 15;
  else if (log.totalTabAwayTime > 10000) riskScore += 5;

  // Fullscreen exits
  if (log.fullscreenExits > 3) riskScore += 20;
  else if (log.fullscreenExits > 0) riskScore += 10;

  // Copy attempts
  if (log.copyAttempts > 3) riskScore += 15;
  else if (log.copyAttempts > 0) riskScore += 5;

  // Question time anomalies
  const times = Object.values(log.questionTimes);
  if (times.length > 0) {
    const avg = times.reduce((s, t) => s + t, 0) / times.length;
    const tooFast = times.filter(t => t < avg * 0.2).length;
    const tooSlow = times.filter(t => t > avg * 4).length;
    if (tooFast > times.length * 0.3) riskScore += 15;
    if (tooSlow > 2) riskScore += 10;
  }

  if (riskScore >= 60) return { level: 'high', label: 'Yüksek', color: '#EF4444', icon: '🔴', score: riskScore };
  if (riskScore >= 30) return { level: 'medium', label: 'Orta', color: '#F59E0B', icon: '🟡', score: riskScore };
  return { level: 'low', label: 'Düşük', color: '#22C55E', icon: '🟢', score: riskScore };
}

// ─── TAB/PENCERE ALGILAMA ────────────────────────────────
export function setupTabDetection(log, onTabSwitch) {
  let tabAwayStart = null;

  const handleVisibility = () => {
    if (document.hidden) {
      tabAwayStart = Date.now();
      log.tabSwitches++;
      addSecurityEvent(log, 'tab_switch', { direction: 'away' });
      if (onTabSwitch) onTabSwitch('away', log.tabSwitches);
    } else {
      if (tabAwayStart) {
        const awayTime = Date.now() - tabAwayStart;
        log.totalTabAwayTime += awayTime;
        addSecurityEvent(log, 'tab_return', { awayDuration: awayTime });
        tabAwayStart = null;
      }
      if (onTabSwitch) onTabSwitch('return', log.tabSwitches);
    }
  };

  const handleBlur = () => {
    if (!document.hidden) {
      log.tabSwitches++;
      addSecurityEvent(log, 'window_blur');
      if (onTabSwitch) onTabSwitch('blur', log.tabSwitches);
    }
  };

  document.addEventListener('visibilitychange', handleVisibility);
  window.addEventListener('blur', handleBlur);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibility);
    window.removeEventListener('blur', handleBlur);
  };
}

// ─── FULLSCREEN YÖNETİMİ ────────────────────────────────
export function requestFullscreen(element = document.documentElement) {
  if (element.requestFullscreen) return element.requestFullscreen();
  if (element.webkitRequestFullscreen) return element.webkitRequestFullscreen();
  if (element.msRequestFullscreen) return element.msRequestFullscreen();
  return Promise.reject('Fullscreen not supported');
}

export function exitFullscreen() {
  if (document.exitFullscreen) return document.exitFullscreen();
  if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
  return Promise.reject('Exit fullscreen not supported');
}

export function setupFullscreenDetection(log, onExit) {
  const handler = () => {
    const isFullscreen = !!document.fullscreenElement || !!document.webkitFullscreenElement;
    if (!isFullscreen) {
      log.fullscreenExits++;
      addSecurityEvent(log, 'fullscreen_exit');
      if (onExit) onExit(log.fullscreenExits);
    }
  };
  document.addEventListener('fullscreenchange', handler);
  document.addEventListener('webkitfullscreenchange', handler);
  return () => {
    document.removeEventListener('fullscreenchange', handler);
    document.removeEventListener('webkitfullscreenchange', handler);
  };
}

// ─── KOPYALAMA ENGELİ ───────────────────────────────────
export function setupCopyPrevention(log) {
  const preventCopy = (e) => {
    e.preventDefault();
    log.copyAttempts++;
    addSecurityEvent(log, 'copy_attempt');
  };

  const preventContext = (e) => {
    e.preventDefault();
    log.rightClickAttempts++;
    addSecurityEvent(log, 'right_click_attempt');
  };

  const preventKeys = (e) => {
    // Ctrl+C, Ctrl+V, Ctrl+U, F12
    if ((e.ctrlKey && ['c','v','u','a'].includes(e.key.toLowerCase())) || e.key === 'F12') {
      e.preventDefault();
      log.copyAttempts++;
      addSecurityEvent(log, 'keyboard_shortcut_attempt', { key: e.key });
    }
  };

  document.addEventListener('copy', preventCopy);
  document.addEventListener('paste', preventCopy);
  document.addEventListener('contextmenu', preventContext);
  document.addEventListener('keydown', preventKeys);

  return () => {
    document.removeEventListener('copy', preventCopy);
    document.removeEventListener('paste', preventCopy);
    document.removeEventListener('contextmenu', preventContext);
    document.removeEventListener('keydown', preventKeys);
  };
}

// ─── KAMERA SNAPSHOT ─────────────────────────────────────
export async function initCamera(videoElement) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 320, height: 240, facingMode: 'user' },
      audio: false,
    });
    videoElement.srcObject = stream;
    await videoElement.play();
    return stream;
  } catch (error) {
    console.warn('Camera access denied:', error);
    return null;
  }
}

export function captureSnapshot(videoElement) {
  if (!videoElement || !videoElement.srcObject) return null;
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth || 320;
  canvas.height = videoElement.videoHeight || 240;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  return {
    dataUrl: canvas.toDataURL('image/jpeg', 0.6),
    timestamp: new Date().toISOString(),
    time: Date.now(),
  };
}

export function setupRandomSnapshots(videoElement, log, intervalRange = [30000, 90000]) {
  const scheduleNext = () => {
    const delay = intervalRange[0] + Math.random() * (intervalRange[1] - intervalRange[0]);
    return setTimeout(() => {
      const snap = captureSnapshot(videoElement);
      if (snap) {
        log.cameraSnapshots.push(snap);
        addSecurityEvent(log, 'camera_snapshot', { index: log.cameraSnapshots.length });
      }
      timerId = scheduleNext();
    }, delay);
  };
  let timerId = scheduleNext();
  return () => clearTimeout(timerId);
}

export function stopCamera(stream) {
  if (stream) stream.getTracks().forEach(t => t.stop());
}

// ─── CİHAZ PARMAK İZİ ───────────────────────────────────
export function getDeviceFingerprint() {
  const { userAgent, language, platform, hardwareConcurrency } = navigator;
  const screen = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const str = `${userAgent}|${language}|${platform}|${hardwareConcurrency}|${screen}|${timezone}`;
  // Simple hash
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// ─── SORU ZAMANLAMA ──────────────────────────────────────
export function trackQuestionTime(log, questionId) {
  const startTime = Date.now();
  return () => {
    const elapsed = Date.now() - startTime;
    log.questionTimes[questionId] = elapsed;
    addSecurityEvent(log, 'question_answered', { questionId, timeMs: elapsed });
  };
}

// ─── UNIQUE TOKEN OLUŞTURMA ──────────────────────────────
export function generateExamToken() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let token = '';
  for (let i = 0; i < 24; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// ─── ZAMAN FORMATLAMA ────────────────────────────────────
export function formatTimeRemaining(seconds) {
  if (seconds <= 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds} sn`;
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes} dk ${remaining} sn`;
}
