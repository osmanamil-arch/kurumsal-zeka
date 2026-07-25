import React from 'react';

export default function WizardStep4({ formData, setFormData }) {
  const kpiList = formData.kpiDefinitions || [];
  const totalWeight = kpiList.reduce((sum, kpi) => sum + (Number(kpi.weight) || 0), 0);

  const handleAddKPI = () => {
    const newKpi = {
      id: 'kpi_' + Date.now().toString(),
      title: '',
      targetValue: '',
      unit: '%', // %, Adet, TL, USD vb.
      weight: 0,
      frequency: 'Aylık'
    };
    setFormData(prev => ({ ...prev, kpiDefinitions: [...(prev.kpiDefinitions || []), newKpi] }));
  };

  const handleUpdateKPI = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      kpiDefinitions: (prev.kpiDefinitions || []).map(k => k.id === id ? { ...k, [field]: value } : k)
    }));
  };

  const handleRemoveKPI = (id) => {
    setFormData(prev => ({
      ...prev,
      kpiDefinitions: (prev.kpiDefinitions || []).filter(k => k.id !== id)
    }));
  };

  const inputStyle = { width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' };

  return (
    <div className="fade-in" style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>Adım 4: KPI & Hedefler</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
            Pozisyonun başarısını ölçecek metrikleri giriniz. Ağırlıkların (Weight) toplamı %100 olmak zorundadır.
          </p>
        </div>
        <div style={{ padding: '0.5rem 1rem', background: totalWeight === 100 ? '#dcfce7' : '#fee2e2', color: totalWeight === 100 ? '#166534' : '#991b1b', borderRadius: '6px', fontWeight: 'bold' }}>
          Toplam Ağırlık: %{totalWeight}
        </div>
      </div>

      {kpiList.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#fff', borderRadius: '8px', color: '#64748b', border: '1px dashed #cbd5e1' }}>
          Henüz KPI eklenmemiş. Aşağıdaki butondan yeni hedef ekleyebilirsiniz.
        </div>
      )}

      {kpiList.map((kpi, index) => (
        <div key={kpi.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '1rem', marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: '#e2e8f0', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '0.8rem', fontWeight: 'bold' }}>
            {index + 1}
          </div>
          
          <div style={{ flex: 3 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>KPI Başlığı *</label>
            <input type="text" value={kpi.title} onChange={e => handleUpdateKPI(kpi.id, 'title', e.target.value)} placeholder="Örn: Yeni Müşteri Kazanımı" style={inputStyle} />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Hedef Değer *</label>
            <input type="text" value={kpi.targetValue} onChange={e => handleUpdateKPI(kpi.id, 'targetValue', e.target.value)} placeholder="100, 15 etc." style={inputStyle} />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Birim *</label>
            <select value={kpi.unit} onChange={e => handleUpdateKPI(kpi.id, 'unit', e.target.value)} style={inputStyle}>
              <option value="%">% (Yüzde)</option>
              <option value="Adet">Adet</option>
              <option value="TL">TL</option>
              <option value="USD">USD</option>
              <option value="Gün">Gün</option>
              <option value="Puan">Puan</option>
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Ağırlık (%) *</label>
            <input type="number" min="1" max="100" value={kpi.weight} onChange={e => handleUpdateKPI(kpi.id, 'weight', Number(e.target.value))} style={inputStyle} />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Sıklık *</label>
            <select value={kpi.frequency} onChange={e => handleUpdateKPI(kpi.id, 'frequency', e.target.value)} style={inputStyle}>
              <option value="Günlük">Günlük</option>
              <option value="Haftalık">Haftalık</option>
              <option value="Aylık">Aylık</option>
              <option value="Çeyreklik">Çeyreklik (3 Ay)</option>
              <option value="Yıllık">Yıllık</option>
            </select>
          </div>

          <button title="Kaldır" onClick={() => handleRemoveKPI(kpi.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '1.2rem', marginTop: '1.2rem' }}>✖</button>
        </div>
      ))}

      <button onClick={handleAddKPI} style={{ background: '#1e293b', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
        + Yeni KPI Ekle
      </button>

    </div>
  );
}
