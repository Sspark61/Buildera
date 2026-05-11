import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/space-grotesk/700.css'
import './index.css'
import Signup from './pages/Signup/Signup.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Signup />
  </StrictMode>,
)
