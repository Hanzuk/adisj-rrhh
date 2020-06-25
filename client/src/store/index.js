import Vue from 'vue';
import Vuex from 'vuex';
import * as auth from '@/store/modules/auth.js';
import * as employees from '@/store/modules/employees.js';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    employees,
  },
});
