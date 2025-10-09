
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
// === Enregistrement du Service Worker ===
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        console.log('✅ Service Worker enregistré avec succès:', registration.scope);
      })
      .catch(error => {
        console.log('❌ Échec de l’enregistrement du Service Worker:', error);
      });
  });
}
