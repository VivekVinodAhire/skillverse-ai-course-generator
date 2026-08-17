import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BookOpen, Layers, CheckCircle2, ArrowRight, Play, TrendingUp, Bot, MessageSquare } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { progressService } from '../services/progressService';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const Dashboard = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quickTopic, setQuickTopic] = useState('');

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await progressService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleQuickGenerate = (e) => {
    e.preventDefault();
    if (quickTopic.trim()) {
      navigate(`/create-course?topic=${encodeURIComponent(quickTopic.trim())}`);
    }
  };

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'Learner';

  const popularTopics = [
    'OOPS in JAVA interview',
    'React 19 & Next.js',
    'Python Machine Learning',
    'Data Structures & Algorithms',
    'System Design',
  ];

  // Get active course (first course with progress > 0 and < 100)
  const activeCourse = stats?.recentCourses?.find((c) => c.progress > 0 && c.progress < 100) || stats?.recentCourses?.[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="heading-1" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', fontSize: '1.75rem' }}>
            Welcome back, {userName}! 👋
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Track your progress, generate new AI courses, and master your learning goals
          </p>
        </div>

        <button
          onClick={() => navigate('/create-course')}
          className="sv-btn sv-btn-primary"
          style={{ padding: '0.625rem 1.25rem' }}
        >
          <Sparkles size={18} />
          <span>Create AI Course</span>
        </button>
      </div>

      {/* Hero AI Course Generation Search Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #312E81 100%)',
          color: '#ffffff',
          borderRadius: '20px',
          padding: '2.25rem 2rem',
          boxShadow: '0 16px 32px rgba(15, 23, 42, 0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '720px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              background: 'rgba(99, 102, 241, 0.25)',
              color: '#A5B4FC',
              border: '1px solid rgba(165, 180, 252, 0.3)',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={14} />
            <span>AI Powered Personalized Curriculum</span>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.625rem', lineHeight: 1.25 }}>
            What would you like to learn today?
          </h2>
          <p style={{ fontSize: '0.925rem', color: '#CBD5E1', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Type any skill or interview topic. SkillVerse AI will generate custom modules, lessons, hands-on code examples, and quizzes instantly.
          </p>

          <form onSubmit={handleQuickGenerate} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="e.g. OOPS in JAVA interview, React 19, Python Data Science..."
              value={quickTopic}
              onChange={(e) => setQuickTopic(e.target.value)}
              className="sv-input"
              style={{
                flex: 1,
                minWidth: '260px',
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                fontSize: '0.925rem',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
              }}
            />
            <button
              type="submit"
              style={{
                background: '#2563EB',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#1D4ED8')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#2563EB')}
            >
              <Sparkles size={18} />
              <span>Generate Course</span>
            </button>
          </form>

          {/* Suggested Topic Tags */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>Try:</span>
            {popularTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => navigate(`/create-course?topic=${encodeURIComponent(topic)}`)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#E2E8F0',
                  padding: '0.2rem 0.625rem',
                  borderRadius: '14px',
                  fontSize: '0.725rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                + {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Continue Learning Active Course Card (If Available) */}
      {activeCourse && (
        <div
          style={{
            background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '18px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '260px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: '#4F46E5',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Play size={22} fill="#FFFFFF" />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#4338CA', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.125rem' }}>
                CONTINUE LEARNING
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E1B4B', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeCourse.title}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.375rem' }}>
                <div style={{ flex: 1, maxWidth: '200px', height: '6px', background: 'rgba(79, 70, 229, 0.2)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${activeCourse.progress || 0}%`, background: '#4F46E5', borderRadius: '10px' }} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3730A3' }}>{activeCourse.progress || 0}% Complete</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(`/courses/${activeCourse.id}`)}
            style={{
              background: '#4F46E5',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '0.625rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <span>Resume Course</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Real Statistics Metrics Grid */}
      {loading ? (
        <LoadingSpinner text="Loading your dashboard stats..." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div className="sv-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={26} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{stats?.totalCourses || 0}</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6B7280', marginTop: '0.25rem' }}>My Courses</div>
            </div>
          </div>

          <div className="sv-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(79, 70, 229, 0.1)', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={26} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{stats?.totalModules || 0}</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6B7280', marginTop: '0.25rem' }}>Total Modules</div>
            </div>
          </div>

          <div className="sv-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(217, 119, 6, 0.1)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={26} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{stats?.totalLessons || 0}</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6B7280', marginTop: '0.25rem' }}>Total Lessons</div>
            </div>
          </div>

          <div className="sv-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={26} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{stats?.completedCourses || 0}</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6B7280', marginTop: '0.25rem' }}>Completed Courses</div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Courses Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.125rem' }}>
              ACTIVE LEARNING PATHS
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', margin: 0 }}>Recent Courses</h2>
          </div>

          {stats?.recentCourses?.length > 0 && (
            <button onClick={() => navigate('/my-courses')} className="sv-btn sv-btn-outline" style={{ padding: '0.375rem 0.875rem', fontSize: '0.8125rem' }}>
              <span>View All Courses</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        {stats?.recentCourses?.length === 0 ? (
          <EmptyState
            title="You haven't created any courses yet"
            description="Type a topic above to generate your first personalized AI course!"
            actionText="Create AI Course"
            onAction={() => navigate('/create-course')}
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.5rem' }}>
            {stats?.recentCourses?.map((course) => (
              <CourseCard key={course.id} course={course} onDeleteSuccess={loadStats} />
            ))}
          </div>
        )}
      </div>

      {/* AI Tutor Assistant Quick Callout */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
          color: '#FFFFFF',
          borderRadius: '18px',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#A5B4FC',
            }}
          >
            <Bot size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, marginBottom: '0.25rem' }}>
              Have questions about your lessons?
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#CBD5E1', margin: 0 }}>
              Ask SkillVerse AI Tutor anytime for code debugging, concept breakdowns, and instant step-by-step help.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/ai-tutor')}
          style={{
            background: '#FFFFFF',
            color: '#1E1B4B',
            border: 'none',
            borderRadius: '12px',
            padding: '0.625rem 1.25rem',
            fontSize: '0.875rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          <MessageSquare size={16} />
          <span>Chat with AI Tutor</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
