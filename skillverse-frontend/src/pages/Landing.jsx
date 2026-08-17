import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Cpu,
  Target,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  MessageSquare,
  Trophy,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
  HelpCircle,
  Menu,
  X,
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [quickTopic, setQuickTopic] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleQuickGenerate = (e) => {
    e.preventDefault();
    if (quickTopic.trim()) {
      navigate(`/create-course?topic=${encodeURIComponent(quickTopic.trim())}`);
    } else {
      navigate('/signup');
    }
  };

  const sampleTopics = [
    'OOPS in JAVA interview',
    'React 19 & Next.js',
    'Python Machine Learning',
    'Data Structures & Algorithms',
    'System Design Basics',
  ];

  const faqs = [
    {
      question: 'What is SkillVerse AI and how does it work?',
      answer: 'SkillVerse AI is an intelligent personalized learning platform powered by Google Gemini. Enter any skill or interview topic, and SkillVerse automatically generates structured modules, interactive lessons, hands-on practice tasks, 10-question quizzes, and a 24/7 AI Tutor.',
    },
    {
      question: 'How many questions are generated in each quiz?',
      answer: 'Every lesson gets 1 dedicated assessment containing EXACTLY 10 multiple-choice questions with real-time scoring, completion tick badges, and AI explanations.',
    },
    {
      question: 'How does the 24/7 AI Tutor work?',
      answer: 'Your AI Tutor understands the exact context of the lesson or course you are reading. You can ask code questions, request simple analogies, or debug code 24/7.',
    },
    {
      question: 'Is SkillVerse AI free to get started?',
      answer: 'Yes! You can sign up for free and generate personalized courses instantly with dual-key Gemini failover for high availability.',
    },
  ];

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #3B82F6 0%, #60A5FA 25%, #93C5FD 55%, #E0F2FE 80%, #F0F7FF 100%)',
        color: '#0F172A',
        minHeight: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflowX: 'hidden',
      }}
    >
      {/* 1. TOP STICKY NAVIGATION BAR (HIGH CONTRAST MOBILE-RESPONSIVE HEADER) */}
      <header
        style={{
          height: '74px',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.25rem', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo with Mortarboard / Graduation Cap */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                flexShrink: 0,
              }}
            >
              <GraduationCap size={24} color="#FFFFFF" />
            </div>
            <div>
              <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1 }}>
                SkillVerse <span style={{ color: '#2563EB' }}>AI</span>
              </span>
              <span style={{ display: 'block', fontSize: '0.625rem', fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Powered Learning
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="sv-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
            <a href="#how-it-works" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', textDecoration: 'none' }}>How It Works</a>
            <a href="#features" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', textDecoration: 'none' }}>Features</a>
            <a href="#ai-tutor" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', textDecoration: 'none' }}>AI Tutor</a>
            <a href="#faq" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', textDecoration: 'none' }}>FAQ</a>
            <Link to="/login" style={{ fontSize: '0.9rem', fontWeight: 800, color: '#2563EB', textDecoration: 'none' }}>Login</Link>
            <Link
              to="/signup"
              style={{
                background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
                color: '#FFFFFF',
                padding: '0.625rem 1.25rem',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 900,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
              }}
            >
              <span>Get Started Free</span>
              <ArrowRight size={16} color="#FFFFFF" />
            </Link>
          </nav>

          {/* Mobile Hamburger Toggle Button */}
          <button
            className="sv-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', padding: '0.5rem', color: '#0F172A', border: 'none', background: 'transparent' }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Nav Dropdown Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              position: 'absolute',
              top: '74px',
              left: 0,
              right: 0,
              background: '#FFFFFF',
              borderBottom: '1px solid #E2E8F0',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              zIndex: 60,
            }}
          >
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', textDecoration: 'none' }}>How It Works</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', textDecoration: 'none' }}>Features</a>
            <a href="#ai-tutor" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', textDecoration: 'none' }}>AI Tutor</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', textDecoration: 'none' }}>FAQ</a>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #E2E8F0' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ textAlign: 'center', padding: '0.75rem', fontSize: '0.95rem', fontWeight: 800, color: '#2563EB', textDecoration: 'none', border: '1px solid #2563EB', borderRadius: '12px' }}>
                Login
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)} style={{ textAlign: 'center', padding: '0.75rem', fontSize: '0.95rem', fontWeight: 900, color: '#FFFFFF', background: '#2563EB', borderRadius: '12px', textDecoration: 'none' }}>
                Get Started Free →
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section style={{ padding: '3.5rem 1.25rem 3rem 1.25rem', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '980px', margin: '0 auto', textAlign: 'center' }}>
          {/* Top Pill Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.25)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.45)',
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 800,
              marginBottom: '1.5rem',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              maxWidth: '100%',
            }}
          >
            <GraduationCap size={18} color="#FFFFFF" style={{ flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>SkillVerse AI — Powered Learning Platform</span>
          </div>

          {/* Responsive Hero Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.1rem, 5vw, 3.35rem)',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
              letterSpacing: '-0.03em',
              textShadow: '0 2px 10px rgba(0,0,0,0.12)',
            }}
          >
            Learn Any Skill 10x Faster with <br />
            <span style={{ color: '#FFFFFF', borderBottom: '4px solid #FDE047', paddingBottom: '0.1rem' }}>
              Instant AI Courses & Quizzes
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.125rem)', color: '#F0F9FF', maxWidth: '780px', margin: '0 auto 2.25rem auto', lineHeight: 1.65, fontWeight: 600 }}>
            Type any skill or topic. SkillVerse AI automatically generates structured modules, interactive lessons, hands-on practice tasks, 10-question quizzes, and a 24/7 context-aware AI Tutor.
          </p>

          {/* Live Instant Course Generator Glass Box */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.88)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(16px)',
              padding: '1.5rem',
              borderRadius: '24px',
              boxShadow: '0 20px 45px rgba(15, 23, 42, 0.3)',
              maxWidth: '780px',
              margin: '0 auto',
              color: '#FFFFFF',
            }}
          >
            <form onSubmit={handleQuickGenerate} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <input
                type="text"
                placeholder="Enter any topic e.g. OOPS in JAVA, React 19..."
                value={quickTopic}
                onChange={(e) => setQuickTopic(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: '220px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  padding: '0.875rem 1.25rem',
                  borderRadius: '14px',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '0.875rem 1.75rem',
                  fontSize: '0.95rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                  width: '100%',
                  maxWidth: '220px',
                }}
              >
                <Sparkles size={18} />
                <span>Generate Course</span>
              </button>
            </form>

            {/* Sample Topic Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.775rem', color: '#94A3B8', fontWeight: 600 }}>Try sample topics:</span>
              {sampleTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => navigate(`/create-course?topic=${encodeURIComponent(topic)}`)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: '#E2E8F0',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '16px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  + {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Responsive Stats Metrics Glass Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginTop: '3rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(12px)', padding: '1.25rem 1rem', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.6)', boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1D4ED8' }}>100% Instant</div>
              <div style={{ fontSize: '0.775rem', color: '#1E293B', fontWeight: 700, marginTop: '0.25rem' }}>AI Course Generation</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(12px)', padding: '1.25rem 1rem', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.6)', boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#4F46E5' }}>10 Questions</div>
              <div style={{ fontSize: '0.775rem', color: '#1E293B', fontWeight: 700, marginTop: '0.25rem' }}>Per Lesson Quiz</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(12px)', padding: '1.25rem 1rem', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.6)', boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#059669' }}>24/7 Active</div>
              <div style={{ fontSize: '0.775rem', color: '#1E293B', fontWeight: 700, marginTop: '0.25rem' }}>Context-Aware AI Tutor</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(12px)', padding: '1.25rem 1rem', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.6)', boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#D97706' }}>Dual-Key</div>
              <div style={{ fontSize: '0.775rem', color: '#1E293B', fontWeight: 700, marginTop: '0.25rem' }}>Gemini Failover Protection</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (3 SIMPLE STEPS) */}
      <section id="how-it-works" style={{ padding: '4rem 1.25rem', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255, 255, 255, 0.6)', borderBottom: '1px solid rgba(255, 255, 255, 0.6)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              SIMPLE & EFFICIENT
            </div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 900, color: '#0F172A', margin: 0 }}>
              How SkillVerse AI Works in 3 Steps
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#334155', marginTop: '0.5rem', fontWeight: 600 }}>
              From typing a topic to mastering lessons and taking quizzes in minutes
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {/* Step 1 */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(147, 197, 253, 0.6)',
                borderRadius: '20px',
                padding: '1.75rem 1.25rem',
                textAlign: 'center',
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.06)',
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#2563EB', color: '#FFFFFF', fontWeight: 900, fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}>
                1
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                Type Any Topic
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#475569', margin: 0, lineHeight: 1.55 }}>
                Enter any programming language, interview topic, science concept, or business skill.
              </p>
            </div>

            {/* Step 2 */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(147, 197, 253, 0.6)',
                borderRadius: '20px',
                padding: '1.75rem 1.25rem',
                textAlign: 'center',
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.06)',
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#4F46E5', color: '#FFFFFF', fontWeight: 900, fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}>
                2
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                Instant AI Course Creation
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#475569', margin: 0, lineHeight: 1.55 }}>
                Gemini AI generates structured modules, detailed markdown lessons, code snippets, and 10-question quizzes.
              </p>
            </div>

            {/* Step 3 */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(147, 197, 253, 0.6)',
                borderRadius: '20px',
                padding: '1.75rem 1.25rem',
                textAlign: 'center',
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.06)',
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#059669', color: '#FFFFFF', fontWeight: 900, fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)' }}>
                3
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                Learn, Test & Chat with AI
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#475569', margin: 0, lineHeight: 1.55 }}>
                Read interactive lessons, attempt 10-question quizzes, get instant explanations, and ask the 24/7 AI Tutor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE FEATURES GRID */}
      <section id="features" style={{ padding: '4rem 1.25rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              POWERFUL FEATURES
            </div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 900, color: '#0F172A', margin: 0 }}>
              Designed for Speed, Clarity & Skill Mastery
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#334155', marginTop: '0.5rem', fontWeight: 600 }}>
              Everything you need for structured self-paced learning
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {/* Feature 1 */}
            <div style={{ background: '#FFFFFF', border: '1px solid rgba(147, 197, 253, 0.6)', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 8px 24px rgba(37, 99, 235, 0.06)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#EEF2FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Cpu size={26} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                Instant AI Curriculum Generator
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                Generates complete multi-module courses with tailored difficulty levels, step-by-step topics, and estimated reading times.
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{ background: '#FFFFFF', border: '1px solid rgba(147, 197, 253, 0.6)', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 8px 24px rgba(37, 99, 235, 0.06)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <BookOpen size={26} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                Interactive Lesson Reader
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                Clean reading environment with syntax-highlighted code blocks, key takeaway callouts, practice tasks, and video search.
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{ background: '#FFFFFF', border: '1px solid rgba(147, 197, 253, 0.6)', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 8px 24px rgba(37, 99, 235, 0.06)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Trophy size={26} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                10-Question Lesson Quizzes
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                Every lesson gets 1 dedicated quiz containing 10 questions with real-time scoring, completion tick badges, and AI explanations.
              </p>
            </div>

            {/* Feature 4 */}
            <div id="ai-tutor" style={{ background: '#FFFFFF', border: '1px solid rgba(147, 197, 253, 0.6)', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 8px 24px rgba(37, 99, 235, 0.06)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <MessageSquare size={26} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                24/7 Context-Aware AI Tutor
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                Ask questions anytime while learning. Your AI Tutor automatically reads your current course & lesson context to explain concepts simply.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE FAQ SECTION */}
      <section id="faq" style={{ padding: '4rem 1.25rem', background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255, 255, 255, 0.6)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              FREQUENTLY ASKED QUESTIONS
            </div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', fontWeight: 900, color: '#0F172A', margin: 0 }}>
              Got Questions? We've Got Answers
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(147, 197, 253, 0.6)',
                    borderRadius: '16px',
                    padding: '1.125rem 1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.04)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp size={18} color="#2563EB" /> : <ChevronDown size={18} color="#64748B" />}
                  </div>
                  {isOpen && (
                    <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, margin: 0, paddingTop: '0.75rem', borderTop: '1px solid #E2E8F0' }}>
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CTA BANNER */}
      <section style={{ padding: '4rem 1.25rem' }}>
        <div
          style={{
            maxWidth: '960px',
            margin: '0 auto',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #312E81 100%)',
            borderRadius: '24px',
            padding: '3rem 1.5rem',
            textAlign: 'center',
            color: '#FFFFFF',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.2)',
          }}
        >
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', fontWeight: 900, marginBottom: '0.75rem' }}>
            Ready to Supercharge Your Learning?
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#CBD5E1', maxWidth: '600px', margin: '0 auto 1.75rem auto', lineHeight: 1.6 }}>
            Join SkillVerse AI today. Generate personalized courses, master lessons, attempt 10-question quizzes, and learn with your AI Tutor.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.875rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/signup')}
              style={{
                background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '14px',
                padding: '0.875rem 2rem',
                fontSize: '0.95rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              }}
            >
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '14px',
                padding: '0.875rem 2rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <span>Login to Account</span>
            </button>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(147, 197, 253, 0.6)', background: '#E0F2FE', padding: '2rem 1.25rem', fontSize: '0.875rem', color: '#334155' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#0F172A' }}>
            <GraduationCap size={20} color="#2563EB" />
            <span>SkillVerse AI Platform © 2026</span>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', fontWeight: 700 }}>
            <Link to="/login" style={{ color: '#334155', textDecoration: 'none' }}>Login</Link>
            <Link to="/signup" style={{ color: '#1D4ED8', textDecoration: 'none' }}>Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
