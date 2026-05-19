"use client";

import { useState, useEffect } from 'react';

export default function FeedbackModal({ step, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const getFormUrl = (step) => {
    const baseUrl = "https://docs.google.com/forms/d/e/1FAIpQLScZkBRSet6za-NQ3ZT_Dp-RPfn3FCHMRvKkBscLwo9awDJTMQ/viewform";
    return `${baseUrl}?entry.1883987612=${step}&embedded=true`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 'min(480px, 92vw)',
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '24px 24px 16px 24px',
            borderBottom: '1px solid var(--border)',
            position: 'relative'
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: 'var(--muted)',
              padding: '4px',
              lineHeight: 1
            }}
          >
            ✕
          </button>
          <h3
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--text)',
              marginBottom: '4px'
            }}
          >
            Share your feedback
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: '14px',
              color: 'var(--muted)'
            }}
          >
            Takes 30 seconds · helps us improve
          </p>
        </div>
        
        <iframe
          src={getFormUrl(step)}
          width="100%"
          height="480"
          frameBorder="0"
          style={{
            border: 'none',
            display: 'block'
          }}
        >
          Loading...
        </iframe>

        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border)',
            textAlign: 'center'
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--dim)',
              fontSize: '14px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}