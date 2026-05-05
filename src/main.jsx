import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            borderRadius: '16px',
            padding: '16px 20px',
            boxShadow: '0 20px 25px -5px rgba(0, 0,0, 0.1), 0 10px 10px -5px rgba(0, 0,0, 0.04)',
          },
          success: {
            iconTheme: {
              primary: '#ecfdf5',
              secondary: '#10b981',
            },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)

