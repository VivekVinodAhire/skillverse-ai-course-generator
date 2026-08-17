import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const data = await signup(email, password, fullName);
      if (data?.session) {
        navigate('/dashboard');
      } else {
        alert('Account created successfully! If email confirmation is enabled, please check your inbox or log in.');
        navigate('/login');
      }
    } catch (err) {
      if (err.status === 429 || err.message?.includes('429') || err.message?.toLowerCase().includes('rate limit')) {
        setError('Supabase Auth Rate Limit reached. Please wait 2-3 minutes or turn OFF email confirmation.');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
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
        <h1 className="neu-title">Sign Up</h1>
        <p className="neu-subtitle">Create your account</p>


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
          
          {/* Full Name */}
          <div className="neu-input-group neu-input-wrapper">
            <User size={18} className="neu-input-icon" />
            <input
              type="text"
              required
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="neu-input"
            />
          </div>

          {/* Email */}
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

          {/* Password */}
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

          {/* Confirm Password */}
          <div className="neu-input-group neu-input-wrapper">
            <Lock size={18} className="neu-input-icon" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="neu-input"
              style={{ paddingRight: '2.85rem' }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              title={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="neu-btn">
            <span>{loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}</span>
            {!loading && <ArrowRight size={18} />}
          </button>

        </form>

        {/* Link to Login */}
        <div className="neu-link-text">
          Already have an account?{' '}
          <Link to="/login" className="neu-link-highlight">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Signup;


