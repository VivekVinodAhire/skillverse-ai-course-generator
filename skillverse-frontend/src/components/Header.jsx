import React, { useState } from 'react';
import { Menu, Search, Bell, Sparkles, User, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header = ({ onToggleMobileSidebar }) => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/lessons?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      style={{
        height: '70px',
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
        <button
          onClick={onToggleMobileSidebar}
          className="sv-mobile-toggle-btn"
          style={{ display: 'none', color: 'var(--text-main)', padding: '0.375rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFFFFF', flexShrink: 0 }}
        >
          <Menu size={22} />
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.875rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-light)',
            }}
          />
          <input
            type="text"
            placeholder="Search lessons, courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sv-input"
            style={{ paddingLeft: '2.5rem', borderRadius: 'var(--radius-full)', background: 'var(--background)', fontSize: '0.825rem' }}
          />
        </form>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
        {/* Create Course CTA shortcut */}
        <button
          onClick={() => navigate('/create-course')}
          className="sv-btn sv-btn-primary"
          style={{ padding: '0.45rem 0.875rem', fontSize: '0.8125rem' }}
        >
          <Sparkles size={16} />
          <span className="sv-desktop-only">New AI Course</span>
        </button>

        {/* Notification Icon */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'var(--background)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              position: 'relative',
            }}
          >
            <Bell size={18} />
            <span
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--primary)',
              }}
            />
          </button>

          {/* Notifications Dropdown Popover */}
          {showNotifications && (
            <div
              className="sv-card animate-fade-in"
              style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                width: '290px',
                padding: '1rem',
                zIndex: 50,
                boxShadow: 'var(--shadow-xl)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Notifications</span>
                <button onClick={() => setShowNotifications(false)} style={{ color: 'var(--text-light)', border: 'none', background: 'transparent' }}>
                  <X size={16} />
                </button>
              </div>
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', fontSize: '0.8125rem', color: 'var(--primary)' }}>
                ✨ <strong>Welcome to SkillVerse!</strong> Explore AI course generation, interactive lessons, and your 24/7 AI Tutor.
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div
          onClick={() => navigate('/profile')}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            padding: '0.25rem',
            borderRadius: 'var(--radius-full)',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.875rem',
            }}
          >
            {(profile?.full_name || user?.email || 'S').charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
