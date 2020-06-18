import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/v1',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default {
  async login(credentials) {
    return await api.post('/login', credentials);
  },
};
