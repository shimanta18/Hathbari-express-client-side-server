import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { CartProvider } from './pages/Features/context/CartContext'
import { AuthProvider } from './providers/AuthProvider'; // 🔑 Imported the new Auth provider
import { router } from './routes/router'

// 📌 Note on Leaflet CSS: 
// Do not leave the HTML <link> tag here out in the open, it will cause a syntax crash.
// Instead, you can import it directly via JavaScript like this if you installed it via npm:
// import 'leaflet/dist/leaflet.css';
// Otherwise, paste that <link> tag inside the <head> section of your public/index.html file!

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* 🔒 Added AuthProvider at the root level */}
      <CartProvider>
        <RouterProvider router={router}></RouterProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)