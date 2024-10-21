import { MsalAuthProvider, LoginType } from 'react-aad-msal';
import 'regenerator-runtime/runtime'; 
import env from '../../../config';
// Msal Configurations
// AAD integration
const config = {
  auth: {
    authority: `https://login.microsoftonline.com/1de61f46-fc12-4067-ab1d-147eb7e21025`,
    clientId:env.clientId,
    redirectUri:env.redirectUri,
    // clientId:'8279f071-c18e-470e-87fc-7f4c1cca6245',
    // redirectUri:"http://localhost:3000/",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true
  }
};

// Authentication Parameters
const authenticationParameters = {
  scopes: [
    'user.read', // Scope for reading user profile
    'https://storage.azure.com/user_impersonation' // Scope for accessing Azure Storage
  ]
}

// Options
const options = {
  loginType: LoginType.Redirect, // Using Redirect login type
  tokenRefreshUri: window.location.origin + '/auth.html' // Token refresh URI
}

export const authProvider = new MsalAuthProvider(config, authenticationParameters, options);
