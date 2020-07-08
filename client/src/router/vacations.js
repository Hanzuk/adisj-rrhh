export default [
  {
    path: '/nueva-solicitud-vacaiones',
    name: 'new-vacation',
    meta: {
      title: 'Solicitud de vacaciones | Adisj',
      requiresAuth: true,
    },
    component: () => import(/* webpackChunkName: "new-vacation" */ '../views/vacations/VacationCreate.vue'),
  },
  {
    path: '/vacaciones-solicitadas',
    name: 'vacations',
    meta: {
      title: 'Vacaciones solicitadas | Adisj',
      requiresAuth: true,
      adminOnly: true,
    },
    component: () => import(/* webpackChunkName: "vacations" */ '../views/vacations/VacationsList.vue'),
  },
];
