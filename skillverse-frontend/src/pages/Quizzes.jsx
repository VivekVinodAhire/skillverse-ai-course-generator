import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Trophy, Search, Filter, Layers, ChevronRight, CheckCircle2 } from 'lucide-react';
import { quizService } from '../services/quizService';
import QuizCard from '../components/QuizCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const Quizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await quizService.getUserQuizzes();
      setQuizzes(data);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const totalQuizzes = quizzes.length;
  const completedQuizzesCount = quizzes.filter((q) => (q.attemptsCount || 0) > 0 || q.bestScore !== null).length;
  const passedQuizzesCount = quizzes.filter((q) => (q.bestScore || 0) >= (q.passing_score || 60)).length;
  const uniqueCourses = Array.from(new Set(quizzes.map((q) => q.courseTitle))).filter(Boolean);

  const quizzesByCourseMap = new Map();
  quizzes.forEach((quiz) => {
    const courseKey = quiz.course_id || quiz.courseTitle;
    if (!quizzesByCourseMap.has(courseKey)) {
      quizzesByCourseMap.set(courseKey, {
        courseId: quiz.course_id,
        courseTitle: quiz.courseTitle || 'Course',
        quizzes: [],
      });
    }
    quizzesByCourseMap.get(courseKey).quizzes.push(quiz);
  });

  const groupedCourses = Array.from(quizzesByCourseMap.values());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(217, 119, 6, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
              <Trophy size={20} />
            </div>
            <h1 className="heading-1" style={{ margin: 0 }}>Module Assessments & Quizzes</h1>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Test your knowledge, review explanations, and re-attend quizzes anytime
          </p>
        </div>

        {/* Header Stats Pills */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '0.5rem 0.875rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Quizzes</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>{totalQuizzes}</div>
          </div>
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.5rem 0.875rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#059669', textTransform: 'uppercase', fontWeight: 700 }}>Completed</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10B981' }}>{completedQuizzesCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', background: 'var(--bg-card)', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input
            type="text"
            placeholder="Search quizzes by title or module..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sv-input"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        {/* Filter by Course */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={16} color="var(--text-muted)" />
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="sv-select"
            style={{ minWidth: '180px' }}
          >
            <option value="all">All Courses</option>
            {uniqueCourses.map((title, idx) => (
              <option key={idx} value={title}>
                {title.length > 25 ? title.substring(0, 25) + '...' : title}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="sv-select" style={{ width: '160px' }}>
            <option value="all">All Quizzes</option>
            <option value="completed">Completed ✓</option>
            <option value="unattempted">Not Attempted</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching module assessments..." />
      ) : quizzes.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No quizzes generated yet"
          description="Quizzes are automatically generated when you create AI courses."
          actionText="Create AI Course"
          onAction={() => navigate('/create-course')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {groupedCourses
            .filter((group) => selectedCourseFilter === 'all' || group.courseTitle === selectedCourseFilter)
            .map((group) => {
              const filteredQuizzes = group.quizzes.filter((q) => {
                const isComp = (q.attemptsCount || 0) > 0 || q.bestScore !== null;
                const matchesSearch =
                  q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (q.moduleTitle && q.moduleTitle.toLowerCase().includes(searchQuery.toLowerCase()));

                let matchesStatus = true;
                if (statusFilter === 'completed') matchesStatus = isComp;
                else if (statusFilter === 'unattempted') matchesStatus = !isComp;

                return matchesSearch && matchesStatus;
              });

              if (filteredQuizzes.length === 0) return null;

              return (
                <div key={group.courseTitle} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Course Title Header */}
                  <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                      COURSE ASSESSMENTS
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                        Quizzes in {group.courseTitle}
                      </h2>
                      {group.courseId && (
                        <button
                          onClick={() => navigate(`/courses/${group.courseId}`)}
                          className="sv-btn sv-btn-secondary"
                          style={{ padding: '0.375rem 0.875rem', fontSize: '0.8125rem' }}
                        >
                          <span>View Course</span>
                          <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Quizzes Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
                      gap: '1.5rem',
                    }}
                  >
                    {filteredQuizzes.map((quiz) => (
                      <QuizCard key={quiz.id} quiz={quiz} />
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Quizzes;
