import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Save,
  CheckCircle2,
  Sparkles,
  Trophy,
  BookOpen,
  Award,
  Lock,
  Globe,
  Star,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { progressService } from '../services/progressService';

const Profile = () => {
  const { user, profile, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [bio, setBio] = useState(profile?.bio || 'Passionate AI Learner building skills on SkillVerse.');
  const [preferredDifficulty, setPreferredDifficulty] = useState(profile?.difficulty || 'Beginner');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await progressService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch profile stats:', err);
      }
    }
    loadStats();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await updateProfile({
        full_name: fullName,
        bio,
        difficulty: preferredDifficulty,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      alert(`Failed to save profile: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const userInitial = (fullName || user?.email || 'S').charAt(0).toUpperCase();
  const createdDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. HERO COVER BANNER & AVATAR CARD */}
      <div
        style={{
          borderRadius: '20px',
          border: '1px solid #E5E7EB',
          background: '#FFFFFF',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Cover Art Banner Header */}
        <div
          style={{
            height: '140px',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #312E81 100%)',
            position: 'relative',
            padding: '1.5rem 2rem',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1.25rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#A5B4FC',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              backdropFilter: 'blur(4px)',
            }}
          >
            <Sparkles size={14} />
            <span>SkillVerse AI Member</span>
          </div>
        </div>

        {/* Profile Details Container */}
        <div style={{ padding: '0 2rem 2rem 2rem', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginTop: '-45px', marginBottom: '1.5rem' }}>
            {/* Avatar Circle */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.25rem',
                  fontWeight: 800,
                  border: '4px solid #FFFFFF',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                }}
              >
                {userInitial}
              </div>
              <span
                style={{
                  position: 'absolute',
                  bottom: '6px',
                  right: '4px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: '#10B981',
                  border: '3px solid #FFFFFF',
                }}
                title="Online & Verified"
              />
            </div>

            {/* Quick Stats Pills */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0.5rem 0.875rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Courses</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E293B' }}>{stats?.totalCourses || 0}</div>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0.5rem 0.875rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Lessons</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2563EB' }}>{stats?.totalLessons || 0}</div>
              </div>

              <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', padding: '0.5rem 0.875rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#D97706', fontWeight: 700, textTransform: 'uppercase' }}>Quizzes</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#B45309' }}>{stats?.completedCourses || 0}</div>
              </div>
            </div>
          </div>

          {/* User Name & Email */}
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827', margin: 0 }}>
              {fullName || 'Learner'}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748B', fontSize: '0.875rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
              <span>{user?.email}</span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Calendar size={14} /> Joined {createdDate}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Tabs Navigation */}
        <div style={{ display: 'flex', borderTop: '1px solid #E5E7EB', padding: '0 2rem', background: '#F8FAFC', gap: '1.5rem' }}>
          <button
            onClick={() => setActiveTab('personal')}
            style={{
              padding: '1rem 0.25rem',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: activeTab === 'personal' ? '#2563EB' : '#64748B',
              borderBottom: activeTab === 'personal' ? '3px solid #2563EB' : '3px solid transparent',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <User size={16} />
            <span>Personal Info</span>
          </button>

          <button
            onClick={() => setActiveTab('achievements')}
            style={{
              padding: '1rem 0.25rem',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: activeTab === 'achievements' ? '#2563EB' : '#64748B',
              borderBottom: activeTab === 'achievements' ? '3px solid #2563EB' : '3px solid transparent',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Trophy size={16} />
            <span>Learning Stats & Badges</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            style={{
              padding: '1rem 0.25rem',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: activeTab === 'security' ? '#2563EB' : '#64748B',
              borderBottom: activeTab === 'security' ? '3px solid #2563EB' : '3px solid transparent',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Shield size={16} />
            <span>Account Security</span>
          </button>
        </div>
      </div>

      {/* 2. TAB CONTENT PANELS */}
      {savedSuccess && (
        <div style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', padding: '0.875rem 1.25rem', borderRadius: '14px', fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.625rem', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)' }}>
          <CheckCircle2 size={18} />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {activeTab === 'personal' && (
        <div
          className="animate-fade-in"
          style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E5E7EB',
            padding: '2rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
          }}
        >
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '1.5rem' }}>
            Personal Details & Learning Preferences
          </h3>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="sv-input-group">
                <label className="sv-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="sv-input"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              <div className="sv-input-group">
                <label className="sv-label">Email Address (Read-only)</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="sv-input"
                    style={{ paddingLeft: '2.5rem', background: '#F8FAFC', cursor: 'not-allowed', color: '#64748B' }}
                  />
                </div>
              </div>
            </div>

            <div className="sv-input-group">
              <label className="sv-label">Bio / Learning Goals</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="sv-textarea"
                placeholder="Share your learning goals or topics you want to master..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="sv-input-group">
                <label className="sv-label">Preferred Course Difficulty</label>
                <select
                  value={preferredDifficulty}
                  onChange={(e) => setPreferredDifficulty(e.target.value)}
                  className="sv-select"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="sv-input-group">
                <label className="sv-label">Primary AI Model</label>
                <input
                  type="text"
                  disabled
                  value="Gemini 3.6 Flash (Dual-Key Failover Active)"
                  className="sv-input"
                  style={{ background: '#F8FAFC', cursor: 'not-allowed', color: '#475569', fontWeight: 600 }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                width: 'fit-content',
                background: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '0.75rem 1.75rem',
                fontSize: '0.9rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#1D4ED8')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#2563EB')}
            >
              <Save size={16} />
              <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div
          className="animate-fade-in"
          style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E5E7EB',
            padding: '2rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', margin: 0 }}>
            Learner Achievements & Badges
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div style={{ background: '#EEF2FF', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '1.25rem', borderRadius: '16px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#4F46E5', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trophy size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E1B4B', margin: 0 }}>Course Explorer</h4>
                <div style={{ fontSize: '0.8rem', color: '#4338CA', marginTop: '0.25rem' }}>Created {stats?.totalCourses || 0} AI Courses</div>
              </div>
            </div>

            <div style={{ background: '#ECFDF5', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1.25rem', borderRadius: '16px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#10B981', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#064E3B', margin: 0 }}>Quiz Master</h4>
                <div style={{ fontSize: '0.8rem', color: '#047857', marginTop: '0.25rem' }}>Passed {stats?.completedCourses || 0} Assessments</div>
              </div>
            </div>

            <div style={{ background: '#FFFBEB', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '1.25rem', borderRadius: '16px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#F59E0B', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#78350F', margin: 0 }}>Active Learner</h4>
                <div style={{ fontSize: '0.8rem', color: '#B45309', marginTop: '0.25rem' }}>{stats?.totalLessons || 0} Lessons Completed</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div
          className="animate-fade-in"
          style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E5E7EB',
            padding: '2rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', margin: 0 }}>
            Account Security & Authentication Status
          </h3>

          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#10B981', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>Supabase Authentication Protected</h4>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.125rem' }}>Encrypted JWT session tokens active with RLS policies</div>
              </div>
            </div>
            <span style={{ background: '#ECFDF5', color: '#059669', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
              ACTIVE SESSION ✓
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
