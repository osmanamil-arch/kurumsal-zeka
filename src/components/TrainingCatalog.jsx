import React, { useState } from 'react';

export default function TrainingCatalog({ catalog, setCatalog, userRole }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');

  const categories = [
    { id: 'all', label: 'Tüm Eğitimler' },
    { id: 'technical', label: 'Teknik / Mesleki' },
    { id: 'behavioral', label: 'Davranışsal / Yetkinlik' },
    { id: 'mandatory', label: 'Zorunlu / Yasal' },
    { id: 'strategic', label: 'Stratejik Gelişim' }
  ];

  const formats = [
    { id: 'all', label: 'Tüm Formatlar' },
    { id: 'classroom', label: 'Sınıf Eğitimi' },
    { id: 'online_live', label: 'Canlı Online' },
    { id: 'e_learning', label: 'E-Learning' },
    { id: 'workshop', label: 'Workshop / Atölye' }
  ];

  const filteredCatalog = catalog.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchFormat = selectedFormat === 'all' || t.format === selectedFormat;
    return matchSearch && matchCategory && matchFormat;
  });

  const getFormatIcon = (format) => {
    switch(format) {
      case 'classroom': return '🏫';
      case 'online_live': return '💻';
      case 'e_learning': return '📱';
      case 'workshop': return '🛠️';
      default: return '🎓';
    }
  };

  const getFormatLabel = (format) => {
    const f = formats.find(f => f.id === format);
    return f ? f.label : format;
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>📚 Eğitim Kütüphanesi</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Şirket içi ve dışı tüm eğitim programlarının merkezi kataloğu.</p>
        </div>
        {(userRole === 'superadmin' || userRole === 'danisman') && (
          <button style={{ padding: '0.6rem 1.2rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            + Yeni Eğitim Ekle
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <input 
          type="text" 
          placeholder="Eğitim adı veya etiket ara..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
        />
        <select 
          value={selectedCategory} 
          onChange={e => setSelectedCategory(e.target.value)}
          style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', minWidth: '180px' }}
        >
          {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select 
          value={selectedFormat} 
          onChange={e => setSelectedFormat(e.target.value)}
          style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', minWidth: '150px' }}
        >
          {formats.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filteredCatalog.map(training => (
          <div key={training.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.5rem', position: 'relative', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
            {training.isMandatory && (
              <span style={{ position: 'absolute', top: '-10px', right: '20px', background: '#ef4444', color: 'white', padding: '0.2rem 0.8rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(239,68,68,0.3)' }}>
                ZORUNLU
              </span>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>{getFormatIcon(training.format)}</span>
              <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                {categories.find(c => c.id === training.category)?.label}
              </span>
            </div>

            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '1.1rem', lineHeight: '1.4' }}>{training.title}</h4>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 1rem 0', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {training.description}
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {training.tags.slice(0,3).map(tag => (
                <span key={tag} style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 500 }}>
                  #{tag}
                </span>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', color: '#475569' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>⏱️</span> {training.duration} Saat
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>📍</span> {getFormatLabel(training.format)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', gridColumn: 'span 2' }}>
                <span>👤</span> {training.provider}
              </div>
            </div>
            
            <button style={{ width: '100%', marginTop: '1rem', padding: '0.5rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
              Detayları İncele
            </button>
          </div>
        ))}
      </div>
      
      {filteredCatalog.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>🔍</span>
          <p>Arama kriterlerinize uygun eğitim bulunamadı.</p>
        </div>
      )}
    </div>
  );
}
