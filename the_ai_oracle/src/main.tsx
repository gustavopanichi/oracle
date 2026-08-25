import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
/* Imported before App so the tokens and base styles land first in the
   stylesheet. The other way round, component CSS is injected first and any
   component rule that ties with a :root rule here — the mobile card-width
   override, for one — silently loses the cascade. */
import './styles/global.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
