import { supabase } from '../lib/supabase';

export const progressService = {
  // Fetch real aggregated metrics for dashboard
  async getDashboardStats() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        totalCourses: 0,
        totalModules: 0,
        totalLessons: 0,
        completedCourses: 0,
        recentCourses: [],
      };
    }

    // Fetch user courses
    const { data: courses, error: cErr } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (cErr) throw cErr;

    const totalCourses = courses?.length || 0;
    const completedCourses = (courses || []).filter((c) => c.status === 'completed' && c.progress === 100).length;

    // Fetch total modules
    const { count: totalModules } = await supabase
      .from('modules')
      .select('*', { count: 'exact', head: true });

    // Fetch total lessons
    const { count: totalLessons } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true });

    // Recent 3 courses
    const recentCourses = (courses || []).slice(0, 3);

    return {
      totalCourses,
      totalModules: totalModules || 0,
      totalLessons: totalLessons || 0,
      completedCourses,
      recentCourses,
    };
  },
};
