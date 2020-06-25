import Service from '@/services/AdisjService.js';

export const namespaced = true;

export const state = {
  employees: [],
  employee: {},
  addressCatalogue: {},
};

export const mutations = {
  SET_EMPLOYEES(state, employees) {
    state.employees = employees;
  },
  SET_EMPLOYEE(state, employee) {
    state.employee = employee;
  },
  SET_ADDRESS_CATALOGUE(state, catalogue) {
    state.addressCatalogue = catalogue;
  },
};

export const actions = {
  async fetchEmployees({ commit }) {
    const { data } = await Service.getEmployees();
    commit('SET_EMPLOYEES', data);
  },
  async fetchEmployee({ commit }, userId) {
    const { data } = await Service.getEmployee(userId);
    commit('SET_EMPLOYEE', data);
  },
  async fetchAddressCatalogue({ commit }) {
    const { data } = await Service.getAddressCatalogue();
    commit('SET_ADDRESS_CATALOGUE', data);
  },
};

export const getters = {
  fullname(state) {
    return `${state.employee.nombre} ${state.employee.p_apellido} ${state.employee.s_apellido}`;
  },
};
