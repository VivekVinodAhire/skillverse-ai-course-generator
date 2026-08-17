import React, { useEffect, useState, useRef } from 'react';
import {
  MessageSquare,
  Plus,
  Send,
  Trash2,
  Sparkles,
  Bot,
  User,
  Loader2,
  ArrowDown,
  History,
  X,
} from 'lucide-react';
import { tutorService } from '../services/tutorService';

const AITutor = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);
  const [showMobileHistory, setShowMobileHistory] = useState(false);

  const chatContainerRef = useRef(null);

  const promptSuggestions = [
    'Explain C# classes in simple words.',
    'Explain how async/await works in JavaScript.',
    'Give me Java OOPs interview tips.',
    'Explain Polymorphism with a real-world example.',
    'Quiz me on Python Data Structures.',
  ];

  const scrollToBottom = (smooth = true) => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
      setShowScrollBottomBtn(isScrolledUp);
    }
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const convs = await tutorService.getConversations();
      setConversations(convs);
      if (convs.length > 0 && !activeConversationId) {
        setActiveConversationId(convs[0].id);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId) => {
    if (!convId) return;
    try {
      const msgs = await tutorService.getMessages(convId);
      setMessages(msgs);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
    } else {
      setMessages([]);
    }
  }, [activeConversationId]);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, sending]);

  const handleStartNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
    setInputMessage('');
    setShowMobileHistory(false);
  };

  const handleDeleteConversation = async (e, convId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat conversation?')) {
      try {
        await tutorService.deleteConversation(convId);
        setConversations((prev) => prev.filter((c) => c.id !== convId));
        if (activeConversationId === convId) {
          handleStartNewChat();
        }
      } catch (err) {
        alert(`Failed to delete conversation: ${err.message}`);
      }
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || sending) return;

    const userMessageText = text.trim();
    setInputMessage('');
    setSending(true);

    const tempUserMsg = { id: `temp_${Date.now()}`, role: 'user', content: userMessageText };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const response = await tutorService.sendMessage(activeConversationId, userMessageText);

      if (response.conversationId) {
        setActiveConversationId(response.conversationId);
        await fetchConversations();
        await fetchMessages(response.conversationId);
      }
    } catch (err) {
      console.error('AI Tutor message error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: 'The AI Tutor is temporarily busy. Please try again in a moment.',
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 className="heading-1" style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.6rem)', display: 'flex', alignItems: 'center', gap: '0.625rem', margin: 0 }}>
            <Sparkles size={24} color="var(--primary)" />
            <span>AI Tutor Assistant</span>
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Ask questions, get concept breakdowns, code examples, or practice quizzes 24/7
          </p>
        </div>

        {/* Mobile Toggle Chat History Button */}
        <button
          onClick={() => setShowMobileHistory(!showMobileHistory)}
          className="sv-mobile-history-btn"
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.375rem',
            background: 'rgba(99, 102, 241, 0.1)',
            color: 'var(--primary)',
            padding: '0.5rem 0.875rem',
            borderRadius: '10px',
            fontSize: '0.8125rem',
            fontWeight: 700,
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}
        >
          <History size={16} />
          <span>{showMobileHistory ? 'Close History' : 'Chat History'}</span>
        </button>
      </div>

      {/* Main Split-Screen Container */}
      <div
        className="sv-tutor-container"
        style={{
          borderRadius: '18px',
          border: '1px solid var(--border)',
          background: '#FFFFFF',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Left Sidebar: Conversations History */}
        <div
          className={`sv-tutor-sidebar ${showMobileHistory ? 'mobile-visible' : ''}`}
          style={{ background: '#FFFFFF', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '1rem', height: '100%', overflow: 'hidden' }}
        >
          <button
            onClick={handleStartNewChat}
            className="sv-btn sv-btn-primary"
            style={{ width: '100%', marginBottom: '1rem', padding: '0.625rem' }}
          >
            <Plus size={18} />
            <span>New Chat</span>
          </button>

          <div style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', padding: '0 0.5rem' }}>
            Past Conversations
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {conversations.length === 0 ? (
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
                No past chats yet.
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = conv.id === activeConversationId;
                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setActiveConversationId(conv.id);
                      setShowMobileHistory(false);
                    }}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.625rem 0.75rem',
                      borderRadius: '10px',
                      fontSize: '0.8125rem',
                      background: isActive ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                      color: isActive ? 'var(--primary)' : 'var(--text-main)',
                      fontWeight: isActive ? 700 : 500,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                      <MessageSquare size={14} color={isActive ? 'var(--primary)' : '#6B7280'} />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.title}</span>
                    </div>

                    <button
                      onClick={(e) => handleDeleteConversation(e, conv.id)}
                      title="Delete Chat"
                      style={{ color: 'var(--text-light)', padding: '0.125rem', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Main Chat View */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0, position: 'relative', background: '#F8FAFC' }}>
          {/* Chat Messages Log with FIXED/Fluid height and overflowY scroll */}
          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="sv-tutor-messages-box"
            style={{
              overflowY: 'scroll',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              flex: 1,
            }}
          >
            {messages.length === 0 && !sending ? (
              <div style={{ margin: 'auto', textAlign: 'center', maxWidth: '500px', padding: '0.5rem' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.875rem auto' }}>
                  <Bot size={26} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.375rem' }}>How can I help your learning today?</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Select a suggested prompt or type your question below.</p>

                {/* Prompt Suggestions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {promptSuggestions.map((promptText, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(promptText)}
                      style={{
                        padding: '0.625rem 0.875rem',
                        borderRadius: '12px',
                        background: '#ffffff',
                        border: '1px solid var(--border)',
                        fontSize: '0.8125rem',
                        color: 'var(--primary)',
                        textAlign: 'left',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                      }}
                    >
                      💡 "{promptText}"
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      gap: '0.625rem',
                      justifyContent: isUser ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {!isUser && (
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Bot size={16} />
                      </div>
                    )}

                    <div
                      style={{
                        maxWidth: '85%',
                        padding: '0.75rem 1rem',
                        borderRadius: '16px',
                        fontSize: '0.875rem',
                        lineHeight: 1.55,
                        whiteSpace: 'pre-line',
                        background: isUser ? '#2563EB' : '#ffffff',
                        color: isUser ? '#ffffff' : 'var(--text-main)',
                        border: isUser ? 'none' : '1px solid var(--border)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                        wordBreak: 'break-word',
                      }}
                    >
                      {msg.content}
                    </div>

                    {isUser && (
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#475569', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <User size={16} />
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {sending && (
              <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={16} />
                </div>
                <div style={{ background: '#ffffff', padding: '0.625rem 0.875rem', borderRadius: '14px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  <Loader2 size={16} className="animate-spin" color="var(--primary)" />
                  <span>AI Tutor is formulating response...</span>
                </div>
              </div>
            )}
          </div>

          {/* Floating Scroll-to-Bottom Button */}
          {showScrollBottomBtn && (
            <button
              onClick={() => scrollToBottom(true)}
              style={{
                position: 'absolute',
                bottom: '80px',
                right: '20px',
                background: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                zIndex: 20,
              }}
              title="Scroll to latest response"
            >
              <ArrowDown size={16} />
            </button>
          )}

          {/* Bottom Chat Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{ padding: '0.875rem 1rem', background: '#ffffff', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}
          >
            <input
              type="text"
              placeholder="Ask AI Tutor anything about your lessons..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="sv-input"
              style={{ flex: 1, padding: '0.625rem 0.875rem', fontSize: '0.875rem' }}
            />
            <button type="submit" disabled={sending || !inputMessage.trim()} className="sv-btn sv-btn-primary" style={{ padding: '0.625rem 1rem' }}>
              <Send size={16} />
              <span className="sv-desktop-only">Send</span>
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .sv-tutor-container {
          height: 620px;
          display: grid;
          grid-template-columns: 260px 1fr;
        }
        @media (max-width: 768px) {
          .sv-tutor-container {
            height: calc(100vh - 200px);
            min-height: 480px;
            grid-template-columns: 1fr;
            position: relative;
          }
          .sv-tutor-sidebar {
            display: none !important;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 30;
          }
          .sv-tutor-sidebar.mobile-visible {
            display: flex !important;
          }
          .sv-mobile-history-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AITutor;
