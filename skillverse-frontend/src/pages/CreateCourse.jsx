import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, Layers, BookOpen, Globe, BarChart2, CheckCircle2, RefreshCw, AlertTriangle, ArrowRight } from 'lucide-react';
import { courseService } from '../services/courseService';
import LoadingSpinner from '../components/LoadingSpinner';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialTopic = searchParams.get('topic') || '';
  const resumeCourseId = searchParams.get('resumeCourseId') || null;

  // Form Configuration State
  const [topic, setTopic] = useState(initialTopic);
  const [difficulty, setDifficulty] = useState('Beginner');
  const [language, setLanguage] = useState('English');
  const [modulesCount, setModulesCount] = useState(3);
  const [lessonsPerModuleCount, setLessonsPerModuleCount] = useState(3);

  // Generation Screen State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSteps, setGenerationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [generationError, setGenerationError] = useState(null);

  // Auto-resume if resumeCourseId parameter present
  useEffect(() => {
    if (resumeCourseId) {
      resumeExistingGeneration(resumeCourseId);
    }
  }, [resumeCourseId]);

  const totalLessonsCalculated = modulesCount * lessonsPerModuleCount;

  // Execute incremental generation workflow
  const startGeneration = async (e) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setGenerationError(null);

    // Prepare steps list
    const steps = [
      { id: 'outline', title: 'Creating course roadmap & outline', status: 'pending' },
    ];
    for (let i = 1; i <= modulesCount; i++) {
      steps.push({ id: `module_${i}`, title: `Generating Module ${i} (Lessons & Quiz)`, status: 'pending' });
    }
    steps.push({ id: 'finalize', title: 'Finalizing and publishing course', status: 'pending' });

    setGenerationSteps(steps);
    setCurrentStepIndex(0);

    try {
      // Step 1: Init Outline
      updateStepStatus(0, 'loading');
      const initResult = await courseService.generateCourseStep({
        action: 'init',
        topic,
        difficulty,
        language,
        modulesCount,
        lessonsPerModuleCount,
      });

      const courseId = initResult.courseId;
      setActiveCourseId(courseId);
      updateStepStatus(0, 'completed');

      // Step 2..N: Generate Modules
      for (let i = 1; i <= modulesCount; i++) {
        setCurrentStepIndex(i);
        updateStepStatus(i, 'loading');

        await courseService.generateCourseStep({
          action: 'generate_module',
          courseId,
          moduleNumber: i,
          lessonsPerModuleCount,
        });

        updateStepStatus(i, 'completed');
      }

      // Step Final: Finalize
      setCurrentStepIndex(modulesCount + 1);
      updateStepStatus(modulesCount + 1, 'loading');

      await courseService.generateCourseStep({
        action: 'finalize',
        courseId,
      });

      updateStepStatus(modulesCount + 1, 'completed');

      // Navigate to generated course page
      setTimeout(() => {
        navigate(`/courses/${courseId}`);
      }, 1000);
    } catch (err) {
      console.error('Course generation error:', err);
      setGenerationError(err.message || 'Generation was interrupted.');
      if (currentStepIndex < generationSteps.length) {
        updateStepStatus(currentStepIndex, 'failed');
      }
    }
  };

  const resumeExistingGeneration = async (courseId) => {
    setIsGenerating(true);
    setActiveCourseId(courseId);
    setGenerationError(null);

    try {
      // Fetch course info
      const course = await courseService.getCourseById(courseId);
      setTopic(course.title);

      const modCount = course.total_modules || 3;

      const steps = [
        { id: 'outline', title: 'Creating course roadmap & outline', status: 'completed' },
      ];
      for (let i = 1; i <= modCount; i++) {
        const mod = course.modules?.find((m) => m.module_number === i);
        const isDone = mod && mod.lessons && mod.lessons.length > 0;
        steps.push({
          id: `module_${i}`,
          title: `Generating Module ${i} (Lessons & Quiz)`,
          status: isDone ? 'completed' : 'pending',
        });
      }
      steps.push({ id: 'finalize', title: 'Finalizing and publishing course', status: 'pending' });

      setGenerationSteps(steps);

      // Find first unfinished module
      let startIdx = 1;
      while (startIdx <= modCount && steps[startIdx].status === 'completed') {
        startIdx++;
      }

      for (let i = startIdx; i <= modCount; i++) {
        setCurrentStepIndex(i);
        updateStepStatus(i, 'loading');

        await courseService.generateCourseStep({
          action: 'generate_module',
          courseId,
          moduleNumber: i,
          lessonsPerModuleCount: 3,
        });

        updateStepStatus(i, 'completed');
      }

      // Finalize
      setCurrentStepIndex(modCount + 1);
      updateStepStatus(modCount + 1, 'loading');

      await courseService.generateCourseStep({
        action: 'finalize',
        courseId,
      });

      updateStepStatus(modCount + 1, 'completed');
      setTimeout(() => navigate(`/courses/${courseId}`), 1000);
    } catch (err) {
      console.error('Resume generation error:', err);
      setGenerationError(err.message || 'Resume failed. Please try again.');
    }
  };

  const updateStepStatus = (index, status) => {
    setGenerationSteps((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], status };
      }
      return copy;
    });
  };

  const completedStepsCount = generationSteps.filter((s) => s.status === 'completed').length;
  const progressPercent = generationSteps.length > 0 ? Math.round((completedStepsCount / generationSteps.length) * 100) : 0;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {!isGenerating ? (
        /* Form View */
        <div className="sv-card animate-fade-in" style={{ padding: '2.5rem 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '0.75rem', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h1 className="heading-2" style={{ fontSize: '1.5rem' }}>Create AI Course</h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Configure course parameters and let Gemini AI generate custom curriculum</p>
            </div>
          </div>

          <form onSubmit={startGeneration} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Topic Input */}
            <div className="sv-input-group">
              <label className="sv-label">Course Topic or Skill</label>
              <input
                type="text"
                required
                placeholder="e.g. Learn C# from beginner to advanced, Master React 18, Data Structures in Python..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="sv-input"
                style={{ fontSize: '1rem', padding: '0.75rem 1rem' }}
              />
            </div>

            {/* Difficulty & Language */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="sv-input-group">
                <label className="sv-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <BarChart2 size={16} />
                  <span>Difficulty Level</span>
                </label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="sv-select">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="sv-input-group">
                <label className="sv-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Globe size={16} />
                  <span>Course Language</span>
                </label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="sv-select">
                  <option value="English">English</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
            </div>

            {/* Modules & Lessons per Module */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="sv-input-group">
                <label className="sv-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Layers size={16} />
                  <span>Number of Modules (1–6)</span>
                </label>
                <select value={modulesCount} onChange={(e) => setModulesCount(Number(e.target.value))} className="sv-select">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Module' : 'Modules'}</option>
                  ))}
                </select>
              </div>

              <div className="sv-input-group">
                <label className="sv-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <BookOpen size={16} />
                  <span>Lessons per Module (1–6)</span>
                </label>
                <select value={lessonsPerModuleCount} onChange={(e) => setLessonsPerModuleCount(Number(e.target.value))} className="sv-select">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Lesson' : 'Lessons'}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Estimated Total Calculation Preview */}
            <div style={{ background: 'var(--primary-light)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary)' }}>ESTIMATED CURRICULUM</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.125rem' }}>
                  {modulesCount} modules × {lessonsPerModuleCount} lessons = <strong>{totalLessonsCalculated} total lessons</strong>
                </div>
              </div>
              <span className="sv-badge sv-badge-primary">1 Quiz / Module</span>
            </div>

            <button type="submit" className="sv-btn sv-btn-primary" style={{ padding: '0.875rem', fontSize: '1rem', marginTop: '0.5rem' }}>
              <Sparkles size={18} />
              <span>Generate Course with AI</span>
            </button>
          </form>
        </div>
      ) : (
        /* Live Generation Screen */
        <div className="sv-card animate-fade-in" style={{ padding: '2.5rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
              }}
            >
              <Sparkles size={30} className="animate-spin" />
            </div>

            <h2 className="heading-2">Creating your course</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>"{topic}"</p>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              <span>Generation Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="sv-progress-track" style={{ height: '0.75rem' }}>
              <div className="sv-progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          {/* Steps Indicator List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2rem' }}>
            {generationSteps.map((step, idx) => (
              <div
                key={step.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: step.status === 'loading' ? 'var(--primary-light)' : step.status === 'completed' ? 'var(--success-light)' : 'var(--background)',
                  border: step.status === 'loading' ? '1px solid var(--primary)' : '1px solid var(--border)',
                }}
              >
                {step.status === 'completed' ? (
                  <CheckCircle2 size={20} color="var(--success)" />
                ) : step.status === 'loading' ? (
                  <RefreshCw size={20} className="animate-spin" color="var(--primary)" />
                ) : step.status === 'failed' ? (
                  <AlertTriangle size={20} color="var(--danger)" />
                ) : (
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid var(--border-strong)' }} />
                )}

                <span style={{ fontSize: '0.9rem', fontWeight: step.status === 'loading' ? 600 : 500, color: step.status === 'completed' ? 'var(--text-main)' : step.status === 'loading' ? 'var(--primary)' : 'var(--text-muted)' }}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>

          {/* Error & Quota Limit Banner / Modal */}
          {generationError && (
            <>
              {/* Modal Overlay */}
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 9999,
                  padding: '1.5rem',
                }}
              >
                <div
                  className="animate-fade-in"
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    maxWidth: '520px',
                    width: '100%',
                    padding: '2.25rem 2rem',
                    textAlign: 'center',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                      color: '#D97706',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem auto',
                      boxShadow: '0 10px 15px -3px rgba(217, 119, 6, 0.2)',
                    }}
                  >
                    <Sparkles size={32} />
                  </div>

                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem' }}>
                    We're working on your course!
                  </h3>

                  <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    AI rate limits were temporarily reached, but <strong>we have built a smart solution for you!</strong> Your course roadmap and all completed modules are safely saved in your dashboard.
                  </p>

                  <div
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '14px',
                      padding: '1rem',
                      fontSize: '0.85rem',
                      color: '#334155',
                      textAlign: 'left',
                      marginBottom: '1.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#2563EB' }}>
                      <CheckCircle2 size={16} />
                      <span>What happens next?</span>
                    </div>
                    <div>1. You can log out or switch pages anytime—your progress is saved.</div>
                    <div>2. Return in a few minutes and click <strong>Resume Generation</strong> on your Dashboard.</div>
                    <div>3. SkillVerse will finish generating your modules and display your complete course!</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button
                      onClick={() => activeCourseId && resumeExistingGeneration(activeCourseId)}
                      className="sv-btn sv-btn-primary"
                      style={{ padding: '0.875rem', fontSize: '0.95rem', fontWeight: 700, borderRadius: '12px' }}
                    >
                      <RefreshCw size={18} />
                      <span>Try Resuming Now</span>
                    </button>

                    <button
                      onClick={() => navigate('/dashboard')}
                      className="sv-btn sv-btn-secondary"
                      style={{ padding: '0.75rem', fontSize: '0.9rem', borderRadius: '12px' }}
                    >
                      <span>Go to Dashboard</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateCourse;
