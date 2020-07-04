import Service from '@/services/AdisjService.js';

export const namespaced = true;

export const state = {
  overtimeRequests: [],
};

export const mutations = {
  SET_OVERTIME(state, requests) {
    state.overtimeRequests = requests;
  },
  // REMOVE_PERMIT(state, permitId) {
  //   const index = state.overtimeRequests.findIndex(item => item.id === permitId);
  //   state.overtimeRequests.splice(index, 1);
  // },
  ACCEPT_OVERTIME(state, id) {
    const index = state.overtimeRequests.findIndex(item => item.id === id);
    state.overtimeRequests[index].id_estado = 2;
  },
  REJECT_OVERTIME(state, id) {
    const index = state.overtimeRequests.findIndex(item => item.id === id);
    state.overtimeRequests[index].id_estado = 3;
  },
  UPDATE_OVERTIME(state, { overtimeId, description, hours }) {
    const index = state.overtimeRequests.findIndex(item => item.id === overtimeId);
    state.overtimeRequests[index].id_estado = 1;
    state.overtimeRequests[index].descripcion = description;
    state.overtimeRequests[index].cantidad_horas = hours;
  },
};

export const actions = {
  async fetchOvertime({ commit }) {
    const { data } = await Service.getOvertime();
    commit('SET_OVERTIME', data);
  },
  // deletePermit({ commit }, id) {
  //   commit('REMOVE_PERMIT', id);
  // },
  acceptOvertime({ commit }, id) {
    commit('ACCEPT_OVERTIME', id);
  },
  rejectOvertime({ commit }, id) {
    commit('REJECT_OVERTIME', id);
  },
  updateOvertime({ commit }, data) {
    commit('UPDATE_OVERTIME', data);
  },
};

export const getters = {
  pendingOvertime(state) {
    return state.overtimeRequests.filter(request => request.id_estado === 1);
  },
  approvedOvertime(state) {
    return state.overtimeRequests.filter(request => request.id_estado === 2);
  },
  rejectedOvertime(state) {
    return state.overtimeRequests.filter(request => request.id_estado === 3);
  },
  getOvertime(state) {
    return id => state.overtimeRequests.find(overtime => overtime.id === id);
  },
};
