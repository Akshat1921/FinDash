// Auth utility functions
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const isTokenValid = (token: string): boolean => {
  if (!token) return false;
  
  try {
    // Check if token has 3 parts (JWT format)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Token does not have 3 parts:', parts.length);
      return false;
    }
    
    // Try to decode the payload (middle part)
    const payload = JSON.parse(atob(parts[1]));
    console.log('JWT Payload:', payload);
    
    // Check if token is expired
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      console.error('Token is expired');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Invalid token format:', error);
    return false;
  }
};

export const clearAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

export const debugToken = (): void => {
  const token = getAuthToken();
  console.log('=== JWT DEBUG INFO ===');
  console.log('Token exists:', !!token);
  if (token) {
    console.log('Token length:', token.length);
    console.log('Token starts with:', token.substring(0, 20) + '...');
    console.log('Token is valid:', isTokenValid(token));
  }
  console.log('======================');
};
