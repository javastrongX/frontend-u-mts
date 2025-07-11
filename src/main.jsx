import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from './theme/index.js'
import './i18n';
import { AuthProvider } from './Pages/Auth/logic/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider theme = { theme }>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ChakraProvider>
  </StrictMode>,
)
