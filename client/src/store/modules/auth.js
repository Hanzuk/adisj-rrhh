import AuthService from '@/services/AuthService.js';

export const namespaced = true;

export const state = {
  token: null,
};

export const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
    localStorage.setItem('jwt', token);
  },
  CLEAR_TOKEN() {
    localStorage.removeItem('jwt');
    location.reload();
  },
};

export const actions = {
  async login({ commit }, credentials) {
    const { data } = await AuthService.login(credentials);
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
