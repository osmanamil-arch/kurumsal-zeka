import React from 'react';

export default function DepartmentFilter({ selectedDept, setSelectedDept, availableDepts }) {
  return (
    <div>
      <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Departman Filtresi</label>
      <select 
        value={selectedDept} 
        onChange={(e)=>setSelectedDept(e.target.value)} 
        style={{ 
          padding: '0.6rem 2rem 0.6rem 1rem', 
          borderRadius: '6px', 
          border: '1px solid #CBD5E1', 
          fontSize: '1rem', 
          minWidth: '200px', 
          cursor: 'pointer',
          background: 'white'
        }}
      >
        <option value="all">Tüm Departmanlar</option>
        {availableDepts.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
    </div>
  );
}
