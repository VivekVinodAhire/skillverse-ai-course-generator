-- ========================================================
-- SkillVerse Production Supabase Database Schema Migration
-- ========================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'learner',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile trigger on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url',
    'learner'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'Beginner',
  language TEXT NOT NULL DEFAULT 'English',
  status TEXT DEFAULT 'generating', -- 'generating', 'paused', 'completed', 'failed'
  progress INTEGER DEFAULT 0,
  total_modules INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  total_quizzes INTEGER DEFAULT 0,
  generation_status TEXT DEFAULT 'generating',
  generation_error TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 3. MODULES TABLE
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  module_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 4. LESSONS TABLE
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  lesson_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  estimated_minutes INTEGER DEFAULT 15,
  difficulty TEXT,
  lesson_type TEXT DEFAULT 'concept',
  practice_task TEXT,
  key_takeaway TEXT,
  video_url TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 5. LESSON PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_lesson UNIQUE (user_id, lesson_id)
);


-- 6. QUIZZES TABLE
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INTEGER DEFAULT 60,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 7. QUIZ QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Format: { "A": "...", "B": "...", "C": "...", "D": "..." }
  correct_answer TEXT NOT NULL, -- Format: "A", "B", "C", or "D"
  explanation TEXT,
  question_number INTEGER NOT NULL
);


-- 8. QUIZ ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  answers JSONB NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);


-- 9. AI CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 10. AI MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 11. GENERATION JOBS TABLE (Idempotency & Resumability)
CREATE TABLE IF NOT EXISTS public.generation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_step TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  retry_count INTEGER DEFAULT 0,
  last_error TEXT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_courses_user_id ON public.courses(user_id);
CREATE INDEX IF NOT EXISTS idx_modules_course_id ON public.modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON public.lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_course_id ON public.quizzes(course_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON public.quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON public.ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_id ON public.ai_messages(conversation_id);


-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_jobs ENABLE ROW LEVEL SECURITY;


-- Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);


-- Courses Policies
DROP POLICY IF EXISTS "Users can view own courses" ON public.courses;
CREATE POLICY "Users can view own courses" ON public.courses
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own courses" ON public.courses;
CREATE POLICY "Users can insert own courses" ON public.courses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own courses" ON public.courses;
CREATE POLICY "Users can update own courses" ON public.courses
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own courses" ON public.courses;
CREATE POLICY "Users can delete own courses" ON public.courses
  FOR DELETE USING (auth.uid() = user_id);


-- Modules Policies
DROP POLICY IF EXISTS "Users can view modules of their courses" ON public.modules;
CREATE POLICY "Users can view modules of their courses" ON public.modules
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.courses WHERE courses.id = modules.course_id AND courses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert modules to their courses" ON public.modules;
CREATE POLICY "Users can insert modules to their courses" ON public.modules
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.courses WHERE courses.id = modules.course_id AND courses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can update modules of their courses" ON public.modules;
CREATE POLICY "Users can update modules of their courses" ON public.modules
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.courses WHERE courses.id = modules.course_id AND courses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can delete modules of their courses" ON public.modules;
CREATE POLICY "Users can delete modules of their courses" ON public.modules
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.courses WHERE courses.id = modules.course_id AND courses.user_id = auth.uid())
  );


-- Lessons Policies
DROP POLICY IF EXISTS "Users can view lessons of their courses" ON public.lessons;
CREATE POLICY "Users can view lessons of their courses" ON public.lessons
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.courses WHERE courses.id = lessons.course_id AND courses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert lessons to their courses" ON public.lessons;
CREATE POLICY "Users can insert lessons to their courses" ON public.lessons
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.courses WHERE courses.id = lessons.course_id AND courses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can update lessons of their courses" ON public.lessons;
CREATE POLICY "Users can update lessons of their courses" ON public.lessons
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.courses WHERE courses.id = lessons.course_id AND courses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can delete lessons of their courses" ON public.lessons;
CREATE POLICY "Users can delete lessons of their courses" ON public.lessons
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.courses WHERE courses.id = lessons.course_id AND courses.user_id = auth.uid())
  );


