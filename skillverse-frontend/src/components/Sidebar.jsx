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
        background: '#ffffff',
        borderRight: '1px solid var(--border)',
        padding: '1.5rem 1rem',
      }}
    >
      {/* Brand Header with Graduation Cap Logo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', padding: '0 0.5rem' }}>
        <NavLink to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)',
            }}
          >
            <GraduationCap size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: '900', letterSpacing: '-0.02em', color: '#0F172A' }}>
              SkillVerse <span style={{ color: '#2563EB' }}>AI</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, color: '#4F46E5', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              AI Platform
            </span>
          </div>
        </NavLink>
        {mobileOpen && (
          <button onClick={() => setMobileOpen(false)} style={{ color: 'var(--text-muted)', border: 'none', background: 'transparent', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', padding: '0 0.5rem' }}>
          Main Menu
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '2rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className={({ isActive }) =>
                  `sv-nav-item ${isActive ? 'active' : ''}`
                }
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  background: isActive ? 'var(--primary-light)' : item.highlight ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
                  border: item.highlight && !isActive ? '1px dashed var(--primary)' : '1px solid transparent',
                  transition: 'all var(--transition-fast)',
                })}
              >
                <Icon size={18} color={item.highlight ? 'var(--primary)' : 'currentColor'} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', padding: '0 0.5rem' }}>
          Account
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
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
                  gap: '0.75rem',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  background: isActive ? 'var(--primary-light)' : 'transparent',
                  transition: 'all var(--transition-fast)',
                })}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Profile Mini Footer */}
      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
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
              flexShrink: 0,
            }}
          >
            {(profile?.full_name || user?.email || 'S').charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {profile?.full_name || 'Learner'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          title="Log out"
          style={{ color: 'var(--text-light)', padding: '0.375rem', borderRadius: 'var(--radius-sm)', transition: 'color var(--transition-fast)', border: 'none', background: 'transparent', cursor: 'pointer' }}
        >
          <LogOut size={18} />
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
