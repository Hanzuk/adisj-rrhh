import Vue from 'vue';
import Vuex from 'vuex';
import * as auth from '@/store/modules/auth.js';
import * as employees from '@/store/modules/employees.js';
import * as permits from '@/store/modules/permits.js';
import * as overtime from '@/store/modules/overtime.js';
import * as quality from '@/store/modules/quality.js';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    employees,
    permits,
    overtime,
    quality,
  },
});
