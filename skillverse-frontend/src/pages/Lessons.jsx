import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, BookOpen, FileText, ChevronRight, Layers } from 'lucide-react';
import { lessonService } from '../services/lessonService';
import LessonCard from '../components/LessonCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const Lessons = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialSearch = searchParams.get('search') || '';

  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const data = await lessonService.getAllUserLessons();
      setCoursesData(data);
    } catch (err) {
      console.error('Error fetching global lessons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const allLessonsList = coursesData.flatMap((c) => c.lessons);
  const completedLessonsCount = allLessonsList.filter((l) => l.completed).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(79, 70, 229, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5' }}>
              <BookOpen size={20} />
            </div>
            <h1 className="heading-1" style={{ margin: 0 }}>Course Lessons</h1>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Study and master lessons generated across all your active AI courses
          </p>
        </div>

        {/* Quick Stats Pills */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '0.5rem 0.875rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Lessons</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{allLessonsList.length}</div>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '0.5rem 0.875rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Completed</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10B981' }}>{completedLessonsCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', background: 'var(--bg-card)', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input
            type="text"
            placeholder="Search lessons by title, topic or content..."
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
            {coursesData.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title.length > 25 ? c.title.substring(0, 25) + '...' : c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="sv-select" style={{ width: '150px' }}>
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Incomplete</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading course lessons..." />
      ) : coursesData.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No lessons found"
          description="Generate your first course to view organized lessons here!"
          actionText="Create AI Course"
          onAction={() => navigate('/create-course')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {coursesData
            .filter((c) => selectedCourseFilter === 'all' || c.id === selectedCourseFilter)
            .map((course) => {
              const filteredLessons = course.lessons.filter((l) => {
                const matchesSearch =
                  l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (l.description && l.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  (l.moduleTitle && l.moduleTitle.toLowerCase().includes(searchQuery.toLowerCase()));
                const matchesStatus =
                  statusFilter === 'all' ||
                  (statusFilter === 'completed' && l.completed) ||
                  (statusFilter === 'pending' && !l.completed);
                return matchesSearch && matchesStatus;
              });

              if (filteredLessons.length === 0) return null;

              return (
                <div key={course.id} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Course Title Header */}
                  <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                      COURSE LESSONS
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                        Lessons in {course.title}
                      </h2>
                      <button
                        onClick={() => navigate(`/courses/${course.id}`)}
                        className="sv-btn sv-btn-secondary"
                        style={{ padding: '0.375rem 0.875rem', fontSize: '0.8125rem' }}
                      >
                        <span>View Course</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Cards Grid matching screenshot */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
                      gap: '1.5rem',
                    }}
                  >
                    {filteredLessons.map((lesson) => (
                      <LessonCard key={lesson.id} lesson={{ ...lesson, course_id: course.id }} />
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

export default Lessons;
