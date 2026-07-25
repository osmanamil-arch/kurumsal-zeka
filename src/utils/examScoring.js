// ═══════════════════════════════════════════════════════════════
// SINAV PUANLAMA MOTORU
// Test tipine göre boyut bazlı puanlama + AI yorum
// ═══════════════════════════════════════════════════════════════

import { psikometrikTestBanks } from '../data/psikometrikTestBank';
import { pozisyonTestBanks } from '../data/pozisyonTestBank';
import { questionBank } from '../data/testQuestionBank';
import { attentionTests, visualTests } from '../data/interactiveTests';
import { personalityBank } from '../data/personalityBank';
import { getTestById } from '../data/testCatalog';

// ─── ANA PUANLAMA FONKSİYONU ──────────────────────────────
export function scoreAllTests(answers, selectedTests) {
  const results = {};

  for (const testId of selectedTests) {
    const testMeta = getTestById(testId);
    if (!testMeta) continue;

    let bank = null;
    if (psikometrikTestBanks[testId]) bank = psikometrikTestBanks[testId];
    else if (pozisyonTestBanks[testId]) bank = pozisyonTestBanks[testId];
    else if (testId === 'kisilik_big5') bank = { id: 'kisilik_big5', format: 'personality_likert' };
    else if (questionBank.TEMEL_YETENEK && questionBank.TEMEL_YETENEK[testId]) {
      const qData = questionBank.TEMEL_YETENEK[testId];
      bank = { id: testId, format: 'mcq', questions: [...(qData.kolay || []), ...(qData.orta || []), ...(qData.zor || [])] };
    } else if (attentionTests[testId.replace('dikkat_', '')]) {
      bank = attentionTests[testId.replace('dikkat_', '')];
      bank.format = 'interactive';
    } else if (visualTests[testId.replace('gorsel_', '')]) {
      bank = visualTests[testId.replace('gorsel_', '')];
      bank.format = 'interactive';
    }

    if (!bank) continue;

    if (bank.dimensions && (bank.scale || bank.format === 'likert')) {
      results[testId] = scoreLikertTest(bank, answers);
    } else if (bank.format === 'forced_choice' && bank.scenarios) {
      results[testId] = scoreForcedChoice(bank, answers);
    } else if (bank.format === 'ranking' && bank.scenarios) {
      results[testId] = scoreRanking(bank, answers);
    } else if (bank.format === 'scenario_choice' && bank.scenarios) {
      results[testId] = scoreScenarioChoice(bank, answers);
    } else if (bank.questions || bank.format === 'mcq') {
      results[testId] = scoreMCQ(bank, answers);
    } else if (bank.format === 'personality_likert') {
      results[testId] = scorePersonalityBank(answers);
    } else if (bank.format === 'interactive') {
      results[testId] = scoreInteractiveTest(bank, answers[testId]);
    }

    if (results[testId]) {
      results[testId].testTitle = testMeta.title;
      results[testId].testIcon = testMeta.icon;
      results[testId].testId = testId;
      results[testId].aiComment = generateAIComment(testId, results[testId]);
    }
  }

  return results;
}

// ─── LİKERT PUANLAMA ──────────────────────────────────────
function scoreLikertTest(bank, answers) {
  const dimensions = {};
  let totalScore = 0;
  let totalItems = 0;
  let answeredItems = 0;

  Object.entries(bank.dimensions).forEach(([dimKey, dim]) => {
    const items = dim.items || [];
    let dimTotal = 0;
    let dimCount = 0;

    items.forEach(item => {
      totalItems++;
      const val = answers[item.id];
      if (val !== undefined) {
        answeredItems++;
        const score = item.reverse ? (6 - val) : val;
        dimTotal += score;
        dimCount++;
      }
    });

    const avg = dimCount > 0 ? dimTotal / dimCount : 0;
    const pct = (avg / 5) * 100;
    dimensions[dimKey] = {
      label: dim.label,
      description: dim.description || '',
      average: Math.round(avg * 100) / 100,
      percentage: Math.round(pct),
      answered: dimCount,
      total: items.length,
      level: pct >= 80 ? 'Yüksek' : pct >= 60 ? 'Orta-Yüksek' : pct >= 40 ? 'Orta' : pct >= 20 ? 'Düşük-Orta' : 'Düşük',
    };
    totalScore += dimTotal;
  });

  const maxScore = totalItems * 5;
  const overallPct = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  return {
    type: 'likert',
    dimensions,
    overallScore: totalScore,
    maxScore,
    overallPercentage: overallPct,
    answeredItems,
    totalItems,
    completionRate: totalItems > 0 ? Math.round((answeredItems / totalItems) * 100) : 0,
  };
}

