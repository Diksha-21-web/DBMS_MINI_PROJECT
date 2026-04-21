import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Point to the backend server
});

export default api;
