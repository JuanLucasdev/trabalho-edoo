import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HospitalProvider } from './context/HospitalContext';
import './css/sidebar.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HospitalProvider>
      <App />
    </HospitalProvider>
  </React.StrictMode>
);
