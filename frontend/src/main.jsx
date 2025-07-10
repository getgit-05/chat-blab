import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
import { ProtectProvider } from './store/authStoree.jsx'
import {FollowerProvider} from "./store/followerStore.jsx"
import { MessageProvider } from './store/chatStore.jsx'
import { ThemeProvider } from './store/themeStore.jsx'
createRoot(document.getElementById('root')).render(

  
    <BrowserRouter>
    <ProtectProvider>
      <MessageProvider>
    <FollowerProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
    </FollowerProvider>
    </MessageProvider>
    </ProtectProvider>
    </BrowserRouter>
  
)
