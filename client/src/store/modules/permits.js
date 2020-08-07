import Service from '@/services/AdisjService.js';

export const namespaced = true;

export const state = {
  permits: [],
};

export const mutations = {
  SET_PERMITS(state, permits) {
    state.permits = permits;
  },
  REMOVE_PERMIT(state, permitId) {
    const index = state.permits.findIndex(item => item.id === permitId);
    state.permits.splice(index, 1);
  },
  ACCEPT_PERMIT(state, permitId) {
    const index = state.permits.findIndex(item => item.id === permitId);
    state.permits[index].id_estado = 2;
  },
  REJECT_PERMIT(state, permitId) {
    const index = state.permits.findIndex(item => item.id === permitId);
    state.permits[index].id_estado = 3;
  },
  UPDATE_PERMIT(state, { permitId, title, description, outDate, hours }) {
    const index = state.permits.findIndex(item => item.id === permitId);
    state.permits[index].id_estado = 1;
    state.permits[index].titulo = title;
    state.permits[index].descripcion = description;
    state.permits[index].fecha_salida = outDate;
    state.permits[index].horas = hours;
  },
};

export const actions = {
  async fetchPermits({ commit }) {
    const { data } = await Service.getPermits();
    commit('SET_PERMITS', data);
  },
  deletePermit({ commit }, permitId) {
    commit('REMOVE_PERMIT', permitId);
  },
  acceptPermit({ commit }, permitId) {
    commit('ACCEPT_PERMIT', permitId);
  },
  rejectPermit({ commit }, permitId) {
    commit('REJECT_PERMIT', permitId);
  },
  updatePermit({ commit }, permitData) {
    commit('UPDATE_PERMIT', permitData);
  },
};

export const getters = {
  pendingPermits(state) {
    return state.permits.filter(permit => permit.id_estado === 1).reverse();
  },
  approvedPermits(state) {
    return state.permits.filter(permit => permit.id_estado === 2).reverse();
  },
  rejectedPermits(state) {
    return state.permits.filter(permit => permit.id_estado === 3).reverse();
  },
  getPermit(state) {
    return id => state.permits.find(permit => permit.id === id);
  },
};
