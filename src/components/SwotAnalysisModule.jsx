import React, { useState } from 'react';
import './SwotAnalysisModule.css';

export default function SwotAnalysisModule({ employees, swotEntries, setSwotEntries }) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [activeTab, setActiveTab] = useState('SWOT');

  const handleAddEntry = (category, text) => {
    if (!selectedEmployeeId) {
      alert("Lütfen önce bir çalışan seçin!");
      return;
    }
    if (!text.trim()) return;

    const newEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      employeeId: selectedEmployeeId,
      category,
      text: text.trim(),
      date: new Date().toISOString()
    };

    setSwotEntries(prev => [...prev, newEntry]);
  };

  const handleDeleteEntry = (id) => {
    setSwotEntries(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="swot-analysis-module fade-in">
      <header className="swot-header glass">
        <div className="employee-selector">
          <label>Görüşülen Çalışan:</label>
          <select 
            value={selectedEmployeeId} 
            onChange={e => setSelectedEmployeeId(e.target.value)}
          >
            <option value="">-- Çalışan Seçin --</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name} ({emp.title || emp.department})</option>
            ))}
          </select>
        </div>
        
        <div className="tab-buttons">
          <button className={`tab-btn ${activeTab === 'SWOT' ? 'active' : ''}`} onClick={() => setActiveTab('SWOT')}>SWOT Analizi</button>
          <button className={`tab-btn ${activeTab === 'PESTLE' ? 'active' : ''}`} onClick={() => setActiveTab('PESTLE')}>PESTLE Analizi</button>
        </div>
      </header>

      <div className="analysis-workspace">
        {activeTab === 'SWOT' && (
           <div className="swot-grid">
             <AnalysisBox title="Güçlü Yönler (Strengths)" category="SWOT_S" entries={swotEntries} employees={employees} onAdd={handleAddEntry} onDelete={handleDeleteEntry} />
             <AnalysisBox title="Zayıf Yönler (Weaknesses)" category="SWOT_W" entries={swotEntries} employees={employees} onAdd={handleAddEntry} onDelete={handleDeleteEntry} />
             <AnalysisBox title="Fırsatlar (Opportunities)" category="SWOT_O" entries={swotEntries} employees={employees} onAdd={handleAddEntry} onDelete={handleDeleteEntry} />
             <AnalysisBox title="Tehditler (Threats)" category="SWOT_T" entries={swotEntries} employees={employees} onAdd={handleAddEntry} onDelete={handleDeleteEntry} />
           </div>
        )}
        {activeTab === 'PESTLE' && (
           <div className="pestle-grid">
             <AnalysisBox title="Politik (Political)" category="PEST_P" entries={swotEntries} employees={employees} onAdd={handleAddEntry} onDelete={handleDeleteEntry} />
             <AnalysisBox title="Ekonomik (Economic)" category="PEST_E" entries={swotEntries} employees={employees} onAdd={handleAddEntry} onDelete={handleDeleteEntry} />
             <AnalysisBox title="Sosyal (Social)" category="PEST_S" entries={swotEntries} employees={employees} onAdd={handleAddEntry} onDelete={handleDeleteEntry} />
             <AnalysisBox title="Teknolojik (Technological)" category="PEST_T" entries={swotEntries} employees={employees} onAdd={handleAddEntry} onDelete={handleDeleteEntry} />
             <AnalysisBox title="Yasal (Legal)" category="PEST_L" entries={swotEntries} employees={employees} onAdd={handleAddEntry} onDelete={handleDeleteEntry} />
             <AnalysisBox title="Çevresel (Environmental)" category="PEST_ENV" entries={swotEntries} employees={employees} onAdd={handleAddEntry} onDelete={handleDeleteEntry} />
           </div>
        )}
      </div>
    </div>
  );
}

function AnalysisBox({ title, category, entries, employees, onAdd, onDelete }) {
  const [inputText, setInputText] = useState('');
  
  const categoryEntries = entries.filter(e => e.category === category);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(category, inputText);
    setInputText('');
  };

  return (
    <div className={`analysis-box glass cat-${category}`}>
      <h4>{title}</h4>
      
      <form className="quick-add-form" onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={inputText} 
          onChange={e => setInputText(e.target.value)} 
          placeholder="Madde ekle..." 
        />
        <button type="submit" className="add-btn-small" disabled={!inputText.trim()}>+</button>
      </form>
      
      <ul className="entry-list">
        {categoryEntries.map(entry => {
           const emp = employees.find(e => e.id === entry.employeeId);
           return (
           <li key={entry.id} className="entry-item fade-in">
             <div style={{ flex: 1, marginRight: '0.5rem' }}>
               <span>{entry.text}</span>
               <div style={{fontSize: '0.75rem', color: '#6b7280', marginTop: '0.2rem', fontWeight: '600'}}>👤 {emp ? emp.name : 'Bilinmeyen Çalışan'}</div>
             </div>
             <button className="del-btn" onClick={() => onDelete(entry.id)}>×</button>
           </li>
           );
        })}
        {categoryEntries.length === 0 && (
          <div className="no-entry">Henüz eklenmemiş.</div>
        )}
      </ul>
    </div>
  );
}
