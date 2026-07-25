import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SuperadminPanel from './pages/superadmin/SuperadminPanel';
import KobiApp from './pages/KobiApp';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', color: 'var(--text-color)' }}>
        <div className="logo-icon" style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>✨</div>
        <p style={{ marginLeft: '1rem', fontWeight: 'bold' }}>Yükleniyor...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route 
        path="/superadmin" 
        element={
          <ProtectedRoute allowedRoles={['superadmin']}>
            <SuperadminPanel />
          </ProtectedRoute>
        } 
      />
      {/* Şimdilik diğer tüm rolleri mevcut KobiApp yapısına yönlendiriyoruz. 
          İlerleyen aşamalarda /musteri, /danisman, /calisan olarak ayrılacaklar. */}
      <Route 
        path="/danisman" 
        element={
          <ProtectedRoute allowedRoles={['danisman']}>
            <KobiApp />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/musteri" 
        element={
          <ProtectedRoute allowedRoles={['firma_yetkilisi']}>
            <KobiApp />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/calisan" 
        element={
          <ProtectedRoute allowedRoles={['calisan']}>
            <KobiApp />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
