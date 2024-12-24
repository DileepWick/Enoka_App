// src/components/SessionPrompt.jsx
import React from 'react';

const SessionPrompt = ({ onExtend, onLogout }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        backgroundColor: '#fff',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
      }}
    >
      <h3>Session Expiring</h3>
      <p>Your session is about to expire. Would you like to extend it?</p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={onExtend}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Extend Session
        </button>
        <button
          onClick={onLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f44336',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default SessionPrompt;
