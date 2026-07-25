import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KeyRound, Mail, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../utils/supabaseClient';
import '../App.css'; // Reusing global styles for now

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Load remembered credentials on mount
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('kobi_remember_email');
      const savedPassword = localStorage.getItem('kobi_remember_password');
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
      if (savedPassword) {
        setPassword(savedPassword);
      }
    } catch (e) {
      console.warn('Error reading remember me cache:', e);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Save or clear credentials based on "Remember Me"
        try {
          if (rememberMe) {
            localStorage.setItem('kobi_remember_email', email);
            localStorage.setItem('kobi_remember_password', password);
          } else {
            localStorage.removeItem('kobi_remember_email');
            localStorage.removeItem('kobi_remember_password');
          }
        } catch (e) {
          console.warn('Error saving remember me cache:', e);
        }

        let role = '';
        if (result.user.role) {
          // Offline mode (local storage fallback)
          role = result.user.role;
        } else {
          // Online mode (Supabase)
          role = result.user.user_metadata?.role || 'calisan';
          
          // Double check with profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', result.user.id)
            .single();
          if (profile?.role) {
            role = profile.role;
          }
        }

        // Redirect based on role
        if (role === 'superadmin') {
          navigate('/superadmin');
        } else if (role === 'danisman') {
          navigate('/danisman');
        } else if (role === 'firma_yetkilisi') {
          navigate('/musteri');
        } else {
          navigate('/calisan');
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error(err);
      setError('Sisteme bağlanırken beklenmeyen bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container" style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
      <div className="login-card glass" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', borderRadius: '16px', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="logo-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-color)' }}>Kurumsal Zeka</h2>
          <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>
            Sisteme giriş yapın
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fee2e2', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <AlertCircle size={20} />
            <span style={{ fontSize: '0.9rem' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input 
              type="email" 
              placeholder="E-posta adresiniz" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-color)', outline: 'none', opacity: isSubmitting ? 0.6 : 1 }}
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <KeyRound size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input 
              type="password" 
              placeholder="Şifreniz" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-color)', outline: 'none', opacity: isSubmitting ? 0.6 : 1 }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-light)', userSelect: 'none' }}>
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isSubmitting}
                style={{ cursor: 'pointer', accentColor: 'var(--primary-color)' }}
              />
              Beni Hatırla
            </label>
          </div>

          <button 
            type="submit" 
            className="primary-button" 
            disabled={isSubmitting}
            style={{ width: '100%', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem', display: 'flex', justifyContent: 'center', fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}
