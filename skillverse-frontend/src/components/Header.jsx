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
        background: '#e6ebf1',
        borderBottom: '1px solid rgba(255, 255, 255, 0.7)',
        boxShadow: '0 4px 15px rgba(195, 201, 210, 0.35)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.25rem',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
        <button
          onClick={onToggleMobileSidebar}
          className="sv-mobile-toggle-btn"
          style={{ 
            display: 'none', 
            color: '#4a5568', 
            padding: '0.4rem', 
            borderRadius: '50%', 
            border: 'none', 
            background: '#e6ebf1', 
            boxShadow: '3px 3px 6px #c3c9d2, -3px -3px 6px #ffffff',
            flexShrink: 0,
            cursor: 'pointer'
          }}
        >
          <Menu size={20} />
        </button>

        {/* Global Neumorphic Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
          <div className="neu-input-wrapper" style={{ position: 'relative', width: '100%' }}>
            <Search
              size={17}
              className="neu-input-icon"
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#718096',
                pointerEvents: 'none'
              }}
            />
            <input
              type="text"
              placeholder="Search lessons, courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="neu-input"
              style={{
                padding: '0.65rem 1rem 0.65rem 2.65rem',
                fontSize: '0.85rem'
              }}
            />
          </div>
        </form>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flexShrink: 0 }}>
        {/* Create Course CTA shortcut */}
        <button
          onClick={() => navigate('/create-course')}
          style={{
            padding: '0.55rem 1.1rem',
            fontSize: '0.8125rem',
            fontWeight: 800,
            color: '#2563eb',
            background: '#e6ebf1',
            border: 'none',
            borderRadius: '30px',
            boxShadow: '4px 4px 10px #c3c9d2, -4px -4px 10px #ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '6px 6px 14px #bcc2cb, -6px -6px 14px #ffffff';
            e.currentTarget.style.color = '#ef4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '4px 4px 10px #c3c9d2, -4px -4px 10px #ffffff';
            e.currentTarget.style.color = '#2563eb';
          }}
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
              background: '#e6ebf1',
              boxShadow: showNotifications 
                ? 'inset 3px 3px 6px #c3c9d2, inset -3px -3px 6px #ffffff'
                : '4px 4px 9px #c3c9d2, -4px -4px 9px #ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: showNotifications ? '#ef4444' : '#4a5568',
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Bell size={18} />
            <span
              style={{
                position: 'absolute',
                top: '7px',
                right: '7px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#ef4444',
                boxShadow: '0 0 6px rgba(239, 68, 68, 0.6)'
              }}
            />
          </button>

          {/* Notifications Dropdown Popover */}
          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                width: '290px',
                padding: '1.1rem',
                zIndex: 50,
                background: '#e6ebf1',
                borderRadius: '24px',
                boxShadow: '10px 10px 25px #c3c9d2, -10px -10px 25px #ffffff',
                border: '1px solid rgba(255, 255, 255, 0.8)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.875rem', color: '#2d3748' }}>Notifications</span>
                <button 
                  onClick={() => setShowNotifications(false)} 
                  style={{ 
                    color: '#718096', 
                    border: 'none', 
                    background: '#e6ebf1',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={14} />
                </button>
              </div>
              <div 
                style={{ 
                  padding: '0.875rem', 
                  borderRadius: '16px', 
                  background: '#e6ebf1', 
                  boxShadow: 'inset 3px 3px 6px #c3c9d2, inset -3px -3px 6px #ffffff', 
                  fontSize: '0.8125rem', 
                  color: '#2d3748',
                  lineHeight: 1.5 
                }}
              >
                ✨ <strong style={{ color: '#ef4444' }}>Welcome to SkillVerse!</strong> Explore AI course generation, interactive lessons, and your 24/7 AI Tutor.
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
            padding: '0.2rem',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#e6ebf1',
              boxShadow: '4px 4px 9px #c3c9d2, -4px -4px 9px #ffffff',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.875rem',
              transition: 'all 0.2s ease'
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