-- Lesson Progress Policies
DROP POLICY IF EXISTS "Users can view own lesson progress" ON public.lesson_progress;
CREATE POLICY "Users can view own lesson progress" ON public.lesson_progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own lesson progress" ON public.lesson_progress;
CREATE POLICY "Users can insert own lesson progress" ON public.lesson_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own lesson progress" ON public.lesson_progress;
CREATE POLICY "Users can update own lesson progress" ON public.lesson_progress
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own lesson progress" ON public.lesson_progress;
CREATE POLICY "Users can delete own lesson progress" ON public.lesson_progress
  FOR DELETE USING (auth.uid() = user_id);


-- Quizzes Policies
DROP POLICY IF EXISTS "Users can view quizzes of their courses" ON public.quizzes;
CREATE POLICY "Users can view quizzes of their courses" ON public.quizzes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.courses WHERE courses.id = quizzes.course_id AND courses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert quizzes to their courses" ON public.quizzes;
CREATE POLICY "Users can insert quizzes to their courses" ON public.quizzes
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.courses WHERE courses.id = quizzes.course_id AND courses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can update quizzes of their courses" ON public.quizzes;
CREATE POLICY "Users can update quizzes of their courses" ON public.quizzes
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.courses WHERE courses.id = quizzes.course_id AND courses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can delete quizzes of their courses" ON public.quizzes;
CREATE POLICY "Users can delete quizzes of their courses" ON public.quizzes
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.courses WHERE courses.id = quizzes.course_id AND courses.user_id = auth.uid())
  );


-- Quiz Questions Policies
DROP POLICY IF EXISTS "Users can view quiz questions of their courses" ON public.quiz_questions;
CREATE POLICY "Users can view quiz questions of their courses" ON public.quiz_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      JOIN public.courses ON courses.id = quizzes.course_id 
      WHERE quizzes.id = quiz_questions.quiz_id AND courses.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert quiz questions to their courses" ON public.quiz_questions;
CREATE POLICY "Users can insert quiz questions to their courses" ON public.quiz_questions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quizzes 
      JOIN public.courses ON courses.id = quizzes.course_id 
      WHERE quizzes.id = quiz_questions.quiz_id AND courses.user_id = auth.uid()
    )
  );


-- Quiz Attempts Policies
DROP POLICY IF EXISTS "Users can view own quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Users can view own quiz attempts" ON public.quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Users can insert own quiz attempts" ON public.quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);


-- AI Conversations Policies
DROP POLICY IF EXISTS "Users can view own AI conversations" ON public.ai_conversations;
CREATE POLICY "Users can view own AI conversations" ON public.ai_conversations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own AI conversations" ON public.ai_conversations;
CREATE POLICY "Users can insert own AI conversations" ON public.ai_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own AI conversations" ON public.ai_conversations;
CREATE POLICY "Users can update own AI conversations" ON public.ai_conversations
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own AI conversations" ON public.ai_conversations;
CREATE POLICY "Users can delete own AI conversations" ON public.ai_conversations
  FOR DELETE USING (auth.uid() = user_id);


-- AI Messages Policies
DROP POLICY IF EXISTS "Users can view own AI messages" ON public.ai_messages;
CREATE POLICY "Users can view own AI messages" ON public.ai_messages
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own AI messages" ON public.ai_messages;
CREATE POLICY "Users can insert own AI messages" ON public.ai_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);


-- Generation Jobs Policies
DROP POLICY IF EXISTS "Users can view own generation jobs" ON public.generation_jobs;
CREATE POLICY "Users can view own generation jobs" ON public.generation_jobs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own generation jobs" ON public.generation_jobs;
CREATE POLICY "Users can insert own generation jobs" ON public.generation_jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own generation jobs" ON public.generation_jobs;
CREATE POLICY "Users can update own generation jobs" ON public.generation_jobs
  FOR UPDATE USING (auth.uid() = user_id);
