import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Paperclip, CheckCheck, MoreVertical, Search, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../lib/i18n';

const SalesChat = () => {
  const { t } = useLanguage();
  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.id);
    }
  }, [activeChat]);

  const fetchChats = async () => {
    try {
      // Get admin user for sending messages
      const { data: admin } = await supabase.from('User').select('id, fullName').eq('role', 'admin').limit(1).single();
      setAdminUser(admin);

      // Fetch conversations
      const { data: convs } = await supabase
        .from('support_conversations')
        .select(`
          id,
          status,
          updatedAt,
          user:User!userId ( id, fullName, avatar )
        `)
        .order('updatedAt', { ascending: false });

      if (convs && convs.length > 0) {
        setChats(convs);
        setActiveChat(convs[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data: msgs } = await supabase
        .from('support_messages')
        .select('*')
        .eq('conversationId', conversationId)
        .order('createdAt', { ascending: true });
      
      setMessages(msgs || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !activeChat || !adminUser) return;
    
    const newMsg = {
      conversationId: activeChat.id,
      senderId: adminUser.id,
      text: chatInput,
      isRead: true
    };

    try {
      const { data, error } = await supabase.from('support_messages').insert(newMsg).select().single();
      if (!error && data) {
        setMessages([...messages, data]);
        setChatInput('');
        
        // Update conversation updatedAt
        await supabase.from('support_conversations').update({ updatedAt: new Date().toISOString() }).eq('id', activeChat.id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--color-text-base)' }}>Sales Chat</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Chat directly with customers for sales and consulting.</p>
      </div>

      <div className="pro-panel" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar List */}
        <div style={{ width: '320px', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg-elevated)' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={18} /> Customer List
              </h3>
              <MoreVertical size={18} style={{ color: 'var(--color-text-muted)', cursor: 'pointer' }} />
            </div>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search customers..." 
                style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2.25rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-base)', border: '1px solid var(--color-border)', color: 'var(--color-text-base)', fontSize: '0.875rem', outline: 'none' }} 
              />
            </div>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {chats.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No active chats.</div>
            ) : chats.map(chat => (
              <div 
                key={chat.id} 
                onClick={() => setActiveChat(chat)}
                style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '0.75rem', cursor: 'pointer', backgroundColor: activeChat?.id === chat.id ? 'rgba(255,255,255,0.03)' : 'transparent', transition: 'background-color 0.2s' }}
                className="hover:bg-[rgba(255,255,255,0.05)]"
              >
                <div style={{ position: 'relative' }}>
                  <img src={chat.user?.avatar || 'https://i.pravatar.cc/150'} alt={chat.user?.fullName} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem', color: activeChat?.id === chat.id ? 'var(--color-info)' : 'var(--color-text-base)' }}>{chat.user?.fullName || 'Customer'}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {new Date(chat.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Status: {chat.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Chat Window */}
        {activeChat ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg-base)' }}>
            {/* Chat Header */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={activeChat.user?.avatar || 'https://i.pravatar.cc/150'} alt={activeChat.user?.fullName} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>{activeChat.user?.fullName || 'Customer'}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    ● Online
                  </p>
                </div>
              </div>
              <div>
                <button style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-base)', fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' }} className="hover:bg-[rgba(255,255,255,0.05)]">
                  View Profile
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '2rem' }}>No messages yet.</div>
              ) : (
                <>
                  <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                    <span style={{ fontSize: '0.75rem', padding: '4px 12px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--color-text-muted)' }}>Start of conversation</span>
                  </div>
                  {messages.map(msg => {
                    const isOwn = adminUser && msg.senderId === adminUser.id;
                    return (
                      <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isOwn ? 'flex-end' : 'flex-start' }}>
                        <div style={{ 
                          maxWidth: '70%', 
                          padding: '0.75rem 1rem', 
                          borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          backgroundColor: isOwn ? 'var(--color-info)' : 'var(--color-bg-elevated)',
                          color: isOwn ? '#fff' : 'var(--color-text-base)',
                          border: isOwn ? 'none' : '1px solid var(--color-border)',
                          fontSize: '0.9rem',
                          lineHeight: '1.4'
                        }}>
                          {msg.text}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          {isOwn && <CheckCheck size={14} style={{ color: 'var(--color-info)' }} />}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Chat Input */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }} className="hover:text-white transition-colors">
                <Paperclip size={20} />
              </button>
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message to customer..." 
                style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-bg-base)', border: '1px solid var(--color-border)', color: 'var(--color-text-base)', fontSize: '0.9rem', outline: 'none' }} 
                onKeyDown={(e) => { if(e.key === 'Enter') handleSendMessage() }}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
                style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: chatInput.trim() ? 'var(--color-info)' : 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: chatInput.trim() ? 'pointer' : 'default', transition: 'all 0.2s' }}
              >
                <Send size={18} style={{ transform: 'translateX(-1px) translateY(1px)' }} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-base)', color: 'var(--color-text-muted)' }}>
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesChat;
