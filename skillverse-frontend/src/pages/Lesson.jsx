import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Youtube,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Award,
  HelpCircle,
  PlayCircle,
  Trophy,
} from 'lucide-react';
import { lessonService } from '../services/lessonService';
import CodeBlock from '../components/CodeBlock';
import LoadingSpinner from '../components/LoadingSpinner';

const Lesson = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState(null);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const data = await lessonService.getLessonDetail(courseId, lessonId);
      setLessonData(data);
    } catch (err) {
      console.error('Error fetching lesson:', err);
      setError(err.message || 'Lesson not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLesson();
    window.scrollTo(0, 0);
  }, [courseId, lessonId]);

  const handleToggleComplete = async () => {
    if (!lessonData) return;
    const newStatus = !lessonData.completed;

    setLessonData((prev) => ({ ...prev, completed: newStatus }));
    setCompleting(true);

    try {
      await lessonService.markLessonComplete(courseId, lessonId, newStatus);
    } catch (err) {
      console.error('Failed to update lesson completion:', err);
      setLessonData((prev) => ({ ...prev, completed: !newStatus }));
      alert('Could not update progress. Please try again.');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Opening lesson reader..." />;

  if (error || !lessonData) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>Lesson not found</h3>
        <button onClick={() => navigate(`/courses/${courseId}`)} className="sv-btn sv-btn-primary" style={{ marginTop: '1rem' }}>
          Back to Course
        </button>
      </div>
    );
  }

  const renderFormattedContent = (contentString) => {
    if (!contentString) return null;

    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(contentString)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: contentString.substring(lastIndex, match.index) });
      }
      parts.push({ type: 'code', language: match[1] || 'javascript', content: match[2].trim() });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < contentString.length) {
      parts.push({ type: 'text', content: contentString.substring(lastIndex) });
    }

    return parts.map((part, idx) => {
      if (part.type === 'code') {
        return <CodeBlock key={idx} code={part.content} language={part.language} />;
      }
      return (
        <div key={idx} style={{ lineHeight: 1.7, fontSize: '1rem', color: '#1E293B', marginBottom: '1.25rem', whiteSpace: 'pre-line' }}>
          {part.content}
        </div>
      );
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Top Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <Link to={`/courses/${courseId}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>
          <ArrowLeft size={16} />
          <span>Back to {lessonData.course?.title || 'Course'}</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          <span>Module: <strong>{lessonData.module?.title}</strong></span>
          <span>•</span>
          <span>Lesson {lessonData.lessonIndex} of {lessonData.totalLessons}</span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="sv-lesson-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
        {/* Left Column: Lesson Reader */}
        <div style={{ minWidth: 0 }}>
          {/* Lesson Hero Banner */}
          <div className="sv-card" style={{ padding: '2rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)', borderRadius: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span className="sv-badge sv-badge-primary" style={{ textTransform: 'uppercase' }}>
                  {lessonData.lesson_type || 'Concept'}
                </span>
                <span className="sv-badge sv-badge-secondary">
                  <Clock size={12} /> {lessonData.estimated_minutes || 15} mins
                </span>
              </div>

              <button
                onClick={handleToggleComplete}
                disabled={completing}
                className={`sv-btn ${lessonData.completed ? 'sv-btn-secondary' : 'sv-btn-primary'}`}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.8125rem',
                  borderColor: lessonData.completed ? 'var(--success)' : undefined,
                  color: lessonData.completed ? 'var(--success)' : undefined,
                }}
              >
                <CheckCircle2 size={16} color={lessonData.completed ? 'var(--success)' : '#ffffff'} />
                <span>{lessonData.completed ? 'Completed ✓' : 'Mark as Completed'}</span>
              </button>
            </div>

            <h1 className="heading-1" style={{ fontSize: '2rem', marginBottom: '0.75rem', lineHeight: 1.25 }}>
              {lessonData.title}
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {lessonData.description}
            </p>
          </div>

          {/* Main Learning Content Body */}
          <div className="sv-card" style={{ padding: '2rem', marginBottom: '1.5rem', borderRadius: '18px' }}>
            <div style={{ fontSize: '1rem', color: 'var(--text-main)' }}>
              {renderFormattedContent(lessonData.content)}
            </div>

            {/* Practice Task Box */}
            {lessonData.practice_task && (
              <div className="sv-callout sv-callout-warning" style={{ margin: '2rem 0', borderRadius: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem', color: 'var(--warning)', marginBottom: '0.5rem' }}>
                  <Award size={18} />
                  <span>Hands-on Practice Task</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  {lessonData.practice_task}
                </p>
              </div>
            )}

            {/* Key Takeaway Summary Box */}
            {lessonData.key_takeaway && (
              <div className="sv-callout sv-callout-success" style={{ margin: '1.5rem 0', borderRadius: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem', color: 'var(--success)', marginBottom: '0.375rem' }}>
                  <Lightbulb size={18} />
                  <span>Key Takeaway</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  {lessonData.key_takeaway}
                </p>
              </div>
            )}

            {/* PROMINENT LESSON QUIZ CALLOUT BOX */}
            <div
              style={{
                marginTop: '2rem',
                background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '16px',
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
                    background: '#F59E0B',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Trophy size={26} />
                </div>
                <div>
                  <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    TEST YOUR KNOWLEDGE
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#78350F', margin: '0.125rem 0' }}>
                    Attend Lesson Quiz (10 Questions)
                  </h3>
                  <p style={{ fontSize: '0.825rem', color: '#92400E', margin: 0 }}>
                    Test your understanding of {lessonData.title} with 10 interactive questions.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (lessonData.quizId) {
                    navigate(`/quiz/${lessonData.quizId}`);
                  } else {
                    navigate('/quizzes');
                  }
                }}
                style={{
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.75rem 1.5rem',
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
                <HelpCircle size={18} />
                <span>Attend Quiz Now ▶</span>
              </button>
            </div>

            {/* Video Search Trigger Action */}
            {lessonData.video_url && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>Want a video walkthrough?</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Find targeted YouTube video tutorials for this lesson topic</div>
                </div>
                <a href={lessonData.video_url} target="_blank" rel="noopener noreferrer" className="sv-btn sv-btn-outline" style={{ color: '#EF4444', borderColor: '#EF4444' }}>
                  <Youtube size={16} />
                  <span>Find Video Tutorials</span>
                </a>
              </div>
            )}
          </div>

          {/* Bottom Prev / Next Lesson Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginTop: '1rem' }}>
            {lessonData.prevLesson ? (
              <button
                onClick={() => navigate(`/lessons/${courseId}/${lessonData.prevLesson.id}`)}
                className="sv-btn sv-btn-secondary"
                style={{ padding: '0.75rem 1.25rem' }}
              >
                <ChevronLeft size={18} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Previous Lesson</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{lessonData.prevLesson.title}</div>
                </div>
              </button>
            ) : <div />}

            {lessonData.nextLesson ? (
              <button
                onClick={() => navigate(`/lessons/${courseId}/${lessonData.nextLesson.id}`)}
                className="sv-btn sv-btn-primary"
                style={{ padding: '0.75rem 1.25rem' }}
              >
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Next Lesson</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{lessonData.nextLesson.title}</div>
                </div>
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={() => navigate(`/courses/${courseId}`)}
                className="sv-btn sv-btn-primary"
                style={{ padding: '0.75rem 1.25rem' }}
              >
                <span>Complete Course</span>
                <CheckCircle2 size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Right Column Desktop Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Direct Attend Quiz Card */}
          <div className="sv-card" style={{ background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B45309', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              <Trophy size={18} />
              <span>Lesson Assessment</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#78350F', marginBottom: '1rem', lineHeight: 1.4 }}>
              Take the 10-question quiz for "{lessonData.title}" to verify your understanding.
            </p>
            <button
              onClick={() => {
                if (lessonData.quizId) {
                  navigate(`/quiz/${lessonData.quizId}`);
                } else {
                  navigate('/quizzes');
                }
              }}
              style={{
                width: '100%',
                background: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '0.625rem 1rem',
                fontSize: '0.825rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.375rem',
                cursor: 'pointer',
              }}
            >
              <HelpCircle size={15} />
              <span>Attend Quiz Now ▶</span>
            </button>
          </div>

          {/* Ask AI Tutor Banner */}
          <div className="sv-card" style={{ background: 'linear-gradient(135deg, var(--primary-light), var(--secondary-light))', border: '1px solid rgba(79, 70, 229, 0.2)', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Sparkles size={18} />
              <span>Have a Question?</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-main)', marginBottom: '1rem', lineHeight: 1.4 }}>
              Ask your AI Tutor about "{lessonData.title}". It understands this exact lesson context.
            </p>
            <button
              onClick={() => navigate('/ai-tutor')}
              className="sv-btn sv-btn-primary"
              style={{ width: '100%', fontSize: '0.8125rem' }}
            >
              <MessageSquare size={16} />
              <span>Ask AI Tutor</span>
            </button>
          </div>

          {/* Course Outline Stepper */}
          <div className="sv-card" style={{ padding: '1.25rem', borderRadius: '16px' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Course Lessons ({lessonData.totalLessons})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto' }}>
              {(lessonData.allCourseLessons || []).map((l, idx) => {
                const isActive = l.id === lessonId;
                return (
                  <div
                    key={l.id}
                    onClick={() => navigate(`/lessons/${courseId}/${l.id}`)}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8125rem',
                      fontWeight: isActive ? 600 : 400,
                      background: isActive ? 'var(--primary-light)' : 'transparent',
                      color: isActive ? 'var(--primary)' : 'var(--text-main)',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', width: '18px' }}>
                      {idx + 1}.
                    </span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {l.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .sv-lesson-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Lesson;
