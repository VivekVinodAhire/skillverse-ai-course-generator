import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  FileText,
  HelpCircle,
  MessageSquare,
  User,
  Settings,
  HelpCircle as HelpIcon,
  LogOut,
  GraduationCap,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { logout, profile, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Courses', path: '/my-courses', icon: BookOpen },
    { name: 'Create AI Course', path: '/create-course', icon: PlusCircle, highlight: true },
    { name: 'Lessons', path: '/lessons', icon: FileText },
    { name: 'Quizzes', path: '/quizzes', icon: HelpCircle },
    { name: 'AI Tutor', path: '/ai-tutor', icon: MessageSquare },
  ];

  const accountItems = [
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Help Center', path: '/help', icon: HelpIcon },
  ];

  const sidebarContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#e6ebf1',
        borderRight: '1px solid rgba(255, 255, 255, 0.7)',
        boxShadow: '8px 0 20px rgba(195, 201, 210, 0.3)',
        padding: '1.5rem 1rem',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Brand Header with Graduation Cap Logo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', padding: '0 0.5rem' }}>
        <NavLink to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '4px 4px 10px #c3c9d2, -4px -4px 10px #ffffff',
              flexShrink: 0
            }}
          >
            <GraduationCap size={24} color="#FFFFFF" />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#2d3748', letterSpacing: '-0.02em', lineHeight: 1, display: 'block' }}>
              SkillVerse <span style={{ color: '#2563EB' }}>AI</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.625rem', fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>
              AI Platform
            </span>
          </div>
        </NavLink>

        {mobileOpen && (
          <button 
            onClick={() => setMobileOpen(false)} 
            style={{ 
              color: '#718096', 
              border: 'none', 
              background: '#e6ebf1', 
              boxShadow: '3px 3px 6px #c3c9d2, -3px -3px 6px #ffffff',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer' 
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.2rem' }}>
        <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', padding: '0 0.6rem' }}>
          Main Menu
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '2.25rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen && setMobileOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '24px',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? '#ef4444' : item.highlight ? '#2563eb' : '#4a5568',
                  background: '#e6ebf1',
                  boxShadow: isActive 
                    ? 'inset 3px 3px 6px #c3c9d2, inset -3px -3px 6px #ffffff'
                    : item.highlight
                    ? '4px 4px 10px #c3c9d2, -4px -4px 10px #ffffff'
                    : 'none',
                  border: item.highlight && !isActive ? '1.5px dashed #2563eb' : '1.5px solid transparent',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  textDecoration: 'none'
                })}
              >
                <Icon size={19} style={{ flexShrink: 0 }} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', padding: '0 0.6rem' }}>
          Account
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {accountItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen && setMobileOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '24px',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? '#ef4444' : '#4a5568',
                  background: '#e6ebf1',
                  boxShadow: isActive 
                    ? 'inset 3px 3px 6px #c3c9d2, inset -3px -3px 6px #ffffff'
                    : 'none',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  textDecoration: 'none'
                })}
              >
                <Icon size={19} style={{ flexShrink: 0 }} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Profile Neumorphic Footer Block */}
      <div 
        style={{ 
          marginTop: '1rem', 
          padding: '0.875rem 1rem', 
          borderRadius: '24px',
          background: '#e6ebf1',
          boxShadow: 'inset 3px 3px 6px #c3c9d2, inset -3px -3px 6px #ffffff',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#e6ebf1',
              boxShadow: '3px 3px 7px #c3c9d2, -3px -3px 7px #ffffff',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.875rem',
              flexShrink: 0,
            }}
          >
            {(profile?.full_name || user?.email || 'S').charAt(0).toUpperCase()}
          </div>

          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2d3748', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {profile?.full_name || 'Learner'}
            </div>
            <div style={{ fontSize: '0.725rem', color: '#718096', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Log out"
          style={{ 
            color: '#718096', 
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#e6ebf1',
            boxShadow: '3px 3px 6px #c3c9d2, -3px -3px 6px #ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s ease', 
            border: 'none', 
            cursor: 'pointer',
            flexShrink: 0
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#718096')}
        >
          <LogOut size={16} />
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sv-desktop-sidebar" style={{ width: '260px', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 40 }}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 50,
          }}
        />
      )}

      {/* Mobile Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '280px',
          zIndex: 51,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 300ms ease',
        }}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;

