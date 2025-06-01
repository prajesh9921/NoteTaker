import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react'

createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain="dev-nl8vn7qaqcjyut82.us.auth0.com"
    clientId="ajMfI9OxEsaeOyoRbdAnMCQL5s6Tw03F"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
  </Auth0Provider>
); 