import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, ArrowLeft, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset link.');
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
        <h1 className="neu-title">Reset Password</h1>
        <p className="neu-subtitle">Enter your email to receive reset instructions</p>

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

        {submitted ? (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div style={{ color: '#10b981', marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
              <CheckCircle2 size={44} />
            </div>
            <h4 style={{ fontWeight: 800, color: '#2d3748', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Check your email</h4>
            <p style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '1.5rem', lineHeight: 1.4 }}>
              We sent a password reset link to <strong style={{ color: '#2d3748' }}>{email}</strong>.
            </p>
            <Link to="/login" className="neu-btn" style={{ textDecoration: 'none' }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            
            {/* Email Input */}
            <div className="neu-input-group neu-input-wrapper">
              <Mail size={18} className="neu-input-icon" />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="neu-input"
              />
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="neu-btn">
              <span>{loading ? 'SENDING LINK...' : 'SEND RESET LINK'}</span>
              {!loading && <ArrowRight size={18} />}
            </button>

            {/* Back to Login Link */}
            <div className="neu-link-text">
              <Link to="/login" className="neu-link-highlight" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                <ArrowLeft size={16} />
                <span>Back to Login</span>
              </Link>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;

