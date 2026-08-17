import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Shield, Bell, Key, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Settings = () => {
  const { logout, resetPassword, user } = useAuth();
  const navigate = useNavigate();

  const [passwordSent, setPasswordSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendReset = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      await resetPassword(user.email);
      setPasswordSent(true);
      setTimeout(() => setPasswordSent(false), 4000);
    } catch (err) {
      alert(`Error sending password reset: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 className="heading-1">Settings</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Configure your security, preferences, and account controls</p>
      </div>

      {/* Security & Password */}
      <div className="sv-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Key size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Security & Password</h3>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Send a password reset link to your email address to change your password securely.
        </p>

        {passwordSent && (
          <div style={{ background: 'var(--success-light)', color: 'var(--success)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <CheckCircle2 size={16} />
            <span>Password reset email sent to {user?.email}</span>
          </div>
        )}

        <button onClick={handleSendReset} disabled={loading} className="sv-btn sv-btn-outline">
          <span>{loading ? 'Sending...' : 'Send Password Reset Email'}</span>
        </button>
      </div>

      {/* Account Logout Card */}
      <div className="sv-card" style={{ padding: '2rem', border: '1px solid var(--danger-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <LogOut size={20} color="var(--danger)" />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--danger)' }}>Session Control</h3>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Sign out of your SkillVerse account session safely.
        </p>
        <button onClick={handleLogout} className="sv-btn" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
