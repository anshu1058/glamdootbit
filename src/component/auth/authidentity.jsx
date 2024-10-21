// authIdentity.js
import { authProvider } from "./AuthProvider";
const getAccessToken = async () => {
  const accounts = authProvider.getAllAccounts();
  
  if (accounts.length === 0) {
    throw new Error('No accounts found');
  }

  const request = {
    scopes: ['user.read', 'https://storage.azure.com/user_impersonation'],
    account: accounts[0] // use the first account in the array
  };

  const authResponse = await authProvider.acquireTokenSilent(request);
  return authResponse.accessToken;
};

const getUserProfile = async () => {
  const accessToken = await getAccessToken();

  const response = await fetch("https://graph.microsoft.com/v1.0/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  const userProfile = await response.json();
  return userProfile;
};

export const getUserDepartment = async () => {
  const userProfile = await getUserProfile();
  console.log("userProfile",userProfile)
  return userProfile.department; // Assuming the department is a property of the user profile
};
