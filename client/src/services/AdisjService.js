import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/v1',
  withCredentials: true, //to true so the server can configure cookies
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
  async postPermit(data) {
    return await api.post('/permissions', data);
  },
  async getPermits() {
    return await api.get('/permissions');
  },
  async putPermit(permitId, data) {
    return await api.put(`/permissions/${permitId}/mark-as`, data);
  },
  async putPermitEmployee(permitId, data) {
    return await api.put(`/permissions/${permitId}`, data);
  },
  async deletePermit(permitId) {
    return await api.delete(`/permissions/${permitId}`);
  },
  async postOvertime(data) {
    return await api.post('/overtime', data);
  },
  async getOvertime() {
    return await api.get('/overtime');
  },
  async putOvertime(id, data) {
    return await api.put(`/overtime/admin/${id}`, data);
  },
  async putOvertimeEmployee(id, data) {
    return await api.put(`/overtime/${id}`, data);
  },
  async getDrivers() {
    return await api.get('/quality/drivers');
  },
  async postQuality(data) {
    return await api.post('/quality/vote', data);
  },
  async getRating() {
    return await api.get('/quality/rating');
  },
  async getUserRating(userId) {
    return await api.get(`/quality/rating/${userId}`);
  },
  async deleteVote(voteId) {
    return await api.delete(`/quality/${voteId}/delete-vote`);
  },
};
