# Routes

## `/`

- Entry: `src/main.tsx`
- Page component: `src/App.tsx`
- Layout: embedded application shell in `src/App.tsx`
- Router: none; the Vite app renders one screen directly

The page is a financial-presentation generator. Users choose a company and contract type, enter customer and contract data, add improper fees, review calculated outcomes in a sticky summary, and download a generated HTML presentation.

## Root render configuration

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```
