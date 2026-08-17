import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Play, CheckCircle2, FileText } from 'lucide-react';

const LessonCard = ({ lesson }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/lessons/${lesson.course_id}/${lesson.id}`);
  };

  const isCompleted = lesson.completed;

  return (
    <div
      className="animate-fade-in"
      onClick={handleCardClick}
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
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(79, 70, 229, 0.15)';
        e.currentTarget.style.borderColor = '#4F46E5';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.04)';
        e.currentTarget.style.borderColor = '#E5E7EB';
      }}
    >
      {/* 1. TOP GRADIENT BANNER HEADER */}
      <div
        style={{
          background: isCompleted
            ? 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)'
            : 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
          padding: '1.25rem 1.25rem 1rem 1.25rem',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '140px',
        }}
      >
        {/* Top Left Pill: Lesson Number Tag */}
        <span
          style={{
            position: 'absolute',
            top: '0.875rem',
            left: '0.875rem',
            background: '#FFFFFF',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#374151',
            padding: '0.25rem 0.625rem',
            borderRadius: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          {`Lesson ${lesson.lesson_number || 1}`}
        </span>

        {/* Top Right Pill: Status / Difficulty */}
        <span
          style={{
            position: 'absolute',
            top: '0.875rem',
            right: '0.875rem',
            background: '#FFFFFF',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: isCompleted ? '#10B981' : '#4F46E5',
            padding: '0.25rem 0.625rem',
            borderRadius: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          {isCompleted ? 'Completed' : lesson.difficulty || 'Beginner'}
        </span>

        {/* Center Book / Reading Icon */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
          {isCompleted ? (
            <CheckCircle2 size={38} color="#10B981" strokeWidth={2} />
          ) : (
            <BookOpen size={38} color="#4F46E5" strokeWidth={2} />
          )}
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isCompleted ? '#065F46' : '#3730A3', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Module Lesson
          </span>
        </div>
      </div>

      {/* 2. CARD CONTENT BODY */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem', flex: 1 }}>
        {/* Module Title Box with Blue Left Border */}
        <div
          style={{
            background: '#EEF2FF',
            borderLeft: '4px solid #4F46E5',
            borderRadius: '0 8px 8px 0',
            padding: '0.5rem 0.75rem',
          }}
        >
          <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#4338CA', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.125rem' }}>
            {lesson.moduleTitle ? lesson.moduleTitle.toUpperCase() : 'MODULE LESSON'}
          </div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1F2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {lesson.moduleTitle || `Module ${lesson.module_id}`}
          </div>
        </div>

        {/* Main Lesson Title */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.3 }}>
          {lesson.title}
        </h3>

        {/* Subtitle / Description */}
        <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {lesson.description || 'Master key concepts, practical code examples, and step-by-step tutorials in this lesson.'}
        </p>

        {/* Metadata Pills Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: '#F3F4F6', padding: '0.25rem 0.625rem', borderRadius: '14px', fontSize: '0.725rem', fontWeight: 600, color: '#4B5563' }}>
            <Clock size={13} color="#6B7280" />
            <span>{lesson.estimated_minutes || 15} Mins</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: '#F3F4F6', padding: '0.25rem 0.625rem', borderRadius: '14px', fontSize: '0.725rem', fontWeight: 600, color: '#4B5563' }}>
            <FileText size={13} color="#6B7280" />
            <span>{lesson.difficulty || 'Beginner'}</span>
          </div>

          {isCompleted && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: '#ECFDF5', padding: '0.25rem 0.625rem', borderRadius: '14px', fontSize: '0.725rem', fontWeight: 700, color: '#059669' }}>
              <span>Read Completed</span>
            </div>
          )}
        </div>

        {/* 3. FULL WIDTH ACTION BUTTON */}
        <button
          style={{
            width: '100%',
            background: isCompleted ? '#059669' : '#2563EB',
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
            marginTop: '0.5rem',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isCompleted ? '#047857' : '#1D4ED8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isCompleted ? '#059669' : '#2563EB';
          }}
        >
          <Play size={16} fill="#FFFFFF" />
          <span>{isCompleted ? 'Review Lesson' : 'Start Lesson'}</span>
        </button>
      </div>
    </div>
  );
};

export default LessonCard;
