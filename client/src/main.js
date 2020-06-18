import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Vuelidate from 'vuelidate';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';

Vue.use(Vuelidate);
Vue.use(Buefy);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  created() {
    const token = localStorage.getItem('jwt');
    if (token) this.$store.commit('auth/SET_TOKEN', token);
  },
  render: h => h(App),
}).$mount('#app');
