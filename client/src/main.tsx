import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

document.documentElement.setAttribute(
  'data-theme',
  localStorage.getItem('voxieverse_theme') || 'dark'
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
