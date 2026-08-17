import React from 'react';
import { HelpCircle, Sparkles, BookOpen, Target, MessageSquare, ShieldCheck, Mail } from 'lucide-react';

const Help = () => {
  const faqs = [
    {
      icon: Sparkles,
      question: 'How does AI Course Generation work?',
      answer:
        'When you enter a topic (e.g. "React Web Development"), SkillVerse uses server-side Google Gemini AI to construct a course outline, detailed multi-module lessons, code examples, practice tasks, and quizzes automatically.',
    },
    {
      icon: BookOpen,
      question: 'How do lessons and progress tracking work?',
      answer:
        'Each lesson features structured explanations, code snippets with copy actions, and practice tasks. Clicking "Mark as Completed" updates your course completion percentage instantly on your dashboard.',
    },
    {
      icon: Target,
      question: 'How are quizzes structured?',
      answer:
        'Every course module comes with an auto-generated quiz containing 5 multiple-choice questions. Once submitted, you receive instant scoring along with detailed explanations for correct answers.',
    },
    {
      icon: MessageSquare,
      question: 'How does the AI Tutor work?',
      answer:
        'The AI Tutor is available 24/7. When opened from a lesson page, it automatically understands your current course and lesson context so it can answer questions specifically about what you are studying.',
    },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 className="heading-1">Help Center</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Find quick answers and guides for using SkillVerse</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {faqs.map((faq, idx) => {
          const Icon = faq.icon;
          return (
            <div key={idx} className="sv-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>{faq.question}</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, paddingLeft: '3px' }}>
                {faq.answer}
              </p>
            </div>
          );
        })}
      </div>

      <div className="sv-card" style={{ background: 'var(--primary-light)', padding: '1.5rem', textAlign: 'center' }}>
        <Mail size={28} color="var(--primary)" style={{ margin: '0 auto 0.5rem auto' }} />
        <h4 style={{ fontWeight: 700, color: 'var(--primary)' }}>Still have questions?</h4>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Contact SkillVerse support or chat directly with your AI Tutor anytime!
        </p>
      </div>
    </div>
  );
};

export default Help;