// ─── KİŞİLİK BANKASI PUANLAMA ─────────────────────────────
function scorePersonalityBank(answers) {
  const dimensions = {};
  let totalScore = 0;
  let totalItems = 0;
  let answeredItems = 0;

  Object.entries(personalityBank).forEach(([dimKey, dim]) => {
    const items = dim.items || [];
    let dimTotal = 0;
    let dimCount = 0;

    items.forEach(item => {
      totalItems++;
      const val = answers[item.id];
      if (val !== undefined) {
        answeredItems++;
        const score = item.reverse ? (6 - val) : val;
        dimTotal += score;
        dimCount++;
      }
    });

    const avg = dimCount > 0 ? dimTotal / dimCount : 0;
    const pct = (avg / 5) * 100;
    dimensions[dimKey] = {
      label: dim.label,
      description: dim.description || '',
      average: Math.round(avg * 100) / 100,
      percentage: Math.round(pct),
      answered: dimCount,
      total: items.length,
      level: pct >= 80 ? 'Yüksek' : pct >= 60 ? 'Orta-Yüksek' : pct >= 40 ? 'Orta' : pct >= 20 ? 'Düşük-Orta' : 'Düşük',
    };
    totalScore += dimTotal;
  });

  const maxScore = totalItems * 5;
  return {
    type: 'likert',
    dimensions,
    overallScore: totalScore,
    maxScore,
    overallPercentage: maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0,
    answeredItems,
    totalItems,
    completionRate: totalItems > 0 ? Math.round((answeredItems / totalItems) * 100) : 0,
  };
}

// ─── MCQ PUANLAMA ─────────────────────────────────────────
function scoreMCQ(bank, answers) {
  const questions = bank.questions || [];
  let correct = 0;
  let answered = 0;
  const diffResults = { kolay: { correct: 0, total: 0 }, orta: { correct: 0, total: 0 }, zor: { correct: 0, total: 0 } };

  questions.forEach(q => {
    const d = q.d || 'orta';
    if (!diffResults[d]) diffResults[d] = { correct: 0, total: 0 };
    diffResults[d].total++;

    if (answers[q.id] !== undefined) {
      answered++;
      if (answers[q.id] === q.a) {
        correct++;
        diffResults[d].correct++;
      }
    }
  });

  const pct = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

  return {
    type: 'mcq',
    correct,
    total: questions.length,
    answered,
    percentage: pct,
    difficultyBreakdown: diffResults,
    level: pct >= 80 ? 'Başarılı' : pct >= 60 ? 'Yeterli' : pct >= 40 ? 'Geliştirilmeli' : 'Yetersiz',
    completionRate: questions.length > 0 ? Math.round((answered / questions.length) * 100) : 0,
  };
}

// ─── FORCED CHOICE (Takım Rolü) ───────────────────────────
function scoreForcedChoice(bank, answers) {
  const roleCounts = {};
  const roles = bank.roles || {};
  Object.keys(roles).forEach(r => { roleCounts[r] = 0; });

  let answered = 0;
  (bank.scenarios || []).forEach(s => {
    const selected = answers[s.id];
    if (selected !== undefined && s.options[selected]) {
      answered++;
      const role = s.options[selected].role;
      if (role) roleCounts[role] = (roleCounts[role] || 0) + 1;
    }
  });

  const total = (bank.scenarios || []).length;
  const sorted = Object.entries(roleCounts).sort((a, b) => b[1] - a[1]);
  const dimensions = {};
  sorted.forEach(([key, count]) => {
    const roleMeta = roles[key] || {};
    dimensions[key] = {
      label: roleMeta.label || key,
      icon: roleMeta.icon || '',
      description: roleMeta.description || '',
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    };
  });

  return {
    type: 'forced_choice',
    dimensions,
    primaryRole: sorted[0] ? { key: sorted[0][0], ...roles[sorted[0][0]], count: sorted[0][1] } : null,
    secondaryRole: sorted[1] ? { key: sorted[1][0], ...roles[sorted[1][0]], count: sorted[1][1] } : null,
    answered,
    total,
    completionRate: total > 0 ? Math.round((answered / total) * 100) : 0,
  };
}

