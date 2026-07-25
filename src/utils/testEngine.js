// SELECTEST — TEST MOTORU
// Rastgele soru seçimi, eşit zorluk dağılımı, puanlama

import { questionBank } from '../data/testQuestionBank';

// Fisher-Yates shuffle
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Temel Yetenek testi oluştur
 * Her alt boyuttan eşit sayıda kolay/orta/zor soru seçer
 * @param {number} perDifficulty - Her zorluk seviyesinden seçilecek soru sayısı (varsayılan 1)
 * @returns {Array} Rastgele sıralanmış soru listesi
 */
export function generateBasicAbilityTest(perDifficulty = 1) {
  const sections = [];
  const subDimensions = Object.entries(questionBank.TEMEL_YETENEK);

  for (const [key, sub] of subDimensions) {
    const sectionQuestions = [];
    
    // Her zorluk seviyesinden eşit sayıda soru seç
    ['kolay', 'orta', 'zor'].forEach(difficulty => {
      const pool = sub[difficulty] || [];
      const selected = shuffle(pool).slice(0, perDifficulty);
      selected.forEach(q => {
        sectionQuestions.push({
          ...q,
          subDimension: key,
          subDimensionLabel: sub.label,
          difficulty,
          dimension: 'TEMEL_YETENEK',
        });
      });
    });

    sections.push({
      key,
      label: sub.label,
      description: sub.description,
      questions: shuffle(sectionQuestions), // Alt boyut içinde de karıştır
    });
  }

  return sections;
}

/**
 * Temel Yetenek puanlaması
 * Her alt boyut için 0-100 arası puan hesaplar
 * Zorluk katsayıları: kolay=1, orta=1.5, zor=2
 */
export function scoreBasicAbility(sections, answers) {
  const scores = {};
  const difficultyMultiplier = { kolay: 1, orta: 1.5, zor: 2 };

  for (const section of sections) {
    let totalWeight = 0;
    let earnedWeight = 0;

    for (const q of section.questions) {
      const mult = difficultyMultiplier[q.difficulty] || 1;
      totalWeight += mult;
      if (answers[q.id] === q.a) {
        earnedWeight += mult;
      }
    }

    scores[section.key] = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
  }

  return scores;
}

/**
 * Kişilik testi puanlaması
 * Her boyut için 0-100 arası normalize puan
 */
export function scorePersonality(personalityBank, answers) {
  const scores = {};

  for (const [key, dimension] of Object.entries(personalityBank)) {
    let total = 0;
    let count = 0;

    for (const item of dimension.items) {
      const answer = answers[item.id];
      if (answer !== undefined) {
        total += item.reverse ? (6 - answer) : answer; // Ters puanlama
        count++;
      }
    }

    // 1-5 ölçeğini 0-100'e normalize et
    scores[key] = count > 0 ? Math.round(((total / count - 1) / 4) * 100) : 0;
  }

  return scores;
}

/**
 * Tüm boyutların birleşik skor dizisini oluştur
 * competencyKeys sırasına göre 18 elemanlık dizi
 */
export function buildScoreArray(basicScores, visualScores, attentionScores, personalityScores) {
  return [
    // TEMEL YETENEK (6)
    basicScores.genel_kultur || 0,
    basicScores.temel_matematik || 0,
    basicScores.sayisal_akil_yurutme || 0,
    basicScores.oruntu_takibi || 0,
    basicScores.sozel_akil_yurutme || 0,
    basicScores.yonerge_takibi || 0,
    // GÖRSEL (3)
    visualScores.gorsel_dikkat || 0,
    visualScores.gorsel_ayirt_edicilik || 0,
    visualScores.sekil_uzay || 0,
    // DİKKAT (4)
    attentionScores.dikkat || 0,
    attentionScores.zamanlama || 0,
    attentionScores.odaklanma || 0,
    attentionScores.oz_kontrol || 0,
    // KİŞİLİK (5)
    personalityScores.duygusal_dengelilik || 0,
    personalityScores.disa_donukluk || 0,
    personalityScores.deneyime_aciklik || 0,
    personalityScores.yumusak_baslilik || 0,
    personalityScores.sorumluluk || 0,
  ];
}
