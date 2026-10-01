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
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'init', name, email, phone }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.conversationId) {
          setConversationId(data.conversationId);
          try {
            localStorage.setItem('sutra_chat_convo_id', data.conversationId);
          } catch {}
          setStatus('online');
          fetchMessages(data.conversationId);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Local fallback
    }

    const dummyConvo = `sutra-convo-${Date.now()}`;
    setConversationId(dummyConvo);
    try {
      localStorage.setItem('sutra_chat_convo_id', dummyConvo);
    } catch {}
    setStatus('online');
    setLoading(false);
    setMessages([
      {
        id: 'welcome-msg',
        direction: 'BUSINESS_TO_PARTICIPANT',
        text: `Hola ${name ? name.split(' ')[0] : ''}✦ ¡Bienvenido a SUTRA! Un asesor ritual está a tu servicio. ¿En qué podemos acompañarte hoy?`,
        createdAt: new Date().toISOString(),
      },
    ]);
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
    if (!text.trim() || isSending) return;
    setIsSending(true);

    const newMsg = {
      id: `msg-${Date.now()}`,
      direction: 'PARTICIPANT_TO_BUSINESS',
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);

    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', conversationId, text }),
      });
    } catch {
      // Fallback
    }

    // Smart assistant response
    setIsTyping(true);
    setTimeout(() => {
      let replyText = 'Gracias por escribirnos. Nuestro equipo de rituales SUTRA ha recibido tu consulta y te responderá en breve. También puedes escribirnos directo a nuestro WhatsApp si deseas atención inmediata.';
      const lower = text.toLowerCase();
      if (lower.includes('vela') || lower.includes('arena') || lower.includes('preparar')) {
        replyText = '✦ Para preparar tu vela: vierte la cera granulada en tu vasija favorita, coloca una de nuestras mechas de algodón puro dejando sobresalir 5mm, y enciende. ¡Se adapta a cualquier recipiente!';
      } else if (lower.includes('evento') || lower.includes('boda') || lower.includes('mayoreo') || lower.includes('empresa')) {
        replyText = '✦ ¡Excelente! Contamos con packs B2B con precios mayoristas escalonados para banqueteras, bodas, hoteles y eventos boutique. Visita nuestra sección de "Eventos" en el menú para calcular tus kilos.';
      } else if (lower.includes('aroma') || lower.includes('fragancia') || lower.includes('olor')) {
        replyText = '✦ Te recomendamos nuestro aroma Santal & Amber para meditación y calma, o White Tea & Bergamot para un ambiente fresco, luminoso y sofisticado.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          direction: 'BUSINESS_TO_PARTICIPANT',
          text: replyText,
          createdAt: new Date().toISOString(),
        },
      ]);
      setIsTyping(false);
      setIsSending(false);
    }, 1000);
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
            <div className="sutra-chat-status">Wix Inbox • En Línea</div>
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
                {loading ? 'Conectando...' : 'Iniciar Conversación'}
              </button>
            </form>
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
