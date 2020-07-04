export default [
  {
    path: '/horas-extra/solicitar',
    name: 'overtime-create',
    meta: {
      title: 'Solicitar horas extra | Adisj',
      requiresAuth: true,
    },
    component: () => import(/* webpackChunkName: "overtime-create" */ '../views/overtime/OvertimeCreate.vue'),
  },
  {
    path: '/horas-extra',
    name: 'overtime',
    meta: {
      title: 'Horas extras | Adisj',
      requiresAuth: true,
    },
    component: () => import(/* webpackChunkName: "overtime" */ '../views/overtime/OvertimeList.vue'),
  },
];
