import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { StoreProvider } from './store/StoreProvider.jsx'
import { initPwa } from './lib/pwa.js'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>
)

// Registrace service workeru + sledování aktualizací (v produkčním buildu).
initPwa()
