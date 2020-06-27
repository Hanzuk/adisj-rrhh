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
  api,
  async login(credentials) {
    return await api.post('/login', credentials);
  },
  async getEmployees() {
    return await api.get('/users');
  },
  async getEmployee(userId) {
    return await api.get(`/users/${userId}`);
  },
  async getAddressCatalogue() {
    return await api.get(`/users/catalogues/address`);
  },
  async postPermanent(data) {
    return await api.post(`/users`, data);
  },
  async postTemporary(data) {
    return await api.post(`/users/temporary`, data);
  },
  async deleteEmployee(userId, data) {
    return await api.delete(`/users/${userId}`, { data });
  },
};
