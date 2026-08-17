import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Filter, BookOpen, Sparkles, Layers } from 'lucide-react';
import { courseService } from '../services/courseService';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const Courses = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getUserCourses();
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.topic.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDiff =
      difficultyFilter === 'all' || c.difficulty?.toLowerCase() === difficultyFilter.toLowerCase();

    let matchesStatus = true;
    if (statusFilter === 'completed') matchesStatus = (c.progress || 0) === 100;
    else if (statusFilter === 'in_progress') matchesStatus = (c.progress || 0) > 0 && (c.progress || 0) < 100;
    else if (statusFilter === 'paused') matchesStatus = c.status === 'paused' || c.generation_status === 'paused';

    return matchesSearch && matchesDiff && matchesStatus;
  });

  const totalCourses = courses.length;
  const completedCourses = courses.filter((c) => (c.progress || 0) === 100).length;
  const inProgressCourses = courses.filter((c) => (c.progress || 0) > 0 && (c.progress || 0) < 100).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header & New Course Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(37, 99, 235, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
              <BookOpen size={20} />
            </div>
            <h1 className="heading-1" style={{ margin: 0 }}>My Courses</h1>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Manage, organize, and continue your AI-generated learning paths
          </p>
        </div>

        <button onClick={() => navigate('/create-course')} className="sv-btn sv-btn-primary" style={{ padding: '0.625rem 1.25rem' }}>
          <PlusCircle size={18} />
          <span>Create AI Course</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', background: 'var(--bg-card)', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input
            type="text"
            placeholder="Search by title, topic, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sv-input"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        {/* Filter by Difficulty */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="sv-select"
            style={{ width: '150px' }}
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Filter by Progress Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={16} color="var(--text-muted)" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="sv-select"
            style={{ width: '150px' }}
          >
            <option value="all">All Status</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="paused">Generation Paused</option>
          </select>
        </div>
      </div>

      {/* Courses Grid Section */}
      {loading ? (
        <LoadingSpinner text="Fetching your courses..." />
      ) : filteredCourses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={searchQuery ? 'No matching courses found' : "You haven't created any courses yet"}
          description={searchQuery ? 'Try clearing your search or filter criteria.' : 'Click below to generate your first AI course!'}
          actionText={searchQuery ? undefined : 'Create AI Course'}
          onAction={searchQuery ? undefined : () => navigate('/create-course')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Subtitle Counter */}
          <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ALL ENROLLED COURSES ({filteredCourses.length})
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
              {inProgressCourses} in progress • {completedCourses} completed
            </div>
          </div>

          {/* Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.5rem' }}>
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} onDeleteSuccess={fetchCourses} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
