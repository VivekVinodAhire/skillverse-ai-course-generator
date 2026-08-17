import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Play, RefreshCw, Trash2, Layers, HelpCircle, Trophy, Sparkles } from 'lucide-react';
import { courseService } from '../services/courseService';

const CourseCard = ({ course, onDeleteSuccess }) => {
  const navigate = useNavigate();

  const isPaused = course.generation_status === 'paused' || course.status === 'paused';
  const isGenerating = course.generation_status === 'generating' || course.status === 'generating';

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
      try {
        await courseService.deleteCourse(course.id);
        if (onDeleteSuccess) onDeleteSuccess(course.id);
      } catch (err) {
        alert(`Failed to delete course: ${err.message}`);
      }
    }
  };

  // Generate dynamic gradient based on course title hash
  const getGradient = (str = '') => {
    const gradients = [
      'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', // Indigo to Purple
      'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)', // Royal Blue
      'linear-gradient(135deg, #059669 0%, #10B981 100%)', // Emerald
      'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)', // Amber
      'linear-gradient(135deg, #DB2777 0%, #F43F5E 100%)', // Rose
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return gradients[Math.abs(hash) % gradients.length];
  };

  const headerGradient = getGradient(course.topic || course.title);

  return (
    <div
      className="animate-fade-in"
      onClick={() => {
        if (isPaused) {
          navigate(`/create-course?resumeCourseId=${course.id}`);
        } else {
          navigate(`/courses/${course.id}`);
        }
      }}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '18px',
        border: '1px solid #E5E7EB',
        background: '#FFFFFF',
        overflow: 'hidden',
        transition: 'all 0.25s ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(37, 99, 235, 0.15)';
        e.currentTarget.style.borderColor = '#2563EB';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.04)';
        e.currentTarget.style.borderColor = '#E5E7EB';
      }}
    >
      {/* 1. TOP GRADIENT COVER HEADER */}
      <div
        style={{
          background: headerGradient,
          padding: '1.25rem 1.25rem 1rem 1.25rem',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '130px',
          color: '#FFFFFF',
        }}
      >
        {/* Top Left Pill: Topic */}
        <span
          style={{
            position: 'absolute',
            top: '0.875rem',
            left: '0.875rem',
            background: 'rgba(255, 255, 255, 0.95)',
            fontSize: '0.7rem',
            fontWeight: 800,
            color: '#1E293B',
            padding: '0.25rem 0.625rem',
            borderRadius: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            maxWidth: '160px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {course.topic || 'AI Course'}
        </span>

        {/* Top Right Actions */}
        <div style={{ position: 'absolute', top: '0.875rem', right: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <span
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#334155',
              padding: '0.25rem 0.625rem',
              borderRadius: '20px',
              textTransform: 'capitalize',
            }}
          >
            {course.difficulty || 'Beginner'}
          </span>
          <button
            onClick={handleDelete}
            title="Delete Course"
            style={{
              background: 'rgba(0, 0, 0, 0.25)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50%',
              width: '26px',
              height: '26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.85)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.25)')}
          >
            <Trash2 size={13} />
          </button>
        </div>

        {/* Center Course Illustration Icon */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
          <BookOpen size={36} strokeWidth={2.2} color="#FFFFFF" />
          <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.9 }}>
            SkillVerse AI Course
          </span>
        </div>
      </div>

      {/* 2. CARD CONTENT BODY */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem', flex: 1 }}>
        {/* Course Title */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.35 }}>
          {course.title}
        </h3>

        {/* Description */}
        <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {course.description || `Comprehensive AI-generated learning course on ${course.topic || 'this topic'}.`}
        </p>

        {/* Stats Pill Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: '#F3F4F6', padding: '0.25rem 0.625rem', borderRadius: '14px', fontSize: '0.725rem', fontWeight: 600, color: '#4B5563' }}>
            <Layers size={13} color="#6B7280" />
            <span>{course.total_modules || 0} Modules</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: '#F3F4F6', padding: '0.25rem 0.625rem', borderRadius: '14px', fontSize: '0.725rem', fontWeight: 600, color: '#4B5563' }}>
            <BookOpen size={13} color="#6B7280" />
            <span>{course.total_lessons || 0} Lessons</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: '#F3F4F6', padding: '0.25rem 0.625rem', borderRadius: '14px', fontSize: '0.725rem', fontWeight: 600, color: '#4B5563' }}>
            <HelpCircle size={13} color="#6B7280" />
            <span>{course.total_quizzes || course.total_modules || 0} Quizzes</span>
          </div>
        </div>

        {/* Progress Bar & Status */}
        <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
          {isPaused ? (
            <div style={{ background: '#FEF3C7', color: '#D97706', padding: '0.5rem 0.75rem', borderRadius: '10px', fontSize: '0.775rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Generation Paused</span>
              <RefreshCw size={13} className="animate-spin" />
            </div>
          ) : isGenerating ? (
            <div style={{ background: '#EEF2FF', color: '#4F46E5', padding: '0.5rem 0.75rem', borderRadius: '10px', fontSize: '0.775rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Generating Content...</span>
              <RefreshCw size={13} className="animate-spin" />
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.375rem', color: '#4B5563' }}>
                <span>Course Completion</span>
                <span style={{ color: '#2563EB' }}>{course.progress || 0}%</span>
              </div>
              <div style={{ height: '7px', width: '100%', background: '#E5E7EB', borderRadius: '10px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${course.progress || 0}%`,
                    background: 'linear-gradient(90deg, #2563EB 0%, #4F46E5 100%)',
                    borderRadius: '10px',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 3. FULL WIDTH BLUE ACTION BUTTON */}
        <button
          style={{
            width: '100%',
            background: isPaused ? '#D97706' : '#2563EB',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            marginTop: '0.25rem',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isPaused ? '#B45309' : '#1D4ED8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isPaused ? '#D97706' : '#2563EB';
          }}
        >
          {isPaused ? (
            <>
              <RefreshCw size={16} fill="#FFFFFF" />
              <span>Resume Generation</span>
            </>
          ) : (
            <>
              <Play size={16} fill="#FFFFFF" />
              <span>{(course.progress || 0) > 0 ? 'Continue Learning' : 'Start Course'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
