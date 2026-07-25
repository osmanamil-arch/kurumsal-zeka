// SELECTEST — İNTERAKTİF TEST YAPILANDIRMALARI
// Her test 9 round (3 Kolay, 3 Orta, 3 Zor) içerecek şekilde düzenlenmiştir.

const levelGen = (l, count, extra) => Array(count).fill(null).map(() => ({ level: l, ...extra }));

export const attentionTests = {
  sembol: {
    label: 'Sembol Arama',
    type: 'symbol_search',
    config: {
      instruction: 'Test başlamadan önce ekranda belirecek olan Hedef Sembolü bulun.',
      rounds: [
        ...levelGen('Kolay', 5, { gridSize: 25, targetCount: 1, timeLimit: 15, distractors: ['O', '0', 'Q', 'C', 'G'] }),
        ...levelGen('Orta', 5, { gridSize: 49, targetCount: 2, timeLimit: 20, distractors: ['p', 'q', 'b', 'd'] }),
        ...levelGen('Zor', 5, { gridSize: 100, targetCount: 3, timeLimit: 30, distractors: ['♠', '♣', '♥', '♦', '♤', '♧', '♡', '♢'] })
      ]
    }
  },
  reaksiyon: {
    label: 'Reaksiyon ve Dürtü Kontrolü (CPT)',
    type: 'reaction_time',
    config: {
      instruction: 'Ekranda YEŞİL daire gördüğünüz an TIKLAYABİLDİĞİNİZ EN HIZLI ŞEKİLDE tıklayın! Diğer renklere (Kırmızı, Mavi) kesinlikle tıklamayın. Test 180 saniye sürecek kesintisiz bir maratondur.',
      rounds: [
         { 
            id: 'round-1',
            level: 'CPT Maraton', 
            mode: 'continuous', 
            timeLimit: 180, 
            targetColor: '#22C55E', 
            distractorColors: ['#EF4444', '#3B82F6'], 
            totalTargets: 50,
            totalDistractors: 100,
            displayDurationMs: 800,
            intervalMs: 1200
         }
      ]
    }
  },
  stroop: {
    label: 'Stroop Testi (Bilişsel Esneklik)',
    type: 'stroop',
    config: {
      instruction: 'Ekranda beliren kelime ne olursa olsun, yazıyı okumadan KELİMENİN YAZILDIĞI RENGİ olabildiğince hızlı seçin.',
      colors: ['Kırmızı', 'Mavi', 'Yeşil', 'Sarı', 'Siyah'],
      colorCodes: { 'Kırmızı': '#EF4444', 'Mavi': '#3B82F6', 'Yeşil': '#22C55E', 'Sarı': '#EAB308', 'Siyah': '#0F172A' },
      rounds: [
         { 
            id: 'round-1',
            level: 'Stroop Blok', 
            mode: 'academic_stroop', 
            timeLimit: 300,
            maxWaitMs: 4000, 
            neutralCount: 20,
            congruentCount: 20,
            incongruentCount: 20
         }
      ]
    }
  },
  gonogo: {
    label: 'Go / No-Go',
    type: 'go_nogo',
    config: {
      instruction: 'İlgili sembolü görünce tıklayın veya durun.',
      rounds: [
        ...levelGen('Kolay', 3, { speed: 800, go: '🟢', nogo: '🔴', timeLimit: 10 }),
        ...levelGen('Orta', 3, { speed: 600, go: '🟢', nogo: '🟡', timeLimit: 12 }),
        ...levelGen('Zor', 3, { speed: 400, mode: 'conflict', timeLimit: 15 })
      ]
    }
  }
};

export const visualTests = {
  farkli: {
    label: 'Farklı Olanı Bul',
    type: 'odd_one_out',
    config: {
      instruction: 'Şekillerden farklı olanı (farklı yön, renk veya tip) bulun.',
      rounds: [
        ...levelGen('Kolay', 3, { gridSize: 9, complexity: 'basic', timeLimit: 12 }),
        ...levelGen('Orta', 3, { gridSize: 16, complexity: 'medium', timeLimit: 15 }),
        ...levelGen('Zor', 3, { gridSize: 25, complexity: 'high', timeLimit: 20 })
      ]
    }
  },
  dondurme: {
    label: 'Zihinsel Döndürme',
    type: 'mental_rotation',
    config: {
      instruction: 'Üstteki şeklin aynısı olan (sadece döndürülmüş) seçeneği bulun.',
      rounds: [
        ...levelGen('Kolay', 3, { rotation: 180, options: 2, timeLimit: 15 }),
        ...levelGen('Orta', 3, { rotation: 90, options: 3, timeLimit: 20 }),
        ...levelGen('Zor', 3, { rotation: 45, options: 4, timeLimit: 25 })
      ]
    }
  }
};
