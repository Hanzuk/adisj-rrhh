import Vue from 'vue';
import VueRouter from 'vue-router';
import { decode } from 'jsonwebtoken';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: { name: 'dashboard' } },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Inicio de sesión | Adisj',
      requiresAuth: false,
      adminOnly: false,
    },
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/LoginUser.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: { title: 'Inicio | Adisj', requiresAuth: true, adminOnly: false },
    component: () =>
      import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
  },
  {
    path: '/nuevo-empleado',
    name: 'newEmployee',
    meta: {
      title: 'Nuevo empleado | Adisj',
      requiresAuth: true,
      adminOnly: true,
    },
    component: () =>
      import(/* webpackChunkName: "newEmployee" */ '../views/NewEmployee.vue'),
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('jwt');

  //Si la ruta require autorizacion y no esta logueado
  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    return next({ name: 'login' });
  }

  //Si la ruta no require autorizacion y esta logueado (Login)
  if (to.matched.some(record => !record.meta.requiresAuth) && loggedIn) {
    document.title = from.meta.title;
    return next({ name: 'dashboard' });
  }

  if (loggedIn) {
    const decoded = decode(loggedIn);

    if (
      decoded.tipo_empleado !== 1 &&
      to.matched.some(record => record.meta.adminOnly)
    ) {
      return next({ name: 'dashboard' });
    }
  }

  document.title = to.matched.find(record => record.meta.title).meta.title;
  return next();
});

export default router;