// ─── RANKING (İş Değerleri) ───────────────────────────────
function scoreRanking(bank, answers) {
  const valueScores = {};
  const dims = bank.dimensions || {};
  Object.keys(dims).forEach(d => { valueScores[d] = 0; });

  let answered = 0;
  const total = (bank.scenarios || []).length;

  (bank.scenarios || []).forEach(s => {
    const order = answers[s.id];
    if (order && Array.isArray(order)) {
      answered++;
      order.forEach((optIdx, rank) => {
        const opt = s.options[optIdx];
        if (opt && opt.dim) {
          valueScores[opt.dim] = (valueScores[opt.dim] || 0) + (s.options.length - rank);
        }
      });
    }
  });

  const maxPerDim = total * (Object.keys(dims).length || 4);
  const dimensions = {};
  Object.entries(valueScores)
    .sort((a, b) => b[1] - a[1])
    .forEach(([key, score]) => {
      const dimMeta = dims[key] || {};
      dimensions[key] = {
        label: dimMeta.label || key,
        description: dimMeta.description || '',
        score,
        percentage: maxPerDim > 0 ? Math.round((score / maxPerDim) * 100) : 0,
      };
    });

  return {
    type: 'ranking',
    dimensions,
    answered,
    total,
    completionRate: total > 0 ? Math.round((answered / total) * 100) : 0,
  };
}

// ─── SCENARIO CHOICE (Öğrenme Stili) ──────────────────────
function scoreScenarioChoice(bank, answers) {
  const styleCounts = {};
  const styles = bank.styles || {};
  Object.keys(styles).forEach(s => { styleCounts[s] = 0; });

  let answered = 0;
  const total = (bank.scenarios || []).length;

  (bank.scenarios || []).forEach(s => {
    const selected = answers[s.id];
    if (selected !== undefined && s.options[selected]) {
      answered++;
      const style = s.options[selected].style;
      if (style) styleCounts[style] = (styleCounts[style] || 0) + 1;
    }
  });

  const sorted = Object.entries(styleCounts).sort((a, b) => b[1] - a[1]);
  const dimensions = {};
  sorted.forEach(([key, count]) => {
    const styleMeta = styles[key] || {};
    dimensions[key] = {
      label: styleMeta.label || key,
      icon: styleMeta.icon || '',
      description: styleMeta.description || '',
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    };
  });

  return {
    type: 'scenario_choice',
    dimensions,
    primaryStyle: sorted[0] ? { key: sorted[0][0], ...styles[sorted[0][0]], count: sorted[0][1] } : null,
    answered,
    total,
    completionRate: total > 0 ? Math.round((answered / total) * 100) : 0,
  };
}

// ─── INTERACTIVE (Attention/Visual) ──────────────────────
function scoreInteractiveTest(bank, data) {
  if (!data) return { type: 'interactive', percentage: 0, score: 0, level: 'Yetersiz' };

  // Handle multi-round data
  if (data.rounds && Array.isArray(data.rounds)) {
    const totalRounds = data.rounds.length;
    const avgAccuracy = data.rounds.reduce((acc, r) => acc + (r.accuracy || 0), 0) / (totalRounds || 1);
    const avgTime = data.rounds.reduce((acc, r) => acc + (r.timeSpent || 0), 0) / (totalRounds || 1);
    const totalScore = data.rounds.reduce((acc, r) => acc + (r.score || 0), 0);
    
    const pct = data.performanceScore100 !== undefined ? data.performanceScore100 : Math.round(avgAccuracy);
    return {
      type: 'interactive',
      score: totalScore,
      percentage: pct,
      accuracy: data.performanceScore100 !== undefined ? pct : Math.round(avgAccuracy),
      timeSpent: Math.round(avgTime * 10) / 10,
      level: pct >= 80 ? 'Üstün' : pct >= 60 ? 'Yeterli' : pct >= 40 ? 'Geliştirilmeli' : 'Yetersiz',
      completionRate: 100,
      roundBreakdown: data.rounds,
      metrics: data.metrics
    };
  }

  // Legacy fallback
  const score = data.score || 0;
  const accuracy = data.accuracy || 0;
  const timeSpent = data.timeSpent || 0;
  const pct = accuracy || Math.round((score / (bank.config?.rounds || 10)) * 100);

  return {
    type: 'interactive',
    score,
    percentage: pct,
    accuracy,
    timeSpent,
    level: pct >= 80 ? 'Üstün' : pct >= 60 ? 'Yeterli' : pct >= 40 ? 'Geliştirilmeli' : 'Yetersiz',
    completionRate: 100,
  };
}

