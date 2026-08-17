import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, HelpCircle, Play, CheckCircle2, RotateCcw } from 'lucide-react';

const QuizCard = ({ quiz }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/quiz/${quiz.id}`);
  };

  const isCompleted = (quiz.attemptsCount || 0) > 0 || quiz.bestScore !== null;
  const isPassed = isCompleted && (quiz.bestScore || 0) >= (quiz.passing_score || 60);

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
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(37, 99, 235, 0.15)';
        e.currentTarget.style.borderColor = '#2563EB';
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
            ? isPassed
              ? 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)'
              : 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)'
            : 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
          padding: '1.25rem 1.25rem 1rem 1.25rem',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '140px',
        }}
      >
        {/* Top Left Pill: Module Tag */}
        <span
          style={{
            position: 'absolute',
            top: '0.875rem',
            left: '0.875rem',
            background: '#FFFFFF',
            fontSize: '0.7rem',
            fontWeight: 800,
            color: '#374151',
            padding: '0.25rem 0.625rem',
            borderRadius: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          {quiz.moduleNumber ? `Module ${quiz.moduleNumber}` : 'Lesson Quiz'}
        </span>

        {/* Top Right Pill: Completed Tick Badge / Status */}
        <span
          style={{
            position: 'absolute',
            top: '0.875rem',
            right: '0.875rem',
            background: '#FFFFFF',
            fontSize: '0.725rem',
            fontWeight: 800,
            color: isCompleted ? (isPassed ? '#059669' : '#D97706') : '#4B5563',
            padding: '0.25rem 0.625rem',
            borderRadius: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 size={13} color={isPassed ? '#059669' : '#D97706'} />
              <span>Completed ({quiz.bestScore}%)</span>
            </>
          ) : (
            <span>Not Attempted</span>
          )}
        </span>

        {/* Center Trophy Icon & Label */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
          <Trophy size={38} color={isPassed ? '#059669' : '#D97706'} strokeWidth={2} />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isPassed ? '#065F46' : '#92400E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {isCompleted ? 'Quiz Completed' : 'Assessment'}
          </span>
        </div>
      </div>

      {/* 2. CARD CONTENT BODY */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem', flex: 1 }}>
        {/* Module Title Box with Orange Left Border */}
        <div
          style={{
            background: '#FFFBEB',
            borderLeft: '4px solid #F59E0B',
            borderRadius: '0 8px 8px 0',
            padding: '0.5rem 0.75rem',
          }}
        >
          <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.125rem' }}>
            {quiz.moduleTitle ? quiz.moduleTitle.toUpperCase() : 'MODULE ASSESSMENT'}
          </div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1F2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {quiz.moduleTitle || 'Module Knowledge Check'}
          </div>
        </div>

        {/* Main Quiz Title */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.3 }}>
          {quiz.title}
        </h3>

        {/* Subtitle / Description */}
        <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {quiz.description || 'Test your knowledge on key module concepts, definitions, and practical application.'}
        </p>

        {/* Metadata Pills Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: '#F3F4F6', padding: '0.25rem 0.625rem', borderRadius: '14px', fontSize: '0.725rem', fontWeight: 600, color: '#4B5563' }}>
            <HelpCircle size={13} color="#6B7280" />
            <span>{quiz.questionCount || 10} Questions</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: '#F3F4F6', padding: '0.25rem 0.625rem', borderRadius: '14px', fontSize: '0.725rem', fontWeight: 600, color: '#4B5563' }}>
            <Trophy size={13} color="#6B7280" />
            <span>{quiz.passing_score || 60}% Pass</span>
          </div>

          {isCompleted && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: isPassed ? '#ECFDF5' : '#FEF3C7', padding: '0.25rem 0.625rem', borderRadius: '14px', fontSize: '0.725rem', fontWeight: 800, color: isPassed ? '#059669' : '#D97706' }}>
              <CheckCircle2 size={12} />
              <span>Score: {quiz.bestScore}%</span>
            </div>
          )}
        </div>

        {/* 3. FULL WIDTH BLUE ACTION BUTTON */}
        <button
          style={{
            width: '100%',
            background: isCompleted ? '#4F46E5' : '#2563EB',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            marginTop: '0.5rem',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isCompleted ? '#4338CA' : '#1D4ED8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isCompleted ? '#4F46E5' : '#2563EB';
          }}
        >
          {isCompleted ? (
            <>
              <RotateCcw size={16} fill="#FFFFFF" />
              <span>Re-attend Quiz ↻</span>
            </>
          ) : (
            <>
              <Play size={16} fill="#FFFFFF" />
              <span>Start Quiz ▶</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuizCard;
