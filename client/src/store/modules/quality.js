import Service from '@/services/AdisjService.js';

export const namespaced = true;

export const state = {
  rating: [],
  userRating: [],
};

export const mutations = {
  SET_RATING(state, data) {
    state.rating = data;
  },
  SET_USER_RATING(state, data) {
    state.userRating = data;
  },
};

export const actions = {
  async fetchRating({ commit }) {
    const { data } = await Service.getRating();
    commit('SET_RATING', data);
  },
  async fetchUserRating({ commit }, userId) {
    const { data } = await Service.getUserRating(userId);
    commit('SET_USER_RATING', data);
  },
};

export const getters = {};