// ═══════════════════════════════════════════════════════════════
// AI YORUM ÜRETİCİ
// ═══════════════════════════════════════════════════════════════

function generateAIComment(testId, result) {
  if (result.type === 'likert') {
    return generateLikertComment(testId, result);
  }
  if (result.type === 'mcq') {
    return generateMCQComment(testId, result);
  }
  if (result.type === 'forced_choice') {
    return generateForcedChoiceComment(result);
  }
  if (result.type === 'ranking') {
    return generateRankingComment(result);
  }
  if (result.type === 'interactive') {
    return generateInteractiveComment(testId, result);
  }
  return '';
}

function generateInteractiveComment(testId, result) {
  const { percentage, score } = result;
  let comment = '';
  
  if (testId.includes('dikkat')) {
    if (percentage >= 80) comment = `🚀 **Üstün Dikkat:** Aday yüksek odaklanma ve hızlı tepki verme becerisi sergiledi. Dikkat gerektiren işlerde yüksek performans beklenir.`;
    else if (percentage >= 60) comment = `✅ **Yeterli Odaklanma:** Aday kabul edilebilir düzeyde dikkat ve tepki hızı gösterdi. Standart operasyonel görevler için uygundur.`;
    else comment = `⚠️ **Dikkat Dağınıklığı:** Test sırasında odaklanma hataları ve düşük tepki hızı gözlemlendi. Hata payı kritik olan işlerde risk oluşturabilir.`;
  } else if (testId.includes('gorsel')) {
    if (percentage >= 80) comment = `👁️ **Güçlü Görsel Algı:** Aday görsel detayları fark etme ve ayırt etme konusunda oldukça başarılıdır. Kontrol ve denetim işlerinde avantaj sağlar.`;
    else if (percentage >= 60) comment = `✅ **Standart Görsel Algı:** Adayın görsel ayırt edicilik becerisi yeterli düzeydedir.`;
    else comment = `🔴 **Görsel Algı Geliştirilmeli:** Görsel detayları yakalama ve karmaşık örüntüleri çözme konusunda zorluk gözlemlendi.`;
  }

  return comment || `Test tamamlandı. Skor: ${score}, Başarı Oranı: %${percentage}`;
}

function generateLikertComment(testId, result) {
  const dims = Object.values(result.dimensions);
  const strong = dims.filter(d => d.percentage >= 70).map(d => d.label);
  const weak = dims.filter(d => d.percentage < 50).map(d => d.label);
  const mid = dims.filter(d => d.percentage >= 50 && d.percentage < 70).map(d => d.label);

  let comment = '';
  if (strong.length > 0) {
    comment += `🟢 **Güçlü Alanlar:** ${strong.join(', ')} boyutlarında yüksek puanlar gözlemlenmektedir. `;
  }
  if (mid.length > 0) {
    comment += `🟡 **Orta Düzey:** ${mid.join(', ')} boyutlarında gelişim potansiyeli mevcuttur. `;
  }
  if (weak.length > 0) {
    comment += `🔴 **Gelişim Alanları:** ${weak.join(', ')} boyutlarında ek destek ve eğitim önerilmektedir. `;
  }

  // Test-spesifik yorumlar
  const commentMap = {
    duygusal_zeka: result.overallPercentage >= 70
      ? 'Aday duygusal zeka konusunda güçlü bir profile sahiptir. İlişki yönetimi ve empati becerisi yüksektir.'
      : 'Duygusal farkındalık ve yönetim becerileri geliştirilmelidir. Koçluk desteği önerilir.',
    is_motivasyonu: result.overallPercentage >= 70
      ? 'Motivasyon profili güçlüdür. İçsel güdülenme ve başarı odaklılık ön plana çıkmaktadır.'
      : 'Motivasyon kaynakları değerlendirilmeli, uygun teşvik mekanizmaları belirlenmelidir.',
    stres_basa_cikma: 'Stresle başa çıkma stratejileri incelenmiştir. Pozitif stratejilerin (problem odaklı, sosyal destek) kullanımı değerlendirilmelidir.',
    is_guvenligi_tutum: result.overallPercentage >= 70
      ? 'İş güvenliği bilinci yüksektir. Kural uyumu ve risk algısı güçlüdür.'
      : 'İş güvenliği farkındalığı geliştirilmeli, ek eğitim önerilmektedir.',
    kisilik_big5: 'Kişilik boyutları değerlendirilmiştir. Pozisyon uyumu için ilgili boyutlar karşılaştırılmalıdır.',
  };

  if (commentMap[testId]) {
    comment += '\n\n📝 ' + commentMap[testId];
  }

  return comment || 'Değerlendirme tamamlanmıştır. Detaylı boyut analizi için puanları inceleyiniz.';
}

