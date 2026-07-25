import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './SalaryBulkUpload.css';

const SalaryBulkUpload = ({ onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        // Expected columns: TitleId, CurrentSalary, MarketMid
        onUploadSuccess(data);
        setLoading(false);
      } catch (err) {
        setError("Dosya okunamadı. Lütfen geçerli bir Excel veya CSV dosyası yükleyin.");
        setLoading(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="bulk-upload-container glass">
      <div className="upload-header">
        <h4>Toplu Maaş ve Piyasa Verisi Yükleme</h4>
        <p>Excel veya CSV formatındaki dosyalarınızı buraya yükleyerek kademeleri ve piyasa verilerini güncelleyebilirsiniz.</p>
      </div>

      <div className="upload-area">
        <label className="file-input-label">
          <span className="icon">📂</span>
          <span>Dosya Seçin veya Sürükleyin</span>
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            onChange={handleFileUpload} 
            style={{ display: 'none' }}
          />
        </label>
        {loading && <div className="loading-spinner">Yükleniyor...</div>}
        {error && <div className="error-msg">{error}</div>}
      </div>

      <div className="template-info">
        <h5>Örnek Format:</h5>
        <table>
          <thead>
            <tr>
              <th>TitleId</th>
              <th>CurrentSalary</th>
              <th>MarketMid</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>t1</td>
              <td>45000</td>
              <td>50000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryBulkUpload;
