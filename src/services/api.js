// import axios from 'axios';

// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
// });

// // Automatically attach the JWT token to every request
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });

// export default API;

import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // MANDATORY: This allows cookies to be sent/received
});

// We remove the request interceptor because the browser 
// attaches HttpOnly cookies automatically.

export default API;