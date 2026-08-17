import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Layers, HelpCircle, PlayCircle, CheckCircle2, RefreshCw, Sparkles, Clock, Globe, BarChart2 } from 'lucide-react';
import { courseService } from '../services/courseService';
import LoadingSpinner from '../components/LoadingSpinner';
import LessonCard from '../components/LessonCard';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourseById(courseId);
      setCourse(data);
    } catch (err) {
      console.error('Error fetching course detail:', err);
      setError(err.message || 'Course not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  if (loading) return <LoadingSpinner text="Loading course details..." />;

  if (error || !course) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>Course not found</h3>
        <button onClick={() => navigate('/my-courses')} className="sv-btn sv-btn-primary" style={{ marginTop: '1rem' }}>
          Back to My Courses
        </button>
      </div>
    );
  }

  const isPaused = course.generation_status === 'paused';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Navigation */}
      <div>
        <Link to="/my-courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          <ArrowLeft size={16} />
          <span>Back to My Courses</span>
        </Link>
      </div>

      {/* Course Hero Banner Card */}
      <div className="sv-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <span className="sv-badge sv-badge-primary">{course.topic || 'General'}</span>
          <span className="sv-badge sv-badge-secondary">{course.difficulty}</span>
          <span className="sv-badge sv-badge-primary" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
            <Globe size={12} /> {course.language || 'English'}
          </span>
        </div>

        <h1 className="heading-1" style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{course.title}</h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '850px', lineHeight: 1.6 }}>
          {course.description}
        </p>

        {/* Progress Bar & Status */}
        {isPaused ? (
          <div style={{ background: 'var(--warning-light)', color: 'var(--warning)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <strong>Course Generation Paused</strong>
              <div style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>Some modules are ready to study. Resume anytime to finish remaining content.</div>
            </div>
            <button onClick={() => navigate(`/create-course?resumeCourseId=${course.id}`)} className="sv-btn sv-btn-primary">
              <RefreshCw size={16} />
              <span>Resume Generation</span>
            </button>
          </div>
        ) : (
          <div style={{ background: 'var(--background)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              <span>Overall Course Completion</span>
              <span>{course.progress || 0}%</span>
            </div>
            <div className="sv-progress-track" style={{ height: '0.625rem' }}>
              <div className="sv-progress-fill" style={{ width: `${course.progress || 0}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Modules List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 className="heading-2" style={{ fontSize: '1.35rem' }}>Course Modules</h2>

        {(course.modules || []).map((mod, modIdx) => (
          <div key={mod.id} className="sv-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Module {mod.module_number || modIdx + 1}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.125rem' }}>
                  {mod.title}
                </h3>
                {mod.description && <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{mod.description}</p>}
              </div>

              {mod.quiz && (
                <button
                  onClick={() => navigate(`/quiz/${mod.quiz.id}`)}
                  className="sv-btn sv-btn-outline"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}
                >
                  <HelpCircle size={16} />
                  <span>Module Quiz</span>
                </button>
              )}
            </div>

            {/* Lessons Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              {(mod.lessons || []).map((lesson) => (
                <LessonCard key={lesson.id} lesson={{ ...lesson, courseTitle: course.title, moduleTitle: mod.title, course_id: course.id }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDetail;
