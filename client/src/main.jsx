import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider.jsx'
import { DesignProvider } from './context/DesignProvider.jsx'
import UiMotionProvider from './components/motion/UiMotionProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DesignProvider>
          <UiMotionProvider>
            <App />
          </UiMotionProvider>
        </DesignProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
