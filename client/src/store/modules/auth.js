import Service from '@/services/AdisjService.js';

export const namespaced = true;

export const state = {
  user: null,
};

export const mutations = {
  SET_USER(state, userData) {
    state.user = userData;
    localStorage.setItem('user', JSON.stringify(userData));
    Service.api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
  },
  CLEAR_USER() {
    localStorage.removeItem('user');
    location.reload();
  },
};

export const actions = {
  async login({ commit }, credentials) {
    const { data } = await Service.login(credentials);
    commit('SET_USER', data);
  },
  logout({ commit }) {
    commit('CLEAR_USER');
  },
};

export const getters = {
  userType(state) {
    return state.user.tipo_empleado;
  },
};
