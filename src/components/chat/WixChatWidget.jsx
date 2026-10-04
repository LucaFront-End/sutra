import React, { useState, useEffect, useRef } from 'react';
import { useWixClient } from '../../context/WixContext';
import './WixChatWidget.css';

export const WixChatWidget = ({ isOpen, onClose }) => {
  const { wixClient, isReady } = useWixClient();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [conversationId, setConversationId] = useState(() => {
    try {
      return localStorage.getItem('sutra_chat_convo_id') || '';
    } catch {
      return '';
    }
  });
  const [status, setStatus] = useState(() => (conversationId ? 'online' : 'setup'));
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initError, setInitError] = useState('');

  // Form for visitor registration
  const [initForm, setInitForm] = useState({ name: '', email: '', phone: '' });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      const timer = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(timer);
    }
  }, [messages, isOpen, isTyping]);

  // Poll for new messages every 5 seconds when online and open
  useEffect(() => {
    if (status !== 'online' || !isOpen || !conversationId) return;
    const interval = setInterval(() => {
      fetchMessages(conversationId);
    }, 5000);
    return () => clearInterval(interval);
  }, [status, isOpen, conversationId]);

  // Initial check for member session
  useEffect(() => {
    if (!isReady || !wixClient || status !== 'setup') return;

    let active = true;
    const checkMember = async () => {
      try {
        if (wixClient.members) {
          const { member } = await wixClient.members.getCurrentMember();
          if (active && member) {
            const email = member.loginEmail || member.profile?.emails?.[0]?.address;
            const name = member.profile?.nickname || `${member.profile?.firstName || ''} ${member.profile?.lastName || ''}`.trim();
            if (email) {
              startConversation(name || 'Miembro Sutra', email, '');
            }
          }
        }
      } catch {
        // Visitor mode
      }
    };

    checkMember();
    return () => { active = false; };
  }, [isReady, wixClient, status]);

  // Start chat session
  const startConversation = async (name, email, phone) => {
    setLoading(true);
    setInitError('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'init', name, email, phone }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.conversationId) {
        setConversationId(data.conversationId);
        try {
          localStorage.setItem('sutra_chat_convo_id', data.conversationId);
          localStorage.setItem('sutra_chat_contact_id', data.contactId || '');
        } catch {}
        setStatus('online');
        fetchMessages(data.conversationId);
        setLoading(false);
        return;
      } else {
        const errorMsg = data.error || data.details || 'No se pudo conectar con la bandeja de Wix.';
        setInitError(errorMsg);
      }
    } catch (err) {
      setInitError(err.message || 'Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convoId) => {
    if (!convoId) return;
    try {
      const res = await fetch(`/api/chat?action=list&conversationId=${convoId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.messages && Array.isArray(data.messages)) {
          const sorted = [...data.messages].sort((a, b) => {
            const dateA = new Date(a.createdDate || a.createdAt || 0);
            const dateB = new Date(b.createdDate || b.createdAt || 0);
            return dateA - dateB;
          });
          setMessages(sorted);
        }
      }
    } catch {
      // Silent catch
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim() || isSending || !conversationId) return;
    setIsSending(true);

    const newMsg = {
      id: `msg-${Date.now()}`,
      direction: 'PARTICIPANT_TO_BUSINESS',
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', conversationId, text }),
      });

      if (res.ok) {
        await fetchMessages(conversationId);
      } else {
        const data = await res.json().catch(() => ({}));
        console.warn('[WixChat] Send failed:', data.error || res.statusText);
      }
    } catch (err) {
      console.warn('[WixChat] Network error sending message:', err.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (initForm.email.trim()) {
      startConversation(initForm.name, initForm.email, initForm.phone);
    }
  };

  const handleSendSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      const msg = inputText.trim();
      setInputText('');
      sendMessage(msg);
    }
  };

  const quickPrompts = [
    { text: '¿Cómo preparar una vela con cera de arena? ✨', query: '¿Cómo preparo una vela con cera de arena y fragancia?' },
    { text: 'Cotización para eventos y banquetes 🕯️', query: 'Hola, me interesa conocer los paquetes mayoristas para eventos y empresas.' },
    { text: 'Recomendación de aroma para el hogar 🌿', query: 'Hola, ¿qué fragancia de ritual me recomiendan para crear un ambiente de calma?' },
    { text: 'Hablar con un asesor Sutra 💬', query: 'Hola, quisiera asistencia personalizada con un asesor.' },
  ];

  if (!isOpen) return null;

  return (
    <div className="sutra-chat-window">
      {/* Header */}
      <div className="sutra-chat-header">
        <div className="sutra-chat-header-info">
          <div className="sutra-chat-avatar">
            S
            <span className="sutra-chat-online-badge" />
          </div>
          <div className="sutra-chat-info-text">
            <h3>SUTRA Atención</h3>
            <div className="sutra-chat-status">Asesor Sutra • En Línea</div>
          </div>
        </div>
        <button className="sutra-chat-close-btn" onClick={onClose} aria-label="Cerrar chat">
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="sutra-chat-body">
        {status === 'setup' ? (
          <div className="sutra-chat-setup-container">
            <div className="sutra-chat-setup-header">
              <h4>Inicia tu Consulta</h4>
              <p>Conéctate directamente con nuestro equipo de bienestar y rituales.</p>
            </div>

            {initError && (
              <div className="sutra-chat-error-alert">
                <span className="sutra-chat-error-icon">⚠️</span>
                <div className="sutra-chat-error-info">
                  <strong>Aviso de conexión</strong>
                  <p>{initError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="sutra-chat-form">
              <div className="sutra-form-group">
                <input
                  type="text"
                  className="sutra-form-input"
                  placeholder="Tu nombre completo"
                  value={initForm.name}
                  onChange={(e) => setInitForm({ ...initForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="sutra-form-group">
                <input
                  type="email"
                  className="sutra-form-input"
                  placeholder="Correo electrónico *"
                  value={initForm.email}
                  onChange={(e) => setInitForm({ ...initForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="sutra-form-group">
                <input
                  type="tel"
                  className="sutra-form-input"
                  placeholder="Teléfono / WhatsApp (opcional)"
                  value={initForm.phone}
                  onChange={(e) => setInitForm({ ...initForm, phone: e.target.value })}
                />
              </div>
              <button type="submit" className="sutra-chat-btn-submit" disabled={loading}>
                {loading ? 'Conectando con Wix...' : 'Iniciar Conversación'}
              </button>
            </form>

            <div className="sutra-chat-divider">
              <span>o contáctanos directo</span>
            </div>

            <a
              href="https://wa.me/5215500000000?text=Hola%20Sutra,%20quisiera%20atenci%C3%B3n%20personalizada%20con%20un%20asesor"
              target="_blank"
              rel="noopener noreferrer"
              className="sutra-chat-wa-direct-link"
            >
              <span>💬 Escribir por WhatsApp</span>
            </a>
          </div>
        ) : (
          <div className="sutra-chat-messages">
            {messages.map((msg) => {
              const isVisitor = msg.direction === 'PARTICIPANT_TO_BUSINESS';
              const text = msg.content?.basic?.items?.[0]?.text || msg.text || '';
              return (
                <div
                  key={msg.id}
                  className={`sutra-message-bubble-wrap ${isVisitor ? 'visitor' : 'business'}`}
                >
                  <div className="sutra-message-bubble">
                    <p>{text}</p>
                  </div>
                  <span className="sutra-message-time">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}

            {isTyping && (
              <div className="sutra-typing-indicator">
                <span className="sutra-dot" />
                <span className="sutra-dot" />
                <span className="sutra-dot" />
              </div>
            )}

            {messages.length <= 1 && (
              <div className="sutra-quick-prompts">
                {quickPrompts.map((p, i) => (
                  <button
                    key={i}
                    className="sutra-quick-prompt-btn"
                    onClick={() => sendMessage(p.query)}
                  >
                    {p.text}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Footer Input */}
      {status === 'online' && (
        <form onSubmit={handleSendSubmit} className="sutra-chat-footer">
          <input
            ref={inputRef}
            type="text"
            placeholder="Escribe tu mensaje..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isSending}
          />
          <button
            type="submit"
            className="sutra-chat-send-btn"
            disabled={!inputText.trim() || isSending}
            aria-label="Enviar mensaje"
          >
            ➤
          </button>
        </form>
      )}
    </div>
  );
};
