import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import '@fortawesome/fontawesome-free/css/all.min.css'
import './styles/fonts.css'
import './styles/tokens.css'
import './styles/global.css'
import './i18n'
import { routes } from './routes'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={createBrowserRouter(routes)} />
  </StrictMode>,
)
