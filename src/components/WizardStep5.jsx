import React from 'react';

export default function WizardStep5({ formData, setFormData }) {
  const defaults = {
    travelFrequency: '',
    physicalEffort: '',
    workEnvironment: '',
    riskLevel: '',
    workingHours: '',
    specialConditions: ''
  };

  const conds = formData.workingConditions || defaults;

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      workingConditions: {
        ...(prev.workingConditions || defaults),
        [field]: value
      }
    }));
  };

  const inputStyle = { width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', marginBottom: '1rem' };
  const labelStyle = { display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#475569', fontSize: '0.9rem' };

  return (
    <div className="fade-in" style={{ padding: '2rem', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      
      {/* SOL KOLON */}
      <div>
        <h3 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', color: '#0f172a', marginBottom: '1.5rem' }}>Fiziksel Ortam & Koşullar</h3>
        
        <label style={labelStyle}>Çalışma Ortamı *</label>
        <select value={conds.workEnvironment} onChange={e => handleChange('workEnvironment', e.target.value)} style={inputStyle}>
          <option value="">Seçiniz...</option>
          <option value="Ofis İçi">Ofis İçi (Masa Başı)</option>
          <option value="Saha / Müşteri Ziyareti">Saha / Müşteri Ziyareti</option>
          <option value="Üretim / Fabrika Sahası">Üretim / Fabrika Sahası</option>
          <option value="Hibrit (Ofis + Saha)">Hibrit (Ofis + Saha)</option>
          <option value="Uzaktan / Remote">Uzaktan / Remote</option>
        </select>

        <label style={labelStyle}>Seyahat Sıklığı *</label>
        <select value={conds.travelFrequency} onChange={e => handleChange('travelFrequency', e.target.value)} style={inputStyle}>
          <option value="">Seçiniz...</option>
          <option value="Yok (Seyahat Gerektirmez)">Yok (Seyahat Gerektirmez)</option>
          <option value="Nadir (Yılda Birkaç Kez)">Nadir (Yılda Birkaç Kez)</option>
          <option value="Düzenli (Ayda 1-2 Kez)">Düzenli (Ayda 1-2 Kez)</option>
          <option value="Sık (Haftada Birden Fazla)">Sık (Haftada Birden Fazla)</option>
        </select>

        <label style={labelStyle}>Çalışma Saatleri Düzeni *</label>
        <select value={conds.workingHours} onChange={e => handleChange('workingHours', e.target.value)} style={inputStyle}>
          <option value="">Seçiniz...</option>
          <option value="Sabit Mesai (09:00 - 18:00)">Sabit Mesai (09:00 - 18:00)</option>
          <option value="Vardiyalı Sistem">Vardiyalı Sistem</option>
          <option value="Esnek Çalışma Saatleri">Esnek Çalışma Saatleri</option>
        </select>
      </div>

      {/* SAĞ KOLON */}
      <div>
        <h3 style={{ borderBottom: '2px solid transparent', paddingBottom: '0.5rem', color: 'transparent', marginBottom: '1.5rem', userSelect: 'none' }}>Fiziksel</h3>
        
        <label style={labelStyle}>İSG Risk Seviyesi *</label>
        <select value={conds.riskLevel} onChange={e => handleChange('riskLevel', e.target.value)} style={inputStyle}>
          <option value="">Seçiniz...</option>
          <option value="Düşük (Az Tehlikeli, Ofis vb.)">Düşük (Az Tehlikeli, Ofis vb.)</option>
          <option value="Orta (Tehlikeli)">Orta (Tehlikeli)</option>
          <option value="Yüksek (Çok Tehlikeli, Ağır Sanayi vb.)">Yüksek (Çok Tehlikeli, Ağır Sanayi vb.)</option>
        </select>

        <label style={labelStyle}>Fiziksel Efor Gereksinimi *</label>
        <select value={conds.physicalEffort} onChange={e => handleChange('physicalEffort', e.target.value)} style={inputStyle}>
          <option value="">Seçiniz...</option>
          <option value="Düşük (Örn: Ekran Karşısı, Masa Başı)">Düşük (Örn: Ekran Karşısı, Masa Başı)</option>
          <option value="Orta (Örn: Ayakta Durma, Hafif Ekipman)">Orta (Örn: Ayakta Durma, Hafif Ekipman)</option>
          <option value="Yüksek (Örn: Ağır Yük Kaldırma, Bedensel Efor)">Yüksek (Örn: Ağır Yük Kaldırma, Bedensel Efor)</option>
        </select>

        <label style={labelStyle}>Özel Koşullar ve Notlar (Opsiyonel)</label>
        <textarea 
          value={conds.specialConditions} 
          onChange={e => handleChange('specialConditions', e.target.value)} 
          placeholder="Açık havada soğuğa maruz kalma riski bulunmaktadır..."
          style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }}
        />
      </div>

    </div>
  );
}
