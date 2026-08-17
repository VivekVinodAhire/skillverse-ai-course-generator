import { supabase } from '../lib/supabase';

export const lessonService = {
  // Get all lessons owned by current user grouped or list format
  async getAllUserLessons() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Fetch user courses
    const { data: courses, error: cErr } = await supabase
      .from('courses')
      .select('id, title, description, difficulty, language')
      .order('created_at', { ascending: false });

    if (cErr) throw cErr;
    if (!courses || courses.length === 0) return [];

    const courseIds = courses.map((c) => c.id);

    // Fetch modules
    const { data: modules, error: mErr } = await supabase
      .from('modules')
      .select('*')
      .in('course_id', courseIds)
      .order('module_number', { ascending: true });

    if (mErr) throw mErr;

    // Fetch lessons
    const { data: lessons, error: lErr } = await supabase
      .from('lessons')
      .select('*')
      .in('course_id', courseIds)
      .order('lesson_number', { ascending: true });

    if (lErr) throw lErr;

    // Fetch user progress
    const { data: progressList } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', user.id);

    const progressMap = new Map((progressList || []).map((p) => [p.lesson_id, p.completed]));

    // Map lessons to courses and modules
    return courses.map((course) => {
      const courseModules = (modules || []).filter((m) => m.course_id === course.id);
      const courseLessons = (lessons || [])
        .filter((l) => l.course_id === course.id)
        .map((l) => {
          const mod = courseModules.find((m) => m.id === l.module_id);
          return {
            ...l,
            courseTitle: course.title,
            moduleTitle: mod?.title || `Module ${l.module_id}`,
            completed: !!progressMap.get(l.id),
          };
        });

      const completedCount = courseLessons.filter((l) => l.completed).length;

      return {
        ...course,
        modules: courseModules,
        lessons: courseLessons,
        completedLessons: completedCount,
        totalLessons: courseLessons.length,
        progress: courseLessons.length > 0 ? Math.round((completedCount / courseLessons.length) * 100) : 0,
      };
    });
  },

  // Get single lesson details with prev/next navigation context
  async getLessonDetail(courseId, lessonId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: lesson, error: lErr } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .eq('course_id', courseId)
      .maybeSingle();

    if (lErr) throw lErr;

    // Fetch course & module details
    const { data: course } = await supabase.from('courses').select('*').eq('id', courseId).maybeSingle();
    const { data: moduleData } = await supabase.from('modules').select('*').eq('id', lesson?.module_id || '').maybeSingle();

    // Fetch all lessons in course for Prev / Next navigation
    const { data: allCourseLessons } = await supabase
      .from('lessons')
      .select('id, title, lesson_number, module_id')
      .eq('course_id', courseId)
      .order('lesson_number', { ascending: true });

    const currentIndex = (allCourseLessons || []).findIndex((l) => l.id === lessonId);
    const prevLesson = currentIndex > 0 ? allCourseLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < (allCourseLessons || []).length - 1 ? allCourseLessons[currentIndex + 1] : null;

    // Check completion status
    const { data: prog } = await supabase
      .from('lesson_progress')
      .select('completed')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .maybeSingle();

    // Fetch quiz for this module / lesson
    const { data: quiz } = await supabase
      .from('quizzes')
      .select('id, title')
      .eq('module_id', lesson?.module_id || '')
      .limit(1)
      .maybeSingle();

    return {
      ...lesson,
      course,
      module: moduleData,
      quizId: quiz?.id || null,
      quizTitle: quiz?.title || null,
      completed: !!prog?.completed,
      lessonIndex: currentIndex + 1,
      totalLessons: (allCourseLessons || []).length,
      prevLesson,
      nextLesson,
      allCourseLessons: allCourseLessons || [],
    };
  },

  // Mark lesson as complete and update course progress
  async markLessonComplete(courseId, lessonId, isCompleted = true) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Upsert lesson_progress
    const { error: progErr } = await supabase
      .from('lesson_progress')
      .upsert(
        {
          user_id: user.id,
          lesson_id: lessonId,
          completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,lesson_id' }
      );

    if (progErr) throw progErr;

    // Recalculate course progress percentage
    const { data: allLessons } = await supabase
      .from('lessons')
      .select('id')
      .eq('course_id', courseId);

    if (allLessons && allLessons.length > 0) {
      const lessonIds = allLessons.map((l) => l.id);
      const { data: completedLessons } = await supabase
        .from('lesson_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('completed', true)
        .in('lesson_id', lessonIds);

      const completedCount = completedLessons?.length || 0;
      const progressPercent = Math.round((completedCount / allLessons.length) * 100);

      await supabase
        .from('courses')
        .update({ progress: progressPercent, updated_at: new Date().toISOString() })
        .eq('id', courseId);
    }

    return true;
  },
};
