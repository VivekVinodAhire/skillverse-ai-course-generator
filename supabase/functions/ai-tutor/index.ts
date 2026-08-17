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

    const body = await req.json();
    const { conversationId, message, context } = body;

    if (!message || message.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Message cannot be empty' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let activeConversationId = conversationId;

    if (activeConversationId) {
      const { data: existingConv } = await supabase
        .from('ai_conversations')
        .select('id')
        .eq('id', activeConversationId)
        .maybeSingle();

      if (!existingConv) {
        activeConversationId = null;
      }
    }

    if (!activeConversationId) {
      const title = message.length > 30 ? message.substring(0, 30) + '...' : message;
      const { data: conv, error: convErr } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: user.id,
          title,
        })
        .select()
        .maybeSingle();

      if (convErr || !conv) throw new Error(`Failed to create conversation: ${convErr?.message || 'Database error'}`);
      activeConversationId = conv.id;
    }

    await supabase.from('ai_messages').insert({
      conversation_id: activeConversationId,
      user_id: user.id,
      role: 'user',
      content: message,
    });

    const { data: pastMessages } = await supabase
      .from('ai_messages')
      .select('role, content')
      .eq('conversation_id', activeConversationId)
      .order('created_at', { ascending: true })
      .limit(10);

    let systemContext = `You are SkillVerse AI Tutor, an empathetic, encouraging, and highly knowledgeable educational assistant.
Help the learner understand concepts deeply with simple analogies, clear step-by-step explanations, code examples, and interactive follow-up questions.`;

    if (context) {
      systemContext += `\n\nCURRENT LEARNING CONTEXT:`;
      if (context.courseTitle) systemContext += `\nCourse: ${context.courseTitle}`;
      if (context.moduleTitle) systemContext += `\nModule: ${context.moduleTitle}`;
      if (context.lessonTitle) systemContext += `\nLesson: ${context.lessonTitle}`;
      if (context.lessonContent) systemContext += `\nLesson Excerpt: ${context.lessonContent.substring(0, 500)}...`;
    }

    const conversationText = (pastMessages || [])
      .map((m: any) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n');

    const prompt = `System Context:\n${systemContext}\n\nConversation History:\n${conversationText}\n\nReturn a JSON object with your response in this exact structure:\n{\n  "reply": "Your clear, formatted, educational answer here."\n}`;

    const aiResult = await callGeminiWithFailover({
      prompt,
      systemInstruction: 'You are SkillVerse AI Tutor. Always answer in JSON format with a "reply" field containing clear markdown text.',
    });

    const replyText = aiResult?.reply || aiResult?.text || 'I am here to help you learn! Could you rephrase your question?';

    await supabase.from('ai_messages').insert({
      conversation_id: activeConversationId,
      user_id: user.id,
      role: 'assistant',
      content: replyText,
    });

    await supabase
      .from('ai_conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', activeConversationId);

    return new Response(
      JSON.stringify({
        success: true,
        conversationId: activeConversationId,
        reply: replyText,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('[AI Tutor Error]:', err?.message || String(err));
    return new Response(
      JSON.stringify({
        error: 'The AI Tutor is temporarily busy. Please try again in a moment.',
        details: err?.message || String(err),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
