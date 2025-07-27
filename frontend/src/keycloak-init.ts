import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'master',
  clientId: 'streetleague-frontend-client'
});

export const initKeycloak = (onAuthenticatedCallback: () => void) => {
  console.log('Initializing Keycloak...');
  
  keycloak.init({ 
    onLoad: 'login-required', 
    checkLoginIframe: false,
    // Add these options for better token handling
    enableLogging: true,
    pkceMethod: 'S256'
  })
    .then((authenticated: boolean) => {
      console.log('Keycloak initialization result:', authenticated);
      if (authenticated) {
        console.log('Keycloak initialized successfully.');
        console.log('Token:', keycloak.token ? 'Available' : 'Not available');
        console.log('Refresh Token:', keycloak.refreshToken ? 'Available' : 'Not available');
        console.log('User information:', keycloak.tokenParsed);
        if (keycloak.tokenParsed) {
          console.log('User email:', keycloak.tokenParsed['email']);  // Debug email retrieval
        }
        onAuthenticatedCallback();
      } else {
        console.warn('Not authenticated');
      }
    })
    .catch((error: any) => {
      console.error('Failed to initialize Keycloak', error);
    });
};

export default keycloak;

