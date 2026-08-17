# SkillVerse — AI-Powered Personalized Learning Platform

SkillVerse is a production-ready full-stack AI learning platform built with **React**, **Vite**, **Supabase (Auth, PostgreSQL, RLS, Edge Functions)**, and **Google Gemini AI**.

---

## 🌟 Key Features

1. **Public Landing Page**: Professional SaaS landing page with feature breakdowns and call to actions.
2. **Supabase Auth**: Secure Registration, Login, Logout, session restoration across refreshes, and password reset.
3. **Resumable AI Course Generation**:
   - Generates multi-module courses, structured lessons, and module quizzes incrementally.
   - Dual Gemini API Key failover (`GEMINI_API_KEY_1` & `GEMINI_API_KEY_2`) and model fallback.
   - Status tracking (`generating`, `paused`, `completed`) allowing full generation resumption without data loss.
4. **Redesigned Industry-Level Learning Interface**:
   - Distraction-free reader with syntax highlighting, copy-code triggers, key takeaways, practice tasks, and video search integration.
5. **Interactive Quizzes**:
   - Auto-generated module quizzes with instant scoring, pass/fail thresholds, and detailed answer explanations.
6. **24/7 AI Tutor**:
   - Context-aware chat assistant grounded in the user's current course and lesson topic.
7. **Strict Security**:
   - Row Level Security (RLS) enabled on all tables (`profiles`, `courses`, `modules`, `lessons`, `quizzes`, `quiz_questions`, `quiz_attempts`, `ai_conversations`, `ai_messages`).
   - Zero exposed API secrets in frontend code.

---

## 📁 Repository Structure

```
skillverse/
├── skillverse-frontend/
│   ├── src/
│   │   ├── components/       # Header, Sidebar, CourseCard, LessonCard, CodeBlock, etc.
│   │   ├── context/          # AuthContext with session restoration
│   │   ├── hooks/            # useAuth hook
│   │   ├── layouts/          # DashboardLayout, PublicLayout
│   │   ├── lib/              # Centralized Supabase client
│   │   ├── pages/            # Landing, Login, Signup, Dashboard, My Courses, CreateCourse,
│   │   │                     # CourseDetail, Lessons, Lesson (Redesigned), Quizzes, Quiz,
│   │   │                     # AITutor, Profile, Settings, Help
│   │   ├── services/         # courseService, lessonService, quizService, progressService, tutorService
│   │   ├── App.jsx           # React Router route configuration
│   │   ├── main.jsx
│   │   └── index.css         # Modern SaaS CSS Design System
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── supabase/
│   ├── migrations/
│   │   └── 20260817000000_skillverse_schema.sql # Complete PostgreSQL schema, FKs, & RLS policies
│   ├── functions/
│   │   ├── generate-course/  # Resumable course generation Edge Function
│   │   ├── ai-tutor/         # AI Tutor chat Edge Function
│   │   └── _shared/          # Gemini client with 2-key failover & model fallback
│   ├── config.toml
│   └── seed.sql
│
└── README.md
```

---

## ⚙️ Required Environment Configuration

### 1. Frontend Environment Variables (`skillverse-frontend/.env`)
```env
VITE_SUPABASE_URL=https://hbtqxiyjemfjmabstquk.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_quXZy0Nl4tzukD46PTCAxg_0rJCeBT-
```

### 2. Supabase Edge Function Secrets (Configured in Supabase Dashboard or CLI)
```env
GEMINI_API_KEY_1=your_primary_gemini_api_key
GEMINI_API_KEY_2=your_secondary_gemini_api_key
GEMINI_MODEL_PRIMARY=gemini-3.6-flash
GEMINI_MODEL_FALLBACK=gemini-3.5-flash
```

---

## 🚀 Running Locally

1. Navigate to the frontend directory and install dependencies:
   ```bash
   cd skillverse-frontend
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```
