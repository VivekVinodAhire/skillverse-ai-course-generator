import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      if (err.status === 400 || err.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please check your credentials.');
      } else if (err.status === 429 || err.message?.includes('429')) {
        setError('Too many requests. Please wait a minute and try again.');
      } else {
        setError(err.message || 'Invalid email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="neu-container">
      <div className="neu-circle-card animate-fade-in">
        
        {/* Brand Logo & Name (Exact Landing Page Logo) */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              flexShrink: 0,
            }}
          >
            <GraduationCap size={20} color="#FFFFFF" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1, display: 'block' }}>
              SkillVerse <span style={{ color: '#2563EB' }}>AI</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.55rem', fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '1px' }}>
              Powered Learning
            </span>
          </div>
        </Link>




        {/* Title & Subtitle */}
        <h1 className="neu-title">Sign In</h1>
        <p className="neu-subtitle">Welcome back! Access your account</p>


        {/* Error Callout */}
        {error && (
          <div 
            style={{ 
              width: '100%', 
              background: '#fff5f5', 
              border: '1.5px solid #fecaca', 
              color: '#dc2626', 
              padding: '0.75rem 1rem', 
              borderRadius: '20px', 
              fontSize: '0.8125rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              marginBottom: '1.25rem' 
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          
          {/* Email Input */}
          <div className="neu-input-group neu-input-wrapper">
            <Mail size={18} className="neu-input-icon" />
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="neu-input"
            />
          </div>

          {/* Password Input */}
          <div className="neu-input-group neu-input-wrapper">
            <Lock size={18} className="neu-input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="neu-input"
              style={{ paddingRight: '2.85rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '1.1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#718096',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '0.2rem'
              }}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div style={{ textAlign: 'right', marginTop: '-0.5rem', marginBottom: '1.25rem' }}>
            <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600, textDecoration: 'none' }}>
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="neu-btn">
            <span>{loading ? 'LOGGING IN...' : 'LOG IN'}</span>
            {!loading && <ArrowRight size={18} />}
          </button>

        </form>

        {/* Link to Signup */}
        <div className="neu-link-text">
          Don't have an account?{' '}
          <Link to="/signup" className="neu-link-highlight">
            Sign Up
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
