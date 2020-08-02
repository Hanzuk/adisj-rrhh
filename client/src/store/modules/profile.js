import Service from '@/services/AdisjService.js';

export const namespaced = true;

export const state = {
  profile: {},
};

export const mutations = {
  SET_PROFILE(state, profile) {
    state.profile = profile;
  },
};

export const actions = {
  async fetchProfile({ commit }) {
    const { data } = await Service.profile();
    commit('SET_PROFILE', data);
  },
};

export const getters = {};
