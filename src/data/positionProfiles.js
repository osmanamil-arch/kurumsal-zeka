// SELECTEST — POZİSYON AĞIRLIK PROFİLLERİ
// SELEC.xlsx verilerinden oluşturulmuştur
// Her pozisyon için 18 yetkinlik boyutunun ağırlık puanı (3-12 arası)

// Boyut anahtarları (sırasıyla)
export const competencyKeys = [
  // TEMEL YETENEK
  { key: 'genel_kultur', dim: 'TEMEL_YETENEK', label: 'Genel Kültür' },
  { key: 'temel_matematik', dim: 'TEMEL_YETENEK', label: 'Temel Matematik' },
  { key: 'sayisal_akil_yurutme', dim: 'TEMEL_YETENEK', label: 'Sayısal Akıl Yürütme' },
  { key: 'oruntu_takibi', dim: 'TEMEL_YETENEK', label: 'Örüntü Takibi' },
  { key: 'sozel_akil_yurutme', dim: 'TEMEL_YETENEK', label: 'Sözel Akıl Yürütme' },
  { key: 'yonerge_takibi', dim: 'TEMEL_YETENEK', label: 'Yönerge Takibi' },
  // GÖRSEL
  { key: 'gorsel_dikkat', dim: 'GORSEL', label: 'Görsel Dikkat' },
  { key: 'gorsel_ayirt_edicilik', dim: 'GORSEL', label: 'Görsel Ayırt Edicilik' },
  { key: 'sekil_uzay', dim: 'GORSEL', label: 'Şekil-Uzay' },
  // DİKKAT
  { key: 'dikkat', dim: 'DIKKAT', label: 'Dikkat' },
  { key: 'zamanlama', dim: 'DIKKAT', label: 'Zamanlama' },
  { key: 'odaklanma', dim: 'DIKKAT', label: 'Odaklanma' },
  { key: 'oz_kontrol', dim: 'DIKKAT', label: 'Öz Kontrol' },
  // KİŞİLİK
  { key: 'duygusal_dengelilik', dim: 'KISILIK', label: 'Duygusal Dengelilik' },
  { key: 'disa_donukluk', dim: 'KISILIK', label: 'Dışa Dönüklük' },
  { key: 'deneyime_aciklik', dim: 'KISILIK', label: 'Deneyime Açıklık' },
  { key: 'yumusak_baslilik', dim: 'KISILIK', label: 'Yumuşak Başlılık' },
  { key: 'sorumluluk', dim: 'KISILIK', label: 'Sorumluluk' },
];

// Pozisyon profilleri (ağırlıklar sırasıyla competencyKeys dizisine karşılık gelir)
export const positionProfiles = [
  {
    id: 'mekanik_teknisyen', title: 'Mekanik Teknisyen', category: 'mavi',
    weights: [6, 8, 10, 10, 6, 10, 10, 10, 10, 10, 10, 8, 10, 7, 5, 7, 8, 10],
  },
  {
    id: 'mekanik_formen', title: 'Mekanik Formen', category: 'mavi',
    weights: [10, 9, 10, 5, 10, 9, 10, 8, 10, 8, 8, 10, 10, 10, 10, 10, 5, 12],
  },
  {
    id: 'elektrik_teknisyeni', title: 'Elektrik Teknisyeni', category: 'mavi',
    weights: [6, 8, 10, 10, 6, 10, 12, 10, 10, 10, 10, 8, 10, 7, 5, 7, 8, 10],
  },
  {
    id: 'yedek_parca', title: 'Yedek Parça Elemanı', category: 'mavi',
    weights: [8, 9, 10, 8, 8, 10, 8, 10, 8, 10, 8, 8, 10, 10, 8, 8, 8, 10],
  },
  {
    id: 'kaporta_teknisyeni', title: 'Kaporta Teknisyeni', category: 'mavi',
    weights: [6, 8, 9, 10, 6, 10, 10, 10, 10, 10, 10, 8, 10, 7, 5, 7, 8, 10],
  },
  {
    id: 'kaporta_formeni', title: 'Kaporta Formeni', category: 'mavi',
    weights: [10, 9, 10, 5, 10, 9, 12, 8, 10, 8, 8, 10, 10, 10, 10, 10, 5, 12],
  },
  {
    id: 'boya_teknisyeni', title: 'Boya Teknisyeni', category: 'mavi',
    weights: [6, 8, 9, 10, 6, 10, 10, 10, 10, 10, 10, 8, 10, 7, 5, 7, 8, 10],
  },
  {
    id: 'boya_formeni', title: 'Boya Formeni', category: 'mavi',
    weights: [10, 9, 10, 5, 10, 9, 12, 8, 10, 8, 8, 10, 10, 10, 10, 10, 5, 12],
  },
  {
    id: 'arac_teslimat', title: 'Araç Teslimat Görevlisi', category: 'mavi',
    weights: [8, 9, 7, 7, 8, 9, 10, 10, 8, 8, 10, 7, 10, 8, 8, 7, 8, 10],
  },
  {
    id: 'yikama_elemani', title: 'Yıkama Elemanı', category: 'mavi',
    weights: [6, 6, 5, 5, 5, 3, 8, 7, 6, 8, 10, 7, 10, 7, 5, 5, 8, 10],
  },
  {
    id: 'sofor', title: 'Şoför', category: 'mavi',
    weights: [8, 9, 7, 7, 8, 6, 7, 7, 6, 8, 10, 6, 10, 8, 6, 5, 8, 10],
  },
  {
    id: 'cekici', title: 'Çekici', category: 'mavi',
    weights: [6, 9, 7, 7, 7, 10, 7, 7, 6, 8, 10, 6, 10, 8, 6, 5, 8, 10],
  },
];

// Yardımcı: pozisyon uygunluk puanı hesapla (0-100 arası normalize)
export function calculateFitScore(candidateScores, positionWeights) {
  if (!candidateScores || !positionWeights) return 0;
  const maxPossible = positionWeights.reduce((sum, w) => sum + w * 100, 0);
  const actual = positionWeights.reduce((sum, w, i) => {
    const score = candidateScores[i] || 0; // 0-100 arası normalize skor
    return sum + w * score;
  }, 0);
  return Math.round((actual / maxPossible) * 100);
}

// Yardımcı: tüm pozisyonlar için sıralı uygunluk hesapla
export function rankPositions(candidateScores, profiles = positionProfiles) {
  return profiles
    .map(p => ({
      ...p,
      fitScore: calculateFitScore(candidateScores, p.weights),
    }))
    .sort((a, b) => b.fitScore - a.fitScore);
}
