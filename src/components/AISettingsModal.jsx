import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function AISettingsModal({ onClose }) {
  const [apiKey, setApiKey] = useLocalStorage('kobi_geminiApiKey', '');
  const [inputValue, setInputValue] = useState(apiKey);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = () => {
    setApiKey(inputValue.trim());
    setSaveMessage('Ayarlar başarıyla kaydedildi!');
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: 'var(--card-bg, #fff)',
        padding: '2rem',
        borderRadius: '8px',
        width: '400px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        color: 'var(--text-color, #1e293b)'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.25rem' }}>✨ AI Asistan Ayarları</h2>
        <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', color: 'var(--text-muted, #64748b)' }}>
          Kurumsal Zeka'nın yapay zeka özelliklerini (Otomatik Raporlama, Görev Tanımı Üretici vb.) kullanabilmek için bir Google Gemini API Anahtarına ihtiyacınız vardır.
        </p>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Gemini API Anahtarı
          </label>
          <input
            type="password"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="AIzaSy..."
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid var(--border-color, #cbd5e1)',
              borderRadius: '6px',
              fontSize: '1rem',
              background: 'var(--input-bg, #fff)',
              color: 'var(--text-color, #1e293b)'
            }}
          />
        </div>

        {saveMessage && (
          <div style={{ color: '#16a34a', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 500 }}>
            {saveMessage}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button 
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '1px solid var(--border-color, #cbd5e1)',
              borderRadius: '6px',
              cursor: 'pointer',
              color: 'var(--text-color, #1e293b)'
            }}
          >
            İptal
          </button>
          <button 
            onClick={handleSave}
            style={{
              padding: '0.5rem 1rem',
              background: '#3b82f6',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