function generateMCQComment(testId, result) {
  const { percentage, difficultyBreakdown: db } = result;
  let comment = '';

  if (percentage >= 80) {
    comment = `🎯 Aday bu alanda **üstün başarı** göstermiştir (%${percentage}). Bilgi düzeyi pozisyon gereksinimleriyle yüksek uyumluluk göstermektedir.`;
  } else if (percentage >= 60) {
    comment = `✅ Aday bu alanda **yeterli** performans sergilemiştir (%${percentage}). Bazı alt alanlarda ek eğitim yararlı olabilir.`;
  } else if (percentage >= 40) {
    comment = `⚠️ Aday bu alanda **gelişim gerektiren** bir performans sergilemiştir (%${percentage}). Temel konularda güçlendirme eğitimi önerilmektedir.`;
  } else {
    comment = `🔴 Aday bu alanda **yetersiz** performans göstermiştir (%${percentage}). Kapsamlı bir eğitim programı gereklidir.`;
  }

  // Zorluk bazlı analiz
  if (db.kolay && db.kolay.total > 0) {
    const kolayPct = Math.round((db.kolay.correct / db.kolay.total) * 100);
    if (kolayPct < 60) comment += ` Dikkat: Temel düzey sorularda başarı oranı düşüktür (%${kolayPct}).`;
  }
  if (db.zor && db.zor.total > 0) {
    const zorPct = Math.round((db.zor.correct / db.zor.total) * 100);
    if (zorPct >= 70) comment += ` İleri düzey konularda güçlü kavrayış gözlemlenmektedir.`;
  }

  return comment;
}

function generateForcedChoiceComment(result) {
  const { primaryRole, secondaryRole } = result;
  if (!primaryRole) return 'Yeterli yanıt alınamamıştır.';
  let c = `🎭 Baskın takım rolü: **${primaryRole.label}** (${primaryRole.icon}). ${primaryRole.description || ''}`;
  if (secondaryRole) c += ` İkincil rol: **${secondaryRole.label}** (${secondaryRole.icon}).`;
  c += '\n\nBu profil, adayın ekip içinde doğal olarak üstleneceği işlevi göstermektedir. Pozisyon gereksinimleriyle uyumu değerlendirilmelidir.';
  return c;
}

function generateRankingComment(result) {
  const sorted = Object.values(result.dimensions).sort((a, b) => b.score - a.score);
  if (sorted.length === 0) return 'Yeterli yanıt alınamamıştır.';
  const top2 = sorted.slice(0, 2).map(d => d.label);
  const bottom = sorted.slice(-1).map(d => d.label);
  return `💎 En önemli iş değerleri: **${top2.join('** ve **')}**. En az önceliklenen: **${bottom[0] || '-'}**.\n\nBu değer profili, adayın kariyer motivasyonlarını ve organizasyon kültürüne uyumunu anlamak için kullanılmalıdır.`;
}

function generateScenarioComment(result) {
  if (!result.primaryStyle) return 'Yeterli yanıt alınamamıştır.';
  const s = result.primaryStyle;
  return `📖 Baskın öğrenme stili: **${s.label}** (${s.icon}). ${s.description || ''}\n\nEğitim ve gelişim programları bu öğrenme stiline uygun olarak planlanmalıdır.`;
}

// ─── BOYUT RENKLERİ ────────────────────────────────────────
export function getDimensionColor(index) {
  const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4', '#3B82F6', '#EF4444', '#84CC16', '#F97316'];
  return colors[index % colors.length];
}
