import Service from '@/services/AdisjService.js';

export const namespaced = true;

export const state = {
  token: null,
};

export const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
    localStorage.setItem('jwt', token);
    Service.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
  CLEAR_TOKEN() {
    localStorage.removeItem('jwt');
    location.reload();
  },
};

export const actions = {
  async login({ commit }, credentials) {
    const { data } = await Service.login(credentials);
    commit('SET_TOKEN', data.token);
  },
  logout({ commit }) {
    commit('CLEAR_TOKEN');
  },
};

export const getters = {
  loggedIn(state) {
    return !!state.token;
  },
};
