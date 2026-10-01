import React, { useState } from 'react';
import { WixChatWidget } from './chat/WixChatWidget';
import './FloatingActions.css';

export default function FloatingActions() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="sutra-floating-actions">
      {/* Wix Chat Widget Dialog */}
      <WixChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/5215500000000?text=Hola%20Sutra,%20quisiera%20asesor%C3%ADa%20sobre%20sus%20rituales%20y%20velas"
        target="_blank"
        rel="noopener noreferrer"
        className="sutra-float-btn sutra-float-whatsapp"
        aria-label="Contactar por WhatsApp"
      >
        <span className="sutra-float-tooltip">WhatsApp Directo</span>
        <svg viewBox="0 0 24 24">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.82-.37-4.06-1.07l-.29-.17-3.02.79.81-2.94-.19-.3a8.21 8.21 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.24-8.24m4.52 11.63c-.25-.13-1.47-.72-1.7-.81-.23-.08-.4-.13-.57.13-.17.25-.66.81-.81.98-.15.17-.3.19-.55.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.49-1.4-1.74-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.44-.06-.13-.57-1.37-.78-1.87-.2-.49-.41-.42-.57-.43l-.48-.01c-.17 0-.44.06-.67.32-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.31 3.8 2.53 1.09 2.53.73 2.99.69.46-.04 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.28z"/>
        </svg>
      </a>

      {/* Wix Inbox Chat Floating Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="sutra-float-btn sutra-float-chat"
        aria-label="Abrir Chat Wix Inbox"
      >
        <span className="sutra-float-tooltip">Chat SUTRA (Wix Inbox)</span>
        <span className="sutra-float-ping" />
        {isChatOpen ? (
          <span style={{ fontSize: '1.2rem', color: '#D4A76A' }}>✕</span>
        ) : (
          <svg viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.634-.823A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.614 0-3.123-.457-4.407-1.246l-.316-.194-2.73.486.5-2.658-.204-.328A7.95 7.95 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
            <circle cx="8" cy="12" r="1.2" />
            <circle cx="12" cy="12" r="1.2" />
            <circle cx="16" cy="12" r="1.2" />
          </svg>
        )}
      </button>
    </div>
  );
}
