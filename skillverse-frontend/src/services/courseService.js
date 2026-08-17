import { supabase } from '../lib/supabase';

export const courseService = {
  // Get all courses owned by current user
  async getUserCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get full course detail by ID including modules, lessons, and quizzes
  async getCourseById(courseId) {
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .maybeSingle();

    if (courseError) throw courseError;

    // Fetch modules
    const { data: modules, error: modError } = await supabase
      .from('modules')
      .select('*')
      .eq('course_id', courseId)
      .order('module_number', { ascending: true });

    if (modError) throw modError;

    // Fetch lessons
    const { data: lessons, error: lesError } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('lesson_number', { ascending: true });

    if (lesError) throw lesError;

    // Fetch quizzes
    const { data: quizzes, error: qzError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('course_id', courseId);

    if (qzError) throw qzError;

    return {
      ...course,
      modules: (modules || []).map((m) => ({
        ...m,
        lessons: (lessons || []).filter((l) => l.module_id === m.id),
        quiz: (quizzes || []).find((q) => q.module_id === m.id) || null,
      })),
    };
  },

  // Delete course (cascades to modules, lessons, quizzes, progress)
  async deleteCourse(courseId) {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);

    if (error) throw error;
    return true;
  },

  // Invoke Supabase Edge Function to generate course incrementally
  async generateCourseStep(payload) {
    const { data, error } = await supabase.functions.invoke('generate-course', {
      body: payload,
    });

    if (error) {
      console.warn('supabase.functions.invoke error, trying direct fetch:', error);
      const { data: { session } } = await supabase.auth.getSession();
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hbtqxiyjemfjmabstquk.supabase.co';
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_quXZy0Nl4tzukD46PTCAxg_0rJCeBT-';

      const response = await fetch(`${supabaseUrl}/functions/v1/generate-course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': anonKey,
          'Authorization': `Bearer ${session?.access_token || ''}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || result.details || 'Course generation failed');
      }
      return result;
    }

    return data;
  },
};
