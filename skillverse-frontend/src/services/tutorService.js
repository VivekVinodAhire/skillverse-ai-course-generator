import { supabase } from '../lib/supabase';

export const tutorService = {
  // Fetch user conversations
  async getConversations() {
    const { data, error } = await supabase
      .from('ai_conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Fetch messages for conversation
  async getMessages(conversationId) {
    const { data, error } = await supabase
      .from('ai_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Delete conversation
  async deleteConversation(conversationId) {
    const { error } = await supabase
      .from('ai_conversations')
      .delete()
      .eq('id', conversationId);

    if (error) throw error;
    return true;
  },

  // Send message to AI Tutor Edge Function with 2-key failover
  async sendMessage(conversationId, messageText, learningContext = null) {
    const payload = {
      conversationId,
      message: messageText,
      context: learningContext,
    };

    const { data, error } = await supabase.functions.invoke('ai-tutor', {
      body: payload,
    });

    if (error) {
      console.warn('supabase.functions.invoke error, trying direct fetch:', error);
      const { data: { session } } = await supabase.auth.getSession();
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hbtqxiyjemfjmabstquk.supabase.co';
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_quXZy0Nl4tzukD46PTCAxg_0rJCeBT-';

      const response = await fetch(`${supabaseUrl}/functions/v1/ai-tutor`, {
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
        throw new Error(result.error || result.details || 'AI Tutor failed to respond');
      }
      return result;
    }

    return data;
  },
};
