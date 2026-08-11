import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import logo from '../assets/logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        // Verify admin role
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('email', data.user.email)
          .single();

        if (userError || userData?.role !== 'admin') {
          await supabase.auth.signOut();
          throw new Error('Access denied. You do not have admin privileges.');
        }

        localStorage.setItem('admin_auth', 'true');
        localStorage.setItem('admin_email', email);
        navigate('/dashboard', { replace: true });
      }
    } catch (e: any) {
      setError(e.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative top shapes */}
      <svg style={{ position: 'absolute', top: 0, right: 0, width: '100%', maxWidth: '600px', zIndex: 0, transform: 'scaleX(-1)' }} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0H400V150C400 150 350 250 200 250C50 250 0 100 0 100V0Z" fill="#8ACEEA" opacity="0.8"/>
        <path d="M400 0H100V50C100 50 150 180 280 150C380 120 400 50 400 50V0Z" fill="#67A6C8" opacity="0.9"/>
      </svg>
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', maxWidth: '600px', zIndex: 0 }} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0H400V100C400 100 250 200 150 180C50 160 0 50 0 50V0Z" fill="#8ACEEA" opacity="0.6"/>
        <path d="M0 0H250V50C250 50 200 150 100 130C30 110 0 40 0 40V0Z" fill="#67A6C8" opacity="0.8"/>
      </svg>

      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '380px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 1,
        marginTop: '2rem'
      }}>
        {/* LOGO */}
        <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'center' }}>
          <img src={logo} alt="An Chuyen Logo" style={{ width: '180px', height: 'auto', objectFit: 'contain' }} />
        </div>
        
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '0.5rem' }}>
          Welcome back!
        </h1>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '2.5rem', textAlign: 'center' }}>
          Log in to existing admin account
        </p>

        {error && (
          <div style={{
            width: '100%', padding: '0.875rem', borderRadius: '8px',
            backgroundColor: '#fee2e2', color: '#ef4444',
            fontSize: '0.875rem', marginBottom: '1.5rem', textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email Address"
              style={{
                width: '100%', padding: '1rem 1rem 1rem 3rem',
                backgroundColor: '#f5f5f5', border: 'none',
                borderRadius: '12px', color: '#333',
                fontSize: '0.95rem',
                outline: 'none', transition: 'background-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.backgroundColor = '#eeeeee'}
              onBlur={(e) => e.target.style.backgroundColor = '#f5f5f5'}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              style={{
                width: '100%', padding: '1rem 1rem 1rem 3rem',
                backgroundColor: '#f5f5f5', border: 'none',
                borderRadius: '12px', color: '#333',
                fontSize: '0.95rem',
                outline: 'none', transition: 'background-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.backgroundColor = '#eeeeee'}
              onBlur={(e) => e.target.style.backgroundColor = '#f5f5f5'}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <a href="#" style={{ color: '#555', fontSize: '0.85rem', textDecoration: 'none', fontWeight: '500' }}>
              Forgot Password?
            </a>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{
              width: '100%', padding: '1rem', marginTop: '1rem',
              background: 'linear-gradient(90deg, #71B9DA 0%, #4A90E2 100%)',
              color: 'white',
              border: 'none', borderRadius: '12px',
              fontWeight: '600', fontSize: '1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.8 : 1,
              transition: 'opacity 0.2s, transform 0.1s',
              boxShadow: '0 4px 14px rgba(74, 144, 226, 0.4)',
              boxSizing: 'border-box'
            }}
            onMouseOver={(e) => !isLoading && (e.currentTarget.style.opacity = '0.9')}
            onMouseOut={(e) => !isLoading && (e.currentTarget.style.opacity = '1')}
            onMouseDown={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(1)')}
          >
            {isLoading ? 'SIGNING IN...' : 'LOG IN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
