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

const types = new Map([
  [1, 'Administrador'],
  [2, 'Secretario'],
  [3, 'Chofer'],
  [4, 'Temporal'],
]);

export const getters = {
  fullname(state) {
    return `${state.employee.nombre} ${state.employee.p_apellido} ${state.employee.s_apellido}`;
  },
  type(state) {
    return types.get(state.employee.tipo_empleado);
  },
  dniFormatted(state) {
    return (
      state.employee.cedula.slice(0, 1) +
      '-' +
      state.employee.cedula.slice(1, 4) +
      '-' +
      state.employee.cedula.slice(4, 8)
    );
  },
  getEmployees(state) {
    return state.employees.map(employee => {
      return {
        id: employee.id,
        nombre_completo: `${employee.nombre} ${employee.p_apellido} ${employee.s_apellido}`,
        fecha_contrato: employee.fecha_contrato,
        tipo_empleado: employee.tipo_empleado,
      };
    });
  },
  employeesForAutocomplete(state) {
    return state.employees.map(employee => {
      return {
        id: employee.id,
        nombre_completo: `${employee.nombre} ${employee.p_apellido} ${employee.s_apellido}`,
      };
    });
  },
};
