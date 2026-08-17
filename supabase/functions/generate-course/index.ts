// @ts-nocheck
// deno-lint-ignore-file no-explicit-any
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';
import { corsHeaders } from '../_shared/cors.ts';
import { callGeminiWithFailover } from '../_shared/gemini.ts';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders });
  }

  let requestBody: any = null;

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized request' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = (typeof Deno !== 'undefined' ? Deno.env.get('SUPABASE_URL') : null) || '';
    const supabaseServiceKey = (typeof Deno !== 'undefined' ? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') : null) || '';
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'User authentication failed' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    requestBody = await req.json();
    const { action, topic, difficulty = 'Beginner', language = 'English', modulesCount = 3, lessonsPerModuleCount = 3, courseId, moduleNumber } = requestBody || {};

    const totalLessonsExpected = modulesCount * lessonsPerModuleCount;
    const totalQuizzesExpected = totalLessonsExpected; // 1 Quiz per Lesson

    // STEP 1: INITIALIZE COURSE & GENERATE OUTLINE
    if (action === 'init' || !courseId) {
      console.log(`[Generate Course Init] User ${user.id}, Topic: "${topic}"`);

      let targetCourseId = courseId;
      if (!targetCourseId) {
        const { data: newCourse, error: createError } = await supabase
          .from('courses')
          .insert({
            user_id: user.id,
            title: topic,
            topic,
            difficulty,
            language,
            status: 'generating',
            generation_status: 'generating',
            total_modules: modulesCount,
            total_lessons: totalLessonsExpected,
            total_quizzes: totalQuizzesExpected,
          })
          .select()
          .single();

        if (createError) throw new Error(`Database error creating course: ${createError.message}`);
        targetCourseId = newCourse.id;
      }

      const prompt = `Generate a comprehensive learning course outline on the topic: "${topic}".
Difficulty: ${difficulty}.
Language: ${language}.
Number of modules required: ${modulesCount}.

Return a JSON object with this exact structure:
{
  "title": "Clear Engaging Course Title",
  "description": "Engaging 2-3 sentence overview of the course",
  "category": "Technology/Business/Design/etc",
  "modules": [
    {
      "module_number": 1,
      "title": "Module 1 Title",
      "description": "Module 1 summary"
    }
  ]
}`;

      const outline = await callGeminiWithFailover({
        prompt,
        systemInstruction: 'You are an expert curriculum designer creating structured, high quality online courses.',
      });

      await supabase
        .from('courses')
        .update({
          title: outline.title || topic,
          description: outline.description || `Comprehensive course on ${topic}`,
          generation_status: 'generating',
          total_modules: modulesCount,
          total_lessons: totalLessonsExpected,
          total_quizzes: totalQuizzesExpected,
        })
        .eq('id', targetCourseId);

      const savedModules = [];
      for (let i = 0; i < (outline.modules || []).length; i++) {
        const m = outline.modules[i];
        const { data: modData, error: modErr } = await supabase
          .from('modules')
          .insert({
            course_id: targetCourseId,
            module_number: m.module_number || i + 1,
            title: m.title || `Module ${i + 1}`,
            description: m.description || '',
          })
          .select()
          .single();

        if (modErr) console.warn('Module insert warning:', modErr.message);
        else savedModules.push(modData);
      }

      return new Response(
        JSON.stringify({
          success: true,
          courseId: targetCourseId,
          title: outline.title || topic,
          description: outline.description,
          modules: savedModules,
          totalModules: savedModules.length,
          step: 'init_complete',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // STEP 2: GENERATE MODULE LESSONS & 1 DEDICATED 10-QUESTION QUIZ PER LESSON
    if (action === 'generate_module') {
      console.log(`[Generate Module ${moduleNumber}] Course ${courseId}`);

      const { data: moduleData, error: modErr } = await supabase
        .from('modules')
        .select('*')
        .eq('course_id', courseId)
        .eq('module_number', moduleNumber)
        .single();

      if (modErr || !moduleData) {
        throw new Error(`Module ${moduleNumber} not found for course ${courseId}`);
      }

      const { data: existingLessons } = await supabase
        .from('lessons')
        .select('id')
        .eq('module_id', moduleData.id);

      if (existingLessons && existingLessons.length >= lessonsPerModuleCount) {
        return new Response(
          JSON.stringify({
            success: true,
            message: `Module ${moduleNumber} already generated`,
            moduleId: moduleData.id,
            step: 'module_complete',
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: courseInfo } = await supabase
        .from('courses')
        .select('title, topic, difficulty, language')
        .eq('id', courseId)
        .single();

      const prompt = `Generate detailed educational lessons and 1 dedicated quiz containing EXACTLY 10 multiple-choice questions for EACH lesson in Module ${moduleNumber}: "${moduleData.title}".
Course Topic: "${courseInfo?.topic || 'General Topic'}".
Module Description: "${moduleData.description}".
Difficulty Level: "${courseInfo?.difficulty || 'Beginner'}".
Language: "${courseInfo?.language || 'English'}".
Required number of lessons: ${lessonsPerModuleCount}.

IMPORTANT RULES:
1. Generate EXACTLY ${lessonsPerModuleCount} lessons.
2. For EVERY lesson, include a dedicated "quiz" object with EXACTLY 10 multiple-choice questions (question_number 1 to 10).

Return a JSON object with this exact structure:
{
  "lessons": [
    {
      "lesson_number": 1,
      "title": "Lesson Title",
      "description": "Short 1-2 sentence overview",
      "content": "Detailed educational content with headings, paragraphs, step-by-step explanations, code examples, callouts, and clear formatting.",
      "estimated_minutes": 15,
      "lesson_type": "concept",
      "practice_task": "Clear hands-on task for the learner",
      "key_takeaway": "Main concept takeaway summary",
      "codeLanguage": "javascript",
      "codeExample": "// Code example",
      "youtubeSearchQuery": "YouTube search query",
      "quiz": {
        "title": "Quiz: Lesson Title",
        "description": "Knowledge assessment for Lesson Title",
        "passing_score": 60,
        "questions": [
          {
            "question_number": 1,
            "question": "Question text here?",
            "options": {
              "A": "Option A text",
              "B": "Option B text",
              "C": "Option C text",
              "D": "Option D text"
            },
            "correct_answer": "A",
            "explanation": "Detailed explanation why option A is correct."
          }
        ]
      }
    }
  ]
}`;

      const moduleAIOutput = await callGeminiWithFailover({
        prompt,
        systemInstruction: 'You are an educational AI content author. Generate clean, highly educational, markdown-structured lessons and exactly 10-question multiple-choice quizzes for every lesson.',
      });

      const lessonsList = moduleAIOutput.lessons || [];
      for (let i = 0; i < lessonsList.length; i++) {
        const l = lessonsList[i];
        let fullContent = l.content || '';
        if (l.codeExample) {
          fullContent += `\n\n\`\`\`${l.codeLanguage || ''}\n${l.codeExample}\n\`\`\``;
        }

        const { data: insertedLesson } = await supabase.from('lessons').insert({
          course_id: courseId,
          module_id: moduleData.id,
          lesson_number: l.lesson_number || i + 1,
          title: l.title || `Lesson ${i + 1}`,
          description: l.description || '',
          content: fullContent,
          estimated_minutes: l.estimated_minutes || 15,
          difficulty: courseInfo?.difficulty || 'Beginner',
          lesson_type: l.lesson_type || 'concept',
          practice_task: l.practice_task || null,
          key_takeaway: l.key_takeaway || null,
          video_url: l.youtubeSearchQuery ? `https://www.youtube.com/results?search_query=${encodeURIComponent(l.youtubeSearchQuery)}` : null,
        }).select().maybeSingle();

        // 1 Quiz Per Lesson with 10 questions
        const quizAI = l.quiz || (i === 0 ? moduleAIOutput.quiz : null);
        if (quizAI && quizAI.questions && quizAI.questions.length > 0) {
          const { data: quizData, error: quizErr } = await supabase
            .from('quizzes')
            .insert({
              course_id: courseId,
              module_id: moduleData.id,
              title: quizAI.title || `${l.title || 'Lesson ' + (i + 1)} Quiz`,
              description: quizAI.description || `Module ${moduleNumber} Knowledge Check for ${l.title}`,
              passing_score: quizAI.passing_score || 60,
            })
            .select()
            .maybeSingle();

          if (!quizErr && quizData) {
            const qList = quizAI.questions || [];
            for (let qIdx = 0; qIdx < qList.length; qIdx++) {
              const q = qList[qIdx];
              await supabase.from('quiz_questions').insert({
                quiz_id: quizData.id,
                question_number: q.question_number || qIdx + 1,
                question: q.question,
                options: q.options || {},
                correct_answer: q.correct_answer || 'A',
                explanation: q.explanation || '',
              });
            }
          }
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          moduleId: moduleData.id,
          moduleNumber,
          lessonsGenerated: lessonsList.length,
          quizzesGenerated: lessonsList.length,
          step: 'module_complete',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // STEP 3: FINALIZE COURSE
    if (action === 'finalize') {
      console.log(`[Finalize Course] Course ${courseId}`);

      const { count: modCount } = await supabase
        .from('modules')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', courseId);

      const { count: lesCount } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', courseId);

      const { count: qzCount } = await supabase
        .from('quizzes')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', courseId);

      await supabase
        .from('courses')
        .update({
          status: 'completed',
          generation_status: 'completed',
          total_modules: modCount || 0,
          total_lessons: lesCount || 0,
          total_quizzes: qzCount || 0,
          generation_error: null,
        })
        .eq('id', courseId);

      return new Response(
        JSON.stringify({
          success: true,
          courseId,
          status: 'completed',
          step: 'finalized',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error(`Invalid action: ${action}`);
  } catch (err: any) {
    const errorMsg = err?.message || String(err);
    console.error('[Generate Course Error]:', errorMsg);

    if (requestBody?.courseId) {
      try {
        const supabaseUrl = (typeof Deno !== 'undefined' ? Deno.env.get('SUPABASE_URL') : null) || '';
        const supabaseServiceKey = (typeof Deno !== 'undefined' ? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') : null) || '';
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        await supabase
          .from('courses')
          .update({
            generation_status: 'paused',
            generation_error: errorMsg,
          })
          .eq('id', requestBody.courseId);
      } catch (_) {}
    }

    return new Response(
      JSON.stringify({
        error: 'Generation step paused due to temporary network issues. You can resume generation anytime.',
        details: errorMsg,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
