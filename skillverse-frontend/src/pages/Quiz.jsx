import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, RefreshCw, Trophy, HelpCircle, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { quizService } from '../services/quizService';
import LoadingSpinner from '../components/LoadingSpinner';

const Quiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answersMap, setAnswersMap] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const data = await quizService.getQuizById(quizId);
      setQuiz(data);
    } catch (err) {
      console.error('Error fetching quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
    window.scrollTo(0, 0);
  }, [quizId]);

  if (loading) return <LoadingSpinner text="Loading quiz assessment..." />;

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>Quiz questions not found</h3>
        <button onClick={() => navigate('/quizzes')} className="sv-btn sv-btn-primary" style={{ marginTop: '1rem' }}>
          Back to Quizzes
        </button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(answersMap).length;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  const handleSelectOption = (optionKey) => {
    if (result) return; // Read-only after submission
    setAnswersMap((prev) => ({
      ...prev,
      [currentQuestion.id]: optionKey,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (answeredCount < totalQuestions) {
      if (!window.confirm(`You answered ${answeredCount} of ${totalQuestions} questions. Do you want to submit anyway?`)) {
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await quizService.submitQuizAttempt(quizId, answersMap);
      setResult(res);
      window.scrollTo(0, 0);
    } catch (err) {
      alert(`Error submitting quiz: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetQuiz = () => {
    setResult(null);
    setAnswersMap({});
    setCurrentQuestionIndex(0);
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Back Link */}
      <div>
        <Link to="/quizzes" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>
          <ArrowLeft size={16} />
          <span>Back to Quizzes</span>
        </Link>
      </div>

      {!result ? (
        /* QUIZ PLAYER VIEW */
        <div
          className="animate-fade-in"
          style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
          }}
        >
          {/* Header Progress Bar */}
          <div style={{ background: '#F8FAFC', padding: '1.5rem 2rem', borderBottom: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {quiz.courseTitle} • {quiz.moduleTitle}
                </span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: 0, marginTop: '0.25rem' }}>
                  {quiz.title}
                </h2>
              </div>
              <span
                style={{
                  background: '#EEF2FF',
                  color: '#4F46E5',
                  padding: '0.375rem 0.875rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                }}
              >
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div style={{ height: '6px', width: '100%', background: '#E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPercent}%`, background: 'linear-gradient(90deg, #2563EB 0%, #4F46E5 100%)', borderRadius: '10px', transition: 'width 0.3s ease' }} />
            </div>

            {/* Question Quick Jump Dots Navigation Bar */}
            <div style={{ display: 'flex', gap: '0.375rem', marginTop: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748B', marginRight: '0.25rem' }}>Questions:</span>
              {quiz.questions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAnswered = !!answersMap[q.id];

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: isCurrent ? '2px solid #2563EB' : '1px solid #CBD5E1',
                      background: isCurrent ? '#2563EB' : isAnswered ? '#10B981' : '#FFFFFF',
                      color: isCurrent || isAnswered ? '#FFFFFF' : '#475569',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    title={`Question ${idx + 1}${isAnswered ? ' (Answered)' : ''}`}
                  >
                    {isAnswered && !isCurrent ? <Check size={12} strokeWidth={3} /> : idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question & Options Body */}
          <div style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E293B', marginBottom: '1.75rem', lineHeight: 1.45 }}>
              <span style={{ color: '#2563EB', marginRight: '0.5rem' }}>Q{currentQuestionIndex + 1}.</span>
              {currentQuestion.question}
            </h3>

            {/* Option A/B/C/D Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2rem' }}>
              {Object.entries(currentQuestion.options || {}).map(([key, value]) => {
                const isSelected = answersMap[currentQuestion.id] === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleSelectOption(key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem 1.25rem',
                      borderRadius: '14px',
                      border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                      background: isSelected ? '#EFF6FF' : '#FFFFFF',
                      color: isSelected ? '#1E3A8A' : '#334155',
                      textAlign: 'left',
                      fontSize: '0.95rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.1)' : '0 2px 4px rgba(0, 0, 0, 0.02)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#93C5FD';
                        e.currentTarget.style.background = '#F8FAFC';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#E2E8F0';
                        e.currentTarget.style.background = '#FFFFFF';
                      }
                    }}
                  >
                    <span
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: isSelected ? '#2563EB' : '#F1F5F9',
                        color: isSelected ? '#FFFFFF' : '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        flexShrink: 0,
                      }}
                    >
                      {key}
                    </span>
                    <span style={{ flex: 1 }}>{value}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Nav & Submit Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem' }}>
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
                disabled={currentQuestionIndex === 0}
                className="sv-btn sv-btn-secondary"
                style={{ padding: '0.625rem 1.25rem' }}
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>

              <div style={{ fontSize: '0.825rem', color: '#64748B', fontWeight: 600 }}>
                {answeredCount} of {totalQuestions} Answered
              </div>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, totalQuestions - 1))}
                  className="sv-btn sv-btn-primary"
                  style={{ padding: '0.625rem 1.25rem' }}
                >
                  <span>Next Question</span>
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={submitting}
                  style={{
                    background: '#10B981',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.625rem 1.5rem',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                  }}
                >
                  <CheckCircle2 size={18} />
                  <span>{submitting ? 'Submitting...' : 'Submit Quiz'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* RESULTS OVERVIEW VIEW */
        <div
          className="animate-fade-in"
          style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
            padding: '2.5rem 2rem',
          }}
        >
          {/* Top Score Banner */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: result.passed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                color: result.passed ? '#10B981' : '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
              }}
            >
              {result.passed ? <Trophy size={36} /> : <XCircle size={36} />}
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: 0 }}>
              {result.passed ? 'Congratulations! You Passed! 🎉' : 'Keep Practicing! 💪'}
            </h2>

            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: result.passed ? '#10B981' : '#EF4444', margin: '0.5rem 0' }}>
              {result.score}%
            </div>

            <p style={{ fontSize: '0.925rem', color: '#64748B', margin: 0 }}>
              You answered <strong>{result.correctCount}</strong> out of <strong>{result.totalQuestions}</strong> questions correctly (Passing Score: {result.passingScore}%)
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleResetQuiz}
                style={{
                  background: '#F1F5F9',
                  color: '#334155',
                  border: '1px solid #CBD5E1',
                  borderRadius: '12px',
                  padding: '0.625rem 1.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={16} />
                <span>Retake Quiz</span>
              </button>

              <button
                onClick={() => navigate('/quizzes')}
                style={{
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.625rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                }}
              >
                <span>Back to All Quizzes</span>
              </button>
            </div>
          </div>

          {/* Explanation & Answers Review List */}
          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E293B', marginBottom: '1.5rem' }}>
              Detailed Question Answers & Explanations
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {quiz.questions.map((q, qIdx) => {
                const ansInfo = result.processedAnswers[q.id];
                const isCorrect = ansInfo?.isCorrect;

                return (
                  <div
                    key={q.id}
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderRadius: '14px',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderLeft: `5px solid ${isCorrect ? '#10B981' : '#EF4444'}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.625rem', fontWeight: 700, fontSize: '0.975rem', color: '#1E293B' }}>
                      {isCorrect ? <CheckCircle2 size={20} color="#10B981" /> : <XCircle size={20} color="#EF4444" />}
                      <span>Q{qIdx + 1}. {q.question}</span>
                    </div>

                    <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span>Selected: <strong style={{ color: isCorrect ? '#10B981' : '#EF4444' }}>Option {ansInfo?.selectedOption || 'None'}</strong></span>
                      <span>Correct Answer: <strong style={{ color: '#10B981' }}>Option {q.correct_answer}</strong></span>
                    </div>

                    {q.explanation && (
                      <div style={{ fontSize: '0.825rem', color: '#334155', background: '#FFFFFF', padding: '0.875rem 1rem', borderRadius: '10px', border: '1px solid #E2E8F0', marginTop: '0.625rem', lineHeight: 1.5 }}>
                        💡 <strong>Gemini Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
