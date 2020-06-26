import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import './vee-validate';
import { decode } from 'jsonwebtoken';

Vue.use(Buefy);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  created() {
    const token = localStorage.getItem('jwt');
    if (token) {
      const decoded = decode(token);
      //https://github.com/auth0/node-jsonwebtoken#token-expiration-exp-claim
      if (Math.floor(Date.now() / 1000) > decoded.exp) {
        return this.$store.commit('auth/CLEAR_TOKEN');
      }
      this.$store.commit('auth/SET_TOKEN', token);
    }
  },
  render: h => h(App),
}).$mount('#app');
