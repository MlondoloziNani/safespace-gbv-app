import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function ChatView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, messages, sendMessage, cases } = useAppContext();
  
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const caseData = cases.find(c => c.id === id);
  const caseMessages = messages[id] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [caseMessages]);

  if (!caseData || caseData.status !== 'accepted') {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <p>Chat not available. Case may not exist or hasn't been accepted yet.</p>
        <button className="btn btn-primary" onClick={() => navigate('/messages')} style={{ marginTop: '1rem' }}>
          Back to Messages
        </button>
      </div>
    );
  }

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(id, inputText.trim());
    setInputText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '100vh', width: '100%', maxWidth: '800px', margin: '0 auto', background: 'rgba(255,255,255,0.4)', position: 'relative' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--glass-border)', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => navigate('/messages')} className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.125rem', margin: 0 }}>Case: {caseData.type}</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
            {currentUser.role === 'counselor' ? 'Chatting with User' : 'Chatting with Counselor'}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', paddingBottom: '8rem' }}>
        {caseMessages.map((msg) => {
          const isSystem = msg.senderId === 'system';
          const isSentByMe = msg.senderId === currentUser.id;

          if (isSystem) {
            return (
              <div key={msg.id} style={{ textAlign: 'center', margin: '1rem 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                {msg.text}
              </div>
            );
          }

          return (
            <div key={msg.id} className={`chat-bubble ${isSentByMe ? 'sent' : 'received'}`}>
              <p style={{ margin: 0 }}>{msg.text}</p>
              <span style={{ fontSize: '0.7rem', opacity: 0.7, display: 'block', textAlign: 'right', marginTop: '0.25rem' }}>
                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ position: 'fixed', bottom: '60px', left: 0, right: 0, padding: '1rem', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderTop: '1px solid var(--glass-border)', zIndex: 10 }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', maxWidth: '800px', margin: '0 auto' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ flex: 1, margin: 0 }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>
            <Send size={20} />
          </button>
        </form>
      </div>
      
      {/* Spacer to prevent overlap with global bottom nav on mobile */}
      <div style={{ height: '70px', display: 'none' }} className="mobile-only-spacer"></div>
    </div>
  );
}
