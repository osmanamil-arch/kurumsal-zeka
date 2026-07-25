import React, { useState } from 'react';

export default function ContentManagement({ catalog, setCatalog }) {
  const [formData, setFormData] = useState({ title: '', category: 'technical', format: 'e_learning', duration: '', isMandatory: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTraining = {
      id: `trn_${Date.now()}`,
      title: formData.title,
      description: 'Yeni eklenen eğitim içeriği.',
      category: formData.category,
      format: formData.format,
      duration: Number(formData.duration),
      isMandatory: formData.isMandatory,
      tags: [],
      targetFamilyIds: [],
      targetLevelIds: [],
      isActive: true
    };
    setCatalog([newTraining, ...catalog]);
    alert('Yeni eğitim içeriği başarıyla eklendi!');
    setFormData({ title: '', category: 'technical', format: 'e_learning', duration: '', isMandatory: false });
  };

  return (
    <div className="content-management fade-in">
      <div className="header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>İçerik Yönetimi</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Eğitim kataloğuna yeni içerik ekleme ve düzenleme</p>
      </div>

      <div className="form-container glass" style={{ background: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid #e2e8f0', maxWidth: '600px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>Eğitim Başlığı</label>
            <input 
              type="text" 
              required
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }} 
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>Kategori</label>
              <select 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}>
                <option value="technical">Teknik / Mesleki</option>
                <option value="behavioral">Davranışsal / Soft Skill</option>
                <option value="mandatory">Zorunlu (İSG, vb.)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>Format</label>
              <select 
                value={formData.format} 
                onChange={e => setFormData({...formData, format: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}>
                <option value="e_learning">E-Learning</option>
                <option value="classroom">Sınıf Eğitimi</option>
                <option value="workshop">Workshop</option>
                <option value="online_live">Online Canlı</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>Süre (Saat)</label>
            <input 
              type="number" 
              required
              value={formData.duration} 
              onChange={e => setFormData({...formData, duration: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }} 
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" 
              id="isMandatory"
              checked={formData.isMandatory}
              onChange={e => setFormData({...formData, isMandatory: e.target.checked})}
              style={{ width: '18px', height: '18px' }}
            />
            <label htmlFor="isMandatory" style={{ fontWeight: '500', color: '#334155' }}>Zorunlu Eğitim mi?</label>
          </div>

          <div style={{ marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" style={{ padding: '0.75rem 2rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}>
              Eğitimi Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
