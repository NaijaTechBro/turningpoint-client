// import React, { createContext, useContext, useState, useEffect } from 'react';
// import API from '../services/api';

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Check if user is already logged in on page refresh
//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     const token = localStorage.getItem('token');
    
//     // Safely check for valid data before parsing
//     if (storedUser && storedUser !== 'undefined' && token) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (error) {
//         console.error("Corrupted local storage data. Clearing session.");
//         localStorage.removeItem('user');
//         localStorage.removeItem('token');
//       }
//     }
    
//     setLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     const response = await API.post('/auth/login', { email, password });
//     const { accessToken, data } = response.data;
    
//     localStorage.setItem('token', accessToken);
//     localStorage.setItem('user', JSON.stringify(data));
//     setUser(data);
    
//     return data;
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };


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