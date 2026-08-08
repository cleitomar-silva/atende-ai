import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './context/AuthContext.jsx'
import { ToastProvider } from './components/ToastProvider.jsx'
import { ConfirmProvider } from './components/ConfirmProvider.jsx'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <ConfirmProvider>
          <App />
        </ConfirmProvider>
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>
)