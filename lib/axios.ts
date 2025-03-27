import Axios from 'axios';

// const API_BASE_URL = 'http://127.0.0.1:8000/api';

const axios = Axios.create({
    baseURL: "http://localhost:8000/api", 
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
  });

// axios.interceptors.request.use(config => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

export default axios;
