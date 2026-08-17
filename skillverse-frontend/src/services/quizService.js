import { supabase } from '../lib/supabase';

export const quizService = {
  // Fetch all quizzes belonging to current user's courses
  async getUserQuizzes() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: courses } = await supabase
      .from('courses')
      .select('id, title')
      .order('created_at', { ascending: false });

    if (!courses || courses.length === 0) return [];
    const courseIds = courses.map((c) => c.id);

    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select('*')
      .in('course_id', courseIds);

    if (error) throw error;
    if (!quizzes || quizzes.length === 0) return [];

    const quizIds = quizzes.map((q) => q.id);

    // Fetch quiz questions count
    const { data: questions } = await supabase
      .from('quiz_questions')
      .select('id, quiz_id')
      .in('quiz_id', quizIds);

    // Fetch user quiz attempts
    const { data: attempts } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', user.id)
      .in('quiz_id', quizIds);

    const { data: modules } = await supabase
      .from('modules')
      .select('id, title')
      .in('course_id', courseIds);

    return quizzes.map((quiz) => {
      const course = courses.find((c) => c.id === quiz.course_id);
      const moduleData = (modules || []).find((m) => m.id === quiz.module_id);
      const qQuestions = (questions || []).filter((q) => q.quiz_id === quiz.id);
      const qAttempts = (attempts || []).filter((a) => a.quiz_id === quiz.id);

      const bestScore = qAttempts.length > 0 ? Math.max(...qAttempts.map((a) => a.score)) : null;
      const lastAttempt = qAttempts.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())[0];

      return {
        ...quiz,
        courseTitle: course?.title || 'Course',
        moduleTitle: moduleData?.title || 'Module',
        questionCount: qQuestions.length,
        attemptsCount: qAttempts.length,
        bestScore,
        lastAttempt,
        status: lastAttempt ? (lastAttempt.passed ? 'passed' : 'failed') : 'unattempted',
      };
    });
  },

  // Get individual quiz with its questions
  async getQuizById(quizId) {
    const { data: quiz, error: qErr } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .maybeSingle();

    if (qErr) throw qErr;

    const { data: questions, error: questErr } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('question_number', { ascending: true });

    if (questErr) throw questErr;

    const { data: course } = await supabase.from('courses').select('title').eq('id', quiz?.course_id || '').maybeSingle();
    const { data: moduleData } = await supabase.from('modules').select('title').eq('id', quiz?.module_id || '').maybeSingle();

    return {
      ...quiz,
      courseTitle: course?.title || 'Course',
      moduleTitle: moduleData?.title || 'Module',
      questions: questions || [],
    };
  },

  // Submit quiz attempt, calculate score, save to DB
  async submitQuizAttempt(quizId, answersMap) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const quiz = await this.getQuizById(quizId);
    const questions = quiz.questions;

    let correctCount = 0;
    const processedAnswers = {};

    questions.forEach((q) => {
      const selected = answersMap[q.id];
      const isCorrect = selected === q.correct_answer;
      if (isCorrect) correctCount++;

      processedAnswers[q.id] = {
        questionId: q.id,
        selectedOption: selected,
        correctOption: q.correct_answer,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const passed = scorePercentage >= (quiz.passing_score || 60);

    const { data: attempt, error } = await supabase
      .from('quiz_attempts')
      .insert({
        user_id: user.id,
        quiz_id: quizId,
        score: scorePercentage,
        total_questions: questions.length,
        passed,
        answers: processedAnswers,
        completed_at: new Date().toISOString(),
      })
      .select()
      .maybeSingle();

    if (error) throw error;

    return {
      attemptId: attempt.id,
      score: scorePercentage,
      correctCount,
      totalQuestions: questions.length,
      passed,
      passingScore: quiz.passing_score,
      processedAnswers,
    };
  },
};
