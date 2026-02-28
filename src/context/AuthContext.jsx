import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session on refresh by calling the "getMe" endpoint
  useEffect(() => {
    const checkSession = async () => {
      try {
        // This request will automatically carry the HttpOnly cookie
        const { data } = await API.get('/auth/me');
        setUser(data); // data contains { id, firstName, role, etc. }
      } catch (err) {
        // If 401/404, the user isn't logged in. No need to clear LocalStorage.
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email, password) => {
    // The backend's sendTokenResponse handles setting the cookies
    const response = await API.post('/auth/login', { email, password });
    
    // In your backend, the user object is inside "response.data.user"
    const userData = response.data.user;
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout'); // Tell backend to clear cookies
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};