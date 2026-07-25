import { GoogleGenAI } from '@google/genai';

export const getAIClient = () => {
  const apiKey = localStorage.getItem('kobi_geminiApiKey');
  if (!apiKey || apiKey === '""' || apiKey.length < 10) {
    throw new Error('Geçerli bir Gemini API Anahtarı bulunamadı. Lütfen ayarlardan API anahtarınızı girin.');
  }
  
  // Initialize SDK
  const ai = new GoogleGenAI({ apiKey: apiKey.replace(/['"]+/g, '') });
  return ai;
};

export const generateStrategicReport = async (swotData, checkupScores) => {
  const ai = getAIClient();
  const prompt = `Sen kıdemli bir yönetim danışmanısın. Aşağıdaki şirket verilerini (SWOT analizi ve anket puanları) inceleyerek bana Markdown formatında çok profesyonel bir rapor oluştur.
Lütfen sadece şu iki başlığı içer:
1. **Yönetici Özeti** (Durumun kısa bir tespiti)
2. **Stratejik Aksiyon Planı** (Öncelikli 3-4 maddelik eylem planı)

SWOT Verileri:
${JSON.stringify(swotData, null, 2)}

Check-up Puanları (1-5 arası):
${JSON.stringify(checkupScores, null, 2)}

Sadece Markdown raporunu döndür, başka açıklama ekleme.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  return response.text;
};

export const generateJobAnalysisTaslak = async (titleName) => {
  const ai = getAIClient();
  const prompt = `Sen uzman bir İnsan Kaynakları profesyonelisin. '${titleName}' pozisyonu için aşağıdaki JSON formatında veriler üret. 
Döndüreceğin çıktı kesinlikle geçerli bir JSON olmalıdır. Markdown ( \`\`\`json ) kullanma, sadece saf JSON metni ver.

Format:
{
  "purpose": "Pozisyonun şirketteki varoluş amacı (2-3 cümle).",
  "responsibilities": ["Sorumluluk 1", "Sorumluluk 2", "Sorumluluk 3", "Sorumluluk 4"],
  "competencies": ["Davranışsal: Ekip çalışması", "Davranışsal: Problem Çözme"],
  "skills": ["Teknik: Veri Analizi", "Teknik: Raporlama"],
  "kpiDefinitions": ["Aylık satış hedefi %", "Müşteri memnuniyet skoru"]
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  
  try {
     let text = response.text.trim();
     if(text.startsWith('\`\`\`json')){
       text = text.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
     } else if (text.startsWith('\`\`\`')){
       text = text.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
     }
     return JSON.parse(text);
  } catch(err) {
     console.error("JSON Parse Error: ", response.text);
     throw new Error("AI düzgün formatta JSON üretemedi.");
  }
};

export const improvePerformanceFeedback = async (draftText) => {
  const ai = getAIClient();
  const prompt = `Sen profesyonel bir İK yöneticisisin. Aşağıdaki yöneticinin girdiği kaba/taslak performans geri bildirim notunu oku. 'Sandviç metodu' (olumlu ile başla - geliştirilmesi gereken alanları söyle - olumlu ve motive edici şekilde bitir) kullanarak çok yapıcı, kurumsal ve profesyonel bir performans değerlendirme raporuna dönüştür. 
Lütfen sadece düzeltilmiş metni ver.

Taslak Not: "${draftText}"`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  return response.text;
};
